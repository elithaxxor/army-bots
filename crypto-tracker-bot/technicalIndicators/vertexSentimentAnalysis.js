const axios = require('axios');
const config = require('../config');
const logger = require('../utils/logger');

async function analyzeDataWithVertexAI({ symbol, currentPrice, changePercent }) {
  try {
    const prompt = `Analyze the market sentiment for ${symbol} given the current price is ${currentPrice} USD with a ${changePercent.toFixed(2)}% change. Provide a detailed sentiment analysis considering recent news, social media trends, and technical indicators.`;

    const response = await axios.post(
      `https://us-central1-aiplatform.googleapis.com/v1/projects/${config.googleCloudProjectId}/locations/us-central1/publishers/google/models/text-bison:predict`,
      {
        instances: [
          { content: prompt }
        ],
        parameters: {
          temperature: 0.7,
          maxOutputTokens: 1024,
          topP: 0.8,
          topK: 40
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${config.googleCloudAccessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.predictions[0].content;
  } catch (error) {
    logger.error("Vertex AI sentiment analysis error:", error);
    throw error;
  }
}

module.exports = { analyzeDataWithVertexAI };
