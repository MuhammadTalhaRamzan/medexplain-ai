const fetch = require('node-fetch');
const config = require('../config/config');
const logger = require('../utils/logger');

/**
 * Checks whether an OpenRouter API key is configured and valid, and
 * whether the configured model is currently reachable. Used by
 * GET /ai/status.
 *
 * Returns one of: "running" | "stopped" | "loading".
 * - "stopped" covers: no API key set, invalid key, or network failure.
 * - "running" means the key is valid and OpenRouter is reachable.
 */
async function getStatus() {
  if (!config.openrouter.apiKey) {
    return {
      state: 'stopped',
      model: config.openrouter.model,
      modelAvailable: false,
      reason: 'OPENROUTER_API_KEY is not set',
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(`${config.openrouter.baseUrl}/key`, {
      headers: { Authorization: `Bearer ${config.openrouter.apiKey}` },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return {
        state: 'stopped',
        model: config.openrouter.model,
        modelAvailable: false,
        reason: `OpenRouter responded with ${res.status}`,
      };
    }

    return {
      state: 'running',
      model: config.openrouter.model,
      modelAvailable: true,
    };
  } catch (err) {
    clearTimeout(timeout);
    logger.warn('OpenRouter status check failed', { message: err.message });
    return {
      state: 'stopped',
      model: config.openrouter.model,
      modelAvailable: false,
      reason: 'Could not reach OpenRouter',
    };
  }
}

module.exports = { getStatus };
