/**
 * Lightweight wrapper around Axios used to track request metrics.
 *
 * Each request updates global counters for latency and error counts
 * and logs any calls that exceed the configured threshold. These
 * metrics are later exposed through the `/api/health` endpoint so the
 * dashboard can monitor the health of outbound API calls.
 */
const axios = require('axios');
const logger = require('./logger');

const metrics = {
  totalRequests: 0,
  errorCount: 0,
  totalLatency: 0,
  slowResponses: 0,
};

let slowThreshold = parseInt(process.env.API_MONITOR_SLOW_MS) || 1000;

function setSlowThreshold(ms) {
  slowThreshold = ms;
}

function resetMetrics() {
  metrics.totalRequests = 0;
  metrics.errorCount = 0;
  metrics.totalLatency = 0;
  metrics.slowResponses = 0;
}

function recordLatency(url, start) {
  const latency = Date.now() - start;
  metrics.totalLatency += latency;
  if (latency > slowThreshold) {
    metrics.slowResponses += 1;
    logger.info(`Slow response from ${url} took ${latency}ms`);
  }
}

async function request(config) {
  const start = Date.now();
  metrics.totalRequests += 1;
  try {
    const response = await axios.request(config);
    recordLatency(config.url, start);
    return response;
  } catch (err) {
    metrics.errorCount += 1;
    recordLatency(config.url, start);
    logger.error(`Request to ${config.url} failed:`, err.message);
    throw err;
  }
}

function getMetrics() {
  const avgLatency = metrics.totalRequests ? Math.round(metrics.totalLatency / metrics.totalRequests) : 0;
  return { ...metrics, avgLatency };
}

module.exports = { request, getMetrics, resetMetrics, setSlowThreshold };
