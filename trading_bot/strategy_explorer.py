"""Streamlit page for exploring machine-learning strategies.

Users can select a model (logistic regression or random forest),
optionally perform hyperparameter tuning, and view cross‑validated
accuracy on historical OHLCV data. Results are persisted for
later review.
"""

from __future__ import annotations

import pandas as pd
import plotly.express as px
import streamlit as st
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import GridSearchCV, TimeSeriesSplit, cross_val_score
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

from data_fetcher import DataFetcher
from indicator_calculator import add_indicators
from results_db import load_evaluations, save_evaluation

st.set_page_config(page_title="Strategy Explorer")


@st.cache_data(ttl=3600)
def load_data(symbol: str, timeframe: str) -> pd.DataFrame:
    """Fetch and cache market data with indicators."""

    fetcher = DataFetcher()
    df = fetcher.get_ohlcv(symbol=symbol, timeframe=timeframe, limit=1000)
    df = add_indicators(df)
    df.dropna(inplace=True)
    return df


# Sidebar controls
st.title("ML Strategy Explorer")
symbol = st.sidebar.text_input("Trading Pair", value="BTC/USDT")
timeframe = st.sidebar.text_input("Timeframe", value="1h")
model_name = st.sidebar.selectbox("Model", ["Logistic Regression", "Random Forest"])
splits = st.sidebar.slider("Cross-Validation Splits", min_value=2, max_value=10, value=5)
perform_tuning = st.sidebar.checkbox("Hyperparameter Tuning")

# Load data and prepare features/labels
history = load_data(symbol, timeframe)
X = history[["rsi", "ema", "adx"]]
y = (history["close"].shift(-1) > history["close"]).astype(int)
X, y = X[:-1], y[:-1]

# Model definitions and parameter grids
model_defs: dict[str, Pipeline | RandomForestClassifier] = {
    "Logistic Regression": Pipeline(
        [
            ("scaler", StandardScaler()),
            ("clf", LogisticRegression(max_iter=200)),
        ]
    ),
    "Random Forest": RandomForestClassifier(n_estimators=100, random_state=42),
}
param_grids = {
    "Logistic Regression": {"clf__C": [0.01, 0.1, 1.0, 10.0]},
    "Random Forest": {"n_estimators": [100, 200], "max_depth": [None, 5, 10]},
}

cv = TimeSeriesSplit(n_splits=splits)

if perform_tuning:
    search = GridSearchCV(model_defs[model_name], param_grids[model_name], cv=cv, scoring="accuracy")
    search.fit(X, y)
    model = search.best_estimator_
    params = search.best_params_
else:
    model = model_defs[model_name]
    params = {}

scores = cross_val_score(model, X, y, cv=cv, scoring="accuracy")
model.fit(X, y)

# Compute feature importance
if model_name == "Logistic Regression":
    coef = model.named_steps["clf"].coef_[0]
    importance = dict(zip(["rsi", "ema", "adx"], coef))
else:
    importance = dict(zip(["rsi", "ema", "adx"], model.feature_importances_))

# Persist evaluation
save_evaluation(symbol, timeframe, model_name, params, scores, importance)

# Display results
st.write(f"Mean accuracy: {scores.mean():.3f} ± {scores.std():.3f}")
st.line_chart(pd.Series(scores, name="Accuracy"))
fig = px.bar(x=list(importance.keys()), y=list(importance.values()), labels={"x": "Feature", "y": "Importance"}, title="Feature Importance")
st.plotly_chart(fig, use_container_width=True)

st.subheader("Saved Evaluations")
history_df = pd.DataFrame(load_evaluations())
if not history_df.empty:
    st.dataframe(history_df)
