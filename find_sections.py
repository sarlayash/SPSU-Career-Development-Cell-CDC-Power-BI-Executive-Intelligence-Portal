import csv
import json
import re

file_path = "C:/Users/LC/.gemini/antigravity/scratch/spsu-cdc-analytics/raw_cdc_data.csv"

with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

# Let's split into lines or use csv reader
lines = content.splitlines()

# We can find all header rows starting with "S.No."
header_indices = [i for i, line in enumerate(lines) if line.startswith("S.No.")]
print("Header indices:", header_indices)

for idx in header_indices:
    print(f"Line {idx}: {lines[idx][:80]}")
