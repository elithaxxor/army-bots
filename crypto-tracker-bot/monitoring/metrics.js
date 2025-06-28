const metrics = {};

function recordRequest(apiName, durationMs, isError) {
  if (!metrics[apiName]) {
    metrics[apiName] = { count: 0, errorCount: 0, totalDuration: 0 };
  }
  metrics[apiName].count += 1;
  metrics[apiName].totalDuration += durationMs;
  if (isError) {
    metrics[apiName].errorCount += 1;
  }
}

function getMetrics() {
  const result = {};
  for (const [name, data] of Object.entries(metrics)) {
    result[name] = {
      count: data.count,
      errorCount: data.errorCount,
      avgDuration: data.count ? Math.round(data.totalDuration / data.count) : 0
    };
  }
  return result;
}

function resetMetrics() {
  for (const key of Object.keys(metrics)) {
    delete metrics[key];
  }
}

module.exports = { recordRequest, getMetrics, resetMetrics };
