import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Award, 
  Briefcase, 
  TrendingUp, 
  DollarSign, 
  CheckCircle2, 
  Building, 
  GraduationCap, 
  ArrowUpRight,
  PieChart,
  BarChart,
  AlertTriangle,
  FileCheck,
  ShieldCheck,
  Sparkles,
  Clock,
  Calendar,
  ExternalLink,
  ChevronRight,
  Filter,
  Layers,
  ArrowRight,
  Target,
  Compass,
  FileSpreadsheet,
  FileText,
  Activity
} from 'lucide-react';

export default function ExecutiveOverviewPage({ 
  dataset, 
  filteredStudents, 
  onSelectProgram, 
  onSelectStudent,
  onNavigateTab,
  onFilterChange 
}) {
  const { summary_placement, summary_internship, meta } = dataset;

  const [liveClock, setLiveClock] = useState(new Date());
  const [hoveredBar, setHoveredBar] = useState(null);
  const [activeChartTab, setActiveChartTab] = useState('placements_vs_si'); // 'placements_vs_si' | 'ctc_tiers' | 'gender_parity'

  useEffect(() => {
    const timer = setInterval(() => setLiveClock(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Filtered statistics
  const currentTotal = filteredStudents.length;
  const currentPlaced = filteredStudents.filter(s => s.placementStatus.startsWith('Placed')).length;
  const currentOptOut = filteredStudents.filter(s => s.declarationStatus.includes('Opt Out')).length;
  const currentEligible = currentTotal - currentOptOut;
  const currentPlacementRate = currentEligible > 0 ? ((currentPlaced / currentEligible) * 100).toFixed(1) : '0.0';

  const currentSIOffered = filteredStudents.filter(s => s.internshipOffered).length;
  const currentSIRate = currentTotal > 0 ? ((currentSIOffered / currentTotal) * 100).toFixed(1) : '0.0';

  const validCTCs = filteredStudents.filter(s => s.placementCTC).map(s => s.placementCTC);
  const maxCTC = validCTCs.length ? Math.max(...validCTCs) : 10.2;
  const avgCTC = validCTCs.length ? (validCTCs.reduce((a, b) => a + b, 0) / validCTCs.length).toFixed(2) : '5.85';

  const fteCount = filteredStudents.filter(s => s.placementStatus === 'Placed-FTE').length;
  const ppoCount = filteredStudents.filter(s => s.placementStatus === 'Placed-PPO').length;
  const remainingCount = filteredStudents.filter(s => s.placementStatus === 'Remaining').length;

  // CTC Tiers Calculation
  const tier1Count = filteredStudents.filter(s => (s.placementCTC || 0) >= 8).length;
  const tier2Count = filteredStudents.filter(s => (s.placementCTC || 0) >= 5 && (s.placementCTC || 0) < 8).length;
  const tier3Count = filteredStudents.filter(s => (s.placementCTC || 0) > 0 && (s.placementCTC || 0) < 5).length;

  // Gender breakdown
  const maleCount = filteredStudents.filter(s => (s.gender || '').toLowerCase() === 'male').length;
  const femaleCount = filteredStudents.filter(s => (s.gender || '').toLowerCase() === 'female').length;
  const malePlaced = filteredStudents.filter(s => (s.gender || '').toLowerCase() === 'male' && s.placementStatus.startsWith('Placed')).length;
  const femalePlaced = filteredStudents.filter(s => (s.gender || '').toLowerCase() === 'female' && s.placementStatus.startsWith('Placed')).length;

  // Top hiring partners aggregation
  const recruiterStats = {};
  filteredStudents.filter(s => s.placementCompanies).forEach(s => {
    const comp = s.placementCompanies.trim();
    if (!recruiterStats[comp]) {
      recruiterStats[comp] = { name: comp, hires: 0, ctc: s.placementCTC || 0, depts: new Set() };
    }
    recruiterStats[comp].hires += 1;
    recruiterStats[comp].depts.add(s.department);
  });
  const topRecruiters = Object.values(recruiterStats)
    .sort((a, b) => b.hires - a.hires || b.ctc - a.ctc)
    .slice(0, 7);

  // Hyperlink Helper: filter and jump to another tab
  const handleDrillThrough = (tabId, filterKey = null, filterValue = null) => {
    if (filterKey && filterValue && onFilterChange) {
      onFilterChange(filterKey, filterValue);
    }
    if (onNavigateTab) {
      onNavigateTab(tabId);
    }
  };

  // Max values for chart normalization
  const maxDeptCohort = Math.max(...summary_placement.map(d => d.total_students), 192);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ============================================================== */}
      {/* 🏛️ 1. WORLD-CLASS EXECUTIVE AUTHORITY TICKER & HYPERLINKS BAR   */}
      {/* (NO UNIVERSITY IMAGE - PURE POWER BI DATA & ACCREDITATIONS)     */}
      {/* ============================================================== */}
      <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#202024] shadow-sm overflow-hidden">
        {/* Top Header Strip */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Institutional Executive Console
              </span>
              <span className="text-xs text-zinc-400">
                Sir Padampat Singhania University (SPSU) • Bhatewar, Udaipur 313601
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Career Development Cell (CDC) — Directorate Executive Cockpit
            </h1>
            <p className="text-xs text-zinc-300 max-w-3xl leading-relaxed">
              Official institutional intelligence suite monitoring placement conversion velocity, industry summer internships, compensation benchmarks, and recruiter dynamics for the <strong>Class of 2026</strong>.
            </p>
          </div>

          {/* Right Clock & Live Status Badge */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-2 shrink-0">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs font-mono text-zinc-200 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-emerald-400 font-bold">LIVE AUDIT</span>
              <span className="text-zinc-600">•</span>
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>{liveClock.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}</span>
              <span className="text-zinc-600">•</span>
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-bold text-white">{liveClock.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}</span>
              <span className="text-[9px] px-1 rounded bg-zinc-800 text-zinc-400">IST</span>
            </div>
            <span className="text-[11px] text-amber-400/90 font-semibold tracking-wide">
              Directorate Reference: SPSU/CDC/DIR/2026/01
            </span>
          </div>
        </div>

        {/* Official Accreditations Bar with External Hyperlinks */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
              Accreditation & Registry Links:
            </span>

            {/* Hyperlink 1: QS I-GAUGE */}
            <a 
              href="https://www.igauge.in" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/80 font-bold hover:bg-amber-100 transition shadow-2xs"
              title="Verify QS I-GAUGE Gold Rating"
            >
              <span>QS I-GAUGE: Gold Rating</span>
              <ExternalLink className="w-3 h-3 text-amber-600" />
            </a>

            {/* Hyperlink 2: AIMA Member */}
            <a 
              href="https://www.aima.in" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-700/80 font-bold hover:bg-blue-100 transition shadow-2xs"
              title="All India Management Association Member Directory"
            >
              <span>AIMA Member</span>
              <ExternalLink className="w-3 h-3 text-blue-600" />
            </a>

            {/* Hyperlink 3: AIU Member */}
            <a 
              href="https://www.aiu.ac.in" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700/80 font-bold hover:bg-indigo-100 transition shadow-2xs"
              title="Association of Indian Universities Portal"
            >
              <span>AIU Member</span>
              <ExternalLink className="w-3 h-3 text-indigo-600" />
            </a>

            {/* Hyperlink 4: Rankings */}
            <a 
              href="https://www.educationworld.in" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-700/80 font-bold hover:bg-purple-100 transition shadow-2xs"
              title="Ranked 3 in Rajasthan Private Engineering Universities"
            >
              <Sparkles className="w-3 h-3 text-purple-500" />
              <span>Ranked 3 in Rajasthan</span>
              <ExternalLink className="w-3 h-3 text-purple-600" />
            </a>

            {/* Hyperlink 5: Official Website */}
            <a 
              href="https://www.spsu.ac.in" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/80 font-bold hover:bg-emerald-100 transition shadow-2xs"
              title="Visit Official SPSU Website"
            >
              <span>spsu.ac.in</span>
              <ExternalLink className="w-3 h-3 text-emerald-600" />
            </a>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500 dark:text-zinc-400">
              Audited Cohort: <strong className="text-slate-900 dark:text-white">392 Students</strong>
            </span>
          </div>
        </div>

        {/* Fast Action Breadcrumb Navigation Pills (Hyperlinks to Portal Sections) */}
        <div className="px-4 py-2 bg-white dark:bg-[#1c1c20] border-t border-slate-200 dark:border-zinc-800 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-amber-500" />
            Executive Jump Links:
          </span>
          <button 
            onClick={() => handleDrillThrough('placements')}
            className="px-3 py-1 rounded-md bg-slate-100 dark:bg-zinc-800 hover:bg-amber-500 hover:text-slate-950 text-slate-700 dark:text-zinc-300 font-semibold transition shrink-0 flex items-center gap-1.5"
          >
            <Briefcase className="w-3.5 h-3.5 text-amber-500" />
            <span>Placement Hub</span>
            <ChevronRight className="w-3 h-3 opacity-60" />
          </button>
          <button 
            onClick={() => handleDrillThrough('internships')}
            className="px-3 py-1 rounded-md bg-slate-100 dark:bg-zinc-800 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-zinc-300 font-semibold transition shrink-0 flex items-center gap-1.5"
          >
            <Building className="w-3.5 h-3.5 text-blue-500" />
            <span>Summer Internship (297)</span>
            <ChevronRight className="w-3 h-3 opacity-60" />
          </button>
          <button 
            onClick={() => handleDrillThrough('students')}
            className="px-3 py-1 rounded-md bg-slate-100 dark:bg-zinc-800 hover:bg-emerald-600 hover:text-white text-slate-700 dark:text-zinc-300 font-semibold transition shrink-0 flex items-center gap-1.5"
          >
            <GraduationCap className="w-3.5 h-3.5 text-emerald-500" />
            <span>Student 360° Matrix</span>
            <ChevronRight className="w-3 h-3 opacity-60" />
          </button>
          <button 
            onClick={() => handleDrillThrough('recruiters')}
            className="px-3 py-1 rounded-md bg-slate-100 dark:bg-zinc-800 hover:bg-purple-600 hover:text-white text-slate-700 dark:text-zinc-300 font-semibold transition shrink-0 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
            <span>Recruiter Intelligence</span>
            <ChevronRight className="w-3 h-3 opacity-60" />
          </button>
          <button 
            onClick={() => handleDrillThrough('reports')}
            className="px-3 py-1 rounded-md bg-slate-100 dark:bg-zinc-800 hover:bg-slate-900 hover:text-amber-400 text-slate-700 dark:text-zinc-300 font-semibold transition shrink-0 flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-teal-500" />
            <span>Official Reports Studio</span>
            <ChevronRight className="w-3 h-3 opacity-60" />
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 📊 2. POWER BI EXECUTIVE KPI SCORECARDS (ALL HYPERLINKED)       */}
      {/* ============================================================== */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 1: Total Batch */}
        <div 
          onClick={() => handleDrillThrough('students')}
          className="p-3.5 bg-white dark:bg-[#202024] rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm powerbi-card cursor-pointer group hover:border-amber-500 transition"
          title="Click to jump to Student 360° Matrix"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Cohort</span>
            <Users className="w-4 h-4 text-slate-400 group-hover:text-amber-500 transition" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white flex items-baseline justify-between">
            <span>{currentTotal}</span>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-500 transition" />
          </div>
          <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500 dark:text-zinc-400">
            <span>{currentOptOut} Opted Out</span>
            <span className="text-blue-500 font-semibold">{currentEligible} Eligible</span>
          </div>
        </div>

        {/* Card 2: Placed Students */}
        <div 
          onClick={() => handleDrillThrough('placements', 'placementStatus', 'Placed')}
          className="p-3.5 bg-white dark:bg-[#202024] rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm powerbi-card cursor-pointer group hover:border-emerald-500 transition"
          title="Click to open Placement Hub filtered by Placed Students"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Placed Offers</span>
            <Award className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 flex items-baseline justify-between">
            <span>{currentPlaced}</span>
            <span className="text-xs font-bold text-emerald-500/80">({currentPlacementRate}%)</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500 dark:text-zinc-400">
            <span>{fteCount} FTE</span>
            <span className="text-emerald-600 font-semibold">{ppoCount} PPO</span>
          </div>
        </div>

        {/* Card 3: Summer Internships */}
        <div 
          onClick={() => handleDrillThrough('internships')}
          className="p-3.5 bg-white dark:bg-[#202024] rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm powerbi-card cursor-pointer group hover:border-blue-500 transition"
          title="Click to jump to Summer Internship Hub"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">SI Offered</span>
            <Briefcase className="w-4 h-4 text-blue-500 group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 flex items-baseline justify-between">
            <span>{currentSIOffered}</span>
            <span className="text-xs font-bold text-blue-500/80">({currentSIRate}%)</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500 dark:text-zinc-400">
            <span>374 Total Offers</span>
            <span className="text-blue-500 font-semibold">75.8% Conversion</span>
          </div>
        </div>

        {/* Card 4: Highest Package */}
        <div 
          onClick={() => handleDrillThrough('recruiters')}
          className="p-3.5 bg-white dark:bg-[#202024] rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm powerbi-card cursor-pointer group hover:border-amber-500 transition"
          title="Click to view Recruiter Intelligence for Peak Package"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Highest CTC</span>
            <DollarSign className="w-4 h-4 text-amber-500 group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 flex items-baseline justify-between">
            <span>₹{maxCTC}</span>
            <span className="text-xs font-semibold text-slate-400">LPA</span>
          </div>
          <div className="mt-1 text-[10px] text-slate-500 dark:text-zinc-400 truncate font-medium">
            KMK Venture / Country Edu
          </div>
        </div>

        {/* Card 5: Average Package */}
        <div 
          onClick={() => handleDrillThrough('placements')}
          className="p-3.5 bg-white dark:bg-[#202024] rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm powerbi-card cursor-pointer group hover:border-purple-500 transition"
          title="Click to view Compensation Analytics"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Average CTC</span>
            <TrendingUp className="w-4 h-4 text-purple-500 group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400 flex items-baseline justify-between">
            <span>₹{avgCTC}</span>
            <span className="text-xs font-semibold text-slate-400">LPA</span>
          </div>
          <div className="mt-1 text-[10px] text-slate-500 dark:text-zinc-400">
            Tier-1 TPO Benchmark
          </div>
        </div>

        {/* Card 6: Corporate Recruiters */}
        <div 
          onClick={() => handleDrillThrough('recruiters')}
          className="p-3.5 bg-white dark:bg-[#202024] rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm powerbi-card cursor-pointer group hover:border-teal-500 transition"
          title="Click to inspect all 28+ Corporate Recruiter Drives"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Recruiters</span>
            <Building className="w-4 h-4 text-teal-500 group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl font-black text-teal-600 dark:text-teal-400 flex items-baseline justify-between">
            <span>28+</span>
            <span className="text-xs font-semibold text-slate-400">Drives</span>
          </div>
          <div className="mt-1 text-[10px] text-slate-500 dark:text-zinc-400">
            Xebia, HZL, JK Cement, Celebal
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 📈 3. MULTI-GRAPH SUITE: INTERACTIVE VISUAL ANALYTICS           */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* GRAPH 1: Department Conversion Comparison Column Graph (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#202024] rounded-xl border border-slate-200 dark:border-zinc-800 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-zinc-800 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BarChart className="w-4 h-4 text-amber-500" />
                  Department Placements vs Summer Internships (Interactive Column Graph)
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                  Hover for exact metrics • Click any column to drill-down into that department.
                </p>
              </div>

              {/* Legend with interactive toggles */}
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-zinc-300">
                  <span className="w-3 h-3 rounded-sm bg-emerald-500"></span>
                  <span>Placed ({currentPlaced})</span>
                </span>
                <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-zinc-300">
                  <span className="w-3 h-3 rounded-sm bg-blue-500"></span>
                  <span>Internship ({currentSIOffered})</span>
                </span>
                <span className="flex items-center gap-1.5 font-medium text-slate-400">
                  <span className="w-3 h-3 rounded-sm bg-slate-200 dark:bg-zinc-700"></span>
                  <span>Cohort</span>
                </span>
              </div>
            </div>

            {/* SVG Visual Column Chart */}
            <div className="relative pt-4 pb-2">
              <div className="h-56 flex items-end justify-between gap-2 sm:gap-4 px-2">
                {summary_placement.map((prog) => {
                  const siProg = summary_internship.find(s => s.program === prog.program) || { offered: 0 };
                  const totalHeight = Math.max(12, Math.round((prog.total_students / maxDeptCohort) * 190));
                  const placedHeight = Math.max(prog.placed > 0 ? 8 : 0, Math.round((prog.placed / maxDeptCohort) * 190));
                  const siHeight = Math.max(siProg.offered > 0 ? 8 : 0, Math.round((siProg.offered / maxDeptCohort) * 190));
                  const isHovered = hoveredBar === prog.program;

                  return (
                    <div 
                      key={prog.program}
                      onMouseEnter={() => setHoveredBar(prog.program)}
                      onMouseLeave={() => setHoveredBar(null)}
                      onClick={() => handleDrillThrough('students', 'program', prog.program)}
                      className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer relative"
                    >
                      {/* Floating Tooltip */}
                      {isHovered && (
                        <div className="absolute -top-12 z-20 px-2.5 py-1.5 bg-slate-900 text-white text-[10px] rounded-lg shadow-xl border border-zinc-700 whitespace-nowrap animate-in fade-in">
                          <div className="font-bold text-amber-400">{prog.program} Discipline</div>
                          <div>Cohort: {prog.total_students} | Placed: {prog.placed} | SI: {siProg.offered}</div>
                          <div className="text-[9px] text-emerald-400 font-semibold">Click to drill into student roster →</div>
                        </div>
                      )}

                      {/* Bar Group */}
                      <div className="w-full flex items-end justify-center gap-1">
                        {/* Placed Column */}
                        <div 
                          className={`w-2.5 sm:w-3.5 bg-emerald-500 rounded-t transition-all ${
                            isHovered ? 'brightness-125 scale-y-105' : 'opacity-90'
                          }`}
                          style={{ height: `${placedHeight}px` }}
                          title={`${prog.program} Placed: ${prog.placed}`}
                        ></div>

                        {/* SI Column */}
                        <div 
                          className={`w-2.5 sm:w-3.5 bg-blue-500 rounded-t transition-all ${
                            isHovered ? 'brightness-125 scale-y-105' : 'opacity-90'
                          }`}
                          style={{ height: `${siHeight}px` }}
                          title={`${prog.program} Internship: ${siProg.offered}`}
                        ></div>

                        {/* Total Cohort Ghost Column */}
                        <div 
                          className="w-1.5 sm:w-2 bg-slate-200 dark:bg-zinc-800 rounded-t opacity-60"
                          style={{ height: `${totalHeight}px` }}
                          title={`${prog.program} Total: ${prog.total_students}`}
                        ></div>
                      </div>

                      {/* X-Axis Label */}
                      <span className={`mt-2 text-[11px] font-bold transition ${
                        isHovered ? 'text-amber-500 scale-110' : 'text-slate-600 dark:text-zinc-400'
                      }`}>
                        {prog.program}
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono">
                        {prog.total_students}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
            <span>Total SPSU Engineering, Design & Management Disciplines</span>
            <button 
              onClick={() => handleDrillThrough('students')}
              className="font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>Explore All 392 Students</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* GRAPH 2 & 3: Donut Pathway Share & Funnel Breakdown (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Donut Chart: Placement Pathway (PPO vs FTE vs Unplaced) */}
          <div className="bg-white dark:bg-[#202024] rounded-xl border border-slate-200 dark:border-zinc-800 p-5 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-zinc-800 mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                <PieChart className="w-4 h-4 text-emerald-500" />
                Placement Pathway & Conversion Donut
              </h3>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                54 Total Offers
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              {/* SVG Ring Donut */}
              <div className="relative w-32 h-32 shrink-0">
                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                  {/* Background Circle */}
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#E2E8F0" strokeWidth="4" />
                  
                  {/* PPO Segment (28/47 = 59.5%) */}
                  <circle
                    cx="18" cy="18" r="15.915"
                    fill="transparent"
                    stroke="#10B981"
                    strokeWidth="4.2"
                    strokeDasharray="59.5 40.5"
                    strokeDashoffset="0"
                    className="hover:stroke-emerald-400 transition cursor-pointer"
                    onClick={() => handleDrillThrough('placements', 'placementStatus', 'Placed-PPO')}
                  />
                  
                  {/* FTE Segment (19/47 = 40.5%) */}
                  <circle
                    cx="18" cy="18" r="15.915"
                    fill="transparent"
                    stroke="#3B82F6"
                    strokeWidth="4.2"
                    strokeDasharray="40.5 59.5"
                    strokeDashoffset="-59.5"
                    className="hover:stroke-blue-400 transition cursor-pointer"
                    onClick={() => handleDrillThrough('placements', 'placementStatus', 'Placed-FTE')}
                  />
                </svg>

                {/* Center Donut Label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xl font-black text-slate-900 dark:text-white leading-none">47</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">Placed</span>
                </div>
              </div>

              {/* Legend with interactive Click-to-Filter Links */}
              <div className="flex-1 space-y-2 text-xs">
                <div 
                  onClick={() => handleDrillThrough('placements', 'placementStatus', 'Placed-PPO')}
                  className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 cursor-pointer hover:border-emerald-500 transition flex items-center justify-between"
                  title="Click to view all PPO offers"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span className="font-bold text-emerald-950 dark:text-emerald-200">PPO Pathway</span>
                  </div>
                  <span className="font-black text-emerald-600 dark:text-emerald-400">28 (59.6%)</span>
                </div>

                <div 
                  onClick={() => handleDrillThrough('placements', 'placementStatus', 'Placed-FTE')}
                  className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 cursor-pointer hover:border-blue-500 transition flex items-center justify-between"
                  title="Click to view all FTE offers"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                    <span className="font-bold text-blue-950 dark:text-blue-200">FTE Direct</span>
                  </div>
                  <span className="font-black text-blue-600 dark:text-blue-400">19 (40.4%)</span>
                </div>

                <div 
                  onClick={() => handleDrillThrough('placements', 'placementStatus', 'Remaining')}
                  className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 cursor-pointer hover:border-amber-500 transition flex items-center justify-between"
                  title="Click to view active candidates"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <span className="font-bold text-amber-950 dark:text-amber-200">In Pipeline</span>
                  </div>
                  <span className="font-black text-amber-600 dark:text-amber-400">242 Candidates</span>
                </div>
              </div>
            </div>
          </div>

          {/* GRAPH 3: CTC Compensation Tier Step Breakdown */}
          <div className="bg-white dark:bg-[#202024] rounded-xl border border-slate-200 dark:border-zinc-800 p-5 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-zinc-800 mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-amber-500" />
                Compensation Salary Tiers (LPA)
              </h3>
              <span className="text-[10px] text-slate-400 font-bold">Peak ₹10.20 LPA</span>
            </div>

            <div className="space-y-2.5 text-xs">
              {/* Tier 1 */}
              <div>
                <div className="flex justify-between items-center text-[11px] font-bold mb-1">
                  <span className="text-amber-700 dark:text-amber-300 flex items-center gap-1">
                    <span>Super Dream (&gt;= ₹8 LPA)</span>
                    <span className="text-[9px] font-mono px-1 rounded bg-amber-100 dark:bg-amber-950 text-amber-800">Peak Tier</span>
                  </span>
                  <span className="font-extrabold text-amber-600">{tier1Count} Offers (KMK, Country Edu, Eleation)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(tier1Count / Math.max(1, currentPlaced)) * 100}%` }}></div>
                </div>
              </div>

              {/* Tier 2 */}
              <div>
                <div className="flex justify-between items-center text-[11px] font-bold mb-1">
                  <span className="text-blue-700 dark:text-blue-300">Dream Tier (₹5 - ₹8 LPA)</span>
                  <span className="font-extrabold text-blue-600">{tier2Count} Offers (Cyntexa, Solar, Naviotech)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(tier2Count / Math.max(1, currentPlaced)) * 100}%` }}></div>
                </div>
              </div>

              {/* Tier 3 */}
              <div>
                <div className="flex justify-between items-center text-[11px] font-bold mb-1">
                  <span className="text-purple-700 dark:text-purple-300">Core & Industry Tier (&lt; ₹5 LPA)</span>
                  <span className="font-extrabold text-purple-600">{tier3Count} Offers (Kreativan, Tempsens, SK)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: `${(tier3Count / Math.max(1, currentPlaced)) * 100}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 📊 4. DEPARTMENT MASTER MATRIX WITH INSTANT DRILL-THROUGH LINKS */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 8 Cols: Department Performance Matrix */}
        <div className="lg:col-span-8 bg-white dark:bg-[#202024] rounded-xl border border-slate-200 dark:border-zinc-800 p-5 shadow-sm flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 dark:border-zinc-800 gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-amber-500" />
                Discipline-Wise Placement & Internship Matrix (Official CDC Register)
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                Click any row or 'Drill-Through' link to inspect verified student rosters.
              </p>
            </div>
            <span className="text-[11px] font-bold text-slate-400 bg-slate-100 dark:bg-zinc-800 px-2.5 py-1 rounded-md">
              9 Departments Consolidated
            </span>
          </div>

          <div className="overflow-x-auto mt-3 flex-1">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-zinc-800/60 text-slate-600 dark:text-zinc-300 text-[11px] font-bold uppercase border-b border-slate-200 dark:border-zinc-700">
                  <th className="py-2.5 px-3">Discipline</th>
                  <th className="py-2.5 px-2 text-center">Cohort</th>
                  <th className="py-2.5 px-2 text-center">Opt-Out</th>
                  <th className="py-2.5 px-2 text-center">Opt-In</th>
                  <th className="py-2.5 px-2 text-center text-emerald-600 dark:text-emerald-400">Placed</th>
                  <th className="py-2.5 px-2 text-center">FTE</th>
                  <th className="py-2.5 px-2 text-center">PPO</th>
                  <th className="py-2.5 px-2 text-center text-blue-600 dark:text-blue-400">SI Offers</th>
                  <th className="py-2.5 px-3 text-right">Conversion</th>
                  <th className="py-2.5 px-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/70">
                {summary_placement.map((prog) => {
                  const conversion = prog.opt_in > 0 ? ((prog.placed / prog.opt_in) * 100).toFixed(1) : 0;
                  const siProg = summary_internship.find(s => s.program === prog.program) || { offers_count: 0 };
                  return (
                    <tr 
                      key={prog.program}
                      className="hover:bg-amber-50/60 dark:hover:bg-zinc-800/50 cursor-pointer transition group"
                    >
                      <td 
                        onClick={() => onSelectProgram(prog.program)}
                        className="py-2.5 px-3 font-bold text-slate-900 dark:text-white flex items-center gap-1.5"
                      >
                        <span className="w-2 h-2 rounded-full bg-amber-400 group-hover:scale-125 transition"></span>
                        {prog.program}
                      </td>
                      <td className="py-2.5 px-2 text-center text-slate-700 dark:text-zinc-300 font-medium">{prog.total_students}</td>
                      <td className="py-2.5 px-2 text-center text-slate-400">{prog.opt_out}</td>
                      <td className="py-2.5 px-2 text-center text-slate-800 dark:text-zinc-200 font-semibold">{prog.opt_in}</td>
                      <td className="py-2.5 px-2 text-center font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/20">
                        {prog.placed}
                      </td>
                      <td className="py-2.5 px-2 text-center text-slate-600 dark:text-zinc-400">{prog.fte}</td>
                      <td className="py-2.5 px-2 text-center text-slate-600 dark:text-zinc-400">{prog.ppo}</td>
                      <td className="py-2.5 px-2 text-center font-bold text-blue-600 dark:text-blue-400">
                        {siProg.offers_count}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-14 h-1.5 bg-slate-200 dark:bg-zinc-700 rounded-full overflow-hidden hidden sm:block">
                            <div 
                              className="h-full bg-gradient-to-r from-amber-400 to-emerald-500 rounded-full"
                              style={{ width: `${Math.min(conversion, 100)}%` }}
                            ></div>
                          </div>
                          <span className="font-bold text-slate-800 dark:text-zinc-200">{conversion}%</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        <button
                          onClick={() => handleDrillThrough('students', 'program', prog.program)}
                          className="px-2 py-0.5 rounded bg-slate-100 hover:bg-amber-500 hover:text-slate-950 text-slate-600 dark:bg-zinc-800 dark:text-zinc-300 font-semibold text-[10px] transition inline-flex items-center gap-0.5"
                          title={`Drill into ${prog.program} student roster`}
                        >
                          <span>Roster</span>
                          <ArrowRight className="w-2.5 h-2.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-white font-extrabold border-t-2 border-slate-300 dark:border-zinc-700">
                  <td className="py-2.5 px-3">Total SPSU</td>
                  <td className="py-2.5 px-2 text-center">392</td>
                  <td className="py-2.5 px-2 text-center">76</td>
                  <td className="py-2.5 px-2 text-center">289</td>
                  <td className="py-2.5 px-2 text-center text-emerald-600 dark:text-emerald-400">47</td>
                  <td className="py-2.5 px-2 text-center">19</td>
                  <td className="py-2.5 px-2 text-center">28</td>
                  <td className="py-2.5 px-2 text-center text-blue-600 dark:text-blue-400">374</td>
                  <td className="py-2.5 px-3 text-right text-emerald-600 dark:text-emerald-400">
                    {((47 / 289) * 100).toFixed(1)}%
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    <button
                      onClick={() => handleDrillThrough('students', 'program', 'ALL')}
                      className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-bold text-[10px] transition hover:bg-amber-400"
                    >
                      All (392)
                    </button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Right 4 Cols: Marquee Corporate Recruiters with Direct Hyperlinks */}
        <div className="lg:col-span-4 bg-white dark:bg-[#202024] rounded-xl border border-slate-200 dark:border-zinc-800 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-zinc-800 mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                <Building className="w-4 h-4 text-emerald-500" />
                Marquee Recruiters & CTC Matrix
              </h3>
              <span className="text-[10px] text-amber-500 font-bold">Top Packages</span>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { name: 'KMK Venture', package: '₹10.20 LPA', role: 'Business & Finance', hires: '1 Offer', highlight: true },
                { name: 'Country Edu Pvt Ltd', package: '₹10.00 LPA', role: 'Management & Tech', hires: '7 Offers', highlight: true },
                { name: 'Eleation Services', package: '₹9.00 LPA', role: 'Mechanical Core', hires: '1 Offer', highlight: false },
                { name: 'Rajasthan Shubham Solar', package: '₹7.00 LPA', role: 'Renewable Engg', hires: '2 Offers', highlight: false },
                { name: 'Cyntexa', package: '₹5.00 LPA', role: 'Software Engineering', hires: '2 Offers', highlight: false },
                { name: 'I.EVO Solutions', package: '₹4.50 LPA', role: 'Civil & Infra Tech', hires: '3 Offers', highlight: false },
                { name: 'Kreativan Technologies', package: '₹4.00 LPA', role: 'AI & Full Stack', hires: '4 Offers', highlight: false }
              ].map((rec) => (
                <div 
                  key={rec.name} 
                  onClick={() => handleDrillThrough('recruiters')}
                  className="p-2.5 rounded-lg bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-zinc-700/50 hover:border-amber-500 dark:hover:border-amber-500 transition cursor-pointer group flex items-center justify-between"
                  title={`Click to view all recruiter intelligence for ${rec.name}`}
                >
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{rec.name}</span>
                      {rec.highlight && (
                        <span className="text-[9px] px-1 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 font-semibold">Tier 1</span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-zinc-400">{rec.role} • {rec.hires}</div>
                  </div>
                  <div className="text-right flex items-center gap-1">
                    <span className="font-extrabold text-amber-600 dark:text-amber-400">
                      {rec.package}
                    </span>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-amber-500 group-hover:translate-x-0.5 transition" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 mt-3">
            <button
              onClick={() => handleDrillThrough('recruiters')}
              className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Open Complete Recruiter Intelligence Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
