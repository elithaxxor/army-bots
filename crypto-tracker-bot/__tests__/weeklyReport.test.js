const test = require('node:test');
const assert = require('assert');

const weekly = require('../weeklyReport');
const storage = require('../persist/storage');
const sentimentAnalysis = require('../technicalIndicators/sentimentAnalysis');
const slackNotifier = require('../notifier/slackNotifier');

// stub data
storage.getPriceHistory = () => [
  { timestamp: 't1', data: { BTC: 100 } },
  { timestamp: 't2', data: { BTC: 110 } }
];

sentimentAnalysis.analyzeData = async () => 'Positive';

test('compileReport returns summary string', async () => {
  const report = await weekly.compileReport();
  assert.ok(report.includes('BTC price change: 10.00 USD (10.00%)'));
  assert.ok(report.includes('Positive'));
});

test('sendReport posts to slack', async () => {
  const messages = [];
  slackNotifier.sendSlackMessage = async msg => messages.push(msg);
  await weekly.sendReport();
  assert.strictEqual(messages.length, 1);
});
