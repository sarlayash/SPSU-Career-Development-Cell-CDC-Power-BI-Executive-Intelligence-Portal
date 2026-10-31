import csv
import json
import io
import re

file_path = "C:/Users/LC/.gemini/antigravity/scratch/spsu-cdc-analytics/raw_cdc_data.csv"

with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
    text = f.read()

positions = []
start = 0
while True:
    pos = text.find("S.No.", start)
    if pos == -1:
        break
    positions.append(pos)
    start = pos + 5

dept_names = ["CSE", "ECE", "MN", "CE", "ME", "BDES", "BCA", "BBA", "MBA"]

for i in range(len(dept_names)):
    chunk = text[positions[i]:positions[i+1]]
    reader = csv.reader(io.StringIO(chunk))
    rows = list(reader)
    # count rows starting with a digit
    valid_student_rows = [r for r in rows[1:] if r and r[0].strip().isdigit()]
    print(f"{dept_names[i]}: found {len(valid_student_rows)} students (header has {len(rows[0])} cols)")
