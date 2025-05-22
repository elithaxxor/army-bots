const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

const storageFile = path.join(__dirname, 'priceHistory.json');

async function persistPriceData(data) {
  try {
    let history = [];
    if (fs.existsSync(storageFile)) {
      const fileData = fs.readFileSync(storageFile);
      history = JSON.parse(fileData);
    }
    // Append new data with timestamp
    history.push({
      timestamp: new Date().toISOString(),
      data
    });
    fs.writeFileSync(storageFile, JSON.stringify(history, null, 2));
  } catch (error) {
    logger.error("Failed to persist data:", error);
    throw error;
  }
}

function getPriceHistory() {
  try {
    if (fs.existsSync(storageFile)) {
      const fileData = fs.readFileSync(storageFile);
      return JSON.parse(fileData);
    }
    return [];
  } catch (error) {
    logger.error("Failed to read price history:", error);
    throw error;
  }
}

module.exports = { persistPriceData, getPriceHistory };
