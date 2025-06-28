import streamlit as st
import pandas as pd
import plotly.graph_objects as go
from data_fetcher import DataFetcher
from indicator_calculator import add_indicators, find_fractals, support_resistance
from sentiment import analyze_sentiment
from ml_model import PriceDirectionModel
from backtester import backtest

st.set_page_config(page_title="Crypto Dashboard", layout="wide")

fetcher = DataFetcher()
model = PriceDirectionModel()

symbol = st.sidebar.text_input("Trading Pair", value="BTC/USDT")
refresh = st.sidebar.number_input("Refresh (s)", min_value=5, value=30)
run_backtest = st.sidebar.button("Run Backtest")
refresh_btn = st.sidebar.button("Refresh Now")

@st.cache_data(ttl=60)
def load_data():
    df = fetcher.get_ohlcv(symbol, timeframe="1m", limit=500)
    df = add_indicators(df)
    df = find_fractals(df)
    lows, highs = support_resistance(df)
    df['support'] = lows
    df['resistance'] = highs
    model.train(df)
    return df

data = load_data()
current_price = fetcher.get_current_price(symbol)

if run_backtest:
    result = backtest(data)
    st.sidebar.write(f"Backtest balance: {result:.2f}")

sentiment_score = analyze_sentiment([])
model_prob = model.predict(data)

st.metric("Current Price", current_price)
fig = go.Figure(data=[go.Candlestick(x=data['timestamp'],
                open=data['open'], high=data['high'],
                low=data['low'], close=data['close'])])
fig.add_trace(go.Scatter(x=data['timestamp'], y=data['vwap'], name='VWAP'))
fig.add_trace(go.Scatter(x=data['timestamp'], y=data['ema'], name='EMA'))
fig.add_trace(go.Scatter(x=data['timestamp'], y=data['sma'], name='SMA'))
fig.add_trace(go.Scatter(x=data['timestamp'], y=data['support'], name='Support', line=dict(dash='dot')))
fig.add_trace(go.Scatter(x=data['timestamp'], y=data['resistance'], name='Resistance', line=dict(dash='dot')))
fractals_up = data[data['fractal_up']]
fractals_down = data[data['fractal_down']]
fig.add_trace(go.Scatter(x=fractals_up['timestamp'], y=fractals_up['high'], mode='markers', marker_symbol='triangle-up', marker_color='green', name='Fractal Up'))
fig.add_trace(go.Scatter(x=fractals_down['timestamp'], y=fractals_down['low'], mode='markers', marker_symbol='triangle-down', marker_color='red', name='Fractal Down'))

st.plotly_chart(fig, use_container_width=True)

col1, col2 = st.columns(2)
col1.write(f"Sentiment score: {sentiment_score}")
col2.write(f"Model long probability: {model_prob}")

if refresh_btn:
    st.experimental_rerun()
