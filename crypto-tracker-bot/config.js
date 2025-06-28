require('dotenv').config();

module.exports = {
  polygonApiKey: process.env.POLYGON_API_KEY,
  finhubApiKey: process.env.FINHUB_API_KEY,
  newsApiKey: process.env.NEWSAPI_KEY,
  discordWebhookUrl: process.env.DISCORD_WEBHOOK_URL,
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
  telegramChatId: process.env.TELEGRAM_CHAT_ID,
  slackWebhookUrl: process.env.SLACK_WEBHOOK_URL,
  chatGPTApiKey: process.env.CHATGPT_API_KEY,
  tiingoApiKey: process.env.TIINGO_API_KEY,
  cryptoPanickApiKey: process.env.CRYPTOPANICK_API_KEY,
  marketeuxApiKey: process.env.MARKETEUX_API_KEY,
  alphaVantageApiKey: process.env.ALPHA_VANTAGE_API_KEY,
  priceMovementThreshold: parseFloat(process.env.PRICE_MOVEMENT_THRESHOLD) || 5,
  pollInterval: parseInt(process.env.POLL_INTERVAL) || 60000,
  storageInterval: parseInt(process.env.STORAGE_INTERVAL) || 300000,
  googleCloudProjectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  googleCloudAccessToken: process.env.GOOGLE_CLOUD_ACCESS_TOKEN,
};
