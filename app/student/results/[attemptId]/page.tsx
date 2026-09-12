'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  MOCK_TEST_ATTEMPTS, 
  MOCK_QUESTIONS, 
  MOCK_PROCTORING_EVENTS 
} from '@/lib/mockData';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldAlert, 
  ArrowLeft, 
  FileText, 
  Sparkles,
  Download
} from 'lucide-react';

export default function TestResultPage() {
  const params = useParams();
  const attemptId = params.attemptId as string;

  const attempt = MOCK_TEST_ATTEMPTS[0]; // fallback attempt
  const questions = MOCK_QUESTIONS;
  const proctorEvents = MOCK_PROCTORING_EVENTS;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Navigation Back */}
        <Link 
          href="/student" 
          className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Dashboard
        </Link>

        {/* Hero Result Summary Banner */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Assessment Completed & Verified</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900">{attempt.test_title}</h1>
            <p className="text-xs text-slate-500">Submitted on {new Date(attempt.started_at).toLocaleString()}</p>
          </div>

          {/* Score Badge */}
          <div className="flex items-center space-x-6 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="text-center px-4 border-r border-slate-200">
              <span className="block text-4xl font-black text-blue-600">{attempt.score}%</span>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Final Score</span>
            </div>
            <div className="text-center px-4">
              <span className="block text-2xl font-black text-slate-800">4 / 5</span>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Correct Answers</span>
            </div>
          </div>
        </div>

        {/* Detailed Review & Proctor Audit Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Question Breakdown List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              Question-by-Question Breakdown
            </h2>

            {questions.map((q, idx) => (
              <div key={q.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-bold">
                    Q{idx + 1} • {q.topic}
                  </span>
                  <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Correct (+25 pts)
                  </span>
                </div>

                <p className="text-sm font-semibold text-slate-900">{q.content.questionText}</p>

                {q.type === 'mcq' && q.content.options && (
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1">
                    <p className="font-semibold text-slate-700">Correct Answer: <strong className="text-emerald-700">{q.content.options[q.content.correctAnswer as number]}</strong></p>
                    {q.content.explanation && (
                      <p className="text-slate-500 mt-2 italic">💡 {q.content.explanation}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Proctoring Audit Log Card */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center">
              <ShieldAlert className="w-5 h-5 mr-2 text-amber-500" />
              Proctoring Audit Summary
            </h2>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                <p className="font-bold">Total Flags Logged: {proctorEvents.length}</p>
                <p className="text-[11px] text-amber-700 mt-0.5">Reviewed by AI Proctoring Engine & stored for faculty audit.</p>
              </div>

              <div className="space-y-3">
                {proctorEvents.map((ev) => (
                  <div key={ev.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start space-x-3">
                    {ev.snapshot_url && (
                      <img 
                        src={ev.snapshot_url} 
                        alt="Audit Snapshot" 
                        className="w-14 h-10 object-cover rounded-lg border border-slate-300"
                      />
                    )}
                    <div className="space-y-0.5">
                      <span className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                        {ev.event_type.replace('_', ' ')}
                      </span>
                      <span className="block text-[10px] text-slate-400">
                        {new Date(ev.created_at).toLocaleTimeString()}
                      </span>
                      <span className={`inline-block text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        ev.severity === 'high' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {ev.severity} severity
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
