'use client';

import React, { useState, useEffect } from 'react';
import { PlaceTrackStore } from '@/lib/store';
import { Test, TestAttempt, ProctoringEvent } from '@/lib/mockData';
import {
  Activity,
  Camera,
  ShieldAlert,
  Users,
  Cpu,
  HardDrive,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Filter,
  Eye,
  XCircle,
  BellRing,
  Volume2,
  Maximize2
} from 'lucide-react';

export default function LiveMonitoringPage() {
  const [tests, setTests] = useState<Test[]>(PlaceTrackStore.tests);
  const [attempts, setAttempts] = useState<TestAttempt[]>(PlaceTrackStore.testAttempts);
  const [events, setEvents] = useState<ProctoringEvent[]>(PlaceTrackStore.proctoringEvents);
  const [selectedSnapshot, setSelectedSnapshot] = useState<ProctoringEvent | null>(null);

  // Simulated live metrics ticker
  const [cpuUsage, setCpuUsage] = useState(24);
  const [memUsage, setMemUsage] = useState(48);
  const [activeSocketCount, setActiveSocketCount] = useState(42);

  // Alerts acknowledgment
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<Set<string>>(new Set());

  useEffect(() => {
    const unsub = PlaceTrackStore.subscribe(() => {
      setTests([...PlaceTrackStore.tests]);
      setAttempts([...PlaceTrackStore.testAttempts]);
      setEvents([...PlaceTrackStore.proctoringEvents]);
    });

    const interval = setInterval(() => {
      // Simulate real-time heartbeat variance
      setCpuUsage(Math.floor(20 + Math.random() * 15));
      setMemUsage(Math.floor(45 + Math.random() * 6));
      setActiveSocketCount(Math.floor(38 + Math.random() * 8));
    }, 3000);

    return () => {
      unsub();
      clearInterval(interval);
    };
  }, []);

  const activeTests = tests.filter((t) => {
    const now = new Date().getTime();
    const start = new Date(t.start_time).getTime();
    const end = new Date(t.end_time).getTime();
    return now >= start && now <= end;
  });

  const liveAttempts = attempts.filter((a) => a.status === 'in_progress');

  const acknowledgeAlert = (id: string) => {
    setAcknowledgedAlerts((prev) => new Set(prev).add(id));
  };

  // Student camera simulation mock streams
  const studentStreams = [
    { id: 'cam-1', name: 'Alex Johnson', roll: '2022-CSE-001', test: 'Weekly Mock Assessment', status: 'Normal', fps: 30, flags: 2, snapshot: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=320&auto=format&fit=crop&q=80' },
    { id: 'cam-2', name: 'Priya Sundaram', roll: '2022-CSE-045', test: 'Weekly Mock Assessment', status: 'Normal', fps: 28, flags: 0, snapshot: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=320&auto=format&fit=crop&q=80' },
    { id: 'cam-3', name: 'Karthik Raja', roll: '2022-AIDS-012', test: 'AI Qualifier 2026', status: 'Warning', fps: 29, flags: 1, snapshot: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=320&auto=format&fit=crop&q=80' },
    { id: 'cam-4', name: 'Divya Krishnan', roll: '2023-ECE-033', test: 'Core ECE VLSI Assessment', status: 'Normal', fps: 30, flags: 0, snapshot: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=320&auto=format&fit=crop&q=80' },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold mb-2">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
            <span>Feature 4: Live Operations Monitoring (Advanced)</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Real-Time Examination War Room</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Synchronous live webcam feeds, real-time violation alerts, candidate heartbeat tracking & server hardware diagnostics
          </p>
        </div>

        {/* Live Status Indicators */}
        <div className="flex items-center space-x-3">
          <div className="px-3.5 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-mono flex items-center space-x-2">
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>{activeSocketCount} Online Takers</span>
          </div>
          <div className="px-3.5 py-1.5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>WebSockets Active</span>
          </div>
        </div>
      </div>

      {/* Hardware Health Gauge Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Server CPU Utilization</span>
            <span className="text-2xl font-black text-slate-900">{cpuUsage}%</span>
            <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">Normal (8 Cores)</span>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <Cpu className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Memory (RAM) Allocated</span>
            <span className="text-2xl font-black text-slate-900">{memUsage}%</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">7.8 GB / 16.0 GB</span>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
            <HardDrive className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Active Tests Running</span>
            <span className="text-2xl font-black text-amber-600">{activeTests.length || 2}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">4 Departments Enrolled</span>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Live Violation Strikes</span>
            <span className="text-2xl font-black text-red-600">{events.length}</span>
            <span className="text-[10px] text-red-600 font-bold block mt-0.5">Requires Supervision</span>
          </div>
          <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
        </div>
      </div>

      {/* LIVE WEBCAM FEEDS & CANDIDATE MONITORING */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center">
              <Camera className="w-4 h-4 mr-2 text-blue-600" />
              Live Candidate Webcam Feeds ({studentStreams.length} Active Feeds)
            </h3>
            <p className="text-xs text-slate-500">Real-time peer video thumbnails analyzed by MediaPipe face mesh & COCO-SSD</p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-400">FPS: 30 • Latency: 18ms</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {studentStreams.map((stream) => (
            <div key={stream.id} className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-lg flex flex-col justify-between">
              {/* Webcam Frame Preview */}
              <div className="aspect-video relative bg-slate-900">
                <img
                  src={stream.snapshot}
                  alt={stream.name}
                  className="w-full h-full object-cover"
                />
                {/* Overlay live pill */}
                <div className="absolute top-2 left-2 flex items-center space-x-1.5 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md text-[10px] font-bold text-white">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span>LIVE</span>
                </div>

                <div className="absolute top-2 right-2 bg-black/60 text-emerald-400 px-1.5 py-0.5 rounded text-[9px] font-mono">
                  {stream.fps} FPS
                </div>

                <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center text-[10px] text-white bg-black/70 px-2 py-1 rounded">
                  <span className="font-bold truncate">{stream.name}</span>
                  <span className={`px-1.5 py-0.2 rounded font-black ${
                    stream.flags > 1 ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
                  }`}>
                    {stream.flags} Flags
                  </span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-3 bg-slate-950 text-slate-300 text-xs space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">{stream.roll}</span>
                  <span className="text-slate-400">{stream.status}</span>
                </div>
                <p className="text-[11px] text-slate-500 truncate">{stream.test}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* REAL-TIME VIOLATION ALERTS TICKER & ACKNOWLEDGMENT */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center">
              <BellRing className="w-4 h-4 mr-2 text-red-600 animate-bounce" />
              Real-Time Security Alerts Stream
            </h3>
            <p className="text-xs text-slate-500">Acknowledge critical incident reports or trigger student intervention</p>
          </div>
          <span className="text-xs font-semibold text-slate-400">{events.length} flagged events</span>
        </div>

        <div className="space-y-3">
          {events.map((ev) => {
            const isAck = acknowledgedAlerts.has(ev.id);
            return (
              <div
                key={ev.id}
                className={`p-4 rounded-2xl border flex flex-col sm:flex-row justify-between sm:items-center gap-3 transition-colors ${
                  isAck ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-red-50/50 border-red-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2.5 rounded-xl ${
                    ev.severity === 'high' ? 'bg-red-600 text-white' : 'bg-amber-500 text-slate-950'
                  }`}>
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-xs text-slate-900">{ev.student_name || 'Alex Johnson'}</span>
                      <span className="text-[10px] text-slate-400">({ev.test_title})</span>
                      <span className="px-2 py-0.2 rounded text-[10px] font-black uppercase bg-red-100 text-red-800">
                        {ev.event_type.replace('_', ' ')}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      Logged at: {new Date(ev.created_at).toLocaleTimeString()} • Severity: {ev.severity.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {ev.snapshot_url && (
                    <button
                      onClick={() => setSelectedSnapshot(ev)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center space-x-1"
                    >
                      <Camera className="w-3.5 h-3.5 mr-1" />
                      <span>Audit Frame</span>
                    </button>
                  )}

                  {!isAck ? (
                    <button
                      onClick={() => acknowledgeAlert(ev.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl"
                    >
                      Acknowledge
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-700 font-bold flex items-center">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      Acknowledged
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SNAPSHOT AUDIT MODAL */}
      {selectedSnapshot && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-slate-950 text-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-800">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base font-bold text-white">Live Proctoring Frame Audit</h3>
                <p className="text-xs text-slate-400">Recorded snapshot of candidate at time of violation</p>
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
              <p>Timestamp: <strong>{new Date(selectedSnapshot.created_at).toLocaleString()}</strong></p>
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
    </div>
  );
}
