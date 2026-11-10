import pandas as pd
import os

# Folder where this script exists
base_dir = os.path.dirname(__file__)

# Build correct path to dataset
csv_path = os.path.join(
    base_dir,
    "..",
    "data",
    "shipment_risk_dataset.csv"
)

# Normalize path
csv_path = os.path.abspath(csv_path)

print("Loading file from:")
print(csv_path)

# Read CSV
df = pd.read_csv(csv_path)

# Show columns + preview
print("\nColumns:")
print(df.columns.tolist())

print("\nFirst 5 Rows:")
print(df.head())