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

      // trend alert based on longer window
      const trendDate = new Date(Date.now() - config.trendWindowHours * 60 * 60 * 1000);
      const historicalPrices = storage.getPriceBefore(trendDate);
      if (historicalPrices && historicalPrices[symbol] != null) {
        const pastPrice = historicalPrices[symbol];
        const trendChange = ((currentPrice - pastPrice) / pastPrice) * 100;
        if (Math.abs(trendChange) >= config.trendThreshold) {
          const trendMsg = `${symbol} moved ${trendChange.toFixed(2)}% in the last ${config.trendWindowHours}h.`;
          await discordNotifier.sendDiscordMessage(trendMsg);
          await telegramNotifier.sendTelegramMessage(trendMsg);
          await slackNotifier.sendSlackMessage(trendMsg);
        }
      }
      previousPrices[symbol] = currentPrice;
    }
    storage.insertPriceHistory(prices);
  } catch (error) {
    logger.error("Error checking prices:", error);
  }
}

setInterval(checkPrices, config.pollInterval);

setInterval(async () => {
  try {
    storage.insertPriceHistory(previousPrices);
    logger.info("Periodic data persisted.");
  } catch (error) {
    logger.error("Error in periodic persistence:", error);
  }
}, config.storageInterval);

checkPrices();
