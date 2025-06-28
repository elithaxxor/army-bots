document.addEventListener('DOMContentLoaded', () => {
  const toAnalysisBtn = document.getElementById('to-analysis');
  const toGraphBtn = document.getElementById('to-graph');
  const graphView = document.getElementById('graph-view');
  const analysisView = document.getElementById('analysis-view');
  const livePriceSpan = document.getElementById('live-price');
  const notificationLeft = document.getElementById('notification-left');
  const notificationRight = document.getElementById('notification-right');
  const ticker = document.getElementById('ticker');
  let sentimentChart;
  let technicalChart;
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

  function calculateSentimentCounts(text) {
    const positiveWords = ['bullish', 'positive', 'buy', 'growth', 'uptrend'];
    const negativeWords = ['bearish', 'negative', 'sell', 'downtrend', 'decline'];
    const lower = text.toLowerCase();
    const countWords = (words) => words.reduce((acc, w) => acc + (lower.match(new RegExp(w, 'g')) || []).length, 0);
    return {
      positive: countWords(positiveWords),
      negative: countWords(negativeWords)
    };
  }

  function parseTechnicalIndicators(text) {
    const indicators = {};
    const capture = (label) => {
      const regex = new RegExp(label + "[^0-9-]*(-?\\d+(?:\\.\\d+)?)", 'i');
      const m = text.match(regex);
      if (m) indicators[label.toUpperCase()] = parseFloat(m[1]);
    };
    ['RSI', 'MACD', 'SMA', 'EMA'].forEach(capture);
    return indicators;
  }


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

      // Render graphical sentiment and technical indicators
      const sentimentCounts = calculateSentimentCounts(sentimentData.sentimentAnalysis || '');
      const sentimentCtx = document.getElementById('sentiment-graphical').getContext('2d');
      if (!sentimentChart) {
        sentimentChart = new Chart(sentimentCtx, {
          type: 'bar',
          data: {
            labels: ['Positive', 'Negative'],
            datasets: [{
              label: 'Sentiment Words',
              data: [sentimentCounts.positive, sentimentCounts.negative],
              backgroundColor: ['#28a745', '#dc3545']
            }]
          },
          options: { responsive: true, maintainAspectRatio: false }
        });
      } else {
        sentimentChart.data.datasets[0].data = [sentimentCounts.positive, sentimentCounts.negative];
        sentimentChart.update();
      }

      const techIndicators = parseTechnicalIndicators(technicalData.technicalAnalysis || '');
      const techCtx = document.getElementById('technical-graphical').getContext('2d');
      const techLabels = Object.keys(techIndicators);
      const techValues = Object.values(techIndicators);
      if (!technicalChart) {
        technicalChart = new Chart(techCtx, {
          type: 'bar',
          data: {
            labels: techLabels,
            datasets: [{
              label: 'Indicator Values',
              data: techValues,
              backgroundColor: '#007bff'
            }]
          },
          options: { responsive: true, maintainAspectRatio: false }
        });
      } else {
        technicalChart.data.labels = techLabels;
        technicalChart.data.datasets[0].data = techValues;
        technicalChart.update();
      }

    } catch (error) {
      console.error('Error fetching analysis:', error);
    }
  }

  // Initial live data update and interval
  updateLiveData();
  setInterval(updateLiveData, 10000);
});
