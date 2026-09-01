'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  MOCK_TESTS, 
  MOCK_QUESTIONS, 
  Question, 
  ProctoringEvent 
} from '@/lib/mockData';
import ProctoringMonitor from '@/components/proctoring/ProctoringMonitor';
import { 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  Send, 
  Code, 
  FileText,
  AlertTriangle,
  Play
} from 'lucide-react';

export default function TestEnvironment() {
  const router = useRouter();
  const params = useParams();
  const testId = params.id as string;

  const test = MOCK_TESTS.find((t) => t.id === testId) || MOCK_TESTS[0];
  const questions: Question[] = MOCK_QUESTIONS;

  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeLeft, setTimeLeft] = useState<number>(test.duration_minutes * 60);
  const [isSaved, setIsSaved] = useState<boolean>(true);
  const [proctorFlags, setProctorFlags] = useState<ProctoringEvent[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [codeOutput, setCodeOutput] = useState<string | null>(null);

  const currentQ = questions[currentIdx];

  // Timer Countdown Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format Time
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Handle Option Select
  const handleSelectAnswer = (qId: string, val: any) => {
    setAnswers((prev) => ({ ...prev, [qId]: val }));
    setIsSaved(false);
    setTimeout(() => setIsSaved(true), 400);
  };

  // Handle Code Run Simulation
  const handleRunCode = () => {
    setCodeOutput('⚡ Running Test Cases...\nTest Case 1: [2,7,11,15], target=9 -> Output: [0, 1] PASSED ✓\nTest Case 2: [3,2,4], target=6 -> Output: [1, 2] PASSED ✓\n\nAll test cases passed cleanly! Time: 4ms');
  };

  // Log Proctoring Event Callback
  const handleProctorEvent = (event: ProctoringEvent) => {
    setProctorFlags((prev) => [event, ...prev]);
  };

  // Submit Test Handler
  const handleSubmitTest = () => {
    // Generate new attempt ID and route to immediate results page
    const newAttemptId = 'att-' + Math.random().toString(36).substring(2, 8);
    router.push(`/student/results/${newAttemptId}`);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      
      {/* Top Test Header */}
      <header className="bg-slate-950 border-b border-slate-800 px-6 py-3.5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <div className="px-2.5 py-1 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-lg text-xs font-bold uppercase tracking-wider">
            {test.type.replace('_', ' ')}
          </div>
          <h1 className="text-base font-bold text-white truncate max-w-md">{test.title}</h1>
        </div>

        {/* Timer & Auto-Save */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-xs font-medium text-slate-400">
            <Save className={`w-3.5 h-3.5 ${isSaved ? 'text-emerald-400' : 'text-amber-400 animate-spin'}`} />
            <span>{isSaved ? 'Answers Auto-Saved' : 'Saving...'}</span>
          </div>

          <div className="flex items-center space-x-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 font-mono text-sm text-emerald-400 font-bold">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>{formatTime(timeLeft)}</span>
          </div>

          <button
            onClick={() => setShowConfirmModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-colors flex items-center"
          >
            <Send className="w-3.5 h-3.5 mr-1.5" />
            Submit Test
          </button>
        </div>
      </header>

      {/* Main Examination Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left / Center: Question Panel */}
        <div className="lg:col-span-3 bg-slate-950/80 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between shadow-2xl">
          <div>
            
            {/* Question Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg">
                  Question {currentIdx + 1} of {questions.length}
                </span>
                <span className="text-xs font-semibold text-blue-400 bg-blue-950 px-2.5 py-1 rounded-lg border border-blue-800/50">
                  Topic: {currentQ.topic}
                </span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg capitalize ${
                  currentQ.difficulty === 'easy' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50' : 'bg-amber-950 text-amber-400 border border-amber-800/50'
                }`}>
                  {currentQ.difficulty}
                </span>
              </div>
            </div>

            {/* Question Statement */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-100 leading-relaxed mb-4">
                {currentQ.content.questionText}
              </h2>
            </div>

            {/* MCQ Options OR Coding Workspace */}
            {currentQ.type === 'mcq' && currentQ.content.options && (
              <div className="space-y-3 max-w-2xl">
                {currentQ.content.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectAnswer(currentQ.id, idx)}
                    className={`w-full text-left p-4 rounded-xl border text-sm font-medium transition-all flex items-center justify-between ${
                      answers[currentQ.id] === idx
                        ? 'bg-blue-600/20 border-blue-500 text-white shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                        answers[currentQ.id] === idx ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </div>
                    {answers[currentQ.id] === idx && (
                      <CheckCircle2 className="w-5 h-5 text-blue-400" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {currentQ.type === 'coding' && (
              <div className="space-y-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden font-mono text-sm">
                  <div className="bg-slate-950 px-4 py-2 text-xs text-slate-400 border-b border-slate-800 flex justify-between items-center">
                    <span>JavaScript Editor</span>
                    <button
                      onClick={handleRunCode}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded flex items-center transition-colors"
                    >
                      <Play className="w-3 h-3 mr-1" />
                      Run Test Cases
                    </button>
                  </div>
                  <textarea
                    value={answers[currentQ.id] || currentQ.content.starterCode || ''}
                    onChange={(e) => handleSelectAnswer(currentQ.id, e.target.value)}
                    rows={8}
                    className="w-full p-4 bg-slate-900 text-emerald-400 focus:outline-none font-mono text-xs leading-relaxed resize-none"
                  />
                </div>

                {codeOutput && (
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-300 whitespace-pre-wrap">
                    {codeOutput}
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-800 mt-6">
            <button
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
              className="px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 text-slate-300 font-medium text-xs rounded-xl transition-all flex items-center"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous Question
            </button>

            <button
              disabled={currentIdx === questions.length - 1}
              onClick={() => setCurrentIdx((prev) => Math.min(questions.length - 1, prev + 1))}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold text-xs rounded-xl transition-all flex items-center shadow-md shadow-blue-600/20"
            >
              Next Question
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>

        {/* Right Sidebar: Palette & Proctoring Status */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Question Palette */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">Question Palette</h3>
            <div className="grid grid-cols-4 gap-2.5">
              {questions.map((q, idx) => {
                const isAnswered = answers[q.id] !== undefined;
                const isCurrent = idx === currentIdx;
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(idx)}
                    className={`h-10 rounded-xl font-bold text-xs transition-all flex items-center justify-center border ${
                      isCurrent
                        ? 'ring-2 ring-blue-500 bg-blue-600 text-white border-blue-400'
                        : isAnswered
                        ? 'bg-emerald-950/80 border-emerald-800 text-emerald-400'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Proctoring Flag Summary Box */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center space-x-2 mb-3">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Proctoring Log</h3>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              Your webcam and screen focus are being monitored continuously.
            </p>
            <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Total Violation Flags:</span>
              <span className="font-extrabold text-sm text-amber-400">{proctorFlags.length}</span>
            </div>
          </div>

        </div>

      </div>

      {/* Embedded Client-Side AI Proctoring Monitor */}
      <ProctoringMonitor
        attemptId={test.id}
        isProctored={test.is_proctored}
        onEventLogged={handleProctorEvent}
      />

      {/* Confirmation Submit Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-center shadow-2xl">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3 animate-bounce" />
            <h3 className="text-lg font-bold text-white mb-2">Submit Assessment?</h3>
            <p className="text-xs text-slate-400 mb-6">
              You have answered {Object.keys(answers).length} out of {questions.length} questions. Are you sure you want to finish and view your result breakdown?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors"
              >
                Return to Test
              </button>
              <button
                onClick={handleSubmitTest}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors shadow-lg"
              >
                Confirm Submission
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
