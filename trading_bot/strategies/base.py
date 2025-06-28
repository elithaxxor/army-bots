from abc import ABC, abstractmethod
import pandas as pd


class Strategy(ABC):
    """Abstract trading strategy."""

    @abstractmethod
    def generate_signals(self, df: pd.DataFrame):
        """Return trading signals or backtest results for the given data."""
        pass
