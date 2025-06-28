const test = require('node:test');
const assert = require('assert');
const axios = require('axios');

// module under test
const { fetchPrices } = require('../monitoring/cryptoTracker');

test('fetchPrices returns prices for all coins', async () => {
  const original = axios.get;
  const calls = [];
  axios.get = async url => {
    calls.push(url);
    return { data: { last: { price: 42 } } };
  };
  const prices = await fetchPrices();
  axios.get = original;
  const coins = ['BTC', 'ETH', 'LTC', 'DOGE', 'SHIB', 'MATIC', 'LINK', 'AAVE', 'GRT', 'SAND'];
  assert.strictEqual(calls.length, coins.length);
  for (const coin of coins) {
    assert.strictEqual(prices[coin], 42);
  }
});

test('fetchPrices sets null when a request fails', async () => {
  const original = axios.get;
  let count = 0;
  axios.get = async () => {
    count++;
    if (count === 2) throw new Error('fail');
    return { data: { last: { price: count } } };
  };
  const prices = await fetchPrices();
  axios.get = original;
  assert.strictEqual(prices.BTC, 1);
  assert.strictEqual(prices.ETH, null);
});
