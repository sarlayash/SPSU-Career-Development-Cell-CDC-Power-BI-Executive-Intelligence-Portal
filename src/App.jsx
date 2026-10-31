import React, { useState, useEffect, useMemo } from 'react';
import initialData from './data/spsu_cdc_data.json';
import HeaderRibbon from './components/HeaderRibbon';
import FilterPane from './components/FilterPane';
import AuthModal from './components/AuthModal';
import LoginPage from './components/LoginPage';
import StudentDetailModal from './components/StudentDetailModal';
import ExecutiveDirectorPrintReport from './components/ExecutiveDirectorPrintReport';

// Pages
import ExecutiveOverviewPage from './pages/ExecutiveOverviewPage';
import PlacementPage from './pages/PlacementPage';
import InternshipPage from './pages/InternshipPage';
import StudentsGridPage from './pages/StudentsGridPage';
import RecruitersPage from './pages/RecruitersPage';
import ReportsPage from './pages/ReportsPage';
import TemplateManagerPage from './pages/TemplateManagerPage';

import { exportToCSV, triggerPrintReport } from './utils/exportUtils';

export default function App() {
  const [dataset, setDataset] = useState(initialData);
  const [activeTab, setActiveTab] = useState('overview');
  const [darkMode, setDarkMode] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Authentication State: check saved session or default to null to require login
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedLocal = localStorage.getItem('spsu_cdc_auth');
      const savedSession = sessionStorage.getItem('spsu_cdc_auth');
      if (savedLocal) return JSON.parse(savedLocal);
      if (savedSession) return JSON.parse(savedSession);
    } catch (e) {
      // ignore
    }
    return null;
  });

  // Global Slicers State
  const initialFilters = {
    program: 'ALL',
    placementStatus: 'ALL',
    internshipStatus: 'ALL',
    campus: 'ALL',
    gender: 'ALL',
    search: ''
  };
  const [filters, setFilters] = useState(initialFilters);

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('spsu_cdc_auth');
      sessionStorage.removeItem('spsu_cdc_auth');
    } catch (e) {}
    setCurrentUser(null);
  };

  // Filter students based on slicers
  const filteredStudents = useMemo(() => {
    return dataset.students.filter(s => {
      // Program
      if (filters.program !== 'ALL' && s.department !== filters.program) {
        return false;
      }
      // Placement Status
      if (filters.placementStatus !== 'ALL') {
        if (filters.placementStatus === 'Placed') {
          if (!s.placementStatus.startsWith('Placed')) return false;
        } else if (s.placementStatus !== filters.placementStatus) {
          return false;
        }
      }
      // Internship Status
      if (filters.internshipStatus !== 'ALL') {
        if (filters.internshipStatus === 'Offered' && !s.internshipOffered) return false;
        if (filters.internshipStatus === 'Pending' && s.internshipOffered) return false;
      }
      // Campus
      if (filters.campus !== 'ALL') {
        if (s.placementCampus !== filters.campus) return false;
      }
      // Gender
      if (filters.gender !== 'ALL') {
        if (s.gender.toLowerCase() !== filters.gender.toLowerCase()) return false;
      }
      // Search text
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchesName = s.name.toLowerCase().includes(query);
        const matchesEnr = s.enrollmentNo.toLowerCase().includes(query);
        const matchesComp = s.placementCompanies && s.placementCompanies.toLowerCase().includes(query);
        const matchesSi = s.internshipCompaniesOffered && s.internshipCompaniesOffered.toLowerCase().includes(query);
        if (!matchesName && !matchesEnr && !matchesComp && !matchesSi) {
          return false;
        }
      }
      return true;
    });
  }, [dataset.students, filters]);

  // Handle program click from overview table
  const handleSelectProgramFromOverview = (prog) => {
    setFilters(prev => ({
      ...prev,
      program: prev.program === prog ? 'ALL' : prog
    }));
    setIsFilterOpen(true);
  };

  // Handle upload of custom dataset
  const handleUploadCustomDataset = (newStudentsList, fileName) => {
    const updated = {
      ...dataset,
      students: newStudentsList,
      meta: {
        ...dataset.meta,
        report: `Custom Dataset: ${fileName}`,
        totalStudents: newStudentsList.length
      }
    };
    setDataset(updated);
    setActiveTab('overview');
  };

  const handleResetToDefault = () => {
    setDataset(initialData);
    setFilters(initialFilters);
  };

  const programsList = ['CSE', 'ECE', 'MN', 'CE', 'ME', 'BDES', 'BCA', 'BBA', 'MBA'];

  // Exports
  const handleExportCSV = () => {
    exportToCSV(`SPSU_CDC_Students_${new Date().toISOString().slice(0, 10)}.csv`, filteredStudents);
  };

  const handleExportSummary = () => {
    exportToCSV(`SPSU_CDC_Placement_Summary_${new Date().toISOString().slice(0, 10)}.csv`, dataset.summary_placement);
  };

  // If not logged in, render the dedicated SPSU Login Gate
  if (!currentUser) {
    return <LoginPage onLoginSuccess={setCurrentUser} />;
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#F3F4F6] dark:bg-[#18181B] text-slate-900 dark:text-slate-100 font-powerbi">
      {/* Power BI Header & Ribbon Bar */}
      <HeaderRibbon
        activeTab={activeTab}
        onTabChange={setActiveTab}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onResetFilters={handleResetFilters}
        onToggleFilters={() => setIsFilterOpen(!isFilterOpen)}
        isFilterOpen={isFilterOpen}
        onExportCSV={handleExportCSV}
        onExportSummary={handleExportSummary}
        onPrintReport={triggerPrintReport}
        onLogout={handleLogout}
      />

      {/* Main Work Area: Dashboard Content + Power BI Filter Slicer Pane */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Main Interactive Report Canvas */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 space-y-6">
          {activeTab === 'overview' && (
            <ExecutiveOverviewPage
              dataset={dataset}
              filteredStudents={filteredStudents}
              onSelectProgram={handleSelectProgramFromOverview}
              onSelectStudent={setSelectedStudent}
              onNavigateTab={setActiveTab}
              onFilterChange={handleFilterChange}
            />
          )}

          {activeTab === 'placements' && (
            <PlacementPage
              dataset={dataset}
              filteredStudents={filteredStudents}
              onSelectStudent={setSelectedStudent}
              onNavigateTab={setActiveTab}
              onFilterChange={handleFilterChange}
            />
          )}

          {activeTab === 'internships' && (
            <InternshipPage
              dataset={dataset}
              filteredStudents={filteredStudents}
              onSelectStudent={setSelectedStudent}
              onNavigateTab={setActiveTab}
              onFilterChange={handleFilterChange}
            />
          )}

          {activeTab === 'students' && (
            <StudentsGridPage
              students={filteredStudents}
              onSelectStudent={setSelectedStudent}
              onNavigateTab={setActiveTab}
              onFilterChange={handleFilterChange}
            />
          )}

          {activeTab === 'recruiters' && (
            <RecruitersPage
              dataset={dataset}
              filteredStudents={filteredStudents}
              onSelectStudent={setSelectedStudent}
              onNavigateTab={setActiveTab}
              onFilterChange={handleFilterChange}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsPage
              dataset={dataset}
              filteredStudents={filteredStudents}
            />
          )}

          {activeTab === 'template' && (
            <TemplateManagerPage
              onUploadDataset={handleUploadCustomDataset}
              onResetToDefault={handleResetToDefault}
              currentMeta={dataset.meta}
            />
          )}
        </main>

        {/* Collapsible Power BI Slicers & Filters Pane */}
        <FilterPane
          isOpen={isFilterOpen}
          onToggle={() => setIsFilterOpen(!isFilterOpen)}
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          totalCount={dataset.students.length}
          filteredCount={filteredStudents.length}
          programsList={programsList}
        />
      </div>

      {/* Student 360° Profile Modal */}
      <StudentDetailModal
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />

      {/* Authentication Gateway Modal (for switching roles or signing out) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onLogin={setCurrentUser}
        onLogout={handleLogout}
      />

      {/* Invisible on screen, renders during window.print() */}
      <ExecutiveDirectorPrintReport
        dataset={dataset}
        filteredStudents={filteredStudents}
      />
    </div>
  );
}
