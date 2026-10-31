import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Download, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  ExternalLink,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  Clock,
  Filter
} from 'lucide-react';
import { exportToCSV } from '../utils/exportUtils';

export default function StudentsGridPage({ students, onSelectStudent }) {
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [sortField, setSortField] = useState('sNo');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' | 'desc'
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const departments = ['ALL', 'CSE', 'ECE', 'MN', 'CE', 'ME', 'BDES', 'BCA', 'BBA', 'MBA'];

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const matchSearch = 
        !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.enrollmentNo.toLowerCase().includes(search.toLowerCase()) ||
        (s.placementCompanies && s.placementCompanies.toLowerCase().includes(search.toLowerCase())) ||
        (s.internshipCompaniesOffered && s.internshipCompaniesOffered.toLowerCase().includes(search.toLowerCase()));

      const matchDept = selectedDept === 'ALL' || s.department === selectedDept;
      const matchStatus = 
        selectedStatus === 'ALL' ||
        (selectedStatus === 'Placed' && s.placementStatus.startsWith('Placed')) ||
        s.placementStatus === selectedStatus;

      return matchSearch && matchDept && matchStatus;
    });
  }, [students, search, selectedDept, selectedStatus]);

  // Sorting
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (aVal === null || aVal === undefined) aVal = '';
      if (bVal === null || bVal === undefined) bVal = '';

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toString().toLowerCase();
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filtered, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(sorted.length / pageSize) || 1;
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, currentPage, pageSize]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleExportCSV = () => {
    exportToCSV(`SPSU_CDC_Students_Data_${new Date().toISOString().slice(0,10)}.csv`, sorted);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-amber-500" />
            Student 360° Drill-Through Matrix
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Comprehensive directory of all 392 registered students across 9 academic branches.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow transition"
          >
            <Download className="w-3.5 h-3.5" />
            Export Grid (CSV)
          </button>
        </div>
      </div>

      {/* Control bar: Search, Dept filter, Status filter, Page Size */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 bg-white dark:bg-[#202024] p-3 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm text-xs">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search name, enrollment, company..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        {/* Dept Selector */}
        <div>
          <select
            value={selectedDept}
            onChange={(e) => { setSelectedDept(e.target.value); setCurrentPage(1); }}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                {d === 'ALL' ? 'All Departments (392)' : `${d} Department`}
              </option>
            ))}
          </select>
        </div>

        {/* Status Selector */}
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="ALL">All Placement Statuses</option>
            <option value="Placed">All Placed (47)</option>
            <option value="Placed-FTE">FTE Placed (19)</option>
            <option value="Placed-PPO">PPO Placed (28)</option>
            <option value="Remaining">Eligible & Remaining (242)</option>
            <option value="Opt Out">Opted Out (76)</option>
          </select>
        </div>

        {/* Page Size & Summary */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] text-slate-500 dark:text-zinc-400">
            Showing <strong>{filtered.length}</strong> records
          </span>
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
            className="px-2 py-1 text-xs rounded border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white"
          >
            <option value={25}>25 / page</option>
            <option value={50}>50 / page</option>
            <option value={100}>100 / page</option>
            <option value={400}>All (392)</option>
          </select>
        </div>
      </div>

      {/* Main Power BI Data Grid */}
      <div className="bg-white dark:bg-[#202024] rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-100 dark:bg-zinc-800/80 text-slate-700 dark:text-zinc-300 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-zinc-700 select-none">
                <th onClick={() => handleSort('sNo')} className="py-2.5 px-3 cursor-pointer hover:bg-slate-200 dark:hover:bg-zinc-700">
                  <div className="flex items-center gap-1"># <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                </th>
                <th onClick={() => handleSort('name')} className="py-2.5 px-3 cursor-pointer hover:bg-slate-200 dark:hover:bg-zinc-700">
                  <div className="flex items-center gap-1">Student Name <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                </th>
                <th onClick={() => handleSort('enrollmentNo')} className="py-2.5 px-2 cursor-pointer hover:bg-slate-200 dark:hover:bg-zinc-700">
                  <div className="flex items-center gap-1">Enrollment <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                </th>
                <th onClick={() => handleSort('department')} className="py-2.5 px-2 cursor-pointer hover:bg-slate-200 dark:hover:bg-zinc-700">
                  <div className="flex items-center gap-1">Branch <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                </th>
                <th onClick={() => handleSort('gender')} className="py-2.5 px-2 cursor-pointer hover:bg-slate-200 dark:hover:bg-zinc-700 text-center">
                  Gender
                </th>
                <th onClick={() => handleSort('cgpa')} className="py-2.5 px-2 cursor-pointer hover:bg-slate-200 dark:hover:bg-zinc-700 text-center">
                  <div className="flex items-center justify-center gap-1">CGPA <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                </th>
                <th onClick={() => handleSort('backlogs')} className="py-2.5 px-2 cursor-pointer hover:bg-slate-200 dark:hover:bg-zinc-700 text-center">
                  Backlog
                </th>
                <th onClick={() => handleSort('placementStatus')} className="py-2.5 px-3 cursor-pointer hover:bg-slate-200 dark:hover:bg-zinc-700">
                  <div className="flex items-center gap-1">Placement Status <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                </th>
                <th className="py-2.5 px-3">Company Placed</th>
                <th onClick={() => handleSort('placementCTC')} className="py-2.5 px-3 cursor-pointer hover:bg-slate-200 dark:hover:bg-zinc-700 text-right">
                  <div className="flex items-center justify-end gap-1">CTC (LPA) <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                </th>
                <th className="py-2.5 px-3">Summer Internship</th>
                <th className="py-2.5 px-2 text-center">360°</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 text-slate-800 dark:text-zinc-200">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-8 text-center text-slate-400 text-xs">
                    No student records matching current filters.
                  </td>
                </tr>
              ) : (
                paginated.map((student, idx) => (
                  <tr 
                    key={student.id} 
                    onClick={() => onSelectStudent(student)}
                    className="hover:bg-amber-50/40 dark:hover:bg-zinc-800/60 cursor-pointer transition"
                  >
                    <td className="py-2 px-3 text-slate-400 text-[11px] font-mono">
                      {(currentPage - 1) * pageSize + idx + 1}
                    </td>
                    <td className="py-2 px-3 font-bold text-slate-900 dark:text-white">
                      {student.name}
                    </td>
                    <td className="py-2 px-2 text-slate-500 dark:text-zinc-400 font-mono text-[11px]">
                      {student.enrollmentNo}
                    </td>
                    <td className="py-2 px-2">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
                        {student.department}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-center text-[11px] text-slate-600 dark:text-zinc-400">
                      {student.gender}
                    </td>
                    <td className="py-2 px-2 text-center font-bold">
                      {student.cgpa ? student.cgpa : '-'}
                    </td>
                    <td className="py-2 px-2 text-center">
                      <span className={`text-[11px] font-bold ${student.backlogs > 0 ? 'text-red-500' : 'text-slate-400'}`}>
                        {student.backlogs}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                        student.placementStatus.startsWith('Placed')
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : student.placementStatus === 'Opt Out'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}>
                        {student.placementStatus.startsWith('Placed') && <CheckCircle2 className="w-3 h-3" />}
                        {student.placementStatus}
                      </span>
                    </td>
                    <td className="py-2 px-3 max-w-[160px] truncate" title={student.placementCompanies}>
                      {student.placementCompanies || '-'}
                    </td>
                    <td className="py-2 px-3 text-right font-extrabold text-amber-600 dark:text-amber-400">
                      {student.placementCTC ? `₹${student.placementCTC}` : '-'}
                    </td>
                    <td className="py-2 px-3 max-w-[180px] truncate text-[11px]" title={student.internshipCompaniesOffered || student.internshipCompanyJoined}>
                      {student.internshipOffered ? (
                        <span className="text-blue-600 dark:text-blue-400 font-semibold">
                          {student.internshipCompanyJoined || student.internshipCompaniesOffered || 'Offered'}
                        </span>
                      ) : (
                        <span className="text-slate-400">Pending</span>
                      )}
                    </td>
                    <td className="py-2 px-2 text-center">
                      <button 
                        onClick={(e) => { e.stopPropagation(); onSelectStudent(student); }}
                        className="p-1 hover:bg-slate-200 dark:hover:bg-zinc-700 rounded text-slate-500 hover:text-amber-500 transition"
                        title="View Student 360° Profile"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-3 bg-slate-50 dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-zinc-400 text-[11px]">
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({sorted.length} total students)
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded border border-slate-300 dark:border-zinc-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-bold text-slate-800 dark:text-zinc-200 text-xs">
              {currentPage}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded border border-slate-300 dark:border-zinc-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
