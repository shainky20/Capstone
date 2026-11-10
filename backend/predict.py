import joblib
import pandas as pd
import sys
import json

# Load model
model = joblib.load("risk_model.pkl")

# Receive JSON input from Node
raw = sys.argv[1]

data = json.loads(raw)

# Convert to DataFrame
df = pd.DataFrame([data])

# Predict
pred = model.predict(df)[0]

# Output result
print(round(pred, 2))