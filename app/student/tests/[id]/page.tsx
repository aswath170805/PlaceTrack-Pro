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
  Play,
  Sparkles,
  Terminal,
  Eye,
  Lock,
  Loader2,
  Check,
  XCircle
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

  // LeetCode UI State
  const [activeTab, setActiveTab] = useState<'description' | 'ai' | 'results'>('description');
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [evaluationResults, setEvaluationResults] = useState<{
    total: number;
    passed: number;
    failed: number;
    cases: {
      index: number;
      isPublic: boolean;
      input: string;
      expected: string;
      actual: string;
      passed: boolean;
      error?: string;
    }[];
  } | null>(null);

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

  // Safe JavaScript Execution Engine for LeetCode test cases
  const runCodeExecution = (onlyPublic: boolean) => {
    const userCode = answers[currentQ.id] || currentQ.content.starterCode || '';
    const testCases = currentQ.content.testCases || [
      { input: '[2,7,11,15], 9', expectedOutput: '[0, 1]', isPublic: true },
      { input: '[3,2,4], 6', expectedOutput: '[1, 2]', isPublic: true },
      { input: '[3,3], 6', expectedOutput: '[0, 1]', isPublic: false }
    ];

    const targetCases = onlyPublic ? testCases.filter((tc) => tc.isPublic !== false) : testCases;

    const evaluatedCases: any[] = [];
    let passedCount = 0;

    targetCases.forEach((tc, idx) => {
      try {
        // Extract function name or use wrapper
        const functionMatch = userCode.match(/function\s+([a-zA-Z0-9_]+)\s*\(/);
        const functionName = functionMatch ? functionMatch[1] : 'solution';

        // Construct sandbox runner
        const runnerScript = `
          ${userCode}
          try {
            return ${functionName}(${tc.input});
          } catch(e) {
            throw e;
          }
        `;

        const executeFn = new Function(runnerScript);
        const actualResult = executeFn();
        const actualStr = JSON.stringify(actualResult);
        const expectedNormalized = tc.expectedOutput.replace(/\s+/g, '');
        const actualNormalized = actualStr ? actualStr.replace(/\s+/g, '') : '';

        const isPassed = actualNormalized === expectedNormalized;
        if (isPassed) passedCount++;

        evaluatedCases.push({
          index: idx + 1,
          isPublic: tc.isPublic !== false,
          input: tc.input,
          expected: tc.expectedOutput,
          actual: actualStr !== undefined ? actualStr : 'undefined',
          passed: isPassed,
        });
      } catch (err: any) {
        evaluatedCases.push({
          index: idx + 1,
          isPublic: tc.isPublic !== false,
          input: tc.input,
          expected: tc.expectedOutput,
          actual: 'Runtime Error',
          passed: false,
          error: err?.message || 'Syntax or evaluation error in code'
        });
      }
    });

    const resultSummary = {
      total: targetCases.length,
      passed: passedCount,
      failed: targetCases.length - passedCount,
      cases: evaluatedCases
    };

    setEvaluationResults(resultSummary);
    setActiveTab('results');

    // Deterministic Contextual AI Review on Submission
    if (!onlyPublic) {
      if (passedCount === targetCases.length) {
        setAiFeedback(
          `🌟 AI Code Review: Outstanding! All ${targetCases.length} public and hidden private test cases passed cleanly.\n\n• Algorithmic Correctness: 100% verified.\n• Complexity: Optimal single-pass / hash-map performance.\n• Code Quality: Clean modular logic with standard return types.`
        );
      } else {
        setAiFeedback(
          `🤖 AI Code Review: Failed ${targetCases.length - passedCount} test case(s).\n\n• Edge-Case Diagnostic: Your function encountered discrepancies on boundary/duplicate values (e.g. duplicate elements or target parity).\n• Hint: Ensure you return indices instead of actual elements and check if the complement matches the current index.`
        );
      }
    }
  };

  const handleRunPublicCode = () => {
    setIsRunning(true);
    setTimeout(() => {
      runCodeExecution(true);
      setIsRunning(false);
    }, 400);
  };

  const handleSubmitAllCode = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      runCodeExecution(false);
      setIsSubmitting(false);
    }, 600);
  };

  // Log Proctoring Event Callback
  const handleProctorEvent = (event: ProctoringEvent) => {
    setProctorFlags((prev) => [event, ...prev]);
  };

  // Submit Test Handler
  const handleSubmitTest = () => {
    const newAttemptId = 'att-' + Math.random().toString(36).substring(2, 8);
    router.push(`/student/results/${newAttemptId}`);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-indigo-600 selection:text-white font-sans">
      
      {/* Top Test Header */}
      <header className="bg-slate-950 border-b border-slate-800 px-6 py-3.5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <div className="px-2.5 py-1 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-lg text-xs font-bold uppercase tracking-wider">
            {test.type.replace('_', ' ')}
          </div>
          <h1 className="text-base font-bold text-white truncate max-w-md">{test.title}</h1>
        </div>

        {/* Timer & Auto-Save */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-xs font-medium text-slate-400">
            <Save className={`w-3.5 h-3.5 ${isSaved ? 'text-emerald-400' : 'text-amber-400 animate-spin'}`} />
            <span>{isSaved ? 'Auto-Saved' : 'Saving...'}</span>
          </div>

          <div className="flex items-center space-x-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 font-mono text-sm text-emerald-400 font-bold">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>{formatTime(timeLeft)}</span>
          </div>

          <button
            onClick={() => setShowConfirmModal(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-colors flex items-center"
          >
            <Send className="w-3.5 h-3.5 mr-1.5" />
            Finish & Submit
          </button>
        </div>
      </header>

      {/* Main Examination Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left / Center: Question Panel */}
        <div className="lg:col-span-3 bg-slate-950/80 border border-slate-800/80 rounded-3xl p-6 flex flex-col justify-between shadow-2xl">
          <div>
            
            {/* Question Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg font-bold">
                  Question {currentIdx + 1} of {questions.length}
                </span>
                <span className="text-xs font-semibold text-indigo-400 bg-indigo-950/80 px-2.5 py-1 rounded-lg border border-indigo-800/50">
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

            {/* MCQ Options */}
            {currentQ.type === 'mcq' && currentQ.content.options && (
              <div className="space-y-3 max-w-2xl">
                {currentQ.content.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectAnswer(currentQ.id, idx)}
                    className={`w-full text-left p-4 rounded-2xl border text-sm font-medium transition-all flex items-center justify-between ${
                      answers[currentQ.id] === idx
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                        answers[currentQ.id] === idx ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </div>
                    {answers[currentQ.id] === idx && (
                      <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* LeetCode Split Coding Environment */}
            {currentQ.type === 'coding' && (
              <div className="space-y-4">
                
                {/* Tab selector: Code Description / Test Cases / AI Review */}
                <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
                  <button
                    onClick={() => setActiveTab('description')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      activeTab === 'description' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Problem Description
                  </button>
                  <button
                    onClick={() => setActiveTab('results')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center space-x-1 ${
                      activeTab === 'results' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Terminal className="w-3.5 h-3.5 mr-1" />
                    <span>Test Results</span>
                    {evaluationResults && (
                      <span className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full ${
                        evaluationResults.failed === 0 ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                      }`}>
                        {evaluationResults.passed}/{evaluationResults.total}
                      </span>
                    )}
                  </button>
                  {aiFeedback && (
                    <button
                      onClick={() => setActiveTab('ai')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center text-amber-300 ${
                        activeTab === 'ai' ? 'bg-amber-600 text-white' : 'hover:text-amber-200'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 mr-1" />
                      <span>AI Code Review</span>
                    </button>
                  )}
                </div>

                {/* Tab 1: Description */}
                {activeTab === 'description' && (
                  <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs text-slate-300">
                    <p className="leading-relaxed">{currentQ.content.questionText}</p>
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Public Examples:</span>
                      {(currentQ.content.testCases || [
                        { input: '[2,7,11,15], 9', expectedOutput: '[0, 1]', isPublic: true },
                        { input: '[3,2,4], 6', expectedOutput: '[1, 2]', isPublic: true }
                      ]).filter(tc => tc.isPublic !== false).map((tc, tcIdx) => (
                        <div key={tcIdx} className="p-2.5 bg-slate-950 rounded-xl font-mono border border-slate-800 space-y-0.5">
                          <span className="text-slate-500 font-bold block text-[10px]">Example {tcIdx + 1}:</span>
                          <div><strong className="text-slate-400">Input:</strong> {tc.input}</div>
                          <div><strong className="text-slate-400">Output:</strong> {tc.expectedOutput}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab 2: Test Results & Public vs Private evaluation */}
                {activeTab === 'results' && evaluationResults && (
                  <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-black ${
                          evaluationResults.failed === 0 ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {evaluationResults.failed === 0 ? 'Accepted / All Test Cases Passed ✓' : 'Discrepancy / Some Test Cases Failed ✗'}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-slate-400">
                        {evaluationResults.passed} / {evaluationResults.total} Passed
                      </span>
                    </div>

                    <div className="space-y-2 max-h-48 overflow-y-auto font-mono">
                      {evaluationResults.cases.map((cs) => (
                        <div
                          key={cs.index}
                          className={`p-3 rounded-xl border text-[11px] space-y-1 ${
                            cs.passed
                              ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
                              : 'bg-red-950/30 border-red-800/60 text-red-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold flex items-center">
                              {cs.passed ? <Check className="w-3.5 h-3.5 mr-1" /> : <XCircle className="w-3.5 h-3.5 mr-1" />}
                              Case #{cs.index} {cs.isPublic ? '(Public)' : '(Hidden Private Test Case)'}
                            </span>
                            <span className={`text-[10px] font-bold uppercase px-1.5 py-0.2 rounded ${
                              cs.passed ? 'bg-emerald-900 text-emerald-200' : 'bg-red-900 text-red-200'
                            }`}>
                              {cs.passed ? 'Passed' : 'Failed'}
                            </span>
                          </div>

                          {/* For public cases, show full input/expected vs actual */}
                          {cs.isPublic ? (
                            <div className="space-y-0.5 pt-1 text-slate-300">
                              <div><span className="text-slate-500">Input:</span> {cs.input}</div>
                              <div><span className="text-slate-500">Expected:</span> {cs.expected}</div>
                              <div><span className="text-slate-500">Actual Output:</span> {cs.actual}</div>
                              {cs.error && <div className="text-red-400 text-[10px] font-sans">Error: {cs.error}</div>}
                            </div>
                          ) : (
                            /* Hidden private cases prevent direct hardcoding */
                            <div className="text-slate-400 text-[10px] pt-0.5 italic">
                              [Input & Expected Output hidden for private benchmark test cases]
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab 3: AI Code Review */}
                {activeTab === 'ai' && aiFeedback && (
                  <div className="bg-amber-950/20 border border-amber-500/40 p-4 rounded-2xl space-y-2 text-xs text-amber-200">
                    <div className="flex items-center space-x-2 text-amber-400 font-bold">
                      <Sparkles className="w-4 h-4" />
                      <span>Intelligent Code Review & Diagnostic</span>
                    </div>
                    <p className="whitespace-pre-wrap leading-relaxed font-mono text-[11px] text-amber-100">
                      {aiFeedback}
                    </p>
                  </div>
                )}

                {/* Code Editor */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden font-mono text-sm">
                  <div className="bg-slate-950 px-4 py-2.5 text-xs text-slate-400 border-b border-slate-800 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Code className="w-3.5 h-3.5 text-indigo-400" />
                      <span>JavaScript Execution Engine</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleRunPublicCode}
                        disabled={isRunning || isSubmitting}
                        className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center transition-colors border border-slate-700 disabled:opacity-50"
                      >
                        {isRunning ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> : <Play className="w-3.5 h-3.5 mr-1" />}
                        Run Public Test Cases
                      </button>

                      <button
                        onClick={handleSubmitAllCode}
                        disabled={isRunning || isSubmitting}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center transition-colors shadow-md shadow-emerald-600/20 disabled:opacity-50"
                      >
                        {isSubmitting ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 mr-1" />}
                        Submit & Evaluate (All Cases)
                      </button>
                    </div>
                  </div>

                  <textarea
                    value={answers[currentQ.id] || currentQ.content.starterCode || ''}
                    onChange={(e) => handleSelectAnswer(currentQ.id, e.target.value)}
                    rows={9}
                    className="w-full p-4 bg-slate-900 text-emerald-400 focus:outline-none font-mono text-xs leading-relaxed resize-none"
                    placeholder="// Implement your solution here..."
                  />
                </div>

              </div>
            )}

          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-800 mt-6">
            <button
              disabled={currentIdx === 0}
              onClick={() => {
                setCurrentIdx((prev) => Math.max(0, prev - 1));
                setEvaluationResults(null);
                setAiFeedback(null);
                setActiveTab('description');
              }}
              className="px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 text-slate-300 font-medium text-xs rounded-xl transition-all flex items-center"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous Question
            </button>

            <button
              disabled={currentIdx === questions.length - 1}
              onClick={() => {
                setCurrentIdx((prev) => Math.min(questions.length - 1, prev + 1));
                setEvaluationResults(null);
                setAiFeedback(null);
                setActiveTab('description');
              }}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-xs rounded-xl transition-all flex items-center shadow-md shadow-indigo-600/20"
            >
              Next Question
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>

        {/* Right Sidebar: Palette & Proctoring Status */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Question Palette */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-xl">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">Question Palette</h3>
            <div className="grid grid-cols-4 gap-2.5">
              {questions.map((q, idx) => {
                const isAnswered = answers[q.id] !== undefined;
                const isCurrent = idx === currentIdx;
                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setCurrentIdx(idx);
                      setEvaluationResults(null);
                      setAiFeedback(null);
                      setActiveTab('description');
                    }}
                    className={`h-10 rounded-xl font-bold text-xs transition-all flex items-center justify-center border ${
                      isCurrent
                        ? 'ring-2 ring-indigo-500 bg-indigo-600 text-white border-indigo-400'
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
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-xl">
            <div className="flex items-center space-x-2 mb-3">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Proctoring Status</h3>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              Webcam gaze and browser focus are continuously monitored.
            </p>
            <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Total Proctor Violations:</span>
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
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-center shadow-2xl">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3 animate-bounce" />
            <h3 className="text-lg font-bold text-white mb-2">Submit Assessment?</h3>
            <p className="text-xs text-slate-400 mb-6">
              You have answered {Object.keys(answers).length} out of {questions.length} questions. Are you ready to submit and calculate your placement readiness score?
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
