import streamlit as st
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score, TimeSeriesSplit, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
import plotly.express as px

from data_fetcher import DataFetcher
from indicator_calculator import add_indicators
from results_db import save_evaluation, load_evaluations

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
perform_tuning = st.sidebar.checkbox("Hyperparameter Tuning")

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
    base_model = Pipeline([
        ("scaler", StandardScaler()),
        ("clf", LogisticRegression(max_iter=200)),
    ])
    param_grid = {"clf__C": [0.01, 0.1, 1.0, 10.0]}
else:
    base_model = RandomForestClassifier(n_estimators=100, random_state=42)
    param_grid = {"n_estimators": [100, 200], "max_depth": [None, 5, 10]}

cv = TimeSeriesSplit(n_splits=splits)

if perform_tuning:
    search = GridSearchCV(base_model, param_grid, cv=cv, scoring="accuracy")
    search.fit(X, y)
    model = search.best_estimator_
    params = search.best_params_
else:
    model = base_model
    params = {}

scores = cross_val_score(model, X, y, cv=cv, scoring="accuracy")
model.fit(X, y)

if model_name == "Logistic Regression":
    coef = model.named_steps["clf"].coef_[0]
    importance = dict(zip(["rsi", "ema", "adx"], coef))
else:
    importance = dict(zip(["rsi", "ema", "adx"], model.feature_importances_))

save_evaluation(symbol, timeframe, model_name, params, scores, importance)

st.write(f"Mean accuracy: {scores.mean():.3f} ± {scores.std():.3f}")

st.line_chart(pd.Series(scores, name="Accuracy"))

fig = px.bar(x=list(importance.keys()), y=list(importance.values()), labels={"x": "Feature", "y": "Importance"}, title="Feature Importance")
st.plotly_chart(fig, use_container_width=True)

st.subheader("Saved Evaluations")
history = pd.DataFrame(load_evaluations())
if not history.empty:
    st.dataframe(history)
