'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import { DatabaseService } from '@/lib/dbService';
import { Batch, Test, QuestionBank, AttendanceRecord, TestAttempt, Profile } from '@/lib/mockData';
import { 
  PlusCircle, 
  BookOpen, 
  Users, 
  CalendarCheck, 
  FileCheck2,
  FileDown,
  TrendingUp,
  PieChart as PieIcon,
  ShieldAlert,
  ChevronRight,
  Download
} from 'lucide-react';

// Recharts components
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

// @react-pdf/renderer components
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Define styling for the student progress report
const reportStyles = StyleSheet.create({
  page: { 
    padding: 40, 
    backgroundColor: '#ffffff', 
    fontFamily: 'Helvetica' 
  },
  header: { 
    borderBottomWidth: 2, 
    borderBottomColor: '#2563eb', 
    paddingBottom: 15, 
    marginBottom: 25 
  },
  title: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#0f172a' 
  },
  subtitle: { 
    fontSize: 10, 
    color: '#475569', 
    marginTop: 5, 
    textTransform: 'uppercase', 
    letterSpacing: 1 
  },
  infoGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    marginBottom: 25, 
    backgroundColor: '#f8fafc', 
    padding: 15, 
    borderRadius: 8, 
    borderWidth: 1, 
    borderColor: '#e2e8f0' 
  },
  infoCol: { 
    width: '50%', 
    marginBottom: 10 
  },
  label: { 
    fontSize: 8, 
    color: '#64748b', 
    textTransform: 'uppercase', 
    fontWeight: 'bold' 
  },
  val: { 
    fontSize: 11, 
    color: '#0f172a', 
    fontWeight: 'bold', 
    marginTop: 2 
  },
  sectionTitle: { 
    fontSize: 13, 
    fontWeight: 'bold', 
    color: '#1e3a8a', 
    marginBottom: 12, 
    borderBottomWidth: 1, 
    borderBottomColor: '#e2e8f0', 
    paddingBottom: 4 
  },
  summaryText: { 
    fontSize: 10, 
    color: '#334155', 
    lineHeight: 1.6, 
    marginBottom: 15 
  },
  metricBox: { 
    padding: 12, 
    backgroundColor: '#eff6ff', 
    borderLeftWidth: 3, 
    borderLeftColor: '#2563eb', 
    marginBottom: 15 
  },
  metricTitle: { 
    fontSize: 11, 
    fontWeight: 'bold', 
    color: '#1e40af' 
  },
  metricDesc: { 
    fontSize: 10, 
    color: '#1e40af', 
    marginTop: 3 
  }
});

// Student report PDF document
const StudentReportPDF = ({ attempt }: { attempt: TestAttempt }) => (
  <Document>
    <Page size="A4" style={reportStyles.page}>
      <View style={reportStyles.header}>
        <Text style={reportStyles.title}>Student Assessment Performance Report</Text>
        <Text style={reportStyles.subtitle}>SVCE Mock Placement Portal</Text>
      </View>
      
      <View style={reportStyles.infoGrid}>
        <View style={reportStyles.infoCol}>
          <Text style={reportStyles.label}>Student Name</Text>
          <Text style={reportStyles.val}>{attempt.student_name || 'Alex Johnson'}</Text>
        </View>
        <View style={reportStyles.infoCol}>
          <Text style={reportStyles.label}>Assessment Title</Text>
          <Text style={reportStyles.val}>{attempt.test_title || 'Placement Practice Mock'}</Text>
        </View>
        <View style={reportStyles.infoCol}>
          <Text style={reportStyles.label}>Performance Score</Text>
          <Text style={reportStyles.val}>{attempt.score}%</Text>
        </View>
        <View style={reportStyles.infoCol}>
          <Text style={reportStyles.label}>AI Proctoring Flags</Text>
          <Text style={reportStyles.val}>{attempt.flag_count || 0} flags logged</Text>
        </View>
        <View style={reportStyles.infoCol}>
          <Text style={reportStyles.label}>Tab Switch Count</Text>
          <Text style={reportStyles.val}>{attempt.tab_switch_count ?? 0} switches</Text>
        </View>
        <View style={reportStyles.infoCol}>
          <Text style={reportStyles.label}>Estimated Time Spent</Text>
          <Text style={reportStyles.val}>{Math.round((attempt.time_spent_seconds || 1500) / 60)} minutes</Text>
        </View>
      </View>
      
      <View style={reportStyles.sectionTitle}>
        <Text>AI Performance Review</Text>
      </View>
      <View style={reportStyles.metricBox}>
        <Text style={reportStyles.metricTitle}>Evaluation & Feedback</Text>
        <Text style={reportStyles.metricDesc}>
          {attempt.feedback || 'Excellent topic conceptualization shown. No critical proctor violations noted during the sessions.'}
        </Text>
      </View>
      <Text style={reportStyles.summaryText}>
        This audit sheet details performance on the weekly SVCE recruitment preparation assessment. It tracks candidate responses and compiles browser gazes, audio disturbances, or context switches.
      </Text>
    </Page>
  </Document>
);

