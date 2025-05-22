document.addEventListener('DOMContentLoaded', () => {
  const toAnalysisBtn = document.getElementById('to-analysis');
  const toGraphBtn = document.getElementById('to-graph');
  const graphView = document.getElementById('graph-view');
  const analysisView = document.getElementById('analysis-view');
  const livePriceSpan = document.getElementById('live-price');
  const notificationLeft = document.getElementById('notification-left');
  const notificationRight = document.getElementById('notification-right');
  const ticker = document.getElementById('ticker');
        ` `
  // Initialize TradingView widget
  new TradingView.widget({
    container_id: "tradingview_chart",
    autosize: true,
    symbol: "BINANCE:BTCUSDT",
    interval: "1",
    timezone: "Etc/UTC",
    theme: "light",
    style: "1",
    locale: "en",
    toolbar_bg: "#f1f3f6",
    enable_publishing: false,
    allow_symbol_change: true,
    watchlist: ["BTCUSDT", "ETHUSDT", "LTCUSDT", "DOGEUSDT", "SHIBUSDT"],
    details: true,
    hotlist: true,
    calendar: true,
    news: ["headlines"],
  });

  // Function to update live price and notifications
  async function updateLiveData() {
    try {
      const response = await fetch('/api/price-history');
      const data = await response.json();
      if (data.history && data.history.length > 0) {
        const latest = data.history[data.history.length - 1].data;
        if (latest.BTC) {
          livePriceSpan.textContent = `BTC: $${latest.BTC.toFixed(2)}`;
          notificationLeft.textContent = `BTC Price: $${latest.BTC.toFixed(2)}`;
        }
        if (latest.ETH) {
          notificationRight.textContent = `ETH Price: $${latest.ETH.toFixed(2)}`;
        }
        updateTicker(latest);
      }
    } catch (error) {
      console.error('Error updating live data:', error);
    }
  }

  // Rotating ticker implementation
  let tickerIndex = 0;
  let tickerCoins = ['BTC', 'ETH', 'LTC', 'DOGE', 'SHIB', 'MATIC', 'LINK', 'AAVE', 'GRT', 'SAND'];

  function updateTicker(latestPrices) {
    if (!latestPrices) return;
    const coin = tickerCoins[tickerIndex % tickerCoins.length];
    const price = latestPrices[coin];
    if (price) {
      ticker.textContent = `${coin}: $${price.toFixed(4)}`;
    }
    tickerIndex++;
  }

  setInterval(() => {
    updateLiveData();
  }, 10000);

  setInterval(() => {
    updateTicker();
  }, 3000);

  // Toggle views
  toAnalysisBtn.addEventListener('click', () => {
    graphView.style.display = 'none';
    analysisView.style.display = 'block';
    fetchAnalysis();
  });

  toGraphBtn.addEventListener('click', () => {
    analysisView.style.display = 'none';
    graphView.style.display = 'block';
  });

  // Fetch and display sentiment and technical analysis
  async function fetchAnalysis() {
    try {
      const [sentimentRes, technicalRes, enhancedSentimentRes] = await Promise.all([
        fetch('/api/sentiment-analysis'),
        fetch('/api/technical-analysis'),
        fetch('/api/enhanced-sentiment-analysis')
      ]);
      const sentimentData = await sentimentRes.json();
      const technicalData = await technicalRes.json();
      const enhancedSentimentData = await enhancedSentimentRes.json();

      // Display text analysis
      document.getElementById('sentiment-text').textContent = sentimentData.sentimentAnalysis || 'No sentiment data';
      document.getElementById('technical-text').textContent = technicalData.technicalAnalysis || 'No technical data';

      // Display enhanced sentiment analysis text
      const enhancedSentimentDiv = document.createElement('div');
      enhancedSentimentDiv.textContent = enhancedSentimentData.enhancedSentimentAnalysis || 'No enhanced sentiment data';
      enhancedSentimentDiv.style.marginTop = '1em';
      enhancedSentimentDiv.style.fontWeight = 'bold';
      document.getElementById('sentiment-text').appendChild(enhancedSentimentDiv);

      // TODO: Render graphical sentiment and technical indicators here
      document.getElementById('sentiment-graphical').textContent = '[Graphical sentiment visualization coming soon]';
      document.getElementById('technical-graphical').textContent = '[Graphical technical indicators coming soon]';

    } catch (error) {
      console.error('Error fetching analysis:', error);
    }
  }

  // Initial live data update and interval
  updateLiveData();
  setInterval(updateLiveData, 10000);
});
