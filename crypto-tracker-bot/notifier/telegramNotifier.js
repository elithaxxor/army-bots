const axios = require('axios');
const config = require('../config');
const logger = require('../utils/logger');

async function sendTelegramMessage(message) {
  try {
    const url = `https://api.telegram.org/bot${config.telegramBotToken}/sendMessage`;
    await axios.post(url, {
      chat_id: config.telegramChatId,
      text: message,
    });
  } catch (error) {
    logger.error("Telegram notification error:", error);
  }
}

module.exports = { sendTelegramMessage };
