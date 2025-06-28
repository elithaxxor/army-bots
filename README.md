# Crypto Tracker Bot and Trading Dashboard

This repository contains two complementary projects for monitoring the cryptocurrency market:

1. **Crypto Tracker Bot** – a Node.js bot that fetches prices and news, then sends alerts to Slack, Discord, or Telegram. Optional endpoints provide technical and sentiment analysis.
2. **Trading Dashboard** – a Python/Streamlit application in `trading_bot/` for interactive charting, backtesting, and a basic machine learning signal.

## Installing Dependencies

# Crypto Tools

This repository contains two main projects:

- **Crypto Tracker Bot**: a Node.js service that fetches cryptocurrency prices, monitors news, and sends alerts via Discord, Slack, or Telegram. An optional server exposes sentiment and technical analysis endpoints.
- **Trading Dashboard**: a Python web app built with Streamlit that displays market data, indicators, and machine‑learning signals for popular coins.

A few helper scripts are included, such as `auto_install_and_run.sh` for quickly launching the bot and a simple browser game in `shooting-game/`.

### Node Modules
Navigate to `crypto-tracker-bot/` and install packages:

```bash
cd crypto-tracker-bot
npm install
```

### Python Packages
Install the dashboard requirements (preferably inside a virtual environment):

```bash
pip install -r requirements.txt
```

## Available Scripts

- `npm start` – start the crypto tracker bot.
- `npm run server` – launch the optional analysis server.
- `auto_install_and_run.sh` – install Node modules and run both the bot and server.
- `streamlit run trading_bot/app.py` – start the trading dashboard.

## Running

- **Start the bot:**
  ```bash
  npm start            # from crypto-tracker-bot/
  ```
- **Launch the HTTP server:**
  ```bash
  npm run server       # from crypto-tracker-bot/
  ```
- **Run the trading dashboard:**
  ```bash
  streamlit run trading_bot/app.py
  ```
- **Quick start both bot and server:**
  ```bash
  ./auto_install_and_run.sh
  ```

## Running Tests

### Node Tests

Install dependencies in the bot directory then run the suite:

```bash
cd crypto-tracker-bot
npm install
npm test
```

### Python Tests

Install the Python requirements and execute the tests from the repository root:

```bash
pip install -r requirements.txt
pytest
```

Both suites should pass once the dependencies are installed.

## Directory Overview

```
crypto-tracker-bot/   # Node.js bot, server, and tests
trading_bot/          # Streamlit dashboard and Python tests
auto_install_and_run.sh
requirements.txt      # Python dependencies
```

For more feature ideas, see `PROPOSALS.md`.
