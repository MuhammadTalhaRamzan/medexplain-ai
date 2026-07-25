/**
 * OCR Service — extracts text from images using EasyOCR (Python).
 *
 * Invokes the EasyOCR Python script via child_process and returns
 * the extracted text. Supports JPG and PNG images.
 *
 * PRD §20, §26
 */

const { spawn } = require('child_process');
const path = require('path');
const config = require('../config/config');
const logger = require('../utils/logger');

/**
 * Run EasyOCR on an image file and return extracted text.
 *
 * @param {string} imagePath - Absolute path to the image file
 * @returns {Promise<{text: string, items: Array, wordCount: number}>}
 */
async function extractText(imagePath) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, 'ocr', 'ocr_script.py');
    const languages = config.ocr.languages.join(',');
    const timeoutMs = config.ocr.timeoutMs;

    const args = [scriptPath, imagePath, '--languages', languages];
    const pythonPath = config.ocr.pythonPath;

    logger.info('Starting OCR extraction', {
      imagePath,
      pythonPath,
      languages,
      timeoutMs,
    });

    const proc = spawn(pythonPath, args, {
      timeout: timeoutMs,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    proc.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    const timer = setTimeout(() => {
      proc.kill('SIGTERM');
      const err = new Error('OCR process timed out');
      err.code = 'OCR_TIMEOUT';
      reject(err);
    }, timeoutMs);

    proc.on('close', (code) => {
      clearTimeout(timer);

      if (code !== 0) {
        logger.error('OCR process failed', {
          exitCode: code,
          stderr: stderr.substring(0, 500),
        });
        const err = new Error(
          stderr ? `OCR error: ${stderr.substring(0, 200)}` : 'OCR process exited with non-zero code'
        );
        err.code = 'OCR_FAILED';
        reject(err);
        return;
      }

      try {
        const result = JSON.parse(stdout);
        if (!result.success) {
          const err = new Error(result.error || 'OCR returned failure');
          err.code = 'OCR_FAILED';
          reject(err);
          return;
        }

        logger.info('OCR extraction completed', {
          wordCount: result.word_count,
          textLength: result.text.length,
        });

        resolve({
          text: result.text,
          items: result.items || [],
          wordCount: result.word_count || 0,
        });
      } catch (parseErr) {
        logger.error('Failed to parse OCR output', {
          stdout: stdout.substring(0, 300),
        });
        const err = new Error('Failed to parse OCR output');
        err.code = 'OCR_PARSE_ERROR';
        reject(err);
      }
    });

    proc.on('error', (err) => {
      clearTimeout(timer);
      logger.error('OCR process spawn error', { message: err.message });
      err.code = 'OCR_SPAWN_ERROR';
      reject(err);
    });
  });
}

module.exports = { extractText };