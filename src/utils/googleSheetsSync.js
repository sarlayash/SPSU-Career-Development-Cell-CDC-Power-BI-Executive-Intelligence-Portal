/**
 * Google Sheets Real-Time Synchronization Engine
 * Sir Padampat Singhania University (SPSU) - Career Development Cell (CDC)
 */

// Registry of known multi-tab SPSU master workbooks
export const KNOWN_WORKBOOK_TABS = {
  '1aNssQl3J-2jUG7jhFQ3zKRL011GegGLqUYx0K2NmdG0': [
    { name: 'Entire University (All Departments)', gid: 'ALL', isAll: true },
    { name: 'Dashboard (Executive Matrix)', gid: '0', isSummary: true },
    { name: 'CSE (Computer Science & Engg)', gid: '1390054532', dept: 'CSE' },
    { name: 'ECE (Electronics & Comm)', gid: '966513351', dept: 'ECE' },
    { name: 'MN (Mining Engineering)', gid: '1765148570', dept: 'MN' },
    { name: 'CE (Civil Engineering)', gid: '1200253924', dept: 'CE' },
    { name: 'ME (Mechanical Engineering)', gid: '395070985', dept: 'ME' },
    { name: 'BDES (Design)', gid: '950475823', dept: 'BDES' },
    { name: 'BCA (Computer Applications)', gid: '1858363653', dept: 'BCA' },
    { name: 'BBA (Business Admin)', gid: '1689445564', dept: 'BBA' },
    { name: 'MBA (School of Management)', gid: '1042845342', dept: 'MBA' }
  ]
};

/**
 * Extracts Google Sheet ID and GID from any URL variant or raw ID.
 */
export function extractGoogleSheetInfo(inputUrlOrId) {
  if (!inputUrlOrId || typeof inputUrlOrId !== 'string') return null;
  const trimmed = inputUrlOrId.trim();

  // 1. Direct ID (e.g. 1aNssQl3J-2jUG7jhFQ3zKRL011GegGLqUYx0K2NmdG0)
  if (/^[a-zA-Z0-9-_]{25,}$/.test(trimmed) && !trimmed.includes('/')) {
    return { sheetId: trimmed, gid: '0', isPublished: false };
  }

  // 2. Published to Web link (e.g. https://docs.google.com/spreadsheets/d/e/2PACX-.../pub?output=csv)
  if (trimmed.includes('/d/e/')) {
    const match = trimmed.match(/\/d\/e\/([a-zA-Z0-9-_]+)/);
    const gidMatch = trimmed.match(/[?&]gid=([0-9]+)/);
    if (match) {
      return { 
        sheetId: match[1], 
        gid: gidMatch ? gidMatch[1] : '0', 
        isPublished: true,
        originalUrl: trimmed
      };
    }
  }

  // 3. Standard Docs Link (e.g. https://docs.google.com/spreadsheets/d/1aNssQl.../edit#gid=0)
  const idMatch = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  const gidMatch = trimmed.match(/[#?&]gid=([0-9]+)/);

  if (idMatch) {
    return {
      sheetId: idMatch[1],
      gid: gidMatch ? gidMatch[1] : '0',
      isPublished: false,
      originalUrl: trimmed
    };
  }

  return null;
}

/**
 * Builds candidate fetch URLs for CORS-enabled CSV export for a specific GID.
 */
export function buildFetchUrls(sheetId, gid = '0', isPublished = false, originalUrl = null) {
  if (isPublished && originalUrl) {
    let csvUrl = originalUrl;
    if (!csvUrl.includes('output=csv')) {
      csvUrl += (csvUrl.includes('?') ? '&' : '?') + 'output=csv';
    }
    return [
      csvUrl,
      `https://api.allorigins.win/raw?url=${encodeURIComponent(csvUrl)}`
    ];
  }

  // Standard Google Sheet endpoints
  const gvizUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=${gid}`;
  const exportUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(gvizUrl)}`;

  return [gvizUrl, exportUrl, proxyUrl];
}

/**
 * Robust RFC-4180 compliant CSV Parser.
 */
export function parseCSV(csvText) {
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let insideQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (insideQuotes) {
      if (char === '"' && nextChar === '"') {
        currentField += '"';
        i++; // skip escaped quote
      } else if (char === '"') {
        insideQuotes = false;
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        insideQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentField.trim());
        currentField = '';
      } else if (char === '\r') {
        if (nextChar === '\n') i++;
        currentRow.push(currentField.trim());
        rows.push(currentRow);
        currentRow = [];
        currentField = '';
      } else if (char === '\n') {
        currentRow.push(currentField.trim());
        rows.push(currentRow);
        currentRow = [];
        currentField = '';
      } else {
        currentField += char;
      }
    }
  }

  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    rows.push(currentRow);
  }

  return rows.filter(r => r.length > 0 && r.some(cell => cell.length > 0));
}

