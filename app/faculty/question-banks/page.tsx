'use client';

import React, { useState } from 'react';
import { 
  MOCK_QUESTION_BANKS, 
  MOCK_QUESTIONS, 
  QuestionBank, 
  Question 
} from '@/lib/mockData';
import { 
  BookOpen, 
  PlusCircle, 
  Code, 
  FileText, 
  CheckCircle2, 
  Trash2, 
  Edit3,
  Upload,
  Download,
  Eye,
  Lock,
  Sparkles,
  HelpCircle,
  FileCheck
} from 'lucide-react';

export default function QuestionBanksPage() {
  const [banks, setBanks] = useState<QuestionBank[]>(MOCK_QUESTION_BANKS);
  const [questions, setQuestions] = useState<Question[]>(MOCK_QUESTIONS);
  const [selectedBankId, setSelectedBankId] = useState<string>(MOCK_QUESTION_BANKS[0].id);

  // New Question Bank Modal state
  const [showBankModal, setShowBankModal] = useState<boolean>(false);
  const [newBankTitle, setNewBankTitle] = useState<string>('');
  const [newBankTopic, setNewBankTopic] = useState<string>('');
  const [newBankDept, setNewBankDept] = useState<string>('All Departments');
  const [newBankYear, setNewBankYear] = useState<string>('All Years');

  // PDF upload modal state
  const [showPdfModal, setShowPdfModal] = useState<boolean>(false);
  const [pdfFileName, setPdfFileName] = useState<string>('');
  const [pdfUploadStatus, setPdfUploadStatus] = useState<string | null>(null);

  // Question Modal state (Create & Edit)
  const [showQModal, setShowQModal] = useState<boolean>(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [qType, setQType] = useState<'mcq' | 'coding'>('mcq');
  const [qText, setQText] = useState<string>('');
  const [qTopic, setQTopic] = useState<string>('Data Structures');
  const [qDifficulty, setQDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [qDept, setQDept] = useState<string>('All Departments');
  const [qYear, setQYear] = useState<string>('All Years');
  const [mcqOptions, setMcqOptions] = useState<string[]>(['Option A', 'Option B', 'Option C', 'Option D']);
  const [mcqCorrect, setMcqCorrect] = useState<number>(0);
  const [starterCode, setStarterCode] = useState<string>('function solution(nums, target) {\n  // Implement logic\n}');
  const [testCases, setTestCases] = useState<{ input: string; expectedOutput: string; isPublic: boolean }[]>([
    { input: '[2,7,11,15], 9', expectedOutput: '[0, 1]', isPublic: true },
    { input: '[3,2,4], 6', expectedOutput: '[1, 2]', isPublic: true },
    { input: '[3,3], 6', expectedOutput: '[0, 1]', isPublic: false }
  ]);

  const activeBank = banks.find((b) => b.id === selectedBankId) || banks[0];
  const bankQuestions = questions.filter((q) => q.bank_id === selectedBankId);

  const handleCreateBank = (e: React.FormEvent) => {
    e.preventDefault();
    const newB: QuestionBank = {
      id: 'qb-' + Math.random().toString(36).substring(2, 7),
      title: newBankTitle,
      topic: newBankTopic,
      target_department: newBankDept,
      target_year: newBankYear,
      question_count: 0,
      created_by: 'Faculty User',
    };
    setBanks([...banks, newB]);
    setSelectedBankId(newB.id);
    setShowBankModal(false);
    setNewBankTitle('');
    setNewBankTopic('');
    setNewBankDept('All Departments');
    setNewBankYear('All Years');
  };

  const handleOpenAddQuestion = () => {
    setEditingQuestionId(null);
    setQType('mcq');
    setQText('');
    setQTopic(activeBank.topic || 'General');
    setQDifficulty('medium');
    setQDept(activeBank.target_department || 'All Departments');
    setQYear(activeBank.target_year || 'All Years');
    setMcqOptions(['Option A', 'Option B', 'Option C', 'Option D']);
    setMcqCorrect(0);
    setStarterCode('function solution() {\n  // Code here\n}');
    setTestCases([
      { input: '[1, 2, 3]', expectedOutput: '6', isPublic: true },
      { input: '[4, 5, 6]', expectedOutput: '15', isPublic: false }
    ]);
    setShowQModal(true);
  };

  const handleOpenEditQuestion = (q: Question) => {
    setEditingQuestionId(q.id);
    setQType(q.type === 'coding' ? 'coding' : 'mcq');
    setQText(q.content.questionText);
    setQTopic(q.topic);
    setQDifficulty(q.difficulty);
    setQDept(q.target_department || activeBank.target_department || 'All Departments');
    setQYear(q.target_year || activeBank.target_year || 'All Years');
    if (q.type === 'mcq') {
      setMcqOptions(q.content.options || ['Option A', 'Option B', 'Option C', 'Option D']);
      setMcqCorrect(typeof q.content.correctAnswer === 'number' ? q.content.correctAnswer : 0);
    } else {
      setStarterCode(q.content.starterCode || 'function solution() {}');
      if (q.content.testCases && q.content.testCases.length > 0) {
        setTestCases(q.content.testCases.map((tc) => ({
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          isPublic: tc.isPublic !== undefined ? tc.isPublic : true
        })));
      }
    }
    setShowQModal(true);
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingQuestionId) {
      // Edit existing
      setQuestions(questions.map((q) => {
        if (q.id === editingQuestionId) {
          return {
            ...q,
            type: qType,
            topic: qTopic,
            difficulty: qDifficulty,
            target_department: qDept,
            target_year: qYear,
            content: {
              ...q.content,
              questionText: qText,
              options: qType === 'mcq' ? mcqOptions : undefined,
              correctAnswer: qType === 'mcq' ? mcqCorrect : undefined,
              starterCode: qType === 'coding' ? starterCode : undefined,
              testCases: qType === 'coding' ? testCases : undefined,
            }
          };
        }
        return q;
      }));
    } else {
      // Create new
      const newQ: Question = {
        id: 'q-' + Math.random().toString(36).substring(2, 7),
        bank_id: selectedBankId,
        type: qType,
        topic: qTopic,
        difficulty: qDifficulty,
        target_department: qDept,
        target_year: qYear,
        content: {
          questionText: qText,
          options: qType === 'mcq' ? mcqOptions : undefined,
          correctAnswer: qType === 'mcq' ? mcqCorrect : undefined,
          starterCode: qType === 'coding' ? starterCode : undefined,
          testCases: qType === 'coding' ? testCases : undefined,
        },
        created_at: new Date().toISOString(),
      };
      setQuestions([newQ, ...questions]);
    }
    setShowQModal(false);
  };

  const handleAddTestCase = () => {
    setTestCases([...testCases, { input: '', expectedOutput: '', isPublic: true }]);
  };

  const handleRemoveTestCase = (index: number) => {
    setTestCases(testCases.filter((_, idx) => idx !== index));
  };

  const handleUploadPdfSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPdfUploadStatus('Processing PDF with AI extraction...');
    setTimeout(() => {
      const parsedQ: Question = {
        id: 'q-pdf-' + Date.now(),
        bank_id: selectedBankId,
        type: 'mcq',
        topic: activeBank.topic,
        difficulty: 'medium',
        content: {
          questionText: 'Extracted from PDF: What is the primary purpose of Virtual Memory in operating systems?',
          options: [
            'To extend RAM using disk storage and provide isolation',
            'To speed up CPU clock cycles',
            'To replace physical hard disks completely',
            'To encrypt system files'
          ],
          correctAnswer: 0,
          explanation: 'Virtual memory allows addressing beyond physical RAM capacity while protecting process address spaces.'
        },
        created_at: new Date().toISOString()
      };
      setQuestions([parsedQ, ...questions]);
      setPdfUploadStatus('Successfully parsed and imported 1 question into this Question Bank!');
      setTimeout(() => {
        setShowPdfModal(false);
        setPdfUploadStatus(null);
        setPdfFileName('');
      }, 1200);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Placement Question Bank & Authoring Studio</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900">Manage Question Banks & Challenges</h1>
            <p className="text-xs text-slate-500">
              Create, edit, and organize MCQs, coding challenges with public/private test cases, or upload PDF question papers
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowPdfModal(true)}
              className="inline-flex items-center px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors border border-slate-300"
            >
              <Upload className="w-4 h-4 mr-1.5 text-indigo-600" />
              Upload PDF Questions
            </button>
            <button
              onClick={() => setShowBankModal(true)}
              className="inline-flex items-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              New Question Bank
            </button>
          </div>
        </div>

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Question Banks Sidebar */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Available Banks</h3>
            {banks.map((bank) => (
              <button
                key={bank.id}
                onClick={() => setSelectedBankId(bank.id)}
                className={`w-full text-left p-4 rounded-2xl border text-xs font-medium transition-all ${
                  selectedBankId === bank.id
                    ? 'bg-slate-900 border-slate-800 text-white shadow-lg'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="block font-bold text-sm truncate">{bank.title}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    selectedBankId === bank.id ? 'bg-indigo-500/30 text-indigo-200' : 'bg-indigo-50 text-indigo-700'
                  }`}>
                    {bank.target_department || 'All Depts'}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    selectedBankId === bank.id ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {bank.target_year || 'All Years'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px] opacity-75">
                  <span>Topic: {bank.topic}</span>
                  <span className="font-mono bg-white/10 px-2 py-0.5 rounded">{questions.filter((q) => q.bank_id === bank.id).length} questions</span>
                </div>
              </button>
            ))}
          </div>

          {/* Questions Panel */}
          <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{activeBank.title}</h2>
                <div className="flex items-center space-x-2 mt-0.5">
                  <span className="text-xs text-slate-500">Domain: {activeBank.topic}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs font-semibold text-indigo-600">{bankQuestions.length} Total Items</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleOpenAddQuestion}
                  className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
                >
                  <PlusCircle className="w-4 h-4 mr-1.5" />
                  Add Question
                </button>
              </div>
            </div>

            {/* Question Items List */}
            <div className="space-y-4">
              {bankQuestions.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No questions created in this bank yet. Click &quot;Add Question&quot; or upload a PDF to author items!
                </div>
              ) : (
                bankQuestions.map((q, idx) => (
                  <div key={q.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 relative group hover:border-slate-300 transition-all">
                    
                    {/* Top metadata and Edit/Delete triggers */}
                    <div className="flex justify-between items-start">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-xs font-mono font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                          Q{idx + 1}
                        </span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${
                          q.type === 'coding' ? 'bg-indigo-100 text-indigo-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {q.type}
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 bg-slate-200 text-slate-700 rounded capitalize">
                          {q.difficulty}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {q.topic}
                        </span>
                        {(q.target_department || activeBank.target_department) && (
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded border border-indigo-150">
                            Dept: {q.target_department || activeBank.target_department}
                          </span>
                        )}
                        {(q.target_year || activeBank.target_year) && (
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200">
                            Year: {q.target_year || activeBank.target_year}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleOpenEditQuestion(q)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit Question"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(q.id)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Question"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm font-bold text-slate-900 leading-relaxed">{q.content.questionText}</p>

                    {/* MCQ Options Display */}
                    {q.type === 'mcq' && q.content.options && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                        {q.content.options.map((opt, oIdx) => (
                          <div
                            key={oIdx}
                            className={`p-2.5 rounded-xl border flex items-center justify-between ${
                              q.content.correctAnswer === oIdx
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                                : 'bg-white border-slate-200 text-slate-600'
                            }`}
                          >
                            <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                            {q.content.correctAnswer === oIdx && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Coding Workspace Display with Public/Private Test Cases */}
                    {q.type === 'coding' && (
                      <div className="space-y-2 pt-1">
                        <div className="p-3 bg-slate-950 text-emerald-400 text-xs rounded-xl font-mono overflow-x-auto">
                          {q.content.starterCode}
                        </div>
                        
                        {q.content.testCases && q.content.testCases.length > 0 && (
                          <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                              Test Cases (Evaluation Engine):
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {q.content.testCases.map((tc, tcIdx) => (
                                <div key={tcIdx} className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-[11px] font-mono space-y-0.5">
                                  <div className="flex items-center justify-between">
                                    <span className="text-slate-500 font-sans text-[10px] font-bold">Case #{tcIdx + 1}</span>
                                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase font-sans flex items-center ${
                                      tc.isPublic ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-700'
                                    }`}>
                                      {tc.isPublic ? <Eye className="w-2.5 h-2.5 mr-1" /> : <Lock className="w-2.5 h-2.5 mr-1" />}
                                      {tc.isPublic ? 'Public' : 'Private'}
                                    </span>
                                  </div>
                                  <div><strong className="text-slate-600">In:</strong> {tc.input}</div>
                                  <div><strong className="text-slate-600">Out:</strong> {tc.expectedOutput}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

          </div>

        </div>

      </div>

      {/* New Question Bank Modal */}
      {showBankModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form onSubmit={handleCreateBank} className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900">Create Question Bank</h3>
            
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Bank Title</label>
              <input
                required
                type="text"
                value={newBankTitle}
                onChange={(e) => setNewBankTitle(e.target.value)}
                placeholder="e.g. Advanced Operating Systems & Threads"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Primary Topic / Subject</label>
              <input
                required
                type="text"
                value={newBankTopic}
                onChange={(e) => setNewBankTopic(e.target.value)}
                placeholder="e.g. Core CS / OS / Data Structures"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Department</label>
                <select
                  value={newBankDept}
                  onChange={(e) => setNewBankDept(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                >
                  <option value="All Departments">All Departments</option>
                  <option value="AIDS">AIDS</option>
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="EEE">EEE</option>
                  <option value="MECH">MECH</option>
                  <option value="BIOTECH">BIOTECH</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Year</label>
                <select
                  value={newBankYear}
                  onChange={(e) => setNewBankYear(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                >
                  <option value="All Years">All Years</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowBankModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md"
              >
                Create Bank
              </button>
            </div>
          </form>
        </div>
      )}

      {/* PDF Upload Modal */}
      {showPdfModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form onSubmit={handleUploadPdfSubmit} className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <Upload className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Upload PDF Question Paper</h3>
            </div>
            
            <p className="text-xs text-slate-500">
              Upload your question document to automatically import questions into <strong>{activeBank.title}</strong>.
            </p>

            <div className="p-6 border-2 border-dashed border-indigo-200 rounded-2xl bg-indigo-50/50 text-center space-y-2">
              <FileText className="w-8 h-8 text-indigo-600 mx-auto" />
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                required
                onChange={(e) => setPdfFileName(e.target.files?.[0]?.name || 'Document.pdf')}
                className="text-xs text-slate-600 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer"
              />
              {pdfFileName && <p className="text-[11px] font-bold text-slate-700 mt-1">Selected: {pdfFileName}</p>}
            </div>

            {pdfUploadStatus && (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{pdfUploadStatus}</span>
              </div>
            )}

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowPdfModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md"
              >
                Extract & Import
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Question Authoring & Editing Modal (MCQ / Coding) */}
      {showQModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <form onSubmit={handleSaveQuestion} className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900">
              {editingQuestionId ? 'Edit Question' : 'Author New Question'}
            </h3>
            
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Type</label>
                <select
                  value={qType}
                  onChange={(e) => setQType(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                >
                  <option value="mcq">MCQ</option>
                  <option value="coding">Coding Challenge</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Topic</label>
                <input
                  type="text"
                  value={qTopic}
                  onChange={(e) => setQTopic(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Difficulty</label>
                <select
                  value={qDifficulty}
                  onChange={(e) => setQDifficulty(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Department</label>
                <select
                  value={qDept}
                  onChange={(e) => setQDept(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                >
                  <option value="All Departments">All Departments</option>
                  <option value="AIDS">AIDS</option>
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="EEE">EEE</option>
                  <option value="MECH">MECH</option>
                  <option value="BIOTECH">BIOTECH</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Year</label>
                <select
                  value={qYear}
                  onChange={(e) => setQYear(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                >
                  <option value="All Years">All Years</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Question Statement</label>
              <textarea
                required
                rows={3}
                value={qText}
                onChange={(e) => setQText(e.target.value)}
                placeholder="Enter complete problem or question text..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* MCQ Options */}
            {qType === 'mcq' && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">Options (Select radio for correct answer)</label>
                {mcqOptions.map((opt, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="correctOpt"
                      checked={mcqCorrect === idx}
                      onChange={() => setMcqCorrect(idx)}
                      className="w-4 h-4 text-indigo-600"
                    />
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const updated = [...mcqOptions];
                        updated[idx] = e.target.value;
                        setMcqOptions(updated);
                      }}
                      className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Coding Challenge Editor & Test Case Builder */}
            {qType === 'coding' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Starter Code Template</label>
                  <textarea
                    rows={4}
                    value={starterCode}
                    onChange={(e) => setStarterCode(e.target.value)}
                    className="w-full p-3 bg-slate-900 text-emerald-400 font-mono rounded-xl text-xs"
                  />
                </div>

                {/* Test Cases Builder */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700">
                      Test Cases Manager (Public & Private for LeetCode Evaluator)
                    </label>
                    <button
                      type="button"
                      onClick={handleAddTestCase}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                    >
                      + Add Test Case
                    </button>
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {testCases.map((tc, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-600">Case #{idx + 1}</span>
                          <div className="flex items-center space-x-3">
                            <label className="flex items-center space-x-1 text-xs cursor-pointer">
                              <input
                                type="checkbox"
                                checked={tc.isPublic}
                                onChange={(e) => {
                                  const updated = [...testCases];
                                  updated[idx].isPublic = e.target.checked;
                                  setTestCases(updated);
                                }}
                                className="w-3.5 h-3.5 text-indigo-600 rounded"
                              />
                              <span className="text-[11px] font-semibold text-slate-700">Public (Visible)</span>
                            </label>
                            {testCases.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveTestCase(idx)}
                                className="text-slate-400 hover:text-red-600"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Input args e.g. [2,7,11,15], 9"
                            value={tc.input}
                            onChange={(e) => {
                              const updated = [...testCases];
                              updated[idx].input = e.target.value;
                              setTestCases(updated);
                            }}
                            className="p-2 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                          />
                          <input
                            type="text"
                            placeholder="Expected output e.g. [0, 1]"
                            value={tc.expectedOutput}
                            onChange={(e) => {
                              const updated = [...testCases];
                              updated[idx].expectedOutput = e.target.value;
                              setTestCases(updated);
                            }}
                            className="p-2 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex space-x-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowQModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md"
              >
                {editingQuestionId ? 'Update Question' : 'Save Question'}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
