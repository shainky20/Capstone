import json
from pathlib import Path
import sys

import joblib
import pandas as pd

FEATURES = [
    "origin",
    "destination",
    "rain_mm",
    "wind_speed",
    "traffic_index",
    "distance_km",
    "priority",
    "historical_delay",
]
MODEL_PATH = Path(__file__).resolve().parent.parent / "risk_model.pkl"


def main():
    raw = sys.stdin.read()
    if not raw and len(sys.argv) > 1:
        raw = sys.argv[1]
    if not raw:
        raise ValueError("Prediction input is required.")

    data = json.loads(raw)
    if not isinstance(data, dict):
        raise ValueError("Prediction input must be a JSON object.")

    missing = [feature for feature in FEATURES if feature not in data]
    if missing:
        raise ValueError(f"Missing prediction features: {', '.join(missing)}")

    row = {feature: data[feature] for feature in FEATURES}
    for feature in ["rain_mm", "wind_speed", "traffic_index", "distance_km", "historical_delay"]:
        try:
            row[feature] = float(row[feature])
        except (TypeError, ValueError) as error:
            raise ValueError(f"{feature} must be numeric.") from error

    if any(value < 0 for key, value in row.items() if key in FEATURES[2:]):
        raise ValueError("Numeric prediction features must be non-negative.")
    if any(not isinstance(row[key], str) or not row[key].strip() for key in ["origin", "destination", "priority"]):
        raise ValueError("origin, destination, and priority must be non-empty strings.")

    model = joblib.load(MODEL_PATH)
    prediction = float(model.predict(pd.DataFrame([row], columns=FEATURES))[0])
    if not pd.notna(prediction):
        raise ValueError("The model returned an invalid prediction.")

    print(json.dumps({"risk_score": round(prediction, 2)}))


if __name__ == "__main__":
    main()