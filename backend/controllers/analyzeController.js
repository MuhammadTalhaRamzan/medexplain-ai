/**
 * Analyze Controller — orchestrates the full pipeline:
 * upload (single/dual) → extract (OCR/PDF) → clean → AI analyze → validate → respond
 *
 * Supports language selection ('en' | 'ur-roman') and Before/After medicine comparison.
 *
 * PRD §41, §42, §45
 */

const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger');
const ocrService = require('../services/ocrService');
const pdfService = require('../services/pdfService');
const textCleaner = require('../services/textCleaner');
const openRouterService = require('../services/openRouterService');
const responseValidator = require('../services/responseValidator');
const { deleteFile } = require('../utils/fileCleaner');

/**
 * Helper to extract text from a single uploaded file object
 */
async function extractFileText(fileObj) {
  if (!fileObj) return '';
  const filePath = fileObj.path;
  const ext = path.extname(fileObj.originalname).toLowerCase();

  if (ext === '.pdf') {
    const res = await pdfService.extractText(filePath);
    return res.text;
  } else if (['.png', '.jpg', '.jpeg'].includes(ext)) {
    const res = await ocrService.extractText(filePath);
    return res.text;
  } else {
    return fs.readFileSync(filePath, 'utf-8');
  }
}

/**
 * POST /analyze
 */
async function analyzeReport(req, res) {
  // Support upload.fields (req.files) or upload.single (req.file)
  const currentFile = req.files?.file?.[0] || req.file;
  const previousFile = req.files?.previousFile?.[0];

  const {
    text: rawTextInput,
    previousText: rawPreviousTextInput,
    fileName: customFileName,
    previousFileName: customPreviousFileName,
    language = 'en',
    isComparison: isComparisonFlag,
  } = req.body;

  const currentFilePath = currentFile ? currentFile.path : null;
  const previousFilePath = previousFile ? previousFile.path : null;

  const originalName = currentFile
    ? currentFile.originalname
    : customFileName || 'After_Medicine_Report.txt';
  const originalPreviousName = previousFile
    ? previousFile.originalname
    : customPreviousFileName || 'Before_Medicine_Report.txt';

  try {
    let extractedText = '';
    let extractedPreviousText = '';

    // Step 1: Extract text for current report
    if (currentFile) {
      extractedText = await extractFileText(currentFile);
    } else if (rawTextInput) {
      extractedText = rawTextInput;
    }

    // Step 2: Extract text for previous report (if comparison mode)
    if (previousFile) {
      extractedPreviousText = await extractFileText(previousFile);
    } else if (rawPreviousTextInput) {
      extractedPreviousText = rawPreviousTextInput;
    }

    if (!extractedText || extractedText.trim().length === 0) {
      if (currentFilePath) deleteFile(currentFilePath);
      if (previousFilePath) deleteFile(previousFilePath);

      return res.status(400).json({
        success: false,
        error: {
          code: 'NO_INPUT',
          message: 'Please provide a file or paste report text.',
        },
      });
    }

    // Step 3: Clean text
    const cleanedText = textCleaner.clean(extractedText);
    const cleanedPreviousText = extractedPreviousText ? textCleaner.clean(extractedPreviousText) : '';

    if (!cleanedText || cleanedText.length < 3) {
      if (currentFilePath) deleteFile(currentFilePath);
      if (previousFilePath) deleteFile(previousFilePath);

      return res.status(422).json({
        success: false,
        error: {
          code: 'UNREADABLE_REPORT',
          message: 'We could not read any text from this file. Please try a clearer image or PDF.',
        },
      });
    }

    const isComparisonMode = Boolean(
      isComparisonFlag === 'true' || isComparisonFlag === true || (cleanedPreviousText && cleanedPreviousText.length >= 10)
    );

    // Step 4: AI Analysis via OpenRouter
    let analysisResult;
    try {
      analysisResult = await openRouterService.analyzeReport(cleanedText, originalName, {
        language,
        isComparison: isComparisonMode,
        previousReportText: cleanedPreviousText,
        previousFileName: originalPreviousName,
      });
    } catch (aiErr) {
      logger.warn('AI analysis failed, using fallback parser', {
        code: aiErr.code,
        message: aiErr.message,
        language,
      });

      analysisResult = responseValidator.buildFallbackResponse(
        cleanedText,
        'AI analysis was unavailable.',
        language
      );
      analysisResult.isComparison = isComparisonMode;
      analysisResult.language = language;
    }

    // Step 5: Validate and format
    analysisResult.language = language;
    analysisResult.isComparison = isComparisonMode;
    const validatedResult = responseValidator.validateAndFormat(analysisResult, cleanedText);

    // Step 6: File cleanup
    if (currentFilePath) deleteFile(currentFilePath);
    if (previousFilePath) deleteFile(previousFilePath);

    logger.info('Analysis completed successfully', {
      fileName: originalName,
      language,
      isComparison: isComparisonMode,
      testsFound: validatedResult.detectedTests?.length || 0,
    });

    res.status(200).json({
      success: true,
      data: validatedResult,
    });
  } catch (err) {
    if (currentFilePath) deleteFile(currentFilePath);
    if (previousFilePath) deleteFile(previousFilePath);

    logger.error('Analysis pipeline failed', {
      fileName: originalName,
      message: err.message,
      code: err.code,
    });

    const errorMap = {
      OCR_TIMEOUT: { status: 504, code: 'OCR_TIMEOUT', message: 'Text extraction timed out. Please try a smaller or clearer file.' },
      OCR_FAILED: { status: 422, code: 'OCR_FAILED', message: 'Could not read text from the image. Please try a clearer scan.' },
      OCR_SPAWN_ERROR: { status: 500, code: 'OCR_SERVICE_ERROR', message: 'OCR service is unavailable. Please try again later.' },
      PDF_ENCRYPTED: { status: 422, code: 'PDF_ENCRYPTED', message: 'This PDF is encrypted and cannot be read.' },
      PDF_CORRUPTED: { status: 422, code: 'PDF_CORRUPTED', message: 'This PDF file appears to be corrupted.' },
      PDF_PARSE_ERROR: { status: 422, code: 'PDF_PARSE_ERROR', message: 'Could not read text from this PDF.' },
      AI_NOT_CONFIGURED: { status: 503, code: 'AI_NOT_CONFIGURED', message: 'AI analysis is not configured. Please set up an API key.' },
      AI_TIMEOUT: { status: 504, code: 'AI_TIMEOUT', message: 'AI analysis timed out. Please try again.' },
      AI_API_ERROR: { status: 502, code: 'AI_API_ERROR', message: 'AI service returned an error. Please try again later.' },
    };

    const mapped = errorMap[err.code] || {
      status: 500,
      code: 'ANALYSIS_FAILED',
      message: 'An unexpected error occurred during analysis.',
    };

    res.status(mapped.status).json({
      success: false,
      error: { code: mapped.code, message: mapped.message },
    });
  }
}

module.exports = { analyzeReport };