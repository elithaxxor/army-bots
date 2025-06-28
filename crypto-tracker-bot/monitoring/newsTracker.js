const axios = require('axios');
const config = require('../config');
const logger = require('../utils/logger');
const metrics = require('./metrics');

async function fetchNews() {
  const start = Date.now();
  try {
    const response = await axios.get(
      `https://newsapi.org/v2/everything?q=cryptocurrency&apiKey=${config.newsApiKey}`
    );
    metrics.recordRequest('NewsAPI', Date.now() - start, false);
    return response.data.articles;
  } catch (error) {
    metrics.recordRequest('NewsAPI', Date.now() - start, true);
    logger.error("Error fetching news:", error);
    throw error;
  }
}

module.exports = { fetchNews };
