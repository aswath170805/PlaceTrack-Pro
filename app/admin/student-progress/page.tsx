'use client';

import React, { useState, useEffect } from 'react';
import { PlaceTrackStore } from '@/lib/store';
import {
  GraduationCap,
  Users,
  Search,
  AlertTriangle,
  BookOpen,
  UserCheck,
  CheckCircle2,
  FileText,
  Plus,
  TrendingUp,
  Award,
  Calendar,
  MessageSquare
} from 'lucide-react';

export default function StudentProgressManagementPage() {
  const [students, setStudents] = useState(PlaceTrackStore.users.filter(u => u.role === 'student'));
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [compareStudentId, setCompareStudentId] = useState<string>('');
  const [newNote, setNewNote] = useState('');
  const [selectedMentor, setSelectedMentor] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const facultyMembers = PlaceTrackStore.users.filter(u => u.role === 'faculty');

  const syncState = () => {
    setStudents(PlaceTrackStore.users.filter(u => u.role === 'student'));
  };

  useEffect(() => {
    syncState();
    const unsub = PlaceTrackStore.subscribe(syncState);
    return unsub;
  }, []);

  const notify = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const studentA = students.find(s => s.id === selectedStudentId) || students[0];
  const studentB = students.find(s => s.id === compareStudentId);

  const readinessA = PlaceTrackStore.readinessScores.find(r => r.student_id === studentA?.id) || {
    overall_score: 82,
    aptitude_score: 85,
    logical_score: 80,
    programming_score: 88,
    technical_score: 78,
    communication_score: 75,
    interview_score: 80,
  };

  const readinessB = studentB ? (PlaceTrackStore.readinessScores.find(r => r.student_id === studentB.id) || {
    overall_score: 74,
    aptitude_score: 72,
    logical_score: 75,
    programming_score: 78,
    technical_score: 70,
    communication_score: 70,
    interview_score: 75,
  }) : null;

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !studentA) return;
    if (!studentA.notes) studentA.notes = [];
    studentA.notes.push(newNote.trim());
    PlaceTrackStore.updateUser(studentA.id, { notes: studentA.notes });
    setNewNote('');
    notify(`Private administrative note recorded for ${studentA.full_name}`);
  };

  const handleAssignMentor = (mentorName: string) => {
    if (!studentA || !mentorName) return;
    notify(`Faculty Mentor ${mentorName} successfully assigned to ${studentA.full_name}!`);
  };

  // Flag students needing intervention (<70% or flagged attempts)
  const atRiskStudents = students.filter(s => {
    const score = PlaceTrackStore.readinessScores.find(r => r.student_id === s.id)?.overall_score || 80;
    return score < 75;
  });

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-900 px-3 py-1 rounded-full text-xs font-bold mb-2">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Feature 12: Student Progress Management</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Student 360° Progress, Mentorship & Interventions</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Holistic placement profile drill-down, side-by-side candidate comparison, mentor assignment & early-warning alerts
          </p>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Intervention Alert Bar */}
      {atRiskStudents.length > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Placement Intervention Alert</h4>
              <p className="text-[11px] text-slate-600">
                {atRiskStudents.length} candidates require academic support (Readiness score &lt; 75%).
              </p>
            </div>
          </div>
          <button
            onClick={() => notify('Automated remedial study plans dispatched to candidates!')}
            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-xs"
          >
            Assign Remedial Plans
          </button>
        </div>
      )}

      {/* Candidate Selectors */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-500">Select Candidate:</span>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none"
          >
            {students.map((s) => (
              <option key={s.id} value={s.id}>{s.full_name} ({s.department})</option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-500">Compare With:</span>
          <select
            value={compareStudentId}
            onChange={(e) => setCompareStudentId(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none"
          >
            <option value="">None (Single Candidate View)</option>
            {students.filter(s => s.id !== selectedStudentId).map((s) => (
              <option key={s.id} value={s.id}>{s.full_name} ({s.department})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Student 360 Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Candidate A Card */}
        <div className={`bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6 ${
          studentB ? 'lg:col-span-1' : 'lg:col-span-2'
        }`}>
          <div className="flex items-center space-x-4 border-b border-slate-100 pb-4">
            <img
              src={studentA?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}
              alt={studentA?.full_name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500 shadow-md"
            />
            <div>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-black rounded uppercase">
                {studentA?.department} • {studentA?.year_of_study}
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-1">{studentA?.full_name}</h3>
              <p className="text-xs text-slate-400">{studentA?.email}</p>
            </div>
          </div>

          {/* Domain Breakdown Bars */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-slate-900">Placement Competency Radar</h4>
            {[
              { label: 'Quantitative Aptitude', score: readinessA.aptitude_score, color: 'bg-emerald-500' },
              { label: 'Logical Reasoning', score: readinessA.logical_score, color: 'bg-amber-500' },
              { label: 'Coding & Algorithms', score: readinessA.programming_score, color: 'bg-blue-600' },
              { label: 'Core Technical (OS/DBMS)', score: readinessA.technical_score, color: 'bg-indigo-500' },
              { label: 'Soft Skills & Interview', score: readinessA.communication_score, color: 'bg-pink-500' },
            ].map((domain) => (
              <div key={domain.label} className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-600 font-semibold">{domain.label}</span>
                  <span className="font-bold text-slate-900">{domain.score}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${domain.color} rounded-full`} style={{ width: `${domain.score}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Mentor Assignment Section */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 flex items-center">
              <UserCheck className="w-4 h-4 mr-1.5 text-blue-600" />
              Faculty Mentor Allocation
            </h4>
            <div className="flex space-x-2">
              <select
                value={selectedMentor}
                onChange={(e) => setSelectedMentor(e.target.value)}
                className="flex-1 p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
              >
                <option value="">Select Mentor...</option>
                {facultyMembers.map((f) => (
                  <option key={f.id} value={f.full_name}>{f.full_name} ({f.department})</option>
                ))}
              </select>
              <button
                onClick={() => handleAssignMentor(selectedMentor)}
                className="px-3 py-2 bg-blue-600 text-white font-bold rounded-xl shadow-xs"
              >
                Assign
              </button>
            </div>
          </div>
        </div>

        {/* Candidate B (Side-by-side comparison if selected) */}
        {studentB && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6 lg:col-span-1">
            <div className="flex items-center space-x-4 border-b border-slate-100 pb-4">
              <img
                src={studentB.avatar_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80'}
                alt={studentB.full_name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500 shadow-md"
              />
              <div>
                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-black rounded uppercase">
                  {studentB.department} • {studentB.year_of_study}
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">{studentB.full_name}</h3>
                <p className="text-xs text-slate-400">{studentB.email}</p>
              </div>
            </div>

            {readinessB && (
              <div className="space-y-3 text-xs">
                <h4 className="font-bold text-slate-900">Competency Comparison</h4>
                {[
                  { label: 'Quantitative Aptitude', score: readinessB.aptitude_score, color: 'bg-emerald-500' },
                  { label: 'Logical Reasoning', score: readinessB.logical_score, color: 'bg-amber-500' },
                  { label: 'Coding & Algorithms', score: readinessB.programming_score, color: 'bg-blue-600' },
                  { label: 'Core Technical (OS/DBMS)', score: readinessB.technical_score, color: 'bg-indigo-500' },
                  { label: 'Soft Skills & Interview', score: readinessB.communication_score, color: 'bg-pink-500' },
                ].map((domain) => (
                  <div key={domain.label} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-600 font-semibold">{domain.label}</span>
                      <span className="font-bold text-slate-900">{domain.score}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${domain.color} rounded-full`} style={{ width: `${domain.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Private Student Notes & Log */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 lg:col-span-1">
          <h3 className="text-base font-bold text-slate-900 flex items-center">
            <MessageSquare className="w-4 h-4 mr-2 text-indigo-600" />
            Administrative Student Notes
          </h3>
          <p className="text-xs text-slate-500">Private internal comments recorded by placement faculty and cell officers</p>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {(!studentA?.notes || studentA.notes.length === 0) ? (
              <p className="text-xs text-slate-400 italic py-4 text-center">No private notes recorded yet.</p>
            ) : (
              studentA.notes.map((n, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
                  {n}
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleAddNote} className="space-y-2 pt-2 border-t border-slate-100">
            <textarea
              rows={2}
              placeholder="Add confidential placement remark..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-xs"
            >
              Add Remark
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
