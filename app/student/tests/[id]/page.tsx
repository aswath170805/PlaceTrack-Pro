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
<<<<<<< HEAD
  Play,
  Sparkles,
  Terminal,
  Loader2,
  Lock,
  Eye
=======
  Play
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
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

<<<<<<< HEAD
  // LeetCode UI State
  const [activeTab, setActiveTab] = useState<'description' | 'ai'>('description');
  const [aiResponse, setAiResponse] = useState<string>('');
  const [language, setLanguage] = useState<'javascript' | 'python' | 'cpp'>('javascript');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [consoleStatus, setConsoleStatus] = useState<'idle' | 'pass' | 'fail'>('idle');

=======
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
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

<<<<<<< HEAD
  // Real JS Execution Engine
  const executeTests = (isSubmit: boolean) => {
    if (language !== 'javascript') {
      setCodeOutput('⚠ Client-side execution is only supported for JavaScript.\nPlease select JavaScript as your language to run test cases.');
      setConsoleStatus('fail');
      return;
    }

    const code = answers[currentQ.id] || currentQ.content.starterCode || '';
    if (!currentQ.content.testCases || currentQ.content.testCases.length === 0) {
      setCodeOutput('No test cases configured for this question.');
      setConsoleStatus('idle');
      return;
    }

    let output = isSubmit ? '⚡ Evaluating ALL Test Cases (Submit)...\n\n' : '⚡ Running PUBLIC Test Cases...\n\n';
    let allPassed = true;
    let passedCount = 0;
    
    const testCasesToRun = isSubmit ? currentQ.content.testCases : currentQ.content.testCases.filter(tc => tc.isPublic);

    if (testCasesToRun.length === 0) {
      setCodeOutput('No public test cases available to run. Click Submit to evaluate against all cases.');
      setConsoleStatus('idle');
      return;
    }

    testCasesToRun.forEach((tc, idx) => {
      try {
        const funcMatch = code.match(/function\s+([a-zA-Z0-9_]+)\s*\(/);
        if (!funcMatch) {
          throw new Error('Could not find a valid function definition in your code.');
        }
        const funcName = funcMatch[1];
        
        const evalCode = `
          ${code}
          return ${funcName}(${tc.input});
        `;
        
        const runFn = new Function(evalCode);
        const result = runFn();
        
        const resultStr = typeof result === 'object' ? JSON.stringify(result) : String(result);
        const expectedStr = String(tc.expectedOutput).trim();
        
        if (resultStr === expectedStr || resultStr === '"' + expectedStr + '"') {
          passedCount++;
          if (tc.isPublic || !isSubmit) {
            output += `✓ PASSED  Case ${idx + 1}: Input: ${tc.input} → Output: ${resultStr}\n`;
          } else {
            output += `✓ PASSED  Private Case ${idx + 1}: [Hidden]\n`;
          }
        } else {
          allPassed = false;
          if (tc.isPublic || !isSubmit) {
            output += `✗ FAILED  Case ${idx + 1}: Input: ${tc.input} → Expected: ${expectedStr}, Got: ${resultStr}\n`;
          } else {
            output += `✗ FAILED  Private Case ${idx + 1}: [Hidden]\n`;
          }
        }
      } catch (err: any) {
        allPassed = false;
        output += `✗ ERROR   Case ${idx + 1}: ${err.message}\n`;
      }
    });

    output += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    output += `Results: ${passedCount} / ${testCasesToRun.length} test cases passed`;
    
    setCodeOutput(output);
    setConsoleStatus(allPassed ? 'pass' : 'fail');
    
    if (isSubmit) {
      setActiveTab('ai');
      if (allPassed) {
         setAiResponse(`✅ Excellent work! All ${testCasesToRun.length} test cases passed successfully.\n\nYour ${currentQ.topic} solution handles both public and private edge cases correctly. The implementation appears clean and efficient.\n\nTime Complexity: Looks optimal for this problem type.\nSpace Complexity: Within acceptable bounds.`);
      } else {
         const failedCount = testCasesToRun.length - passedCount;
         setAiResponse(`⚠️ ${failedCount} of ${testCasesToRun.length} test cases failed.\n\nDebugging suggestions for your ${currentQ.topic} solution:\n• Review your logic for edge cases (empty inputs, negative numbers, single-element cases)\n• Verify your return type matches the expected output format\n• Private test cases often test boundary conditions — think about extreme inputs\n\nTip: Don't hardcode solutions. Focus on algorithmic correctness.`);
      }
    }
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setCodeOutput('⏳ Compiling and running...');
    setTimeout(() => {
      executeTests(false);
      setIsRunning(false);
    }, 400);
  };

  const handleSubmitCode = () => {
    setIsSubmitting(true);
    setCodeOutput('⏳ Submitting solution and evaluating against all test cases...');
    setTimeout(() => {
      executeTests(true);
      setIsSubmitting(false);
    }, 600);
  };

  // AI Tutor contextual helpers
  const getHint = () => {
    const hints: Record<string, string> = {
      'Arrays': '💡 Hint: Consider using a single-pass approach with a hash map to track seen values. This can reduce your time complexity from O(n²) to O(n).',
      'Strings': '💡 Hint: For string manipulation problems, consider using two pointers from both ends. Normalize the string first (lowercase, remove non-alphanumeric) before comparing.',
      'default': `💡 Hint: Break down the ${currentQ.topic} problem into smaller sub-problems. Start with the simplest case and build up to the general solution.`
    };
    setAiResponse(hints[currentQ.topic] || hints['default']);
  };

  const analyzeComplexity = () => {
    const analysis: Record<string, string> = {
      'Arrays': '📊 Complexity Analysis:\n• Brute force: O(n²) time, O(1) space — nested loops\n• Optimal: O(n) time, O(n) space — hash map lookup\n\nAim for the optimal approach to pass all test cases efficiently.',
      'Strings': '📊 Complexity Analysis:\n• Brute force: O(n) time with string reversal\n• Optimal: O(n/2) time with two-pointer technique, O(1) extra space\n\nThe two-pointer approach avoids creating a reversed copy.',
      'default': `📊 Complexity Analysis for ${currentQ.topic}:\n• Consider what data structure gives you the best lookup time\n• O(n log n) is often achievable with sorting\n• O(n) is often achievable with hashing`
    };
    setAiResponse(analysis[currentQ.topic] || analysis['default']);
  };

  const debugCode = () => {
    const code = answers[currentQ.id];
    if (!code || code === currentQ.content.starterCode) {
      setAiResponse('🔍 Debug: You haven\'t modified the starter code yet. Write your solution first, then I can help you debug it!');
      return;
    }
    
    let debugMsg = '🔍 Debug Analysis:\n';
    if (!code.match(/function\s+\w+\s*\(/)) {
      debugMsg += '❌ No function definition found. Make sure your code defines a named function.\n';
    }
    if (!code.includes('return')) {
      debugMsg += '⚠️ No return statement found. Your function needs to return a value.\n';
    }
    if (code.includes('console.log') && !code.includes('return')) {
      debugMsg += '⚠️ Using console.log instead of return. The evaluator checks the return value, not console output.\n';
    }
    if (debugMsg === '🔍 Debug Analysis:\n') {
      debugMsg += '✅ Code structure looks valid. If tests are failing, check:\n• Edge cases (empty arrays, negative numbers)\n• Off-by-one errors in loops\n• Correct handling of the input format';
    }
    setAiResponse(debugMsg);
=======
  // Handle Code Run Simulation
  const handleRunCode = () => {
    setCodeOutput('⚡ Running Test Cases...\nTest Case 1: [2,7,11,15], target=9 -> Output: [0, 1] PASSED ✓\nTest Case 2: [3,2,4], target=6 -> Output: [1, 2] PASSED ✓\n\nAll test cases passed cleanly! Time: 4ms');
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
  };

  // Log Proctoring Event Callback
  const handleProctorEvent = (event: ProctoringEvent) => {
    setProctorFlags((prev) => [event, ...prev]);
  };

  // Submit Test Handler
  const handleSubmitTest = () => {
<<<<<<< HEAD
=======
    // Generate new attempt ID and route to immediate results page
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
    const newAttemptId = 'att-' + Math.random().toString(36).substring(2, 8);
    router.push(`/student/results/${newAttemptId}`);
  };

<<<<<<< HEAD
  // Render colored console output
  const renderConsoleOutput = (output: string) => {
    return output.split('\n').map((line, i) => {
      let className = 'text-slate-400';
      if (line.startsWith('✓ PASSED')) className = 'text-emerald-400';
      else if (line.startsWith('✗ FAILED') || line.startsWith('✗ ERROR')) className = 'text-red-400';
      else if (line.startsWith('Results:')) className = 'text-white font-bold';
      else if (line.startsWith('⚡')) className = 'text-blue-400 font-bold';
      else if (line.startsWith('⏳')) className = 'text-amber-400 animate-pulse';
      else if (line.startsWith('⚠')) className = 'text-amber-400';
      else if (line.includes('━')) className = 'text-slate-600';
      return <div key={i} className={className}>{line || '\u00A0'}</div>;
    });
  };

=======
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
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

<<<<<<< HEAD
          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border font-mono text-sm font-bold ${
            timeLeft < 300 ? 'bg-red-950 border-red-800 text-red-400 animate-pulse' : 'bg-slate-900 border-slate-800 text-emerald-400'
          }`}>
            <Clock className="w-4 h-4" />
=======
          <div className="flex items-center space-x-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 font-mono text-sm text-emerald-400 font-bold">
            <Clock className="w-4 h-4 text-emerald-400" />
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
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
<<<<<<< HEAD
          <div className={currentQ.type === 'coding' ? 'h-full flex flex-col' : ''}>
            {currentQ.type !== 'coding' ? (
              <>
                {/* Standard Question Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg">
                      Question {currentIdx + 1} of {questions.length}
                    </span>
                    <span className="text-xs font-semibold text-blue-400 bg-blue-950 px-2.5 py-1 rounded-lg border border-blue-800/50">
                      Topic: {currentQ.topic}
                    </span>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg capitalize ${
                      currentQ.difficulty === 'easy' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50' : currentQ.difficulty === 'medium' ? 'bg-amber-950 text-amber-400 border border-amber-800/50' : 'bg-red-950 text-red-400 border border-red-800/50'
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
              </>
            ) : (
              /* LeetCode-style Split Pane */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                {/* Left Pane — Description & AI Tutor */}
                <div className="flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden h-[520px]">
                  <div className="flex border-b border-slate-800 bg-gradient-to-r from-slate-950 to-slate-900">
                    <button onClick={() => setActiveTab('description')} className={`px-4 py-2.5 text-xs font-bold transition-all flex items-center ${activeTab === 'description' ? 'border-b-2 border-blue-500 text-blue-400 bg-blue-500/5' : 'text-slate-500 hover:text-slate-300'}`}>
                      <FileText className="w-3 h-3 mr-1.5" /> Description
                    </button>
                    <button onClick={() => setActiveTab('ai')} className={`px-4 py-2.5 text-xs font-bold transition-all flex items-center ${activeTab === 'ai' ? 'border-b-2 border-violet-500 text-violet-400 bg-violet-500/5' : 'text-slate-500 hover:text-slate-300'}`}>
                      <Sparkles className="w-3 h-3 mr-1.5" /> AI Tutor
                    </button>
                  </div>
                  <div className="p-4 flex-1 overflow-y-auto">
                    {activeTab === 'description' && (
                      <div className="space-y-4 text-sm text-slate-300">
                        {/* Difficulty & Topic badges */}
                        <div className="flex items-center space-x-2 mb-3">
                          <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg">
                            Q{currentIdx + 1}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                            currentQ.difficulty === 'easy' ? 'bg-emerald-900/50 text-emerald-400' : currentQ.difficulty === 'medium' ? 'bg-amber-900/50 text-amber-400' : 'bg-red-900/50 text-red-400'
                          }`}>
                            {currentQ.difficulty}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-900/50 text-blue-400">
                            {currentQ.topic}
                          </span>
                        </div>

                        <h2 className="text-base font-bold text-white leading-relaxed">{currentQ.content.questionText}</h2>
                        
                        {/* Public Test Cases Only */}
                        {currentQ.content.testCases && (
                           <div className="mt-5 space-y-3">
                             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
                               <Eye className="w-3 h-3 mr-1.5" /> Public Examples
                             </h3>
                             {currentQ.content.testCases
                               .filter(tc => tc.isPublic !== false)
                               .map((tc, idx) => (
                               <div key={idx} className="bg-slate-950 rounded-lg border border-slate-800 overflow-hidden">
                                 <div className="px-3 py-1.5 bg-slate-800/50 border-b border-slate-800">
                                   <span className="text-[10px] font-bold text-slate-400">Example {idx + 1}</span>
                                 </div>
                                 <div className="p-3 font-mono text-xs space-y-1.5">
                                   <div className="flex">
                                     <span className="text-slate-500 w-16 shrink-0">Input:</span>
                                     <span className="text-cyan-400">{tc.input}</span>
                                   </div>
                                   <div className="flex">
                                     <span className="text-slate-500 w-16 shrink-0">Output:</span>
                                     <span className="text-emerald-400">{tc.expectedOutput}</span>
                                   </div>
                                 </div>
                               </div>
                             ))}
                             {/* Private cases indicator */}
                             {currentQ.content.testCases.some(tc => tc.isPublic === false) && (
                               <div className="flex items-center space-x-2 text-[10px] text-slate-500 bg-slate-950 border border-slate-800/50 rounded-lg px-3 py-2">
                                 <Lock className="w-3 h-3" />
                                 <span className="font-bold">+ {currentQ.content.testCases.filter(tc => tc.isPublic === false).length} private test case(s) evaluated on submission</span>
                               </div>
                             )}
                           </div>
                        )}

                        {/* Constraints */}
                        <div className="mt-4 pt-3 border-t border-slate-800">
                          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Constraints</h3>
                          <p className="text-xs text-slate-500 font-mono">• See problem statement for constraints</p>
                          <p className="text-xs text-slate-500 font-mono">• {currentQ.marks || 20} marks</p>
                        </div>
                      </div>
                    )}
                    {activeTab === 'ai' && (
                      <div className="space-y-3">
                        <p className="text-xs text-slate-400 mb-3">Get AI-powered guidance without revealing the full solution.</p>
                        <div className="flex flex-col gap-2">
                           <button onClick={getHint} className="px-3 py-2.5 bg-gradient-to-r from-indigo-600/20 to-violet-600/20 hover:from-indigo-600/30 hover:to-violet-600/30 border border-indigo-500/30 text-indigo-300 text-xs rounded-lg font-bold text-left transition-all flex items-center">
                             <Sparkles className="w-3.5 h-3.5 mr-2 text-indigo-400" /> Get a Hint
                           </button>
                           <button onClick={analyzeComplexity} className="px-3 py-2.5 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 hover:from-blue-600/30 hover:to-cyan-600/30 border border-blue-500/30 text-blue-300 text-xs rounded-lg font-bold text-left transition-all flex items-center">
                             <Code className="w-3.5 h-3.5 mr-2 text-blue-400" /> Analyze Complexity
                           </button>
                           <button onClick={debugCode} className="px-3 py-2.5 bg-gradient-to-r from-amber-600/20 to-orange-600/20 hover:from-amber-600/30 hover:to-orange-600/30 border border-amber-500/30 text-amber-300 text-xs rounded-lg font-bold text-left transition-all flex items-center">
                             <AlertTriangle className="w-3.5 h-3.5 mr-2 text-amber-400" /> Debug My Code
                           </button>
                        </div>
                        {aiResponse && (
                           <div className="mt-4 bg-gradient-to-br from-slate-950 to-slate-900 p-4 border border-slate-800 rounded-xl text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                             <div className="flex items-center space-x-2 mb-2 pb-2 border-b border-slate-800">
                               <span className="text-base">🤖</span>
                               <span className="font-bold text-violet-400 text-[10px] uppercase tracking-wider">AI Tutor Response</span>
                             </div>
                             {aiResponse}
                           </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Right Pane — Code Editor & Console */}
                <div className="flex flex-col space-y-3 h-[520px]">
                  <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
                    {/* Editor Header */}
                    <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 px-4 py-2 border-b border-slate-800 flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Code className="w-3.5 h-3.5 text-emerald-500" />
                        <select value={language} onChange={(e) => setLanguage(e.target.value as any)} className="bg-slate-800 border border-slate-700 text-xs text-slate-300 rounded px-2 py-1 outline-none font-bold">
                          <option value="javascript">JavaScript</option>
                          <option value="python">Python</option>
                          <option value="cpp">C++</option>
                        </select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button onClick={handleRunCode} disabled={isRunning} className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-slate-300 font-bold text-[11px] rounded-lg flex items-center transition-colors">
                          {isRunning ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Play className="w-3 h-3 mr-1" />}
                          Run
                        </button>
                        <button onClick={handleSubmitCode} disabled={isSubmitting} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-[11px] rounded-lg flex items-center transition-colors shadow-md shadow-emerald-600/20">
                          {isSubmitting ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Send className="w-3 h-3 mr-1" />}
                          Submit
                        </button>
                      </div>
                    </div>
                    {/* Code Textarea with line number gutter */}
                    <div className="flex-1 flex">
                      <div className="w-10 bg-slate-950 border-r border-slate-800 py-4 flex flex-col items-center">
                        {Array.from({ length: 20 }, (_, i) => (
                          <div key={i} className="text-[10px] text-slate-600 font-mono h-[19.2px] leading-[19.2px]">{i + 1}</div>
                        ))}
                      </div>
                      <textarea
                        value={answers[currentQ.id] || currentQ.content.starterCode || ''}
                        onChange={(e) => handleSelectAnswer(currentQ.id, e.target.value)}
                        className="flex-1 w-full p-4 bg-slate-950 text-emerald-400 focus:outline-none font-mono text-xs resize-none leading-[19.2px]"
                        spellCheck={false}
                      />
                    </div>
                  </div>
                  
                  {/* Console */}
                  <div className="h-36 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between px-3 py-1.5 bg-gradient-to-r from-slate-950 to-slate-900 border-b border-slate-800">
                      <div className="flex items-center space-x-2">
                        <Terminal className="w-3 h-3 text-slate-500" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Console</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <div className={`w-2 h-2 rounded-full ${
                          consoleStatus === 'pass' ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' 
                          : consoleStatus === 'fail' ? 'bg-red-400 shadow-sm shadow-red-400/50' 
                          : 'bg-slate-600'
                        }`} />
                        <span className={`text-[10px] font-bold ${
                          consoleStatus === 'pass' ? 'text-emerald-400' : consoleStatus === 'fail' ? 'text-red-400' : 'text-slate-600'
                        }`}>
                          {consoleStatus === 'pass' ? 'All Passed' : consoleStatus === 'fail' ? 'Failed' : 'Ready'}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 p-3 font-mono text-[11px] overflow-y-auto">
                      {codeOutput ? (
                        <div className="whitespace-pre-wrap">{renderConsoleOutput(codeOutput)}</div>
                      ) : (
                        <div className="text-slate-600 italic">Click &quot;Run&quot; to test public cases or &quot;Submit&quot; to evaluate all cases...</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
=======
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

>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
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
