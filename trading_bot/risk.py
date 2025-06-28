import pandas as pd


def add_stop_levels(
    df: pd.DataFrame,
    window: int = 14,
    stop_mult: float = 1.5,
    take_mult: float = 3.0,
) -> pd.DataFrame:
    """Return a DataFrame with dynamic stop-loss and take-profit levels.

    Volatility is estimated using the rolling mean of absolute price changes.
    """
    df = df.copy()
    vol = df["close"].diff().abs().rolling(window).mean()
    vol.fillna(method="bfill", inplace=True)
    df["stop_loss"] = df["close"] - vol * stop_mult
    df["take_profit"] = df["close"] + vol * take_mult
    return df
