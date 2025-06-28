"""Common interface for trading strategies used by the backtester."""

from abc import ABC, abstractmethod
from typing import Any

import pandas as pd


class Strategy(ABC):
    """Abstract base class for all trading strategies."""

    @abstractmethod
    def generate_signals(self, df: pd.DataFrame) -> pd.Series:
        """Return an equity curve or trading signals for ``df``.

        Parameters
        ----------
        df:
            Price history with required indicator columns.

        Returns
        -------
        pd.Series
            Series representing the strategy equity over time or the signals
            used by :func:`trading_bot.backtester.backtest`.
        """

        raise NotImplementedError

