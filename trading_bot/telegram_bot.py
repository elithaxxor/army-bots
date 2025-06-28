import os
from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes

from .data_fetcher import DataFetcher
from .indicator_calculator import add_indicators
from .backtester import backtest

ALLOWED_ID = int(os.getenv("TELEGRAM_USER_ID", "0"))

fetcher = DataFetcher()

async def restrict(update: Update) -> bool:
    """Return True if the user is authorised."""
    user_id = update.effective_user.id if update.effective_user else 0
    if user_id != ALLOWED_ID:
        if update.message:
            await update.message.reply_text("Access denied")
        return False
    return True

async def buy(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if not await restrict(update):
        return
    if len(context.args) != 2:
        await update.message.reply_text("Usage: /buy SYMBOL AMOUNT")
        return
    symbol, amount = context.args
    await update.message.reply_text(f"Buying {amount} of {symbol}")

async def sell(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if not await restrict(update):
        return
    if len(context.args) != 2:
        await update.message.reply_text("Usage: /sell SYMBOL AMOUNT")
        return
    symbol, amount = context.args
    await update.message.reply_text(f"Selling {amount} of {symbol}")

async def simulate_backtest(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if not await restrict(update):
        return
    df = fetcher.get_ohlcv(limit=200)
    df = add_indicators(df)
    result = backtest(df)
    await update.message.reply_text(f"Backtest balance: {result:.2f}")


def main() -> None:
    token = os.getenv("TELEGRAM_BOT_TOKEN")
    if not token:
        raise RuntimeError("TELEGRAM_BOT_TOKEN not set")
    application = ApplicationBuilder().token(token).build()
    application.add_handler(CommandHandler("buy", buy))
    application.add_handler(CommandHandler("sell", sell))
    application.add_handler(CommandHandler("simulate_backtest", simulate_backtest))
    application.run_polling()


if __name__ == "__main__":
    main()
