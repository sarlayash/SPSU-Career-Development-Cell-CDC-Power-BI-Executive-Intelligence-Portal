import React, { useState } from 'react';
import { 
  Building2, 
  Award, 
  Users, 
  CheckCircle2, 
  MapPin, 
  DollarSign, 
  ExternalLink, 
  FileCheck,
  ChevronRight,
  Briefcase,
  GraduationCap,
  Sparkles,
  BarChart,
  PieChart,
  ArrowRight
} from 'lucide-react';

export default function InternshipPage({ 
  dataset, 
  filteredStudents, 
  onSelectStudent,
  onNavigateTab,
  onFilterChange 
}) {
  const { summary_internship } = dataset;

  const siStudents = filteredStudents.filter(s => s.internshipOffered);
  const pendingStudents = filteredStudents.filter(s => !s.internshipOffered);

  // Group by SI company
  const companyCounts = {};
  siStudents.forEach(s => {
    const raw = s.internshipCompaniesOffered || s.internshipCompanyJoined || 'Regional Industry Partner';
    const parts = raw.split(/[\n;]/).map(p => p.replace(/^\d+\.\s*/, '').trim()).filter(Boolean);
    parts.forEach(c => {
      companyCounts[c] = (companyCounts[c] || 0) + 1;
    });
  });

  const sortedCompanies = Object.entries(companyCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15);

  const handleDrillThrough = (tabId, filterKey = null, filterValue = null) => {
    if (filterKey && filterValue && onFilterChange) {
      onFilterChange(filterKey, filterValue);
    }
    if (onNavigateTab) {
      onNavigateTab(tabId);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Fast Action Breadcrumb Navigation Pills (Hyperlinks to other suites) */}
      <div className="p-2.5 bg-white dark:bg-[#202024] rounded-xl border border-slate-200 dark:border-zinc-800 flex items-center justify-between gap-3 text-xs shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
            Quick Navigation:
          </span>
          <button 
            onClick={() => handleDrillThrough('overview')}
            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 font-semibold transition shrink-0"
          >
            ← Executive Cockpit
          </button>
          <button 
            onClick={() => handleDrillThrough('placements')}
            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-amber-500 hover:text-slate-950 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-semibold transition shrink-0"
          >
            Placement Hub (47)
          </button>
          <button 
            onClick={() => handleDrillThrough('students')}
            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-emerald-600 hover:text-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-semibold transition shrink-0"
          >
            Student 360° Matrix
          </button>
          <button 
            onClick={() => handleDrillThrough('recruiters')}
            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-purple-600 hover:text-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-semibold transition shrink-0"
          >
            Recruiter Intelligence
          </button>
        </div>

        <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 shrink-0 hidden sm:inline">
          374 Total Offers Verified
        </span>
      </div>

      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-500" />
            Summer Internship (SI) Portal & Industry Practice
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Mandatory experiential learning, multi-offer tracking, and industrial training conversions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-lg">
            297 Students Offered (75.8%)
          </span>
          <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-600 dark:text-purple-400 text-xs font-bold rounded-lg">
            374 Cumulative Offers
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div 
          onClick={() => handleDrillThrough('students', 'internshipStatus', 'Offered')}
          className="p-4 bg-white dark:bg-[#202024] rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm powerbi-card cursor-pointer hover:border-emerald-500 transition"
          title="Click to view all students with internship offers"
        >
          <div className="flex justify-between items-center text-slate-500 dark:text-zinc-400 mb-1">
            <span className="text-[11px] font-bold uppercase">Students with Offers</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {siStudents.length}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">75.8% overall conversion (Click to view)</p>
        </div>

        <div className="p-4 bg-white dark:bg-[#202024] rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm powerbi-card">
          <div className="flex justify-between items-center text-slate-500 dark:text-zinc-400 mb-1">
            <span className="text-[11px] font-bold uppercase">Multi-Offer Cohort</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
            66 <span className="text-xs font-semibold text-slate-400">Students</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">57 Dual (O2) • 9 Triple (O3)</p>
        </div>

        <div 
          onClick={() => handleDrillThrough('recruiters')}
          className="p-4 bg-white dark:bg-[#202024] rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm powerbi-card cursor-pointer hover:border-blue-500 transition"
          title="Click to view Recruiter Intelligence"
        >
          <div className="flex justify-between items-center text-slate-500 dark:text-zinc-400 mb-1">
            <span className="text-[11px] font-bold uppercase">Top Trainee Volume</span>
            <Building2 className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 truncate">
            Xebia & HZL
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Leading industry practice recruiters</p>
        </div>

        <div className="p-4 bg-white dark:bg-[#202024] rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm powerbi-card">
          <div className="flex justify-between items-center text-slate-500 dark:text-zinc-400 mb-1">
            <span className="text-[11px] font-bold uppercase">SI NOC Clearance</span>
            <FileCheck className="w-4 h-4 text-teal-500" />
          </div>
          <div className="text-2xl font-black text-teal-600 dark:text-teal-400">
            115+
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Formal university NOCs issued</p>
        </div>
      </div>

      {/* Program Matrix & Company Ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Internship Summary by Program */}
        <div className="lg:col-span-2 bg-white dark:bg-[#202024] rounded-xl border border-slate-200 dark:border-zinc-800 p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-zinc-800 mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart className="w-4 h-4 text-blue-500" />
                Summer Internship Distribution by Discipline (Official CDC Audit)
              </h3>
              <span className="text-xs font-normal text-slate-400">9 Disciplines</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-50 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 font-bold border-b border-slate-200 dark:border-zinc-700">
                    <th className="py-2.5 px-3">Discipline</th>
                    <th className="py-2.5 px-2 text-center">Batch</th>
                    <th className="py-2.5 px-2 text-center">Male</th>
                    <th className="py-2.5 px-2 text-center">Female</th>
                    <th className="py-2.5 px-2 text-center">O1</th>
                    <th className="py-2.5 px-2 text-center">O2</th>
                    <th className="py-2.5 px-2 text-center">O3</th>
                    <th className="py-2.5 px-2 text-center font-bold text-blue-600">Total Offers</th>
                    <th className="py-2.5 px-2 text-center font-bold text-emerald-600">Offered</th>
                    <th className="py-2.5 px-3 text-right">Success Rate</th>
                    <th className="py-2.5 px-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                  {summary_internship.map((row) => {
                    const rate = ((row.offered / row.total_students) * 100).toFixed(1);
                    return (
                      <tr key={row.program} className="hover:bg-blue-50/50 dark:hover:bg-zinc-800/50 transition">
                        <td className="py-2 px-3 font-bold text-slate-900 dark:text-white">{row.program}</td>
                        <td className="py-2 px-2 text-center">{row.total_students}</td>
                        <td className="py-2 px-2 text-center text-slate-500">{row.male}</td>
                        <td className="py-2 px-2 text-center text-slate-500">{row.female}</td>
                        <td className="py-2 px-2 text-center">{row.si_o1}</td>
                        <td className="py-2 px-2 text-center">{row.si_o2}</td>
                        <td className="py-2 px-2 text-center">{row.si_o3}</td>
                        <td className="py-2 px-2 text-center font-bold text-blue-600 dark:text-blue-400">{row.offers_count}</td>
                        <td className="py-2 px-2 text-center font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/20">{row.offered}</td>
                        <td className="py-2 px-3 text-right font-bold text-slate-900 dark:text-white">{rate}%</td>
                        <td className="py-2 px-2 text-center">
                          <button
                            onClick={() => handleDrillThrough('students', 'program', row.program)}
                            className="px-2 py-0.5 rounded bg-slate-100 hover:bg-blue-600 hover:text-white dark:bg-zinc-800 dark:text-zinc-300 font-semibold text-[10px] transition inline-flex items-center gap-0.5"
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
                  <tr className="bg-slate-100 dark:bg-zinc-800 font-extrabold text-slate-900 dark:text-white border-t-2 border-slate-300 dark:border-zinc-700">
                    <td className="py-2.5 px-3">Total SPSU</td>
                    <td className="py-2.5 px-2 text-center">392</td>
                    <td className="py-2.5 px-2 text-center">271</td>
                    <td className="py-2.5 px-2 text-center">82</td>
                    <td className="py-2.5 px-2 text-center">229</td>
                    <td className="py-2.5 px-2 text-center">57</td>
                    <td className="py-2.5 px-2 text-center">9</td>
                    <td className="py-2.5 px-2 text-center text-blue-600 dark:text-blue-400">374</td>
                    <td className="py-2.5 px-2 text-center text-emerald-600 dark:text-emerald-400">297</td>
                    <td className="py-2.5 px-3 text-right text-emerald-600 dark:text-emerald-400">75.8%</td>
                    <td className="py-2.5 px-2 text-center">
                      <button
                        onClick={() => handleDrillThrough('students', 'program', 'ALL')}
                        className="px-2 py-0.5 rounded bg-blue-600 text-white font-bold text-[10px]"
                      >
                        All 392
                      </button>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Right Col: Top Internship Companies with Hyperlinks */}
        <div className="bg-white dark:bg-[#202024] rounded-xl border border-slate-200 dark:border-zinc-800 p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-zinc-800 mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-500" />
                Leading Internship Partners
              </h3>
              <span className="text-[10px] text-blue-500 font-semibold">Trainee Count</span>
            </div>

            <div className="space-y-2 overflow-y-auto max-h-[380px] pr-1">
              {sortedCompanies.map(([cName, count], idx) => (
                <div 
                  key={cName} 
                  onClick={() => handleDrillThrough('students', 'search', cName)}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-zinc-700/50 hover:border-blue-500 transition cursor-pointer text-xs group"
                  title={`Click to filter students training at ${cName}`}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="w-5 h-5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-[10px] shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                      {cName}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="font-extrabold text-blue-600 dark:text-blue-400">
                      {count} offers
                    </span>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-blue-500 transition" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 mt-3">
            <button
              onClick={() => handleDrillThrough('students', 'internshipStatus', 'Offered')}
              className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition shadow"
            >
              <span>View All 297 Interns in Student 360° Matrix</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
