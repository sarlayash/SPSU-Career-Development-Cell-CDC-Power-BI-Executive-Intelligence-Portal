import csv
import json
import re

file_path = "C:/Users/LC/.gemini/antigravity/scratch/spsu-cdc-analytics/raw_cdc_data.csv"

with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
    lines = f.readlines()

print(f"Total lines: {len(lines)}")

# Let's verify sections
# Summary sections:
# Line 0 to 11 has the summary table:
# Program,Total Student,Total OO,DB,Opt-In Late,Opt-In,Placed,Offers Count,FTE,PPO,Rem.,NOC Done,,Program,Total Students,Male,Female,SI O1,SI O2,SI O3,Offers Count,Offered,Project,Remaining
summary_placement = []
summary_internship = []

for i in range(2, 11):
    parts = lines[i].strip().split(",")
    # parts[0..11] is placement, parts[13..23] is SI
    prog = parts[0].strip()
    if prog and prog != "Total":
        summary_placement.append({
            "program": prog,
            "total_students": int(parts[1]) if parts[1].isdigit() else 0,
            "opt_out": int(parts[2]) if parts[2].isdigit() else 0,
            "db": int(parts[3]) if parts[3].isdigit() else 0,
            "opt_in_late": int(parts[4]) if parts[4].isdigit() else 0,
            "opt_in": int(parts[5]) if parts[5].isdigit() else 0,
            "placed": int(parts[6]) if parts[6].isdigit() else 0,
            "offers_count": int(parts[7]) if parts[7].isdigit() else 0,
            "fte": int(parts[8]) if parts[8].isdigit() else 0,
            "ppo": int(parts[9]) if parts[9].isdigit() else 0,
            "remaining": int(parts[10]) if parts[10].isdigit() else 0,
            "noc_done": int(parts[11]) if parts[11].isdigit() else 0,
        })
    if len(parts) > 13 and parts[13].strip() and parts[13].strip() != "Total":
        si_prog = parts[13].strip()
        summary_internship.append({
            "program": si_prog,
            "total_students": int(parts[14]) if parts[14].isdigit() else 0,
            "male": int(parts[15]) if parts[15].isdigit() else 0,
            "female": int(parts[16]) if parts[16].isdigit() else 0,
            "si_o1": int(parts[17]) if parts[17].isdigit() else 0,
            "si_o2": int(parts[18]) if parts[18].isdigit() else 0,
            "si_o3": int(parts[19]) if parts[19].isdigit() else 0,
            "offers_count": int(parts[20]) if parts[20].isdigit() else 0,
            "offered": int(parts[21]) if parts[21].isdigit() else 0,
            "remaining": (int(parts[14]) if parts[14].isdigit() else 0) - (int(parts[21]) if parts[21].isdigit() else 0)
        })

print(f"Parsed placement programs: {len(summary_placement)}")
print(f"Parsed internship programs: {len(summary_internship)}")