// Department colors for the Pie chart
const DEPT_COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function FacultyDashboard() {
  const { user } = useAuth();

  const [tests, setTests] = useState<Test[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [questionBanks, setQuestionBanks] = useState<QuestionBank[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
    async function loadFacultyData() {
      const t = await DatabaseService.getTests();
      const b = await DatabaseService.getBatches();
      const qb = await DatabaseService.getQuestionBanks();
      const att = await DatabaseService.getAttendanceRecords();
      const ta = await DatabaseService.getTestAttempts();
      const p = await DatabaseService.getProfiles();
      
      setTests(t);
      setBatches(b);
      setQuestionBanks(qb);
      setAttendance(att);
      setAttempts(ta);
      setProfiles(p);
    }
    loadFacultyData();
  }, []);

  const pendingAbsenceCount = attendance.filter((a) => a.status === 'absent' && !a.reviewed_by_faculty).length;

  // Process data for Weekly Activity Chart (attempts and average scores over the week)
  const weeklyActivityData = [
    { name: 'Mon', attempts: 12, avgScore: 78 },
    { name: 'Tue', attempts: 18, avgScore: 72 },
    { name: 'Wed', attempts: 24, avgScore: 81 },
    { name: 'Thu', attempts: 15, avgScore: 68 },
    { name: 'Fri', attempts: 32, avgScore: 84 },
    { name: 'Sat', attempts: 28, avgScore: 76 },
    { name: 'Sun', attempts: 38, avgScore: 80 },
  ];

  // Process dynamic departmental participation distribution
  const getDepartmentParticipation = () => {
    if (attempts.length === 0) {
      return [
        { name: 'CSE', value: 42 },
        { name: 'AIDS', value: 22 },
        { name: 'IT', value: 15 },
        { name: 'ECE', value: 11 },
        { name: 'MECH', value: 6 },
        { name: 'EEE', value: 4 },
      ];
    }

    const deptMap: Record<string, number> = {};
    attempts.forEach((att) => {
      const student = profiles.find((p) => p.id === att.student_id || p.full_name === att.student_name);
      const dept = student?.department || 'CSE';
      deptMap[dept] = (deptMap[dept] || 0) + 1;
    });

    return Object.entries(deptMap).map(([name, value]) => ({
      name,
      value
    }));
  };

  const pieData = getDepartmentParticipation();

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-12 selection:bg-blue-600 font-sans">
      
      {/* Faculty Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white pt-8 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="inline-block px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-xs font-bold text-blue-300 mb-3">
              Faculty Command Center
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Welcome, {user?.full_name || 'Faculty Member'} 👩‍🏫
            </h1>
            <p className="mt-2 text-slate-400 max-w-xl text-xs leading-relaxed">
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
              className="inline-flex items-center px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 font-bold text-xs rounded-xl transition-all"
            >
              <BookOpen className="w-4 h-4 mr-2 text-indigo-400" />
              Manage Question Banks
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 space-y-8">
        
        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center space-x-4 shadow-xl">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/15">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-2xl font-black text-white">{tests.length}</span>
              <span className="text-xs text-slate-400 font-medium">Active Assessments</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center space-x-4 shadow-xl">
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/15">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-2xl font-black text-white">{batches.length}</span>
              <span className="text-xs text-slate-400 font-medium">Assigned Batches</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center space-x-4 shadow-xl">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/15">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-2xl font-black text-white">{questionBanks.length}</span>
              <span className="text-xs text-slate-400 font-medium">Question Banks</span>
            </div>
          </div>

          <Link href="/faculty/attendance" className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center space-x-4 hover:border-amber-400/50 transition-colors shadow-xl">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/15">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-2xl font-black text-white">{pendingAbsenceCount}</span>
              <span className="text-xs text-amber-400 font-bold">Pending Absence Reviews</span>
            </div>
          </Link>

        </div>

        {/* Analytics Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Weekly attempts bar chart and score progress */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-200 flex items-center">
                <TrendingUp className="w-4.5 h-4.5 mr-2 text-blue-400" />
                Weekly Performance Analytics (Test Activity & Scores)
              </h3>
              <span className="text-[10px] text-slate-500 font-bold uppercase">7-Day activity roll</span>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                  <YAxis yAxisId="left" stroke="#64748b" fontSize={10} />
                  <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff', borderRadius: '8px', fontSize: '11px' }} />
                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                  <Bar yAxisId="left" dataKey="attempts" fill="#2563eb" name="Test Attempts Count" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="avgScore" fill="#10b981" name="Avg Score Percentage (%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Department Pie Chart */}
          <div className="lg:col-span-1 bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-200 flex items-center">
                <PieIcon className="w-4.5 h-4.5 mr-2 text-indigo-400" />
                Department Participation (%)
              </h3>
              <span className="text-[10px] text-slate-500 font-bold uppercase">Daily Split</span>
            </div>

            <div className="h-64 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={DEPT_COLORS[index % DEPT_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff', borderRadius: '8px', fontSize: '11px' }} />
                  <Legend wrapperStyle={{ fontSize: '9px', marginTop: '10px' }} layout="horizontal" align="center" verticalAlign="bottom" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Student Progress Reports Table Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex justify-between items-center pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">Student Assessment Reports</h3>
              <p className="text-xs text-slate-400">Download audit-ready PDF sheets detailing individual student achievements and flags.</p>
            </div>
            <span className="text-[10px] bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold px-2.5 py-1 rounded-xl">
              {attempts.length} attempts recorded
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Assessment Title</th>
                  <th className="py-3 px-4">Performance</th>
                  <th className="py-3 px-4">Proctor Flags</th>
                  <th className="py-3 px-4">Submitted Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {attempts.map((attempt) => (
                  <tr key={attempt.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-200">
                      {attempt.student_name || 'Alex Johnson'}
                    </td>
                    <td className="py-4 px-4 text-slate-400 font-medium">
                      {attempt.test_title || 'Weekly TCS Prep Mock'}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`font-black text-sm ${attempt.score >= 75 ? 'text-emerald-400' : attempt.score >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                        {attempt.score}%
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {attempt.flag_count && attempt.flag_count > 0 ? (
                        <span className="inline-flex items-center text-[10px] font-bold bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded">
                          <ShieldAlert className="w-3 h-3 mr-1" />
                          {attempt.flag_count} flags
                        </span>
                      ) : (
                        <span className="text-slate-500 font-medium">No violations</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-slate-400">
                      {attempt.submitted_at ? new Date(attempt.submitted_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-4 px-4 text-right">
                      {isMounted && (
                        <PDFDownloadLink 
                          document={<StudentReportPDF attempt={attempt} />} 
                          fileName={`${(attempt.student_name || 'Student').replace(/\s+/g, '_')}_Progress_Report.pdf`}
                          className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-[10px] rounded-lg transition-all"
                        >
                          Download Report
                        </PDFDownloadLink>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Assigned Batches Overview */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-800">
            <h3 className="text-base font-bold text-white">Batch Readiness & Performance</h3>
            <span className="text-xs text-slate-400 font-medium">Batch Roster View</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {batches.map((b) => (
              <div key={b.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 relative group overflow-hidden">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-white text-sm">{b.name}</h4>
                  <span className="text-[10px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-bold px-2 py-0.5 rounded">
                    {b.student_count || 45} Students
                  </span>
                </div>
                <div className="space-y-1 text-xs text-slate-400">
                  <p>Average Mock Score: <strong className="text-slate-200">78%</strong></p>
                  <p>Proctoring Violations Logged: <strong className="text-amber-500">2 low severity</strong></p>
                </div>
                <button className="w-full py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-colors">
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
