const logger = require('../utils/logger');

/**
 * Standard error response shape (PRD §91):
 * { success: false, error: { code, message } }
 *
 * Errors thrown/passed with `err.statusCode`, `err.code`, and
 * `err.publicMessage` are respected; anything else falls back to a
 * generic 500 with no internal details exposed to the client.
 */
function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const publicMessage =
    err.publicMessage || 'Something went wrong while processing your request.';

  logger.error('Request failed', {
    path: req.path,
    method: req.method,
    code,
    statusCode,
    message: err.message,
  });

  res.status(statusCode).json({
    success: false,
    error: { code, message: publicMessage },
  });
}

function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: 'This endpoint does not exist.' },
  });
}

module.exports = { errorHandler, notFoundHandler };
