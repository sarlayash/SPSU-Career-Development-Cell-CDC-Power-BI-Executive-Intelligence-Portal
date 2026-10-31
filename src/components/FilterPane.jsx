import React from 'react';
import { Filter, RotateCcw, Search, ChevronRight, ChevronLeft, SlidersHorizontal, Check } from 'lucide-react';

export default function FilterPane({
  isOpen,
  onToggle,
  filters,
  onFilterChange,
  onResetFilters,
  totalCount,
  filteredCount,
  programsList
}) {
  return (
    <aside
      className={`fixed lg:static top-0 right-0 h-full z-30 transition-all duration-300 ease-in-out bg-white dark:bg-[#202024] border-l border-slate-200 dark:border-zinc-800 flex flex-col shadow-xl lg:shadow-none ${
        isOpen ? 'w-80' : 'w-0 lg:w-12 overflow-hidden'
      }`}
    >
      {/* Pane Header */}
      <div className="h-12 px-3 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between bg-slate-50 dark:bg-zinc-900/60 flex-shrink-0">
        <button
          onClick={onToggle}
          className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-zinc-200 hover:text-amber-600 transition"
          title={isOpen ? "Collapse Filters" : "Expand Filters"}
        >
          <Filter className="w-4 h-4 text-amber-500" />
          {isOpen && <span>Power BI Filters</span>}
        </button>

        {isOpen && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={onResetFilters}
              title="Reset all slicers"
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-200/50 dark:hover:bg-zinc-800 rounded transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onToggle}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 rounded transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* When collapsed in desktop, show vertical tab */}
      {!isOpen && (
        <div 
          onClick={onToggle}
          className="hidden lg:flex flex-col items-center py-6 gap-6 cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-800/50 transition h-full text-slate-500"
          title="Click to open Filters"
        >
          <SlidersHorizontal className="w-4 h-4 text-amber-500" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 [writing-mode:vertical-lr] rotate-180">
            Filters Pane ({filteredCount})
          </span>
        </div>
      )}

      {/* Expanded Pane Contents */}
      {isOpen && (
        <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
          {/* Active Filter Metrics */}
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400 tracking-wider">
                Filter Results
              </span>
              <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                {filteredCount} <span className="text-xs font-normal text-slate-500 dark:text-zinc-400">/ {totalCount} Students</span>
              </div>
            </div>
            {filteredCount !== totalCount && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-slate-950">
                Filtered
              </span>
            )}
          </div>

          {/* Search Bar Slicer */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
              Search by Student / Enr. No.
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. 23CS002674 or CSE"
                value={filters.search}
                onChange={(e) => onFilterChange('search', e.target.value)}
                className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-md border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Program / Department Slicer */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2">
              Academic Program
            </label>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => onFilterChange('program', 'ALL')}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition ${
                  filters.program === 'ALL'
                    ? 'bg-[#F2C811] text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700'
                }`}
              >
                All Programs
              </button>
              {programsList.map((prog) => {
                const isActive = filters.program === prog;
                return (
                  <button
                    key={prog}
                    onClick={() => onFilterChange('program', isActive ? 'ALL' : prog)}
                    className={`px-2 py-1 rounded text-[11px] font-semibold transition flex items-center gap-1 ${
                      isActive
                        ? 'bg-[#118DFF] text-white font-bold shadow-sm'
                        : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700'
                    }`}
                  >
                    {isActive && <Check className="w-3 h-3" />}
                    {prog}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Placement Status Slicer */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2">
              Placement Status
            </label>
            <div className="space-y-1">
              {[
                { id: 'ALL', label: 'All Statuses' },
                { id: 'Placed', label: 'Placed (All FTE & PPO)' },
                { id: 'Placed-FTE', label: 'Full-Time Employment (FTE)' },
                { id: 'Placed-PPO', label: 'Pre-Placement Offer (PPO)' },
                { id: 'Remaining', label: 'Eligible & Remaining' },
                { id: 'Opt Out', label: 'Opted Out (Higher Ed / FB)' }
              ].map((opt) => {
                const active = filters.placementStatus === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => onFilterChange('placementStatus', opt.id)}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded cursor-pointer transition ${
                      active
                        ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 font-bold border border-amber-300/60 dark:border-amber-700/60'
                        : 'hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summer Internship Slicer */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2">
              Summer Internship (SI)
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'ALL', label: 'All Students' },
                { id: 'Offered', label: 'SI Offered' },
                { id: 'Pending', label: 'SI Pending' }
              ].map((opt) => {
                const active = filters.internshipStatus === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => onFilterChange('internshipStatus', opt.id)}
                    className={`py-1.5 px-2 rounded text-[11px] font-semibold text-center border transition ${
                      active
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold'
                        : 'border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Gender Slicer */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2">
              Gender Demographics
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {['ALL', 'Male', 'Female'].map((g) => {
                const active = filters.gender === g;
                return (
                  <button
                    key={g}
                    onClick={() => onFilterChange('gender', g)}
                    className={`py-1 px-2 rounded text-[11px] font-semibold border transition ${
                      active
                        ? 'border-amber-500 bg-amber-500 text-slate-950 font-bold'
                        : 'border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {g === 'ALL' ? 'Both' : g}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Campus Type */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2">
              Drive Campus Mode
            </label>
            <select
              value={filters.campus}
              onChange={(e) => onFilterChange('campus', e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="ALL">All Hiring Modes</option>
              <option value="On-Campus">On-Campus Drives</option>
              <option value="Off-Campus">Off-Campus / Pooled</option>
              <option value="On/Off Campus">Dual / Hybrid</option>
            </select>
          </div>

          {/* Reset button */}
          <div className="pt-2">
            <button
              onClick={onResetFilters}
              className="w-full py-2 px-3 border border-slate-300 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-200 rounded text-xs font-semibold transition flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset All Filters
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
