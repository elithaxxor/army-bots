import ccxt
import pandas as pd
from datetime import datetime

class DataFetcher:
    """Fetches market data from Binance via ccxt."""

    def __init__(self, exchange: str = "binance"):
        self.exchange = getattr(ccxt, exchange)()

    def get_current_price(self, symbol: str = "BTC/USDT") -> float:
        """Return the latest traded price for a symbol."""
        ticker = self.exchange.fetch_ticker(symbol)
        return ticker['last']

    def get_ohlcv(
        self, symbol: str = "BTC/USDT", timeframe: str = "1m", limit: int = 200
    ) -> pd.DataFrame:
        """Return OHLCV data as a pandas DataFrame."""
        ohlcv = self.exchange.fetch_ohlcv(symbol, timeframe=timeframe, limit=limit)
        df = pd.DataFrame(
            ohlcv,
            columns=["timestamp", "open", "high", "low", "close", "volume"],
        )
        df["timestamp"] = pd.to_datetime(df["timestamp"], unit="ms")
        return df
