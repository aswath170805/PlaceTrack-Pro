'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import { DatabaseService } from '@/lib/dbService';
import { Profile, Test, ProctoringEvent, AuditLog } from '@/lib/mockData';
import { 
  ShieldAlert, 
  Users, 
  FileText, 
  CheckCircle2, 
  Activity 
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [events, setEvents] = useState<ProctoringEvent[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    async function loadAdminData() {
      const p = await DatabaseService.getProfiles();
      const t = await DatabaseService.getTests();
      const pe = await DatabaseService.getProctoringEvents();
      const al = await DatabaseService.getAuditLogs();
      setProfiles(p);
      setTests(t);
      setEvents(pe);
      setLogs(al);
    }
    loadAdminData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      
      {/* Admin Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white pt-8 pb-16 px-4 sm:px-6 lg:px-8 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-amber-500/20 border border-amber-400/30 rounded-full px-3 py-1 text-xs text-amber-200 font-medium mb-3">
              <Activity className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Placement System Control Center</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Administrator Command Center 🛡️
            </h1>
            <p className="mt-2 text-slate-300 max-w-xl text-sm leading-relaxed">
              Centralized real-time proctoring monitoring, user role management, system audit logs, and college-wide placement readiness analytics.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/proctoring"
              className="inline-flex items-center px-4 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all"
            >
              <ShieldAlert className="w-4 h-4 mr-2" />
              Launch Live Proctoring Monitor
            </Link>
            <Link
              href="/admin/users"
              className="inline-flex items-center px-4 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs rounded-xl transition-all"
            >
              <Users className="w-4 h-4 mr-2" />
              Manage Users & Batches
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 space-y-8">
        
        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <Link href="/admin/proctoring" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4 hover:border-amber-500 transition-colors">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="block text-2xl font-black text-slate-900">{events.length}</span>
              <span className="text-xs text-amber-700 font-bold">Proctoring Events Logged</span>
            </div>
          </Link>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-2xl font-black text-slate-900">{profiles.length}</span>
              <span className="text-xs text-slate-500 font-medium">Registered Accounts</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-2xl font-black text-slate-900">{tests.length}</span>
              <span className="text-xs text-slate-500 font-medium">Configured Tests</span>
            </div>
          </div>

          <Link href="/admin/audit-logs" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4 hover:border-blue-500 transition-colors">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-2xl font-black text-slate-900">{logs.length}</span>
              <span className="text-xs text-slate-500 font-medium">System Audit Logs</span>
            </div>
          </Link>

        </div>

        {/* Live Proctoring Realtime Teaser */}
        <div className="bg-slate-950 text-white rounded-3xl p-6 border border-slate-800 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-400">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
              <span>SUPABASE REALTIME PROCTORING AGENT ACTIVE</span>
            </div>
            <h3 className="text-lg font-bold text-white">Live Proctoring Room Stream</h3>
            <p className="text-xs text-slate-400">
              Listening to real-time events across active testing rooms: 2 gaze violations, 1 tab switch detected in last session.
            </p>
          </div>

          <Link
            href="/admin/proctoring"
            className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-lg shrink-0"
          >
            Open Realtime Proctoring Console
          </Link>
        </div>

      </div>
    </div>
  );
}
