# Crypto Tracker Bot

This bot monitors cryptocurrency prices, tracks news, and provides notifications through various channels. The project includes an optional server that exposes endpoints for technical analysis and sentiment evaluation.

## Required Environment Variables

Set the following variables in a `.env` file inside `crypto-tracker-bot/`:

- `CHATGPT_API_KEY` – API key for interacting with ChatGPT
- `POLYGON_API_KEY` – Polygon.io API key for price data
- `FINNHUB_API_KEY` – Key for Finhub data
- `NEWSAPI_KEY` – News API token for news headlines
- `DISCORD_WEBHOOK_URL` – Discord webhook URL for notifications
- `TELEGRAM_BOT_TOKEN` – Telegram bot token used to send messages
- `TELEGRAM_CHAT_ID` – Telegram chat ID where messages will be sent. Set this to the desired chat or channel ID.
- `SLACK_WEBHOOK_URL` – Slack webhook URL for alerts
- `PUSHOVER_TOKEN` – Pushover application token used for notifications
- `PUSHOVER_USER_KEY` – Pushover user key to deliver messages
- `TIINGO_API_KEY` – Tiingo API token for additional news data
- `CRYPTO_PANICK_API_KEY` – API key for CryptoPanick news
- `MARKETEUX_API_KEY` – Marketeux API key for curated articles
- `ALPHA_VANTAGE_API_KEY` – Alpha Vantage API key for sentiment feed
- `PRICE_MOVEMENT_THRESHOLD` – Default percent change that triggers alerts (optional)
- `TREND_THRESHOLD` – Percent change over the trend window required for trend alerts (optional)
- `TREND_WINDOW_HOURS` – Number of hours used to calculate trend percentage (optional)
- `POLL_INTERVAL` – How often prices are fetched in milliseconds (optional)
- `STORAGE_INTERVAL` – Interval for persisting price history in milliseconds (optional)
- `GOOGLE_CLOUD_PROJECT_ID` – Google Cloud project ID used by Vertex AI
- `GOOGLE_CLOUD_ACCESS_TOKEN` – Access token for the Google Cloud Vertex API
- `PORT` – Port where the optional server listens (defaults to `3000`)

### Pushover Notifications

1. Create an account at [Pushover](https://pushover.net/) and create a new application.
2. Note the application token and your user key.
3. Add `PUSHOVER_TOKEN` and `PUSHOVER_USER_KEY` to the `.env` file.
4. Restart the bot to enable Pushover alerts.

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

 The server listens on port `3000` by default. Set the `PORT` environment variable to use a different port.

## Running Tests

This project uses Node's built-in test runner. The `npm test` command simply
executes `node --test=__tests__`:
This project uses Node's built-in test runner. The `npm test` command executes
`node --test=__tests__`, running all files in the `__tests__/` directory.

```bash
npm test
```

Make sure dependencies are installed before running tests.


## Weekly Market Reports

The optional `weeklyReport.js` script compiles a short summary of recent prices and sentiment. By default it runs every Monday at 9 AM using `node-schedule`. Set the `WEEKLY_REPORT_CRON` environment variable to customise the schedule with a standard cron expression.

Run the report manually with:

```bash
npm run weekly-report
```
