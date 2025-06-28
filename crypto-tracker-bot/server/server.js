const express = require('express');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const imageAnalysis = require('../technicalIndicators/imageAnalysis');
const storage = require('../persist/storage');
const logger = require('../utils/logger');
const apiMonitor = require('../utils/apiMonitor');
const metrics = require('../monitoring/metrics');

// initialize sqlite database
storage.initDatabase();

const app = express();
const port = process.env.PORT || 3000;
const httpServer = http.createServer(app);
const io = new Server(httpServer);

io.on('connection', () => {
  logger.info('Socket.IO client connected');
});

// Forward new price inserts to all clients in real time
storage.emitter.on('insert', (prices) => {
  try {
    io.emit('prices', { data: prices });
  } catch (error) {
    logger.error('Error emitting prices from storage:', error);
  }
});

// Multer setup for image uploads
// Ensure uploads directory exists
fs.mkdirSync('uploads', { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
  })
});

// Serve static files from the client folder
app.use(express.static(path.join(__dirname, '../client')));

const sentimentAnalysis = require('../technicalIndicators/sentimentAnalysis');
const chatGPT = require('../technicalIndicators/chatGPT');

app.post('/upload', upload.single('graphImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    // Extract indicator data from image
    const indicatorData = await imageAnalysis.analyzeGraphImage(req.file.path);

    // Prepare prompt for ChatGPT with extracted data
    const prompt = `Given the following technical indicator data extracted from a financial chart: ${JSON.stringify(indicatorData)}. Please provide a detailed technical analysis including indicator values (e.g., RSI = 39), a summary, and a prediction of price movements based on this analysis and sentiment. Return the response in a digestible format for an end user.`;

    // Call ChatGPT to interpret and generate analysis and prediction
    const chatResponse = await chatGPT.getChatCompletion(prompt);

    // Return both raw indicator data and ChatGPT response
    return res.json({ indicatorData, analysisSummary: chatResponse });
  } catch (error) {
    logger.error("Image upload error:", error);
    res.status(500).json({ error: "Error during analysis" });
  }
});

// API endpoint to get price history for live graph
app.get('/api/price-history', (req, res) => {
  try {
    const history = storage.getPriceHistory();
    res.json({ history });
  } catch (error) {
    logger.error("Error retrieving price history:", error);
    res.status(500).json({ error: "Could not fetch price history" });
  }
});

const config = require('../config');
const cryptoTracker = require('../monitoring/cryptoTracker');
const newsTracker = require('../monitoring/newsTracker');
const vertexSentimentAnalysis = require('../technicalIndicators/vertexSentimentAnalysis');
const newsAggregator = require('../monitoring/newsAggregator');

app.get('/api/technical-analysis', async (req, res) => {
  try {
    const prices = await cryptoTracker.fetchPrices();
    const btcPrice = prices.BTC;
    const prompt = `Provide a comprehensive technical analysis for BTC given the current price is ${btcPrice} USD. Include key technical indicators such as RSI, MACD, Bollinger Bands, SMA, EMA, trend lines, support & resistance levels, Fibonacci retracement, Stochastic Oscillator, volume analysis, and potential breakout patterns. Explain the implications of each indicator on the price movement.`;
    const response = await apiMonitor.request({
      method: 'post',
      url: 'https://api.openai.com/v1/chat/completions',
      data: {
         model: "gpt-3.5-turbo",
         messages: [{ role: "user", content: prompt }]
      },
      headers: {
         'Authorization': `Bearer ${config.chatGPTApiKey}`,
         'Content-Type': 'application/json'
      }
    });
    res.json({ technicalAnalysis: response.data.choices[0].message.content });
  } catch (error) {
    logger.error("Technical analysis error:", error);
    res.status(500).json({ error: "Error performing technical analysis" });
  }
});

app.get('/api/enhanced-sentiment-analysis', async (req, res) => {
  try {
    const prices = await cryptoTracker.fetchPrices();
    const btcPrice = prices.BTC;
    const changePercent = 0; // You can customize or calculate this as needed
    const sentiment = await vertexSentimentAnalysis.analyzeDataWithVertexAI({ symbol: 'BTC', currentPrice: btcPrice, changePercent });
    res.json({ enhancedSentimentAnalysis: sentiment });
  } catch (error) {
    logger.error("Enhanced sentiment analysis error:", error);
    res.status(500).json({ error: "Error performing enhanced sentiment analysis" });
  }
});

app.get('/api/aggregated-news', async (req, res) => {
  try {
    const news = await newsAggregator.fetchAggregatedNews();
    res.json({ news });
  } catch (error) {
    logger.error("Aggregated news error:", error);
    res.status(500).json({ error: "Error fetching aggregated news" });
  }
});

app.get('/api/sentiment-analysis', async (req, res) => {
  try {
    const articles = await newsTracker.fetchNews();
    const headlines = articles.slice(0, 5).map(article => article.title).join('. ');
    const prices = await cryptoTracker.fetchPrices();
    const btcPrice = prices.BTC;
    const prompt = `Analyze the market sentiment for BTC. The current price is ${btcPrice} USD. Recent news headlines include: ${headlines}. Provide a detailed sentiment analysis including possible market impacts.`;
    const response = await apiMonitor.request({
      method: 'post',
      url: 'https://api.openai.com/v1/chat/completions',
      data: {
         model: "gpt-3.5-turbo",
         messages: [{ role: "user", content: prompt }]
      },
      headers: {
         'Authorization': `Bearer ${config.chatGPTApiKey}`,
         'Content-Type': 'application/json'
      }
    });
    res.json({ sentimentAnalysis: response.data.choices[0].message.content });
  } catch (error) {
    logger.error("Sentiment analysis error:", error);
    res.status(500).json({ error: "Error performing sentiment analysis" });
  }
});

app.get('/api/health', (req, res) => {
  res.json(apiMonitor.getMetrics());
});

app.get('/metrics', (req, res) => {
  res.json(metrics.getMetrics());
});

// Emit latest prices to connected clients every 10 seconds
const priceInterval = setInterval(() => {
  try {
    const latest = storage.getLatestPrice();
    if (latest) {
      io.emit('prices', latest);
    }
  } catch (error) {
    logger.error('Error emitting prices:', error);
  }
}, 10000);

function start(p = port, cb) {
  httpServer.listen(p, cb);
}

function close(cb) {
  clearInterval(priceInterval);
  httpServer.close(cb);
}

if (require.main === module) {
  start(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
  });
}

module.exports = { app, httpServer, start, close };
