const test = require('node:test');
const assert = require('assert');
const axios = require('axios');

const { fetchNews } = require('../monitoring/newsTracker');

test('fetchNews returns articles', async () => {
  const original = axios.get;
  axios.get = async () => ({ data: { articles: [{title: 'a'}] } });
  const news = await fetchNews();
  axios.get = original;
  assert.deepStrictEqual(news, [{title: 'a'}]);
});

test('fetchNews throws on request error', async () => {
  const original = axios.get;
  axios.get = async () => { throw new Error('fail'); };
  await assert.rejects(() => fetchNews());
  axios.get = original;
});
