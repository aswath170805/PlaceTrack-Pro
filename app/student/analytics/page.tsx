'use client';

import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line 
} from 'recharts';
import { 
  BarChart3, 
  BrainCircuit, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  Sparkles,
  TrendingUp,
  Target
} from 'lucide-react';

const TOPIC_PERFORMANCE_DATA = [
  { topic: 'Data Structures', accuracy: 40, benchmark: 75 },
  { topic: 'Algorithms', accuracy: 65, benchmark: 70 },
  { topic: 'Quantitative Aptitude', accuracy: 85, benchmark: 80 },
  { topic: 'Operating Systems', accuracy: 90, benchmark: 75 },
  { topic: 'Computer Networks', accuracy: 78, benchmark: 70 },
];

const HISTORICAL_SCORE_TREND = [
  { test: 'Test 1', score: 65 },
  { test: 'Test 2', score: 70 },
  { test: 'Test 3', score: 60 },
  { test: 'Test 4', score: 80 },
  { test: 'Test 5', score: 85 },
];

export default function StudentAnalyticsPage() {
  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 print:p-0 print:bg-white">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Title & Export Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Performance Intelligence Dashboard</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900">Placement Readiness & Topic Analytics</h1>
            <p className="text-xs text-slate-500">Real-time mastery tracking across question banks and mock tests</p>
          </div>

          <button
            onClick={handleExportPDF}
            className="inline-flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-colors print:hidden"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Performance Report (PDF)
          </button>
        </div>

        {/* AI Recommendations Banner */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white p-6 rounded-3xl shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <BrainCircuit className="w-5 h-5" />
              <h3 className="text-base font-bold">Personalized AI Placement Recommendation</h3>
            </div>
            <p className="text-xs text-amber-50 leading-relaxed max-w-2xl">
              &ldquo;Your overall readiness is <strong>76%</strong>. You excel in <strong>Operating Systems & Aptitude</strong>, but require targeted practice in <strong>Data Structures (Trees & Graphs)</strong> where accuracy is currently 40%.&rdquo;
            </p>
          </div>

          <a 
            href="/student"
            className="px-4 py-2 bg-white text-slate-900 hover:bg-amber-50 font-bold text-xs rounded-xl transition-all shadow-md shrink-0 print:hidden"
          >
            Practice Recommended Topic
          </a>
        </div>

        {/* Recharts Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Topic-wise Mastery Bar Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">Topic-wise Mastery vs Target Benchmark</h3>
                <p className="text-xs text-slate-500">Percentage accuracy per core placement subject</p>
              </div>
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={TOPIC_PERFORMANCE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="topic" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="accuracy" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Your Accuracy (%)" />
                  <Bar dataKey="benchmark" fill="#cbd5e1" radius={[6, 6, 0, 0]} name="Target Benchmark (%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Historical Score Progress Line Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">Score Progress Trend Over Time</h3>
                <p className="text-xs text-slate-500">Historical performance across sequential mock assessments</p>
              </div>
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={HISTORICAL_SCORE_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="test" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} name="Test Score (%)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Strengths & Weaknesses Breakdown Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center space-x-2 mb-4 text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
              <h4 className="text-sm font-bold text-slate-900">Top Identified Strengths</h4>
            </div>
            <ul className="space-y-3 text-xs">
              <li className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
                <span className="font-semibold text-emerald-900">Operating Systems & Networking</span>
                <span className="font-extrabold text-emerald-700">90% Accuracy</span>
              </li>
              <li className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
                <span className="font-semibold text-emerald-900">Quantitative Aptitude</span>
                <span className="font-extrabold text-emerald-700">85% Accuracy</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center space-x-2 mb-4 text-amber-600">
              <AlertTriangle className="w-5 h-5" />
              <h4 className="text-sm font-bold text-slate-900">Focus Areas & Weaknesses</h4>
            </div>
            <ul className="space-y-3 text-xs">
              <li className="p-3 bg-amber-50 rounded-xl border border-amber-100 flex items-center justify-between">
                <span className="font-semibold text-amber-900">Data Structures (Arrays & Linked Lists)</span>
                <span className="font-extrabold text-amber-700">40% Accuracy</span>
              </li>
              <li className="p-3 bg-amber-50 rounded-xl border border-amber-100 flex items-center justify-between">
                <span className="font-semibold text-amber-900">Dynamic Programming Algorithms</span>
                <span className="font-extrabold text-amber-700">65% Accuracy</span>
              </li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
}
