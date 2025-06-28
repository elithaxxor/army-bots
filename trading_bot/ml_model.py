from typing import Optional
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline


class PriceDirectionModel:
    """Train a logistic regression model to predict price direction."""

    def __init__(self):
        self.model: Optional[Pipeline] = None

    def train(self, df: pd.DataFrame) -> None:
        df = df.dropna()
        if len(df) < 50:
            return
        X = df[["rsi", "ema", "adx"]]
        y = (df["close"].shift(-1) > df["close"]).astype(int)
        self.model = Pipeline([
            ("scaler", StandardScaler()),
            ("clf", LogisticRegression())
        ])
        self.model.fit(X[:-1], y[:-1])

    def predict(self, df: pd.DataFrame) -> Optional[float]:
        if not self.model or df.tail(1).isna().any().any():
            return None
        X = df.tail(1)[["rsi", "ema", "adx"]]
        prob = self.model.predict_proba(X)[0][1]
        return prob
