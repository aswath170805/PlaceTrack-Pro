'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MOCK_BATCHES, MOCK_QUESTION_BANKS, Test } from '@/lib/mockData';
import { 
  FileCheck2, 
  ShieldAlert, 
  Clock, 
  Users, 
  BookOpen, 
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';

export default function CreateTestPage() {
  const router = useRouter();

  const [title, setTitle] = useState<string>('');
  const [type, setType] = useState<'daily_practice' | 'weekly_assessment' | 'custom'>('weekly_assessment');
  const [batchId, setBatchId] = useState<string>(MOCK_BATCHES[0].id);
  const [duration, setDuration] = useState<number>(45);
  const [isProctored, setIsProctored] = useState<boolean>(true);
  const [selectedBanks, setSelectedBanks] = useState<string[]>([MOCK_QUESTION_BANKS[0].id]);

  const handleCreateTest = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/faculty');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Navigation */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Faculty Hub
        </button>

        {/* Form Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold mb-2">
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Assessment Configuration</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900">Schedule & Configure New Assessment</h1>
            <p className="text-xs text-slate-500">Configure target batches, test window, duration, and browser AI proctoring controls</p>
          </div>

          <form onSubmit={handleCreateTest} className="space-y-6">
            
            {/* Title & Type */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Assessment Title</label>
                <input
                  required
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Weekly Proctored Placement Mock - TCS NQT & Wipro Prep"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setType('daily_practice')}
                  className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                    type === 'daily_practice' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <span className="block mb-1">Daily Practice</span>
                  <span className="text-[10px] font-normal text-slate-500">Short continuous set</span>
                </button>

                <button
                  type="button"
                  onClick={() => setType('weekly_assessment')}
                  className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                    type === 'weekly_assessment' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <span className="block mb-1">Weekly Assessment</span>
                  <span className="text-[10px] font-normal text-slate-500">Scheduled mock test</span>
                </button>

                <button
                  type="button"
                  onClick={() => setType('custom')}
                  className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                    type === 'custom' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <span className="block mb-1">Custom Exam</span>
                  <span className="text-[10px] font-normal text-slate-500">Special company evaluation</span>
                </button>
              </div>
            </div>

            {/* Target Batch & Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Target Student Batch</label>
                <select
                  value={batchId}
                  onChange={(e) => setBatchId(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                >
                  {MOCK_BATCHES.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Duration (Minutes)</label>
                <input
                  required
                  type="number"
                  min={5}
                  max={180}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                />
              </div>
            </div>

            {/* AI Proctoring Toggle */}
            <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/80 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-amber-900">Enable Client-Side AI Proctoring</h4>
                  <p className="text-[11px] text-amber-700">Detect gaze away, multi-person webcam feed, mobile phone, and tab switches</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isProctored}
                onChange={(e) => setIsProctored(e.target.checked)}
                className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500"
              />
            </div>

            {/* Question Bank Selectors */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Include Question Banks</label>
              <div className="space-y-2">
                {MOCK_QUESTION_BANKS.map((qb) => (
                  <label key={qb.id} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedBanks.includes(qb.id)}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedBanks([...selectedBanks, qb.id]);
                        else setSelectedBanks(selectedBanks.filter((id) => id !== qb.id));
                      }}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-slate-900">{qb.title}</span>
                      <span className="text-slate-400 ml-2 font-mono">({qb.topic})</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/20 transition-colors"
            >
              Publish & Schedule Assessment
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}
