const axios = require('axios');
const config = require('../config');
const logger = require('../utils/logger');

async function analyzeData({ symbol, currentPrice, changePercent }) {
  try {
    const prompt = `Analyze the market sentiment for ${symbol} given the current price is ${currentPrice} USD with a ${changePercent.toFixed(2)}% change. Consider technical indicators such as RSI and MACD and provide insights in multiple languages if relevant.`;
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
    logger.error("Sentiment analysis error:", error);
    throw error;
  }
}

module.exports = { analyzeData };
