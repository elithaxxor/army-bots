import os
from typing import List, Tuple, Optional
import ccxt
from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes

ALLOWED_IDS = [int(uid) for uid in os.getenv("TELEGRAM_USER_IDS", "").split(',') if uid]
TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
API_KEY = os.getenv("BINANCE_API_KEY")
API_SECRET = os.getenv("BINANCE_API_SECRET")

if API_KEY and API_SECRET:
    EXCHANGE = ccxt.binance({'apiKey': API_KEY, 'secret': API_SECRET})
else:
    EXCHANGE = ccxt.binance()

SIMULATED_ORDERS: List[Tuple[str, str, float]] = []


def authorised(user_id: Optional[int]) -> bool:
    return bool(user_id) and (user_id in ALLOWED_IDS)


async def restrict(update: Update) -> bool:
    user_id = update.effective_user.id if update.effective_user else 0
    if not authorised(user_id):
        if update.message:
            await update.message.reply_text("Access denied")
        return False
    return True


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if await restrict(update):
        await update.message.reply_text("Ready to execute trades.")


async def order(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if not await restrict(update):
        return
    if len(context.args) != 3:
        await update.message.reply_text("Usage: /order SIDE SYMBOL AMOUNT")
        return
    side, symbol, amount_str = context.args
    try:
        amount = float(amount_str)
    except ValueError:
        await update.message.reply_text("Invalid amount")
        return
    message: str
    if API_KEY and API_SECRET:
        try:
            order = await context.application.run_in_executor(
                None,
                lambda: EXCHANGE.create_order(symbol, 'market', side.lower(), amount)
            )
            message = f"Executed {side.upper()} {amount} {symbol} (id: {order.get('id', 'n/a')})"
        except Exception as exc:
            message = f"Order failed: {exc}"
    else:
        SIMULATED_ORDERS.append((side, symbol, amount))
        message = f"Simulated {side.upper()} {amount} {symbol}"
    await update.message.reply_text(message)


def main() -> None:
    if not TOKEN:
        raise RuntimeError("TELEGRAM_BOT_TOKEN not set")
    if not ALLOWED_IDS:
        raise RuntimeError("TELEGRAM_USER_IDS not set")
    application = ApplicationBuilder().token(TOKEN).build()
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("order", order))
    application.run_polling()


if __name__ == "__main__":
    main()
