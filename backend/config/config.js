require('dotenv').config();
const os = require('os');
const path = require('path');

const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',

  // AI provider: OpenRouter (cloud). Replaces the local Ollama setup —
  // report text is sent to OpenRouter's API for explanation, so this is
  // no longer a fully offline pipeline. See docs/DEVELOPMENT_PLAN.md.
  openrouter: {
    apiKey: process.env.OPENROUTER_API_KEY || '',
    baseUrl: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
    model: process.env.OPENROUTER_MODEL || 'google/gemma-4-26b-a4b-it:free:',
    timeoutMs: parseInt(process.env.OPENROUTER_TIMEOUT_MS || '25000', 10),
    // Fallback models if primary is rate-limited (ordered by reliability)
    fallbackModels: [
      'google/gemma-4-26b-a4b-it:free:',
      'meta-llama/llama-2-7b:free',
      'mistralai/mistral-7b-instruct:free'
    ],
    // Sent as OpenRouter-recommended attribution headers.
    siteUrl: process.env.OPENROUTER_SITE_URL || 'http://localhost:5173',
    siteName: process.env.OPENROUTER_SITE_NAME || 'MedExplain AI',
  },

  upload: {
    maxSizeBytes: parseInt(process.env.MAX_UPLOAD_SIZE_MB || '20', 10) * 1024 * 1024,
    // Defaults to the OS temp dir, NOT a folder inside the project.
    // `node --watch` watches the whole cwd recursively; a folder like
    // `./uploads` inside the repo gets watched too, so every incoming
    // upload triggers a server restart mid-request and kills the OCR/AI
    // pipeline partway through. Override with UPLOAD_DIR if you want a
    // fixed location, but keep it outside the watched project folder.
    dir: process.env.UPLOAD_DIR || path.join(os.tmpdir(), 'medexplain-ai-uploads'),
    allowedMimeTypes: ['application/pdf', 'image/png', 'image/jpeg'],
    allowedExtensions: ['.pdf', '.png', '.jpg', '.jpeg'],
  },

  // OCR: Tesseract.js (pure JS, in-process). Switched back from
  // EasyOCR/Python after repeated silent process deaths during model
  // download on the dev machine (likely antivirus or network
  // restrictions killing the python.exe subprocess) — see
  // docs/DEVELOPMENT_PLAN.md.
  ocr: {
    engine: 'tesseract.js',
    language: process.env.TESSERACT_LANGUAGE || 'eng',
    timeoutMs: parseInt(process.env.OCR_TIMEOUT_MS || '60000', 10),
  },
};

module.exports = config;