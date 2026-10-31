import os
import sys
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, KeepTogether, PageBreak, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    """
    Two-pass canvas to dynamically compute and print 'Page X of Y' 
    along with running header and footer on every page.
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#475569"))

        # Top Running Header (Pages 2+)
        if self._pageNumber > 1:
            self.drawString(54, 800, "Sir Padampat Singhania University (SPSU) — Career Development Cell (CDC)")
            self.setFont("Helvetica", 8)
            self.drawRightString(558, 800, "Directorate Executive Portal • Admin Guide")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.75)
            self.line(54, 794, 558, 794)

        # Bottom Running Footer (All pages)
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.75)
        self.line(54, 45, 558, 45)

        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        self.drawString(54, 32, "Confidential • Ref: SPSU/CDC/DIR/2026/ADM-01 • Author: Directorate Intelligence Systems")
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(558, 32, page_str)
        self.restoreState()


def create_admin_guide_pdf(output_path, banner_img_path):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Custom Color Palette
    PRIMARY = colors.HexColor("#0F172A")    # Deep Navy Slate
    SECONDARY = colors.HexColor("#1E3A8A")  # Royal Blue
    ACCENT = colors.HexColor("#D97706")     # Amber / Gold
    TEXT_DARK = colors.HexColor("#1E293B")
    BG_LIGHT = colors.HexColor("#F8FAFC")
    BORDER_COLOR = colors.HexColor("#E2E8F0")
    SUCCESS = colors.HexColor("#059669")

    # Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=PRIMARY,
        spaceAfter=4
    )
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=ACCENT,
        spaceAfter=12
    )
    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=PRIMARY,
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )
    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=SECONDARY,
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )
    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=TEXT_DARK,
        spaceAfter=6
    )
    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=TEXT_DARK,
        leftIndent=14,
        firstLineIndent=-10,
        spaceAfter=3
    )
    callout_style = ParagraphStyle(
        'Callout_Text',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#1E3A8A")
    )
    code_style = ParagraphStyle(
        'Code_Custom',
        parent=styles['Normal'],
        fontName='Courier-Bold',
        fontSize=8.5,
        leading=11,
        textColor=PRIMARY
    )

    story = []

    # =========================================================================
    # COVER / HEADER BLOCK
    # =========================================================================
    if os.path.exists(banner_img_path):
        # Render high-resolution campus banner
        img = Image(banner_img_path, width=504, height=185)
        story.append(img)
        story.append(Spacer(1, 10))

    meta_table_data = [
        [
            Paragraph("<b>INSTITUTION:</b> Sir Padampat Singhania University (SPSU), Udaipur", body_style),
            Paragraph("<b>DOCUMENT REF:</b> SPSU/CDC/DIR/2026/ADM-01", body_style)
        ],
        [
            Paragraph("<b>UNIT:</b> Career Development Cell (CDC) — Directorate Office", body_style),
            Paragraph("<b>SECURITY:</b> STRICTLY CONFIDENTIAL • INTERNAL", body_style)
        ],
        [
            Paragraph("<b>SUBJECT:</b> Official Portal Administrator & Operations Manual", body_style),
            Paragraph("<b>EFFECTIVE DATE:</b> October 2026 (Annual Release)", body_style)
        ]
    ]
    meta_table = Table(meta_table_data, colWidths=[260, 244])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F1F5F9")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#CBD5E1")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 14))

    story.append(Paragraph("SPSU Career Development Cell (CDC)", subtitle_style))
    story.append(Paragraph("Power BI Executive Intelligence Portal — Administrator Guide", title_style))
    story.append(HRFlowable(width="100%", thickness=2, color=PRIMARY, spaceBefore=4, spaceAfter=14))

    # =========================================================================
    # SECTION 1: EXECUTIVE SUMMARY & SYSTEM OVERVIEW
    # =========================================================================
    story.append(Paragraph("1. Executive Summary & Architecture", h1_style))
    story.append(Paragraph(
        "The <b>SPSU Career Development Cell (CDC) Power BI Executive Intelligence Portal</b> is a state-of-the-art "
        "decision-support and placement management platform engineered specifically for the <b>Director, Vice Chancellor, "
        "and Career Development Cell leadership</b>. It provides real-time transparency into graduating batch placement "
        "conversions, summer internship commitments, compensation distributions, and corporate recruiter partnerships.",
        body_style
    ))
    story.append(Paragraph(
        "<b>Core Architecture & Design Language:</b> Built on a modern React 19 and Vite 6 foundation styled with Microsoft "
        "Power BI executive design patterns (fluent header ribbon, dynamic filter slicers, KPI performance cards, drill-through "
        "student profile drawers, and instant multi-field query engine).",
        body_style
    ))

    # Architecture summary table
    arch_data = [
        ["Component", "Technology / Specification", "Operational Purpose"],
        ["Frontend Engine", "React 19 + Vite 6 + Tailwind CSS", "Sub-second client rendering & fluid transitions"],
        ["Design System", "Power BI Executive Edition", "Directorate presentation standards & interactive slicers"],
        ["Dataset Size", "392 Students / 9 Academic Disciplines", "CSE (192), ECE (18), MN (17), CE (11), ME (10), BDES (2), BCA (38), BBA (57), MBA (47)"],
        ["Hosting Architecture", "GitHub Pages Cloud + Offline Standalone", "Dual live cloud URL + zero-dependency standalone HTML"],
        ["Security Protocol", "Role-Gated Authentication Gate", "Directorate access with session token & logout control"]
    ]
    arch_table = Table(arch_data, colWidths=[110, 180, 214])
    arch_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 8.5),
        ('BACKGROUND', (0,1), (-1,-1), colors.HexColor("#F8FAFC")),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('FONTNAME', (0,1), (-1,-1), 'Helvetica'),
        ('FONTSIZE', (0,1), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(arch_table)
    story.append(Spacer(1, 14))

    # =========================================================================
    # SECTION 2: ACCESS CREDENTIALS & SECURITY PROTOCOL
    # =========================================================================
    story.append(Paragraph("2. Access Control & Administrator Credentials", h1_style))
    story.append(Paragraph(
        "Access to the executive intelligence console is strictly restricted through the <b>SPSU Authentication Gate</b>. "
        "The portal validates credentials against the institutional administrative registry and issues session tokens.",
        body_style
    ))

    cred_box_data = [
        [
            Paragraph("<b>AUTHENTICATION GATE CREDENTIALS</b>", ParagraphStyle('WTitle', fontName='Helvetica-Bold', fontSize=10, textColor=colors.HexColor("#78350F"))),
            Paragraph("<b>ACCESS LEVEL:</b> Directorate Executive / Super Admin", ParagraphStyle('WLevel', fontName='Helvetica-Bold', fontSize=8.5, textColor=colors.HexColor("#92400E")))
        ],
        [
            Paragraph("<b>Username:</b> <font face='Courier-Bold' size=11 color='#0F172A'>ADMIN</font> (Case-insensitive)", body_style),
            Paragraph("<b>Password:</b> <font face='Courier-Bold' size=11 color='#0F172A'>SPSU123</font>", body_style)
        ],
        [
            Paragraph("<b>Auto-Fill Shortcut:</b> Click <i>'Auto-fill Credentials'</i> for instant 1-click administrative authorization.", body_style),
            Paragraph("<b>Session Persistence:</b> Optional <i>'Keep me logged in'</i> check saves secure browser session token.", body_style)
        ]
    ]
    cred_table = Table(cred_box_data, colWidths=[250, 254])
    cred_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#FEF3C7")),
        ('BOX', (0,0), (-1,-1), 1.5, colors.HexColor("#F59E0B")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#FCD34D")),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(cred_table)
    story.append(Spacer(1, 8))

    story.append(Paragraph("<b>Sign-Out & Session Revocation:</b>", h2_style))
    story.append(Paragraph("• <b>Direct Sign Out:</b> Click the red <b>Log Out icon</b> located in the top-right header ribbon to immediately revoke authentication tokens and return to the secure login gate.", bullet_style))
    story.append(Paragraph("• <b>Role Switcher:</b> Click the User Profile badge (<i>'👨‍💼 Administrator / Super Admin'</i>) to open the Auth Gateway modal to preview department auditor or recruiter views.", bullet_style))
    story.append(Spacer(1, 14))

    # =========================================================================
    # SECTION 3: CORE MODULES & NAVIGATION DIRECTORY
    # =========================================================================
    story.append(Paragraph("3. Portal Modules & Intelligence Directory", h1_style))
    story.append(Paragraph(
        "The portal is organized into seven specialized executive views accessible via the primary ribbon navigation:",
        body_style
    ))

    modules_data = [
        ["Ribbon Tab", "Core Intelligence Capabilities", "Primary Target Audience"],
        ["Executive Cockpit", "High-level KPI scorecard (Placements, SI, Peak CTC ₹10.2 LPA, Avg CTC ₹5.85 LPA), uncropped campus & accreditations showcase, and real-time live clock.", "Director & Vice Chancellor"],
        ["Placement Hub", "FTE vs PPO breakdown, Tier 1 (>=8 LPA), Tier 2 (5-8 LPA), Tier 3 (<5 LPA) package tiers, eligible unplaced rosters, and company offer counts.", "CDC Head & Placement Officers"],
        ["Summer Internship", "Summer internship conversion rates (75.8%), cumulative 374 industry offers, stipend tracking, and male-female cohort parity metrics.", "Internship Coordinators"],
        ["Student 360° Matrix", "Granular student grid with multi-field search, numerical sorting (CTC, CGPA, Backlogs, S.No), department filtering, and individual drill-down profile modal.", "CDC Staff & Academic Deans"],
        ["Recruiter Intelligence", "Tier 1 hiring partners (KMK Venture, Country Edu, Xebia, Celebal, Eleation), offer distribution, salary ranges, and corporate drive history.", "Corporate Relations Managers"],
        ["Reports Studio", "Official Director's 1-Pager Executive Memo generator, CSV data exports, Department Matrices, and print-ready PDF memo formatting.", "Executive Assistants & Deans"],
        ["Template Manager", "Annual rollover data ingestion engine, drag-and-drop CSV master upload, and schema field mapping validation.", "Database & IT Administrators"]
    ]
    modules_table = Table(modules_data, colWidths=[90, 274, 140])
    modules_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 8),
        ('BACKGROUND', (0,1), (-1,-1), colors.HexColor("#F8FAFC")),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('FONTNAME', (0,1), (-1,-1), 'Helvetica'),
        ('FONTSIZE', (0,1), (-1,-1), 7.5),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(modules_table)
    story.append(Spacer(1, 14))

    # Page Break for clean section division
    story.append(PageBreak())

    # =========================================================================
    # SECTION 4: SLICERS ENGINE & STUDENT 360° SEARCH
    # =========================================================================
    story.append(Paragraph("4. Interactive Power BI Slicers & Query Operations", h1_style))
    story.append(Paragraph(
        "A cornerstone of the executive portal is the <b>Collapsible Power BI Slicers Pane</b>, accessible via the "
        "<b>'Slicers'</b> button in the top ribbon.",
        body_style
    ))
    story.append(Paragraph("• <b>Discipline / Program Slicer:</b> Filter all dashboard views across 9 degree disciplines (CSE, ECE, MN, CE, ME, BDES, BCA, BBA, MBA) or select 'ALL' for institutional aggregate.", bullet_style))
    story.append(Paragraph("• <b>Placement Status Slicer:</b> Segment cohorts into Placed-FTE, Placed-PPO, Remaining Unplaced, or Opt-Out categories.", bullet_style))
    story.append(Paragraph("• <b>Summer Internship Slicer:</b> Isolate students who have secured internships vs. those awaiting placement.", bullet_style))
    story.append(Paragraph("• <b>Instant Global Slicer Reset:</b> Click the <b>'Reset'</b> button in the ribbon to restore default parameters across all 392 students.", bullet_style))

    story.append(Paragraph("<b>Student 360° Matrix — Deep Search & Numerical Sorting:</b>", h2_style))
    story.append(Paragraph(
        "The Student 360° Matrix features an upgraded search and sorting engine designed to handle large institutional datasets:",
        body_style
    ))
    story.append(Paragraph("1. <b>Multi-Field Instant Search:</b> Type any keyword in the search bar. The engine checks Student Name, Enrollment Number (e.g. 2223010001), SPSU Email, Department, Specialization (Cloud, AI/ML, Cyber Security), and Recruiter Companies simultaneously.", bullet_style))
    story.append(Paragraph("2. <b>True Numerical Sorting:</b> Click column headers (<b>S.No, CTC, CGPA, Backlogs</b>) to sort in accurate numerical sequence (e.g., 10.20 LPA → 8.00 LPA → 6.50 LPA) rather than alphabetical text sorting.", bullet_style))
    story.append(Paragraph("3. <b>Automated Pagination Reset:</b> Whenever a search term or department filter is applied, the grid automatically resets to Page 1 to prevent empty-page display anomalies.", bullet_style))
    story.append(Paragraph("4. <b>Drill-Down Profile Drawer:</b> Click the <b>'View Profile'</b> eye icon next to any student to open their comprehensive 360° Profile Dossier containing verified backlogs, internship offers, company CTC, and contact coordinates.", bullet_style))
    story.append(Spacer(1, 14))

    # =========================================================================
    # SECTION 5: EXPORT ENGINE & EXECUTIVE MEMO GENERATION
    # =========================================================================
    story.append(Paragraph("5. Export Engine & 1-Click Executive Memo Generation", h1_style))
    story.append(Paragraph(
        "The Directorate portal incorporates an automated multi-format export pipeline to facilitate executive reporting:",
        body_style
    ))

    export_card_data = [
        [
            Paragraph("<b>Export Option</b>", ParagraphStyle('ETitle', fontName='Helvetica-Bold', fontSize=8.5, textColor=PRIMARY)),
            Paragraph("<b>Output Format</b>", ParagraphStyle('EFormat', fontName='Helvetica-Bold', fontSize=8.5, textColor=PRIMARY)),
            Paragraph("<b>Description & Intended Usage</b>", ParagraphStyle('EDesc', fontName='Helvetica-Bold', fontSize=8.5, textColor=PRIMARY))
        ],
        [
            Paragraph("<b>Director's 1-Pager Memo</b>", body_style),
            Paragraph("<font color='#059669'><b>PDF / Print Dialog</b></font>", body_style),
            Paragraph("Generates an official executive briefing document with embedded university banner, key KPI metrics, program-wise placement table, and formal signature lines for the Director.", body_style)
        ],
        [
            Paragraph("<b>Filtered Students Dataset</b>", body_style),
            Paragraph("<font color='#2563EB'><b>CSV Spreadsheet</b></font>", body_style),
            Paragraph("Downloads all current filtered student records with full attributes (Enrollment, CGPA, CTC, Company, Backlogs) formatted for Microsoft Excel or Google Sheets.", body_style)
        ],
        [
            Paragraph("<b>Program Summary Matrix</b>", body_style),
            Paragraph("<font color='#D97706'><b>CSV Spreadsheet</b></font>", body_style),
            Paragraph("Exports consolidated department statistics: Total students, Placed count, FTE/PPO split, Remaining, and SI offer counts.", body_style)
        ],
        [
            Paragraph("<b>Raw JSON Intelligence Dump</b>", body_style),
            Paragraph("<font color='#7C3AED'><b>JSON Schema</b></font>", body_style),
            Paragraph("Exports full raw structured JSON data for API integrations or external Power BI Desktop data model ingestion.", body_style)
        ]
    ]
    export_table = Table(export_card_data, colWidths=[120, 100, 284])
    export_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#F1F5F9")),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('FONTNAME', (0,0), (-1,-1), 'Helvetica'),
        ('FONTSIZE', (0,0), (-1,-1), 8),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(export_table)
    story.append(Spacer(1, 14))

    # =========================================================================
    # SECTION 6: ANNUAL ROLLOVER & TEMPLATE INGESTION GUIDE
    # =========================================================================
    story.append(Paragraph("6. Annual Rollover & Template Ingestion Protocol", h1_style))
    story.append(Paragraph(
        "To update the portal for subsequent graduating cohorts (e.g., Class of 2027), follow this standardized protocol:",
        body_style
    ))
    story.append(Paragraph("<b>Step 1: Download Standard Template:</b> Open the <b>'Template Manager'</b> tab and click <i>'Download Official CSV Template'</i> to obtain the verified header structure.", bullet_style))
    story.append(Paragraph("<b>Step 2: Prepare Cohort Master Sheet:</b> Populate columns maintaining standard fields: S.No., Enrollment No., Student Name, Department, Gender, CGPA, Backlogs, Summer Internship Status, Placement Status, Company, and CTC (LPA).", bullet_style))
    story.append(Paragraph("<b>Step 3: Upload via Template Manager:</b> Drag-and-drop the updated CSV file directly into the portal. The built-in parser validates column mappings, computes new aggregates, and refreshes all visualizations immediately.", bullet_style))
    story.append(Paragraph("<b>Step 4: Permanent Codebase Update:</b> Run the Python conversion utility: <font face='Courier'>python generate_json_v2.py</font> to recompile <font face='Courier'>spsu_cdc_data.json</font> for permanent git commits.", bullet_style))
    story.append(Spacer(1, 14))

    # =========================================================================
    # SECTION 7: DEPLOYMENT, CLOUD CI/CD & OFFLINE ACCESS
    # =========================================================================
    story.append(Paragraph("7. Hosting Infrastructure & Offline Execution", h1_style))
    story.append(Paragraph(
        "The portal is architected with dual-availability infrastructure ensuring 100% operational uptime:",
        body_style
    ))

    deploy_data = [
        ["Channel", "URL / Location", "Operational Notes"],
        [
            "Live Web Portal (Cloud)", 
            "https://sarlayash.github.io/SPSU-Career-Development-Cell-CDC-Power-BI-Executive-Intelligence-Portal/", 
            "Globally accessible 24/7 over secure HTTPS. Powered by GitHub Pages CI/CD from the gh-pages branch."
        ],
        [
            "Offline Standalone File", 
            "standalone_dashboard.html (in project directory)", 
            "Self-contained 714 KB single-file application. Double-click to run in any browser with ZERO internet connection required."
        ],
        [
            "Source Code Repository", 
            "https://github.com/sarlayash/SPSU-Career-Development-Cell-CDC-Power-BI-Executive-Intelligence-Portal.git", 
            "Official institutional repository containing source code, data scripts, and version history."
        ]
    ]
    deploy_table = Table(deploy_data, colWidths=[110, 214, 180])
    deploy_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 8),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('BACKGROUND', (0,1), (-1,-1), colors.HexColor("#F8FAFC")),
        ('FONTNAME', (0,1), (-1,-1), 'Helvetica'),
        ('FONTSIZE', (0,1), (-1,-1), 7.5),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(deploy_table)
    story.append(Spacer(1, 16))

    # =========================================================================
    # SECTION 8: TROUBLESHOOTING & FAQ
    # =========================================================================
    story.append(Paragraph("8. Troubleshooting & Frequently Asked Questions", h1_style))
    story.append(Paragraph("<b>Q: The browser displays an older version of the portal after deployment.</b><br/>"
                           "<i>Fix:</i> Perform a hard cache refresh by pressing <b>Ctrl + Shift + R</b> (Windows) or <b>Cmd + Shift + R</b> (Mac). The application bundles cache-busting asset hashes.", body_style))
    story.append(Paragraph("<b>Q: I forgot or need to change the Administrator credentials.</b><br/>"
                           "<i>Fix:</i> Default credentials are <font face='Courier-Bold'>ADMIN</font> / <font face='Courier-Bold'>SPSU123</font>. To update credentials, edit <font face='Courier'>src/components/LoginPage.jsx</font> in the source code and rebuild with <font face='Courier'>npm run build</font>.", body_style))
    story.append(Paragraph("<b>Q: How do I export an executive presentation memo without browser headers and URLs?</b><br/>"
                           "<i>Fix:</i> In the print preview window, open 'More Settings' and uncheck 'Headers and footers'. The portal's built-in print CSS automatically inserts institutional headers, banner, and signature blocks.", body_style))
    story.append(Spacer(1, 16))

    # =========================================================================
    # SECTION 9: DIRECTORATE SIGN-OFF & AUTHORIZATION
    # =========================================================================
    story.append(KeepTogether([
        Paragraph("9. Institutional Authorization & Directorate Sign-Off", h1_style),
        Paragraph(
            "This document establishes the official operational standard for the SPSU CDC Executive Intelligence Portal. "
            "Any structural modification to database schemas or placement reporting formulas must receive prior approval from the Directorate.",
            body_style
        ),
        Spacer(1, 10),
        Table([
            [
                Paragraph("<b>Prepared by:</b><br/><br/><br/>_______________________________<br/><b>Directorate Systems Lead</b><br/>Career Development Cell", body_style),
                Paragraph("<b>Reviewed by:</b><br/><br/><br/>_______________________________<br/><b>Head of Placements</b><br/>Career Development Cell", body_style),
                Paragraph("<b>Authorized by:</b><br/><br/><br/>_______________________________<br/><b>Prof. (Dr.) Prithvi Yadav</b><br/>Director, CDC & Vice Chancellor Office", body_style)
            ]
        ], colWidths=[168, 168, 168], style=[
            ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
            ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F8FAFC")),
            ('TOPPADDING', (0,0), (-1,-1), 8),
            ('BOTTOMPADDING', (0,0), (-1,-1), 8),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
            ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ])
    ]))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF successfully generated at: {output_path}")

if __name__ == "__main__":
    banner = r"C:\Users\LC\.gemini\antigravity\scratch\spsu-cdc-analytics\public\spsu-banner.png"
    pdf_out = r"C:\Users\LC\.gemini\antigravity\scratch\spsu-cdc-analytics\public\SPSU_CDC_Portal_Administrator_Guide.pdf"
    create_admin_guide_pdf(pdf_out, banner)
