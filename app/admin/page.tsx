'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { PlaceTrackStore, ExtendedProfile } from '@/lib/store';
import { Test, ProctoringEvent, AuditLog, SupportTicket, SystemConfig } from '@/lib/store';
import { 
  Users, 
  Settings, 
  BookOpen, 
  Activity, 
  BarChart3, 
  ShieldAlert, 
  Lock, 
  Database, 
  Bell, 
  CheckSquare, 
  Trophy, 
  GraduationCap, 
  Key, 
  Headphones, 
  Server,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Play,
  Clock,
  Sparkles,
  Download,
  Flame,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export default function AdminDashboard() {
  const [users, setUsers] = useState<ExtendedProfile[]>(PlaceTrackStore.users);
  const [tests, setTests] = useState<Test[]>(PlaceTrackStore.tests);
  const [attempts, setAttempts] = useState(PlaceTrackStore.testAttempts);
  const [events, setEvents] = useState<ProctoringEvent[]>(PlaceTrackStore.proctoringEvents);
  const [logs, setLogs] = useState<AuditLog[]>(PlaceTrackStore.auditLogs);
  const [tickets, setTickets] = useState<SupportTicket[]>(PlaceTrackStore.supportTickets);
  const [config, setConfig] = useState<SystemConfig>(PlaceTrackStore.systemConfig);

  const syncState = () => {
    setUsers([...PlaceTrackStore.users]);
    setTests([...PlaceTrackStore.tests]);
    setAttempts([...PlaceTrackStore.testAttempts]);
    setEvents([...PlaceTrackStore.proctoringEvents]);
    setLogs([...PlaceTrackStore.auditLogs]);
    setTickets([...PlaceTrackStore.supportTickets]);
    setConfig({ ...PlaceTrackStore.systemConfig });
  };

  useEffect(() => {
    syncState();
    const unsub = PlaceTrackStore.subscribe(syncState);
    return () => unsub();
  }, []);

  const studentsCount = users.filter((p: ExtendedProfile) => p.role === 'student').length;
  const facultyCount = users.filter((p: ExtendedProfile) => p.role === 'faculty').length;
  const adminCount = users.filter((p: ExtendedProfile) => p.role === 'admin').length;
  
  const now = new Date().toISOString();
  const activeTests = tests.filter((t) => t.start_time <= now && t.end_time >= now);
  const openTickets = tickets.filter((t) => t.status === 'open' || t.status === 'in_progress');
  const highSeverityViolations = events.filter((e) => e.severity === 'high');

  // 15 Suites Definition grouped by pillars
  const suitePillars = [
    {
      pillar: 'User & Academy Management',
      color: 'from-blue-600 to-indigo-700',
      suites: [
        {
          id: 'users',
          name: '1. User Management',
          href: '/admin/users',
          desc: 'Create, bulk CSV import, verify accounts, manage departments, student batches, and user login logs.',
          icon: Users,
          stats: `${users.length} Users (${studentsCount} Stud, ${facultyCount} Fac)`,
          badgeColor: 'bg-blue-100 text-blue-800'
        },
        {
          id: 'leaderboard',
          name: '11. Leaderboard & Badging',
          href: '/admin/leaderboard',
          desc: 'Configure public/hidden ranks, custom scoring weights, reset cycles, and award merit badges.',
          icon: Trophy,
          stats: 'Formula: 0.40 Assessment + 0.35 Practice',
          badgeColor: 'bg-amber-100 text-amber-800'
        },
        {
          id: 'progress',
          name: '12. Student Progress & 360',
          href: '/admin/student-progress',
          desc: 'Radar competency analysis, side-by-side student comparison, at-risk interventions, and mentor allocation.',
          icon: GraduationCap,
          stats: 'Radar Competency + Mentor Sync',
          badgeColor: 'bg-emerald-100 text-emerald-800'
        }
      ]
    },
    {
      pillar: 'Assessments & Academic Content',
      color: 'from-indigo-600 to-violet-700',
      suites: [
        {
          id: 'content',
          name: '3. Content Management',
          href: '/admin/content',
          desc: 'Institutional question bank, bulk CSV import, test blueprints, study resources, and campus announcements.',
          icon: BookOpen,
          stats: `${PlaceTrackStore.questions.length} Active Questions`,
          badgeColor: 'bg-violet-100 text-violet-800'
        },
        {
          id: 'tests',
          name: '10. Test & Assessment Control',
          href: '/admin/tests',
          desc: 'Master test scheduling, emergency +15m extensions, instant force submit, and audited score overrides.',
          icon: CheckSquare,
          stats: `${tests.length} Tests (${activeTests.length} Live Active)`,
          badgeColor: 'bg-indigo-100 text-indigo-800'
        }
      ]
    },
    {
      pillar: 'Live Integrity & Proctoring',
      color: 'from-amber-600 to-rose-700',
      suites: [
        {
          id: 'live-monitor',
          name: '4. Live Monitoring Console',
          href: '/admin/live-monitor',
          desc: 'Live webcam grid feeds, real-time violation alerts, tab-switch tracker, and proctoring room stream.',
          icon: Activity,
          stats: `${events.length} Live Proctoring Events`,
          badgeColor: 'bg-rose-100 text-rose-800'
        },
        {
          id: 'proctoring',
          name: '6. Proctoring Management',
          href: '/admin/proctoring',
          desc: 'Violation review, sensitivity thresholds, webcam snapshots evidence, and student dispute appeals.',
          icon: ShieldAlert,
          stats: `${highSeverityViolations.length} High Severity Flags`,
          badgeColor: 'bg-amber-100 text-amber-800'
        },
        {
          id: 'security',
          name: '7. Security & Audit Guard',
          href: '/admin/security',
          desc: 'Immutable audit logs, active session termination, IP whitelist/blacklist, failed logins, and GDPR purge.',
          icon: Lock,
          stats: `${PlaceTrackStore.activeSessions.length} Active Sessions Tracked`,
          badgeColor: 'bg-red-100 text-red-800'
        }
      ]
    },
    {
      pillar: 'Operations, Integrations & DevOps',
      color: 'from-slate-700 to-slate-900',
      suites: [
        {
          id: 'config',
          name: '2. System Configuration',
          href: '/admin/system-config',
          desc: 'College brand customization, SMTP setup, feature toggles, security rules, and maintenance mode lock.',
          icon: Settings,
          stats: config.maintenance_mode ? '⚠️ Maintenance Mode ON' : 'System Active',
          badgeColor: config.maintenance_mode ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-800'
        },
        {
          id: 'reports',
          name: '5. Reports & Analytics',
          href: '/admin/reports',
          desc: 'Placement readiness distribution, department performance benchmarks, and instant CSV/PDF reporting.',
          icon: BarChart3,
          stats: 'Analytics Engine & Export Ready',
          badgeColor: 'bg-teal-100 text-teal-800'
        },
        {
          id: 'database',
          name: '8. Database & State Backup',
          href: '/admin/database',
          desc: 'One-click full JSON backup download, state restore, table row metrics, and transactional cleanup.',
          icon: Database,
          stats: '6 Core System Relational Tables',
          badgeColor: 'bg-cyan-100 text-cyan-800'
        },
        {
          id: 'notifications',
          name: '9. Notifications & Broadcast',
          href: '/admin/notifications',
          desc: 'Broadcast bulk emails, customize placement templates, queue inspection, and automated test reminders.',
          icon: Bell,
          stats: `${PlaceTrackStore.emailLogs.length} Dispatched Messages`,
          badgeColor: 'bg-purple-100 text-purple-800'
        },
        {
          id: 'integrations',
          name: '13. Integrations & API Hub',
          href: '/admin/integrations',
          desc: 'Production API keys, automated webhooks, Google/Azure SSO, Moodle LMS sync, and iCal calendar feeds.',
          icon: Key,
          stats: `${PlaceTrackStore.apiKeys.length} API Keys Configured`,
          badgeColor: 'bg-orange-100 text-orange-800'
        },
        {
          id: 'support',
          name: '14. Support & Helpdesk',
          href: '/admin/support',
          desc: 'Threaded ticket inbox, direct student replies, campus placement FAQ manager, and bug triage tracker.',
          icon: Headphones,
          stats: `${openTickets.length} Open Support Tickets`,
          badgeColor: 'bg-yellow-100 text-yellow-800'
        },
        {
          id: 'system-health',
          name: '15. Telemetry & Maintenance',
          href: '/admin/system-health',
          desc: 'Real-time CPU/RAM/Latency telemetry, 99.98% Uptime SLA, cron background scheduler, and cache purge.',
          icon: Server,
          stats: '99.98% SLA • 24ms Latency',
          badgeColor: 'bg-emerald-100 text-emerald-800'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      
      {/* Maintenance Alert if active */}
      {config.maintenance_mode && (
        <div className="bg-red-600 text-white px-4 py-2.5 text-center text-xs font-bold flex items-center justify-center space-x-2 shadow-sm">
          <AlertTriangle className="w-4 h-4" />
          <span>MAINTENANCE MODE ACTIVE — Student and faculty portals are restricted to read-only access.</span>
          <Link href="/admin/system-config" className="underline ml-2 font-black">Adjust in System Config &rarr;</Link>
        </div>
      )}

      {/* Admin Hero Command Bar */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white pt-8 pb-14 px-4 sm:px-6 lg:px-8 border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>PlaceTrack Pro Master Command Center</span>
              </span>
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>All 15 Feature Suites Active & Interconnected</span>
              </span>
            </div>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl text-white">
              Institutional Administration Hub
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Unified persistent administration engine for Sri Venkateswara College of Engineering. Zero patch data: every configuration, proctoring alert, user permission, and assessment state synchronizes reactively in real time.
            </p>
          </div>

          {/* Rapid Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/admin/live-monitor"
              className="inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-black bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02]"
            >
              <Activity className="w-4 h-4 mr-1.5" />
              Live Monitor
            </Link>
            <Link
              href="/admin/users"
              className="inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all"
            >
              <Users className="w-4 h-4 mr-1.5" />
              Manage Users
            </Link>
            <Link
              href="/admin/database"
              className="inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all"
            >
              <Database className="w-4 h-4 mr-1.5" />
              State Backup
            </Link>
            <Link
              href="/admin/system-health"
              className="inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all"
            >
              <Server className="w-4 h-4 mr-1.5" />
              System Telemetry
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-7 space-y-8">
        
        {/* KPI Summary Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Registered Accounts</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{users.length}</div>
              <span className="text-[11px] text-blue-600 font-semibold">{studentsCount} Students • {facultyCount} Faculty</span>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Assessment Rooms</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{tests.length}</div>
              <span className="text-[11px] text-emerald-600 font-semibold">{activeTests.length} Live In-Progress • {attempts.length} Attempts</span>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckSquare className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Proctoring Events</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{events.length}</div>
              <span className="text-[11px] text-amber-600 font-semibold">{highSeverityViolations.length} High Severity Alerts</span>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <ShieldAlert className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Operational SLA</span>
              <div className="text-2xl font-black text-slate-900 mt-1">99.98%</div>
              <span className="text-[11px] text-purple-600 font-semibold">{openTickets.length} Open Support Tickets</span>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <Server className="w-6 h-6" />
            </div>
          </div>

        </div>

        {/* Live Operational Ticker */}
        {activeTests.length > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
              <div>
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wide">Live Assessment in Session</span>
                <p className="text-sm font-semibold text-slate-800">
                  {activeTests[0].title} — {attempts.filter(a => a.test_id === activeTests[0].id).length} candidates connected.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Link
                href="/admin/live-monitor"
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-sm transition"
              >
                Open Live Webcams
              </Link>
              <Link
                href="/admin/tests"
                className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-bold shadow-sm transition"
              >
                Emergency Extension
              </Link>
            </div>
          </div>
        )}

        {/* 15 Feature Suites Organized by Pillar */}
        <div className="space-y-8">
          {suitePillars.map((pillar, pIdx) => (
            <div key={pIdx} className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h2 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                  <span className="h-2 w-2 rounded-full bg-slate-900"></span>
                  <span>{pillar.pillar}</span>
                </h2>
                <span className="text-xs text-slate-400 font-semibold">{pillar.suites.length} Suites</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {pillar.suites.map((suite) => {
                  const Icon = suite.icon;
                  return (
                    <Link
                      key={suite.id}
                      href={suite.href}
                      className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-amber-400 transition-all duration-200 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="p-2.5 rounded-xl bg-slate-100 group-hover:bg-amber-50 text-slate-700 group-hover:text-amber-600 transition-colors">
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${suite.badgeColor}`}>
                            {suite.stats}
                          </span>
                        </div>

                        <div>
                          <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                            {suite.name}
                          </h3>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                            {suite.desc}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600 group-hover:text-amber-600">
                        <span>Access Suite</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Audit Trail & Quick Actions Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
          
          {/* Real-Time Immutable Audit Stream */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Live Immutable Audit Stream</h3>
                <p className="text-xs text-slate-500">Chronological ledger of security and operational mutations.</p>
              </div>
              <Link href="/admin/security" className="text-xs font-bold text-blue-600 hover:underline">
                View All {logs.length} &rarr;
              </Link>
            </div>

            <div className="space-y-2.5">
              {logs.slice(0, 5).map((log) => (
                <div key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <div className="font-semibold text-slate-800 flex items-center space-x-2">
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-bold">
                        {log.action}
                      </span>
                      <span>Target: <strong className="text-slate-900">{log.target_table}</strong></span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Actor: {log.actor_name || log.actor_id} • {new Date(log.created_at).toLocaleString()}
                    </div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Fast DevOps Trigger */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>DevOps Console</span>
              </div>
              <h3 className="text-base font-bold text-white">Database Snapshot & Purge</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Export an encrypted JSON state dump of the complete unified PlaceTrack Pro store or inspect live cache telemetry.
              </p>
            </div>

            <div className="space-y-2 pt-4">
              <Link
                href="/admin/database"
                className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition shadow-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Download JSON State Backup
              </Link>
              <Link
                href="/admin/system-health"
                className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/10 transition"
              >
                <Server className="w-4 h-4 mr-2" />
                Inspect Cron & Cache
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
