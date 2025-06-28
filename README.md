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

## Running Tests

### Node Tests

Run Jest-based tests from `crypto-tracker-bot/`:

```bash
npm test
```

### Python Tests

Run the dashboard tests with `pytest` from the repository root:
=======
### Node (Crypto Tracker Bot)
1. Navigate to the bot directory:
   ```bash
   cd crypto-tracker-bot
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file using the variables listed in `crypto-tracker-bot/README.md`.

### Python (Trading Dashboard)
1. It is recommended to use a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate
   ```
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

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

## Tests

### Node Tests
Run unit tests for the tracker bot:
```bash
cd crypto-tracker-bot
npm test
```

### Python Tests
Activate your environment and execute:
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
python -m pytest
```

Both suites should pass without failures.

The dashboard fetches real-time market data, displays technical analysis, sentiment, and a simple machine learning signal. You can also run a backtest from the sidebar.

## Running Tests

Python unit tests are located under `trading_bot/tests`. Before executing them, install the required Python dependencies:

```bash
pip install -r requirements.txt
```

Then run the test suite from the repository root:

```bash
PYTHONPATH=. pytest
```

