'use client';

import React, { useState, useEffect } from 'react';
import { PlaceTrackStore } from '@/lib/store';
import {
  BarChart3,
  Download,
  Calendar,
  Filter,
  CheckCircle2,
  TrendingUp,
  Award,
  Users,
  Building2,
  FileSpreadsheet,
  Printer,
  FileText
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';

export default function ReportsAndAnalyticsPage() {
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('month');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Department comparative metrics
  const departmentData = [
    { name: 'CSE', avgScore: 84, students: 142, testsTaken: 412, placementReady: 88 },
    { name: 'IT', avgScore: 81, students: 118, testsTaken: 340, placementReady: 82 },
    { name: 'AIDS', avgScore: 86, students: 95, testsTaken: 290, placementReady: 91 },
    { name: 'ECE', avgScore: 78, students: 130, testsTaken: 360, placementReady: 75 },
    { name: 'EEE', avgScore: 74, students: 88, testsTaken: 210, placementReady: 71 },
    { name: 'MECH', avgScore: 72, students: 110, testsTaken: 240, placementReady: 68 },
  ];

  // Domain score distributions
  const domainBreakdown = [
    { name: 'DSA & Algorithms', score: 82, color: '#2563eb' },
    { name: 'Quantitative Aptitude', score: 85, color: '#10b981' },
    { name: 'Logical Reasoning', score: 79, color: '#f59e0b' },
    { name: 'Core CS (OS/DBMS)', score: 76, color: '#6366f1' },
    { name: 'Soft Skills & Interview', score: 80, color: '#ec4899' },
  ];

  // Trend performance over past 6 weeks
  const trendData = [
    { week: 'Week 1', cse: 72, it: 69, aids: 75, ece: 68 },
    { week: 'Week 2', cse: 75, it: 73, aids: 78, ece: 70 },
    { week: 'Week 3', cse: 79, it: 76, aids: 81, ece: 73 },
    { week: 'Week 4', cse: 82, it: 78, aids: 84, ece: 75 },
    { week: 'Week 5', cse: 83, it: 80, aids: 85, ece: 76 },
    { week: 'Week 6', cse: 85, it: 81, aids: 87, ece: 78 },
  ];

  // Score distribution tiers
  const scoreDistribution = [
    { name: 'Tier 1 (90-100%)', value: 85, color: '#10b981' },
    { name: 'Tier 2 (75-89%)', value: 160, color: '#3b82f6' },
    { name: 'Tier 3 (60-74%)', value: 95, color: '#f59e0b' },
    { name: 'Needs Help (<60%)', value: 40, color: '#ef4444' },
  ];

  const handleExportCSV = () => {
    const csvRows = [
      ['Department', 'Average Score %', 'Total Students', 'Tests Attempted', 'Placement Ready %'],
      ...departmentData.map((d) => [d.name, d.avgScore, d.students, d.testsTaken, d.placementReady]),
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `svce_placement_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setStatusMessage('CSV Report downloaded successfully!');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handlePrintReport = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header & Export Controls */}
      <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full text-xs font-bold mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Feature 5: Reports & Analytics (System-Wide)</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">System-Wide Placement Analytics & Intelligence</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Holistic assessment metrics, departmental benchmarks, trend models & custom report generation
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrintReport}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* KPI Headline Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">College-Wide Readiness Index</span>
          <span className="text-3xl font-black text-blue-600 mt-1 block">81.4%</span>
          <span className="text-[11px] text-emerald-600 font-bold flex items-center mt-1">
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            +4.2% from previous cycle
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Assessments Evaluated</span>
          <span className="text-3xl font-black text-slate-900 mt-1 block">1,852</span>
          <span className="text-[11px] text-slate-500 mt-1 block">Across 6 academic disciplines</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Placement Ready Tier 1+2</span>
          <span className="text-3xl font-black text-emerald-600 mt-1 block">245</span>
          <span className="text-[11px] text-slate-500 mt-1 block">64% of batch eligible</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Integrity Compliance Rate</span>
          <span className="text-3xl font-black text-indigo-600 mt-1 block">97.8%</span>
          <span className="text-[11px] text-slate-500 mt-1 block">Only 2.2% proctoring strikes</span>
        </div>
      </div>

      {/* CHARTS ROW 1: DEPARTMENT BENCHMARKS & SCORE TIERS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Department Average Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-slate-900">Department Performance Comparison</h3>
              <p className="text-xs text-slate-500">Average assessment score (%) across engineering branches</p>
            </div>
            <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg">
              2025-26 Even Sem
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', border: 'none', fontSize: '12px' }}
                  formatter={(value: any) => [`${value}%`, 'Average Score']}
                />
                <Bar dataKey="avgScore" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Score Distribution Donut */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Cohort Score Distribution</h3>
            <p className="text-xs text-slate-500">Student count by performance band</p>
          </div>

          <div className="h-56 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={scoreDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {scoreDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs">
            {scoreDistribution.map((tier) => (
              <div key={tier.name} className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tier.color }} />
                  <span className="text-slate-600 font-medium">{tier.name}</span>
                </div>
                <span className="font-bold text-slate-900">{tier.value} candidates</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* CHARTS ROW 2: TREND ANALYSIS OVER 6 WEEKS */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-indigo-600" />
              6-Week Placement Readiness Progression Trend
            </h3>
            <p className="text-xs text-slate-500">Tracking departmental improvement curve across weekly proctored mock assessments</p>
          </div>
        </div>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', border: 'none', fontSize: '12px' }}
              />
              <Legend verticalAlign="top" height={36} />
              <Line type="monotone" dataKey="cse" name="CSE" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="aids" name="AIDS" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="it" name="IT" stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 4" />
              <Line type="monotone" dataKey="ece" name="ECE" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="4 4" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* DETAILED DEPARTMENT BENCHMARKS TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h3 className="text-base font-bold text-slate-900">Department Performance Breakdown</h3>
            <p className="text-xs text-slate-500">Detailed numerical statistics for accreditation and placement compliance</p>
          </div>
          <span className="text-xs font-semibold text-slate-500">Total Enrolled: 675 Students</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Department</th>
                <th className="p-4">Total Students</th>
                <th className="p-4">Tests Taken</th>
                <th className="p-4">Average Score</th>
                <th className="p-4">Placement Ready (%)</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {departmentData.map((d) => (
                <tr key={d.name} className="hover:bg-slate-50/50">
                  <td className="p-4 font-bold text-slate-900 flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    <span>{d.name}</span>
                  </td>
                  <td className="p-4 text-slate-600 font-semibold">{d.students}</td>
                  <td className="p-4 text-slate-600">{d.testsTaken}</td>
                  <td className="p-4 font-bold text-blue-600">{d.avgScore}%</td>
                  <td className="p-4 font-bold text-emerald-600">{d.placementReady}%</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] font-bold">
                      Accredited ✓
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
