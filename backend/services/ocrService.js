/**
 * OCR Service — extracts text from images using Tesseract.js.
 *
 * Pure-JS OCR running in-process (no external Python subprocess, no
 * separate model-download step prone to being killed by antivirus /
 * network restrictions). Supports JPG and PNG images.
 *
 * PRD §20, §26
 */

const { createWorker } = require('tesseract.js');
const config = require('../config/config');
const logger = require('../utils/logger');

/**
 * Run Tesseract OCR on an image file and return extracted text.
 *
 * @param {string} imagePath - Absolute path to the image file
 * @returns {Promise<{text: string, items: Array, wordCount: number}>}
 */
async function extractText(imagePath) {
  const { language, timeoutMs } = config.ocr;

  logger.info('Starting OCR extraction', { imagePath, language, timeoutMs });

  let worker;
  let timedOut = false;

  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      timedOut = true;
      const err = new Error('OCR process timed out');
      err.code = 'OCR_TIMEOUT';
      reject(err);
    }, timeoutMs);
  });

  const runOcr = async () => {
    worker = await createWorker(language);
    try {
      const { data } = await worker.recognize(imagePath);

      const items = (data.words || []).map((w) => ({
        text: w.text,
        confidence: typeof w.confidence === 'number' ? Number((w.confidence / 100).toFixed(4)) : null,
        bbox: w.bbox || null,
      }));

      const text = (data.text || '').trim();

      logger.info('OCR extraction completed', {
        wordCount: items.length,
        textLength: text.length,
      });

      return { text, items, wordCount: items.length };
    } finally {
      // Don't try to terminate a worker that the timeout race already
      // considers gone — avoids a second error masking the timeout.
      if (!timedOut && worker) {
        await worker.terminate().catch(() => {});
      }
    }
  };

  try {
    return await Promise.race([runOcr(), timeoutPromise]);
  } catch (err) {
    if (worker) {
      worker.terminate().catch(() => {});
    }
    if (!err.code) {
      logger.error('OCR extraction failed', { message: err.message });
      err.code = 'OCR_FAILED';
    }
    throw err;
  }
}

module.exports = { extractText };