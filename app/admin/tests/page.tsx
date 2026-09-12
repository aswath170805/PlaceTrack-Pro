'use client';

import React, { useState, useEffect } from 'react';
import { PlaceTrackStore } from '@/lib/store';
import { Test, TestAttempt } from '@/lib/mockData';
import {
  ClipboardCheck,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  Copy,
  Sliders,
  Send,
  Trash2,
  Edit,
  Play,
  RotateCcw,
  Award,
  AlertTriangle,
  UserCheck,
  Eye
} from 'lucide-react';

type TestTab = 'tests' | 'active_control' | 'score_override' | 'global_settings';

export default function TestAndAssessmentControlPage() {
  const [activeTab, setActiveTab] = useState<TestTab>('tests');
  const [tests, setTests] = useState<Test[]>(PlaceTrackStore.tests);
  const [attempts, setAttempts] = useState<TestAttempt[]>(PlaceTrackStore.testAttempts);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showOverrideModal, setShowOverrideModal] = useState<TestAttempt | null>(null);
  const [overrideScore, setOverrideScore] = useState(80);
  const [overrideReason, setOverrideReason] = useState('');

  // Create form
  const [testForm, setTestForm] = useState({
    title: '',
    type: 'weekly_assessment' as any,
    duration_minutes: 60,
    target_department: 'All Departments',
    target_year: 'All Years',
    is_proctored: true,
  });

  const syncState = () => {
    setTests([...PlaceTrackStore.tests]);
    setAttempts([...PlaceTrackStore.testAttempts]);
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

  const handleCreateTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testForm.title) return;
    const newTest = PlaceTrackStore.createTest(testForm);
    setShowCreateModal(false);
    setTestForm({ title: '', type: 'weekly_assessment', duration_minutes: 60, target_department: 'All Departments', target_year: 'All Years', is_proctored: true });
    notify(`Test "${newTest.title}" published to student portal!`);
  };

  const handleDuplicateTest = (testId: string) => {
    const copy = PlaceTrackStore.duplicateTest(testId);
    if (copy) notify(`Duplicated test: ${copy.title}`);
  };

  const handleForceSubmitAll = (testId: string) => {
    if (confirm('Force submit all currently active test-takers?')) {
      const affected = PlaceTrackStore.forceSubmitTest(testId);
      notify(`Force submitted ${affected} active candidate sessions.`);
    }
  };

  const handleExtendTime = (testId: string, mins: number) => {
    PlaceTrackStore.extendTestTime(testId, mins);
    notify(`Extended assessment duration by +${mins} minutes.`);
  };

  const handleScoreOverrideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showOverrideModal) return;
    PlaceTrackStore.manualScoreOverride(showOverrideModal.id, overrideScore, overrideReason);
    setShowOverrideModal(null);
    setOverrideReason('');
    notify(`Score manually overridden to ${overrideScore} pts with audit justification.`);
  };

  const liveAttempts = attempts.filter(a => a.status === 'in_progress');

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-indigo-100 text-indigo-900 px-3 py-1 rounded-full text-xs font-bold mb-2">
            <ClipboardCheck className="w-3.5 h-3.5" />
            <span>Feature 10: Test & Assessment Control</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Examination Master Control & Scheduling</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Test authoring approvals, emergency force submission, time extension, score overrides & result publishing
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center space-x-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Assessment</span>
        </button>
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
          { id: 'tests', label: 'All Scheduled Tests', icon: ClipboardCheck, count: tests.length },
          { id: 'active_control', label: 'Live Session Control', icon: Play, count: liveAttempts.length },
          { id: 'score_override', label: 'Score Overrides & Re-evaluation', icon: Award, count: attempts.length },
          { id: 'global_settings', label: 'Default Test Parameters', icon: Sliders },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TestTab)}
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

      {/* TAB 1: ALL TESTS */}
      {activeTab === 'tests' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tests.map((t) => (
            <div key={t.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex justify-between items-start">
                  <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-black rounded uppercase">
                    {t.type.replace('_', ' ')}
                  </span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                    t.is_proctored ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {t.is_proctored ? 'AI Proctored ✓' : 'Unproctored'}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm mt-2">{t.title}</h3>
                <p className="text-xs text-slate-500 mt-1">Author: {t.created_by}</p>
                <div className="text-[11px] text-slate-400 mt-2 space-y-0.5">
                  <p>Target: <strong>{t.target_department}</strong> ({t.target_year})</p>
                  <p>Duration: <strong>{t.duration_minutes} minutes</strong> • Question Count: <strong>{t.question_count || 5}</strong></p>
                  <p>Deadline: {new Date(t.end_time).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-2">
                <button
                  onClick={() => handleDuplicateTest(t.id)}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg flex items-center space-x-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Duplicate</span>
                </button>
                <button
                  onClick={() => handleExtendTime(t.id, 15)}
                  className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold rounded-lg flex items-center space-x-1"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>+15 Mins</span>
                </button>
                <button
                  onClick={() => handleForceSubmitAll(t.id)}
                  className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-[11px] font-bold rounded-lg flex items-center space-x-1 ml-auto"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Force Submit All</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: ACTIVE CONTROL */}
      {activeTab === 'active_control' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Live Active Examination Sessions ({liveAttempts.length})</h3>
              <p className="text-xs text-slate-500">Real-time candidate instances currently inside the secure examination browser</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {liveAttempts.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No active candidate attempts in progress right now.
              </div>
            ) : (
              liveAttempts.map((att) => (
                <div key={att.id} className="py-3.5 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                  <div>
                    <span className="font-bold text-xs text-slate-900">{att.student_name}</span>
                    <span className="text-[11px] text-slate-500 block">{att.test_title}</span>
                    <span className="text-[10px] text-slate-400">Started: {new Date(att.started_at).toLocaleTimeString()}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => PlaceTrackStore.forceSubmitTest(att.test_id, att.student_id)}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl"
                    >
                      Emergency Force Submit
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: SCORE OVERRIDES */}
      {activeTab === 'score_override' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Evaluation Records & Score Overrides</h3>
              <p className="text-xs text-slate-500">Override automated grades with mandatory audit justification notes</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {attempts.map((att) => (
              <div key={att.id} className="py-3.5 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs text-slate-900">{att.student_name}</span>
                    <span className="px-2 py-0.2 rounded text-[10px] font-black uppercase bg-slate-100 text-slate-700">
                      {att.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{att.test_title}</p>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <span className="text-sm font-black text-blue-600">{att.score}</span>
                    <span className="text-xs text-slate-400 font-medium"> / {att.max_score || 100} pts</span>
                  </div>

                  <button
                    onClick={() => {
                      setShowOverrideModal(att);
                      setOverrideScore(att.score);
                    }}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center space-x-1"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Override Score</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: GLOBAL SETTINGS */}
      {activeTab === 'global_settings' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs max-w-xl space-y-4 text-xs">
          <h3 className="text-base font-bold text-slate-900">Institutional Test Defaults</h3>
          <div>
            <label className="block text-slate-700 font-bold mb-1">Standard Duration (Minutes)</label>
            <input type="number" defaultValue={60} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Passing Mark Threshold (%)</label>
            <input type="number" defaultValue={60} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
            <div>
              <span className="font-bold text-slate-800 block">Randomize Question Order</span>
              <span className="text-[11px] text-slate-500">Shuffle question pool sequence per student</span>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4 accent-indigo-600" />
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
            <div>
              <span className="font-bold text-slate-800 block">Automatic Score Publishing</span>
              <span className="text-[11px] text-slate-500">Expose score immediately upon submission</span>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4 accent-indigo-600" />
          </div>

          <button
            onClick={() => notify('Default assessment parameters saved!')}
            className="px-4 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-xs"
          >
            Save Parameters
          </button>
        </div>
      )}

      {/* MODAL: CREATE TEST */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-base font-black text-slate-900">Schedule New Assessment</h3>
            <form onSubmit={handleCreateTest} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Test Title</label>
                <input
                  type="text"
                  placeholder="e.g. Cisco Technical Placement Qualifier"
                  value={testForm.title}
                  onChange={(e) => setTestForm({ ...testForm, title: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Assessment Type</label>
                  <select
                    value={testForm.type}
                    onChange={(e) => setTestForm({ ...testForm, type: e.target.value as any })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value="weekly_assessment">Weekly Proctored Mock</option>
                    <option value="daily_practice">Daily Practice</option>
                    <option value="custom">Special Qualifier</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    value={testForm.duration_minutes}
                    onChange={(e) => setTestForm({ ...testForm, duration_minutes: parseInt(e.target.value) || 45 })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Target Department</label>
                  <select
                    value={testForm.target_department}
                    onChange={(e) => setTestForm({ ...testForm, target_department: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value="All Departments">All Departments</option>
                    {PlaceTrackStore.departments.map((d) => (
                      <option key={d.id} value={d.code}>{d.code}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Target Year</label>
                  <select
                    value={testForm.target_year}
                    onChange={(e) => setTestForm({ ...testForm, target_year: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value="All Years">All Years</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <span className="font-bold text-slate-800">Enable AI Proctoring</span>
                <input
                  type="checkbox"
                  checked={testForm.is_proctored}
                  onChange={(e) => setTestForm({ ...testForm, is_proctored: e.target.checked })}
                  className="w-4 h-4 accent-indigo-600"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-indigo-600 text-white font-bold rounded-xl"
                >
                  Schedule Test
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SCORE OVERRIDE */}
      {showOverrideModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-base font-black text-slate-900">Manual Grade Adjustment</h3>
            <form onSubmit={handleScoreOverrideSubmit} className="space-y-3 text-xs">
              <p className="text-slate-600">
                Adjusting score for <strong>{showOverrideModal.student_name}</strong> on <strong>{showOverrideModal.test_title}</strong>.
              </p>

              <div>
                <label className="block text-slate-700 font-bold mb-1">New Score (0 - 100)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={overrideScore}
                  onChange={(e) => setOverrideScore(parseInt(e.target.value) || 0)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-black text-base text-blue-600"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Audit Justification Reason</label>
                <textarea
                  rows={3}
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  placeholder="e.g. Compensated for compiler timeout on test case #3 per HOD memo"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowOverrideModal(null)}
                  className="flex-1 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-blue-600 text-white font-bold rounded-xl"
                >
                  Save Override
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
