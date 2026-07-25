/**
 * Text Cleaning Engine — strips OCR noise, extra spaces, broken
 * characters, and duplicate lines from extracted text.
 *
 * PRD §6 of Part 2, §17 Step 6
 */

const logger = require('../utils/logger');

/**
 * Clean extracted text by removing common OCR artifacts.
 *
 * @param {string} rawText - Raw text from OCR or PDF extraction
 * @returns {string} Cleaned text
 */
function clean(rawText) {
  if (!rawText) return '';

  let text = rawText;

  // Remove null bytes
  text = text.replace(/\0/g, '');

  // Replace multiple spaces with single space
  text = text.replace(/[ \t]+/g, ' ');

  // Replace multiple newlines with double newline (paragraph break)
  text = text.replace(/\n{3,}/g, '\n\n');

  // Remove lines that are just whitespace or punctuation (but keep meaningful short lines)
  text = text
    .split('\n')
    .filter((line) => line.trim().length > 0)
    .join('\n');

  // Remove duplicate consecutive lines
  const lines = text.split('\n');
  const uniqueLines = [];
  for (let i = 0; i < lines.length; i++) {
    if (i === 0 || lines[i].trim() !== lines[i - 1].trim()) {
      uniqueLines.push(lines[i]);
    }
  }
  text = uniqueLines.join('\n');

  // Fix common OCR character swaps
  text = text.replace(/[|¦]/g, 'I'); // pipe to I
  text = text.replace(/[®]/g, ''); // remove registered trademark symbols

  // Trim each line
  text = text
    .split('\n')
    .map((line) => line.trim())
    .join('\n');

  // Final trim
  text = text.trim();

  logger.info('Text cleaning completed', {
    originalLength: rawText.length,
    cleanedLength: text.length,
  });

  return text;
}

module.exports = { clean };