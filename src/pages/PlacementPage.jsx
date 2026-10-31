import React from 'react';
import { Briefcase, Award, TrendingUp, DollarSign, Building, CheckCircle, ExternalLink, ShieldCheck } from 'lucide-react';

export default function PlacementPage({ dataset, filteredStudents, onSelectStudent }) {
  const placedStudents = filteredStudents.filter(s => s.placementStatus.startsWith('Placed'));
  const remainingStudents = filteredStudents.filter(s => s.placementStatus === 'Remaining');
  const optOutStudents = filteredStudents.filter(s => s.placementStatus === 'Opt Out');

  const fteCount = placedStudents.filter(s => s.placementStatus === 'Placed-FTE').length;
  const ppoCount = placedStudents.filter(s => s.placementStatus === 'Placed-PPO').length;

  // CTC Tiers
  const tier1 = placedStudents.filter(s => (s.placementCTC || 0) >= 8);
  const tier2 = placedStudents.filter(s => (s.placementCTC || 0) >= 5 && (s.placementCTC || 0) < 8);
  const tier3 = placedStudents.filter(s => (s.placementCTC || 0) > 0 && (s.placementCTC || 0) < 5);

  // Group by company
  const companyMap = {};
  placedStudents.forEach(s => {
    const comp = s.placementCompanies || 'Other Placement Drive';
    if (!companyMap[comp]) {
      companyMap[comp] = {
        name: comp,
        count: 0,
        ctc: s.placementCTC || 0,
        campus: s.placementCampus || 'On-Campus',
        students: []
      };
    }
    companyMap[comp].count += 1;
    companyMap[comp].students.push(s);
  });

  const companiesList = Object.values(companyMap).sort((a, b) => b.count - a.count || b.ctc - a.ctc);

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            Final Placement Command Center
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            FTE & PPO conversion metrics, salary packages, and recruiter performance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-lg">
            {placedStudents.length} Placements Confirmed
          </span>
          <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold rounded-lg">
            54 Cumulative Offers
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 bg-white dark:bg-[#202024] rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm powerbi-card">
          <div className="flex justify-between items-center text-slate-500 dark:text-zinc-400 mb-1">
            <span className="text-[11px] font-bold uppercase">Total Placed</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {placedStudents.length}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Across filtered departments</p>
        </div>

        <div className="p-4 bg-white dark:bg-[#202024] rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm powerbi-card">
          <div className="flex justify-between items-center text-slate-500 dark:text-zinc-400 mb-1">
            <span className="text-[11px] font-bold uppercase">FTE vs PPO Split</span>
            <Briefcase className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {fteCount} <span className="text-sm font-semibold text-slate-400">FTE</span> : {ppoCount} <span className="text-sm font-semibold text-emerald-500">PPO</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">59.5% secured via PPO pathway</p>
        </div>

        <div className="p-4 bg-white dark:bg-[#202024] rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm powerbi-card">
          <div className="flex justify-between items-center text-slate-500 dark:text-zinc-400 mb-1">
            <span className="text-[11px] font-bold uppercase">Tier 1 (&gt;= 8 LPA)</span>
            <DollarSign className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {tier1.length} <span className="text-xs font-semibold text-slate-400">Offers</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Country Edu, KMK Venture, Eleation</p>
        </div>

        <div className="p-4 bg-white dark:bg-[#202024] rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm powerbi-card">
          <div className="flex justify-between items-center text-slate-500 dark:text-zinc-400 mb-1">
            <span className="text-[11px] font-bold uppercase">Eligible Remaining</span>
            <TrendingUp className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
            {remainingStudents.length}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Active candidates in hiring pipeline</p>
        </div>
      </div>

      {/* Salary Tier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tier 1 */}
        <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-xs font-bold uppercase text-amber-800 dark:text-amber-300">
              Super Dream (8 - 12 LPA)
            </h4>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950">
              {tier1.length} Placed
            </span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-zinc-300 mb-3">
            High-value engineering & managerial roles in enterprise consulting, renewables and edtech.
          </p>
          <div className="space-y-1.5">
            {tier1.slice(0, 4).map(s => (
              <div key={s.id} onClick={() => onSelectStudent(s)} className="p-2 bg-white dark:bg-zinc-800 rounded border border-amber-200/60 dark:border-zinc-700 cursor-pointer hover:border-amber-500 text-xs flex justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">{s.name}</span>
                  <span className="text-[10px] text-slate-500 dark:text-zinc-400">{s.department} • {s.placementCompanies}</span>
                </div>
                <span className="font-extrabold text-amber-600 dark:text-amber-400 self-center">
                  ₹{s.placementCTC} LPA
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tier 2 */}
        <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/40 dark:bg-blue-950/20">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-xs font-bold uppercase text-blue-800 dark:text-blue-300">
              Dream Tier (5 - 8 LPA)
            </h4>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white">
              {tier2.length} Placed
            </span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-zinc-300 mb-3">
            Software development, renewable energy management, and core engineering specializations.
          </p>
          <div className="space-y-1.5">
            {tier2.slice(0, 4).map(s => (
              <div key={s.id} onClick={() => onSelectStudent(s)} className="p-2 bg-white dark:bg-zinc-800 rounded border border-blue-200/60 dark:border-zinc-700 cursor-pointer hover:border-blue-500 text-xs flex justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">{s.name}</span>
                  <span className="text-[10px] text-slate-500 dark:text-zinc-400">{s.department} • {s.placementCompanies}</span>
                </div>
                <span className="font-extrabold text-blue-600 dark:text-blue-400 self-center">
                  ₹{s.placementCTC} LPA
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tier 3 */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/40">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-xs font-bold uppercase text-slate-700 dark:text-zinc-300">
              Standard / Core Tier (&lt; 5 LPA)
            </h4>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-700 text-white">
              {tier3.length} Placed
            </span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-zinc-300 mb-3">
            Specialist infrastructure, mining surveys, civil CAD, and digital marketing consulting.
          </p>
          <div className="space-y-1.5">
            {tier3.slice(0, 4).map(s => (
              <div key={s.id} onClick={() => onSelectStudent(s)} className="p-2 bg-white dark:bg-zinc-800 rounded border border-slate-200 dark:border-zinc-700 cursor-pointer hover:border-slate-400 text-xs flex justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">{s.name}</span>
                  <span className="text-[10px] text-slate-500 dark:text-zinc-400">{s.department} • {s.placementCompanies}</span>
                </div>
                <span className="font-extrabold text-slate-700 dark:text-zinc-300 self-center">
                  ₹{s.placementCTC} LPA
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Corporate Recruiters Leaderboard */}
      <div className="bg-white dark:bg-[#202024] rounded-xl border border-slate-200 dark:border-zinc-800 p-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Building className="w-4 h-4 text-amber-500" />
            Recruiter Placement Conversion Roster
          </span>
          <span className="text-xs font-medium text-slate-400">
            {companiesList.length} Active Hiring Partners
          </span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 font-bold border-b border-slate-200 dark:border-zinc-700">
                <th className="py-2 px-3">Recruiting Organization</th>
                <th className="py-2 px-2 text-center">Hires</th>
                <th className="py-2 px-3 text-right">Package (CTC)</th>
                <th className="py-2 px-3 text-center">Mode</th>
                <th className="py-2 px-3 text-left">Recruited Students</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
              {companiesList.map((comp) => (
                <tr key={comp.name} className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition">
                  <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                    {comp.name}
                  </td>
                  <td className="py-2.5 px-2 text-center font-extrabold text-emerald-600 dark:text-emerald-400">
                    {comp.count}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-amber-600 dark:text-amber-400">
                    {comp.ctc ? `₹${comp.ctc} LPA` : 'Competitive'}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
                      {comp.campus}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex flex-wrap gap-1">
                      {comp.students.map(st => (
                        <button
                          key={st.id}
                          onClick={() => onSelectStudent(st)}
                          className="px-2 py-0.5 rounded bg-slate-100 hover:bg-amber-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-[11px] font-medium text-slate-800 dark:text-zinc-200 transition"
                        >
                          {st.name} ({st.department})
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
