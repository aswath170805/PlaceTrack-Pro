'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  MOCK_BATCHES, 
  MOCK_QUESTION_BANKS, 
  MOCK_QUESTIONS,
  Test, 
  Question 
} from '@/lib/mockData';
import { DatabaseService } from '@/lib/dbService';
import { 
  FileCheck2, 
  ShieldAlert, 
  Clock, 
  Users, 
  BookOpen, 
  CheckCircle2,
  ArrowLeft,
  PlusCircle,
  Trash2,
  Upload,
  Code,
  FileText,
  Layers,
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface AssessmentSession {
  id: string;
  title: string;
  type: 'mcq' | 'coding';
  questionSource: 'bank' | 'custom' | 'upload_pdf';
  selectedBankId?: string;
  questions: {
    text: string;
    options?: string[];
    correctAnswer?: number;
    starterCode?: string;
    testCases?: { input: string; expectedOutput: string; isPublic: boolean }[];
  }[];
}

export default function CreateTestPage() {
  const router = useRouter();

  const [title, setTitle] = useState<string>('');
  const [type, setType] = useState<'daily_practice' | 'weekly_assessment' | 'custom'>('weekly_assessment');
  const [batchId, setBatchId] = useState<string>(MOCK_BATCHES[0].id);
  const [duration, setDuration] = useState<number>(45);
  const [isProctored, setIsProctored] = useState<boolean>(true);
  const [selectedBanks, setSelectedBanks] = useState<string[]>([MOCK_QUESTION_BANKS[0].id]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Sessions configuration
  const [sessions, setSessions] = useState<AssessmentSession[]>([
    {
      id: 'sess-1',
      title: 'Session 1: Aptitude & Core MCQs',
      type: 'mcq',
      questionSource: 'bank',
      selectedBankId: MOCK_QUESTION_BANKS[0].id,
      questions: [
        {
          text: 'What is the worst-case time complexity of binary search on a sorted array?',
          options: ['O(n)', 'O(log n)', 'O(1)', 'O(n log n)'],
          correctAnswer: 1,
        }
      ]
    },
    {
      id: 'sess-2',
      title: 'Session 2: Algorithmic Coding Challenge',
      type: 'coding',
      questionSource: 'custom',
      questions: [
        {
          text: 'Write a function `twoSum(nums, target)` that returns the indices of the two elements adding up to target.',
          starterCode: 'function twoSum(nums, target) {\n  // Implement solution\n}',
          testCases: [
            { input: '[2,7,11,15], 9', expectedOutput: '[0, 1]', isPublic: true },
            { input: '[3,2,4], 6', expectedOutput: '[1, 2]', isPublic: true },
            { input: '[3,3], 6', expectedOutput: '[0, 1]', isPublic: false }
          ]
        }
      ]
    }
  ]);

  const addSession = () => {
    const nextNum = sessions.length + 1;
    const newSession: AssessmentSession = {
      id: 'sess-' + Date.now(),
      title: `Session ${nextNum}: ${nextNum % 2 === 0 ? 'Coding Practice' : 'MCQ Assessment'}`,
      type: nextNum % 2 === 0 ? 'coding' : 'mcq',
      questionSource: 'custom',
      questions: [
        {
          text: 'New question statement...',
          options: nextNum % 2 === 0 ? undefined : ['Option A', 'Option B', 'Option C', 'Option D'],
          correctAnswer: nextNum % 2 === 0 ? undefined : 0,
          starterCode: nextNum % 2 === 0 ? 'function solution() {\n  // Code here\n}' : undefined,
          testCases: nextNum % 2 === 0 ? [{ input: '[1, 2, 3]', expectedOutput: '6', isPublic: true }] : undefined
        }
      ]
    };
    setSessions([...sessions, newSession]);
  };

  const removeSession = (index: number) => {
    if (sessions.length <= 1) return;
    setSessions(sessions.filter((_, idx) => idx !== index));
  };

  const handleCreateTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const created = await DatabaseService.createTest({
        title: title || 'Placement Assessment & Multi-Session Mock',
        type,
        batch_id: batchId,
        duration_minutes: duration,
        is_proctored: isProctored,
        created_by: 'Faculty Member',
      });

      setSuccessMessage('Assessment successfully configured and scheduled! Redirecting to Hub...');
      setTimeout(() => {
        router.push('/faculty');
      }, 1200);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Faculty Hub
        </button>

        {successMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-800 text-xs font-bold flex items-center space-x-2 animate-bounce">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-8">
          <div>
            <div className="inline-flex items-center space-x-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold mb-2">
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Multi-Session Assessment Builder</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900">Schedule & Configure New Assessment</h1>
            <p className="text-xs text-slate-500">
              Set up multi-session exams with custom sessions (e.g. Session 1 MCQ, Session 2 Coding), upload questions or select banks
            </p>
          </div>

          <form onSubmit={handleCreateTest} className="space-y-8">
            
            {/* Title & Type */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Assessment Title</label>
                <input
                  required
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. TCS NQT & Wipro National Qualifier Comprehensive Assessment"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setType('daily_practice')}
                  className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                    type === 'daily_practice' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <span className="block mb-1">Daily Practice</span>
                  <span className="text-[10px] font-normal text-slate-500">Continuous skill drill</span>
                </button>

                <button
                  type="button"
                  onClick={() => setType('weekly_assessment')}
                  className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                    type === 'weekly_assessment' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <span className="block mb-1">Weekly Assessment</span>
                  <span className="text-[10px] font-normal text-slate-500">Multi-session scheduled mock</span>
                </button>

                <button
                  type="button"
                  onClick={() => setType('custom')}
                  className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                    type === 'custom' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <span className="block mb-1">Company Custom Exam</span>
                  <span className="text-[10px] font-normal text-slate-500">Tier-1 campus drive</span>
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
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Total Duration (Minutes)</label>
                <input
                  required
                  type="number"
                  min={5}
                  max={240}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                />
              </div>
            </div>

            {/* AI Proctoring Toggle */}
            <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-amber-900">Enable Client-Side AI Proctoring</h4>
                  <p className="text-[11px] text-amber-700">Detect gaze deviation, multiple faces, mobile phone detection, and tab switching</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isProctored}
                onChange={(e) => setIsProctored(e.target.checked)}
                className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500"
              />
            </div>

            {/* Session Management (Session 1: MCQ, Session 2: Coding, etc.) */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h3 className="text-sm font-black text-slate-900 flex items-center">
                    <Layers className="w-4 h-4 mr-2 text-indigo-600" />
                    Assessment Sessions (Multi-Stage Execution)
                  </h3>
                  <p className="text-[11px] text-slate-500">Configure separate sessions e.g. Session 1 MCQ & Session 2 Coding</p>
                </div>
                <button
                  type="button"
                  onClick={addSession}
                  className="inline-flex items-center px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition-colors border border-indigo-200"
                >
                  <PlusCircle className="w-3.5 h-3.5 mr-1" />
                  Add Session
                </button>
              </div>

              <div className="space-y-4">
                {sessions.map((sess, idx) => (
                  <div key={sess.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={sess.title}
                          onChange={(e) => {
                            const updated = [...sessions];
                            updated[idx].title = e.target.value;
                            setSessions(updated);
                          }}
                          className="font-bold text-slate-900 bg-transparent border-b border-dashed border-slate-300 focus:border-indigo-600 focus:outline-none text-xs px-1 py-0.5"
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <div className="flex items-center bg-white rounded-lg p-1 border border-slate-200">
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...sessions];
                              updated[idx].type = 'mcq';
                              setSessions(updated);
                            }}
                            className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-colors ${
                              sess.type === 'mcq' ? 'bg-indigo-600 text-white' : 'text-slate-600'
                            }`}
                          >
                            MCQ Session
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...sessions];
                              updated[idx].type = 'coding';
                              setSessions(updated);
                            }}
                            className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-colors ${
                              sess.type === 'coding' ? 'bg-indigo-600 text-white' : 'text-slate-600'
                            }`}
                          >
                            Coding Session
                          </button>
                        </div>

                        {sessions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSession(idx)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Question Source selector: Type question, Bank, or PDF Upload */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...sessions];
                          updated[idx].questionSource = 'custom';
                          setSessions(updated);
                        }}
                        className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-1.5 ${
                          sess.questionSource === 'custom' ? 'bg-white border-indigo-500 text-indigo-700 shadow-xs' : 'bg-slate-100 border-slate-200 text-slate-600'
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Type / Create Questions</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...sessions];
                          updated[idx].questionSource = 'bank';
                          setSessions(updated);
                        }}
                        className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-1.5 ${
                          sess.questionSource === 'bank' ? 'bg-white border-indigo-500 text-indigo-700 shadow-xs' : 'bg-slate-100 border-slate-200 text-slate-600'
                        }`}
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Include Question Bank</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...sessions];
                          updated[idx].questionSource = 'upload_pdf';
                          setSessions(updated);
                        }}
                        className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-1.5 ${
                          sess.questionSource === 'upload_pdf' ? 'bg-white border-indigo-500 text-indigo-700 shadow-xs' : 'bg-slate-100 border-slate-200 text-slate-600'
                        }`}
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload PDF Questions</span>
                      </button>
                    </div>

                    {/* Question Source Content */}
                    {sess.questionSource === 'bank' && (
                      <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                        <label className="block text-[11px] font-bold text-slate-700">Select Question Bank for this session:</label>
                        <select
                          value={sess.selectedBankId}
                          onChange={(e) => {
                            const updated = [...sessions];
                            updated[idx].selectedBankId = e.target.value;
                            setSessions(updated);
                          }}
                          className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                        >
                          {MOCK_QUESTION_BANKS.map((qb) => (
                            <option key={qb.id} value={qb.id}>{qb.title} ({qb.topic})</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {sess.questionSource === 'upload_pdf' && (
                      <div className="bg-white p-4 rounded-xl border border-dashed border-indigo-300 text-center space-y-2">
                        <Upload className="w-6 h-6 text-indigo-600 mx-auto" />
                        <div className="text-xs text-slate-600 font-semibold">
                          Upload Question Paper PDF for {sess.title}
                        </div>
                        <input
                          type="file"
                          accept=".pdf,.docx,.txt"
                          className="text-xs text-slate-500 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                        />
                        <p className="text-[10px] text-slate-400">Questions will be automatically extracted and indexed into the session test runner.</p>
                      </div>
                    )}

                    {sess.questionSource === 'custom' && (
                      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                        <label className="block text-[11px] font-bold text-slate-700">Question Statement ({sess.type.toUpperCase()}):</label>
                        <textarea
                          rows={2}
                          placeholder={`Enter ${sess.type} question details here...`}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                          defaultValue={sess.questions[0]?.text}
                        />

                        {sess.type === 'coding' && (
                          <div>
                            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                              Starter Code & Test Cases (Public + Private)
                            </span>
                            <pre className="p-2.5 bg-slate-900 text-emerald-400 text-[11px] rounded-lg font-mono">
                              {sess.questions[0]?.starterCode || 'function solution(nums) {\n  // Starter code\n}'}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/20 transition-colors flex items-center justify-center space-x-2"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Configuring Assessment...' : 'Publish & Schedule Multi-Session Assessment'}</span>
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}
