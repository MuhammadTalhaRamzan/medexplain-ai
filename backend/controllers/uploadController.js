/**
 * Upload Controller — handles standalone file uploads
 *
 * PRD §19, §27, §30
 */

const path = require('path');
const logger = require('../utils/logger');

/**
 * POST /upload
 * Accepts a single file upload and returns metadata and upload ID.
 */
async function uploadFile(req, res) {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'NO_FILE_PROVIDED',
        message: 'Please select a file to upload (PDF, PNG, or JPG).',
      },
    });
  }

  const uploadId = path.basename(req.file.filename, path.extname(req.file.filename));

  logger.info('File uploaded successfully', {
    uploadId,
    originalName: req.file.originalname,
    size: req.file.size,
    mimeType: req.file.mimetype,
  });

  return res.status(200).json({
    success: true,
    data: {
      uploadId,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      sizeBytes: req.file.size,
      mimeType: req.file.mimetype,
      status: 'uploaded',
    },
  });
}

module.exports = { uploadFile };
