import React, { useState } from 'react';
import { Shield, User, Lock, CheckCircle2, Building, Key, Sparkles, X } from 'lucide-react';

const PRESET_ROLES = [
  {
    role: 'Director',
    name: 'Prof. (Dr.) Prithvi Yadav',
    title: 'Director / Vice Chancellor',
    email: 'director@spsu.ac.in',
    badge: 'Executive Admin',
    desc: 'Unrestricted access to high-level strategic intelligence, salary distributions, executive export memos & audit reports.',
    color: 'from-amber-500 to-amber-700',
    avatar: '👨‍💼'
  },
  {
    role: 'Head CDC',
    name: 'Col. Sanjay Sharma (Retd.)',
    title: 'Head - Career Development Cell',
    email: 'cdc.head@spsu.ac.in',
    badge: 'TPO Admin',
    desc: 'Full operational control: verify student database, oversee company drives, manage offer letters & NOC issuance.',
    color: 'from-blue-600 to-blue-800',
    avatar: '👔'
  },
  {
    role: 'Faculty Coordinator',
    name: 'Dr. Neeraj Kumar',
    title: 'HOD / Faculty Placement In-charge',
    email: 'coordinator.engg@spsu.ac.in',
    badge: 'Department Access',
    desc: 'Department-specific drill-through, student attendance compliance, backlog tracking & career counseling analytics.',
    color: 'from-emerald-600 to-emerald-800',
    avatar: '👨‍🏫'
  },
  {
    role: 'Guest / Auditor',
    name: 'NAAC / NBA Audit Panel',
    title: 'Statutory Reviewer',
    email: 'audit@spsu.ac.in',
    badge: 'Read-Only Audit',
    desc: 'Accreditation verification, cohort conversion statistics, placement consistency records.',
    color: 'from-purple-600 to-purple-800',
    avatar: '🔍'
  }
];

export default function AuthModal({ isOpen, onClose, currentUser, onLogin, onLogout }) {
  const [customEmail, setCustomEmail] = useState('');
  const [customPass, setCustomPass] = useState('');
  const [activeTab, setActiveTab] = useState('presets'); // 'presets' | 'custom'

  if (!isOpen) return null;

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customEmail) return;
    onLogin({
      role: 'Staff User',
      name: customEmail.split('@')[0],
      title: 'Career Development Cell Officer',
      email: customEmail,
      badge: 'Authorized',
      avatar: '👤'
    });
    onClose();
  };

  const handlePresetSelect = (preset) => {
    onLogin(preset);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#202023] rounded-xl shadow-2xl border border-slate-200 dark:border-zinc-700 overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 border-b border-zinc-700">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-[#F2C811] flex items-center justify-center font-bold text-slate-900 text-2xl shadow-lg">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#F2C811]">
                  Security & Access Gateway
                </span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-medium">
                  Director's Portal
                </span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white mt-0.5">
                Sir Padampat Singhania University (SPSU)
              </h2>
              <p className="text-xs text-zinc-300">
                Career Development Cell (CDC) - Executive Analytics Console
              </p>
            </div>
          </div>
        </div>

        {/* Current status bar if already logged in */}
        {currentUser && (
          <div className="px-6 py-2.5 bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Currently Authenticated as <strong>{currentUser.name}</strong> ({currentUser.role})</span>
            </div>
            <button
              onClick={onLogout}
              className="text-xs text-red-600 dark:text-red-400 hover:underline font-semibold"
            >
              Sign Out
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          <div className="flex border-b border-slate-200 dark:border-zinc-700 mb-5">
            <button
              onClick={() => setActiveTab('presets')}
              className={`pb-2.5 text-xs font-semibold px-4 border-b-2 transition flex items-center gap-1.5 ${
                activeTab === 'presets'
                  ? 'border-[#F2C811] text-amber-600 dark:text-amber-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-zinc-400'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Quick Role Simulation (1-Click)
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`pb-2.5 text-xs font-semibold px-4 border-b-2 transition flex items-center gap-1.5 ${
                activeTab === 'custom'
                  ? 'border-[#F2C811] text-amber-600 dark:text-amber-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-zinc-400'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              Direct SPSU SSO Credentials
            </button>
          </div>

          {activeTab === 'presets' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {PRESET_ROLES.map((preset) => {
                const isSelected = currentUser?.role === preset.role;
                return (
                  <div
                    key={preset.role}
                    onClick={() => handlePresetSelect(preset)}
                    className={`p-3.5 rounded-lg border text-left cursor-pointer transition relative group ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/60 dark:bg-amber-950/20 ring-1 ring-amber-500'
                        : 'border-slate-200 dark:border-zinc-700 hover:border-slate-400 dark:hover:border-zinc-500 bg-slate-50/50 dark:bg-zinc-800/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{preset.avatar}</span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                              {preset.name}
                            </h4>
                          </div>
                          <p className="text-xs font-medium text-slate-600 dark:text-zinc-400">
                            {preset.title}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-zinc-700 text-slate-700 dark:text-zinc-300">
                        {preset.badge}
                      </span>
                    </div>

                    <p className="mt-2 text-[11px] text-slate-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                      {preset.desc}
                    </p>

                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-zinc-700/60">
                      <span className="text-[10px] text-slate-400 font-mono">
                        {preset.email}
                      </span>
                      <button className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 group-hover:underline">
                        {isSelected ? '✓ Active Session' : 'Authenticate →'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <form onSubmit={handleCustomSubmit} className="space-y-4 max-w-md mx-auto py-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                  Institutional Email ID (@spsu.ac.in)
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="official.name@spsu.ac.in"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                  Access Key / SSO Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={customPass}
                    onChange={(e) => setCustomPass(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-xs rounded-lg shadow-md transition"
              >
                Sign In to SPSU Career Development Cell Console
              </button>
            </form>
          )}

          <div className="mt-5 pt-3 border-t border-slate-200 dark:border-zinc-700 flex items-center justify-between text-[11px] text-slate-400 dark:text-zinc-500">
            <span>Server: secure-cdc.spsu.ac.in • SSL Verified</span>
            <span>Batch 2026 Directorate Release</span>
          </div>
        </div>
      </div>
    </div>
  );
}
