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

      // ocr_script.py always writes a JSON contract to stdout, even on
      // failure — it prints {success:false, error:"..."} and THEN exits
      // with code 1. So we must try to parse stdout first; that JSON
      // carries the real, specific error. Only if stdout isn't valid
      // JSON do we fall back to the exit code / raw stderr (which is
      // often just EasyOCR's informational startup logging, not the
      // actual failure reason).
      let parsed = null;
      if (stdout.trim()) {
        try {
          parsed = JSON.parse(stdout);
        } catch (_) {
          parsed = null;
        }
      }

      if (parsed) {
        if (!parsed.success) {
          logger.error('OCR script reported failure', {
            exitCode: code,
            error: parsed.error,
          });
          const err = new Error(parsed.error || 'OCR returned failure');
          err.code = 'OCR_FAILED';
          reject(err);
          return;
        }

        logger.info('OCR extraction completed', {
          wordCount: parsed.word_count,
          textLength: parsed.text.length,
        });

        resolve({
          text: parsed.text,
          items: parsed.items || [],
          wordCount: parsed.word_count || 0,
        });
        return;
      }

      // No parseable JSON at all — a genuine crash (python not found,
      // interpreter-level error) rather than a handled OCR failure.
      if (code !== 0) {
        logger.error('OCR process failed with no parseable output', {
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

      logger.error('Failed to parse OCR output', {
        stdout: stdout.substring(0, 300),
      });
      const err = new Error('Failed to parse OCR output');
      err.code = 'OCR_PARSE_ERROR';
      reject(err);
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