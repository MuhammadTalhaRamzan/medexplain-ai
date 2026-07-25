/**
 * Analyze Controller — orchestrates the full pipeline:
 * upload → extract (OCR/PDF) → clean → AI analyze → validate → respond
 *
 * PRD §41, §42, §45
 */

const path = require('path');
const config = require('../config/config');
const logger = require('../utils/logger');
const ocrService = require('../services/ocrService');
const pdfService = require('../services/pdfService');
const textCleaner = require('../services/textCleaner');
const openRouterService = require('../services/openRouterService');
const responseValidator = require('../services/responseValidator');
const { deleteFile } = require('../utils/fileCleaner');

/**
 * POST /analyze
 *
 * Accepts an uploaded file (PDF, PNG, JPG) or raw text, extracts text
 * via OCR/PDF parsing, cleans it, sends to OpenRouter for analysis,
 * validates the response, and returns the result.
 */
async function analyzeReport(req, res, next) {
  const uploadedFile = req.file;
  const { text: rawTextInput, fileName: customFileName } = req.body;
  const filePath = uploadedFile ? uploadedFile.path : null;
  const originalName = uploadedFile
    ? uploadedFile.originalname
    : customFileName || 'Pasted_Report.txt';

  try {
    let extractedText = '';

    // Step 1: Extract text from file or use provided text
    if (uploadedFile) {
      const ext = path.extname(uploadedFile.originalname).toLowerCase();

      if (ext === '.pdf') {
        // PDF extraction
        logger.info('Extracting text from PDF', { file: originalName });
        const result = await pdfService.extractText(filePath);
        extractedText = result.text;
      } else if (['.png', '.jpg', '.jpeg'].includes(ext)) {
        // OCR extraction
        logger.info('Extracting text via OCR', { file: originalName });
        const result = await ocrService.extractText(filePath);
        extractedText = result.text;
      } else {
        // Text file — read directly
        const fs = require('fs');
        extractedText = fs.readFileSync(filePath, 'utf-8');
      }
    } else if (rawTextInput) {
      extractedText = rawTextInput;
    } else {
      return res.status(400).json({
        success: false,
        error: {
          code: 'NO_INPUT',
          message: 'Please provide a file or paste report text.',
        },
      });
    }

    // Step 2: Clean the extracted text
    const cleanedText = textCleaner.clean(extractedText);

    if (!cleanedText || cleanedText.length < 10) {
      // Clean up the temp file
      if (filePath) deleteFile(filePath);

      return res.status(422).json({
        success: false,
        error: {
          code: 'UNREADABLE_REPORT',
          message:
            'We could not read any text from this file. Please try a clearer image or PDF.',
        },
      });
    }

    // Step 3: Analyze with OpenRouter
    let analysisResult;
    try {
      analysisResult = await openRouterService.analyzeReport(
        cleanedText,
        originalName
      );
    } catch (aiErr) {
      logger.warn('AI analysis failed, using fallback', {
        code: aiErr.code,
        message: aiErr.message,
      });

      // Use fallback response
      analysisResult = responseValidator.buildFallbackResponse(
        cleanedText,
        'AI analysis was unavailable.'
      );
    }

    // Step 4: Validate and format the response
    const validatedResult = responseValidator.validateAndFormat(
      analysisResult,
      cleanedText
    );

    // Step 5: Clean up the temp file
    if (filePath) deleteFile(filePath);

    logger.info('Analysis completed successfully', {
      fileName: originalName,
      testsFound: validatedResult.detectedTests?.length || 0,
    });

    res.status(200).json({
      success: true,
      data: validatedResult,
    });
  } catch (err) {
    // Clean up temp file on error
    if (filePath) deleteFile(filePath);

    logger.error('Analysis pipeline failed', {
      fileName: originalName,
      message: err.message,
      code: err.code,
    });

    // Map known error codes to standard responses
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