/**
 * File Cleaner Utility — deletes temporary uploaded files after
 * processing or on error.
 *
 * PRD §29, §30, §47
 */

const fs = require('fs');
const logger = require('./logger');

/**
 * Delete a file at the given path. Silently ignores missing files.
 *
 * @param {string} filePath - Absolute or relative path to the file
 */
function deleteFile(filePath) {
  if (!filePath) return;

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      logger.info('Temporary file deleted', { filePath });
    }
  } catch (err) {
    logger.warn('Failed to delete temporary file', {
      filePath,
      message: err.message,
    });
  }
}

/**
 * Delete multiple files.
 *
 * @param {string[]} filePaths - Array of file paths to delete
 */
function deleteFiles(filePaths) {
  if (!Array.isArray(filePaths)) return;
  filePaths.forEach(deleteFile);
}

module.exports = { deleteFile, deleteFiles };