import pandas as pd
import pandas_ta as ta


def add_indicators(df: pd.DataFrame) -> pd.DataFrame:
    """Calculate technical indicators and append them to the DataFrame."""
    df = df.copy()
    df.set_index("timestamp", inplace=True)

    df["vwap"] = ta.vwap(df["high"], df["low"], df["close"], df["volume"])
    df["rsi"] = ta.rsi(df["close"], length=14)
    adx = ta.adx(df["high"], df["low"], df["close"], length=14)
    if isinstance(adx, pd.DataFrame) and "ADX_14" in adx:
        df["adx"] = adx["ADX_14"]
    else:
        df["adx"] = pd.NA
    df["adx"] = ta.adx(df["high"], df["low"], df["close"], length=14)["ADX_14"]
    df["ema"] = ta.ema(df["close"], length=20)
    df["sma"] = ta.sma(df["close"], length=20)

    df.reset_index(inplace=True)
    return df


def find_fractals(df: pd.DataFrame, window: int = 2) -> pd.DataFrame:
    """Identify Bill Williams fractals."""
    df = df.copy().reset_index(drop=True)
    highs = df['high']
    lows = df['low']

    df['fractal_up'] = False
    df['fractal_down'] = False

    for i in range(window, len(df) - window):
        if highs[i] == max(highs[i - window : i + window + 1]):
            df.at[i, 'fractal_up'] = True
        if lows[i] == min(lows[i - window : i + window + 1]):
            df.at[i, 'fractal_down'] = True
    return df


def support_resistance(df: pd.DataFrame, window: int = 20):
    """Return support and resistance levels as series."""
    rolling_high = df['high'].rolling(window).max()
    rolling_low = df['low'].rolling(window).min()
    return rolling_low, rolling_high
