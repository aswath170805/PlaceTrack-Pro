'use client';

import React, { useState } from 'react';
import { MOCK_ATTENDANCE, AttendanceRecord } from '@/lib/mockData';
import { CalendarCheck, CheckCircle2, XCircle, Send, Clock, ShieldAlert, Mail, MessageSquare, Bell } from 'lucide-react';

export default function StudentAttendancePage() {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(MOCK_ATTENDANCE);
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);
  const [reasonInput, setReasonInput] = useState<string>('');
  const [successToast, setSuccessToast] = useState<boolean>(false);

  const handleOpenReasonModal = (record: AttendanceRecord) => {
    setSelectedRecord(record);
    setReasonInput(record.absence_reason || '');
  };

  const handleSubmitReason = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;

    setAttendanceRecords((prev) =>
      prev.map((rec) =>
        rec.id === selectedRecord.id
          ? { ...rec, absence_reason: reasonInput, reviewed_by_faculty: false }
          : rec
      )
    );

    setSelectedRecord(null);
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold mb-2">
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Placement Assessment Attendance & Alerts</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">Placement Assessment Attendance History</h1>
          <p className="text-xs text-slate-500">Track assessment attendance, view Email & WhatsApp alerts for missed tests, and submit absence reasons to faculty</p>
        </div>

        {/* Success Toast */}
        {successToast && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-medium flex items-center space-x-2 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Absence reason successfully submitted and forwarded to your assigned Faculty for review!</span>
          </div>
        )}

        {/* Attendance Timeline Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-base font-bold text-slate-900">Assessment Attendance Log</h3>
            <span className="text-xs font-semibold text-slate-500">Total Sessions: {attendanceRecords.length}</span>
          </div>

          <div className="divide-y divide-slate-100">
            {attendanceRecords.map((record) => (
              <div key={record.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    <span className="font-bold text-sm text-slate-900">{record.session_title}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      record.status === 'present' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {record.status}
                    </span>
                  </div>
                  
                  <p className="text-xs text-slate-400">Date: {new Date(record.created_at).toLocaleDateString()}</p>
                  
                  {/* Missed Test Automated Notifications (Email & WhatsApp) */}
                  {record.status === 'absent' && (
                    <div className="flex items-center space-x-2 pt-1 flex-wrap gap-1">
                      <span className="inline-flex items-center text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-md">
                        <Mail className="w-3 h-3 mr-1 text-blue-600" />
                        Email Alert Sent
                      </span>
                      <span className="inline-flex items-center text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md">
                        <MessageSquare className="w-3 h-3 mr-1 text-emerald-600" />
                        WhatsApp Alert Sent
                      </span>
                    </div>
                  )}

                  {record.absence_reason && (
                    <div className="mt-2 p-2.5 bg-slate-100/80 rounded-xl text-xs text-slate-700 space-y-1">
                      <div>
                        <span className="font-bold text-slate-900">Submitted Reason: </span>
                        <span className="italic">{record.absence_reason}</span>
                      </div>
                      <div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          record.reviewed_by_faculty ? 'bg-emerald-200 text-emerald-800' : 'bg-amber-200 text-amber-800'
                        }`}>
                          {record.reviewed_by_faculty ? 'Forwarded & Approved by Faculty' : 'Forwarded to Faculty (Pending Review)'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {record.status === 'absent' && (
                  <button
                    onClick={() => handleOpenReasonModal(record)}
                    className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors shrink-0"
                  >
                    <Send className="w-3.5 h-3.5 mr-1.5" />
                    {record.absence_reason ? 'Edit Reason' : 'Submit Reason to Faculty'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Submit Reason Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form onSubmit={handleSubmitReason} className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center space-x-2 text-amber-600 font-bold text-xs">
              <Bell className="w-4 h-4" />
              <span>Missed Assessment Action Required</span>
            </div>
            
            <h3 className="text-lg font-bold text-slate-900">Submit Absence Reason</h3>
            <p className="text-xs text-slate-500">
              Session: <strong>{selectedRecord.session_title}</strong>
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Detailed Reason for Missing Assessment
              </label>
              <textarea
                required
                rows={4}
                value={reasonInput}
                onChange={(e) => setReasonInput(e.target.value)}
                placeholder="e.g. Attended Inter-College Technical Hackathon Finals with HOD approval..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-md"
              >
                Forward Reason to Faculty
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}

