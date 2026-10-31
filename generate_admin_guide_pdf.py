import os
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
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
            self.drawString(44, 808, "Sir Padampat Singhania University (SPSU) - Career Development Cell (CDC)")
            self.setFont("Helvetica", 8)
            self.drawRightString(551, 808, "Directorate Executive Portal &bull; Admin Guide")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.75)
            self.line(44, 802, 551, 802)

        # Bottom Running Footer (All pages)
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.75)
        self.line(44, 40, 551, 40)

        self.setFont("Helvetica", 7.5)
        self.setFillColor(colors.HexColor("#64748B"))
        self.drawString(44, 28, "Confidential &bull; Ref: SPSU/CDC/DIR/2026/ADM-01 &bull; Author: Directorate Intelligence Systems")
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(551, 28, page_str)
        self.restoreState()


def create_admin_guide_pdf(output_path, banner_img_path):
    # Printable width: 595.27 - 88 = 507.27 pt
    PAGE_W = 507

    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=44,
        rightMargin=44,
        topMargin=46,
        bottomMargin=46
    )

    styles = getSampleStyleSheet()

    # Colors
    PRIMARY = colors.HexColor("#0F172A")    # Deep Navy Slate
    SECONDARY = colors.HexColor("#1E3A8A")  # Royal Blue
    ACCENT = colors.HexColor("#D97706")     # Amber / Gold
    TEXT_DARK = colors.HexColor("#1E293B")
    BORDER_COLOR = colors.HexColor("#CBD5E1")
    BG_LIGHT = colors.HexColor("#F8FAFC")
    BG_HEADER = colors.HexColor("#0F172A")

    # Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=PRIMARY,
        spaceAfter=3
    )
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        textColor=ACCENT,
        spaceAfter=8
    )
    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=12.5,
        leading=16,
        textColor=PRIMARY,
        spaceBefore=10,
        spaceAfter=5,
        keepWithNext=True
    )
    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=SECONDARY,
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )
    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12.5,
        textColor=TEXT_DARK,
        spaceAfter=5
    )
    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=TEXT_DARK,
        leftIndent=12,
        firstLineIndent=-8,
        spaceAfter=3
    )

    # Table Cell Typography
    th_style = ParagraphStyle(
        'TH_Style',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10.5,
        textColor=colors.white
    )
    td_style = ParagraphStyle(
        'TD_Style',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=10.5,
        textColor=TEXT_DARK
    )
    td_bold_style = ParagraphStyle(
        'TD_Bold_Style',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=10.5,
        textColor=PRIMARY
    )
    meta_style = ParagraphStyle(
        'Meta_Style',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11.5,
        textColor=TEXT_DARK
    )

    story = []

    # =========================================================================
    # PAGE 1: COVER, METADATA, & SECTION 1
    # =========================================================================
    if os.path.exists(banner_img_path):
        # 507 pt width x 165 pt height (crisp uncropped banner)
        img = Image(banner_img_path, width=PAGE_W, height=160)
        story.append(img)
        story.append(Spacer(1, 8))

    meta_table_data = [
        [
            Paragraph("<b>INSTITUTION:</b> Sir Padampat Singhania University, Udaipur", meta_style),
            Paragraph("<b>DOCUMENT REF:</b> SPSU/CDC/DIR/2026/ADM-01", meta_style)
        ],
        [
            Paragraph("<b>UNIT:</b> Career Development Cell (CDC) - Directorate Office", meta_style),
            Paragraph("<b>SECURITY:</b> STRICTLY CONFIDENTIAL &bull; INTERNAL", meta_style)
        ],
        [
            Paragraph("<b>SUBJECT:</b> Official Portal Administrator & Operations Manual", meta_style),
            Paragraph("<b>EFFECTIVE DATE:</b> Batch of 2026 (Annual Release)", meta_style)
        ]
    ]
    meta_table = Table(meta_table_data, colWidths=[260, 247])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F1F5F9")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#CBD5E1")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 10))

    story.append(Paragraph("SPSU Career Development Cell (CDC) &bull; Directorate Office", subtitle_style))
    story.append(Paragraph("Power BI Executive Intelligence Portal - Administrator Guide", title_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=PRIMARY, spaceBefore=3, spaceAfter=10))

    # SECTION 1: EXECUTIVE SUMMARY & ARCHITECTURE
    story.append(Paragraph("1. Executive Summary & Architecture", h1_style))
    story.append(Paragraph(
        "The <b>SPSU Career Development Cell (CDC) Power BI Executive Intelligence Portal</b> is an institutional decision-support and placement management platform engineered specifically for the <b>Director, Vice Chancellor, and Career Development Cell leadership</b>. It delivers real-time visibility into graduating cohort placement conversions, summer internship commitments, compensation benchmarks, and corporate recruiter engagements.",
        body_style
    ))
    story.append(Paragraph(
        "<b>Core Architecture & Design Standards:</b> Constructed on a modern React 19 and Vite 6 framework styled with Microsoft Power BI executive design patterns (fluent header ribbon, dynamic filter slicers, KPI performance cards, drill-through student profile dossiers, and sub-second multi-field query engine).",
        body_style
    ))

    # Architecture summary table (ALL cells wrapped in Paragraphs!)
    arch_data = [
        [
            Paragraph("Component", th_style),
            Paragraph("Technology / Specification", th_style),
            Paragraph("Operational Purpose", th_style)
        ],
        [
            Paragraph("Frontend Engine", td_bold_style),
            Paragraph("React 19 + Vite 6 + Tailwind CSS", td_style),
            Paragraph("Sub-second client rendering & responsive layout across desktop and mobile devices.", td_style)
        ],
        [
            Paragraph("Design System", td_bold_style),
            Paragraph("Power BI Executive Ribbon Edition", td_style),
            Paragraph("Institutional presentation standards, interactive slicers, and real-time live clock.", td_style)
        ],
        [
            Paragraph("Dataset Size", td_bold_style),
            Paragraph("392 Students / 9 Disciplines", td_style),
            Paragraph("CSE (192), ECE (18), MN (17), CE (11), ME (10), BDES (2), BCA (38), BBA (57), MBA (47).", td_style)
        ],
        [
            Paragraph("Hosting Topology", td_bold_style),
            Paragraph("GitHub Pages Cloud + Standalone HTML", td_style),
            Paragraph("Dual availability: live cloud HTTPS portal plus 718 KB offline standalone file.", td_style)
        ],
        [
            Paragraph("Security Protocol", td_bold_style),
            Paragraph("Role-Gated Authentication Gate", td_style),
            Paragraph("Directorate access protection with session tokens and instant logout revocation.", td_style)
        ]
    ]
    arch_table = Table(arch_data, colWidths=[95, 160, 252])
    arch_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), BG_HEADER),
        ('BACKGROUND', (0,1), (-1,-1), BG_LIGHT),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(arch_table)

    # Force Page Break to Page 2
    story.append(PageBreak())

    # =========================================================================
    # PAGE 2: SECTION 2 (ACCESS & CREDENTIALS) & SECTION 3 (MODULES)
    # =========================================================================
    story.append(Paragraph("2. Access Control & Administrator Credentials", h1_style))
    story.append(Paragraph(
        "Access to the executive intelligence console is strictly restricted through the <b>SPSU Authentication Gate</b>. The portal validates incoming credentials against authorized Directorate keys and grants an encrypted session token.",
        body_style
    ))

    cred_box_data = [
        [
            Paragraph("<b>AUTHENTICATION GATE CREDENTIALS</b>", ParagraphStyle('WTitle', fontName='Helvetica-Bold', fontSize=9, textColor=colors.HexColor("#78350F"))),
            Paragraph("<b>DESIGNATED ROLE:</b> Directorate Executive / Super Admin", ParagraphStyle('WLevel', fontName='Helvetica-Bold', fontSize=8, textColor=colors.HexColor("#92400E")))
        ],
        [
            Paragraph("<b>Username:</b> <font face='Courier-Bold' size=10 color='#0F172A'>ADMIN</font> (Case-insensitive)", body_style),
            Paragraph("<b>Password:</b> <font face='Courier-Bold' size=10 color='#0F172A'>SPSU123</font>", body_style)
        ],
        [
            Paragraph("<b>Auto-Fill Shortcut:</b> Click <i>'Auto-fill Credentials'</i> for 1-click login.", body_style),
            Paragraph("<b>Session Persistence:</b> <i>'Keep me logged in'</i> preserves authentication.", body_style)
        ]
    ]
    cred_table = Table(cred_box_data, colWidths=[250, 257])
    cred_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#FEF3C7")),
        ('BOX', (0,0), (-1,-1), 1.2, colors.HexColor("#F59E0B")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#FCD34D")),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(cred_table)
    story.append(Spacer(1, 6))

    story.append(Paragraph("<b>Sign-Out & Session Revocation:</b>", h2_style))
    story.append(Paragraph("&bull; <b>Direct Sign Out:</b> Click the red <b>Log Out icon</b> in the top-right header ribbon to immediately revoke authentication tokens and lock the portal.", bullet_style))
    story.append(Paragraph("&bull; <b>Role Switcher Modal:</b> Click the User Profile badge (<i>'Administrator / Super Admin'</i>) to open the Auth Gateway modal to preview department auditor views.", bullet_style))
    story.append(Spacer(1, 6))

    # SECTION 3: PORTAL MODULES & INTELLIGENCE DIRECTORY
    story.append(Paragraph("3. Portal Modules & Intelligence Directory", h1_style))
    story.append(Paragraph(
        "The portal is organized into seven specialized intelligence views accessible via the primary ribbon navigation:",
        body_style
    ))

    # Modules Table (Wrapped in Paragraphs, No Unicode Rupee symbol)
    modules_data = [
        [
            Paragraph("Ribbon Tab", th_style),
            Paragraph("Core Intelligence Capabilities", th_style),
            Paragraph("Primary Target Audience", th_style)
        ],
        [
            Paragraph("Executive Cockpit", td_bold_style),
            Paragraph("Consolidated KPI scorecard (Placements, Summer Internships, Peak CTC Rs. 10.20 LPA, Average CTC Rs. 5.85 LPA), uncropped campus accreditation banner, and ticking live clock.", td_style),
            Paragraph("Director, Vice Chancellor & Deans", td_style)
        ],
        [
            Paragraph("Placement Hub", td_bold_style),
            Paragraph("FTE vs PPO breakdown (19 FTE / 28 PPO), Tier 1 (&gt;=8 LPA), Tier 2 (5-8 LPA), Tier 3 (&lt;5 LPA) package tiers, unplaced rosters, and company offer metrics.", td_style),
            Paragraph("Placement Officers & CDC Team", td_style)
        ],
        [
            Paragraph("Summer Internship", td_bold_style),
            Paragraph("Summer internship conversion tracking (75.8% conversion, 374 cumulative offers), stipend distributions, and male-female cohort parity metrics.", td_style),
            Paragraph("Internship Coordinators", td_style)
        ],
        [
            Paragraph("Student 360° Matrix", td_bold_style),
            Paragraph("Granular student database with multi-field instant search, numerical column sorting (CTC, CGPA, Backlogs, S.No), department filtering, and modal dossiers.", td_style),
            Paragraph("Academic Advisors & CDC Staff", td_style)
        ],
        [
            Paragraph("Recruiter Intelligence", td_bold_style),
            Paragraph("Tier 1 hiring partners (KMK Venture, Country Edu, Xebia, Celebal, Eleation), offer distribution, salary ranges, and historical corporate drive performance.", td_style),
            Paragraph("Corporate Relations Managers", td_style)
        ],
        [
            Paragraph("Reports Studio", td_bold_style),
            Paragraph("Official Director's 1-Pager Executive Memo generator, CSV student datasets, Department Matrices, and print-ready PDF memo formatting.", td_style),
            Paragraph("Executive Assistants & Directorate", td_style)
        ],
        [
            Paragraph("Template Manager", td_bold_style),
            Paragraph("Annual rollover data ingestion engine, drag-and-drop CSV master upload, and schema field mapping validation for new academic batches.", td_style),
            Paragraph("Database & IT Administrators", td_style)
        ]
    ]
    modules_table = Table(modules_data, colWidths=[90, 277, 140])
    modules_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), BG_HEADER),
        ('BACKGROUND', (0,1), (-1,-1), BG_LIGHT),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(modules_table)

    # Force Page Break to Page 3
    story.append(PageBreak())

    # =========================================================================
    # PAGE 3: SECTION 4 (SLICERS & SEARCH) & SECTION 5 (EXPORTS)
    # =========================================================================
    story.append(Paragraph("4. Interactive Power BI Slicers & Query Operations", h1_style))
    story.append(Paragraph(
        "A cornerstone of the executive portal is the <b>Collapsible Power BI Slicers Pane</b>, accessible via the <b>'Slicers'</b> button in the top ribbon.",
        body_style
    ))
    story.append(Paragraph("&bull; <b>Discipline / Program Slicer:</b> Filter all views across 9 degree disciplines (CSE, ECE, MN, CE, ME, BDES, BCA, BBA, MBA) or select 'ALL' for institutional totals.", bullet_style))
    story.append(Paragraph("&bull; <b>Placement Status Slicer:</b> Segment cohorts into Placed-FTE, Placed-PPO, Remaining Unplaced, or Opt-Out categories.", bullet_style))
    story.append(Paragraph("&bull; <b>Summer Internship Slicer:</b> Isolate students who have secured internships vs. those awaiting industry placement.", bullet_style))
    story.append(Paragraph("&bull; <b>Instant Global Slicer Reset:</b> Click the <b>'Reset'</b> button in the ribbon to restore default parameters across all 392 students.", bullet_style))

    story.append(Paragraph("<b>Student 360° Matrix - Deep Search & Numerical Sorting:</b>", h2_style))
    story.append(Paragraph(
        "The Student 360° Matrix is equipped with an optimized query engine built to handle large institutional cohorts without interface lag:",
        body_style
    ))
    story.append(Paragraph("1. <b>Multi-Field Instant Search:</b> Type any search term. The query engine matches Student Name, Enrollment Number (e.g. 2223010001), SPSU Email, Department, Specialization (Cloud, AI/ML, Cyber Security), and Recruiter Companies simultaneously.", bullet_style))
    story.append(Paragraph("2. <b>True Numerical Sorting:</b> Click column headers (<b>S.No, CTC, CGPA, Backlogs</b>) to sort in true mathematical sequence (e.g., Rs. 10.20 LPA → Rs. 8.00 LPA → Rs. 6.50 LPA) rather than lexicographical string sorting.", bullet_style))
    story.append(Paragraph("3. <b>Automated Pagination Reset:</b> Whenever a search term or department filter changes, the table automatically resets to Page 1 to eliminate blank-page display states.", bullet_style))
    story.append(Paragraph("4. <b>Drill-Down Profile Dossier:</b> Click the <b>'View Profile'</b> eye icon next to any student to open their comprehensive 360° Profile Dossier containing verified backlogs, internship offers, company CTC, and contact coordinates.", bullet_style))
    story.append(Spacer(1, 8))

    # SECTION 5: EXPORT ENGINE & 1-CLICK EXECUTIVE MEMO
    story.append(Paragraph("5. Export Engine & 1-Click Executive Memo Generation", h1_style))
    story.append(Paragraph(
        "The Directorate portal incorporates an automated multi-format export pipeline to facilitate executive reporting:",
        body_style
    ))

    export_card_data = [
        [
            Paragraph("Export Option", th_style),
            Paragraph("Output Format", th_style),
            Paragraph("Description & Operational Usage", th_style)
        ],
        [
            Paragraph("Director's 1-Pager Memo", td_bold_style),
            Paragraph("<font color='#059669'><b>PDF / Print Dialog</b></font>", td_style),
            Paragraph("Generates an official executive briefing document with embedded university banner, key KPI metrics, program-wise placement table, and formal signature lines for the Director.", td_style)
        ],
        [
            Paragraph("Filtered Students Dataset", td_bold_style),
            Paragraph("<font color='#2563EB'><b>CSV Spreadsheet</b></font>", td_style),
            Paragraph("Downloads all current filtered student records with full attributes (Enrollment, CGPA, CTC, Company, Backlogs) formatted for Microsoft Excel or Google Sheets.", td_style)
        ],
        [
            Paragraph("Program Summary Matrix", td_bold_style),
            Paragraph("<font color='#D97706'><b>CSV Spreadsheet</b></font>", td_style),
            Paragraph("Exports consolidated department statistics: Total students, Placed count, FTE/PPO split, Remaining, and SI offer counts.", td_style)
        ],
        [
            Paragraph("Raw JSON Intelligence Dump", td_bold_style),
            Paragraph("<font color='#7C3AED'><b>JSON Schema</b></font>", td_style),
            Paragraph("Exports full raw structured JSON data for API integrations or external Power BI Desktop data model ingestion.", td_style)
        ]
    ]
    export_table = Table(export_card_data, colWidths=[120, 100, 287])
    export_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), BG_HEADER),
        ('BACKGROUND', (0,1), (-1,-1), BG_LIGHT),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(export_table)

    # Force Page Break to Page 4
    story.append(PageBreak())

    # =========================================================================
    # PAGE 4: SECTIONS 6, 7, 8, & 9 (ALL STEPS & SIGN-OFF TOGETHER)
    # =========================================================================
    # SECTION 6: ANNUAL ROLLOVER
    story.append(Paragraph("6. Annual Rollover & Template Ingestion Protocol", h1_style))
    story.append(Paragraph(
        "To update the portal for subsequent graduating cohorts (e.g., Class of 2027), follow this standardized protocol:",
        body_style
    ))
    story.append(Paragraph("<b>Step 1: Download Standard Template:</b> Open the <b>'Template Manager'</b> tab and click <i>'Download Official CSV Template'</i> to obtain the verified header structure.", bullet_style))
    story.append(Paragraph("<b>Step 2: Prepare Cohort Master Sheet:</b> Populate columns maintaining standard fields: S.No., Enrollment No., Student Name, Department, Gender, CGPA, Backlogs, Summer Internship Status, Placement Status, Company, and CTC (LPA).", bullet_style))
    story.append(Paragraph("<b>Step 3: Upload via Template Manager:</b> Drag-and-drop the updated CSV file directly into the portal. The built-in parser validates column mappings, computes new aggregates, and refreshes all visualizations immediately.", bullet_style))
    story.append(Paragraph("<b>Step 4: Permanent Codebase Update:</b> Run the Python conversion utility: <font face='Courier-Bold' size=7.5>python generate_json_v2.py</font> to recompile <font face='Courier-Bold' size=7.5>spsu_cdc_data.json</font> for permanent git commits.", bullet_style))
    story.append(Spacer(1, 6))

    # SECTION 7: DEPLOYMENT INFRASTRUCTURE
    story.append(Paragraph("7. Hosting Infrastructure & Offline Execution", h1_style))
    story.append(Paragraph(
        "The portal is architected with dual-availability infrastructure ensuring 100% operational uptime:",
        body_style
    ))

    # URL styling using breakable formatting
    deploy_data = [
        [
            Paragraph("Channel", th_style),
            Paragraph("URL / Access Path", th_style),
            Paragraph("Operational Notes", th_style)
        ],
        [
            Paragraph("Live Web Portal (Cloud)", td_bold_style),
            Paragraph("<font size=7 color='#1E40AF'><u>https://sarlayash.github.io/<br/>SPSU-Career-Development-Cell-<br/>CDC-Power-BI-Executive-<br/>Intelligence-Portal/</u></font>", td_style),
            Paragraph("Globally accessible 24/7 over secure HTTPS. Powered by automated GitHub Pages CI/CD from the gh-pages branch.", td_style)
        ],
        [
            Paragraph("Offline Standalone File", td_bold_style),
            Paragraph("<font size=7.5 face='Courier-Bold'>standalone_dashboard.html</font><br/>(in root project directory)", td_style),
            Paragraph("Self-contained 718 KB single-file application. Double-click to run in any browser with ZERO internet connection required.", td_style)
        ],
        [
            Paragraph("Source Code Repository", td_bold_style),
            Paragraph("<font size=7 color='#1E40AF'><u>https://github.com/sarlayash/<br/>SPSU-Career-Development-Cell-<br/>CDC-Power-BI-Executive-...</u></font>", td_style),
            Paragraph("Official institutional repository containing version history, automated tests, data scripts, and build artifacts.", td_style)
        ]
    ]
    deploy_table = Table(deploy_data, colWidths=[105, 175, 227])
    deploy_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), BG_HEADER),
        ('BACKGROUND', (0,1), (-1,-1), BG_LIGHT),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(deploy_table)
    story.append(Spacer(1, 6))

    # SECTION 8: TROUBLESHOOTING & FAQ
    story.append(Paragraph("8. Troubleshooting & Frequently Asked Questions", h1_style))
    story.append(Paragraph("&bull; <b>Q: The browser displays an older version of the portal after deployment.</b><br/>"
                           "<i>Fix:</i> Perform a hard cache refresh by pressing <b>Ctrl + Shift + R</b> (Windows) or <b>Cmd + Shift + R</b> (Mac). The build embeds unique cache-busting hashes.", body_style))
    story.append(Paragraph("&bull; <b>Q: I forgot or need to change the Administrator credentials.</b><br/>"
                           "<i>Fix:</i> Default credentials are <font face='Courier-Bold' size=7.5>ADMIN</font> / <font face='Courier-Bold' size=7.5>SPSU123</font>. To update credentials, edit <font face='Courier-Bold' size=7.5>src/components/LoginPage.jsx</font> and rebuild with <font face='Courier-Bold' size=7.5>npm run build</font>.", body_style))
    story.append(Paragraph("&bull; <b>Q: How do I export an executive presentation memo without browser URLs or page numbers?</b><br/>"
                           "<i>Fix:</i> In the print preview window, open 'More Settings' and uncheck 'Headers and footers'. The portal's built-in print CSS automatically inserts institutional headers and signature lines.", body_style))
    story.append(Spacer(1, 6))

    # SECTION 9: INSTITUTIONAL AUTHORIZATION & DIRECTORATE SIGN-OFF
    sig_cell_style = ParagraphStyle(
        'Sig_Cell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11.5,
        textColor=PRIMARY
    )
    sig_data = [
        [
            Paragraph("<b>Prepared by:</b><br/><br/><br/><b>Directorate Systems Lead</b><br/>Career Development Cell", sig_cell_style),
            Paragraph("<b>Reviewed by:</b><br/><br/><br/><b>Head - Career Development Cell</b><br/>Directorate of Training & Placements", sig_cell_style),
            Paragraph("<b>Authorized by:</b><br/><br/><br/><b>Director / Vice Chancellor</b><br/>Executive Directorate Office", sig_cell_style)
        ]
    ]
    sig_table = Table(sig_data, colWidths=[169, 169, 169])
    sig_table.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('BACKGROUND', (0,0), (-1,-1), BG_LIGHT),
        ('LINEABOVE', (0,0), (0,0), 1, colors.HexColor("#64748B")),
        ('LINEABOVE', (1,0), (1,0), 1, colors.HexColor("#64748B")),
        ('LINEABOVE', (2,0), (2,0), 1, colors.HexColor("#64748B")),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))

    story.append(KeepTogether([
        Paragraph("9. Institutional Authorization & Directorate Sign-Off", h1_style),
        Paragraph(
            "This document establishes the official operational standard for the SPSU CDC Executive Intelligence Portal. Any structural modification to database schemas or placement reporting formulas must receive prior approval from the Directorate.",
            body_style
        ),
        Spacer(1, 6),
        sig_table
    ]))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF successfully generated at: {output_path}")

if __name__ == "__main__":
    banner = r"C:\Users\LC\.gemini\antigravity\scratch\spsu-cdc-analytics\public\spsu-banner.png"
    pdf_out = r"C:\Users\LC\.gemini\antigravity\scratch\spsu-cdc-analytics\public\SPSU_CDC_Portal_Administrator_Guide.pdf"
    create_admin_guide_pdf(pdf_out, banner)
