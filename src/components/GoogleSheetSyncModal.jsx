import React, { useState, useEffect } from 'react';
import { 
  X, 
  Cloud, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Link as LinkIcon, 
  Sliders, 
  Table, 
  ShieldCheck, 
  Sparkles,
  Info,
  Clock,
  Trash2
} from 'lucide-react';
import { extractGoogleSheetInfo, fetchLiveGoogleSheet } from '../utils/googleSheetsSync';

// Official sample demo sheet URL for 1-click test
const DEMO_SHEET_URL = "https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit?usp=sharing";

export default function GoogleSheetSyncModal({
  isOpen,
  onClose,
  activeSheetUrl,
  lastSyncedTime,
  isSyncing,
  autoSyncInterval,
  onApplySync,
  onDisconnect,
  onUpdateAutoSyncInterval
}) {
  const [urlInput, setUrlInput] = useState(activeSheetUrl || '');
  const [previewData, setPreviewData] = useState(null);
  const [testing, setTesting] = useState(false);
  const [testError, setTestError] = useState(null);
  const [testSuccess, setTestSuccess] = useState(false);
  const [selectedInterval, setSelectedInterval] = useState(autoSyncInterval || 0);

  useEffect(() => {
    setUrlInput(activeSheetUrl || '');
  }, [activeSheetUrl]);

  if (!isOpen) return null;

  const handleTestConnection = async (urlToTest) => {
    const targetUrl = urlToTest || urlInput;
    if (!targetUrl.trim()) {
      setTestError("Please enter a Google Sheet URL or ID.");
      return;
    }

    setTesting(true);
    setTestError(null);
    setTestSuccess(false);
    setPreviewData(null);

    try {
      const result = await fetchLiveGoogleSheet(targetUrl.trim());
      setPreviewData(result.dataset);
      setTestSuccess(true);
    } catch (err) {
      setTestError(err.message || "Failed to connect to Google Sheet.");
    } finally {
      setTesting(false);
    }
  };

  const handleApply = async () => {
    if (!urlInput.trim()) {
      setTestError("Please enter a valid Google Sheet URL.");
      return;
    }
    await onApplySync(urlInput.trim(), selectedInterval, previewData);
    onClose();
  };

  const handleUseDemo = () => {
    setUrlInput(DEMO_SHEET_URL);
    handleTestConnection(DEMO_SHEET_URL);
  };

  const sheetInfo = extractGoogleSheetInfo(urlInput);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center shadow-inner">
              <Cloud className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold tracking-tight">Google Sheets Live Synchronization Engine</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 uppercase tracking-wider">
                  Real-Time
                </span>
              </div>
              <p className="text-xs text-emerald-100">
                Direct cloud connection to SPSU placement master sheet without third-party servers
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700 dark:text-zinc-300">
          
          {/* Permission Checklist Alert */}
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-semibold text-emerald-900 dark:text-emerald-200">
                Requirement: Google Sheet Link Sharing
              </div>
              <p className="text-emerald-800 dark:text-emerald-300 text-[11px] leading-relaxed">
                In your Google Sheet, click <strong className="font-bold">Share</strong> (top-right) &rarr; change General access to <strong className="font-bold">"Anyone with the link can view"</strong> (Viewer). No API keys or authentication required.
              </p>
            </div>
          </div>

          {/* URL Input Form */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-emerald-600" />
                Google Sheet URL or Spreadsheet ID
              </label>
              <button
                type="button"
                onClick={handleUseDemo}
                className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                Paste Master Sheet Template Link
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => {
                  setUrlInput(e.target.value);
                  setTestSuccess(false);
                  setTestError(null);
                }}
                placeholder="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFM.../edit#gid=0"
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/80 text-slate-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none transition shadow-inner"
              />
              <button
                type="button"
                onClick={() => handleTestConnection()}
                disabled={testing || !urlInput.trim()}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl shadow flex items-center gap-1.5 transition flex-shrink-0"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
                <span>{testing ? 'Testing...' : 'Test & Preview'}</span>
              </button>
            </div>

            {sheetInfo && (
              <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-zinc-400 pt-1">
                <span>Extracted Sheet ID: <code className="text-emerald-600 dark:text-emerald-400 font-mono font-semibold">{sheetInfo.sheetId.slice(0, 14)}...</code></span>
                <span>•</span>
                <span>Tab GID: <code className="text-emerald-600 dark:text-emerald-400 font-mono font-semibold">{sheetInfo.gid}</code></span>
              </div>
            )}
          </div>

          {/* Test Error Message */}
          {testError && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/60 text-red-700 dark:text-red-300 flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-500" />
              <div>
                <div className="font-bold">Sync Connection Failed</div>
                <div className="text-[11px] mt-0.5">{testError}</div>
              </div>
            </div>
          )}

          {/* Test Success & Preview Box */}
          {testSuccess && previewData && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Connection Verified! {previewData.students.length} Student Records Loaded</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]">
                  CORS Direct OK
                </span>
              </div>

              {/* Sample Metric Highlights */}
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2 rounded-lg bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 shadow-sm">
                  <div className="text-slate-400 dark:text-zinc-400 text-[10px]">Total Cohort</div>
                  <div className="text-sm font-black text-slate-800 dark:text-white mt-0.5">
                    {previewData.students.length}
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 shadow-sm">
                  <div className="text-slate-400 dark:text-zinc-400 text-[10px]">Placed Count</div>
                  <div className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {previewData.students.filter(s => s.placementStatus.startsWith('Placed')).length}
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 shadow-sm">
                  <div className="text-slate-400 dark:text-zinc-400 text-[10px]">Internships</div>
                  <div className="text-sm font-black text-blue-600 dark:text-blue-400 mt-0.5">
                    {previewData.students.filter(s => s.internshipOffered).length}
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 shadow-sm">
                  <div className="text-slate-400 dark:text-zinc-400 text-[10px]">Departments</div>
                  <div className="text-sm font-black text-amber-500 mt-0.5">
                    {previewData.summary_placement.length}
                  </div>
                </div>
              </div>

              {/* Sample 3-row preview */}
              <div className="rounded-lg border border-slate-200 dark:border-zinc-700 overflow-hidden">
                <div className="px-3 py-1.5 bg-slate-100 dark:bg-zinc-800 font-bold text-[10px] text-slate-600 dark:text-zinc-400 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Table className="w-3 h-3 text-slate-500" />
                    First 3 Sample Rows From Live Sheet
                  </span>
                  <span>Auto-mapped schema</span>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-zinc-800 bg-white dark:bg-zinc-900 font-mono text-[10px]">
                  {previewData.students.slice(0, 3).map((s, idx) => (
                    <div key={idx} className="p-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 dark:text-zinc-200">{s.name}</span>
                        <span className="text-slate-400">({s.enrollmentNo})</span>
                        <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 text-[9px] font-sans">
                          {s.department}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-sans font-bold ${
                          s.placementStatus.startsWith('Placed') 
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' 
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                        }`}>
                          {s.placementStatus}
                        </span>
                        {s.placementCTC && (
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            ₹{s.placementCTC} LPA
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Sync Frequency / Automation Settings */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-700/80 space-y-2">
            <label className="font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              Automatic Live Refresh Interval
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: 'Manual Only', val: 0 },
                { label: 'Every 5 Mins', val: 5 },
                { label: 'Every 15 Mins', val: 15 },
                { label: 'Every 1 Hour', val: 60 }
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => {
                    setSelectedInterval(opt.val);
                    if (onUpdateAutoSyncInterval) onUpdateAutoSyncInterval(opt.val);
                  }}
                  className={`p-2 rounded-lg border text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
                    selectedInterval === opt.val
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                      : 'bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-700'
                  }`}
                >
                  {selectedInterval === opt.val && <CheckCircle2 className="w-3.5 h-3.5" />}
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-500 dark:text-zinc-400 pt-1">
              When enabled, the portal background checks your Google Sheet for updates without page reloads.
            </p>
          </div>

          {/* Active Status & Reset Option */}
          {activeSheetUrl && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
              <div className="space-y-0.5">
                <div className="text-[11px] font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active Cloud Sync Source
                </div>
                <div className="text-[10px] text-slate-500 dark:text-zinc-400">
                  Last Synced: {lastSyncedTime ? new Date(lastSyncedTime).toLocaleTimeString('en-IN') : 'Just now'}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onDisconnect();
                  onClose();
                }}
                className="px-3 py-1.5 bg-red-100 hover:bg-red-200 dark:bg-red-950/60 dark:hover:bg-red-900/80 text-red-700 dark:text-red-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
              >
                <Trash2 className="w-3 h-3" />
                <span>Disconnect</span>
              </button>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-zinc-800/80 border-t border-slate-200 dark:border-zinc-700 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 dark:text-zinc-400">
            Changes will update all KPI cards, matrices & visual charts instantly.
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-700 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={isSyncing || testing || !urlInput.trim()}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Synchronizing...' : 'Apply & Sync Live'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
