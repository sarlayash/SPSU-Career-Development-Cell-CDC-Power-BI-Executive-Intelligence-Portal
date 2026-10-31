import React from 'react';
import { X, Mail, Phone, Award, Building, Briefcase, Calendar, CheckCircle2, AlertCircle, FileText, ExternalLink, GraduationCap, MapPin, DollarSign } from 'lucide-react';

export default function StudentDetailModal({ student, onClose }) {
  if (!student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#1e1e21] rounded-xl shadow-2xl border border-slate-200 dark:border-zinc-700">
        {/* Top banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-bold text-2xl shadow-lg border-2 border-amber-300">
                {student.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    {student.department} • {student.course}
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">
                    #{student.enrollmentNo}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white mt-1">
                  {student.name}
                </h2>
                <p className="text-xs text-zinc-300">
                  {student.specialization || student.department} {student.specialization2 ? `& ${student.specialization2}` : ''}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:items-end">
              <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-sm inline-flex items-center gap-1.5 ${
                student.placementStatus.startsWith('Placed')
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : student.placementStatus === 'Opt Out'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                {student.placementStatus.startsWith('Placed') && <CheckCircle2 className="w-3.5 h-3.5" />}
                {student.placementStatus}
              </span>
              {student.placementCTC && (
                <span className="mt-1 text-sm font-extrabold text-amber-400">
                  ₹{student.placementCTC} LPA CTC
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Modal body */}
        <div className="p-6 space-y-6">
          {/* Quick contact strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 dark:bg-zinc-800/60 rounded-lg text-xs">
            <div className="flex items-center gap-2 text-slate-700 dark:text-zinc-300 overflow-hidden">
              <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span className="truncate">{student.emailSpsu || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-zinc-300">
              <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>{student.contactNo || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-zinc-300">
              <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>Gender: <strong>{student.gender}</strong></span>
            </div>
          </div>

          {/* Academic scorecard */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-3 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-blue-500" />
              Academic Credentials & Backlog Health
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 dark:bg-zinc-800/50 rounded-lg border border-slate-200 dark:border-zinc-700">
                <span className="text-[11px] text-slate-500 dark:text-zinc-400 block">Current CGPA</span>
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  {student.cgpa ? student.cgpa : 'N/A'}
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-zinc-800/50 rounded-lg border border-slate-200 dark:border-zinc-700">
                <span className="text-[11px] text-slate-500 dark:text-zinc-400 block">Class 10th</span>
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  {student.xth ? `${student.xth}%` : 'N/A'}
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-zinc-800/50 rounded-lg border border-slate-200 dark:border-zinc-700">
                <span className="text-[11px] text-slate-500 dark:text-zinc-400 block">Class 12th</span>
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  {student.xiith ? `${student.xiith}%` : 'N/A'}
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-zinc-800/50 rounded-lg border border-slate-200 dark:border-zinc-700">
                <span className="text-[11px] text-slate-500 dark:text-zinc-400 block">Backlogs</span>
                <span className={`text-lg font-bold ${
                  student.backlogs > 0 ? 'text-red-500' : 'text-emerald-500'
                }`}>
                  {student.backlogs} {student.backlogs === 0 ? 'Clear' : 'Pending'}
                </span>
              </div>
            </div>
          </div>

          {/* Placement & Internship Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Placement details card */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/70 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-zinc-700">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-amber-500" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white">
                    Final Placement Status
                  </h4>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  student.placementStatus.startsWith('Placed')
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
                    : 'bg-slate-100 text-slate-700 dark:bg-zinc-700 dark:text-zinc-300'
                }`}>
                  {student.placementStatus}
                </span>
              </div>

              <div className="mt-3 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-zinc-700/50">
                  <span className="text-slate-500 dark:text-zinc-400">Recruiting Company:</span>
                  <span className="font-semibold text-slate-900 dark:text-white text-right">
                    {student.placementCompanies || 'None Yet'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-zinc-700/50">
                  <span className="text-slate-500 dark:text-zinc-400">Offer Mode:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {student.placementCampus || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-zinc-700/50">
                  <span className="text-slate-500 dark:text-zinc-400">CTC Compensation:</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {student.placementCTC ? `₹${student.placementCTC} LPA` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 dark:text-zinc-400">CDC Placement NOC:</span>
                  <span className={`font-semibold ${
                    student.placementNOC === 'Done' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                  }`}>
                    {student.placementNOC}
                  </span>
                </div>
              </div>
            </div>

            {/* Summer Internship card */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/70 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-zinc-700">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-500" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white">
                    Summer Internship (SI)
                  </h4>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  student.internshipOffered
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                    : 'bg-slate-100 text-slate-700 dark:bg-zinc-700 dark:text-zinc-300'
                }`}>
                  {student.internshipOffered ? `${student.internshipOffersCount || 1} Offer(s)` : 'Awaiting Offer'}
                </span>
              </div>

              <div className="mt-3 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-zinc-700/50">
                  <span className="text-slate-500 dark:text-zinc-400">Internship Company:</span>
                  <span className="font-semibold text-slate-900 dark:text-white text-right max-w-[180px] truncate" title={student.internshipCompaniesOffered || student.internshipCompanyJoined}>
                    {student.internshipCompaniesOffered || student.internshipCompanyJoined || 'In Process'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-zinc-700/50">
                  <span className="text-slate-500 dark:text-zinc-400">Role / Domain:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {student.internshipProfile || 'Trainee / Intern'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-zinc-700/50">
                  <span className="text-slate-500 dark:text-zinc-400">Stipend:</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {student.internshipStipend || 'TBA / Unpaid'}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 dark:text-zinc-400">Location & NOC:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {student.internshipLocation || 'Regional'} • NOC: {student.internshipNOC}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Orientation & Declaration */}
          <div className="p-3 bg-slate-50 dark:bg-zinc-800/40 rounded-lg text-xs flex flex-wrap items-center justify-between gap-3 border border-slate-200/80 dark:border-zinc-700/60">
            <div>
              <span className="text-slate-500 dark:text-zinc-400 mr-2">Orientation Attendance:</span>
              <span className={`font-bold ${student.orientationAttendance === 'Present' ? 'text-emerald-600' : 'text-rose-500'}`}>
                {student.orientationAttendance}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-zinc-400 mr-2">Declaration Status:</span>
              <span className="font-bold text-slate-800 dark:text-zinc-200">
                {student.declarationStatus}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-zinc-400 mr-2">Database Verification:</span>
              <span className="font-bold text-blue-600">
                Verified
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-slate-800 dark:text-white rounded-lg text-xs font-semibold transition"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}

function User({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
