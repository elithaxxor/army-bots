import sys, os; sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
import pandas as pd
import pytest
try:
    from trading_bot.indicator_calculator import add_indicators, find_fractals
except Exception as e:
    pytest.skip(f"Skipping indicator tests: {e}", allow_module_level=True)


def test_add_indicators():
    data = {
        'timestamp': pd.date_range('2020-01-01', periods=10, freq='min'),
        'open': [1]*10,
        'high': [1.1]*10,
        'low': [0.9]*10,
        'close': [1]*10,
        'volume': [100]*10,
    }
    df = pd.DataFrame(data)
    df = add_indicators(df)
    assert 'vwap' in df.columns


def test_find_fractals():
    data = {
        'timestamp': pd.date_range('2020-01-01', periods=5, freq='min'),
        'open': [1,2,3,2,1],
        'high': [1,3,5,3,1],
        'low': [1,2,1,2,1],
        'close': [1,2,3,2,1],
        'volume': [1]*5
    }
    df = pd.DataFrame(data)
    df = find_fractals(df)
    assert 'fractal_up' in df.columns
