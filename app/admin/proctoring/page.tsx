'use client';

import React, { useState, useEffect } from 'react';
import { PlaceTrackStore, ViolationDispute, BlacklistEntry, WhitelistEntry } from '@/lib/store';
import { ProctoringEvent } from '@/lib/mockData';
import {
  ShieldAlert,
  Camera,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sliders,
  UserX,
  UserCheck,
  Check,
  X,
  Eye,
  FileText,
  Trash2,
  Plus,
  Search,
  ZoomIn
} from 'lucide-react';

type ProctorTab = 'violations' | 'disputes' | 'rules' | 'blacklist' | 'whitelist';

export default function ProctoringManagementPage() {
  const [activeTab, setActiveTab] = useState<ProctorTab>('violations');
  const [events, setEvents] = useState<ProctoringEvent[]>(PlaceTrackStore.proctoringEvents);
  const [disputes, setDisputes] = useState<ViolationDispute[]>(PlaceTrackStore.disputes);
  const [blacklist, setBlacklist] = useState<BlacklistEntry[]>(PlaceTrackStore.blacklist);
  const [whitelist, setWhitelist] = useState<WhitelistEntry[]>(PlaceTrackStore.whitelist);
  const [rules, setRules] = useState(PlaceTrackStore.proctoringRules);

  const [severityFilter, setSeverityFilter] = useState('all');
  const [selectedSnapshot, setSelectedSnapshot] = useState<ProctoringEvent | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Blacklist modal
  const [showAddBlacklist, setShowAddBlacklist] = useState(false);
  const [blUserId, setBlUserId] = useState('');
  const [blReason, setBlReason] = useState('');

  // Whitelist modal
  const [showAddWhitelist, setShowAddWhitelist] = useState(false);
  const [wlUserId, setWlUserId] = useState('');
  const [wlReason, setWlReason] = useState('');

  const syncState = () => {
    setEvents([...PlaceTrackStore.proctoringEvents]);
    setDisputes([...PlaceTrackStore.disputes]);
    setBlacklist([...PlaceTrackStore.blacklist]);
    setWhitelist([...PlaceTrackStore.whitelist]);
    setRules({ ...PlaceTrackStore.proctoringRules });
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

  const handleResolveDispute = (id: string, status: 'approved' | 'rejected') => {
    const reason = status === 'approved' ? 'Administrator audited evidence: False positive verified.' : 'Violation confirmed by manual inspection.';
    PlaceTrackStore.resolveDispute(id, status, reason);
    notify(`Dispute #${id} marked as ${status.toUpperCase()}!`);
  };

  const handleAddBlacklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blUserId || !blReason) return;
    PlaceTrackStore.addToBlacklist(blUserId, blReason);
    setShowAddBlacklist(false);
    setBlUserId('');
    setBlReason('');
    notify('Candidate added to placement proctoring blacklist.');
  };

  const handleRemoveBlacklist = (id: string) => {
    PlaceTrackStore.removeFromBlacklist(id);
    notify('User removed from blacklist.');
  };

  const handleAddWhitelist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wlUserId || !wlReason) return;
    PlaceTrackStore.addToWhitelist(wlUserId, wlReason);
    setShowAddWhitelist(false);
    setWlUserId('');
    setWlReason('');
    notify('Student granted proctoring accommodation whitelist exception.');
  };

  const handleRemoveWhitelist = (id: string) => {
    PlaceTrackStore.removeFromWhitelist(id);
    notify('User removed from whitelist.');
  };

  const handleSaveRules = (e: React.FormEvent) => {
    e.preventDefault();
    PlaceTrackStore.updateProctoringRules(rules);
    notify('Proctoring rules configuration saved and active!');
  };

  const filteredEvents = events.filter((e) => {
    if (severityFilter === 'all') return true;
    return e.severity === severityFilter;
  });

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-xs font-bold mb-2">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
            <span>Feature 6: Proctoring Management</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">AI Proctoring Governance & Dispute Review</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit incident evidence, configure sensitivity thresholds, manage student appeals & administer blacklists
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
          { id: 'violations', label: 'Flagged Violations Queue', icon: ShieldAlert, count: events.length },
          { id: 'disputes', label: 'Student Disputes & Appeals', icon: FileText, count: disputes.filter(d => d.status === 'pending').length },
          { id: 'rules', label: 'Rules & Thresholds', icon: Sliders },
          { id: 'blacklist', label: 'Blacklist Management', icon: UserX, count: blacklist.length },
          { id: 'whitelist', label: 'Whitelist Accommodations', icon: UserCheck, count: whitelist.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ProctorTab)}
              className={`flex items-center px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
                isActive
                  ? 'border-amber-500 text-amber-900 bg-amber-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5 mr-1.5" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                  isActive ? 'bg-amber-500 text-slate-950' : 'bg-slate-200 text-slate-700'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: VIOLATIONS QUEUE */}
      {activeTab === 'violations' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900">Incident Review Queue ({filteredEvents.length})</h3>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-500 font-semibold">Filter Severity:</span>
              {['all', 'high', 'medium', 'low'].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSeverityFilter(sev)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg capitalize ${
                    severityFilter === sev
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredEvents.map((ev) => (
              <div
                key={ev.id}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4"
              >
                <div className="flex items-center space-x-3.5">
                  <div className={`p-2.5 rounded-xl ${
                    ev.severity === 'high' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    <AlertTriangle className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-xs">{ev.student_name || 'Candidate'}</span>
                      <span className="text-[11px] text-slate-400">({ev.test_title})</span>
                      <span className="px-2 py-0.2 rounded text-[10px] font-black uppercase bg-slate-900 text-white">
                        {ev.event_type.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3 text-[11px] text-slate-500 mt-1">
                      <span>Time: {new Date(ev.created_at).toLocaleTimeString()}</span>
                      <span>Severity: <strong className="uppercase">{ev.severity}</strong></span>
                      <span>Confidence: <strong>95%</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {ev.snapshot_url && (
                    <button
                      onClick={() => setSelectedSnapshot(ev)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center space-x-1"
                    >
                      <Camera className="w-3.5 h-3.5 mr-1" />
                      <span>Inspect Frame</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: DISPUTES & APPEALS WORKFLOW */}
      {activeTab === 'disputes' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Student Appeals & False Positive Review</h3>
              <p className="text-xs text-slate-500">Audit student explanations and reinstate penalized test attempts</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {disputes.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No appeals filed by students.
              </div>
            ) : (
              disputes.map((d) => (
                <div key={d.id} className="py-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-slate-900 text-xs">{d.student_name}</span>
                      <span className="text-[11px] text-slate-500 block">Test: {d.test_title} • Strike: {d.violation_type}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      d.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : d.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {d.status}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 italic">
                    "{d.student_comment}"
                  </div>

                  {d.status === 'pending' && (
                    <div className="flex space-x-2 pt-2">
                      <button
                        onClick={() => handleResolveDispute(d.id, 'approved')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center space-x-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept Appeal & Restore Score</span>
                      </button>
                      <button
                        onClick={() => handleResolveDispute(d.id, 'rejected')}
                        className="px-3 py-1.5 bg-slate-200 hover:bg-red-100 hover:text-red-700 text-slate-700 font-bold text-xs rounded-xl flex items-center space-x-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject Appeal</span>
                      </button>
                    </div>
                  )}

                  {d.admin_decision_reason && (
                    <p className="text-[11px] text-slate-500 font-medium">
                      Admin Decision Note: <em>{d.admin_decision_reason}</em>
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: RULES CONFIGURATION */}
      {activeTab === 'rules' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs max-w-2xl space-y-5">
          <h3 className="text-base font-bold text-slate-900">AI Proctoring Sensitivity & Threshold Rules</h3>
          <form onSubmit={handleSaveRules} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Max Strike Limit Before Auto-Termination</label>
              <input
                type="number"
                min={1}
                max={10}
                value={rules.max_strikes_before_termination}
                onChange={(e) => setRules({ ...rules, max_strikes_before_termination: parseInt(e.target.value) || 3 })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-amber-700"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-900 block">Fullscreen Mode Enforcement</span>
                <span className="text-[11px] text-slate-500">Exiting fullscreen flags an immediate strike</span>
              </div>
              <input
                type="checkbox"
                checked={rules.fullscreen_enforcement}
                onChange={(e) => setRules({ ...rules, fullscreen_enforcement: e.target.checked })}
                className="w-4 h-4 accent-blue-600"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-900 block">Tab Switch Auto-Flag</span>
                <span className="text-[11px] text-slate-500">Loss of browser window focus records an incident</span>
              </div>
              <input
                type="checkbox"
                checked={rules.tab_switch_auto_flag}
                onChange={(e) => setRules({ ...rules, tab_switch_auto_flag: e.target.checked })}
                className="w-4 h-4 accent-blue-600"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-900 block">Clipboard Protection</span>
                <span className="text-[11px] text-slate-500">Block copy, cut, and paste shortcuts in code editor</span>
              </div>
              <input
                type="checkbox"
                checked={rules.block_clipboard}
                onChange={(e) => setRules({ ...rules, block_clipboard: e.target.checked })}
                className="w-4 h-4 accent-blue-600"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs shadow-xs"
            >
              Update Proctoring Rules
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: BLACKLIST */}
      {activeTab === 'blacklist' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900">Blacklisted Candidates ({blacklist.length})</h3>
            <button
              onClick={() => setShowAddBlacklist(true)}
              className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Candidate to Blacklist</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
            {blacklist.map((b) => (
              <div key={b.id} className="p-4 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">{b.user_name}</h4>
                  <p className="text-[11px] text-slate-500">{b.email} • Added: {new Date(b.added_at).toLocaleDateString()}</p>
                  <p className="text-xs text-red-600 font-semibold mt-1">Reason: {b.reason}</p>
                </div>

                <button
                  onClick={() => handleRemoveBlacklist(b.id)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Remove Ban
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: WHITELIST */}
      {activeTab === 'whitelist' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900">Proctoring Accommodation Whitelist ({whitelist.length})</h3>
            <button
              onClick={() => setShowAddWhitelist(true)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Grant Accommodation</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
            {whitelist.map((w) => (
              <div key={w.id} className="p-4 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">{w.user_name}</h4>
                  <p className="text-[11px] text-slate-500">{w.email} • Granted by: {w.granted_by}</p>
                  <p className="text-xs text-blue-600 font-semibold mt-1">Permitted Exemption: {w.reason}</p>
                </div>

                <button
                  onClick={() => handleRemoveWhitelist(w.id)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Revoke
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SNAPSHOT AUDIT MODAL */}
      {selectedSnapshot && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-slate-950 text-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-800">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base font-bold text-white">Proctoring Snapshot Audit</h3>
                <p className="text-xs text-slate-400">Captured at {new Date(selectedSnapshot.created_at).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelectedSnapshot(null)} className="text-slate-400 hover:text-white font-bold">
                ✕
              </button>
            </div>

            <div className="aspect-video bg-black rounded-2xl overflow-hidden relative">
              <img
                src={selectedSnapshot.snapshot_url}
                alt="Audit Snapshot"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 bg-red-600 text-white font-black text-[10px] px-2 py-0.5 rounded">
                FLAG: {selectedSnapshot.event_type.toUpperCase().replace('_', ' ')}
              </div>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl text-xs space-y-1 text-slate-300">
              <p>Candidate: <strong className="text-white">{selectedSnapshot.student_name || 'Alex Johnson'}</strong></p>
              <p>Assessment: <strong>{selectedSnapshot.test_title}</strong></p>
            </div>

            <button
              onClick={() => setSelectedSnapshot(null)}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs"
            >
              Close Frame Audit
            </button>
          </div>
        </div>
      )}

      {/* MODAL: ADD BLACKLIST */}
      {showAddBlacklist && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-base font-black text-slate-900">Blacklist Student</h3>
            <form onSubmit={handleAddBlacklist} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Select Student</label>
                <select
                  value={blUserId}
                  onChange={(e) => setBlUserId(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  required
                >
                  <option value="">Select Candidate...</option>
                  {PlaceTrackStore.users.filter(u => u.role === 'student').map((u) => (
                    <option key={u.id} value={u.id}>{u.full_name} ({u.department})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Reason for Ban</label>
                <textarea
                  rows={3}
                  value={blReason}
                  onChange={(e) => setBlReason(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="e.g. Discovered using secondary phone for WhatsApp answers"
                  required
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddBlacklist(false)}
                  className="flex-1 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-red-600 text-white font-bold rounded-xl"
                >
                  Confirm Ban
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD WHITELIST */}
      {showAddWhitelist && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-base font-black text-slate-900">Grant Proctoring Accommodation</h3>
            <form onSubmit={handleAddWhitelist} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Select Student</label>
                <select
                  value={wlUserId}
                  onChange={(e) => setWlUserId(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  required
                >
                  <option value="">Select Candidate...</option>
                  {PlaceTrackStore.users.filter(u => u.role === 'student').map((u) => (
                    <option key={u.id} value={u.id}>{u.full_name} ({u.department})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Accommodation Details</label>
                <textarea
                  rows={3}
                  value={wlReason}
                  onChange={(e) => setWlReason(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="e.g. Eyeglasses glare accommodation; head tilt authorized"
                  required
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddWhitelist(false)}
                  className="flex-1 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-blue-600 text-white font-bold rounded-xl"
                >
                  Authorize Exemption
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
