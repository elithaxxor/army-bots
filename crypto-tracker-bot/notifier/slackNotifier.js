const axios = require('axios');
const config = require('../config');
const logger = require('../utils/logger');

async function sendSlackMessage(message) {
  try {
    await axios.post(config.slackWebhookUrl, { text: message });
  } catch (error) {
    logger.error("Slack notification error:", error);
  }
}

module.exports = { sendSlackMessage };
