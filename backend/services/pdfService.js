/**
 * PDF Parser Service — extracts text from PDF files using pdf-parse.
 *
 * Handles corrupted/encrypted PDFs gracefully.
 *
 * PRD §21, §26
 */

const fs = require('fs');
const pdfParse = require('pdf-parse');
const logger = require('../utils/logger');

/**
 * Extract text from a PDF file.
 *
 * @param {string} filePath - Absolute path to the PDF file
 * @returns {Promise<{text: string, pageCount: number}>}
 */
async function extractText(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);

    const data = await pdfParse(dataBuffer);

    logger.info('PDF extraction completed', {
      pageCount: data.numpages,
      textLength: data.text.length,
    });

    return {
      text: data.text,
      pageCount: data.numpages,
    };
  } catch (err) {
    logger.error('PDF extraction failed', {
      filePath,
      message: err.message,
    });

    if (err.message && err.message.includes('encrypted')) {
      const e = new Error('This PDF is encrypted and cannot be read.');
      e.code = 'PDF_ENCRYPTED';
      throw e;
    }

    if (err.message && err.message.includes('corrupt')) {
      const e = new Error('This PDF file appears to be corrupted.');
      e.code = 'PDF_CORRUPTED';
      throw e;
    }

    const e = new Error('Failed to parse PDF file.');
    e.code = 'PDF_PARSE_ERROR';
    throw e;
  }
}

module.exports = { extractText };