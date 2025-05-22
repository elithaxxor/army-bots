#!/bin/bash

# Auto install dependencies and run the crypto tracker bot project

echo "Installing npm dependencies..."
npm install

echo "Starting the bot..."
# Run the bot in the background
node crypto-tracker-bot/bot.js &

echo "Starting the server..."
# Run the server in the background
node crypto-tracker-bot/server/server.js &

echo "All processes started. You can access the UI at http://localhost:3000"
