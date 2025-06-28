const test = require('node:test');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const storage = require('../persist/storage');
const dbPath = path.join(__dirname, '../persist/priceHistory.db');

function resetDB() {
  if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
  storage.initDatabase();
}

test('insertPriceHistory stores rows', () => {
  resetDB();
  storage.insertPriceHistory({ BTC: 1 });
  const history = storage.getPriceHistory();
  assert.strictEqual(history.length, 1);
  assert.deepStrictEqual(history[0].data, { BTC: 1 });
});

test('getPriceBefore returns most recent earlier price', () => {
  resetDB();
  storage.insertPriceHistory({ BTC: 2 });
  const target = new Date(Date.now() + 1000);
  const row = storage.getPriceBefore(target);
  assert.deepStrictEqual(row, { BTC: 2 });
});
