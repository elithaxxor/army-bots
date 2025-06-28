import sys
import os

import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

import pandas as pd
import numpy as np

# Make sure the trading_bot package is importable when running tests from repo root
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))
from trading_bot.ml_model import PriceDirectionModel

def test_model_train_predict():
    rng = np.random.default_rng(0)
    df = pd.DataFrame({
        'rsi': rng.random(60) * 100,
        'ema': rng.random(60),
        'adx': rng.random(60),
        'close': rng.random(60) + np.linspace(1, 2, 60)
    })
    model = PriceDirectionModel()
    model.train(df)
    prob = model.predict(df)
    assert prob is None or 0.0 <= prob <= 1.0
