"""Simple backtesting utilities.

This module provides a basic backtester capable of evaluating a trading
:class:`Strategy` on a pandas ``DataFrame``. It outputs key performance
statistics and optionally saves a JSON report and an equity curve plot.
"""

"""Simple backtesting framework for evaluating trading strategies."""
"""Simple backtester used for evaluating strategies."""


from dataclasses import dataclass
from pathlib import Path
from typing import Optional

import json



import matplotlib.pyplot as plt
import pandas as pd

from trading_bot.strategies.base import Strategy
from trading_bot.risk import add_stop_levels


class SimpleStrategy(Strategy):

    """Minimal example strategy used by the backtester."""

    def generate_signals(self, df: pd.DataFrame) -> tuple[pd.Series, int]:
        """Return the equity curve and trade count for ``df``.

        The strategy buys when price closes above VWAP with oversold RSI and
        exits on the opposite conditions or when dynamic stop levels are hit.
        """

        df = add_stop_levels(df)
        position = 0.0
        balance = 1.0
        stop_loss = take_profit = None
        trades = 0
        equity: list[float] = []

        for _, row in df.iterrows():
            if not position:

    """Baseline strategy using VWAP and RSI crosses with dynamic stops."""

    def generate_signals(self, df: pd.DataFrame) -> pd.Series:
        """Return an equity curve for ``df`` using a basic trading logic."""

        df = add_stop_levels(df)
        position = 0.0
        balance = 1.0
        equity = []
        stop_loss = take_profit = None

        for _, row in df.iterrows():
            if not position:
    """Reimplements the original trading logic and returns an equity curve."""

    def generate_signals(self, df: pd.DataFrame) -> pd.Series:
        df = add_stop_levels(df)
        position = 0.0
        balance = 1.0
        stop_loss = None
        take_profit = None
        equity = []

        for _, row in df.iterrows():
            if position == 0.0:

                if row["close"] > row["vwap"] and row["rsi"] < 30:
                    position = balance / row["close"]
                    balance = 0.0
                    stop_loss = row["stop_loss"]
                    take_profit = row["take_profit"]

                    trades += 1
            else:
                if row["close"] >= take_profit or row["close"] <= stop_loss:
                    balance = position * row["close"]
                    position = 0.0
                    trades += 1
                elif row["close"] < row["vwap"] or row["rsi"] > 70:
                    balance = position * row["close"]
                    position = 0.0
                    trades += 1
                else:
                    stop_loss = row["stop_loss"]
                    take_profit = row["take_profit"]

            else:
                if row["close"] <= stop_loss or row["close"] >= take_profit:
                    balance = position * row["close"]
                    position = 0.0
                elif row["close"] < row["vwap"] or row["rsi"] > 70:
                    balance = position * row["close"]
                    position = 0.0


            equity.append(balance + position * row["close"])

        if position:
            balance = position * df.iloc[-1]["close"]
            equity[-1] = balance


        return pd.Series(equity, index=df.index[: len(equity)]), trades

        return pd.Series(equity, index=df.index[: len(equity)])



@dataclass
class BacktestReport:

    """Container for backtest results."""

    """Results produced by :func:`backtest`."""


    final_balance: float
    profit: float
    max_drawdown: float
    num_trades: int
    equity_curve: pd.Series
    stats_path: Optional[str] = None
    figure_path: Optional[str] = None


def backtest(
    df: pd.DataFrame,
    strategy: Optional[Strategy] = None,
    report_dir: Optional[str] = None,
) -> BacktestReport:
    """Run ``df`` through ``strategy`` and return performance metrics."""

    strategy = strategy or SimpleStrategy()
    equity_curve, trades = strategy.generate_signals(df)

    final_balance = float(equity_curve.iloc[-1]) if not equity_curve.empty else 1.0
    profit = final_balance - 1.0
    running_max = equity_curve.cummax()
    drawdowns = (equity_curve - running_max) / running_max
    max_drawdown = float(drawdowns.min()) if not drawdowns.empty else 0.0

    stats_path = figure_path = None
    if report_dir:
        report_dir_path = Path(report_dir)
        report_dir_path.mkdir(parents=True, exist_ok=True)

        stats_path = str(report_dir_path / "stats.json")
        with open(stats_path, "w") as f:
            json.dump(
                {
                    "final_balance": final_balance,
                    "profit": profit,
                    "max_drawdown": max_drawdown,
                    "num_trades": trades,
                },
                f,
            )

        figure_path = str(report_dir_path / "equity_curve.png")
        fig, ax = plt.subplots()
        equity_curve.plot(ax=ax)
        ax.set_title("Equity Curve")
        ax.set_xlabel("Step")
        ax.set_ylabel("Balance")
        fig.tight_layout()
        fig.savefig(figure_path)
        plt.close(fig)

    return BacktestReport(
        final_balance=final_balance,
        profit=profit,
        max_drawdown=max_drawdown,
        num_trades=trades,
        equity_curve=equity_curve,
        stats_path=stats_path,
        figure_path=figure_path,
    )
