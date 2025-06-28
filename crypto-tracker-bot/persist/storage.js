const path = require('path');
const Database = require('better-sqlite3');
const logger = require('../utils/logger');

let db;

function initDatabase() {
  if (db) return db;
  const dbPath = path.join(__dirname, 'priceHistory.db');
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.prepare(`CREATE TABLE IF NOT EXISTS price_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT NOT NULL,
      prices TEXT NOT NULL
  )`).run();
  return db;
}

function insertPriceHistory(prices) {
  try {
    const database = initDatabase();
    const stmt = database.prepare('INSERT INTO price_history (timestamp, prices) VALUES (?, ?)');
    stmt.run(new Date().toISOString(), JSON.stringify(prices));
  } catch (error) {
    logger.error('Failed to insert price history:', error);
    throw error;
  }
}

function getPriceHistory() {
  try {
    const database = initDatabase();
    const rows = database.prepare('SELECT timestamp, prices FROM price_history ORDER BY id').all();
    return rows.map(row => ({ timestamp: row.timestamp, data: JSON.parse(row.prices) }));
  } catch (error) {
    logger.error('Failed to read price history:', error);
    throw error;
  }
}

function getLatestPrice() {
  try {
    const database = initDatabase();
    const row = database.prepare('SELECT timestamp, prices FROM price_history ORDER BY id DESC LIMIT 1').get();
    if (!row) return null;
    return { timestamp: row.timestamp, data: JSON.parse(row.prices) };
  } catch (error) {
    logger.error('Failed to read latest price:', error);
    throw error;
  }
}

module.exports = { initDatabase, insertPriceHistory, getPriceHistory, getLatestPrice };
