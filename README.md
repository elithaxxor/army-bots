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

## Telegram Bot

The dashboard includes a simple Telegram bot. Configure a bot token and the
allowed user ID then run the script:

```bash
export TELEGRAM_BOT_TOKEN=YOUR_TOKEN
export TELEGRAM_USER_ID=123456789
python trading_bot/telegram_bot.py
```

Within Telegram you can issue `/buy`, `/sell`, and `/simulate_backtest` commands
to trigger actions.

## Running Tests

### Node

Install dependencies in the bot directory then run the Jest suite:

```bash
cd crypto-tracker-bot
npm install
npm test
```

### Python

Install the Python requirements (a virtual environment is recommended) and run the dashboard tests from the repository root:

```bash
pip install -r requirements.txt
PYTHONPATH=. pytest trading_bot/tests
```

Both suites should pass once their dependencies are installed.

## Directory Overview

```
crypto-tracker-bot/   # Node.js bot, server, and tests
trading_bot/          # Streamlit dashboard and Python tests
auto_install_and_run.sh
requirements.txt      # Python dependencies
```

## Custom Strategies

The backtester accepts any strategy class located in `trading_bot/strategies/`.
Create a module in that folder and subclass `Strategy`:

```python
from trading_bot.strategies.base import Strategy
import pandas as pd

class MyStrategy(Strategy):
    def generate_signals(self, df: pd.DataFrame) -> float:
        # Implement trading logic and return a final balance
        return 1.0

```

Run the backtest with your strategy:

```python
from trading_bot.backtester import backtest
from trading_bot.strategies.my_strategy import MyStrategy

result = backtest(df, strategy=MyStrategy())
```

For more feature ideas, see `PROPOSALS.md`.
