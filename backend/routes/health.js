const express = require('express');
const router = express.Router();
const { getHealth, getAiStatus } = require('../controllers/healthController');

router.get('/health', getHealth);
router.get('/ai/status', getAiStatus);

module.exports = router;
