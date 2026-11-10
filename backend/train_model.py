import pandas as pd
import os
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
from sklearn.metrics import mean_absolute_error, r2_score

# Load CSV
base_dir = os.path.dirname(__file__)

csv_path = os.path.join(
    base_dir,
    "..",
    "data",
    "shipment_risk_dataset.csv"
)

df = pd.read_csv(csv_path)

# Features
X = df[
    [
        "origin",
        "destination",
        "rain_mm",
        "wind_speed",
        "traffic_index",
        "distance_km",
        "priority",
        "historical_delay",
    ]
]

# Target
y = df["target_risk"]

# Categorical / numeric columns
categorical = [
    "origin",
    "destination",
    "priority",
]

numeric = [
    "rain_mm",
    "wind_speed",
    "traffic_index",
    "distance_km",
    "historical_delay",
]

# Preprocessing
preprocessor = ColumnTransformer(
    transformers=[
        (
            "cat",
            OneHotEncoder(handle_unknown="ignore"),
            categorical,
        ),
        (
            "num",
            "passthrough",
            numeric,
        ),
    ]
)

# Model pipeline
model = Pipeline(
    steps=[
        (
            "prep",
            preprocessor,
        ),
        (
            "rf",
            RandomForestRegressor(
                n_estimators=250,
                max_depth=12,
                random_state=42,
            ),
        ),
    ]
)

# Split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
)

# Train
model.fit(X_train, y_train)

# Predict
pred = model.predict(X_test)

# Metrics
mae = mean_absolute_error(y_test, pred)
r2 = r2_score(y_test, pred)

print("MAE:", round(mae, 2))
print("R2 Score:", round(r2, 2))

# Save
joblib.dump(model, "risk_model.pkl")

print("Saved risk_model.pkl")