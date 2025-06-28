const test = require('node:test');
const assert = require('assert');
const axios = require('axios');

// prepare env vars for config
process.env.SLACK_WEBHOOK_URL = 'http://slack.test';
process.env.DISCORD_WEBHOOK_URL = 'http://discord.test';
process.env.TELEGRAM_BOT_TOKEN = 'token';
process.env.PUSHOVER_TOKEN = 'apptoken';
process.env.PUSHOVER_USER_KEY = 'userkey';

// reload config-dependent modules
delete require.cache[require.resolve('../config')];
const { sendSlackMessage } = require('../notifier/slackNotifier');
const { sendDiscordMessage } = require('../notifier/discordNotifier');
const { sendTelegramMessage } = require('../notifier/telegramNotifier');
const { sendPushoverMessage } = require('../notifier/pushoverNotifier');
const config = require('../config');

test('sendSlackMessage posts to webhook', async () => {
  const original = axios.post;
  const calls = [];
  axios.post = async (url, payload) => { calls.push({url, payload}); };
  await sendSlackMessage('hi');
  axios.post = original;
  assert.deepStrictEqual(calls[0], { url: config.slackWebhookUrl, payload: { text: 'hi' } });
});

test('sendDiscordMessage posts to webhook', async () => {
  const original = axios.post;
  const calls = [];
  axios.post = async (url, payload) => { calls.push({url, payload}); };
  await sendDiscordMessage('hi');
  axios.post = original;
  assert.deepStrictEqual(calls[0], { url: config.discordWebhookUrl, payload: { content: 'hi' } });
});

test('sendTelegramMessage posts to API', async () => {
  const original = axios.post;
  const calls = [];
  axios.post = async (url, payload) => { calls.push({url, payload}); };
  await sendTelegramMessage('hello');
  axios.post = original;
  assert.ok(calls[0].url.includes('api.telegram.org/bot' + config.telegramBotToken));
  assert.strictEqual(calls[0].payload.text, 'hello');
});

test('sendPushoverMessage posts to API', async () => {
  const original = axios.post;
  const calls = [];
  axios.post = async (url, payload) => { calls.push({url, payload}); };
  await sendPushoverMessage('push');
  axios.post = original;
  assert.strictEqual(calls[0].url, 'https://api.pushover.net/1/messages.json');
  assert.strictEqual(calls[0].payload.token, config.pushoverToken);
  assert.strictEqual(calls[0].payload.user, config.pushoverUserKey);
  assert.strictEqual(calls[0].payload.message, 'push');
});
