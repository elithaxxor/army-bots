"""Streamlit dashboard for visualising multiple crypto pairs simultaneously."""
"""Interactive Streamlit dashboard for visualising crypto data and indicators."""

from __future__ import annotations

import streamlit as st
import plotly.graph_objects as go
from data_fetcher import DataFetcher
from indicator_calculator import compute_indicators_batch
from sentiment import analyze_sentiment
from ml_model import PriceDirectionModel
from backtester import backtest

REPORT_DIR = "trading_bot/reports"

st.set_page_config(page_title="Crypto Dashboard", layout="wide")

fetcher = DataFetcher()
model = PriceDirectionModel()

DEFAULT_INDICATORS = ["VWAP", "EMA", "SMA", "RSI", "MACD", "ADX", "Support", "Fractals"]

if "selected_indicators" not in st.session_state:
    st.session_state.selected_indicators = DEFAULT_INDICATORS.copy()

st.sidebar.markdown("### Indicator Selection")
selected_indicators = st.sidebar.multiselect(
    "Indicators to display",
    DEFAULT_INDICATORS,
    default=st.session_state.selected_indicators,
)
st.session_state.selected_indicators = selected_indicators

symbols_input = st.sidebar.text_input(
    "Trading Pairs (comma separated)", value="BTC/USDT"
)
symbols = [s.strip().upper() for s in symbols_input.split(",") if s.strip()]
run_backtest = st.sidebar.button("Run Backtest")
refresh_btn = st.sidebar.button("Refresh Now")


@st.cache_data(ttl=60)
def load_all(symbols: list[str]):
    data = fetcher.get_ohlcv_multi(symbols, timeframe="1m", limit=500)
    data = compute_indicators_batch(data)
    return data

data_dict = load_all(symbols)
tabs = st.tabs(symbols)

for sym, tab in zip(symbols, tabs):
    with tab:
        data = data_dict[sym]
        model.train(data)
        current_price = fetcher.get_current_price(sym)

        if run_backtest:

            report = backtest(data, report_dir=REPORT_DIR)
            st.write(f"Balance: {report.final_balance:.2f}")
            st.write(f"Profit: {report.profit:.2f}")
            st.write(f"Max DD: {report.max_drawdown:.2%}")
            st.write(f"Trades: {report.num_trades}")
            if report.figure_path:
                st.image(report.figure_path)


            result = backtest(data)
            st.write(f"Backtest balance: {result.final_balance:.2f}")


        sentiment_score = analyze_sentiment([])
        model_prob = model.predict(data)

        st.metric("Current Price", current_price)

        fig = go.Figure(
            data=[
                go.Candlestick(
                    x=data["timestamp"],
                    open=data["open"],
                    high=data["high"],
                    low=data["low"],
                    close=data["close"],
                )
            ]
        )

        if "VWAP" in selected_indicators:
            fig.add_trace(go.Scatter(x=data["timestamp"], y=data["vwap"], name="VWAP"))
        if "EMA" in selected_indicators:
            fig.add_trace(go.Scatter(x=data["timestamp"], y=data["ema"], name="EMA"))
        if "SMA" in selected_indicators:
            fig.add_trace(go.Scatter(x=data["timestamp"], y=data["sma"], name="SMA"))
        if "Support" in selected_indicators:
            fig.add_trace(
                go.Scatter(x=data["timestamp"], y=data["support"], name="Support", line=dict(dash="dot"))
            )
            fig.add_trace(
                go.Scatter(x=data["timestamp"], y=data["resistance"], name="Resistance", line=dict(dash="dot"))
            )
        if "Fractals" in selected_indicators:
            fractals_up = data[data["fractal_up"]]
            fractals_down = data[data["fractal_down"]]
            fig.add_trace(
                go.Scatter(
                    x=fractals_up["timestamp"],
                    y=fractals_up["high"],
                    mode="markers",
                    marker_symbol="triangle-up",
                    marker_color="green",
                    name="Fractal Up",
                )
            )
            fig.add_trace(
                go.Scatter(
                    x=fractals_down["timestamp"],
                    y=fractals_down["low"],
                    mode="markers",
                    marker_symbol="triangle-down",
                    marker_color="red",
                    name="Fractal Down",
                )
            )

        if "RSI" in selected_indicators:
            fig.add_trace(
                go.Scatter(x=data["timestamp"], y=data["rsi"], name="RSI", yaxis="y2")
            )
        if "MACD" in selected_indicators:
            fig.add_trace(
                go.Scatter(x=data["timestamp"], y=data["macd"], name="MACD", yaxis="y2")
            )
            fig.add_trace(
                go.Scatter(
                    x=data["timestamp"],
                    y=data["macd_signal"],
                    name="MACD Signal",
                    yaxis="y2",
                )
            )
        if "ADX" in selected_indicators:
            fig.add_trace(
                go.Scatter(x=data["timestamp"], y=data["adx"], name="ADX", yaxis="y2")
            )

        fig.update_layout(yaxis2=dict(overlaying="y", side="right", title="Oscillators"))

        st.plotly_chart(fig, use_container_width=True)

        col1, col2 = st.columns(2)
        col1.write(f"Sentiment score: {sentiment_score}")
        col2.write(f"Model long probability: {model_prob}")

if refresh_btn:
    st.experimental_rerun()
