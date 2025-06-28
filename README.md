# Crypto Tracker Bot and Trading Dashboard

This repository contains two complementary projects for monitoring the cryptocurrency market:

1. **Crypto Tracker Bot** – a Node.js bot that fetches prices and news, then sends alerts to Slack, Discord, or Telegram. Optional endpoints provide technical and sentiment analysis.
2. **Trading Dashboard** – a Python/Streamlit application in `trading_bot/` for interactive charting, backtesting, and a basic machine learning signal.

## Installing Dependencies

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

## Running Tests

### Node Tests

Run Jest-based tests from `crypto-tracker-bot/`:

```bash
npm test
```

### Python Tests

Run the dashboard tests with `pytest` from the repository root:

```bash
PYTHONPATH=. pytest
```

Both suites should pass once the respective dependencies are installed.

## Directory Overview

```
crypto-tracker-bot/   # Node.js bot, server, and tests
trading_bot/          # Streamlit dashboard and Python tests
auto_install_and_run.sh
requirements.txt      # Python dependencies
```

For more feature ideas, see `PROPOSALS.md`.
