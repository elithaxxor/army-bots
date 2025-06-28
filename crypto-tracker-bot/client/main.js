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

  // Charts for sentiment and technical analysis
  let sentimentChart;
  let technicalChart;

  function updateSentimentChart(text) {
    const positive = (text.match(/positive|bullish/gi) || []).length;
    const negative = (text.match(/negative|bearish/gi) || []).length;
    const neutral = Math.max(0, text.length ? text.split(/\s+/).length - positive - negative : 0);
    const ctx = document.getElementById('sentiment-graphical').getContext('2d');
    if (!sentimentChart) {
      sentimentChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Positive', 'Negative', 'Neutral'],
          datasets: [{
            label: 'Sentiment',
            backgroundColor: ['#28a745', '#dc3545', '#6c757d'],
            data: [positive, negative, neutral]
          }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });
    } else {
      sentimentChart.data.datasets[0].data = [positive, negative, neutral];
      sentimentChart.update();
    }
  }

  function updateTechnicalChart(text) {
    const indicators = {
      RSI: parseFloat((text.match(/RSI[^0-9]*([0-9]+(?:\.[0-9]+)?)/i) || [])[1]) || 0,
      MACD: parseFloat((text.match(/MACD[^0-9-]*([-0-9]+(?:\.[0-9]+)?)/i) || [])[1]) || 0,
      SMA: parseFloat((text.match(/SMA[^0-9]*([0-9]+(?:\.[0-9]+)?)/i) || [])[1]) || 0,
      EMA: parseFloat((text.match(/EMA[^0-9]*([0-9]+(?:\.[0-9]+)?)/i) || [])[1]) || 0
    };

    const ctx = document.getElementById('technical-graphical').getContext('2d');
    const labels = Object.keys(indicators);
    const values = Object.values(indicators);

    if (!technicalChart) {
      technicalChart = new Chart(ctx, {
        type: 'radar',
        data: {
          labels,
          datasets: [{
            label: 'Indicators',
            backgroundColor: 'rgba(54,162,235,0.2)',
            borderColor: 'rgba(54,162,235,1)',
            data: values
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: { r: { beginAtZero: true, max: 100 } }
        }
      });
    } else {
      technicalChart.data.labels = labels;
      technicalChart.data.datasets[0].data = values;
      technicalChart.update();
    }
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
      const sentimentEl = document.getElementById('sentiment-text');
      sentimentEl.textContent = '';
      sentimentEl.append(document.createTextNode(sentimentData.sentimentAnalysis || 'No sentiment data'));
      document.getElementById('technical-text').textContent = technicalData.technicalAnalysis || 'No technical data';

      // Display enhanced sentiment analysis text
      const enhancedSentimentDiv = document.createElement('div');
      enhancedSentimentDiv.textContent = enhancedSentimentData.enhancedSentimentAnalysis || 'No enhanced sentiment data';
      enhancedSentimentDiv.style.marginTop = '1em';
      enhancedSentimentDiv.style.fontWeight = 'bold';
      sentimentEl.appendChild(enhancedSentimentDiv);

      // Render graphical sentiment and technical indicators
      updateSentimentChart(sentimentData.sentimentAnalysis);
      updateTechnicalChart(technicalData.technicalAnalysis);

    } catch (error) {
      console.error('Error fetching analysis:', error);
    }
  }

  // Initial live data update and interval
  updateLiveData();
  setInterval(updateLiveData, 10000);
});
