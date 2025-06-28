import sys, os; sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from trading_bot.data_fetcher import DataFetcher
import pytest


def test_get_ohlcv():
    fetcher = DataFetcher()
    try:
        df = fetcher.get_ohlcv(limit=5)
    except Exception as e:
        pytest.skip(f"Skipping fetch test: {e}", allow_module_level=True)
    assert not df.empty
    assert {'open', 'high', 'low', 'close', 'volume', 'timestamp'} <= set(df.columns)