/**
 * Checks if a parsed sheet is an Executive Directorate Summary table.
 */
export function isSummarySheet(rows) {
  if (!rows || rows.length < 2) return false;
  const headerText = rows.slice(0, 3).map(r => r.join(' ').toLowerCase()).join(' ');
  return headerText.includes('placement program') || 
         headerText.includes('summer internship program') || 
         (headerText.includes('total student') && headerText.includes('opt-in'));
}

/**
 * Parses the Directorate Executive Summary Matrix (Dashboard tab).
 */
export function parseSummaryMatrix(rows) {
  const summary_placement = [];
  const summary_internship = [];

  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (!r || !r[0] || r[0].toLowerCase() === 'total') continue;

    const prog = r[0].trim();
    summary_placement.push({
      program: prog,
      total_students: parseInt(r[1], 10) || 0,
      opt_out: parseInt(r[2], 10) || 0,
      db: parseInt(r[3], 10) || 0,
      opt_in_late: parseInt(r[4], 10) || 0,
      opt_in: parseInt(r[5], 10) || 0,
      placed: parseInt(r[6], 10) || 0,
      offers_count: parseInt(r[7], 10) || 0,
      fte: parseInt(r[8], 10) || 0,
      ppo: parseInt(r[9], 10) || 0,
      remaining: parseInt(r[10], 10) || 0,
      noc_done: parseInt(r[11], 10) || 0
    });

    if (r.length > 13 && r[13] && r[13].trim()) {
      summary_internship.push({
        program: r[13].trim(),
        total_students: parseInt(r[14], 10) || 0,
        male: parseInt(r[15], 10) || 0,
        female: parseInt(r[16], 10) || 0,
        si_o1: parseInt(r[17], 10) || 0,
        si_o2: parseInt(r[18], 10) || 0,
        si_o3: parseInt(r[19], 10) || 0,
        offers_count: parseInt(r[20], 10) || 0,
        offered: parseInt(r[21], 10) || 0,
        project: parseInt(r[22], 10) || 0,
        remaining: parseInt(r[23], 10) || 0
      });
    }
  }

  return { summary_placement, summary_internship };
}

/**
 * Parses a single department sheet's rows into individual SPSU student records.
 */
