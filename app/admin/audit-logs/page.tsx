'use client';

import React, { useEffect, useState } from 'react';
import { DatabaseService } from '@/lib/dbService';
import { AuditLog } from '@/lib/mockData';
import { FileText, Shield, Activity, Clock } from 'lucide-react';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    async function loadLogs() {
      const data = await DatabaseService.getAuditLogs();
      setLogs(data);
    }
    loadLogs();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <div className="inline-flex items-center space-x-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold mb-2">
            <FileText className="w-3.5 h-3.5" />
            <span>Governance & Security</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">System Audit Logs (`audit_logs`)</h1>
          <p className="text-xs text-slate-500">Immutable chronological timeline of administrative actions and security events</p>
        </div>

        {/* Audit Logs List */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-base font-bold text-slate-900">Activity Trail</h3>
            <span className="text-xs font-semibold text-slate-500">{logs.length} Logged Events</span>
          </div>

          {logs.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 font-medium">
              No audit logs recorded in database yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {logs.map((log) => (
                <div key={log.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-1 bg-slate-900 text-white font-mono text-[10px] font-bold rounded-lg uppercase">
                        {log.action}
                      </span>
                      <span className="font-bold text-sm text-slate-900">Actor: {log.actor_name || 'System Admin'}</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Target Table: <strong className="text-slate-800">{log.target_table}</strong> • Target ID: <span className="font-mono">{log.target_id}</span>
                    </p>
                    {log.metadata && (
                      <pre className="mt-1 p-2 bg-slate-50 border border-slate-100 rounded-lg font-mono text-[11px] text-slate-600 overflow-x-auto">
                        {JSON.stringify(log.metadata)}
                      </pre>
                    )}
                  </div>

                  <div className="text-xs text-slate-400 font-mono shrink-0">
                    {new Date(log.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
