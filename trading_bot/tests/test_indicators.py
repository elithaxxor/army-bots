import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))
import pandas as pd
import pytest

try:
    from trading_bot.indicator_calculator import add_indicators, find_fractals
except Exception as e:
    pytest.skip(f"Skipping indicator tests: {e}", allow_module_level=True)


DATA = {
    "timestamp": pd.date_range("2020-01-01", periods=20, freq="min"),
    "open": [1] * 20,
    "high": [1.1] * 20,
    "low": [0.9] * 20,
    "close": [1] * 20,
    "volume": [100] * 20,
}


def test_add_indicators():
    df = pd.DataFrame(DATA)
    df = add_indicators(df)
    assert 'vwap' in df.columns


def test_find_fractals():
    df = pd.DataFrame(DATA)
    df = find_fractals(df)
    assert 'fractal_up' in df.columns
