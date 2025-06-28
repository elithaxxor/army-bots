import sys, os; sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from unittest.mock import patch, MagicMock
from trading_bot.data_fetcher import DataFetcher
import pandas as pd

def test_get_ohlcv():
    fake = MagicMock()
    fake.fetch_ohlcv.return_value = [
        [0, 1, 2, 0.5, 1.5, 100],
        [1, 1.1, 2.1, 0.6, 1.6, 110],
    ]
    with patch('ccxt.binance', return_value=fake):
        fetcher = DataFetcher()
        df = fetcher.get_ohlcv(limit=2)
    assert not df.empty
    assert set(['open','high','low','close','volume','timestamp']).issubset(df.columns)
