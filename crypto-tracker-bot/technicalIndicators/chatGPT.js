const axios = require('axios');
const config = require('../config');
const logger = require('../utils/logger');

async function getChatCompletion(prompt) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }]
      },
      {
        headers: {
          'Authorization': `Bearer ${config.chatGPTApiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    logger.error("ChatGPT completion error:", error);
    throw error;
  }
}

module.exports = { getChatCompletion };