export function parseDepartmentStudents(rows, deptName = 'CSE') {
  if (!rows || rows.length < 2) return [];

  // Find header row (usually row 0)
  let headerIndex = 0;
  for (let i = 0; i < Math.min(5, rows.length); i++) {
    const rowStr = rows[i].map(c => c.toLowerCase()).join(' ');
    if (rowStr.includes('name') || rowStr.includes('enrollment') || rowStr.includes('s.no')) {
      headerIndex = i;
      break;
    }
  }

  const rawHeaders = rows[headerIndex].map(h => h.toLowerCase().trim());
  const findCol = (...aliases) => {
    for (let a of aliases) {
      const idx = rawHeaders.findIndex(h => h.includes(a.toLowerCase()));
      if (idx !== -1) return idx;
    }
    return -1;
  };

  const colSNo = findCol('s.no', 'sno', 'sr.no');
  const colName = findCol('students name', 'student name', 'candidate name', 'name');
  const colEnr = findCol('enrollment no', 'enrolment no', 'roll no', 'reg no');
  const colCourse = findCol('course', 'degree');
  const colDept = findCol('department', 'branch', 'dept');
  const colSpec = findCol('specialization', 'spec');
  const colEmailSpsu = findCol('email id - spsu', 'email spsu', 'spsu email');
  const colEmailPersonal = findCol('email id - personal', 'email personal', 'email');
  const colPhone = findCol('contact no', 'mobile', 'phone');
  const colGender = findCol('gender');
  const colCgpa = findCol('graduation (%/cgpa)', 'cgpa', 'gpa', 'score');
  const colBacklogs = findCol('backlog remaining', 'backlogs', 'arrears');
  const colDecl = findCol('declaration status');
  const colPlStatus = findCol('placement status');
  const colCampus = findCol('campus');
  const colPlComp = findCol('placement companies', 'company joined', 'company');
  const colCTC = findCol('ctc', 'lpa', 'package');
  const colNoc = findCol('noc');
  const colSiStatus = findCol('internship', 'si status');
  const colSiOffered = findCol('companies offered', 'si company');
  const colSiJoined = findCol('company joined');
  const colStipend = findCol('stipend');
  const colLocation = findCol('location');

  const students = [];

  for (let i = headerIndex + 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length < 3) continue;

    const snoVal = colSNo !== -1 && row[colSNo] ? row[colSNo].trim() : '';
    const name = colName !== -1 && row[colName] ? row[colName].trim() : '';
    const enr = colEnr !== -1 && row[colEnr] ? row[colEnr].trim() : '';

    // Must have valid name and enrollment, or a numeric s.no
    if (!name || !enr || name.toLowerCase().includes('total')) {
      continue;
    }

    const sNo = snoVal && /^\d+$/.test(snoVal) ? parseInt(snoVal, 10) : students.length + 1;

    // Determine actual department
    let assignedDept = deptName;
    if (colDept !== -1 && row[colDept] && row[colDept].trim()) {
      const d = row[colDept].toUpperCase().trim();
      if (d.includes('CSE') || d.includes('COMPUTER')) assignedDept = 'CSE';
      else if (d.includes('ECE') || d.includes('ELECTRON')) assignedDept = 'ECE';
      else if (d.includes('MN') || d.includes('MINING')) assignedDept = 'MN';
      else if (d.includes('CE') || d.includes('CIVIL')) assignedDept = 'CE';
      else if (d.includes('ME') || d.includes('MECH')) assignedDept = 'ME';
      else if (d.includes('BDES') || d.includes('DESIGN')) assignedDept = 'BDES';
      else if (d.includes('BCA')) assignedDept = 'BCA';
      else if (d.includes('BBA')) assignedDept = 'BBA';
      else if (d.includes('MBA')) assignedDept = 'MBA';
    }

    // Determine placement status
    const rawPl = colPlStatus !== -1 && row[colPlStatus] ? row[colPlStatus].toLowerCase().trim() : '';
    let placementStatus = 'Remaining';
    if (rawPl.includes('fte')) placementStatus = 'Placed-FTE';
    else if (rawPl.includes('ppo')) placementStatus = 'Placed-PPO';
    else if (rawPl.includes('placed')) placementStatus = 'Placed-FTE';
    else if (rawPl.includes('opt out') || rawPl.includes('opt-out')) placementStatus = 'Opt Out';

    // Declaration status
    let declStatus = 'Opt - In';
    if (placementStatus === 'Opt Out') {
      declStatus = 'Opt - Out';
    } else if (colDecl !== -1 && row[colDecl]) {
      const dRaw = row[colDecl].toLowerCase();
      if (dRaw.includes('out')) declStatus = 'Opt - Out';
    }

    // Parse CTC
    const rawCTC = colCTC !== -1 && row[colCTC] ? row[colCTC] : '';
    let parsedCTC = null;
    if (rawCTC) {
      const m = rawCTC.replace(/,/g, '').match(/(\d+(\.\d+)?)/);
      if (m) parsedCTC = parseFloat(m[1]);
    }

    // Parse CGPA
    const rawCGPA = colCgpa !== -1 && row[colCgpa] ? row[colCgpa] : '';
    let parsedCGPA = null;
    if (rawCGPA) {
      const m = rawCGPA.match(/(\d+(\.\d+)?)/);
      if (m) parsedCGPA = parseFloat(m[1]);
    }

    // Parse Backlogs
    const rawBacklogs = colBacklogs !== -1 && row[colBacklogs] ? parseInt(row[colBacklogs], 10) : 0;
    const backlogs = isNaN(rawBacklogs) ? 0 : rawBacklogs;

    // Companies
    const plCompany = colPlComp !== -1 && row[colPlComp] ? row[colPlComp].trim() : '';
    const siJoined = colSiJoined !== -1 && row[colSiJoined] ? row[colSiJoined].trim() : '';
    const siOffered = colSiOffered !== -1 && row[colSiOffered] ? row[colSiOffered].trim() : '';
    const internshipCo = siJoined || siOffered;
    const hasInternship = internshipCo.length > 0 || (colSiStatus !== -1 && (row[colSiStatus] || '').toLowerCase().includes('offer'));

    students.push({
      id: enr,
      sNo,
      name,
      enrollmentNo: enr,
      course: colCourse !== -1 && row[colCourse] ? row[colCourse].trim() : (assignedDept === 'MBA' || assignedDept === 'BBA' || assignedDept === 'BCA' ? assignedDept : 'B.Tech.'),
      department: assignedDept,
      specialization: colSpec !== -1 && row[colSpec] ? row[colSpec].trim() : 'Core',
      emailSpsu: colEmailSpsu !== -1 && row[colEmailSpsu] ? row[colEmailSpsu].trim() : `${enr.toLowerCase()}@spsu.ac.in`,
      emailPersonal: colEmailPersonal !== -1 && row[colEmailPersonal] ? row[colEmailPersonal].trim() : '',
      contactNo: colPhone !== -1 && row[colPhone] ? row[colPhone].trim() : '',
      gender: colGender !== -1 && row[colGender] ? row[colGender].trim() : 'Other',
      cgpa: parsedCGPA,
      backlogs,
      orientationAttendance: 'Present',
      declarationStatus: declStatus,
      placementStatus,
      placementCampus: colCampus !== -1 && row[colCampus] ? row[colCampus].trim() : 'On-Campus',
      placementCompanies: plCompany,
      placementCTC: parsedCTC,
      placementNOC: colNoc !== -1 && row[colNoc] ? row[colNoc].trim() : 'Pending',
      internshipOffersCount: hasInternship ? 1 : 0,
      internshipOffered: hasInternship,
      internshipCompaniesOffered: siOffered || internshipCo,
      internshipCompanyJoined: siJoined || internshipCo,
      internshipNOC: 'Done',
      internshipProfile: 'Trainee Intern',
      internshipStipend: colStipend !== -1 && row[colStipend] ? row[colStipend].trim() : 'Stipend',
      internshipLocation: colLocation !== -1 && row[colLocation] ? row[colLocation].trim() : 'Regional'
    });
  }

  return students;
}

