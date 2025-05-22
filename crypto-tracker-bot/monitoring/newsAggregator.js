const axios = require('axios');
const config = require('../config');
const logger = require('../utils/logger');

async function fetchTiingoNews() {
  try {
    const response = await axios.get('https://api.tiingo.com/tiingo/news', {
      headers: { Authorization: `Token ${config.tiingoApiKey}` },
      params: { tickers: 'BTC,ETH,LTC,DOGE,SHIB', limit: 10 }
    });
    return response.data.map(item => ({
      source: 'Tiingo',
      title: item.title,
      url: item.url,
      publishedAt: new Date(item.publishedAt)
    }));
  } catch (error) {
    logger.error('Error fetching Tiingo news:', error);
    return [];
  }
}

async function fetchNewsAPI() {
  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: 'cryptocurrency OR bitcoin OR ethereum OR meme coin',
        apiKey: config.newsApiKey,
        language: 'en',
        pageSize: 10,
        sortBy: 'publishedAt'
      }
    });
    return response.data.articles.map(item => ({
      source: 'NewsAPI',
      title: item.title,
      url: item.url,
      publishedAt: new Date(item.publishedAt)
    }));
  } catch (error) {
    logger.error('Error fetching NewsAPI news:', error);
    return [];
  }
}

async function fetchCryptoPanickNews() {
  try {
    const response = await axios.get('https://cryptopanick.com/api/news', {
      params: { limit: 10, apiKey: config.cryptoPanickApiKey }
    });
    return response.data.articles.map(item => ({
      source: 'CryptoPanick',
      title: item.title,
      url: item.url,
      publishedAt: new Date(item.publishedAt)
    }));
  } catch (error) {
    logger.error('Error fetching CryptoPanick news:', error);
    return [];
  }
}

async function fetchMarketeuxNews() {
  try {
    const response = await axios.get('https://api.marketeux.com/news', {
      params: { limit: 10, apiKey: config.marketeuxApiKey }
    });
    return response.data.articles.map(item => ({
      source: 'Marketeux',
      title: item.title,
      url: item.url,
      publishedAt: new Date(item.publishedAt)
    }));
  } catch (error) {
    logger.error('Error fetching Marketeux news:', error);
    return [];
  }
}

async function fetchAlphaVantageNews() {
  try {
    const response = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'NEWS_SENTIMENT',
        tickers: 'BTC,ETH,LTC,DOGE,SHIB',
        apikey: config.alphaVantageApiKey
      }
    });
    return response.data.feed.map(item => ({
      source: 'AlphaVantage',
      title: item.title,
      url: item.url,
      publishedAt: new Date(item.time_published * 1000)
    }));
  } catch (error) {
    logger.error('Error fetching AlphaVantage news:', error);
    return [];
  }
}

async function fetchCoinGeckoNews() {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/news');
    return response.data.data.map(item => ({
      source: 'CoinGecko',
      title: item.title,
      url: item.url,
      publishedAt: new Date(item.date)
    }));
  } catch (error) {
    logger.error('Error fetching CoinGecko news:', error);
    return [];
  }
}

async function fetchAggregatedNews() {
  const newsSources = await Promise.all([
    fetchTiingoNews(),
    fetchNewsAPI(),
    fetchCryptoPanickNews(),
    fetchMarketeuxNews(),
    fetchAlphaVantageNews(),
    fetchCoinGeckoNews()
  ]);
  const allNews = newsSources.flat();
  // Sort by published date descending
  allNews.sort((a, b) => b.publishedAt - a.publishedAt);
  return allNews;
}

module.exports = { fetchAggregatedNews };
