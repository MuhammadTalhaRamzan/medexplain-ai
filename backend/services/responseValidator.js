/**
 * Response Formatter & Validator — validates the AI model's JSON
 * response against the required schema, enforces disclaimer presence,
 * and provides hallucination-prevention fallback text.
 *
 * PRD §86, §88
 */

const logger = require('../utils/logger');

/**
 * Validate that the AI response has all required fields with correct types.
 * If validation fails, returns a safe fallback response.
 *
 * @param {Object} data - Parsed JSON from the AI model
 * @param {string} rawText - Original extracted text (for fallback)
 * @returns {Object} Validated response object
 */
function validateAndFormat(data, rawText) {
  // Check for required top-level fields
  const requiredFields = [
    'overallSummary',
    'importantFindings',
    'detectedTests',
    'medicalExplanations',
    'doctorQuestions',
    'lifestyleGuidance',
  ];

  const missingFields = requiredFields.filter((field) => {
    const val = data[field];
    return val === undefined || val === null || val === '';
  });

  if (missingFields.length > 0) {
    logger.warn('AI response missing required fields', { missingFields });
    return buildFallbackResponse(rawText, 'AI response was incomplete. Please try again.');
  }

  // Validate detectedTests structure
  if (!Array.isArray(data.detectedTests) || data.detectedTests.length === 0) {
    logger.warn('AI response has no detected tests');
    return buildFallbackResponse(rawText, 'No test results could be identified in the report.');
  }

  // Ensure each test has required sub-fields
  const validTests = data.detectedTests.filter((test) => {
    return test.testName && test.result && test.status;
  });

  if (validTests.length === 0) {
    logger.warn('AI response has no valid test entries');
    return buildFallbackResponse(rawText, 'Test results could not be properly parsed.');
  }

  // Ensure importantFindings is an array
  if (!Array.isArray(data.importantFindings)) {
    data.importantFindings = [];
  }

  // Ensure medicalExplanations is an array
  if (!Array.isArray(data.medicalExplanations)) {
    data.medicalExplanations = [];
  }

  // Ensure doctorQuestions is an array
  if (!Array.isArray(data.doctorQuestions)) {
    data.doctorQuestions = [
      'What do these specific lab test results indicate regarding my current health status?',
      'Are any follow-up tests or lifestyle modifications recommended based on this report?',
      'How frequently should this specific panel be repeated?',
    ];
  }

  // Ensure lifestyleGuidance is an array
  if (!Array.isArray(data.lifestyleGuidance)) {
    data.lifestyleGuidance = [
      'Maintain adequate hydration throughout the day.',
      'Eat a balanced diet high in whole foods and dietary fiber.',
      'Maintain regular, moderate physical activity.',
      'Ensure 7-9 hours of restful sleep every night.',
      'Consult your primary physician for a complete clinical review.',
    ];
  }

  // Ensure disclaimer is present in overallSummary
  const disclaimerText = 'This explanation is for educational purposes only and does not constitute medical advice.';
  if (!data.overallSummary.toLowerCase().includes('educational') &&
      !data.overallSummary.toLowerCase().includes('disclaimer') &&
      !data.overallSummary.toLowerCase().includes('not medical advice')) {
    data.overallSummary += `\n\n${disclaimerText}`;
  }

  // Sanitize status values
  data.detectedTests = data.detectedTests.map((test) => {
    const validStatuses = ['normal', 'borderline', 'abnormal'];
    if (!validStatuses.includes(test.status)) {
      test.status = 'normal';
    }
    return test;
  });

  logger.info('AI response validated successfully', {
    testsCount: data.detectedTests.length,
    findingsCount: data.importantFindings.length,
  });

  return data;
}

/**
 * Build a safe fallback response when AI analysis fails.
 *
 * @param {string} rawText - Original extracted text
 * @param {string} reason - Reason for fallback
 * @returns {Object} Safe fallback response
 */
function buildFallbackResponse(rawText, reason) {
  return {
    reportTitle: 'Medical Report Analysis',
    reportDate: new Date().toLocaleDateString(),
    overallSummary: `We were unable to fully analyze this report. ${reason} This explanation is for educational purposes only and does not constitute medical advice.`,
    importantFindings: [
      {
        id: 'f1',
        finding: 'The report could not be fully analyzed by the AI. Please try uploading a clearer image or text.',
        severity: 'info',
        iconType: 'info',
      },
    ],
    detectedTests: [
      {
        id: 't1',
        testName: 'Report Analysis',
        result: 'Pending',
        referenceRange: 'N/A',
        unit: '',
        status: 'normal',
        category: 'General',
      },
    ],
    medicalExplanations: [
      {
        id: 'e1',
        testName: 'General',
        purpose: 'Medical report analysis',
        plainLanguageExplanation: 'The report could not be fully processed. Please ensure the text is clear and try again.',
        educationalContext: 'For accurate analysis, ensure the report text is legible and contains test names, values, and reference ranges.',
      },
    ],
    doctorQuestions: [
      'Could you help me understand the results of my recent lab tests?',
      'Are there any values in my report that require attention?',
      'What follow-up tests or lifestyle changes would you recommend?',
    ],
    lifestyleGuidance: [
      'Maintain adequate hydration throughout the day.',
      'Eat a balanced diet high in whole foods and dietary fiber.',
      'Maintain regular, moderate physical activity.',
      'Ensure 7-9 hours of restful sleep every night.',
      'Consult your primary physician for a complete clinical review.',
    ],
    rawExtractedText: rawText,
    analyzedAt: new Date().toISOString(),
    modelUsed: 'Fallback Parser',
  };
}

module.exports = { validateAndFormat, buildFallbackResponse };