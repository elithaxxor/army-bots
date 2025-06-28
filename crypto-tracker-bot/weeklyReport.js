const storage = require('./persist/storage');
const sentimentAnalysis = require('./technicalIndicators/sentimentAnalysis');
const slackNotifier = require('./notifier/slackNotifier');
const schedule = require('node-schedule');
const logger = require('./utils/logger');

async function compileReport() {
  const history = storage.getPriceHistory();
  if (history.length === 0) {
    return 'Weekly report: no data available.';
  }

  // Use the last 7 entries as a simple "week" window
  const lastWeek = history.slice(-7);
  const first = lastWeek[0].data;
  const last = lastWeek[lastWeek.length - 1].data;

  const start = first.BTC;
  const end = last.BTC;
  const change = end - start;
  const changePct = start ? (change / start) * 100 : 0;

  let sentiment = '';
  try {
    sentiment = await sentimentAnalysis.analyzeData({ symbol: 'BTC', currentPrice: end, changePercent: changePct });
  } catch (err) {
    logger.error('Sentiment analysis failed:', err);
  }

  const report = `Weekly Market Summary\nBTC price change: ${change.toFixed(2)} USD (${changePct.toFixed(2)}%)\nSentiment: ${sentiment}`;
  return report;
}

async function sendReport() {
  const report = await compileReport();
  await slackNotifier.sendSlackMessage(report);
}

function scheduleReport() {
  const cron = process.env.WEEKLY_REPORT_CRON || '0 9 * * 1';
  schedule.scheduleJob(cron, sendReport);
  logger.info(`Weekly report scheduled with cron: ${cron}`);
}

if (require.main === module) {
  scheduleReport();
}

module.exports = { compileReport, sendReport, scheduleReport };
