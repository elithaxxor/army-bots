import sqlite3
import json
import os
from typing import Dict, Iterable
from statistics import mean, pstdev

DB_PATH = os.path.join(os.path.dirname(__file__), "results.db")


def init_db() -> None:
    """Ensure the SQLite database and tables exist."""
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS evaluations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            symbol TEXT,
            timeframe TEXT,
            model TEXT,
            params TEXT,
            mean_accuracy REAL,
            std_accuracy REAL
        )
        """
    )
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS feature_importance (
            evaluation_id INTEGER,
            feature TEXT,
            importance REAL,
            FOREIGN KEY(evaluation_id) REFERENCES evaluations(id)
        )
        """
    )
    conn.commit()
    conn.close()


def save_evaluation(
    symbol: str,
    timeframe: str,
    model: str,
    params: Dict[str, object],
    scores: Iterable[float],
    importance: Dict[str, float],
) -> None:
    """Persist evaluation metrics and feature importances."""
    init_db()
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    scores = list(scores)
    cur.execute(
        "INSERT INTO evaluations (symbol, timeframe, model, params, mean_accuracy, std_accuracy) VALUES (?, ?, ?, ?, ?, ?)",
        (
            symbol,
            timeframe,
            model,
            json.dumps(params),
            float(mean(scores)) if scores else 0.0,
            float(pstdev(scores)) if len(scores) > 1 else 0.0,
        ),
    )
    eval_id = cur.lastrowid
    for feat, imp in importance.items():
        cur.execute(
            "INSERT INTO feature_importance (evaluation_id, feature, importance) VALUES (?, ?, ?)",
            (eval_id, feat, float(imp)),
        )
    conn.commit()
    conn.close()


def load_evaluations(limit: int = 20):
    """Return recent evaluations as a list of dicts."""
    init_db()
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute(
        "SELECT id, timestamp, symbol, timeframe, model, params, mean_accuracy, std_accuracy FROM evaluations ORDER BY timestamp DESC LIMIT ?",
        (limit,),
    )
    rows = cur.fetchall()
    conn.close()
    records = []
    for r in rows:
        record = {
            "id": r[0],
            "timestamp": r[1],
            "symbol": r[2],
            "timeframe": r[3],
            "model": r[4],
            "params": json.loads(r[5]) if r[5] else {},
            "mean_accuracy": r[6],
            "std_accuracy": r[7],
        }
        records.append(record)
    return records
