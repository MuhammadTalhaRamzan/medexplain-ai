const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { analyzeReport } = require('../controllers/analyzeController');

// POST /analyze — accepts multipart file upload or JSON with text
router.post(
  '/analyze',
  upload.single('file'),
  analyzeReport
);

module.exports = router;