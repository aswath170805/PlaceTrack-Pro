'use client';

import React, { useState, useEffect } from 'react';
import { 
  MOCK_PROCTORING_EVENTS, 
  ProctoringEvent 
} from '@/lib/mockData';
import { 
  ShieldAlert, 
  Eye, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Camera,
  Activity,
  UserCheck
} from 'lucide-react';

export default function LiveProctoringDashboard() {
  const [events, setEvents] = useState<ProctoringEvent[]>(MOCK_PROCTORING_EVENTS);
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [selectedSnapshot, setSelectedSnapshot] = useState<ProctoringEvent | null>(null);

  // Simulated Supabase Realtime event feed
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time proctoring event arriving from active student webcam
      if (Math.random() > 0.6) {
        const types: ProctoringEvent['event_type'][] = ['gaze_away', 'tab_switch', 'multiple_faces', 'phone_detected'];
        const severities: ProctoringEvent['severity'][] = ['low', 'medium', 'high'];

        const randomType = types[Math.floor(Math.random() * types.length)];
        const randomSev = randomType === 'phone_detected' || randomType === 'multiple_faces' ? 'high' : severities[Math.floor(Math.random() * severities.length)];

        const newRealtimeEvent: ProctoringEvent = {
          id: 'pe-rt-' + Math.random().toString(36).substring(2, 7),
          attempt_id: 'att-2',
          student_name: Math.random() > 0.5 ? 'Alex Johnson' : 'Jordan Smith',
          test_title: 'Weekly Proctored Mock Assessment',
          event_type: randomType,
          severity: randomSev,
          snapshot_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&auto=format&fit=crop&q=60',
          created_at: new Date().toISOString(),
        };

        setEvents((prev) => [newRealtimeEvent, ...prev]);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const filteredEvents = events.filter((e) => {
    if (severityFilter === 'all') return true;
    return e.severity === severityFilter;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Realtime Status Bar Header */}
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Supabase Realtime Feed Active</span>
            </div>
            <h1 className="text-2xl font-black text-white">Live AI Proctoring Operations Console</h1>
            <p className="text-xs text-slate-400">Monitoring 2 active assessment sessions • Client-side AI event stream</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
            <Filter className="w-4 h-4 text-slate-500 mx-2" />
            {['all', 'high', 'medium', 'low'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl capitalize transition-all ${
                  severityFilter === sev ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {/* Live Proctoring Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Active Students Cards */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Test Takers</h3>
            
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-white text-sm">Alex Johnson</h4>
                  <p className="text-[10px] text-slate-400">CS-2026 Batch A</p>
                </div>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold rounded">
                  Testing
                </span>
              </div>
              <div className="text-xs text-slate-400 flex justify-between">
                <span>Total Flags:</span>
                <span className="font-bold text-amber-400">{events.length}</span>
              </div>
            </div>
          </div>

          {/* Realtime Event Stream Table */}
          <div className="lg:col-span-2 bg-slate-950 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center">
                <Activity className="w-4 h-4 mr-2 text-amber-400 animate-pulse" />
                Live Incident Stream
              </h3>
              <span className="text-xs text-slate-500">{filteredEvents.length} events logged</span>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {filteredEvents.map((ev) => (
                <div 
                  key={ev.id} 
                  className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-all gap-4"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2.5 rounded-xl ${
                      ev.severity === 'high' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      <AlertTriangle className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white text-xs">{ev.student_name || 'Alex Johnson'}</span>
                        <span className="text-[10px] font-mono text-slate-400">({ev.test_title})</span>
                      </div>
                      <p className="text-xs font-semibold text-amber-300 uppercase tracking-wider mt-0.5">
                        {ev.event_type.replace('_', ' ')}
                      </p>
                      <p className="text-[10px] text-slate-500">{new Date(ev.created_at).toLocaleTimeString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {ev.snapshot_url && (
                      <button
                        onClick={() => setSelectedSnapshot(ev)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center transition-colors"
                      >
                        <Camera className="w-3.5 h-3.5 mr-1 text-amber-400" />
                        Audit Frame
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Snapshot Audit Modal / Drawer */}
      {selectedSnapshot && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base font-bold text-white">Webcam Frame Snapshot Audit</h3>
                <p className="text-xs text-slate-400">Captured at {new Date(selectedSnapshot.created_at).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelectedSnapshot(null)} className="text-slate-400 hover:text-white font-bold">
                ✕
              </button>
            </div>

            <div className="aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 relative">
              <img 
                src={selectedSnapshot.snapshot_url} 
                alt="Proctor Snapshot Audit" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-red-600/90 text-white font-bold text-[10px] px-2 py-1 rounded">
                FLAG: {selectedSnapshot.event_type.toUpperCase().replace('_', ' ')}
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300">
              <p>Student: <strong>{selectedSnapshot.student_name}</strong></p>
              <p>Severity Level: <strong className="text-red-400 uppercase">{selectedSnapshot.severity}</strong></p>
            </div>

            <button
              onClick={() => setSelectedSnapshot(null)}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg"
            >
              Close Snapshot Review
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
