'use client';

import React, { useState, useEffect } from 'react';
import { PlaceTrackStore, BlockedIP, ActiveSession } from '@/lib/store';
import { AuditLog } from '@/lib/mockData';
import {
  Shield,
  FileText,
  Lock,
  Globe,
  AlertTriangle,
  UserX,
  Clock,
  CheckCircle2,
  Trash2,
  Plus,
  RefreshCw,
  LogOut,
  Download,
  Key,
  Database
} from 'lucide-react';

type SecurityTab = 'audit_logs' | 'sessions' | 'ip_blocking' | 'failed_logins' | 'gdpr';

export default function SecurityAndAuditPage() {
  const [activeTab, setActiveTab] = useState<SecurityTab>('audit_logs');
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(PlaceTrackStore.auditLogs);
  const [blockedIPs, setBlockedIPs] = useState<BlockedIP[]>(PlaceTrackStore.blockedIPs);
  const [sessions, setSessions] = useState<ActiveSession[]>(PlaceTrackStore.activeSessions);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // IP Block Form
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockIp, setBlockIp] = useState('');
  const [blockReason, setBlockReason] = useState('');

  // GDPR search
  const [gdprStudentId, setGdprStudentId] = useState('');
  const [gdprResult, setGdprResult] = useState<any | null>(null);

  const syncState = () => {
    setAuditLogs([...PlaceTrackStore.auditLogs]);
    setBlockedIPs([...PlaceTrackStore.blockedIPs]);
    setSessions([...PlaceTrackStore.activeSessions]);
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

  const handleBlockIP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockIp) return;
    PlaceTrackStore.blockIP(blockIp, blockReason || 'Manual administrative ban');
    setShowBlockModal(false);
    setBlockIp('');
    setBlockReason('');
    notify(`IP Address ${blockIp} has been blocked.`);
  };

  const handleUnblockIP = (id: string, ip: string) => {
    PlaceTrackStore.unblockIP(id);
    notify(`IP ${ip} unblocked.`);
  };

  const handleTerminateSession = (id: string, name: string) => {
    PlaceTrackStore.terminateSession(id);
    notify(`Session terminated for ${name}.`);
  };

  const handleGDPRSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const student = PlaceTrackStore.users.find(u => u.id === gdprStudentId || u.email === gdprStudentId);
    if (student) {
      setGdprResult({
        profile: student,
        attempts: PlaceTrackStore.testAttempts.filter(a => a.student_id === student.id),
        readiness: PlaceTrackStore.readinessScores.find(r => r.student_id === student.id),
        auditTrail: PlaceTrackStore.auditLogs.filter(l => l.target_id === student.id),
      });
    } else {
      setGdprResult(null);
      notify('No candidate found with that ID or email.');
    }
  };

  const handleGDPRExport = () => {
    if (!gdprResult) return;
    const jsonString = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(gdprResult, null, 2));
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = `gdpr_data_${gdprResult.profile.id}.json`;
    link.click();
    notify('GDPR candidate data archive downloaded.');
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-indigo-100 text-indigo-900 px-3 py-1 rounded-full text-xs font-bold mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Feature 7: Security & Audit Governance</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Security Center, Threat Defense & Audit Logs</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time session control, automated IP blocking, GDPR privacy tools & immutable audit timelines
          </p>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap border-b border-slate-200 gap-1">
        {[
          { id: 'audit_logs', label: 'Immutable Audit Logs', icon: FileText, count: auditLogs.length },
          { id: 'sessions', label: 'Active User Sessions', icon: Lock, count: sessions.length },
          { id: 'ip_blocking', label: 'IP Blocking & Defense', icon: Globe, count: blockedIPs.length },
          { id: 'failed_logins', label: 'Failed Login Detector', icon: AlertTriangle },
          { id: 'gdpr', label: 'GDPR & Candidate Privacy', icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SecurityTab)}
              className={`flex items-center px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
                isActive
                  ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5 mr-1.5" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                  isActive ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: AUDIT LOGS */}
      {activeTab === 'audit_logs' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900">System Activity Audit Trail</h3>
              <p className="text-xs text-slate-500">Every administrative and proctoring action timestamped with actor ID</p>
            </div>
            <span className="text-xs font-semibold text-slate-500">{auditLogs.length} events</span>
          </div>

          <div className="divide-y divide-slate-100">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3 hover:bg-slate-50/50">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 bg-slate-900 text-white font-mono text-[10px] font-bold rounded uppercase">
                      {log.action}
                    </span>
                    <span className="font-bold text-xs text-slate-900">{log.actor_name}</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Target Table: <strong className="text-slate-700">{log.target_table}</strong> {log.target_id && `• ID: #${log.target_id}`}
                  </p>
                  {log.metadata && (
                    <pre className="p-2 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-mono text-slate-600 overflow-x-auto">
                      {JSON.stringify(log.metadata)}
                    </pre>
                  )}
                </div>

                <span className="text-xs text-slate-400 font-mono shrink-0">
                  {new Date(log.created_at).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ACTIVE SESSIONS */}
      {activeTab === 'sessions' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Live Active User Sessions ({sessions.length})</h3>
              <p className="text-xs text-slate-500">Administrators can remotely invalidate sessions to stop unauthorized test taking</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
            {sessions.map((sess) => (
              <div key={sess.id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs text-slate-900">{sess.user_name}</span>
                    <span className={`px-2 py-0.2 rounded text-[10px] font-black uppercase ${
                      sess.role === 'admin' ? 'bg-amber-100 text-amber-900' : sess.role === 'faculty' ? 'bg-indigo-100 text-indigo-900' : 'bg-blue-100 text-blue-900'
                    }`}>
                      {sess.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {sess.email} • IP: <span className="font-mono">{sess.ip_address}</span> • Device: {sess.device}
                  </p>
                  <span className="text-[10px] text-slate-400">Logged in: {new Date(sess.login_time).toLocaleTimeString()} ({sess.last_active})</span>
                </div>

                <button
                  onClick={() => handleTerminateSession(sess.id, sess.user_name)}
                  className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-xl flex items-center space-x-1.5 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Terminate Session</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: IP BLOCKING */}
      {activeTab === 'ip_blocking' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Banned IP Addresses ({blockedIPs.length})</h3>
              <p className="text-xs text-slate-500">Intrusive scrapers and brute-force bot IPs prohibited by edge firewall</p>
            </div>
            <button
              onClick={() => setShowBlockModal(true)}
              className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Block New IP</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
            {blockedIPs.map((bip) => (
              <div key={bip.id} className="p-4 flex justify-between items-center">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-xs text-slate-900">{bip.ip_address}</span>
                    <span className="px-2 py-0.2 rounded text-[10px] font-black uppercase bg-red-100 text-red-800">
                      {bip.attempts_blocked} Attempts Blocked
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Reason: {bip.reason}</p>
                  <span className="text-[10px] text-slate-400">Blocked at: {new Date(bip.blocked_at).toLocaleString()}</span>
                </div>

                <button
                  onClick={() => handleUnblockIP(bip.id, bip.ip_address)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Unblock
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: FAILED LOGINS */}
      {activeTab === 'failed_logins' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Suspicious Login Anomalies</h3>
          <p className="text-xs text-slate-500">Failed password attempts detected across student portals</p>

          <div className="divide-y divide-slate-100">
            {PlaceTrackStore.loginRecords.filter(lr => lr.status === 'failed').map((rec) => (
              <div key={rec.id} className="py-3 flex justify-between items-center">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs text-red-700">{rec.email}</span>
                    <span className="font-mono text-[11px] text-slate-500">({rec.ip_address})</span>
                  </div>
                  <p className="text-xs text-slate-400">{rec.device} • {rec.location}</p>
                </div>

                <button
                  onClick={() => {
                    PlaceTrackStore.blockIP(rec.ip_address, 'Failed authentication brute force anomaly');
                    notify(`Blocked IP ${rec.ip_address}`);
                  }}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl"
                >
                  Block IP
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: GDPR COMPLIANCE */}
      {activeTab === 'gdpr' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5 max-w-2xl">
          <div>
            <h3 className="text-base font-bold text-slate-900">GDPR & Data Subject Access Request (DSAR)</h3>
            <p className="text-xs text-slate-500">Export complete candidate data footprint or trigger institutional erasure</p>
          </div>

          <form onSubmit={handleGDPRSearch} className="flex space-x-2">
            <input
              type="text"
              placeholder="Enter Student ID or Email..."
              value={gdprStudentId}
              onChange={(e) => setGdprStudentId(e.target.value)}
              className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              required
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Search Footprint
            </button>
          </form>

          {gdprResult && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{gdprResult.profile.full_name}</h4>
                  <p className="text-[11px] text-slate-500">{gdprResult.profile.email} • {gdprResult.profile.department}</p>
                </div>
                <button
                  onClick={handleGDPRExport}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download JSON Archive</span>
                </button>
              </div>

              <div className="text-[11px] text-slate-600 space-y-1 pt-2 border-t border-slate-200">
                <p>Assessment Attempts: <strong>{gdprResult.attempts.length} records</strong></p>
                <p>Placement Readiness: <strong>{gdprResult.readiness?.overall_score || 0}%</strong></p>
                <p>Audit Events Logged: <strong>{gdprResult.auditTrail.length} records</strong></p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL: BLOCK IP */}
      {showBlockModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-base font-black text-slate-900">Block Suspicious IP</h3>
            <form onSubmit={handleBlockIP} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">IP Address</label>
                <input
                  type="text"
                  placeholder="e.g. 192.168.1.100 or 45.134.22.18"
                  value={blockIp}
                  onChange={(e) => setBlockIp(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Ban Reason</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Excessive automated test submissions detected"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBlockModal(false)}
                  className="flex-1 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-red-600 text-white font-bold rounded-xl shadow-xs"
                >
                  Enforce Ban
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
