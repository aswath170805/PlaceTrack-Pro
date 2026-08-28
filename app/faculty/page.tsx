'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import { DatabaseService } from '@/lib/dbService';
import { Batch, Test, QuestionBank, AttendanceRecord } from '@/lib/mockData';
import { 
  PlusCircle, 
  BookOpen, 
  Users, 
  CalendarCheck, 
  FileCheck2 
} from 'lucide-react';

export default function FacultyDashboard() {
  const { user } = useAuth();

  const [tests, setTests] = useState<Test[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [questionBanks, setQuestionBanks] = useState<QuestionBank[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    async function loadFacultyData() {
      const t = await DatabaseService.getTests();
      const b = await DatabaseService.getBatches();
      const qb = await DatabaseService.getQuestionBanks();
      const att = await DatabaseService.getAttendanceRecords();
      setTests(t);
      setBatches(b);
      setQuestionBanks(qb);
      setAttendance(att);
    }
    loadFacultyData();
  }, []);

  const pendingAbsenceCount = attendance.filter((a) => a.status === 'absent' && !a.reviewed_by_faculty).length;

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      
      {/* Faculty Hero Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-blue-900 text-white pt-8 pb-16 px-4 sm:px-6 lg:px-8 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="inline-block px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-xs font-bold text-indigo-200 mb-3">
              Faculty Command Center
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Welcome, {user?.full_name || 'Faculty Member'} 👩‍🏫
            </h1>
            <p className="mt-2 text-slate-300 max-w-xl text-sm leading-relaxed">
              Curate question banks, schedule proctored mock assessments, monitor batch performance, and review student attendance requests.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/faculty/tests/new"
              className="inline-flex items-center px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Create New Assessment
            </Link>
            <Link
              href="/faculty/question-banks"
              className="inline-flex items-center px-4 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs rounded-xl transition-all"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Manage Question Banks
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 space-y-8">
        
        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-2xl font-black text-slate-900">{tests.length}</span>
              <span className="text-xs text-slate-500 font-medium">Active Assessments</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-2xl font-black text-slate-900">{batches.length}</span>
              <span className="text-xs text-slate-500 font-medium">Assigned Batches</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-2xl font-black text-slate-900">{questionBanks.length}</span>
              <span className="text-xs text-slate-500 font-medium">Question Banks</span>
            </div>
          </div>

          <Link href="/faculty/attendance" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4 hover:border-amber-400 transition-colors">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-2xl font-black text-slate-900">{pendingAbsenceCount}</span>
              <span className="text-xs text-amber-600 font-bold">Pending Absence Reviews</span>
            </div>
          </Link>

        </div>

        {/* Assigned Batches Overview */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-slate-900">Batch Readiness & Performance</h3>
            <span className="text-xs text-slate-500 font-medium">Batch Roster View</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {batches.map((b) => (
              <div key={b.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-slate-900 text-sm">{b.name}</h4>
                  <span className="text-[11px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded">
                    {b.student_count || 45} Students
                  </span>
                </div>
                <div className="space-y-1 text-xs text-slate-500">
                  <p>Average Mock Score: <strong className="text-slate-800">78%</strong></p>
                  <p>Proctoring Violations Logged: <strong className="text-amber-600">2 low severity</strong></p>
                </div>
                <button className="w-full py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl transition-colors">
                  View Batch Analytics
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
