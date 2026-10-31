import React, { useState } from 'react';
import { 
  BarChart3, 
  RotateCcw, 
  Download, 
  Moon, 
  Sun, 
  User, 
  Filter, 
  Printer, 
  FileSpreadsheet, 
  FileText, 
  ChevronDown,
  Sparkles,
  Layers,
  Share2,
  HelpCircle,
  ShieldCheck,
  Building2
} from 'lucide-react';

export default function HeaderRibbon({
  activeTab,
  onTabChange,
  darkMode,
  onToggleDarkMode,
  currentUser,
  onOpenAuth,
  onResetFilters,
  onToggleFilters,
  isFilterOpen,
  onExportCSV,
  onExportSummary,
  onPrintReport
}) {
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Executive Cockpit', icon: BarChart3 },
    { id: 'placements', label: 'Placement Hub', icon: Layers },
    { id: 'internships', label: 'Summer Internship', icon: Building2 },
    { id: 'students', label: 'Student 360° Matrix', icon: FileSpreadsheet },
    { id: 'recruiters', label: 'Recruiter Intelligence', icon: Sparkles },
    { id: 'reports', label: 'Reports Studio', icon: FileText },
    { id: 'template', label: 'Template Manager', icon: Share2 }
  ];

  return (
    <header className="no-print bg-[#201F1E] dark:bg-[#121214] text-white flex-shrink-0 border-b border-zinc-800 shadow-sm select-none">
      {/* Top micro bar: SPSU Logo, App Title, Directorate Tag & User Controls */}
      <div className="h-10 px-4 flex items-center justify-between border-b border-zinc-800/80 text-xs">
        {/* Left: University & Portal Identity */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#F2C811] flex items-center justify-center font-black text-slate-950 text-sm shadow">
              S
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-bold tracking-tight text-white text-sm">
                SPSU Career Development Cell
              </span>
              <span className="text-[10px] text-zinc-400 hidden sm:inline">
                • Directorate Executive Portal (Power BI Edition)
              </span>
            </div>
          </div>
          <span className="hidden md:inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            Director's Request #2026-CDC
          </span>
        </div>

        {/* Right: Quick Controls, Download Dropdown, Dark Mode & User Profile */}
        <div className="flex items-center gap-2">
          {/* Slicers toggle */}
          <button
            onClick={onToggleFilters}
            className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition ${
              isFilterOpen 
                ? 'bg-amber-500 text-slate-950 font-bold' 
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
            }`}
            title="Toggle Filter Pane"
          >
            <Filter className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Slicers</span>
          </button>

          {/* Reset Filters */}
          <button
            onClick={onResetFilters}
            className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded transition"
            title="Reset All Slicers"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Download Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDownloadMenuOpen(!downloadMenuOpen)}
              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-xs flex items-center gap-1.5 shadow transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export Reports</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {downloadMenuOpen && (
              <div 
                className="absolute right-0 mt-1 w-60 bg-white dark:bg-zinc-800 rounded-lg shadow-xl border border-slate-200 dark:border-zinc-700 py-1.5 z-50 text-slate-800 dark:text-zinc-200 text-xs animate-in fade-in"
                onMouseLeave={() => setDownloadMenuOpen(false)}
              >
                <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-400 tracking-wider">
                  Download Options
                </div>
                <button
                  onClick={() => { onPrintReport(); setDownloadMenuOpen(false); }}
                  className="w-full px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-zinc-700 flex items-center gap-2"
                >
                  <Printer className="w-4 h-4 text-amber-500" />
                  <div>
                    <div className="font-semibold">Print / Save PDF Report</div>
                    <div className="text-[10px] text-slate-500 dark:text-zinc-400">Director's 1-Pager Executive Memo</div>
                  </div>
                </button>
                <button
                  onClick={() => { onExportCSV(); setDownloadMenuOpen(false); }}
                  className="w-full px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-zinc-700 flex items-center gap-2"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                  <div>
                    <div className="font-semibold">Download Students (CSV)</div>
                    <div className="text-[10px] text-slate-500 dark:text-zinc-400">Filtered 392 Students Data</div>
                  </div>
                </button>
                <button
                  onClick={() => { onExportSummary(); setDownloadMenuOpen(false); }}
                  className="w-full px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-zinc-700 flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-blue-500" />
                  <div>
                    <div className="font-semibold">Download Program Summary</div>
                    <div className="text-[10px] text-slate-500 dark:text-zinc-400">Placements & Internships Matrix</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Dark / Light Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded transition"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          {/* User Profile / Role Badge */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 pl-2 pr-3 py-1 bg-zinc-800 hover:bg-zinc-700 rounded transition border border-zinc-700"
            title="Switch User Role / Sign In"
          >
            <span className="text-base leading-none">
              {currentUser?.avatar || '👤'}
            </span>
            <div className="text-left hidden md:block">
              <div className="font-bold text-[11px] text-white leading-tight">
                {currentUser?.name || 'Sign In'}
              </div>
              <div className="text-[9px] text-amber-400 leading-tight">
                {currentUser?.role || 'Guest'}
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Main Power BI Navigation Ribbon Tabs */}
      <div className="h-10 px-4 flex items-center gap-1 overflow-x-auto bg-[#2b2b2b] dark:bg-[#18181b]">
        {tabs.map((t) => {
          const isActive = activeTab === t.id;
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => onTabChange(t.id)}
              className={`h-full px-3.5 text-xs font-semibold flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
                isActive
                  ? 'border-[#F2C811] text-[#F2C811] bg-black/20 font-bold'
                  : 'border-transparent text-zinc-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#F2C811]' : 'text-zinc-400'}`} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
