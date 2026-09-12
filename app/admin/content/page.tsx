'use client';

import React, { useState, useEffect } from 'react';
import {
  PlaceTrackStore,
  QuestionCategory,
  TestTemplate,
  StudyResource,
  Announcement,
  FAQItem
} from '@/lib/store';
import { QuestionBank, Question, Test } from '@/lib/mockData';
import {
  BookOpen,
  Plus,
  Trash2,
  Edit,
  FileSpreadsheet,
  Layers,
  FileText,
  Video,
  Bell,
  HelpCircle,
  CheckCircle2,
  Save,
  Download,
  Upload,
  ExternalLink,
  Sparkles,
  AlertCircle
} from 'lucide-react';

type ContentTab = 'banks' | 'questions' | 'categories' | 'templates' | 'resources' | 'announcements' | 'faqs';

export default function ContentManagementPage() {
  const [activeTab, setActiveTab] = useState<ContentTab>('banks');
  const [questionBanks, setQuestionBanks] = useState<QuestionBank[]>(PlaceTrackStore.questionBanks);
  const [questions, setQuestions] = useState<Question[]>(PlaceTrackStore.questions);
  const [categories, setCategories] = useState<QuestionCategory[]>(PlaceTrackStore.categories);
  const [templates, setTemplates] = useState<TestTemplate[]>(PlaceTrackStore.testTemplates);
  const [resources, setResources] = useState<StudyResource[]>(PlaceTrackStore.studyResources);
  const [announcements, setAnnouncements] = useState<Announcement[]>(PlaceTrackStore.announcements);
  const [faqs, setFaqs] = useState<FAQItem[]>(PlaceTrackStore.faqs);

  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Modals
  const [showBankModal, setShowBankModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showBulkQuestionModal, setShowBulkQuestionModal] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [showFAQModal, setShowFAQModal] = useState(false);

  // Form states
  const [bankForm, setBankForm] = useState({ title: '', topic: 'DSA', target_department: 'All Departments', target_year: 'All Years' });
  const [qForm, setQForm] = useState({ bank_id: '', topic: 'DSA', difficulty: 'medium' as 'easy' | 'medium' | 'hard', questionText: '', optionA: '', optionB: '', optionC: '', optionD: '', correctIdx: 0 });
  const [bulkCsv, setBulkCsv] = useState('');
  const [resForm, setResForm] = useState({ title: '', type: 'pdf' as any, category: 'DSA', department: 'All Departments', file_url: '' });
  const [annForm, setAnnForm] = useState({ title: '', content: '', priority: 'normal' as any, target_audience: 'all' as any, department: 'All Departments' });
  const [faqForm, setFaqForm] = useState({ question: '', answer: '', category: 'General' });

  const syncState = () => {
    setQuestionBanks([...PlaceTrackStore.questionBanks]);
    setQuestions([...PlaceTrackStore.questions]);
    setCategories([...PlaceTrackStore.categories]);
    setTemplates([...PlaceTrackStore.testTemplates]);
    setResources([...PlaceTrackStore.studyResources]);
    setAnnouncements([...PlaceTrackStore.announcements]);
    setFaqs([...PlaceTrackStore.faqs]);
  };

  useEffect(() => {
    syncState();
    const unsub = PlaceTrackStore.subscribe(() => {
      syncState();
    });
    return unsub;
  }, []);

  const notify = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  // Bank Actions
  const handleCreateBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankForm.title) return;
    PlaceTrackStore.createQuestionBank(bankForm);
    setShowBankModal(false);
    setBankForm({ title: '', topic: 'DSA', target_department: 'All Departments', target_year: 'All Years' });
    notify('Question Bank created successfully!');
  };

  const handleDeleteBank = (id: string, title: string) => {
    if (confirm(`Delete question bank "${title}" and its questions?`)) {
      PlaceTrackStore.deleteQuestionBank(id);
      notify(`Question bank "${title}" deleted.`);
    }
  };

  // Question Actions
  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qForm.questionText) return;
    PlaceTrackStore.createQuestion({
      bank_id: qForm.bank_id || questionBanks[0]?.id,
      topic: qForm.topic,
      difficulty: qForm.difficulty,
      content: {
        questionText: qForm.questionText,
        options: [qForm.optionA, qForm.optionB, qForm.optionC, qForm.optionD],
        correctAnswer: qForm.correctIdx,
      },
    });
    setShowQuestionModal(false);
    setQForm({ bank_id: '', topic: 'DSA', difficulty: 'medium', questionText: '', optionA: '', optionB: '', optionC: '', optionD: '', correctIdx: 0 });
    notify('Question added to bank!');
  };

  const handleDeleteQuestion = (id: string) => {
    if (confirm('Delete this question?')) {
      PlaceTrackStore.deleteQuestion(id);
      notify('Question deleted.');
    }
  };

  // Bulk Question Import
  const handleBulkQuestions = () => {
    if (!bulkCsv.trim()) return;
    const lines = bulkCsv.trim().split('\n');
    let imported = 0;
    lines.forEach((line, idx) => {
      if (idx === 0 && line.toLowerCase().includes('question')) return;
      const parts = line.split(';').map(p => p.trim());
      if (parts.length >= 6) {
        PlaceTrackStore.createQuestion({
          bank_id: questionBanks[0]?.id || 'qb-1',
          topic: parts[1] || 'DSA',
          difficulty: (parts[2] as any) || 'medium',
          content: {
            questionText: parts[0],
            options: [parts[3], parts[4], parts[5], parts[6] || 'None'],
            correctAnswer: parseInt(parts[7]) || 0,
          }
        });
        imported++;
      }
    });
    setShowBulkQuestionModal(false);
    setBulkCsv('');
    notify(`Bulk Import complete: ${imported} questions imported!`);
  };

  // Resource Actions
  const handleCreateResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resForm.title) return;
    PlaceTrackStore.addStudyResource(resForm);
    setShowResourceModal(false);
    setResForm({ title: '', type: 'pdf', category: 'DSA', department: 'All Departments', file_url: '' });
    notify('Study resource published to students!');
  };

  const handleDeleteResource = (id: string, title: string) => {
    if (confirm(`Remove resource "${title}"?`)) {
      PlaceTrackStore.deleteStudyResource(id);
      notify('Resource deleted.');
    }
  };

  // Announcement Actions
  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annForm.title) return;
    PlaceTrackStore.addAnnouncement(annForm);
    setShowAnnouncementModal(false);
    setAnnForm({ title: '', content: '', priority: 'normal', target_audience: 'all', department: 'All Departments' });
    notify('Announcement broadcasted to portals!');
  };

  const handleDeleteAnnouncement = (id: string) => {
    if (confirm('Delete this announcement?')) {
      PlaceTrackStore.deleteAnnouncement(id);
      notify('Announcement deleted.');
    }
  };

  // FAQ Actions
  const handleCreateFAQ = (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqForm.question) return;
    PlaceTrackStore.addFAQ(faqForm);
    setShowFAQModal(false);
    setFaqForm({ question: '', answer: '', category: 'General' });
    notify('FAQ saved!');
  };

  const handleDeleteFAQ = (id: string) => {
    if (confirm('Delete FAQ item?')) {
      PlaceTrackStore.deleteFAQ(id);
      notify('FAQ deleted.');
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Title Bar */}
      <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-indigo-100 text-indigo-900 px-3 py-1 rounded-full text-xs font-bold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Feature 3: Content Management</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Question Bank & Academic Content Repository</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Full control over question banks, CSV imports, study resources, campus announcements, test templates & FAQs
          </p>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap border-b border-slate-200 gap-1">
        {[
          { id: 'banks', label: 'Question Banks', icon: BookOpen, count: questionBanks.length },
          { id: 'questions', label: 'Question Pool', icon: FileText, count: questions.length },
          { id: 'templates', label: 'Test Templates', icon: Layers, count: templates.length },
          { id: 'resources', label: 'Study Resources (PDF/Video)', icon: Video, count: resources.length },
          { id: 'announcements', label: 'Campus Announcements', icon: Bell, count: announcements.length },
          { id: 'faqs', label: 'FAQ Knowledgebase', icon: HelpCircle, count: faqs.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ContentTab)}
              className={`flex items-center px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
                isActive
                  ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5 mr-1.5" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                  isActive ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: QUESTION BANKS */}
      {activeTab === 'banks' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900">Institutional Question Banks ({questionBanks.length})</h3>
            <button
              onClick={() => setShowBankModal(true)}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>New Question Bank</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {questionBanks.map((b) => (
              <div key={b.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
                <div>
                  <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-black rounded uppercase">
                    {b.topic}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm mt-2">{b.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-1">Author: {b.created_by}</p>
                  <p className="text-[11px] text-slate-400">Target: {b.target_department} ({b.target_year})</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600">
                    <strong>{questions.filter(q => q.bank_id === b.id).length}</strong> questions
                  </span>
                  <button
                    onClick={() => handleDeleteBank(b.id, b.title)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg"
                    title="Delete Bank"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: QUESTIONS */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">Total Authoring Pool ({questions.length})</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowBulkQuestionModal(true)}
                className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-xs"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Bulk CSV Import</span>
              </button>
              <button
                onClick={() => setShowQuestionModal(true)}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Question</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
            {questions.map((q) => (
              <div key={q.id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3 hover:bg-slate-50/50">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 bg-slate-900 text-white text-[10px] font-bold rounded uppercase">
                      {q.type}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] font-black rounded uppercase ${
                      q.difficulty === 'hard' ? 'bg-red-100 text-red-800' : q.difficulty === 'medium' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {q.difficulty}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">[{q.topic}]</span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 line-clamp-2">{q.content?.questionText}</p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg"
                    title="Delete Question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: TEST TEMPLATES */}
      {activeTab === 'templates' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Reusable Assessment Blueprints ({templates.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {templates.map((t) => (
              <div key={t.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex justify-between items-start">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-black rounded uppercase">
                    {t.category}
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">{t.duration_minutes} mins</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{t.title}</h4>
                <p className="text-xs text-slate-500">{t.description}</p>
                <div className="pt-2 border-t border-slate-100 flex justify-between text-[11px] text-slate-400">
                  <span>Questions: <strong>{t.question_count}</strong></span>
                  <span>Proctored: <strong>{t.is_proctored ? 'Yes ✓' : 'No'}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: STUDY RESOURCES */}
      {activeTab === 'resources' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900">Placement Study Materials & Lecture Guides ({resources.length})</h3>
            <button
              onClick={() => setShowResourceModal(true)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Study Resource</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.map((r) => (
              <div key={r.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
                <div>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded uppercase">
                    {r.type}
                  </span>
                  <h4 className="font-bold text-slate-900 text-xs mt-2">{r.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-1">{r.category} • {r.department}</p>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                  <a
                    href={r.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline flex items-center space-x-1"
                  >
                    <span>Access Resource</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <button
                    onClick={() => handleDeleteResource(r.id, r.title)}
                    className="p-1 text-slate-400 hover:text-red-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: CAMPUS ANNOUNCEMENTS */}
      {activeTab === 'announcements' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900">Broadcast Campus Announcements ({announcements.length})</h3>
            <button
              onClick={() => setShowAnnouncementModal(true)}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl flex items-center space-x-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>New Announcement</span>
            </button>
          </div>

          <div className="space-y-3">
            {announcements.map((a) => (
              <div
                key={a.id}
                className={`p-4 rounded-2xl border flex justify-between items-start ${
                  a.priority === 'urgent' ? 'bg-red-50/60 border-red-200' : 'bg-white border-slate-200'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      a.priority === 'urgent' ? 'bg-red-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {a.priority} Priority
                    </span>
                    <span className="text-[11px] text-slate-400">Audience: {a.target_audience} ({a.department})</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{a.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{a.content}</p>
                </div>

                <button
                  onClick={() => handleDeleteAnnouncement(a.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: FAQS */}
      {activeTab === 'faqs' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900">Support Knowledgebase FAQs ({faqs.length})</h3>
            <button
              onClick={() => setShowFAQModal(true)}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add FAQ</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
            {faqs.map((f) => (
              <div key={f.id} className="p-4 flex justify-between items-start hover:bg-slate-50/50">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">{f.category}</span>
                  <h4 className="font-bold text-xs text-slate-900">{f.question}</h4>
                  <p className="text-xs text-slate-600 mt-0.5">{f.answer}</p>
                </div>

                <button
                  onClick={() => handleDeleteFAQ(f.id)}
                  className="p-1 text-slate-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: NEW BANK */}
      {showBankModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-base font-black text-slate-900">Create New Question Bank</h3>
            <form onSubmit={handleCreateBank} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Title</label>
                <input
                  type="text"
                  placeholder="e.g. Graph Algorithms & Shortest Paths"
                  value={bankForm.title}
                  onChange={(e) => setBankForm({ ...bankForm, title: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Topic</label>
                <input
                  type="text"
                  placeholder="e.g. DSA"
                  value={bankForm.topic}
                  onChange={(e) => setBankForm({ ...bankForm, topic: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>
              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBankModal(false)}
                  className="flex-1 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-indigo-600 text-white font-bold rounded-xl"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NEW QUESTION */}
      {showQuestionModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-base font-black text-slate-900">Add Question to Bank</h3>
            <form onSubmit={handleCreateQuestion} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Select Bank</label>
                <select
                  value={qForm.bank_id}
                  onChange={(e) => setQForm({ ...qForm, bank_id: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                >
                  {questionBanks.map((b) => (
                    <option key={b.id} value={b.id}>{b.title} ({b.topic})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Question Text</label>
                <textarea
                  rows={3}
                  value={qForm.questionText}
                  onChange={(e) => setQForm({ ...qForm, questionText: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="Enter the question problem statement..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Option A"
                  value={qForm.optionA}
                  onChange={(e) => setQForm({ ...qForm, optionA: e.target.value })}
                  className="p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
                <input
                  type="text"
                  placeholder="Option B"
                  value={qForm.optionB}
                  onChange={(e) => setQForm({ ...qForm, optionB: e.target.value })}
                  className="p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
                <input
                  type="text"
                  placeholder="Option C"
                  value={qForm.optionC}
                  onChange={(e) => setQForm({ ...qForm, optionC: e.target.value })}
                  className="p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
                <input
                  type="text"
                  placeholder="Option D"
                  value={qForm.optionD}
                  onChange={(e) => setQForm({ ...qForm, optionD: e.target.value })}
                  className="p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Correct Answer Index</label>
                <select
                  value={qForm.correctIdx}
                  onChange={(e) => setQForm({ ...qForm, correctIdx: parseInt(e.target.value) })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-emerald-700"
                >
                  <option value={0}>Option A</option>
                  <option value={1}>Option B</option>
                  <option value={2}>Option C</option>
                  <option value={3}>Option D</option>
                </select>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowQuestionModal(false)}
                  className="flex-1 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-indigo-600 text-white font-bold rounded-xl"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: BULK QUESTIONS */}
      {showBulkQuestionModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-base font-black text-slate-900">Bulk Import Questions (CSV / Semicolon Delimited)</h3>
            <p className="text-xs text-slate-500">
              Format: <code>Question; Topic; Difficulty; OptA; OptB; OptC; OptD; CorrectIndex (0-3)</code>
            </p>
            <textarea
              rows={6}
              placeholder="What is time complexity of Binary Search?; DSA; easy; O(1); O(log n); O(n); O(n^2); 1"
              value={bulkCsv}
              onChange={(e) => setBulkCsv(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs"
            />
            <div className="flex space-x-2">
              <button
                onClick={() => setShowBulkQuestionModal(false)}
                className="flex-1 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkQuestions}
                className="flex-1 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs"
              >
                Import Questions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ANNOUNCEMENT */}
      {showAnnouncementModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-base font-black text-slate-900">Create Campus Announcement</h3>
            <form onSubmit={handleCreateAnnouncement} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Headline</label>
                <input
                  type="text"
                  value={annForm.title}
                  onChange={(e) => setAnnForm({ ...annForm, title: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="e.g. Cisco Technical Round Postponed to 3 PM"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Message Body</label>
                <textarea
                  rows={3}
                  value={annForm.content}
                  onChange={(e) => setAnnForm({ ...annForm, content: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Priority</label>
                  <select
                    value={annForm.priority}
                    onChange={(e) => setAnnForm({ ...annForm, priority: e.target.value as any })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent Banner</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Audience</label>
                  <select
                    value={annForm.target_audience}
                    onChange={(e) => setAnnForm({ ...annForm, target_audience: e.target.value as any })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="all">All Users</option>
                    <option value="students">Students Only</option>
                    <option value="faculty">Faculty Only</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAnnouncementModal(false)}
                  className="flex-1 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-amber-500 text-slate-950 font-black rounded-xl"
                >
                  Broadcast Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RESOURCE */}
      {showResourceModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-base font-black text-slate-900">Upload Study Resource</h3>
            <form onSubmit={handleCreateResource} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Resource Title</label>
                <input
                  type="text"
                  value={resForm.title}
                  onChange={(e) => setResForm({ ...resForm, title: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="e.g. Dynamic Programming 50 Classic Interview Questions"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Type</label>
                  <select
                    value={resForm.type}
                    onChange={(e) => setResForm({ ...resForm, type: e.target.value as any })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value="pdf">PDF Document</option>
                    <option value="video">Video URL</option>
                    <option value="doc">Word Doc</option>
                    <option value="link">Web Link</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category</label>
                  <input
                    type="text"
                    value={resForm.category}
                    onChange={(e) => setResForm({ ...resForm, category: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Resource File / Web URL</label>
                <input
                  type="text"
                  value={resForm.file_url}
                  onChange={(e) => setResForm({ ...resForm, file_url: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="https://... or /resources/file.pdf"
                  required
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowResourceModal(false)}
                  className="flex-1 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-600 text-white font-bold rounded-xl"
                >
                  Publish Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: FAQ */}
      {showFAQModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-base font-black text-slate-900">Add FAQ Entry</h3>
            <form onSubmit={handleCreateFAQ} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Question</label>
                <input
                  type="text"
                  value={faqForm.question}
                  onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Answer</label>
                <textarea
                  rows={3}
                  value={faqForm.answer}
                  onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFAQModal(false)}
                  className="flex-1 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-indigo-600 text-white font-bold rounded-xl"
                >
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
