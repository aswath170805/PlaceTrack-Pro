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
  Tag 
} from 'lucide-react';

export default function QuestionBanksPage() {
  const [banks, setBanks] = useState<QuestionBank[]>(MOCK_QUESTION_BANKS);
  const [questions, setQuestions] = useState<Question[]>(MOCK_QUESTIONS);
  const [selectedBankId, setSelectedBankId] = useState<string>(MOCK_QUESTION_BANKS[0].id);

  // New Question Bank Modal state
  const [showBankModal, setShowBankModal] = useState<boolean>(false);
  const [newBankTitle, setNewBankTitle] = useState<string>('');
  const [newBankTopic, setNewBankTopic] = useState<string>('');

  // New Question Modal state
  const [showQModal, setShowQModal] = useState<boolean>(false);
  const [qType, setQType] = useState<'mcq' | 'coding'>('mcq');
  const [qText, setQText] = useState<string>('');
  const [qTopic, setQTopic] = useState<string>('Data Structures');
  const [qDifficulty, setQDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [mcqOptions, setMcqOptions] = useState<string[]>(['Option A', 'Option B', 'Option C', 'Option D']);
  const [mcqCorrect, setMcqCorrect] = useState<number>(0);
  const [starterCode, setStarterCode] = useState<string>('function solution() {\n  // Code here\n}');

  const activeBank = banks.find((b) => b.id === selectedBankId) || banks[0];
  const bankQuestions = questions.filter((q) => q.bank_id === selectedBankId);

  const handleCreateBank = (e: React.FormEvent) => {
    e.preventDefault();
    const newB: QuestionBank = {
      id: 'qb-' + Math.random().toString(36).substring(2, 7),
      title: newBankTitle,
      topic: newBankTopic,
      question_count: 0,
      created_by: 'Faculty User',
    };
    setBanks([...banks, newB]);
    setSelectedBankId(newB.id);
    setShowBankModal(false);
    setNewBankTitle('');
    setNewBankTopic('');
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    const newQ: Question = {
      id: 'q-' + Math.random().toString(36).substring(2, 7),
      bank_id: selectedBankId,
      type: qType,
      topic: qTopic,
      difficulty: qDifficulty,
      content: {
        questionText: qText,
        options: qType === 'mcq' ? mcqOptions : undefined,
        correctAnswer: qType === 'mcq' ? mcqCorrect : undefined,
        starterCode: qType === 'coding' ? starterCode : undefined,
      },
      created_at: new Date().toISOString(),
    };
    setQuestions([newQ, ...questions]);
    setShowQModal(false);
    setQText('');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Placement Repository</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900">Question Banks & Item Authoring</h1>
            <p className="text-xs text-slate-500">Create, organize, and manage MCQs and coding challenges</p>
          </div>

          <button
            onClick={() => setShowBankModal(true)}
            className="inline-flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Create New Question Bank
          </button>
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
                <span className="block font-bold text-sm mb-1">{bank.title}</span>
                <div className="flex justify-between items-center text-[10px] opacity-75">
                  <span>Topic: {bank.topic}</span>
                  <span>{questions.filter((q) => q.bank_id === bank.id).length} questions</span>
                </div>
              </button>
            ))}
          </div>

          {/* Questions Panel */}
          <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-sm">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{activeBank.title}</h2>
                <span className="text-xs text-slate-500">Topic: {activeBank.topic}</span>
              </div>

              <button
                onClick={() => setShowQModal(true)}
                className="inline-flex items-center px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors"
              >
                <PlusCircle className="w-4 h-4 mr-1.5" />
                Add Question
              </button>
            </div>

            {/* Question Items List */}
            <div className="space-y-4">
              {bankQuestions.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No questions created in this bank yet. Click &quot;Add Question&quot; to author one!
                </div>
              ) : (
                bankQuestions.map((q, idx) => (
                  <div key={q.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                          Q{idx + 1}
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 bg-blue-100 text-blue-700 rounded uppercase">
                          {q.type}
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 bg-slate-200 text-slate-700 rounded capitalize">
                          {q.difficulty}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm font-semibold text-slate-900">{q.content.questionText}</p>

                    {q.type === 'mcq' && q.content.options && (
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {q.content.options.map((opt, oIdx) => (
                          <div
                            key={oIdx}
                            className={`p-2 rounded-xl border ${
                              q.content.correctAnswer === oIdx
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                                : 'bg-white border-slate-200 text-slate-600'
                            }`}
                          >
                            {String.fromCharCode(65 + oIdx)}. {opt}
                          </div>
                        ))}
                      </div>
                    )}

                    {q.type === 'coding' && (
                      <pre className="p-3 bg-slate-900 text-emerald-400 text-xs rounded-xl font-mono overflow-x-auto">
                        {q.content.starterCode}
                      </pre>
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
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Primary Topic</label>
              <input
                required
                type="text"
                value={newBankTopic}
                onChange={(e) => setNewBankTopic(e.target.value)}
                placeholder="e.g. Core CS / OS"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
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
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md"
              >
                Create Bank
              </button>
            </div>
          </form>
        </div>
      )}

      {/* New Question Authoring Modal */}
      {showQModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form onSubmit={handleAddQuestion} className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900">Author New Question</h3>
            
            <div className="grid grid-cols-2 gap-3">
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

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Question Statement</label>
              <textarea
                required
                rows={3}
                value={qText}
                onChange={(e) => setQText(e.target.value)}
                placeholder="Enter question text..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

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
                      className="w-4 h-4 text-blue-600"
                    />
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const updated = [...mcqOptions];
                        updated[idx] = e.target.value;
                        setMcqOptions(updated);
                      }}
                      className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                ))}
              </div>
            )}

            {qType === 'coding' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Starter Code Template</label>
                <textarea
                  rows={4}
                  value={starterCode}
                  onChange={(e) => setStarterCode(e.target.value)}
                  className="w-full p-3 bg-slate-900 text-emerald-400 font-mono rounded-xl text-xs"
                />
              </div>
            )}

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowQModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md"
              >
                Add Question
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
