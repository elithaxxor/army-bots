const axios = require('axios');
const config = require('../config');
const logger = require('../utils/logger');

async function sendDiscordMessage(message) {
  try {
    await axios.post(config.discordWebhookUrl, { content: message });
  } catch (error) {
    logger.error("Discord notification error:", error);
  }
}

module.exports = { sendDiscordMessage };
