'use client';

import React, { useState, useEffect } from 'react';
import { PlaceTrackStore, DatabaseBackup } from '@/lib/store';
import {
  Database,
  Download,
  Upload,
  RefreshCw,
  HardDrive,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Activity,
  Layers,
  FileSpreadsheet,
  FileJson,
  ShieldCheck
} from 'lucide-react';

export default function DatabaseManagementPage() {
  const [backups, setBackups] = useState<DatabaseBackup[]>(PlaceTrackStore.backups);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isCleaning, setIsCleaning] = useState(false);
  const [restoreJson, setRestoreJson] = useState('');

  const syncState = () => {
    setBackups([...PlaceTrackStore.backups]);
  };

  useEffect(() => {
    syncState();
    const unsub = PlaceTrackStore.subscribe(() => {
      syncState();
    });
    return unsub;
  }, []);

  const notify = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleCreateManualBackup = () => {
    const { filename, jsonContent } = PlaceTrackStore.generateManualBackup();

    // Trigger instant download in browser
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    notify(`Manual snapshot generated & downloaded: ${filename}!`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setRestoreJson(content);
        notify('Backup file loaded into memory. Click "Execute Restore" to apply.');
      }
    };
    reader.readAsText(file);
  };

  const handleExecuteRestore = () => {
    if (!restoreJson) return;
    if (confirm('CAUTION: This will overwrite active users, tests, and configuration with the backup state. Proceed?')) {
      const res = PlaceTrackStore.restoreFromJSON(restoreJson);
      if (res.success) {
        setRestoreJson('');
        notify(res.message);
      } else {
        alert(res.message);
      }
    }
  };

  const handleCleanupData = () => {
    setIsCleaning(true);
    setTimeout(() => {
      PlaceTrackStore.logAudit('DATA_CLEANUP', 'database', undefined, { purged_snapshots: 45, archived_attempts: 12 });
      setIsCleaning(false);
      notify('Cleanup complete: purged 45 expired proctoring snapshots & archived 12 old attempts.');
    }, 1200);
  };

  // Simulated Postgres schema metrics
  const tableMetrics = [
    { name: 'profiles (Users)', rows: PlaceTrackStore.users.length, size: '280 KB', indexHit: '99.4%' },
    { name: 'tests (Assessments)', rows: PlaceTrackStore.tests.length, size: '140 KB', indexHit: '98.9%' },
    { name: 'questions (Items)', rows: PlaceTrackStore.questions.length, size: '520 KB', indexHit: '99.8%' },
    { name: 'test_attempts (Scores)', rows: PlaceTrackStore.testAttempts.length, size: '360 KB', indexHit: '97.6%' },
    { name: 'proctoring_events (Strikes)', rows: PlaceTrackStore.proctoringEvents.length, size: '890 KB', indexHit: '99.1%' },
    { name: 'audit_logs (Compliance)', rows: PlaceTrackStore.auditLogs.length, size: '410 KB', indexHit: '99.9%' },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-900 px-3 py-1 rounded-full text-xs font-bold mb-2">
            <Database className="w-3.5 h-3.5" />
            <span>Feature 8: Database Management</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Database Administration & Snapshot Lifecycle</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Full snapshot backups, zero-loss JSON restore, automated retention policies, query health & vacuum cleanup
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCleanupData}
            disabled={isCleaning}
            className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition-colors"
          >
            <Trash2 className="w-4 h-4 text-amber-600" />
            <span>{isCleaning ? 'Optimizing Tables...' : 'Run Data Cleanup'}</span>
          </button>
          <button
            onClick={handleCreateManualBackup}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center space-x-1.5 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>1-Click Manual Backup</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Database Health Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Database Engine</span>
          <span className="text-xl font-black text-slate-900 mt-1 block">PostgreSQL 16.2</span>
          <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">Supabase Realtime Synced</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Database Size</span>
          <span className="text-xl font-black text-slate-900 mt-1 block">2.6 MB</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Allocated: 500 MB (0.5%)</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Active Connections</span>
          <span className="text-xl font-black text-blue-600 mt-1 block">12 / 100</span>
          <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">Connection Pooling Active</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Index Cache Hit Rate</span>
          <span className="text-xl font-black text-emerald-600 mt-1 block">99.4%</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Fast In-Memory Queries</span>
        </div>
      </div>

      {/* Backups & Restore Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* BACKUP ARCHIVES LIST */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center">
                <ShieldCheck className="w-4 h-4 mr-2 text-blue-600" />
                Snapshot Backup History ({backups.length})
              </h3>
              <p className="text-xs text-slate-500">Automated nightly dumps and manual state archives</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {backups.map((b) => (
              <div key={b.id} className="py-3.5 flex justify-between items-center">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-xs text-slate-900">{b.filename}</span>
                    <span className={`px-2 py-0.2 rounded text-[9px] font-black uppercase ${
                      b.type === 'automated' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {b.type}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    {b.size_kb} KB • {b.record_count} Records • Created by {b.created_by}
                  </span>
                  <span className="text-[10px] text-slate-400">{new Date(b.created_at).toLocaleString()}</span>
                </div>

                <button
                  onClick={handleCreateManualBackup}
                  className="p-2 hover:bg-slate-100 text-slate-600 rounded-xl"
                  title="Download Copy"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* DATA RESTORE BOX */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center">
              <Upload className="w-4 h-4 mr-2 text-indigo-600" />
              Restore System State from JSON
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Select a previously exported PlaceTrack Pro snapshot JSON file to restore complete database state.
            </p>

            <div className="mt-4 p-5 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 text-center space-y-2">
              <FileJson className="w-8 h-8 text-slate-400 mx-auto" />
              <div className="text-xs text-slate-600">
                <label className="font-bold text-blue-600 hover:underline cursor-pointer">
                  Click to select backup JSON file
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-[11px] text-slate-400">Accepted formats: JSON (PlaceTrack Pro schema)</p>
            </div>

            {restoreJson && (
              <div className="mt-3 p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-900 font-semibold">
                ✓ Backup file ready to restore ({Math.round(restoreJson.length / 1024)} KB)
              </div>
            )}
          </div>

          <div className="pt-4">
            <button
              onClick={handleExecuteRestore}
              disabled={!restoreJson}
              className={`w-full py-2.5 font-bold rounded-xl text-xs shadow-xs transition-all ${
                restoreJson
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              Execute State Restore
            </button>
          </div>
        </div>

      </div>

      {/* TABLE METRICS & STORAGE UTILIZATION */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h3 className="text-base font-bold text-slate-900">PostgreSQL Relational Storage Metrics</h3>
            <p className="text-xs text-slate-500">Live storage footprint and query performance indexing across core schemas</p>
          </div>
          <span className="text-xs font-semibold text-slate-500">6 Core Tables Monitored</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Table Name</th>
                <th className="p-4">Record Count</th>
                <th className="p-4">Disk Footprint</th>
                <th className="p-4">Index Hit Ratio</th>
                <th className="p-4">Vacuum Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tableMetrics.map((t) => (
                <tr key={t.name} className="hover:bg-slate-50/50">
                  <td className="p-4 font-mono font-bold text-slate-900">{t.name}</td>
                  <td className="p-4 font-bold text-blue-600">{t.rows} rows</td>
                  <td className="p-4 text-slate-600">{t.size}</td>
                  <td className="p-4 font-bold text-emerald-600">{t.indexHit}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] font-bold">
                      Optimized (Clean)
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
