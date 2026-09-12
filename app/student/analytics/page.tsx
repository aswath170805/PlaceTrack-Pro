'use client';

import React, { useState, useEffect } from 'react';
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
  Target,
  Flame,
  Award,
  Zap,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { DatabaseService } from '@/lib/dbService';
import { 
  PlacementReadinessScore, 
  StudentXP, 
  StudentStreak, 
  StudentBadge, 
  TopicStat, 
  PracticeRecommendation 
} from '@/lib/mockData';

const HISTORICAL_SCORE_TREND = [
  { test: 'Test 1', score: 65 },
  { test: 'Test 2', score: 70 },
  { test: 'Test 3', score: 60 },
  { test: 'Test 4', score: 80 },
  { test: 'Test 5', score: 85 },
];

export default function StudentAnalyticsPage() {
  const [readiness, setReadiness] = useState<PlacementReadinessScore | null>(null);
  const [xp, setXp] = useState<StudentXP | null>(null);
  const [streak, setStreak] = useState<StudentStreak | null>(null);
  const [badges, setBadges] = useState<StudentBadge[]>([]);
  const [topicStats, setTopicStats] = useState<TopicStat[]>([]);
  const [recommendations, setRecommendations] = useState<PracticeRecommendation[]>([]);

  useEffect(() => {
    async function loadAnalyticsData() {
      const studentId = 's1111111-1111-1111-1111-111111111111';
      const r = await DatabaseService.getReadinessScore(studentId);
      const x = await DatabaseService.getStudentXP(studentId);
      const s = await DatabaseService.getStudentStreak(studentId);
      const b = await DatabaseService.getStudentBadges(studentId);
      const t = await DatabaseService.getTopicStats(studentId);
      const p = await DatabaseService.getPracticeRecommendations(studentId);

      setReadiness(r);
      setXp(x);
      setStreak(s);
      setBadges(b);
      setTopicStats(t);
      setRecommendations(p);
    }

    loadAnalyticsData();
  }, []);

  const handleExportPDF = () => {
    window.print();
  };

  const readinessBreakdown = [
    { category: 'Aptitude', score: readiness?.aptitude_score || 82, color: 'bg-blue-500' },
    { category: 'Logical Reasoning', score: readiness?.logical_score || 76, color: 'bg-indigo-500' },
    { category: 'Programming', score: readiness?.programming_score || 85, color: 'bg-emerald-500' },
    { category: 'Technical CS', score: readiness?.technical_score || 72, color: 'bg-purple-500' },
    { category: 'Communication', score: readiness?.communication_score || 68, color: 'bg-amber-500' },
    { category: 'Mock Interview', score: readiness?.interview_score || 81, color: 'bg-rose-500' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 print:p-0 print:bg-white selection:bg-blue-600 selection:text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Title & Export Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Placement Intelligence Platform</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900">Student Analytics & Placement Readiness</h1>
            <p className="text-xs text-slate-500">Real-time placement readiness score, weak topics, gamification XP & streaks</p>
          </div>

          <button
            onClick={handleExportPDF}
            className="inline-flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-colors print:hidden"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Performance Report (PDF)
          </button>
        </div>

        {/* Hero Placement Readiness Score Widget */}
        <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl border border-slate-800 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-800 pb-6">
            <div className="flex items-center space-x-6">
              <div className="relative flex items-center justify-center w-28 h-28 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shrink-0">
                <div className="text-center">
                  <span className="block text-3xl font-black">{readiness?.overall_score || 78}%</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200">Readiness</span>
                </div>
              </div>
              <div className="space-y-1">
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold rounded-full">
                  Placement Ready Tier 1 ✓
                </span>
                <h2 className="text-xl font-black text-white">Overall Placement Readiness Score</h2>
                <p className="text-xs text-slate-400 max-w-lg leading-relaxed">
                  Calculated from historical mock assessments, coding benchmarks, accuracy trends, and soft skills evaluation.
                </p>
              </div>
            </div>

            {/* Gamification Streak & XP Badge */}
            <div className="flex items-center space-x-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center space-x-2 text-amber-400 px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <Flame className="w-5 h-5 text-amber-400 animate-bounce" />
                <div>
                  <span className="block text-sm font-black">{streak?.current_streak || 7} Day Streak</span>
                  <span className="text-[10px] text-amber-300 font-medium">Daily Active Learner</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-indigo-400 px-3 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                <Zap className="w-5 h-5 text-indigo-400" />
                <div>
                  <span className="block text-sm font-black">{xp?.xp_points || 1250} XP</span>
                  <span className="text-[10px] text-indigo-300 font-medium">Level {xp?.level || 4} Scholar</span>
                </div>
              </div>
            </div>
          </div>

          {/* Category Breakdown Progress Bars */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {readinessBreakdown.map((cat, idx) => (
              <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 block truncate">{cat.category}</span>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono font-black text-white">{cat.score}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full ${cat.color}`} style={{ width: `${cat.score}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations Banner */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white p-6 rounded-3xl shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <BrainCircuit className="w-5 h-5" />
              <h3 className="text-base font-bold">Personalized AI Placement Recommendation</h3>
            </div>
            <p className="text-xs text-amber-50 leading-relaxed max-w-2xl">
              &ldquo;Your overall readiness is <strong>{readiness?.overall_score || 78}%</strong>. You excel in <strong>Arrays & Hashing (88%)</strong>, but require targeted practice in <strong>Probability & Combinatorics</strong> where accuracy is currently <strong>53%</strong>.&rdquo;
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
                <h3 className="text-base font-bold text-slate-900">Topic-wise Accuracy vs Target Benchmark</h3>
                <p className="text-xs text-slate-500">Percentage accuracy per core placement subject</p>
              </div>
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topicStats.length > 0 ? topicStats : [
                  { topic: 'Arrays & Hashing', accuracy: 88 },
                  { topic: 'SQL Joins', accuracy: 85 },
                  { topic: 'Probability', accuracy: 53 },
                  { topic: 'Dynamic Prog', accuracy: 58 },
                  { topic: 'OS & Memory', accuracy: 61 }
                ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="topic" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="accuracy" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Your Accuracy (%)" />
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

        {/* Personalized Practice Recommendations & Earned Badges Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Weak-Topic Personalized Practice */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-indigo-600">
                <BookOpen className="w-5 h-5" />
                <h3 className="text-base font-bold text-slate-900">Personalized Practice Recommendations</h3>
              </div>
              <span className="text-xs font-bold text-slate-400">Generated from Weak Topics</span>
            </div>

            <div className="space-y-3">
              {recommendations.map((rec) => (
                <div key={rec.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-900">{rec.title}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full capitalize">
                        {rec.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{rec.reason}</p>
                  </div>
                  <button className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center transition-colors shadow-sm shrink-0">
                    <span>Practice Now</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Earned Badges Showcase */}
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-amber-500 pb-3 border-b border-slate-100">
              <Award className="w-5 h-5" />
              <h3 className="text-base font-bold text-slate-900">Earned Badges ({badges.length})</h3>
            </div>

            <div className="space-y-3">
              {badges.map((b) => (
                <div key={b.id} className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200/80 flex items-center space-x-3">
                  <div className="w-10 h-10 bg-amber-500/20 text-amber-600 rounded-xl flex items-center justify-center font-bold shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">{b.badge_name}</h4>
                    <p className="text-[10px] text-slate-500">{b.description || 'Achievement unlocked!'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
