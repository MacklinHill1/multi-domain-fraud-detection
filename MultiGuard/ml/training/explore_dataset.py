import pandas as pd
from pathlib import Path

# Locate the raw dataset folder
DATA_DIR = Path(__file__).resolve().parents[2] / "data" / "raw"

# Find CSV files
csv_files = list(DATA_DIR.glob("*.csv"))

if not csv_files:
    raise FileNotFoundError("No CSV files found in data/raw!")

print(f"Found {len(csv_files)} CSV file(s):")

for file in csv_files:
    print(f"\nReading: {file.name}")

    df = pd.read_csv(file)

    print("\nDataset shape:")
    print(df.shape)

    print("\nColumn names:")
    print(df.columns.tolist())

    print("\nFirst 5 rows:")
    print(df.head())

    print("\nMissing values:")
    print(df.isnull().sum())

    print("\nDuplicate rows:")
    print(df.duplicated().sum())

    print("\nData types:")
    print(df.dtypes)
 
    # Check how many reviews belong to each category
    print("\nReview label distribution:")
    print(df["deceptive"].value_counts())

    # Check the percentage of each category
    print("\nReview label percentages:")
    print(df["deceptive"].value_counts(normalize=True) * 100)
