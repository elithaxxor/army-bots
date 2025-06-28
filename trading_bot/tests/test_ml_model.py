import pandas as pd
import numpy as np
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
