const axios = require('axios');
const config = require('../config');
const logger = require('../utils/logger');

async function fetchNews() {
  try {
    const response = await axios.get(`https://newsapi.org/v2/everything?q=cryptocurrency&apiKey=${config.newsApiKey}`);
    return response.data.articles;
  } catch (error) {
    logger.error("Error fetching news:", error);
    throw error;
  }
}

module.exports = { fetchNews };
