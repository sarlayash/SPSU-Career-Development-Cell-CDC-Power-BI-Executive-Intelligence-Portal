import React, { useState } from 'react';
import { Upload, Download, RefreshCw, CheckCircle2, AlertCircle, FileSpreadsheet, Sparkles, Layers } from 'lucide-react';

export default function TemplateManagerPage({ onUploadDataset, onResetToDefault, currentMeta }) {
  const [uploadStatus, setUploadStatus] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    parseUploadedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      parseUploadedFile(file);
    }
  };

  const parseUploadedFile = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        // Simple client-side CSV parser
        const lines = text.split(/\r?\n/).filter(line => line.trim());
        if (lines.length < 2) {
          throw new Error("File must contain at least a header row and 1 data row");
        }

        const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
        const parsedStudents = [];

        for (let i = 1; i < lines.length; i++) {
          const row = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
          if (!row || !row[0]) continue;

          parsedStudents.push({
            id: row[2] || `custom_${i}`,
            sNo: i,
            name: row[1] || `Student ${i}`,
            enrollmentNo: row[2] || `ENR${i}`,
            course: row[3] || 'Degree',
            department: row[4] || 'Dept',
            specialization: row[5] || '',
            emailSpsu: row[6] || '',
            emailPersonal: row[7] || '',
            contactNo: row[8] || '',
            gender: row[9] || 'Other',
            cgpa: parseFloat(row[10]) || null,
            backlogs: parseInt(row[11]) || 0,
            orientationAttendance: 'Present',
            declarationStatus: 'Opt - In',
            placementStatus: row[12] && row[12].includes('Placed') ? row[12] : 'Remaining',
            placementCampus: 'On-Campus',
            placementCompanies: row[13] || '',
            placementCTC: parseFloat(row[14]) || null,
            placementNOC: 'Pending',
            internshipOffersCount: 1,
            internshipOffered: true,
            internshipCompaniesOffered: row[15] || 'Partner Firm',
            internshipCompanyJoined: row[15] || '',
            internshipNOC: 'Done',
            internshipProfile: 'Intern',
            internshipStipend: 'Stipend',
            internshipLocation: 'Regional'
          });
        }

        if (parsedStudents.length > 0) {
          onUploadDataset(parsedStudents, file.name);
          setUploadStatus({
            success: true,
            message: `Successfully loaded ${parsedStudents.length} student records from ${file.name}!`
          });
        }
      } catch (err) {
        setUploadStatus({
          success: false,
          message: `Failed to parse file: ${err.message}`
        });
      }
    };
    reader.readAsText(file);
  };

  const handleDownloadSampleTemplate = () => {
    const sampleHeaders = [
      "S.No",
      "Students Name",
      "Enrollment No",
      "Course",
      "Department",
      "Specialization",
      "Email SPSU",
      "Email Personal",
      "Contact No",
      "Gender",
      "CGPA",
      "Backlogs",
      "Placement Status",
      "Placement Company",
      "CTC (LPA)",
      "Internship Company"
    ].join(',');

    const sampleRow1 = [
      "1",
      "Student Candidate 1",
      "24CS001001",
      "B.Tech",
      "CSE",
      "AIML",
      "candidate1@spsu.ac.in",
      "candidate1@gmail.com",
      "9876543210",
      "Male",
      "8.5",
      "0",
      "Placed-FTE",
      "Xebia",
      "8.5",
      "Xebia"
    ].join(',');

    const sampleRow2 = [
      "2",
      "Ananya Verma",
      "24MBA002002",
      "MBA",
      "MBA",
      "Finance",
      "ananya@spsu.ac.in",
      "ananya@gmail.com",
      "9876543211",
      "Female",
      "9.1",
      "0",
      "Placed-PPO",
      "Country Edu",
      "10.0",
      "Bridge Group"
    ].join(',');

    const content = `${sampleHeaders}\n${sampleRow1}\n${sampleRow2}\n`;
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "SPSU_CDC_Reusable_Template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-500" />
            Reusable CDC Web App Template & Dataset Engine
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Easily adopt this Power BI interface for any future graduating cohort (2027, 2028) or upload custom department spreadsheets.
          </p>
        </div>

        <button
          onClick={onResetToDefault}
          className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-800 dark:text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reload SPSU 2026 Official Dataset
        </button>
      </div>

      {/* Upload & Drag Drop Zone */}
      <div 
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`p-8 border-2 border-dashed rounded-xl text-center transition flex flex-col items-center justify-center ${
          dragOver 
            ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20' 
            : 'border-slate-300 dark:border-zinc-700 bg-white dark:bg-[#202024]'
        }`}
      >
        <div className="w-14 h-14 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mb-3">
          <Upload className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Drop your new Cohort / Department CSV here to instant-render
        </h3>
        <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-md mt-1 mb-4">
          Upload any CSV file. The Power BI engine will recalculate all KPI cards, department rankings, conversion funnels, and data grids in real-time.
        </p>

        <div className="flex items-center gap-3">
          <label className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg cursor-pointer shadow transition">
            <span>Browse CSV File</span>
            <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
          </label>

          <button
            onClick={handleDownloadSampleTemplate}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-800 dark:text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 border border-slate-300 dark:border-zinc-700 transition"
          >
            <Download className="w-3.5 h-3.5" />
            Download Reusable CSV Template
          </button>
        </div>

        {uploadStatus && (
          <div className={`mt-5 p-3 rounded-lg text-xs font-semibold flex items-center gap-2 ${
            uploadStatus.success 
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
          }`}>
            {uploadStatus.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{uploadStatus.message}</span>
          </div>
        )}
      </div>

      {/* Active Dataset Metadata */}
      <div className="bg-white dark:bg-[#202024] p-5 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          Currently Active Pipeline Information
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Institution</span>
            <span className="font-semibold text-slate-900 dark:text-white">Sir Padampat Singhania University</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Host Cell</span>
            <span className="font-semibold text-slate-900 dark:text-white">Career Development Cell (CDC)</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Batch Cohort</span>
            <span className="font-semibold text-slate-900 dark:text-white">2026 Graduating Class</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Directorate Priority</span>
            <span className="font-semibold text-amber-600 dark:text-amber-400">High / Strategic Briefing</span>
          </div>
        </div>
      </div>
    </div>
  );
}
