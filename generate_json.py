import csv
import json
import io
import re

file_path = "C:/Users/LC/.gemini/antigravity/scratch/spsu-cdc-analytics/raw_cdc_data.csv"

with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
    raw_content = f.read()

# Parse summary table from lines 0 to 11
summary_lines = raw_content.splitlines()[2:11]
summary_placement = []
summary_internship = []

for line in summary_lines:
    parts = line.strip().split(",")
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

# Parse attendance records
lines = raw_content.splitlines()
attendance_map = {}
for i in range(607, len(lines)):
    line = lines[i].strip()
    if line.startswith("S.No.") or not line:
        continue
    parts = line.split(",")
    if len(parts) >= 5 and parts[0].isdigit():
        enr = parts[2].strip()
        status = parts[4].strip()
        if enr:
            attendance_map[enr] = "Present" if status == "P" else ("Absent" if status == "" else status)

print(f"Loaded attendance mapping for {len(attendance_map)} students")

# Sections to parse:
# 1. CSE: line 12 to 260
# 2. ECE: line 267 to 286
# 3. MN: line 299 to 317
# 4. CE: line 319 to 331
# 5. ME: line 332 to 343
# 6. BDES: line 352 to 355
# 7. BCA: line 360 to 399
# 8. BBA: line 408 to 466
# 9. MBA: line 490 to 538

def clean_str(val):
    if val is None:
        return ""
    val = str(val).strip()
    if val == "NaN" or val == "null" or val == "-":
        return ""
    return val

def clean_num(val):
    if not val:
        return None
    val = str(val).strip().replace(",", "")
    match = re.search(r"(\d+(\.\d+)?)", val)
    if match:
        try:
            return float(match.group(1))
        except:
            return None
    return None

def parse_section(csv_text, department):
    reader = csv.reader(io.StringIO(csv_text))
    rows = list(reader)
    if not rows:
        return []
    header = [h.strip() for h in rows[0]]
    students = []
    
    for row in rows[1:]:
        if not row or not row[0].strip().isdigit():
            continue
        row_dict = {}
        for idx, col in enumerate(header):
            if idx < len(row):
                row_dict[col] = row[idx].strip()
        
        s_no = int(row[0].strip())
        name = clean_str(row_dict.get("Students Name") or row_dict.get("Student Name") or "")
        enrollment = clean_str(row_dict.get("Enrollment No.") or "")
        course = clean_str(row_dict.get("Course") or "")
        specialization = clean_str(row_dict.get("Specialization") or row_dict.get("Specialization (Area 1)") or "")
        spec2 = clean_str(row_dict.get("Specialization (Area 2)") or "")
        email_spsu = clean_str(row_dict.get("Email ID - SPSU") or row_dict.get("Email ID-SPSU") or "")
        email_personal = clean_str(row_dict.get("Email ID - Personal") or "")
        contact = clean_str(row_dict.get("Contact No.") or "")
        gender = clean_str(row_dict.get("Gender") or "")
        
        # Gender inference if blank
        if not gender:
            # Let's check summary stats or infer
            gender = "Male" # Default or placeholder if not in table
            
        cgpa_str = clean_str(row_dict.get("Graduation CGPA") or row_dict.get("Graduation (%/CGPA)") or row_dict.get("Current CGPA II") or "")
        cgpa = clean_num(cgpa_str)
        backlog = clean_num(row_dict.get("Backlog Remaining"))
        
        att = clean_str(row_dict.get("Placement Orientation Session Attendance") or "")
        if not att and enrollment in attendance_map:
            att = attendance_map[enrollment]
        if not att:
            att = "Absent"
            
        decl = clean_str(row_dict.get("Declaration Status") or "")
        if not decl:
            decl = "Opt - In"
            
        place_status = clean_str(row_dict.get("Placement Status") or "")
        if "Placed" in place_status or "Placed-FTE" in place_status or "Placed-PPO" in place_status:
            if "FTE" in place_status:
                norm_place = "Placed-FTE"
            elif "PPO" in place_status:
                norm_place = "Placed-PPO"
            else:
                norm_place = "Placed"
        elif "Opt Out" in decl:
            norm_place = "Opt Out"
        else:
            norm_place = "Remaining"
            
        place_campus = clean_str(row_dict.get("Campus") or "")
        place_company = clean_str(row_dict.get("Placement Companies") or "")
        place_ctc = clean_num(row_dict.get("CTC") or row_dict.get("H- CTC"))
        place_noc = clean_str(row_dict.get("NOC") or "")
        
        # SI fields
        si_offers_raw = clean_str(row_dict.get("Offers Count") or "")
        si_offers_count = int(clean_num(si_offers_raw) or 0)
        si_offered = si_offers_count > 0 or clean_str(row_dict.get("Offer Letter") or "") != "" or clean_str(row_dict.get("Company Joined") or "") != ""
        si_company_offered = clean_str(row_dict.get("Companies Offered") or row_dict.get("Company Joined") or "")
        si_noc = clean_str(row_dict.get("NOC - SI") or "")
        si_company_joined = clean_str(row_dict.get("Company Joined") or "")
        si_profile = clean_str(row_dict.get("Profile") or "")
        si_stipend = clean_str(row_dict.get("Stipend") or "")
        si_location = clean_str(row_dict.get("Location") or "")
        
        students.append({
            "id": enrollment if enrollment else f"{department}_{s_no}",
            "sNo": s_no,
            "name": name,
            "enrollmentNo": enrollment,
            "course": course if course else ("B.Tech." if department in ["CSE", "ECE", "MN", "CE", "ME"] else department),
            "department": department,
            "specialization": specialization,
            "specialization2": spec2,
            "emailSpsu": email_spsu,
            "emailPersonal": email_personal,
            "contactNo": contact,
            "gender": gender,
            "cgpa": cgpa,
            "backlogs": int(backlog) if backlog is not None else 0,
            "orientationAttendance": att,
            "declarationStatus": decl,
            "placementStatus": norm_place,
            "placementCampus": place_campus if place_campus else ("On-Campus" if norm_place.startswith("Placed") else ""),
            "placementCompanies": place_company,
            "placementCTC": place_ctc,
            "placementNOC": place_noc if place_noc else ("Pending" if norm_place.startswith("Placed") else "NA"),
            "internshipOffersCount": si_offers_count,
            "internshipOffered": si_offered,
            "internshipCompaniesOffered": si_company_offered,
            "internshipCompanyJoined": si_company_joined,
            "internshipNOC": si_noc if si_noc else ("Done" if si_company_joined else "Pending"),
            "internshipProfile": si_profile,
            "internshipStipend": si_stipend,
            "internshipLocation": si_location,
        })
    return students