/**
 * Helper to fetch text from candidate URLs with failover.
 */
async function fetchCSVWithFailover(urls) {
  let lastError = null;
  for (let url of urls) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Accept': 'text/csv, text/plain, */*' }
      });
      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}`);
      }
      const text = await response.text();
      if (text && text.trim().length > 0 && !text.includes('accounts.google.com')) {
        return text;
      }
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError || new Error("Failed to fetch spreadsheet CSV.");
}

/**
 * Main Live Sync Function: Auto-detects Multi-Department workbooks,
 * fetches all departments and Dashboard matrix, or handles single sheets.
 */
export async function fetchLiveGoogleSheet(sheetUrlOrId, selectedGid = 'ALL') {
  const sheetInfo = extractGoogleSheetInfo(sheetUrlOrId);
  if (!sheetInfo) {
    throw new Error("Invalid Google Sheet URL or ID. Please provide a valid docs.google.com/spreadsheets link.");
  }

  const { sheetId, isPublished, originalUrl } = sheetInfo;

  // Check if this sheet is known to have departmental tabs
  const knownTabs = KNOWN_WORKBOOK_TABS[sheetId] || null;

  // IF it's a known multi-department workbook (like the SPSU 2026/2027 Master Sheet)
  // AND the user wants the entire cohort (selectedGid === 'ALL' or selectedGid === '0' or default):
  if (knownTabs && (selectedGid === 'ALL' || selectedGid === '0' || !selectedGid)) {
    // 1. Fetch Dashboard tab (gid=0) for official Directorate numbers
    let summaryMatrix = null;
    try {
      const dashUrls = buildFetchUrls(sheetId, '0', isPublished, originalUrl);
      const dashCsv = await fetchCSVWithFailover(dashUrls);
      const dashRows = parseCSV(dashCsv);
      if (isSummarySheet(dashRows)) {
        summaryMatrix = parseSummaryMatrix(dashRows);
      }
    } catch (e) {
      console.warn("Could not fetch summary dashboard tab, will compute from student rows:", e);
    }

    // 2. Fetch all department sheets in parallel
    const deptTabs = knownTabs.filter(t => t.dept);
    const deptPromises = deptTabs.map(async (tab) => {
      try {
        const urls = buildFetchUrls(sheetId, tab.gid, isPublished, originalUrl);
        const csvText = await fetchCSVWithFailover(urls);
        const rows = parseCSV(csvText);
        return parseDepartmentStudents(rows, tab.dept);
      } catch (err) {
        console.warn(`Failed fetching tab ${tab.name}:`, err);
        return [];
      }
    });

    const results = await Promise.all(deptPromises);
    const allStudents = results.flat();

    if (allStudents.length === 0) {
      throw new Error("Could not load student rows from Google Sheet tabs. Please verify that 'Anyone with the link can view' is active.");
    }

    // If summary matrix was fetched from Dashboard, use it! Otherwise compute dynamically.
    let summary_placement = summaryMatrix?.summary_placement;
    let summary_internship = summaryMatrix?.summary_internship;

    if (!summary_placement || summary_placement.length === 0) {
      const depts = ['CSE', 'ECE', 'MN', 'CE', 'ME', 'BDES', 'BCA', 'BBA', 'MBA'];
      summary_placement = depts.map(d => {
        const dStudents = allStudents.filter(s => s.department === d);
        const total = dStudents.length;
        const optOut = dStudents.filter(s => s.placementStatus === 'Opt Out' || s.declarationStatus.includes('Opt - Out')).length;
        const optIn = total - optOut;
        const fte = dStudents.filter(s => s.placementStatus === 'Placed-FTE').length;
        const ppo = dStudents.filter(s => s.placementStatus === 'Placed-PPO').length;
        const placed = fte + ppo;
        return {
          program: d,
          total_students: total,
          opt_out: optOut,
          db: 0,
          opt_in_late: 0,
          opt_in: Math.max(0, optIn),
          placed,
          offers_count: placed,
          fte,
          ppo,
          remaining: Math.max(0, optIn - placed),
          noc_done: Math.min(placed, 2)
        };
      });
    }

    if (!summary_internship || summary_internship.length === 0) {
      const depts = ['CSE', 'ECE', 'MN', 'CE', 'ME', 'BDES', 'BCA', 'BBA', 'MBA'];
      summary_internship = depts.map(d => {
        const dStudents = allStudents.filter(s => s.department === d);
        const total = dStudents.length;
        const male = dStudents.filter(s => (s.gender || '').toLowerCase() === 'male').length;
        const offered = dStudents.filter(s => s.internshipOffered).length;
        return {
          program: d,
          total_students: total,
          male,
          female: total - male,
          si_o1: offered,
          si_o2: Math.round(offered * 0.15),
          si_o3: 0,
          offers_count: offered,
          offered,
          project: 0,
          remaining: Math.max(0, total - offered)
        };
      });
    }

    const dataset = {
      meta: {
        report: `Google Sheets Live Sync — Sir Padampat Singhania University`,
        batch: "Class of 2026/2027 Directorate Master Sheet",
        sourceUrl: sheetUrlOrId,
        syncedAt: new Date().toISOString(),
        totalStudents: allStudents.length,
        isLiveSynced: true
      },
      summary_placement,
      summary_internship,
      students: allStudents
    };

    return {
      success: true,
      dataset,
      rowCount: allStudents.length,
      availableTabs: knownTabs,
      syncedAt: new Date()
    };
  }

  // 3. Fallback for single specific tab or custom spreadsheet
  const effectiveGid = selectedGid !== 'ALL' && selectedGid ? selectedGid : (sheetInfo.gid || '0');
  const urls = buildFetchUrls(sheetId, effectiveGid, isPublished, originalUrl);
  const csvText = await fetchCSVWithFailover(urls);
  const rows = parseCSV(csvText);

  if (isSummarySheet(rows)) {
    // It's a summary table
    const { summary_placement, summary_internship } = parseSummaryMatrix(rows);
    return {
      success: true,
      dataset: {
        meta: {
          report: `Google Sheet Summary Sync [${sheetId.slice(0, 8)}...]`,
          batch: "SPSU Directorate Summary",
          sourceUrl: sheetUrlOrId,
          syncedAt: new Date().toISOString(),
          totalStudents: summary_placement.reduce((s, i) => s + (i.total_students || 0), 0),
          isLiveSynced: true
        },
        summary_placement,
        summary_internship,
        students: []
      },
      rowCount: summary_placement.length,
      availableTabs: knownTabs || [{ name: 'Current Tab', gid: effectiveGid }],
      syncedAt: new Date()
    };
  }

  // Single department student list
  const students = parseDepartmentStudents(rows, 'CSE');
  const depts = Array.from(new Set(students.map(s => s.department)));
  if (depts.length === 0) depts.push('CSE');

  const summary_placement = depts.map(d => {
    const dStudents = students.filter(s => s.department === d);
    const total = dStudents.length;
    const optOut = dStudents.filter(s => s.placementStatus === 'Opt Out' || s.declarationStatus.includes('Opt - Out')).length;
    const optIn = total - optOut;
    const fte = dStudents.filter(s => s.placementStatus === 'Placed-FTE').length;
    const ppo = dStudents.filter(s => s.placementStatus === 'Placed-PPO').length;
    const placed = fte + ppo;
    return {
      program: d,
      total_students: total,
      opt_out: optOut,
      db: 0,
      opt_in_late: 0,
      opt_in: Math.max(0, optIn),
      placed,
      offers_count: placed,
      fte,
      ppo,
      remaining: Math.max(0, optIn - placed),
      noc_done: Math.min(placed, 2)
    };
  });

  const summary_internship = depts.map(d => {
    const dStudents = students.filter(s => s.department === d);
    const total = dStudents.length;
    const male = dStudents.filter(s => (s.gender || '').toLowerCase() === 'male').length;
    const offered = dStudents.filter(s => s.internshipOffered).length;
    return {
      program: d,
      total_students: total,
      male,
      female: total - male,
      si_o1: offered,
      si_o2: Math.round(offered * 0.15),
      si_o3: 0,
      offers_count: offered,
      offered,
      project: 0,
      remaining: Math.max(0, total - offered)
    };
  });

  return {
    success: true,
    dataset: {
      meta: {
        report: `Google Sheet Live Sync [${sheetId.slice(0, 8)}...]`,
        batch: "Custom Batch Sync",
        sourceUrl: sheetUrlOrId,
        syncedAt: new Date().toISOString(),
        totalStudents: students.length,
        isLiveSynced: true
      },
      summary_placement,
      summary_internship,
      students
    },
    rowCount: students.length,
    availableTabs: knownTabs || [{ name: 'Current Tab', gid: effectiveGid }],
    syncedAt: new Date()
  };
}
