import sys
import os

# Ensure the package can be imported when running tests from the repo root
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))
from unittest.mock import patch, MagicMock
from trading_bot.data_fetcher import DataFetcher
import pandas as pd
import pytest

def test_get_ohlcv_mocked():
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


def test_get_ohlcv_live():
    fetcher = DataFetcher()
    try:
        df = fetcher.get_ohlcv(limit=5)
    except Exception as e:
        pytest.skip(f"Skipping fetch test: {e}", allow_module_level=True)
    assert not df.empty
    assert {'open', 'high', 'low', 'close', 'volume', 'timestamp'} <= set(df.columns)
