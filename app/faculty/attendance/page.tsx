'use client';

import React, { useState, useEffect } from 'react';
import { DatabaseService } from '@/lib/dbService';
import { AttendanceRecord } from '@/lib/mockData';
import { CalendarCheck, CheckCircle2, XCircle, Clock } from 'lucide-react';

export default function FacultyAttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    async function loadAttendance() {
      const data = await DatabaseService.getAttendanceRecords();
      setRecords(data);
    }
    loadAttendance();
  }, []);

  const handleReviewToggle = async (id: string, statusOverride?: 'present' | 'absent') => {
    await DatabaseService.reviewAttendance(id, statusOverride);
    setRecords((prev) =>
      prev.map((rec) =>
        rec.id === id
          ? { 
              ...rec, 
              reviewed_by_faculty: true, 
              status: statusOverride || rec.status 
            }
          : rec
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <div className="inline-flex items-center space-x-2 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold mb-2">
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Faculty Attendance & Leave Desk</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">Student Absence Reason Review</h1>
          <p className="text-xs text-slate-500">Review, excuse, or flag student placement class absences</p>
        </div>

        {/* Absence Review List */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-base font-bold text-slate-900">Absence Claims</h3>
            <span className="text-xs font-semibold text-slate-500">
              Pending: {records.filter((r) => r.status === 'absent' && !r.reviewed_by_faculty).length}
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {records.map((record) => (
              <div key={record.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-slate-900">{record.student_name || 'Alex Johnson'}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                      record.status === 'present' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {record.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">
                    Session: <strong>{record.session_title}</strong> • Date: {new Date(record.created_at).toLocaleDateString()}
                  </p>

                  {record.absence_reason && (
                    <div className="mt-2 p-3 bg-amber-50/80 rounded-xl border border-amber-200/60 text-xs text-amber-900 space-y-1">
                      <p className="font-bold text-amber-950">Student Claim Reason:</p>
                      <p className="italic">{record.absence_reason}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {record.reviewed_by_faculty ? (
                    <span className="inline-flex items-center px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs rounded-xl">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      Approved / Reviewed
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={() => handleReviewToggle(record.id, 'present')}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
                      >
                        Excuse Absence
                      </button>
                      <button
                        onClick={() => handleReviewToggle(record.id, 'absent')}
                        className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                      >
                        Keep Unexcused
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
