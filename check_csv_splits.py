import csv
import io

file_path = "C:/Users/LC/.gemini/antigravity/scratch/spsu-cdc-analytics/raw_cdc_data.csv"

with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
    text = f.read()

# Let's inspect where "S.No." occurs
positions = []
start = 0
while True:
    pos = text.find("S.No.", start)
    if pos == -1:
        break
    positions.append(pos)
    start = pos + 5

print(f"Found {len(positions)} occurrences of S.No.")
for i, pos in enumerate(positions):
    line_preview = text[pos:pos+100].replace("\n", " \\n ")
    print(f"[{i}] pos={pos}: {line_preview}")
