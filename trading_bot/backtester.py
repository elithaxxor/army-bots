from typing import Optional

import pandas as pd

from trading_bot.strategies.base import Strategy


class SimpleStrategy(Strategy):
    """Reimplements the original hard-coded logic as a strategy class."""

    def generate_signals(self, df: pd.DataFrame) -> float:
        position = 0
        balance = 1.0
        for _, row in df.iterrows():
            if row['close'] > row['vwap'] and row['rsi'] < 30 and position == 0:
                position = balance / row['close']
                balance = 0
            elif position and (row['close'] < row['vwap'] or row['rsi'] > 70):
                balance = position * row['close']
                position = 0
        if position:
            balance = position * df.iloc[-1]['close']
        return balance


def backtest(df: pd.DataFrame, strategy: Optional[Strategy] = None) -> float:
    """Run ``df`` through the provided strategy and return the final balance."""

    strategy = strategy or SimpleStrategy()
    return strategy.generate_signals(df)
