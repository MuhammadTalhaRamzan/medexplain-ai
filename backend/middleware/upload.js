/**
 * Multer-based file upload middleware.
 *
 * Validates MIME types, file size, and sanitizes filenames.
 * Stores files temporarily in the configured upload directory.
 *
 * PRD §19, §26, §30, §50
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const config = require('../config/config');

// Ensure upload directory exists
if (!fs.existsSync(config.upload.dir)) {
  fs.mkdirSync(config.upload.dir, { recursive: true });
}

/**
 * Sanitize a filename: remove path separators, null bytes, and
 * other dangerous characters. Keep only alphanumeric, dash,
 * underscore, and period.
 */
function sanitizeFilename(name) {
  return name
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/\.\./g, '')
    .substring(0, 255);
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, config.upload.dir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = path.basename(file.originalname, ext);
    const safe = sanitizeFilename(base);
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${safe}${ext}`;
    cb(null, unique);
  },
});

function fileFilter(_req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (
    config.upload.allowedMimeTypes.includes(file.mimetype) ||
    config.upload.allowedExtensions.includes(ext)
  ) {
    cb(null, true);
  } else {
    const err = new Error(
      `Unsupported file format. Allowed: ${config.upload.allowedExtensions.join(', ')}`
    );
    err.code = 'UNSUPPORTED_FILE_TYPE';
    err.statusCode = 400;
    err.publicMessage =
      'Unsupported file format. Please upload a PDF, PNG, or JPG file.';
    cb(err, false);
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.upload.maxSizeBytes,
  },
});

module.exports = upload;