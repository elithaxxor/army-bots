# Crypto Tracker Bot and Trading Dashboard

This repository contains two projects:

1. **Crypto Tracker Bot** – a Node.js service that fetches prices and news and sends alerts via Slack, Discord, or Telegram. An optional server exposes sentiment and technical analysis endpoints.
2. **Trading Dashboard** – a Python/Streamlit application found in `trading_bot/` that offers charts, backtesting, and basic machine-learning signals.

## Installing Dependencies

Install Node modules:

```bash
cd crypto-tracker-bot
npm install
```

Install Python packages (a virtual environment is recommended):

```bash
pip install -r requirements.txt
```

## Available Scripts

- `npm start` – start the crypto tracker bot
- `npm run server` – launch the optional analysis server
- `auto_install_and_run.sh` – install Node modules and run both the bot and server
- `streamlit run trading_bot/app.py` – start the trading dashboard

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
## Running Tests

### Node
Run all Jest tests from `crypto-tracker-bot`:

```bash
cd crypto-tracker-bot
npm install
npm test
```

### Python Tests

Before running the Python tests, create and activate a virtual environment then install the requirements:
```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```
After the dependencies are installed, execute the suite:


Install the Python requirements and execute the tests from the repository root:
### Python
Run the dashboard tests from the repository root:

```bash
pip install -r requirements.txt
pytest
```

Both suites should pass once the dependencies are installed.
Both suites should pass once their dependencies are installed.

## Directory Overview

```
crypto-tracker-bot/   # Node.js bot, server, and tests
trading_bot/          # Streamlit dashboard and Python tests
auto_install_and_run.sh
requirements.txt      # Python dependencies
```

For more feature ideas, see `PROPOSALS.md`.
