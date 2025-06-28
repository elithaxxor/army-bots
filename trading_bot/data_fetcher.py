"""Utility helpers for retrieving OHLCV data from exchanges."""

from concurrent.futures import ThreadPoolExecutor
from typing import Dict, List

import ccxt
import pandas as pd

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

    def get_ohlcv_multi(
        self, symbols: List[str], timeframe: str = "1m", limit: int = 200
    ) -> Dict[str, pd.DataFrame]:
        """Fetch OHLCV data for multiple symbols concurrently."""

        def fetch(sym: str) -> pd.DataFrame:
            return self.get_ohlcv(sym, timeframe=timeframe, limit=limit)

        with ThreadPoolExecutor(max_workers=min(len(symbols), 5)) as executor:
            results = list(executor.map(fetch, symbols))

        return dict(zip(symbols, results))
