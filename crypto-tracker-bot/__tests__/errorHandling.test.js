const test = require('node:test');
const assert = require('assert');
const axios = require('axios');

const logger = require('../utils/logger');

// reload modules that depend on config
process.env.SLACK_WEBHOOK_URL = 'http://slack.test';
process.env.DISCORD_WEBHOOK_URL = 'http://discord.test';
process.env.TELEGRAM_BOT_TOKEN = 'token';
process.env.TELEGRAM_CHAT_ID = 'chat';

// clear config cache and reload notifiers
delete require.cache[require.resolve('../config')];
const { sendSlackMessage } = require('../notifier/slackNotifier');
const { sendDiscordMessage } = require('../notifier/discordNotifier');
const { sendTelegramMessage } = require('../notifier/telegramNotifier');
const { fetchPrices } = require('../monitoring/cryptoTracker');
const { fetchNews } = require('../monitoring/newsTracker');


test('fetchPrices logs error when request fails', async () => {
  const originalGet = axios.get;
  const originalError = logger.error;
  const errors = [];
  axios.get = async () => { throw new Error('fail'); };
  logger.error = (...args) => errors.push(args);
  await fetchPrices().catch(() => {});
  axios.get = originalGet;
  logger.error = originalError;
  assert.ok(errors.length > 0);
});

test('fetchNews logs error when request fails', async () => {
  const originalGet = axios.get;
  const originalError = logger.error;
  const errors = [];
  axios.get = async () => { throw new Error('fail'); };
  logger.error = (...args) => errors.push(args);
  await assert.rejects(() => fetchNews());
  axios.get = originalGet;
  logger.error = originalError;
  assert.ok(errors.length > 0);
});

test('sendSlackMessage logs error on failure', async () => {
  const originalPost = axios.post;
  const originalError = logger.error;
  const errors = [];
  axios.post = async () => { throw new Error('fail'); };
  logger.error = (...args) => errors.push(args);
  await sendSlackMessage('hi');
  axios.post = originalPost;
  logger.error = originalError;
  assert.ok(errors.length > 0);
});

test('sendDiscordMessage logs error on failure', async () => {
  const originalPost = axios.post;
  const originalError = logger.error;
  const errors = [];
  axios.post = async () => { throw new Error('fail'); };
  logger.error = (...args) => errors.push(args);
  await sendDiscordMessage('hi');
  axios.post = originalPost;
  logger.error = originalError;
  assert.ok(errors.length > 0);
});

test('sendTelegramMessage logs error on failure', async () => {
  const originalPost = axios.post;
  const originalError = logger.error;
  const errors = [];
  axios.post = async () => { throw new Error('fail'); };
  logger.error = (...args) => errors.push(args);
  await sendTelegramMessage('hello');
  axios.post = originalPost;
  logger.error = originalError;
  assert.ok(errors.length > 0);
});

