const test = require('node:test');
const assert = require('assert');
const axios = require('axios');
const logger = require('../utils/logger');
const apiMonitor = require('../utils/apiMonitor');

apiMonitor.resetMetrics();

// helper to restore
function withPatched(mod, prop, fn, cb) {
  const original = mod[prop];
  mod[prop] = fn;
  return cb().finally(() => { mod[prop] = original; });
}

test('request counts errors', async () => {
  apiMonitor.resetMetrics();
  await withPatched(axios, 'request', async () => { throw new Error('fail'); }, async () => {
    await assert.rejects(() => apiMonitor.request({ url: 'http://x' }));
  });
  const metrics = apiMonitor.getMetrics();
  assert.strictEqual(metrics.errorCount, 1);
});

test('slow requests are logged and counted', async () => {
  apiMonitor.resetMetrics();
  apiMonitor.setSlowThreshold(5);
  let logged = false;
  await withPatched(axios, 'request', async () => {
    await new Promise(r => setTimeout(r, 10));
    return { data: 'ok' };
  }, async () => {
    await withPatched(logger, 'info', () => { logged = true; }, async () => {
      await apiMonitor.request({ url: 'http://x' });
    });
  });
  const metrics = apiMonitor.getMetrics();
  assert.ok(logged);
  assert.strictEqual(metrics.slowResponses, 1);
});
