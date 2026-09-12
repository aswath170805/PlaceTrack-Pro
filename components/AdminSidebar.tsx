'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PlaceTrackStore } from '@/lib/store';
import {
  LayoutDashboard,
  Users,
  Settings,
  BookOpen,
  Activity,
  BarChart3,
  ShieldAlert,
  Shield,
  Database,
  Mail,
  ClipboardCheck,
  Trophy,
  GraduationCap,
  Cpu,
  LifeBuoy,
  Server,
  ChevronRight,
  Search,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  featureNo: number;
}

const NAV_GROUPS: { title: string; items: NavItem[] }[] = [
  {
    title: 'Core Operations',
    items: [
      { name: 'Admin Dashboard', href: '/admin', icon: LayoutDashboard, featureNo: 4 },
      { name: 'User Management', href: '/admin/users', icon: Users, featureNo: 1 },
      { name: 'Content & Questions', href: '/admin/content', icon: BookOpen, featureNo: 3 },
      { name: 'Test & Assessments', href: '/admin/tests', icon: ClipboardCheck, featureNo: 10 },
    ],
  },
  {
    title: 'Live AI Proctoring',
    items: [
      { name: 'Live Operations Monitor', href: '/admin/live-monitor', icon: Activity, badge: 'Live', featureNo: 4 },
      { name: 'Proctoring & Violations', href: '/admin/proctoring', icon: ShieldAlert, featureNo: 6 },
      { name: 'Student Progress 360', href: '/admin/student-progress', icon: GraduationCap, featureNo: 12 },
    ],
  },
  {
    title: 'Reports & Governance',
    items: [
      { name: 'Reports & Analytics', href: '/admin/reports', icon: BarChart3, featureNo: 5 },
      { name: 'Leaderboard & Badges', href: '/admin/leaderboard', icon: Trophy, featureNo: 11 },
      { name: 'Security & Audit Logs', href: '/admin/security', icon: Shield, featureNo: 7 },
      { name: 'Database & Backups', href: '/admin/database', icon: Database, featureNo: 8 },
    ],
  },
  {
    title: 'System & Communications',
    items: [
      { name: 'Email & Notifications', href: '/admin/notifications', icon: Mail, featureNo: 9 },
      { name: 'API & Integrations', href: '/admin/integrations', icon: Cpu, featureNo: 13 },
      { name: 'Support & Helpdesk', href: '/admin/support', icon: LifeBuoy, featureNo: 14 },
      { name: 'System Configuration', href: '/admin/system-config', icon: Settings, featureNo: 2 },
      { name: 'Server Health & Maintenance', href: '/admin/system-health', icon: Server, featureNo: 15 },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMaintenance, setIsMaintenance] = useState(false);

  useEffect(() => {
    setIsMaintenance(PlaceTrackStore.systemConfig.maintenance_mode);
    const unsubscribe = PlaceTrackStore.subscribe(() => {
      setIsMaintenance(PlaceTrackStore.systemConfig.maintenance_mode);
    });
    return unsubscribe;
  }, []);

  const filteredGroups = NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.href.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((group) => group.items.length > 0);

  return (
    <aside className="w-64 bg-slate-950 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 min-h-[calc(100vh-4rem)]">
      {/* Maintenance Mode Alert Banner */}
      {isMaintenance && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 p-2.5 px-3 flex items-center space-x-2 text-amber-300 text-xs font-bold animate-pulse">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Maintenance Mode Active</span>
        </div>
      )}

      {/* Quick Search in Sidebar */}
      <div className="p-3 border-b border-slate-800/80">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search features (15 suites)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 text-xs text-slate-200 pl-8 pr-3 py-1.5 rounded-xl border border-slate-800 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto p-3 space-y-5 scrollbar-thin scrollbar-thumb-slate-800">
        {filteredGroups.map((group) => (
          <div key={group.title} className="space-y-1">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-500 px-2 py-1">
              {group.title}
            </h4>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                      <span className="truncate">{item.name}</span>
                    </div>

                    <div className="flex items-center space-x-1.5 shrink-0">
                      {item.badge && (
                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase ${
                          isActive ? 'bg-slate-950 text-amber-400' : 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                      <span className="text-[9px] font-mono text-slate-600">#{item.featureNo}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Institutional Info */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 text-[11px] text-slate-500 flex items-center justify-between">
        <div>
          <span className="block font-bold text-slate-400">PlaceTrack Pro v2.4</span>
          <span className="block text-[10px]">SVCE Autonomous ERP</span>
        </div>
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="System Operational" />
      </div>
    </aside>
  );
}
