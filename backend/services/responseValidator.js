/**
 * Response Formatter & Validator — validates the AI model's JSON
 * response against the required schema, enforces disclaimer presence,
 * and provides hallucination-prevention fallback text (in English or Roman Urdu).
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
  const language = data.language || 'en';

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
    return buildFallbackResponse(rawText, 'AI response was incomplete. Please try again.', language);
  }

  // Validate detectedTests structure
  if (!Array.isArray(data.detectedTests) || data.detectedTests.length === 0) {
    logger.warn('AI response has no detected tests');
    return buildFallbackResponse(rawText, 'No test results could be identified in the report.', language);
  }

  // Ensure each test has required sub-fields
  const validTests = data.detectedTests.filter((test) => {
    return test.testName && test.result && test.status;
  });

  if (validTests.length === 0) {
    logger.warn('AI response has no valid test entries');
    return buildFallbackResponse(rawText, 'Test results could not be properly parsed.', language);
  }

  // Ensure arrays
  if (!Array.isArray(data.importantFindings)) data.importantFindings = [];
  if (!Array.isArray(data.medicalExplanations)) data.medicalExplanations = [];
  if (!Array.isArray(data.relatedMedications)) data.relatedMedications = [];

  if (!Array.isArray(data.doctorQuestions) || data.doctorQuestions.length === 0) {
    data.doctorQuestions = language === 'ur-roman'
      ? [
          'Kya in test results ke mutabiq meri sehat bilkul theek hai?',
          'Kya mujhe koi dawai ya ilaj ki zaroorat hai?',
          'Kiya ye test dubara karwane ki zaroorat hai?',
        ]
      : [
          'What do these specific lab test results indicate regarding my current health status?',
          'Are any follow-up tests or lifestyle modifications recommended based on this report?',
          'How frequently should this specific panel be repeated?',
        ];
  }

  if (!Array.isArray(data.lifestyleGuidance) || data.lifestyleGuidance.length === 0) {
    data.lifestyleGuidance = language === 'ur-roman'
      ? [
          'Rozana kam se kam 8-10 glass paani peeyin.',
          'Har roz 30 minute halki phulki walk/varzish karien.',
          'Ziyada fried aur meethi cheezon se parhez karien.',
          'Rozana 7-8 ghante ki pur-sukun neend lein.',
          'Doctor se zaroor mashwara karien.',
        ]
      : [
          'Maintain adequate hydration throughout the day.',
          'Eat a balanced diet high in whole foods and dietary fiber.',
          'Maintain regular, moderate physical activity.',
          'Ensure 7-9 hours of restful sleep every night.',
          'Consult your primary physician for a complete clinical review.',
        ];
  }

  // Ensure disclaimer is present in overallSummary
  const disclaimerText = language === 'ur-roman'
    ? 'Yeh sirf taleemi wa maloomati maqsad ke liye hai, doctor ke mashware ka nambal badal nahi hai.'
    : 'This explanation is for educational purposes only and does not constitute medical advice.';

  if (!data.overallSummary.toLowerCase().includes('educational') &&
      !data.overallSummary.toLowerCase().includes('disclaimer') &&
      !data.overallSummary.toLowerCase().includes('not medical advice') &&
      !data.overallSummary.toLowerCase().includes('taleemi')) {
    data.overallSummary += `\n\n${disclaimerText}`;
  }

  // Sanitize status and trend values
  data.detectedTests = data.detectedTests.map((test) => {
    const validStatuses = ['normal', 'borderline', 'abnormal'];
    if (!validStatuses.includes(test.status)) {
      test.status = 'normal';
    }

    const validTrends = ['improved', 'stable', 'worsened'];
    if (test.trend && !validTrends.includes(test.trend)) {
      test.trend = 'stable';
    }

    return test;
  });

  logger.info('AI response validated successfully', {
    testsCount: data.detectedTests.length,
    findingsCount: data.importantFindings.length,
    language,
    isComparison: Boolean(data.isComparison),
  });

  return data;
}

/**
 * Build a safe fallback response when AI analysis fails.
 *
 * @param {string} rawText - Original extracted text
 * @param {string} reason - Reason for fallback
 * @param {string} language - Target language ('en' | 'ur-roman')
 * @returns {Object} Safe fallback response
 */
function buildFallbackResponse(rawText, reason, language = 'en') {
  const isUrdu = language === 'ur-roman';

  return {
    reportTitle: isUrdu ? 'Medical Report Ki Detail' : 'Medical Report Analysis',
    reportDate: new Date().toLocaleDateString(),
    overallSummary: isUrdu
      ? `Is report ka mukammal jaiza nahi liya ja saka. ${reason} Yeh maloomat sirf taleemi maqsad ke liye hai aur doctor ke mashware ka nambal badal nahi hai.`
      : `We were unable to fully analyze this report. ${reason} This explanation is for educational purposes only and does not constitute medical advice.`,
    comparisonSummary: isUrdu
      ? 'Dono reports ka muqabla karke dawai ke asraat dikhaye gaye hain.'
      : 'Comparison between initial and follow-up reports showing treatment progress.',
    importantFindings: [
      {
        id: 'f1',
        finding: isUrdu
          ? 'AI is report ka poora jaiza nahi le saki. Barah-e-karam wazeh image ya text dobara upload karien.'
          : 'The report could not be fully analyzed by the AI. Please try uploading a clearer image or text.',
        severity: 'info',
        iconType: 'info',
      },
    ],
    detectedTests: [
      {
        id: 't1',
        testName: 'Report Analysis',
        result: isUrdu ? 'Muayana Jari Hai' : 'Pending',
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
        purpose: isUrdu ? 'Medical report ki tafseel' : 'Medical report analysis',
        plainLanguageExplanation: isUrdu
          ? 'Report ka text wazeh nahi tha. Dobara saaf image upload karein.'
          : 'The report could not be fully processed. Please ensure the text is clear and try again.',
        educationalContext: isUrdu
          ? 'Sahi result ke liye report wazeh aur saaf hone zaroori hai.'
          : 'For accurate analysis, ensure the report text is legible and contains test names, values, and reference ranges.',
      },
    ],
    relatedMedications: [
      {
        id: 'm1',
        category: isUrdu ? 'Doctor Ki Hidayat' : 'Clinical Consultation Required',
        medicationClass: isUrdu ? 'Doctor prescription zaroori hai' : 'Prescription Only',
        purpose: isUrdu
          ? 'Dawai hamesha registered doctor ke mashware se lein.'
          : 'Always consult your prescribing physician before starting or changing medications.',
        disclaimer: isUrdu ? 'Doctor ki prescription zaroori hai' : 'Must be prescribed by a physician',
      },
    ],
    doctorQuestions: isUrdu
      ? [
          'Kya meri report ke sab results normal hain?',
          'Kya mujhe dawai ki zaroorat hai?',
          'Kiya ye test dubara karwana hoga?',
        ]
      : [
          'Could you help me understand the results of my recent lab tests?',
          'Are there any values in my report that require attention?',
          'What follow-up tests or lifestyle changes would you recommend?',
        ],
    lifestyleGuidance: isUrdu
      ? [
          'Rozana kam se kam 8-10 glass paani peeyin.',
          'Har roz 30 minute halki phulki walk/varzish karien.',
          'Ziyada fried aur meethi cheezon se parhez karien.',
          'Rozana 7-8 ghante ki pur-sukun neend lein.',
          'Doctor se zaroor mashwara karien.',
        ]
      : [
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