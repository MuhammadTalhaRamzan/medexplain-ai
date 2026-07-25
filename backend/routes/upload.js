const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { uploadFile } = require('../controllers/uploadController');

// POST /upload — accepts single file upload (PDF, PNG, JPG)
router.post('/upload', upload.single('file'), uploadFile);

module.exports = router;
