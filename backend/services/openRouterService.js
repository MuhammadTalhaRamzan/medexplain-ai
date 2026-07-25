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

  const jsonSchema = `{
  "reportTitle": "string (title of the medical report)",
  "reportDate": "string (date if available, otherwise today's date)",
  "overallSummary": "string (2-3 sentences summarizing the report findings in plain language, include medical disclaimer)",
  "comparisonSummary": "string (only for comparison mode: how medicine/treatment impacted results)",
  "importantFindings": [
    {
      "id": "string (f1, f2, etc)",
      "finding": "string (one key finding)",
      "severity": "info|warning|alert|success",
      "iconType": "check|alert|heart|hospital|info"
    }
  ],
  "detectedTests": [
    {
      "id": "string (t1, t2, etc)",
      "testName": "string (name of lab test)",
      "result": "string (the value from the report)",
      "beforeResult": "string (only for comparison mode: value from initial report)",
      "referenceRange": "string (range from report or 'Not specified in report')",
      "unit": "string (measurement unit)",
      "status": "normal|borderline|abnormal",
      "trend": "improved|stable|worsened (only for comparison mode)",
      "category": "string (e.g., Hematology, Metabolic Panel)"
    }
  ],
  "medicalExplanations": [
    {
      "id": "string (e1, e2, etc)",
      "testName": "string (name of test)",
      "purpose": "string (what this test measures)",
      "plainLanguageExplanation": "string (explanation a patient can understand)",
      "educationalContext": "string (relevant clinical context)"
    }
  ],
  "relatedMedications": [
    {
      "id": "string (m1, m2, etc)",
      "category": "string (e.g., Blood Pressure Management)",
      "medicationClass": "string (e.g., ACE Inhibitors)",
      "purpose": "string (why this class is used)",
      "disclaimer": "string (emphasize doctor consultation required)"
    }
  ],
  "doctorQuestions": [
    "string (question 1 for doctor)",
    "string (question 2 for doctor)",
    "string (question 3 for doctor)"
  ],
  "lifestyleGuidance": [
    "string (wellness guidance 1)",
    "string (wellness guidance 2)",
    "string (wellness guidance 3)",
    "string (wellness guidance 4)",
    "string (wellness guidance 5)"
  ]
}`;

  if (isComparison && previousReportText) {
    return `You MUST return valid JSON with ALL required fields filled. No fields can be null, undefined, or missing.

Analyze and compare these two medical lab reports thoroughly:
    
REPORT 1 (INITIAL / BEFORE MEDICINE):
File Name: ${previousFileName || 'Before_Medicine_Report.txt'}
Content:
${previousReportText}

REPORT 2 (FOLLOW-UP / AFTER MEDICINE):
File Name: ${fileName || 'After_Medicine_Report.txt'}
Content:
${reportText}

REQUIRED JSON SCHEMA (use as template, fill ALL fields):
${jsonSchema}

INSTRUCTIONS:
1. Fill detectedTests with beforeResult and trend fields for comparison
2. Include comparisonSummary showing how treatment impacted results
3. Provide all 5 arrays (importantFindings, detectedTests, medicalExplanations, relatedMedications, doctorQuestions, lifestyleGuidance) - NONE can be empty
4. Respond ONLY with valid JSON. No markdown, no code blocks, no explanations.`;
  }

  return `You MUST return valid JSON with ALL required fields filled. No fields can be null, undefined, or missing.

Analyze this medical report thoroughly:

Report Title / File Name: ${fileName || 'Uploaded Medical Report'}

Raw Report Text:
${reportText || 'Medical report content'}

REQUIRED JSON SCHEMA (use as template, fill ALL fields):
${jsonSchema}

INSTRUCTIONS:
1. Extract all test items with accurate results and reference ranges
2. Categorize test statuses as normal, borderline, or abnormal based on reference ranges
3. Provide plain-language explanations for each test
4. Identify related medication classes if there are abnormal/borderline results
5. Provide thoughtful doctor questions and lifestyle guidance
6. Include ALL required fields - no field can be null, undefined, or empty
7. Respond ONLY with valid JSON. No markdown, no code blocks, no explanations.`;
}

/**
 * Analyze a medical report using OpenRouter API with automatic fallback to alternative models.
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

  // Build list of models to try: primary model first, then fallbacks
  const modelsToTry = [
    config.openrouter.model,
    ...(config.openrouter.fallbackModels || []).filter(m => m !== config.openrouter.model)
  ];

  const promptText = buildAnalysisPrompt(reportText, fileName, options);
  const systemPrompt = buildSystemPrompt(language, isComparison);

  // Try each model in sequence if rate-limited
  for (let modelIndex = 0; modelIndex < modelsToTry.length; modelIndex++) {
    const model = modelsToTry[modelIndex];
    const isRetry = modelIndex > 0;

    if (isRetry) {
      logger.warn(`Model ${config.openrouter.model} rate-limited, trying fallback: ${model}`);
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), config.openrouter.timeoutMs);

      logger.info('Calling OpenRouter API', {
        model,
        language,
        isComparison,
        reportLength: reportText.length,
        isRetry,
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
          model,
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
          model,
          body: errorBody.substring(0, 500),
        });

        // Only retry on 429 (rate limit), not other errors
        if (response.status === 429 && modelIndex < modelsToTry.length - 1) {
          continue; // Try next model
        }

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
        model,
        language,
        isComparison,
        reportTitle: parsed.reportTitle,
        testsFound: parsed.detectedTests?.length || 0,
        isRetry,
      });

      return {
        ...parsed,
        language,
        isComparison,
        rawExtractedText: reportText,
        analyzedAt: new Date().toISOString(),
        modelUsed: `OpenRouter (${model})`,
      };
    } catch (err) {
      // If this is the last model or not a rate limit error, throw
      if (modelIndex === modelsToTry.length - 1) {
        if (err.name === 'AbortError') {
          const e = new Error('OpenRouter API request timed out');
          e.code = 'AI_TIMEOUT';
          e.statusCode = 504;
          throw e;
        }

        if (err.code) throw err;

        logger.error('OpenRouter request failed', { message: err.message, model });
        const e = new Error('Failed to communicate with AI provider');
        e.code = 'AI_COMMUNICATION_ERROR';
        e.statusCode = 502;
        throw e;
      }
      // Otherwise continue to next model
    }
  }
}

module.exports = { analyzeReport, RESPONSE_SCHEMA };