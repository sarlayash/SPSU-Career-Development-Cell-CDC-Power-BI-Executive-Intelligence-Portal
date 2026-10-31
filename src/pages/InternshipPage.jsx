import React from 'react';
import { Building2, Award, Users, CheckCircle2, MapPin, DollarSign, ExternalLink, FileCheck } from 'lucide-react';

export default function InternshipPage({ dataset, filteredStudents, onSelectStudent }) {
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

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-500" />
            Summer Internship (SI) Portal & Industry Pipeline
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Mandatory industrial practice, experiential learning credits, and multi-offer tracking.
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
        <div className="p-4 bg-white dark:bg-[#202024] rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm powerbi-card">
          <div className="flex justify-between items-center text-slate-500 dark:text-zinc-400 mb-1">
            <span className="text-[11px] font-bold uppercase">Students with Offers</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {siStudents.length}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">75.8% overall conversion</p>
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

        <div className="p-4 bg-white dark:bg-[#202024] rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm powerbi-card">
          <div className="flex justify-between items-center text-slate-500 dark:text-zinc-400 mb-1">
            <span className="text-[11px] font-bold uppercase">Top Recruiter Volume</span>
            <Building2 className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
            Xebia
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Leading software engineering partner</p>
        </div>

        <div className="p-4 bg-white dark:bg-[#202024] rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm powerbi-card">
          <div className="flex justify-between items-center text-slate-500 dark:text-zinc-400 mb-1">
            <span className="text-[11px] font-bold uppercase">SI NOC Clearance</span>
            <FileCheck className="w-4 h-4 text-teal-500" />
          </div>
          <div className="text-2xl font-black text-teal-600 dark:text-teal-400">
            115+
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Formal university NOCs granted</p>
        </div>
      </div>

      {/* Program Matrix & Company Ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Internship Summary by Program */}
        <div className="lg:col-span-2 bg-white dark:bg-[#202024] rounded-xl border border-slate-200 dark:border-zinc-800 p-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center justify-between">
            <span>Summer Internship Distribution by Academic Discipline</span>
            <span className="text-xs font-normal text-slate-400">Official CDC Audit Sheet</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 font-bold border-b border-slate-200 dark:border-zinc-700">
                  <th className="py-2.5 px-3">Program</th>
                  <th className="py-2.5 px-2 text-center">Batch</th>
                  <th className="py-2.5 px-2 text-center">Male</th>
                  <th className="py-2.5 px-2 text-center">Female</th>
                  <th className="py-2.5 px-2 text-center">SI O1</th>
                  <th className="py-2.5 px-2 text-center">SI O2</th>
                  <th className="py-2.5 px-2 text-center">SI O3</th>
                  <th className="py-2.5 px-2 text-center font-bold text-blue-600">Total Offers</th>
                  <th className="py-2.5 px-2 text-center font-bold text-emerald-600">Students Offered</th>
                  <th className="py-2.5 px-3 text-right">Success Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                {summary_internship.map((row) => {
                  const rate = ((row.offered / row.total_students) * 100).toFixed(1);
                  return (
                    <tr key={row.program} className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition">
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
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Right Col: Top Internship Companies */}
        <div className="bg-white dark:bg-[#202024] rounded-xl border border-slate-200 dark:border-zinc-800 p-4 shadow-sm flex flex-col">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-200 mb-3 flex items-center justify-between">
            <span>Leading Internship Partners</span>
            <span className="text-[10px] text-blue-500 font-semibold">Trainee Count</span>
          </h3>

          <div className="space-y-2 overflow-y-auto max-h-[380px] pr-1">
            {sortedCompanies.map(([cName, count], idx) => (
              <div key={cName} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-zinc-700/50 text-xs">
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="w-5 h-5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white truncate">
                    {cName}
                  </span>
                </div>
                <span className="font-extrabold text-blue-600 dark:text-blue-400 ml-2">
                  {count} offers
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
