const aiService = require('../services/aiService');

async function getHealth(req, res) {
  res.status(200).json({
    success: true,
    status: 'ok',
    uptimeSeconds: Math.round(process.uptime()),
  });
}

async function getAiStatus(req, res, next) {
  try {
    const status = await aiService.getStatus();
    res.status(200).json({ success: true, ...status });
  } catch (err) {
    next(err);
  }
}

module.exports = { getHealth, getAiStatus };
