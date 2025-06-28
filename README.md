# Crypto Tools

This repository contains two main projects:

- **Crypto Tracker Bot**: a Node.js service that fetches cryptocurrency prices, monitors news, and sends alerts via Discord, Slack, or Telegram. An optional server exposes sentiment and technical analysis endpoints.
- **Trading Dashboard**: a Python web app built with Streamlit that displays market data, indicators, and machine‑learning signals for popular coins.

A few helper scripts are included, such as `auto_install_and_run.sh` for quickly launching the bot and a simple browser game in `shooting-game/`.

## Installation

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
python -m pytest
```

Both suites should pass without failures.

