from typing import Optional

import pandas as pd

from trading_bot.strategies.base import Strategy
from trading_bot.risk import add_stop_levels


class SimpleStrategy(Strategy):
    """Reimplements the original hard-coded logic as a strategy class."""

    def generate_signals(self, df: pd.DataFrame) -> float:
        df = add_stop_levels(df)
        position = 0
        balance = 1.0
        stop_loss = None
        take_profit = None
        for _, row in df.iterrows():
            if position == 0:
                if row['close'] > row['vwap'] and row['rsi'] < 30:
                    position = balance / row['close']
                    balance = 0
                    stop_loss = row['stop_loss']
                    take_profit = row['take_profit']
            else:
                if row['close'] <= stop_loss or row['close'] >= take_profit:
                    balance = position * row['close']
                    position = 0
                elif row['close'] < row['vwap'] or row['rsi'] > 70:
                    balance = position * row['close']
                    position = 0
        if position:
            balance = position * df.iloc[-1]['close']
        return balance


def backtest(df: pd.DataFrame, strategy: Optional[Strategy] = None) -> float:
    """Run ``df`` through the provided strategy and return the final balance."""

    strategy = strategy or SimpleStrategy()
    return strategy.generate_signals(df)
