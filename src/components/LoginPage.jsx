import React, { useState } from 'react';
import { Shield, Lock, User, CheckCircle2, AlertCircle, Sparkles, ArrowRight, Building2, Key } from 'lucide-react';
import spsuBanner from '../assets/spsu-banner.png';

export default function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const cleanUser = username.trim().toUpperCase();
    const cleanPass = password.trim();

    if (cleanUser === 'ADMIN' && cleanPass === 'SPSU123') {
      const userObj = {
        role: 'Director / Admin',
        name: 'Administrator',
        title: 'Directorate Executive Admin',
        email: 'director@spsu.ac.in',
        badge: 'Super Admin',
        avatar: '👨‍💼'
      };
      if (rememberMe) {
        localStorage.setItem('spsu_cdc_auth', JSON.stringify(userObj));
      } else {
        sessionStorage.setItem('spsu_cdc_auth', JSON.stringify(userObj));
      }
      onLoginSuccess(userObj);
    } else {
      setError('Invalid credentials. Please enter Username: ADMIN and Password: SPSU123');
    }
  };

  const handleQuickFill = () => {
    setUsername('ADMIN');
    setPassword('SPSU123');
    setError('');
  };

  return (
    <div className="min-h-screen w-screen flex flex-col justify-between bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a] text-slate-100 font-powerbi p-4 sm:p-6 select-none overflow-y-auto">
      {/* Top Header */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between py-2 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#F2C811] text-slate-950 font-black text-xl flex items-center justify-center shadow-lg">
            S
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-white tracking-tight leading-none">
              Sir Padampat Singhania University (SPSU)
            </h1>
            <p className="text-[11px] text-zinc-400 leading-none mt-1">
              Career Development Cell (CDC) • Power BI Executive Intelligence Portal
            </p>
          </div>
        </div>

        <span className="text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
          Director's Request Portal
        </span>
      </div>

      {/* Center Container: Card with Campus Image and Login Form */}
      <div className="w-full max-w-4xl mx-auto my-6 bg-white/5 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* Left Col: University Image Showcase */}
        <div className="md:col-span-6 bg-slate-950/60 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[11px] font-bold text-amber-300 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Ranked 3 in Rajasthan Private Universities</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
              Placement & Summer Internship Directorate Console
            </h2>
            <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
              Official institutional dashboard for monitoring batch conversions, salary distributions, recruiter relations, and student drill-through matrices for the Class of 2026.
            </p>
          </div>

          {/* Full Campus Image with zero cropping */}
          <div className="my-4 rounded-xl overflow-hidden border border-white/20 shadow-md bg-white">
            <img 
              src={spsuBanner} 
              alt="SPSU Udaipur Campus & Accreditations" 
              className="w-full h-auto object-contain block"
            />
          </div>

          <div className="space-y-1.5 text-[11px] text-zinc-400 border-t border-white/10 pt-3">
            <div className="flex items-center justify-between">
              <span>QS I-GAUGE Rating:</span>
              <span className="font-bold text-amber-400">Gold Rating</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Campus Recognition:</span>
              <span className="font-bold text-emerald-400">Best Green & Clean Campus 2026</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Authorizing Body:</span>
              <span className="font-bold text-zinc-200">Directorate / Vice Chancellor Office</span>
            </div>
          </div>
        </div>

        {/* Right Col: Login Form */}
        <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between bg-slate-900/90">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white uppercase tracking-wider">
                  Secure Access Gate
                </h3>
              </div>
              <span className="text-[10px] font-mono bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded border border-zinc-700">
                AUTH v2.6
              </span>
            </div>

            <p className="text-xs text-zinc-400 mb-5">
              Enter your designated administrative credentials to access the Power BI Intelligence environment.
            </p>

            {/* Error banner */}
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 text-xs flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1">
                  Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Enter ADMIN"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-black/40 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="Enter SPSU123"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-black/40 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-zinc-700 text-amber-500 focus:ring-amber-500 bg-zinc-800"
                  />
                  <span>Keep me logged in</span>
                </label>

                <button
                  type="button"
                  onClick={handleQuickFill}
                  className="text-amber-400 hover:text-amber-300 text-xs font-semibold underline underline-offset-2 flex items-center gap-1"
                >
                  <Key className="w-3 h-3" />
                  Auto-fill Credentials
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg hover:shadow-amber-500/25 transition flex items-center justify-center gap-2 mt-2"
              >
                <span>Authorize & Enter Console</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Preset Credentials Helper Card */}
          <div className="mt-6 p-3 bg-amber-500/10 border border-amber-500/25 rounded-lg text-xs">
            <div className="flex items-center gap-1.5 font-bold text-amber-300 text-[11px] uppercase tracking-wider mb-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Requested Login Credentials:</span>
            </div>
            <div className="flex items-center justify-between font-mono text-[11px] text-zinc-300">
              <span>Username: <strong className="text-white">ADMIN</strong></span>
              <span>Password: <strong className="text-white">SPSU123</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full max-w-6xl mx-auto py-2 text-center text-zinc-500 text-[11px] border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>Sir Padampat Singhania University, Bhatewar, Udaipur 313601</span>
        <span>Directorate Placement Intelligence Dashboard • Confidential</span>
      </div>
    </div>
  );
}
