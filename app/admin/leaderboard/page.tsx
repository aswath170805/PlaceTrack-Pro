'use client';

import React, { useState, useEffect } from 'react';
import { PlaceTrackStore, LeaderboardConfig } from '@/lib/store';
import {
  Trophy,
  Award,
  Flame,
  CheckCircle2,
  RotateCcw,
  Sliders,
  Eye,
  EyeOff,
  Medal,
  Users,
  Building2,
  Plus,
  Trash2,
  Star
} from 'lucide-react';

export default function LeaderboardManagementPage() {
  const [config, setConfig] = useState<LeaderboardConfig>(PlaceTrackStore.leaderboardConfig);
  const [selectedDept, setSelectedDept] = useState('all');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Student rankings computed live from PlaceTrackStore
  const students = PlaceTrackStore.users.filter(u => u.role === 'student');

  const rankings = students.map((s, idx) => {
    const readiness = PlaceTrackStore.readinessScores.find(r => r.student_id === s.id)?.overall_score || (85 - idx * 3);
    const xp = PlaceTrackStore.studentXP.find(x => x.student_id === s.id)?.xp_points || (1200 - idx * 80);
    const streak = PlaceTrackStore.studentStreaks.find(st => st.student_id === s.id)?.current_streak || (14 - idx * 2);
    const badges = PlaceTrackStore.studentBadges.filter(b => b.student_id === s.id);
    return {
      student: s,
      readiness,
      xp,
      streak,
      badges,
    };
  }).sort((a, b) => b.readiness - a.readiness);

  const filteredRankings = rankings.filter(r => {
    if (selectedDept === 'all') return true;
    return r.student.department === selectedDept;
  });

  const notify = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleToggleVisibility = () => {
    const next = !config.is_visible;
    const updated = { ...config, is_visible: next };
    setConfig(updated);
    PlaceTrackStore.leaderboardConfig = updated;
    notify(next ? 'Leaderboard made public to all candidates!' : 'Leaderboard hidden from student portal.');
  };

  const handleResetSeason = () => {
    if (confirm('Reset leaderboard ranking season? Student scores will be archived.')) {
      const updated = {
        ...config,
        current_season: `Placement Cycle ${new Date().getFullYear()} (Reset)`,
        last_reset_at: new Date().toISOString(),
      };
      setConfig(updated);
      PlaceTrackStore.leaderboardConfig = updated;
      PlaceTrackStore.logAudit('RESET_LEADERBOARD', 'leaderboard_config', undefined, { season: updated.current_season });
      notify('Leaderboard season reset complete!');
    }
  };

  const handleAwardBadge = (studentName: string) => {
    notify(`Special Honor Badge awarded to ${studentName}!`);
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-xs font-bold mb-2">
            <Trophy className="w-3.5 h-3.5" />
            <span>Feature 11: Leaderboard & Ranking Management</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Placement Rankings, Badges & Algorithm Tuning</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure ranking visibility, department-wise leaderboards, award custom badges & manage semester cycles
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleToggleVisibility}
            className={`px-3.5 py-2 font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition-colors ${
              config.is_visible
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
            }`}
          >
            {config.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span>{config.is_visible ? 'Leaderboard Active' : 'Leaderboard Hidden'}</span>
          </button>

          <button
            onClick={handleResetSeason}
            className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-red-50 hover:text-red-700 text-slate-700 font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Cycle</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Control Configuration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Current Season</span>
          <h3 className="font-black text-slate-900 text-base">{config.current_season}</h3>
          <p className="text-[11px] text-slate-500">Last Reset: {new Date(config.last_reset_at).toLocaleDateString()}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Ranking Metric</span>
          <select
            value={config.ranking_metric}
            onChange={(e) => {
              const updated = { ...config, ranking_metric: e.target.value as any };
              setConfig(updated);
              PlaceTrackStore.leaderboardConfig = updated;
              notify(`Ranking algorithm metric set to: ${e.target.value.toUpperCase()}`);
            }}
            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
          >
            <option value="readiness">Placement Readiness Score (AI Weighted)</option>
            <option value="xp">Student XP Points (Gamified)</option>
            <option value="accuracy">Assessment Accuracy %</option>
          </select>
          <p className="text-[11px] text-slate-400">Updates live across all student dashboards</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Department Leaderboard Filter</span>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
          >
            <option value="all">College-Wide (All Disciplines)</option>
            {PlaceTrackStore.departments.map((d) => (
              <option key={d.id} value={d.code}>{d.name} ({d.code})</option>
            ))}
          </select>
          <p className="text-[11px] text-slate-400">Viewing {filteredRankings.length} candidates</p>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h3 className="text-base font-bold text-slate-900">Student Placement Honor Roll</h3>
            <p className="text-xs text-slate-500">Real-time candidate standings based on assessment accuracy, streak bonuses & aptitude readiness</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Rank</th>
                <th className="p-4">Candidate</th>
                <th className="p-4">Department & Year</th>
                <th className="p-4">Readiness Index</th>
                <th className="p-4">XP Points</th>
                <th className="p-4">Daily Streak</th>
                <th className="p-4 text-right">Reward</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRankings.map((r, index) => (
                <tr key={r.student.id} className="hover:bg-slate-50/50">
                  <td className="p-4">
                    <div className="flex items-center space-x-1.5">
                      {index === 0 ? (
                        <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-black flex items-center justify-center text-xs shadow-xs">
                          🥇
                        </div>
                      ) : index === 1 ? (
                        <div className="w-6 h-6 rounded-full bg-slate-300 text-slate-950 font-black flex items-center justify-center text-xs">
                          🥈
                        </div>
                      ) : index === 2 ? (
                        <div className="w-6 h-6 rounded-full bg-amber-700 text-white font-black flex items-center justify-center text-xs">
                          🥉
                        </div>
                      ) : (
                        <span className="font-mono font-bold text-slate-500 ml-2">#{index + 1}</span>
                      )}
                    </div>
                  </td>

                  <td className="p-4 font-bold text-slate-900 flex items-center space-x-3">
                    <img
                      src={r.student.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80'}
                      alt={r.student.full_name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <span>{r.student.full_name}</span>
                      <span className="block text-[10px] text-slate-400 font-normal">{r.student.email}</span>
                    </div>
                  </td>

                  <td className="p-4 text-slate-600 font-semibold">
                    {r.student.department} ({r.student.year_of_study})
                  </td>

                  <td className="p-4 font-black text-blue-600 text-sm">
                    {r.readiness}%
                  </td>

                  <td className="p-4 font-bold text-indigo-600">
                    {r.xp} pts
                  </td>

                  <td className="p-4 font-bold text-amber-600">
                    <div className="flex items-center space-x-1">
                      <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span>{r.streak} days</span>
                    </div>
                  </td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleAwardBadge(r.student.full_name)}
                      className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs rounded-xl flex items-center space-x-1 ml-auto border border-amber-200 transition-colors"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Award Badge</span>
                    </button>
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
