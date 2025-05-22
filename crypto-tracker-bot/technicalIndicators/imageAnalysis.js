const axios = require('axios');
const config = require('../config');
const logger = require('../utils/logger');

async function analyzeGraphImage(imagePath) {
  try {
    const prompt = `Perform a technical analysis on the crypto chart image located at ${imagePath}. Evaluate RSI, MACD, support/resistance levels, breakout patterns, and overall trend.`;
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
    logger.error("Image analysis error:", error);
    throw error;
  }
}

module.exports = { analyzeGraphImage };
