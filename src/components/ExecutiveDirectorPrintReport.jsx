import React from 'react';
import spsuBanner from '../assets/spsu-banner.png';

export default function ExecutiveDirectorPrintReport({ dataset, filteredStudents }) {
  const { summary_placement, summary_internship, meta } = dataset;

  const totalStudents = meta?.totalStudents || 392;
  const totalPlaced = summary_placement.reduce((acc, p) => acc + p.placed, 0);
  const totalOffers = summary_placement.reduce((acc, p) => acc + p.offers_count, 0);
  const totalFTE = summary_placement.reduce((acc, p) => acc + p.fte, 0);
  const totalPPO = summary_placement.reduce((acc, p) => acc + p.ppo, 0);
  const totalRemaining = summary_placement.reduce((acc, p) => acc + p.remaining, 0);

  const totalSIOffered = summary_internship.reduce((acc, p) => acc + p.offered, 0);
  const totalSIOffers = summary_internship.reduce((acc, p) => acc + p.offers_count, 0);
  const totalSIMale = summary_internship.reduce((acc, p) => acc + p.male, 0);
  const totalSIFemale = summary_internship.reduce((acc, p) => acc + p.female, 0);

  const today = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="print-only bg-white text-black p-8 font-serif leading-relaxed max-w-5xl mx-auto">
      {/* University Crest & Header */}
      <div className="border-b-2 border-slate-900 pb-4 mb-6 text-center">
        <img 
          src={spsuBanner} 
          alt="SPSU Udaipur Campus" 
          className="w-full h-auto object-contain rounded mb-3 border border-slate-300"
        />
        <div className="inline-block px-3 py-1 bg-amber-100 text-amber-900 border border-amber-400 font-sans text-xs font-bold uppercase tracking-widest rounded mb-2">
          Strictly Confidential • Directorate Executive Briefing
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 uppercase">
          Sir Padampat Singhania University (SPSU), Udaipur
        </h1>
        <h2 className="text-sm font-semibold tracking-wide text-slate-700 mt-1 uppercase">
          Career Development Cell (CDC) — Directorate Placement Intelligence Memo
        </h2>
        <p className="text-xs text-slate-500 font-sans mt-0.5">
          Report Generated on: {today} at {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })} IST • Graduating Cohort: Class of 2026 • Reference: SPSU/CDC/DIR/2026/01
        </p>
      </div>

      {/* Executive Summary Narrative */}
      <div className="mb-6 font-sans text-xs text-slate-800 bg-slate-50 p-4 border border-slate-200 rounded">
        <p className="leading-normal">
          <strong>Director's Executive Brief:</strong> This official report reflects the consolidated institutional status for placements and summer internships across all 9 university disciplines (B.Tech CSE, ECE, MN, CE, ME, B.Des, BCA, BBA, and MBA). Out of a batch cohort of <strong>{totalStudents} students</strong>, <strong>{totalPlaced} students</strong> have locked <strong>{totalOffers} offers</strong> with a peak package of <strong>₹10.20 LPA</strong>. In Summer Internships (SI), a strong conversion of <strong>{totalSIOffered} students (75.8%)</strong> securing <strong>{totalSIOffers} industry offers</strong> has been recorded.
        </p>
      </div>

      {/* KPI Summary Strip */}
      <div className="grid grid-cols-4 gap-3 mb-6 font-sans">
        <div className="p-3 border border-slate-300 rounded text-center">
          <span className="text-[10px] text-slate-500 uppercase font-bold block">Total Batch</span>
          <span className="text-xl font-extrabold text-slate-900">{totalStudents}</span>
          <span className="text-[10px] text-slate-500 block">Across 9 Departments</span>
        </div>
        <div className="p-3 border border-slate-300 rounded text-center bg-emerald-50">
          <span className="text-[10px] text-emerald-800 uppercase font-bold block">Final Placed</span>
          <span className="text-xl font-extrabold text-emerald-700">{totalPlaced}</span>
          <span className="text-[10px] text-emerald-700 block">{totalOffers} Total Offers ({totalFTE} FTE / {totalPPO} PPO)</span>
        </div>
        <div className="p-3 border border-slate-300 rounded text-center bg-blue-50">
          <span className="text-[10px] text-blue-800 uppercase font-bold block">Summer Internships</span>
          <span className="text-xl font-extrabold text-blue-700">{totalSIOffered}</span>
          <span className="text-[10px] text-blue-700 block">{totalSIOffers} Offers (75.8% Placed)</span>
        </div>
        <div className="p-3 border border-slate-300 rounded text-center bg-amber-50">
          <span className="text-[10px] text-amber-800 uppercase font-bold block">Highest Compensation</span>
          <span className="text-xl font-extrabold text-amber-700">₹10.20 LPA</span>
          <span className="text-[10px] text-amber-700 block">KMK Venture / Country Edu</span>
        </div>
      </div>

      {/* Department-Wise Placement Table */}
      <div className="mb-6 font-sans">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 border-b border-slate-300 pb-1">
          1. Department-Wise Final Placement Performance Matrix
        </h3>
        <table className="w-full text-[11px] border-collapse border border-slate-300">
          <thead>
            <tr className="bg-slate-100 text-slate-900">
              <th className="border border-slate-300 p-1.5 text-left">Program</th>
              <th className="border border-slate-300 p-1.5 text-center">Batch Size</th>
              <th className="border border-slate-300 p-1.5 text-center">Opt-Out</th>
              <th className="border border-slate-300 p-1.5 text-center">Opt-In</th>
              <th className="border border-slate-300 p-1.5 text-center">Placed</th>
              <th className="border border-slate-300 p-1.5 text-center">Offers</th>
              <th className="border border-slate-300 p-1.5 text-center">FTE</th>
              <th className="border border-slate-300 p-1.5 text-center">PPO</th>
              <th className="border border-slate-300 p-1.5 text-center">Remaining</th>
              <th className="border border-slate-300 p-1.5 text-center">% Conversion</th>
            </tr>
          </thead>
          <tbody>
            {summary_placement.map((p) => {
              const conversion = p.opt_in > 0 ? ((p.placed / p.opt_in) * 100).toFixed(1) : '0.0';
              return (
                <tr key={p.program} className="hover:bg-slate-50">
                  <td className="border border-slate-300 p-1.5 font-bold">{p.program}</td>
                  <td className="border border-slate-300 p-1.5 text-center">{p.total_students}</td>
                  <td className="border border-slate-300 p-1.5 text-center">{p.opt_out}</td>
                  <td className="border border-slate-300 p-1.5 text-center">{p.opt_in}</td>
                  <td className="border border-slate-300 p-1.5 text-center font-bold text-emerald-700">{p.placed}</td>
                  <td className="border border-slate-300 p-1.5 text-center">{p.offers_count}</td>
                  <td className="border border-slate-300 p-1.5 text-center">{p.fte}</td>
                  <td className="border border-slate-300 p-1.5 text-center">{p.ppo}</td>
                  <td className="border border-slate-300 p-1.5 text-center text-amber-700">{p.remaining}</td>
                  <td className="border border-slate-300 p-1.5 text-center font-bold">{conversion}%</td>
                </tr>
              );
            })}
            <tr className="bg-slate-200 font-bold text-slate-900">
              <td className="border border-slate-300 p-1.5">Total Institutional</td>
              <td className="border border-slate-300 p-1.5 text-center">{totalStudents}</td>
              <td className="border border-slate-300 p-1.5 text-center">76</td>
              <td className="border border-slate-300 p-1.5 text-center">289</td>
              <td className="border border-slate-300 p-1.5 text-center text-emerald-800">{totalPlaced}</td>
              <td className="border border-slate-300 p-1.5 text-center">{totalOffers}</td>
              <td className="border border-slate-300 p-1.5 text-center">{totalFTE}</td>
              <td className="border border-slate-300 p-1.5 text-center">{totalPPO}</td>
              <td className="border border-slate-300 p-1.5 text-center">{totalRemaining}</td>
              <td className="border border-slate-300 p-1.5 text-center">
                {((totalPlaced / 289) * 100).toFixed(1)}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Summer Internship Summary Table */}
      <div className="mb-6 font-sans">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 border-b border-slate-300 pb-1">
          2. Summer Internship (SI) Corporate Engagement Matrix
        </h3>
        <table className="w-full text-[11px] border-collapse border border-slate-300">
          <thead>
            <tr className="bg-slate-100 text-slate-900">
              <th className="border border-slate-300 p-1.5 text-left">Program</th>
              <th className="border border-slate-300 p-1.5 text-center">Total Students</th>
              <th className="border border-slate-300 p-1.5 text-center">Male</th>
              <th className="border border-slate-300 p-1.5 text-center">Female</th>
              <th className="border border-slate-300 p-1.5 text-center">Single (O1)</th>
              <th className="border border-slate-300 p-1.5 text-center">Dual (O2)</th>
              <th className="border border-slate-300 p-1.5 text-center">Triple (O3)</th>
              <th className="border border-slate-300 p-1.5 text-center">Total Offers</th>
              <th className="border border-slate-300 p-1.5 text-center">Students Offered</th>
              <th className="border border-slate-300 p-1.5 text-center">SI Conversion</th>
            </tr>
          </thead>
          <tbody>
            {summary_internship.map((si) => {
              const conv = ((si.offered / si.total_students) * 100).toFixed(1);
              return (
                <tr key={si.program} className="hover:bg-slate-50">
                  <td className="border border-slate-300 p-1.5 font-bold">{si.program}</td>
                  <td className="border border-slate-300 p-1.5 text-center">{si.total_students}</td>
                  <td className="border border-slate-300 p-1.5 text-center">{si.male}</td>
                  <td className="border border-slate-300 p-1.5 text-center">{si.female}</td>
                  <td className="border border-slate-300 p-1.5 text-center">{si.si_o1}</td>
                  <td className="border border-slate-300 p-1.5 text-center">{si.si_o2}</td>
                  <td className="border border-slate-300 p-1.5 text-center">{si.si_o3}</td>
                  <td className="border border-slate-300 p-1.5 text-center font-bold text-blue-700">{si.offers_count}</td>
                  <td className="border border-slate-300 p-1.5 text-center font-bold text-emerald-700">{si.offered}</td>
                  <td className="border border-slate-300 p-1.5 text-center font-bold">{conv}%</td>
                </tr>
              );
            })}
            <tr className="bg-slate-200 font-bold text-slate-900">
              <td className="border border-slate-300 p-1.5">Total Institutional</td>
              <td className="border border-slate-300 p-1.5 text-center">{totalStudents}</td>
              <td className="border border-slate-300 p-1.5 text-center">{totalSIMale}</td>
              <td className="border border-slate-300 p-1.5 text-center">{totalSIFemale}</td>
              <td className="border border-slate-300 p-1.5 text-center">229</td>
              <td className="border border-slate-300 p-1.5 text-center">57</td>
              <td className="border border-slate-300 p-1.5 text-center">9</td>
              <td className="border border-slate-300 p-1.5 text-center text-blue-900">{totalSIOffers}</td>
              <td className="border border-slate-300 p-1.5 text-center text-emerald-900">{totalSIOffered}</td>
              <td className="border border-slate-300 p-1.5 text-center">
                {((totalSIOffered / totalStudents) * 100).toFixed(1)}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Primary Recruiters List */}
      <div className="mb-8 font-sans text-xs">
        <h3 className="font-bold uppercase tracking-wider text-slate-900 mb-2 border-b border-slate-300 pb-1">
          3. Key Marquee Corporate Partners & Hiring Organizations
        </h3>
        <p className="text-slate-700 leading-relaxed">
          <strong>Final Placements:</strong> Country Edu Pvt Ltd (₹10 LPA), KMK Venture (₹10.2 LPA), Eleation Services (₹9 LPA), Rajasthan Shubham Solar Solution (₹7 LPA), Naviotech Solutions (₹4-6 LPA), Cyntexa (₹5 LPA), I.EVO (₹4.5 LPA), Kreativan Technologies (₹4 LPA), QSS Global (₹3.5 LPA), SK Khetan (₹3 LPA), Tempsens Instruments (₹2.76 LPA), CNK Khandewala (₹2.5 LPA).
        </p>
        <p className="text-slate-700 mt-2 leading-relaxed">
          <strong>Internship Partners:</strong> Xebia, Hindustan Zinc Limited, JK Cement, DMV CoreTech, ASTRAM Lab (IIT Hyderabad), Adani Group Airport, NIT Raipur, BHEL, ICMR NIN, Parshi Technical Services, Patel Phoschem, Tempsens Instruments India, Agile Capital Services, Tech Extensor, IIFL Capital Services.
        </p>
      </div>

      {/* Formal Sign-Off Section */}
      <div className="pt-8 border-t-2 border-slate-900 flex justify-between items-end font-sans">
        <div className="text-left">
          <div className="w-48 border-b border-slate-400 mb-1"></div>
          <p className="font-bold text-xs text-slate-900">Head - Career Development Cell</p>
          <p className="text-[10px] text-slate-600">Directorate of Training & Placements</p>
          <p className="text-[10px] text-slate-500">Sir Padampat Singhania University</p>
        </div>

        <div className="text-right">
          <div className="w-48 border-b border-slate-400 mb-1 ml-auto"></div>
          <p className="font-bold text-xs text-slate-900">Director / Vice Chancellor</p>
          <p className="text-[10px] text-slate-600">Executive Directorate Office</p>
          <p className="text-[10px] text-slate-500">Sir Padampat Singhania University</p>
        </div>
      </div>
    </div>
  );
}
