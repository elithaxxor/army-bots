import sys
import os

import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

import pandas as pd

# Ensure imports work when running tests from the repository root
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))
from trading_bot.backtester import backtest

def test_backtest_returns_balance():
    df = pd.DataFrame({
        'vwap': [0.9, 0.95, 1.0],
        'rsi': [20, 40, 20],
        'close': [1.0, 1.1, 1.2]
    })
    result = backtest(df)
    assert result > 1.0


def test_stop_loss_triggered():
    df = pd.DataFrame({
        'vwap': [0.9, 0.9, 0.9],
        'rsi': [20, 40, 40],
        'close': [1.0, 1.05, 0.8],
        'high': [1.1, 1.1, 1.05],
        'low': [0.9, 1.0, 0.75]
    })
    result = backtest(df)
    assert result < 1.0
