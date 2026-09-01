'use client';

<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DatabaseService } from '@/lib/dbService';
import { Batch, QuestionBank, Test, Question } from '@/lib/mockData';
=======
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MOCK_BATCHES, MOCK_QUESTION_BANKS, Test } from '@/lib/mockData';
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
import { 
  FileCheck2, 
  ShieldAlert, 
  Clock, 
  Users, 
  BookOpen, 
  CheckCircle2,
<<<<<<< HEAD
  ArrowLeft,
  Trash2,
  Plus,
  FileUp,
  FileText,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface QuestionDraft {
  id: string;
  type: 'mcq' | 'coding' | 'short_answer';
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  content: {
    questionText: string;
    options?: string[];
    correctAnswer?: number | string;
    starterCode?: string;
    testCases?: { input: string; expectedOutput: string }[];
  };
  marks: number;
}

interface SessionDraft {
  id: string;
  title: string;
  questionType: 'mcq' | 'coding' | 'short_answer';
  inputMethod: 'manual' | 'upload';
  uploadedFileName: string | null;
  isProcessing: boolean;
  questions: QuestionDraft[];
}

export default function CreateTestPage() {
  const router = useRouter();

  // Basic configuration state
  const [batches, setBatches] = useState<Batch[]>([]);
  const [questionBanks, setQuestionBanks] = useState<QuestionBank[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [title, setTitle] = useState<string>('');
  const [type, setType] = useState<'daily_practice' | 'weekly_assessment' | 'custom'>('weekly_assessment');
  const [batchId, setBatchId] = useState<string>('');
  const [targetDepartment, setTargetDepartment] = useState<string>('CSE');
  const [targetYear, setTargetYear] = useState<string>('3');
  const [duration, setDuration] = useState<number>(45);
  const [isProctored, setIsProctored] = useState<boolean>(true);
  const [instructions, setInstructions] = useState<string>('');

  // Multi-session state
  const [sessions, setSessions] = useState<SessionDraft[]>([
    {
      id: 'session-1',
      title: 'Session 1: Core Technical Assessment',
      questionType: 'mcq',
      inputMethod: 'manual',
      uploadedFileName: null,
      isProcessing: false,
      questions: [
        {
          id: 'q-initial-1',
          type: 'mcq',
          topic: 'General Aptitude',
          difficulty: 'medium',
          content: {
            questionText: 'Which scheduling algorithm can potentially lead to starvation?',
            options: ['Round Robin', 'First Come First Served', 'Shortest Job First', 'Priority Scheduling'],
            correctAnswer: 3
          },
          marks: 5
        }
      ]
    }
  ]);

  // Load dependency data on mount
  useEffect(() => {
    async function loadConfigData() {
      const bList = await DatabaseService.getBatches();
      const qbList = await DatabaseService.getQuestionBanks();
      setBatches(bList);
      setQuestionBanks(qbList);
      if (bList.length > 0) {
        setBatchId(bList[0].id);
      }
      setLoading(false);
    }
    loadConfigData();
  }, []);

  // Sessions actions
  const handleAddSession = () => {
    const sId = 'session-' + Date.now();
    const newSession: SessionDraft = {
      id: sId,
      title: `Session ${sessions.length + 1}: Practice & Evaluation`,
      questionType: 'mcq',
      inputMethod: 'manual',
      uploadedFileName: null,
      isProcessing: false,
      questions: []
    };
    setSessions([...sessions, newSession]);
  };

  const handleRemoveSession = (id: string) => {
    if (sessions.length <= 1) {
      alert('Your assessment must contain at least one session.');
      return;
    }
    setSessions(sessions.filter((s) => s.id !== id));
  };

  const handleUpdateSession = (id: string, updates: Partial<SessionDraft>) => {
    setSessions(
      sessions.map((s) => {
        if (s.id === id) {
          const next = { ...s, ...updates };
          // If type changes, clear questions to avoid mismatch
          if (updates.questionType && updates.questionType !== s.questionType) {
            next.questions = [];
            next.uploadedFileName = null;
          }
          return next;
        }
        return s;
      })
    );
  };

  // Add Question to a Session
  const handleAddQuestion = (sessionId: string) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (!session) return;

    const qId = 'q-draft-' + Date.now() + Math.random().toString(36).substring(2, 5);
    const newQ: QuestionDraft = {
      id: qId,
      type: session.questionType,
      topic: 'Core CS Concept',
      difficulty: 'medium',
      marks: session.questionType === 'coding' ? 20 : 5,
      content: {
        questionText: '',
        options: session.questionType === 'mcq' ? ['', '', '', ''] : undefined,
        correctAnswer: session.questionType === 'mcq' ? 0 : '',
        starterCode: session.questionType === 'coding' ? 'function solution() {\n  // Write code\n}' : undefined,
        testCases: session.questionType === 'coding' ? [{ input: '', expectedOutput: '' }] : undefined
      }
    };

    setSessions(
      sessions.map((s) => {
        if (s.id === sessionId) {
          return { ...s, questions: [...s.questions, newQ] };
        }
        return s;
      })
    );
  };

  const handleRemoveQuestion = (sessionId: string, questionId: string) => {
    setSessions(
      sessions.map((s) => {
        if (s.id === sessionId) {
          return { ...s, questions: s.questions.filter((q) => q.id !== questionId) };
        }
        return s;
      })
    );
  };

  const handleUpdateQuestion = (sessionId: string, questionId: string, updates: Partial<QuestionDraft>) => {
    setSessions(
      sessions.map((s) => {
        if (s.id === sessionId) {
          return {
            ...s,
            questions: s.questions.map((q) => {
              if (q.id === questionId) {
                return { ...q, ...updates };
              }
              return q;
            })
          };
        }
        return s;
      })
    );
  };

  // PDF Upload simulation
  const handleSimulatePDFUpload = (sessionId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    // Trigger loader
    setSessions(
      sessions.map((s) => {
        if (s.id === sessionId) {
          return { ...s, isProcessing: true, uploadedFileName: file.name };
        }
        return s;
      })
    );

    // Simulate AI parsing of document
    setTimeout(() => {
      const currentSession = sessions.find((s) => s.id === sessionId);
      if (!currentSession) return;

      const extractedQs: QuestionDraft[] = [];
      const baseId = 'q-parsed-' + Date.now();

      if (currentSession.questionType === 'mcq') {
        extractedQs.push(
          {
            id: `${baseId}-1`,
            type: 'mcq',
            topic: 'Document Extracted',
            difficulty: 'easy',
            marks: 5,
            content: {
              questionText: `[Extracted from ${file.name}] Which of the following is a key feature of virtual memory?`,
              options: [
                'Execution of larger programs than physical memory',
                'Speeds up program execution',
                'Guarantees no processes wait',
                'Allows physical size limit removal'
              ],
              correctAnswer: 0
            }
          },
          {
            id: `${baseId}-2`,
            type: 'mcq',
            topic: 'Document Extracted',
            difficulty: 'medium',
            marks: 5,
            content: {
              questionText: `[Extracted from ${file.name}] What is the primary difference between a process and a thread?`,
              options: [
                'Processes share memory address space, threads do not',
                'Threads share memory address space of the same process, processes do not',
                'Processes are light weight, threads are heavy weight',
                'None of the choices'
              ],
              correctAnswer: 1
            }
          }
        );
      } else if (currentSession.questionType === 'coding') {
        extractedQs.push({
          id: `${baseId}-1`,
          type: 'coding',
          topic: 'Coding Extraction',
          difficulty: 'medium',
          marks: 20,
          content: {
            questionText: `[Extracted Coding Task] Write a program to reverse the order of elements in an array in-place.`,
            starterCode: 'function reverseArray(arr) {\n  // Write your code here\n}',
            testCases: [
              { input: '[1, 2, 3]', expectedOutput: '[3, 2, 1]' },
              { input: '["a", "b"]', expectedOutput: '["b", "a"]' }
            ]
          }
        });
      } else {
        extractedQs.push({
          id: `${baseId}-1`,
          type: 'short_answer',
          topic: 'Theory Extraction',
          difficulty: 'easy',
          marks: 10,
          content: {
            questionText: `[Extracted Theory] Briefly define the term "Referential Integrity" in relational databases.`,
            correctAnswer: 'A condition where a foreign key value matches a primary key value in the referenced table.'
          }
        });
      }

      setSessions(
        sessions.map((s) => {
          if (s.id === sessionId) {
            return {
              ...s,
              isProcessing: false,
              questions: [...s.questions, ...extractedQs]
            };
          }
          return s;
        })
      );
    }, 1500);
  };

  // Submit test configuration
  const handlePublishAssessment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Please provide an assessment title.');
      return;
    }

    // Accumulate all questions from all sessions
    const allQuestions: QuestionDraft[] = [];
    sessions.forEach((s) => {
      allQuestions.push(...s.questions);
    });

    if (allQuestions.length === 0) {
      alert('Please add at least one question to your assessment sessions.');
      return;
    }

    const totalMarks = allQuestions.reduce((sum, q) => sum + q.marks, 0);
    const selectedBatch = batches.find(b => b.id === batchId);

    // 1. Create a question bank to host these questions
    const qbTitle = `Bank for ${title}`;
    const qbTopic = sessions.map(s => s.questionType.toUpperCase()).join(' & ');
    const bank = await DatabaseService.createQuestionBank(
      qbTitle,
      qbTopic,
      'f2222222-2222-2222-2222-222222222222',
      `Auto-generated bank for mocked assessment "${title}".`,
      targetDepartment,
      targetYear
    );

    if (!bank) {
      alert('Failed to publish. Question Bank repository creation failed.');
      return;
    }

    // 2. Create the questions inside that bank
    for (const qDraft of allQuestions) {
      await DatabaseService.createQuestion({
        bank_id: bank.id,
        type: qDraft.type,
        topic: qDraft.topic,
        difficulty: qDraft.difficulty,
        target_department: targetDepartment,
        target_year: targetYear,
        content: qDraft.content,
        marks: qDraft.marks,
        created_by: 'f2222222-2222-2222-2222-222222222222'
      });
    }

    // 3. Create the Assessment Test
    const newTest: Partial<Test> = {
      title,
      type,
      batch_id: batchId,
      batch_name: selectedBatch?.name || 'Assigned Students',
      target_department: targetDepartment,
      target_year: targetYear,
      start_time: new Date().toISOString(),
      end_time: new Date(Date.now() + 86400000 * 7).toISOString(),
      duration_minutes: duration,
      total_marks: totalMarks,
      passing_marks: Math.ceil(totalMarks * 0.4),
      instructions: instructions || 'Please complete all sessions inside the given time duration.',
      is_proctored: isProctored,
      is_published: true,
      question_count: allQuestions.length,
      created_by: 'f2222222-2222-2222-2222-222222222222'
    };

    const savedTest = await DatabaseService.createTest(newTest);

    if (savedTest) {
      router.push('/faculty');
    } else {
      alert('Error saving assessment details to database.');
    }
  };

  // Render Loader
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-slate-400 font-bold">Synchronizing assessment configurations...</span>
        </div>
      </div>
    );
  }

  // Stats calculation
  const totalQuestions = sessions.reduce((sum, s) => sum + s.questions.length, 0);
  const totalMarks = sessions.reduce((sum, s) => sum + s.questions.reduce((qSum, q) => qSum + q.marks, 0), 0);

  return (
    <div className="min-h-screen bg-slate-950 text-white py-10 px-4 sm:px-6 lg:px-8 selection:bg-blue-600 selection:text-white font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
=======
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
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
        
        {/* Navigation */}
        <button
          onClick={() => router.back()}
<<<<<<< HEAD
          className="inline-flex items-center text-xs font-bold text-slate-400 hover:text-white transition-colors"
=======
          className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Faculty Hub
        </button>

<<<<<<< HEAD
        {/* Hero title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-3xl backdrop-blur-md">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-bold text-blue-300">
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Assessment Architect</span>
            </div>
            <h1 className="text-2xl font-black text-white">Create & Configure Assessment</h1>
            <p className="text-xs text-slate-400">Design multi-session tests via question templates or automated PDF file ingestion.</p>
          </div>
          
          {/* Quick Metrics Bar */}
          <div className="flex items-center space-x-4 bg-slate-950 border border-slate-800 p-3 rounded-2xl px-5">
            <div className="text-center pr-4 border-r border-slate-800">
              <span className="block text-xl font-black text-blue-400">{totalQuestions}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Questions</span>
            </div>
            <div className="text-center">
              <span className="block text-xl font-black text-emerald-400">{totalMarks}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Total Marks</span>
            </div>
          </div>
        </div>

        {/* Wizard Form */}
        <form onSubmit={handlePublishAssessment} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Basic Details Settings */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-5 shadow-xl">
              <h3 className="text-sm font-bold text-slate-300 border-b border-slate-800 pb-3 flex items-center">
                <Sparkles className="w-4 h-4 mr-2 text-blue-400" />
                Assessment Parameters
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Assessment Title</label>
=======
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
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
                <input
                  required
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
<<<<<<< HEAD
                  placeholder="e.g. TCS NQT mock prep assessment"
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Assessment Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="weekly_assessment">Weekly Mock Assessment</option>
                  <option value="daily_practice">Daily Practice Test</option>
                  <option value="custom">Custom Evaluation Exam</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Target Student Batch</label>
                <select
                  value={batchId}
                  onChange={(e) => setBatchId(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {batches.map((b) => (
=======
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
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

<<<<<<< HEAD
              {/* Department & Year Allocation */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Allocated Department</label>
                  <select
                    value={targetDepartment}
                    onChange={(e) => setTargetDepartment(e.target.value)}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="All">All Departments</option>
                    <option value="AIDS">AIDS (AI & Data Science)</option>
                    <option value="CSE">CSE (Computer Science)</option>
                    <option value="IT">IT (Information Tech)</option>
                    <option value="ECE">ECE (Electronics)</option>
                    <option value="EEE">EEE (Electrical)</option>
                    <option value="MECH">MECH (Mechanical)</option>
                    <option value="BIOTECH">BIOTECH (Biotech)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Allocated Year</label>
                  <select
                    value={targetYear}
                    onChange={(e) => setTargetYear(e.target.value)}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="All">All Years</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year / Final Year</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Duration (Minutes)</label>
=======
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Duration (Minutes)</label>
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
                <input
                  required
                  type="number"
                  min={5}
<<<<<<< HEAD
                  max={240}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Proctoring Banner */}
              <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-amber-300">AI Proctoring Controls</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isProctored}
                    onChange={(e) => setIsProctored(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded bg-slate-950 border-slate-800"
                  />
                </div>
                <p className="text-[10px] text-amber-200/80 leading-relaxed">
                  Webcam face tracking, tab switch tracking, and window focus tracking will log real-time violations.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Test Instructions</label>
                <textarea
                  rows={4}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Enter custom instructions for students..."
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
=======
                  max={180}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
                />
              </div>
            </div>

<<<<<<< HEAD
            <button
              type="submit"
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-2xl shadow-xl shadow-blue-500/10 transition-all flex items-center justify-center"
            >
              <FileCheck2 className="w-4 h-4 mr-2" />
              Publish & Schedule Assessment
            </button>
          </div>

          {/* Right Column: Sessions Builder */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-white flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-indigo-400" />
                Assessment Session Structure
              </h3>

              <button
                type="button"
                onClick={handleAddSession}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-colors shadow-lg shadow-indigo-600/10"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Session
              </button>
            </div>

            {sessions.map((session, sIdx) => (
              <div 
                key={session.id} 
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 relative group overflow-hidden shadow-xl"
              >
                
                {/* Header of session card */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div className="flex-1 space-y-1">
                    <input
                      type="text"
                      value={session.title}
                      onChange={(e) => handleUpdateSession(session.id, { title: e.target.value })}
                      className="bg-transparent border-b border-transparent hover:border-slate-700 focus:border-blue-500 focus:outline-none text-sm font-black text-white w-full py-0.5"
                    />
                    <span className="block text-[10px] text-slate-500 font-mono">Session Index #{sIdx + 1}</span>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleRemoveSession(session.id)}
                      className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl transition-colors"
                      title="Delete Session"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Session Settings: Question Type and Input Method */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Question Type</label>
                    <select
                      value={session.questionType}
                      onChange={(e) => handleUpdateSession(session.id, { questionType: e.target.value as any })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="mcq">MCQ Questions</option>
                      <option value="coding">Coding Challenges</option>
                      <option value="short_answer">Short Answer / Theory</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Addition Mode</label>
                    <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                      <button
                        type="button"
                        onClick={() => handleUpdateSession(session.id, { inputMethod: 'manual' })}
                        className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                          session.inputMethod === 'manual' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'
                        }`}
                      >
                        Type Manual
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateSession(session.id, { inputMethod: 'upload' })}
                        className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                          session.inputMethod === 'upload' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'
                        }`}
                      >
                        Upload PDF
                      </button>
                    </div>
                  </div>
                </div>

                {/* File Upload Area */}
                {session.inputMethod === 'upload' && (
                  <div className="space-y-4">
                    <div className="p-6 border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-2xl flex flex-col items-center justify-center space-y-2 transition-colors relative bg-slate-950/40">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={(e) => handleSimulatePDFUpload(session.id, e)}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <FileUp className="w-8 h-8 text-slate-500" />
                      <span className="text-xs font-bold text-slate-300">
                        {session.uploadedFileName ? `Replace: ${session.uploadedFileName}` : 'Drag & Drop PDF or Click to Browse'}
                      </span>
                      <span className="text-[10px] text-slate-500">Supports PDF, DOCX, TXT containing exam questions</span>
                    </div>

                    {session.isProcessing && (
                      <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                          <span className="text-[11px] font-bold text-indigo-300">Parsing questions using PDF AI parser...</span>
                        </div>
                        <span className="text-[10px] text-indigo-400 font-mono">50% completed</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Question List inside Session */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400">Questions ({session.questions.length})</span>
                    {session.inputMethod === 'manual' && (
                      <button
                        type="button"
                        onClick={() => handleAddQuestion(session.id)}
                        className="inline-flex items-center text-[11px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" />
                        Add Manually
                      </button>
                    )}
                  </div>

                  {session.questions.length === 0 ? (
                    <div className="text-center py-6 text-slate-500 text-xs bg-slate-950/20 border border-slate-800 rounded-2xl">
                      {session.inputMethod === 'upload' 
                        ? 'Upload a PDF to parse questions automatically into this session' 
                        : 'No questions added. Click "Add Manually" to create some questions.'}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {session.questions.map((q, qIdx) => (
                        <div 
                          key={q.id} 
                          className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 space-y-4 relative group/q"
                        >
                          {/* Question header */}
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center space-x-2">
                              <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-bold">
                                Q{qIdx + 1}
                              </span>
                              <span className="text-[10px] font-bold uppercase bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/10">
                                {q.type}
                              </span>
                            </div>
                            
                            <button
                              type="button"
                              onClick={() => handleRemoveQuestion(session.id, q.id)}
                              className="text-slate-500 hover:text-red-400 transition-colors p-1"
                              title="Delete Question"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Editable Topic, Difficulty, Marks */}
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 mb-1">Topic</label>
                              <input
                                type="text"
                                value={q.topic}
                                onChange={(e) => handleUpdateQuestion(session.id, q.id, { topic: e.target.value })}
                                className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-xs"
                                placeholder="Topic"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 mb-1">Difficulty</label>
                              <select
                                value={q.difficulty}
                                onChange={(e) => handleUpdateQuestion(session.id, q.id, { difficulty: e.target.value as any })}
                                className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-bold"
                              >
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 mb-1">Marks</label>
                              <input
                                type="number"
                                value={q.marks}
                                onChange={(e) => handleUpdateQuestion(session.id, q.id, { marks: Number(e.target.value) })}
                                className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-bold"
                              />
                            </div>
                          </div>

                          {/* Question Text */}
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1">Question Content</label>
                            <textarea
                              rows={2}
                              value={q.content.questionText}
                              onChange={(e) => {
                                const c = { ...q.content, questionText: e.target.value };
                                handleUpdateQuestion(session.id, q.id, { content: c });
                              }}
                              placeholder="Type question statement here..."
                              className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                          </div>

                          {/* Options if MCQ */}
                          {q.type === 'mcq' && q.content.options && (
                            <div className="space-y-2">
                              <label className="block text-[10px] font-bold text-slate-500">Options (Select radio for correct answer)</label>
                              {q.content.options.map((opt, optIdx) => (
                                <div key={optIdx} className="flex items-center space-x-2">
                                  <input
                                    type="radio"
                                    name={`correctOpt-${q.id}`}
                                    checked={q.content.correctAnswer === optIdx}
                                    onChange={() => {
                                      const c = { ...q.content, correctAnswer: optIdx };
                                      handleUpdateQuestion(session.id, q.id, { content: c });
                                    }}
                                    className="w-3.5 h-3.5 text-blue-600 bg-slate-900 border-slate-800"
                                  />
                                  <input
                                    type="text"
                                    value={opt}
                                    onChange={(e) => {
                                      const updatedOpts = [...(q.content.options || [])];
                                      updatedOpts[optIdx] = e.target.value;
                                      const c = { ...q.content, options: updatedOpts };
                                      handleUpdateQuestion(session.id, q.id, { content: c });
                                    }}
                                    className="flex-1 p-2 bg-slate-900 border border-slate-800 rounded-lg text-xs"
                                    placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                                  />
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Coding specifications */}
                          {q.type === 'coding' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 mb-1">Starter Code Template</label>
                                <textarea
                                  rows={4}
                                  value={q.content.starterCode || ''}
                                  onChange={(e) => {
                                    const c = { ...q.content, starterCode: e.target.value };
                                    handleUpdateQuestion(session.id, q.id, { content: c });
                                  }}
                                  className="w-full p-2 bg-slate-900 text-emerald-400 font-mono rounded-lg text-xs"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="block text-[10px] font-bold text-slate-500">Test Cases</label>
                                {(q.content.testCases || [{ input: '', expectedOutput: '' }]).map((tc, tcIdx) => (
                                  <div key={tcIdx} className="grid grid-cols-2 gap-2 border border-slate-800 p-2 rounded-lg bg-slate-900/40">
                                    <input
                                      type="text"
                                      value={tc.input}
                                      onChange={(e) => {
                                        const nextTcs = [...(q.content.testCases || [])];
                                        nextTcs[tcIdx] = { ...nextTcs[tcIdx], input: e.target.value };
                                        const c = { ...q.content, testCases: nextTcs };
                                        handleUpdateQuestion(session.id, q.id, { content: c });
                                      }}
                                      className="p-1.5 bg-slate-900 border border-slate-800 rounded text-[11px] text-slate-300"
                                      placeholder="Input"
                                    />
                                    <input
                                      type="text"
                                      value={tc.expectedOutput}
                                      onChange={(e) => {
                                        const nextTcs = [...(q.content.testCases || [])];
                                        nextTcs[tcIdx] = { ...nextTcs[tcIdx], expectedOutput: e.target.value };
                                        const c = { ...q.content, testCases: nextTcs };
                                        handleUpdateQuestion(session.id, q.id, { content: c });
                                      }}
                                      className="p-1.5 bg-slate-900 border border-slate-800 rounded text-[11px] text-slate-300"
                                      placeholder="Expected Output"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Short answer hint */}
                          {q.type === 'short_answer' && (
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 mb-1">Expected Answer Keywords (Reference)</label>
                              <input
                                type="text"
                                value={q.content.correctAnswer || ''}
                                onChange={(e) => {
                                  const c = { ...q.content, correctAnswer: e.target.value };
                                  handleUpdateQuestion(session.id, q.id, { content: c });
                                }}
                                className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-xs"
                                placeholder="Key terms used to grade this short answer..."
                              />
                            </div>
                          )}

                        </div>
                      ))}
                    </div>
                  )}

                </div>

              </div>
            ))}

          </div>

        </form>
=======
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
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4

      </div>
    </div>
  );
}
