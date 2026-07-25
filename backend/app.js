const express = require('express');
const cors = require('cors');
const config = require('./config/config');
const logger = require('./utils/logger');
const healthRoutes = require('./routes/health');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors({ origin: config.frontendOrigin }));
app.use(express.json());

// Lightweight request logger — method/path/duration only, never body contents.
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    logger.info('Request handled', {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      durationMs: Date.now() - start,
    });
  });
  next();
});

app.use('/', healthRoutes);

// Upload and analyze routes are added in Phase B/E.

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
