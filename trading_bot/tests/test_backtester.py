import os
import sys
import pandas as pd

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from trading_bot.backtester import backtest, BacktestReport


def sample_df() -> pd.DataFrame:
    """Return a small DataFrame for testing."""
    return pd.DataFrame(
        {
            "vwap": [0.9, 0.95, 1.0],
            "rsi": [20, 40, 20],
            "close": [1.0, 1.1, 1.2],
        }
    )


def test_backtest_returns_report():
    report = backtest(sample_df())
    assert isinstance(report, BacktestReport)
    assert report.final_balance > 1.0
    assert report.num_trades >= 0


def test_stop_loss_triggered():
    df = pd.DataFrame(
        {
            "vwap": [0.9, 0.9, 0.9],
            "rsi": [20, 40, 40],
            "close": [1.0, 1.05, 0.8],
            "high": [1.1, 1.1, 1.05],
            "low": [0.9, 1.0, 0.75],
        }
    )
    report = backtest(df)
    assert isinstance(report, BacktestReport)
    assert report.final_balance < 1.0


def test_backtest_creates_report_files(tmp_path):
    report = backtest(sample_df(), report_dir=tmp_path)
    assert (tmp_path / "stats.json").is_file()
    assert (tmp_path / "equity_curve.png").is_file()
    # paths should be recorded in the report
    assert os.path.samefile(report.stats_path, tmp_path / "stats.json")
    assert os.path.samefile(report.figure_path, tmp_path / "equity_curve.png")