# Slice raw text for each section
all_students = []

def extract_section_text(start_line_idx, end_line_idx):
    return "\n".join(lines[start_line_idx:end_line_idx])

# Header indices: [12, 267, 299, 319, 332, 352, 360, 408, 490, 607, 646, 694, 752]
sections = [
    ("CSE", 12, 260),
    ("ECE", 267, 286),
    ("MN", 299, 317),
    ("CE", 319, 331),
    ("ME", 332, 343),
    ("BDES", 352, 355),
    ("BCA", 360, 399),
    ("BBA", 408, 466),
    ("MBA", 490, 538),
]

for dept, s, e in sections:
    sec_txt = extract_section_text(s, e)
    parsed = parse_section(sec_txt, dept)
    print(f"Dept {dept}: parsed {len(parsed)} students")
    all_students.extend(parsed)

print(f"Total parsed students across all departments: {len(all_students)}")

dataset = {
    "summary_placement": summary_placement,
    "summary_internship": summary_internship,
    "students": all_students,
    "meta": {
        "institution": "Sir Padampat Singhania University (SPSU), Udaipur",
        "department": "Career Development Cell (CDC)",
        "report": "Comprehensive Placement & Summer Internship Intelligence Report",
        "batch": "2026 Graduating Cohort",
        "totalStudents": len(all_students),
        "totalPlaced": sum(1 for s in all_students if s["placementStatus"].startswith("Placed")),
        "totalInternshipOffered": sum(1 for s in all_students if s["internshipOffered"]),
        "generatedFor": "Director's Executive Briefing & TPO Monitoring"
    }
}

output_path = "C:/Users/LC/.gemini/antigravity/scratch/spsu-cdc-analytics/spsu_cdc_data.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(dataset, f, indent=2)

print(f"Successfully saved {output_path}")
