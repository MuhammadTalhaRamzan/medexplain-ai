/**
 * Minimal structured logger.
 *
 * PRD §46: log upload time, processing duration, OCR duration, Gemma
 * response time, errors, and warnings — but NEVER the contents of a
 * medical report. Callers must pass metadata only, never extracted text.
 */

function timestamp() {
  return new Date().toISOString();
}

function info(message, meta = {}) {
  console.log(`[INFO] ${timestamp()} ${message}`, meta);
}

function warn(message, meta = {}) {
  console.warn(`[WARN] ${timestamp()} ${message}`, meta);
}

function error(message, meta = {}) {
  console.error(`[ERROR] ${timestamp()} ${message}`, meta);
}

module.exports = { info, warn, error };
