const test = require('node:test');
const assert = require('node:assert/strict');
const logger = require('../utils/logger');

test('logger.info logs messages', () => {
  let called = false;
  const original = console.log;
  console.log = () => { called = true; };
  logger.info('hello');
  console.log = original;
  assert.ok(called);
});
