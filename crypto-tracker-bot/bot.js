const config = require('./config');
const cryptoTracker = require('./monitoring/cryptoTracker');
const newsTracker = require('./monitoring/newsTracker');
const discordNotifier = require('./notifier/discordNotifier');
const telegramNotifier = require('./notifier/telegramNotifier');
const slackNotifier = require('./notifier/slackNotifier');
const storage = require('./persist/storage');
const logger = require('./utils/logger');
const sentimentAnalysis = require('./technicalIndicators/sentimentAnalysis');

// initialize the sqlite database
storage.initDatabase();

let previousPrices = {};

// User customizable alert settings per asset
const alertSettings = {
  BTC: { percentThreshold: 2, dollarThreshold: 100 },
  ETH: { percentThreshold: 3, dollarThreshold: 50 },
  LTC: { percentThreshold: 5, dollarThreshold: 10 },
  DOGE: { percentThreshold: 10, dollarThreshold: 0.01 },
  SHIB: { percentThreshold: 15, dollarThreshold: 0.000001 },
  // Add more assets and thresholds as needed
};

async function checkPrices() {
  try {
    const prices = await cryptoTracker.fetchPrices();
    for (const symbol of Object.keys(prices)) {
      const currentPrice = prices[symbol];
      const previousPrice = previousPrices[symbol] || currentPrice;
      const changePercent = ((currentPrice - previousPrice) / previousPrice) * 100;
      const changeDollar = currentPrice - previousPrice;

      const settings = alertSettings[symbol] || { percentThreshold: config.priceMovementThreshold, dollarThreshold: null };

      const percentExceeded = settings.percentThreshold !== null && Math.abs(changePercent) >= settings.percentThreshold;
      const dollarExceeded = settings.dollarThreshold !== null && Math.abs(changeDollar) >= settings.dollarThreshold;

      if (percentExceeded || dollarExceeded) {
        const message = `Price Alert for ${symbol}: ${currentPrice.toFixed(6)} USD (${changePercent.toFixed(2)}% / ${changeDollar.toFixed(6)} USD change)`;
        await discordNotifier.sendDiscordMessage(message);
        await telegramNotifier.sendTelegramMessage(message);
        await slackNotifier.sendSlackMessage(message);
        logger.info(`Notification sent for ${symbol}`);

        const sentimentResult = await sentimentAnalysis.analyzeData({ symbol, currentPrice, changePercent, changeDollar });
        logger.info(`Sentiment Analysis for ${symbol}: ${sentimentResult}`);
      }
      previousPrices[symbol] = currentPrice;
    }
    await storage.insertPriceHistory(prices);
  } catch (error) {
    logger.error("Error checking prices:", error);
  }
}

setInterval(checkPrices, config.pollInterval);

setInterval(async () => {
  try {
    await storage.insertPriceHistory(previousPrices);
    logger.info("Periodic data persisted.");
  } catch (error) {
    logger.error("Error in periodic persistence:", error);
  }
}, config.storageInterval);

checkPrices();
