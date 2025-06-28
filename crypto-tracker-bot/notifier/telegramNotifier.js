const axios = require('axios');
const { telegramBotToken, telegramChatId } = require('../config');
const logger = require('../utils/logger');

async function sendTelegramMessage(message) {
  try {
    const url = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
    await axios.post(url, {
      chat_id: telegramChatId,
      text: message,
    });
  } catch (error) {
    logger.error("Telegram notification error:", error);
  }
}

module.exports = { sendTelegramMessage };
