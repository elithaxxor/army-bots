const axios = require('axios');
const config = require('../config');
const logger = require('../utils/logger');
const metrics = require('./metrics');

async function fetchPrices() {
  try {
    // List of coins to fetch
    const coins = ['BTC', 'ETH', 'LTC', 'DOGE', 'SHIB', 'MATIC', 'LINK', 'AAVE', 'GRT', 'SAND'];

    const prices = {};

    for (const coin of coins) {
      const start = Date.now();
      try {
        const response = await axios.get(
          `https://api.polygon.io/v1/last/crypto/${coin}USD?apiKey=${config.polygonApiKey}`
        );
        metrics.recordRequest('polygon', Date.now() - start, false);
        prices[coin] = response.data.last.price;
      } catch (err) {
        metrics.recordRequest('polygon', Date.now() - start, true);
        logger.error(`Error fetching price for ${coin}:`, err);
        prices[coin] = null;
      }
    }

    return prices;
  } catch (error) {
    logger.error("Error fetching crypto prices:", error);
    throw error;
  }
}

module.exports = { fetchPrices };
