import React from 'react';
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
  FileCheck
} from 'lucide-react';

export default function ExecutiveOverviewPage({ dataset, filteredStudents, onSelectProgram, onSelectStudent }) {
  const { summary_placement, summary_internship, meta } = dataset;

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

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Top Directorate Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 rounded-xl border border-zinc-800 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Institutional Intelligence
            </span>
            <span className="text-xs text-zinc-400">
              Sir Padampat Singhania University • Udaipur, Rajasthan
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
            Director's Executive Cockpit — Career Development Cell
          </h1>
          <p className="text-xs text-zinc-300 mt-0.5">
            Real-time Placement conversion tracking, Summer Internship pipeline, and Recruiter dynamics for 2026 Graduating Cohort.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-right">
            <span className="text-[10px] uppercase font-bold text-zinc-400 block">Total Cohort</span>
            <span className="text-lg font-black text-amber-400">{currentTotal} Students</span>
          </div>
          <div className="px-3 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-right">
            <span className="text-[10px] uppercase font-bold text-emerald-300 block">Eligible Placed</span>
            <span className="text-lg font-black text-emerald-400">{currentPlacementRate}%</span>
          </div>
        </div>
      </div>

      {/* Power BI KPI Scorecards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 1: Total Batch */}
        <div className="p-3.5 bg-white dark:bg-[#202024] rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm powerbi-card">
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Batch Size</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {currentTotal}
          </div>
          <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500 dark:text-zinc-400">
            <span>{currentOptOut} Opted Out</span>
            <span className="text-blue-500 font-semibold">{currentEligible} Eligible</span>
          </div>
        </div>

        {/* Card 2: Placed Students */}
        <div className="p-3.5 bg-white dark:bg-[#202024] rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm powerbi-card">
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Placed Offers</span>
            <Award className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {currentPlaced}
          </div>
          <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500 dark:text-zinc-400">
            <span>{fteCount} FTE</span>
            <span className="text-emerald-600 font-semibold">{ppoCount} PPO</span>
          </div>
        </div>

        {/* Card 3: Summer Internships */}
        <div className="p-3.5 bg-white dark:bg-[#202024] rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm powerbi-card">
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">SI Offered</span>
            <Briefcase className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
            {currentSIOffered}
          </div>
          <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500 dark:text-zinc-400">
            <span>{currentSIRate}% Batch</span>
            <span className="text-blue-500 font-semibold">374 Total Offers</span>
          </div>
        </div>

        {/* Card 4: Highest Package */}
        <div className="p-3.5 bg-white dark:bg-[#202024] rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm powerbi-card">
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Highest CTC</span>
            <DollarSign className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
            ₹{maxCTC} <span className="text-xs font-semibold">LPA</span>
          </div>
          <div className="mt-1 text-[10px] text-slate-500 dark:text-zinc-400 truncate">
            KMK Venture / Country Edu
          </div>
        </div>

        {/* Card 5: Average Package */}
        <div className="p-3.5 bg-white dark:bg-[#202024] rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm powerbi-card">
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Average CTC</span>
            <TrendingUp className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
            ₹{avgCTC} <span className="text-xs font-semibold">LPA</span>
          </div>
          <div className="mt-1 text-[10px] text-slate-500 dark:text-zinc-400">
            Tier-1 TPO Benchmark
          </div>
        </div>

        {/* Card 6: Placement NOC Done */}
        <div className="p-3.5 bg-white dark:bg-[#202024] rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm powerbi-card">
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Placement NOC</span>
            <FileCheck className="w-4 h-4 text-teal-500" />
          </div>
          <div className="text-2xl font-black text-teal-600 dark:text-teal-400">
            9 <span className="text-xs font-semibold text-slate-400">Done</span>
          </div>
          <div className="mt-1 text-[10px] text-slate-500 dark:text-zinc-400">
            115 SI NOCs Issued
          </div>
        </div>
      </div>

      {/* Main Dual Grid: Program Summary Matrix + Visual Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Master Department Placement Matrix */}
        <div className="lg:col-span-2 bg-white dark:bg-[#202024] rounded-xl border border-slate-200 dark:border-zinc-800 p-4 shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-zinc-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart className="w-4 h-4 text-amber-500" />
                Department-Wise Placement Performance (Official CDC Register)
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                Click any program to slice the entire dashboard by that department.
              </p>
            </div>
            <span className="text-[11px] font-bold text-slate-400">
              9 Academic Disciplines
            </span>
          </div>

          <div className="overflow-x-auto mt-3 flex-1">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-zinc-800/60 text-slate-600 dark:text-zinc-300 text-[11px] font-bold uppercase border-b border-slate-200 dark:border-zinc-700">
                  <th className="py-2.5 px-3">Program</th>
                  <th className="py-2.5 px-2 text-center">Cohort</th>
                  <th className="py-2.5 px-2 text-center">Opt-Out</th>
                  <th className="py-2.5 px-2 text-center">Opt-In</th>
                  <th className="py-2.5 px-2 text-center text-emerald-600 dark:text-emerald-400">Placed</th>
                  <th className="py-2.5 px-2 text-center">FTE</th>
                  <th className="py-2.5 px-2 text-center">PPO</th>
                  <th className="py-2.5 px-2 text-center text-amber-600 dark:text-amber-400">Remaining</th>
                  <th className="py-2.5 px-3 text-right">Conversion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/70">
                {summary_placement.map((prog) => {
                  const conversion = prog.opt_in > 0 ? ((prog.placed / prog.opt_in) * 100).toFixed(1) : 0;
                  return (
                    <tr 
                      key={prog.program}
                      onClick={() => onSelectProgram(prog.program)}
                      className="hover:bg-amber-50/50 dark:hover:bg-zinc-800/40 cursor-pointer transition group"
                    >
                      <td className="py-2 px-3 font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-400 group-hover:scale-125 transition"></span>
                        {prog.program}
                      </td>
                      <td className="py-2 px-2 text-center text-slate-700 dark:text-zinc-300 font-medium">{prog.total_students}</td>
                      <td className="py-2 px-2 text-center text-slate-400">{prog.opt_out}</td>
                      <td className="py-2 px-2 text-center text-slate-800 dark:text-zinc-200 font-semibold">{prog.opt_in}</td>
                      <td className="py-2 px-2 text-center font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/20">
                        {prog.placed}
                      </td>
                      <td className="py-2 px-2 text-center text-slate-600 dark:text-zinc-400">{prog.fte}</td>
                      <td className="py-2 px-2 text-center text-slate-600 dark:text-zinc-400">{prog.ppo}</td>
                      <td className="py-2 px-2 text-center font-medium text-amber-600 dark:text-amber-400">
                        {prog.remaining}
                      </td>
                      <td className="py-2 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 h-1.5 bg-slate-200 dark:bg-zinc-700 rounded-full overflow-hidden hidden sm:block">
                            <div 
                              className="h-full bg-gradient-to-r from-amber-400 to-emerald-500 rounded-full"
                              style={{ width: `${Math.min(conversion, 100)}%` }}
                            ></div>
                          </div>
                          <span className="font-bold text-slate-800 dark:text-zinc-200">{conversion}%</span>
                        </div>
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
                  <td className="py-2.5 px-2 text-center text-amber-600 dark:text-amber-400">242</td>
                  <td className="py-2.5 px-3 text-right text-emerald-600 dark:text-emerald-400">
                    {((47 / 289) * 100).toFixed(1)}%
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Right Col: Conversion Funnel & Offer Share */}
        <div className="space-y-4">
          {/* Conversion Funnel */}
          <div className="bg-white dark:bg-[#202024] rounded-xl border border-slate-200 dark:border-zinc-800 p-4 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-200 mb-3 flex items-center gap-1.5">
              <PieChart className="w-4 h-4 text-amber-500" />
              Cohort Conversion Funnel
            </h3>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-600 dark:text-zinc-400">Total Enrolled Cohort</span>
                  <span className="text-slate-900 dark:text-white font-bold">392 (100%)</span>
                </div>
                <div className="w-full h-3 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-400 dark:bg-zinc-500 rounded-full w-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-600 dark:text-zinc-400">Active Placement Opt-In</span>
                  <span className="text-slate-900 dark:text-white font-bold">289 (73.7%)</span>
                </div>
                <div className="w-full h-3 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '73.7%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-600 dark:text-zinc-400">Summer Internship Selected</span>
                  <span className="text-slate-900 dark:text-white font-bold">297 (75.8%)</span>
                </div>
                <div className="w-full h-3 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: '75.8%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-600 dark:text-zinc-400">Final Placements Locked</span>
                  <span className="text-slate-900 dark:text-white font-bold">47 (16.3% of Opt-In)</span>
                </div>
                <div className="w-full h-3 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '16.3%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Marquee Placement Recruiters */}
          <div className="bg-white dark:bg-[#202024] rounded-xl border border-slate-200 dark:border-zinc-800 p-4 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-200 mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Building className="w-4 h-4 text-emerald-500" />
                Marquee Recruiters
              </span>
              <span className="text-[10px] text-amber-500 font-bold">Peak Package</span>
            </h3>

            <div className="space-y-2 text-xs">
              {[
                { name: 'KMK Venture', package: '₹10.20 LPA', role: 'Business / Finance', hires: '1 Student' },
                { name: 'Country Edu Pvt Ltd', package: '₹10.00 LPA', role: 'Management & Tech', hires: '7 Students' },
                { name: 'Eleation Services', package: '₹9.00 LPA', role: 'Mechanical Core', hires: '1 Student' },
                { name: 'Rajasthan Shubham Solar', package: '₹7.00 LPA', role: 'Renewable Mgmt', hires: '2 Students' },
                { name: 'Cyntexa', package: '₹5.00 LPA', role: 'Software Engineer', hires: '2 Students' },
                { name: 'I.EVO Solutions', package: '₹4.50 LPA', role: 'Civil & Infra', hires: '3 Students' },
                { name: 'Kreativan Technologies', package: '₹4.00 LPA', role: 'Full Stack & AI', hires: '4 Students' }
              ].map((rec) => (
                <div key={rec.name} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-zinc-700/50">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{rec.name}</div>
                    <div className="text-[10px] text-slate-500 dark:text-zinc-400">{rec.role} • {rec.hires}</div>
                  </div>
                  <span className="font-extrabold text-amber-600 dark:text-amber-400">
                    {rec.package}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
