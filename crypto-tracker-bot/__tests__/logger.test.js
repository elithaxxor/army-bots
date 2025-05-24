const assert = require('assert');
const test = require('node:test');
const logger = require('../utils/logger');

test('logger.info logs messages', () => {
  const logged = [];
  const original = console.log;
  console.log = (...args) => logged.push(args);
  logger.info('hello');
  console.log = original;
  assert(logged.length > 0);
});
