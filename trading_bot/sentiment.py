from typing import List, Optional
from transformers import pipeline


def analyze_sentiment(texts: List[str]) -> Optional[float]:
    """Return average sentiment score using FinBERT."""
    if not texts:
        return None
    try:
        nlp = pipeline("sentiment-analysis", model="ProsusAI/finbert")
    except Exception:
        return None

    scores = []
    for text in texts:
        result = nlp(text)[0]
        label = result["label"].lower()
        score = result["score"]
        if label == "positive":
            scores.append(score)
        elif label == "negative":
            scores.append(-score)
        else:
            scores.append(0)
    if scores:
        return sum(scores) / len(scores)
    return None
