const test = require('node:test');
const assert = require('assert');
const http = require('http');

const metrics = require('../monitoring/metrics');
const server = require('../server/server');

async function get(path, port) {
  return new Promise((resolve, reject) => {
    http.get({ hostname: 'localhost', port, path }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(data) }));
    }).on('error', reject);
  });
}

test('metrics endpoint returns recorded metrics', async () => {
  metrics.resetMetrics();
  await new Promise(res => server.start(0, res));
  const port = server.httpServer.address().port;
  metrics.recordRequest('testAPI', 50, false);
  const res = await get('/metrics', port);
  await new Promise(r => server.close(r));
  assert.strictEqual(res.status, 200);
  assert.ok(res.body.testAPI);
  assert.strictEqual(res.body.testAPI.count, 1);
});
