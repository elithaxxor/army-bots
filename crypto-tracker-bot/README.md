# Crypto Tracker Bot

This bot monitors cryptocurrency prices, tracks news, and provides notifications through various channels. The project includes an optional server that exposes endpoints for technical analysis and sentiment evaluation.

## Required Environment Variables

Set the following variables in a `.env` file inside `crypto-tracker-bot/`:

- `CHATGPT_API_KEY` – API key for interacting with ChatGPT
- `POLYGON_API_KEY` – Polygon.io API key for price data
- `FINHUB_API_KEY` – Key for Finhub data
- `NEWSAPI_KEY` – News API token for news headlines
- `DISCORD_WEBHOOK_URL` – Discord webhook URL for notifications
- `TELEGRAM_BOT_TOKEN` – Telegram bot token used to send messages
- `SLACK_WEBHOOK_URL` – Slack webhook URL for alerts
- `PRICE_MOVEMENT_THRESHOLD` – Default percent change that triggers alerts (optional)
- `POLL_INTERVAL` – How often prices are fetched in milliseconds (optional)
- `STORAGE_INTERVAL` – Interval for persisting price history in milliseconds (optional)
- `GOOGLE_CLOUD_PROJECT_ID` – Google Cloud project ID used by Vertex AI
- `GOOGLE_CLOUD_ACCESS_TOKEN` – Access token for the Google Cloud Vertex API

## Running the Bot

Install dependencies and start the bot from the `crypto-tracker-bot` directory:

```bash
npm install
npm start
```

## Running the Server

To start the HTTP server that exposes analysis endpoints, run:

```bash
npm run server
```

The server listens on port `3000` by default.

## Running Tests

Unit tests are executed with Jest:

```bash
npm test
```

Ensure dependencies are installed before running tests.

