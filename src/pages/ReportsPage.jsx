import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  FileSpreadsheet, 
  Copy, 
  Check, 
  Share2, 
  ShieldCheck, 
  BookOpen,
  Calendar
} from 'lucide-react';
import { exportToCSV, triggerPrintReport } from '../utils/exportUtils';

export default function ReportsPage({ dataset, filteredStudents }) {
  const [copied, setCopied] = useState(false);
  const { summary_placement, summary_internship } = dataset;

  const handleExportStudents = () => {
    exportToCSV(`SPSU_CDC_Students_Detailed_${new Date().toISOString().slice(0, 10)}.csv`, filteredStudents);
  };

  const handleExportPlacementSummary = () => {
    exportToCSV(`SPSU_CDC_Department_Placement_Summary_${new Date().toISOString().slice(0, 10)}.csv`, summary_placement);
  };

  const handleExportInternshipSummary = () => {
    exportToCSV(`SPSU_CDC_Department_Internship_Summary_${new Date().toISOString().slice(0, 10)}.csv`, summary_internship);
  };

  const handleCopyMemo = () => {
    const memo = `
SIR PADAMPAT SINGHANIA UNIVERSITY (SPSU), UDAIPUR
CAREER DEVELOPMENT CELL (CDC) - PLACEMENT INTELLIGENCE SUMMARY
---------------------------------------------------------------------------------
Academic Batch: 2026 Graduating Cohort
Total Batch Size: 392 Students across 9 Academic Disciplines
Active Placement Opt-In: 289 Students (73.7%)
Total Final Placements: 47 Students Confirmed (54 Cumulative Offers)
FTE vs PPO Split: 19 FTE Offers / 28 PPO Offers
Highest Compensation: ₹10.20 LPA (KMK Venture / Country Edu)
Average Compensation: ₹5.85 LPA
Summer Internship Success: 297 Students Offered (374 Offers, 75.8% Conversion)

DEPARTMENT PERFORMANCE HIGHLIGHTS:
- CSE: 192 Students (8 Placed, 146 SI Offers)
- MBA: 47 Students (19 Placed, 45 SI Offers - 95.7% SI Rate)
- BBA: 57 Students (11 Placed, 35 SI Offers)
- CE: 11 Students (5 Placed, 11 SI Offers - 100% SI Rate)
- ME: 10 Students (1 Placed, 9 SI Offers)
- BCA: 38 Students (2 Placed, 27 SI Offers)
- MN: 17 Students (1 Placed, 11 SI Offers)
- BDES: 2 Students (0 Placed, 2 SI Offers - 100% SI Rate)
- ECE: 18 Students (11 SI Offers)
---------------------------------------------------------------------------------
Generated via SPSU Power BI Analytics Console
    `.trim();

    navigator.clipboard.writeText(memo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-500" />
            Executive Reports & Export Studio
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Official Directorate Dossiers, Accreditation Exports, and Institutional Analytics Memos.
          </p>
        </div>

        <button
          onClick={triggerPrintReport}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold rounded-lg text-xs flex items-center gap-2 shadow transition"
        >
          <Printer className="w-4 h-4" />
          Print / Save PDF (Director's Briefing)
        </button>
      </div>

      {/* Main Download Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Official PDF Print Briefing */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#202024] shadow-sm flex flex-col justify-between powerbi-card">
          <div>
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-3">
              <Printer className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Director's 1-Pager Executive Memo
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 leading-relaxed">
              Official university memorandum formatted for A4 print and PDF submission to the Vice Chancellor & Board of Governors.
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-zinc-800">
            <button
              onClick={triggerPrintReport}
              className="w-full py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition"
            >
              <Printer className="w-4 h-4" />
              Generate PDF / Print Preview
            </button>
          </div>
        </div>

        {/* Card 2: Student Master Data CSV */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#202024] shadow-sm flex flex-col justify-between powerbi-card">
          <div>
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold mb-3">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Detailed Students Roster (CSV)
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 leading-relaxed">
              Raw record export of current filtered students ({filteredStudents.length} records) with academic credentials, offers, and contact info.
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-zinc-800">
            <button
              onClick={handleExportStudents}
              className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition"
            >
              <Download className="w-4 h-4" />
              Download Students CSV
            </button>
          </div>
        </div>

        {/* Card 3: Department Matrices (Placement & SI) */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#202024] shadow-sm flex flex-col justify-between powerbi-card">
          <div>
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold mb-3">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Institutional Summary Tables
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 leading-relaxed">
              Aggregated department metrics for NAAC / NBA compliance, placement conversion percentages, and internship multi-offer stats.
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-zinc-800 flex gap-2">
            <button
              onClick={handleExportPlacementSummary}
              className="flex-1 py-2 px-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-[11px] flex items-center justify-center gap-1 transition"
            >
              Placement (CSV)
            </button>
            <button
              onClick={handleExportInternshipSummary}
              className="flex-1 py-2 px-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg text-[11px] flex items-center justify-center gap-1 transition"
            >
              Internship (CSV)
            </button>
          </div>
        </div>

        {/* Card 4: Official Administrator Guide (PDF) */}
        <div className="p-5 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-gradient-to-br from-purple-50/50 to-white dark:from-purple-950/20 dark:to-[#202024] shadow-sm flex flex-col justify-between powerbi-card">
          <div>
            <div className="w-10 h-10 rounded-lg bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold mb-3">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="inline-block px-2 py-0.5 rounded bg-purple-500/15 text-purple-700 dark:text-purple-300 text-[10px] font-bold uppercase tracking-wider mb-1">
              Official Manual
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Portal Admin Guide (PDF)
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 leading-relaxed">
              Comprehensive operations manual covering credentials (ADMIN / SPSU123), architecture, multi-field search, slicers, template ingestion, and Directorate authorization.
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-purple-100 dark:border-zinc-800">
            <a
              href="./SPSU_CDC_Portal_Administrator_Guide.pdf"
              download="SPSU_CDC_Portal_Administrator_Guide.pdf"
              target="_blank"
              rel="noreferrer"
              className="w-full py-2 px-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition text-center shadow"
            >
              <Download className="w-4 h-4" />
              Download Admin Guide (PDF)
            </a>
          </div>
        </div>
      </div>

      {/* Quick Directorate Briefing Text Box */}
      <div className="bg-white dark:bg-[#202024] rounded-xl border border-slate-200 dark:border-zinc-800 p-5 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-zinc-800 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-500" />
              Directorate Ready-to-Paste Briefing Memo
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Formatted bullet points for VC office briefings, senate presentations, and review meetings.
            </p>
          </div>

          <button
            onClick={handleCopyMemo}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Memo'}</span>
          </button>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-zinc-900/60 rounded-lg border border-slate-200 dark:border-zinc-800 font-mono text-xs text-slate-800 dark:text-zinc-300 space-y-2 leading-relaxed select-text">
          <p className="font-bold text-amber-600 dark:text-amber-400">
            [EXECUTIVE BRIEFING] SPSU CAREER DEVELOPMENT CELL (CDC) — BATCH 2026
          </p>
          <p>
            • <strong>Total Cohort:</strong> 392 Students across B.Tech (CSE, ECE, MN, CE, ME), B.Des, BCA, BBA, MBA.
          </p>
          <p>
            • <strong>Final Placement Status:</strong> 47 Confirmed Placements (19 FTE / 28 PPO), representing 16.3% of active opt-in cohort (289 students).
          </p>
          <p>
            • <strong>Compensation Benchmarks:</strong> Peak Package: ₹10.20 LPA (KMK Venture / Country Edu) • Avg: ₹5.85 LPA.
          </p>
          <p>
            • <strong>Summer Internship (SI) Conversions:</strong> 297 Students (75.8%) secured 374 Offers (229 Single, 57 Dual, 9 Triple).
          </p>
          <p>
            • <strong>Key Hiring Organizations:</strong> Country Edu, Cyntexa, Kreativan, Eleation, I.EVO, SK Khetan, Xebia, Hindustan Zinc, JK Cement.
          </p>
        </div>
      </div>
    </div>
  );
}
