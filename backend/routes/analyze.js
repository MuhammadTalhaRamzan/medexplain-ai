const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { analyzeReport } = require('../controllers/analyzeController');

// POST /analyze — accepts single or dual file upload (file + previousFile) or JSON body with text
router.post(
  '/analyze',
  upload.fields([
    { name: 'file', maxCount: 1 },
    { name: 'previousFile', maxCount: 1 },
  ]),
  analyzeReport
);

module.exports = router;