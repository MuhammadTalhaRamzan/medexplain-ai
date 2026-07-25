require('dotenv').config();

const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',

  // AI provider: OpenRouter (cloud). Replaces the local Ollama setup —
  // report text is sent to OpenRouter's API for explanation, so this is
  // no longer a fully offline pipeline. See docs/DEVELOPMENT_PLAN.md.
  openrouter: {
    apiKey: process.env.OPENROUTER_API_KEY || '',
    baseUrl: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
    model: process.env.OPENROUTER_MODEL || 'google/gemma-4-31b-it:free',
    timeoutMs: parseInt(process.env.OPENROUTER_TIMEOUT_MS || '25000', 10),
    // Sent as OpenRouter-recommended attribution headers.
    siteUrl: process.env.OPENROUTER_SITE_URL || 'http://localhost:5173',
    siteName: process.env.OPENROUTER_SITE_NAME || 'MedExplain AI',
  },

  upload: {
    maxSizeBytes: parseInt(process.env.MAX_UPLOAD_SIZE_MB || '20', 10) * 1024 * 1024,
    dir: process.env.UPLOAD_DIR || './uploads',
    allowedMimeTypes: ['application/pdf', 'image/png', 'image/jpeg'],
    allowedExtensions: ['.pdf', '.png', '.jpg', '.jpeg'],
  },

  // OCR: EasyOCR (Python) instead of Tesseract.js. The Node backend
  // shells out to a small Python script (Phase C) via child_process.
  ocr: {
    engine: 'easyocr',
    pythonPath: process.env.PYTHON_PATH || 'python3',
    languages: (process.env.EASYOCR_LANGUAGES || 'en').split(','),
    timeoutMs: parseInt(process.env.OCR_TIMEOUT_MS || '20000', 10),
  },
};

module.exports = config;
