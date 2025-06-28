import pandas as pd
from trading_bot.backtester import backtest

def test_backtest_returns_balance():
    df = pd.DataFrame({
        'vwap': [0.9, 0.95, 1.0],
        'rsi': [20, 40, 20],
        'close': [1.0, 1.1, 1.2]
    })
    result = backtest(df)
    assert result > 1.0
