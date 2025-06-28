import pandas as pd


def simple_strategy(df: pd.DataFrame):
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


def backtest(df: pd.DataFrame) -> float:
    return simple_strategy(df)
