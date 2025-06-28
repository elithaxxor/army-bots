const axios = require('axios');
const { pushoverToken, pushoverUserKey } = require('../config');
const logger = require('../utils/logger');

/**
 * Send a notification via the Pushover service.
 *
 * @param {string} message - The message to send.
 */
async function sendPushoverMessage(message) {
  if (!pushoverToken || !pushoverUserKey) {
    logger.error('Pushover token or user key not configured');
    return;
  }
  try {
    await axios.post('https://api.pushover.net/1/messages.json', {
      token: pushoverToken,
      user: pushoverUserKey,
      message,
    });
  } catch (error) {
    logger.error('Pushover notification error:', error);
  }
}

module.exports = { sendPushoverMessage };
