/**
 * OpenRouter Service — calls OpenRouter's /chat/completions endpoint
 * with the configured Gemma 4 model to analyze medical report text.
 * Supports English & Roman Urdu, single reports & comparison mode,
 * and educational related medication information.
 *
 * PRD §43, §48, §90
 */

const fetch = require('node-fetch');
const config = require('../config/config');
const logger = require('../utils/logger');
const { buildSystemPrompt } = require('../prompts/systemPrompt');

/**
 * Expected JSON response schema from the AI model.
 * Used for validation (see responseValidator.js).
 */
const RESPONSE_SCHEMA = {
  reportTitle: 'string',
  reportDate: 'string',
  overallSummary: 'string',
  comparisonSummary: 'string',
  importantFindings: [
    { id: 'string', finding: 'string', severity: 'string', iconType: 'string' },
  ],
  detectedTests: [
    {
      id: 'string',
      testName: 'string',
      result: 'string',
      beforeResult: 'string',
      referenceRange: 'string',
      unit: 'string',
      status: 'string',
      trend: 'string',
      category: 'string',
    },
  ],
  medicalExplanations: [
    {
      id: 'string',
      testName: 'string',
      purpose: 'string',
      plainLanguageExplanation: 'string',
      educationalContext: 'string',
    },
  ],
  relatedMedications: [
    {
      id: 'string',
      category: 'string',
      medicationClass: 'string',
      purpose: 'string',
      disclaimer: 'string',
    },
  ],
  doctorQuestions: ['string'],
  lifestyleGuidance: ['string'],
};

/**
 * Build the analysis prompt for a single or comparison report.
 *
 * @param {string} reportText - Current report text (after medicine)
 * @param {string} fileName - Current file name
 * @param {Object} options - { language, isComparison, previousReportText, previousFileName }
 * @returns {string} Prompt to send to the AI
 */
function buildAnalysisPrompt(reportText, fileName, options = {}) {
  const { isComparison, previousReportText, previousFileName } = options;

  if (isComparison && previousReportText) {
    return `Analyze and compare these two medical lab reports thoroughly. Include educational relatedMedications if applicable.
    
REPORT 1 (INITIAL / BEFORE MEDICINE):
File Name: ${previousFileName || 'Before_Medicine_Report.txt'}
Content:
${previousReportText}

REPORT 2 (FOLLOW-UP / AFTER MEDICINE):
File Name: ${fileName || 'After_Medicine_Report.txt'}
Content:
${reportText}

Return valid JSON with detectedTests comparing Before vs After values, assigning a trend ('improved', 'stable', or 'worsened') to each test item, relatedMedications, and a comparisonSummary evaluating treatment efficacy. Respond ONLY with valid JSON. Do not include markdown code block syntax.`;
  }

  return `Analyze this medical report thoroughly and return valid JSON matching the schema (including relatedMedications for educational context):
Report Title / File Name: ${fileName || 'Uploaded Medical Report'}

Raw Report Text:
${reportText || 'Medical report content'}

Respond ONLY with valid JSON. Do not include markdown code block syntax.`;
}

/**
 * Analyze a medical report using OpenRouter API.
 *
 * @param {string} reportText - Cleaned extracted text from current report
 * @param {string} fileName - Original uploaded file name
 * @param {Object} options - { language: 'en'|'ur-roman', isComparison: boolean, previousReportText: string, previousFileName: string }
 * @returns {Promise<Object>} Parsed analysis result
 */
async function analyzeReport(reportText, fileName, options = {}) {
  const language = options.language || 'en';
  const isComparison = Boolean(options.isComparison && options.previousReportText);

  if (!config.openrouter.apiKey) {
    const err = new Error('OPENROUTER_API_KEY is not configured');
    err.code = 'AI_NOT_CONFIGURED';
    err.statusCode = 503;
    throw err;
  }

  const promptText = buildAnalysisPrompt(reportText, fileName, options);
  const systemPrompt = buildSystemPrompt(language, isComparison);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.openrouter.timeoutMs);

  try {
    logger.info('Calling OpenRouter API', {
      model: config.openrouter.model,
      language,
      isComparison,
      reportLength: reportText.length,
    });

    const response = await fetch(`${config.openrouter.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.openrouter.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': config.openrouter.siteUrl,
        'X-Title': config.openrouter.siteName,
      },
      body: JSON.stringify({
        model: config.openrouter.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: promptText },
        ],
        response_format: { type: 'json_object' },
        max_tokens: 4096,
        temperature: 0.3,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errorBody = await response.text();
      logger.error('OpenRouter API error', {
        status: response.status,
        body: errorBody.substring(0, 500),
      });
      const err = new Error(`OpenRouter API error: ${response.status}`);
      err.code = 'AI_API_ERROR';
      err.statusCode = 502;
      throw err;
    }

    const data = await response.json();
    const rawContent = data?.choices?.[0]?.message?.content || '{}';

    const cleanJson = rawContent
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    const parsed = JSON.parse(cleanJson);

    logger.info('OpenRouter analysis completed', {
      model: config.openrouter.model,
      language,
      isComparison,
      reportTitle: parsed.reportTitle,
      testsFound: parsed.detectedTests?.length || 0,
    });

    return {
      ...parsed,
      language,
      isComparison,
      rawExtractedText: reportText,
      analyzedAt: new Date().toISOString(),
      modelUsed: `OpenRouter (${config.openrouter.model})`,
    };
  } catch (err) {
    clearTimeout(timeout);

    if (err.name === 'AbortError') {
      const e = new Error('OpenRouter API request timed out');
      e.code = 'AI_TIMEOUT';
      e.statusCode = 504;
      throw e;
    }

    if (err.code) throw err;

    logger.error('OpenRouter request failed', { message: err.message });
    const e = new Error('Failed to communicate with AI provider');
    e.code = 'AI_COMMUNICATION_ERROR';
    e.statusCode = 502;
    throw e;
  }
}

module.exports = { analyzeReport, RESPONSE_SCHEMA };