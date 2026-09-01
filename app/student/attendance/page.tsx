'use client';

import React, { useState } from 'react';
import { MOCK_ATTENDANCE, AttendanceRecord } from '@/lib/mockData';
import { CalendarCheck, CheckCircle2, XCircle, Send, Clock, ShieldAlert } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold mb-2">
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Placement Attendance Module</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">Placement Class Attendance History</h1>
          <p className="text-xs text-slate-500">Track your attendance and submit absence reason requests for faculty review</p>
        </div>

        {/* Success Toast */}
        {successToast && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-medium flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Absence reason successfully submitted and routed to Faculty for review!</span>
          </div>
        )}

        {/* Attendance Timeline Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-base font-bold text-slate-900">Placement Sessions Log</h3>
            <span className="text-xs font-semibold text-slate-500">Total Sessions: {attendanceRecords.length}</span>
          </div>

          <div className="divide-y divide-slate-100">
            {attendanceRecords.map((record) => (
              <div key={record.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-slate-900">{record.session_title}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      record.status === 'present' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {record.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Date: {new Date(record.created_at).toLocaleDateString()}</p>
                  
                  {record.absence_reason && (
                    <div className="mt-2 p-2.5 bg-slate-100/80 rounded-xl text-xs text-slate-700">
                      <span className="font-bold text-slate-900">Submitted Reason: </span>
                      <span className="italic">{record.absence_reason}</span>
                      <span className={`ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        record.reviewed_by_faculty ? 'bg-emerald-200 text-emerald-800' : 'bg-amber-200 text-amber-800'
                      }`}>
                        {record.reviewed_by_faculty ? 'Reviewed by Faculty' : 'Pending Faculty Review'}
                      </span>
                    </div>
                  )}
                </div>

                {record.status === 'absent' && (
                  <button
                    onClick={() => handleOpenReasonModal(record)}
                    className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors shrink-0"
                  >
                    <Send className="w-3.5 h-3.5 mr-1.5" />
                    {record.absence_reason ? 'Edit Reason' : 'Submit Reason'}
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
            <h3 className="text-lg font-bold text-slate-900">Submit Absence Reason</h3>
            <p className="text-xs text-slate-500">
              Session: <strong>{selectedRecord.session_title}</strong>
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Detailed Reason for Absence
              </label>
              <textarea
                required
                rows={4}
                value={reasonInput}
                onChange={(e) => setReasonInput(e.target.value)}
                placeholder="e.g. Attended Hackathon Finals / Medical leave with certificate..."
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
                Submit for Faculty Review
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
