import streamlit as st
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score, TimeSeriesSplit
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

from data_fetcher import DataFetcher
from indicator_calculator import add_indicators

st.set_page_config(page_title="Strategy Explorer")

st.title("ML Strategy Explorer")

symbol = st.sidebar.text_input("Trading Pair", value="BTC/USDT")
timeframe = st.sidebar.text_input("Timeframe", value="1h")
model_name = st.sidebar.selectbox(
    "Model", ["Logistic Regression", "Random Forest"]
)
splits = st.sidebar.slider(
    "Cross-Validation Splits", min_value=2, max_value=10, value=5
)

@st.cache_data(ttl=3600)
def load_data(sym: str, tf: str) -> pd.DataFrame:
    fetcher = DataFetcher()
    df = fetcher.get_ohlcv(symbol=sym, timeframe=tf, limit=1000)
    df = add_indicators(df)
    df.dropna(inplace=True)
    return df

df = load_data(symbol, timeframe)
X = df[["rsi", "ema", "adx"]]
y = (df["close"].shift(-1) > df["close"]).astype(int)
X = X[:-1]
y = y[:-1]

if model_name == "Logistic Regression":
    model = Pipeline([
        ("scaler", StandardScaler()),
        ("clf", LogisticRegression(max_iter=200)),
    ])
else:
    model = RandomForestClassifier(n_estimators=100, random_state=42)

cv = TimeSeriesSplit(n_splits=splits)
scores = cross_val_score(model, X, y, cv=cv, scoring="accuracy")

st.write(f"Mean accuracy: {scores.mean():.3f} ± {scores.std():.3f}")

st.line_chart(pd.Series(scores, name="Accuracy"))
