'use client';

<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { 
  QuestionBank, 
  Question 
} from '@/lib/mockData';
import { DatabaseService } from '@/lib/dbService';
=======
import React, { useState } from 'react';
import { 
  MOCK_QUESTION_BANKS, 
  MOCK_QUESTIONS, 
  QuestionBank, 
  Question 
} from '@/lib/mockData';
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
import { 
  BookOpen, 
  PlusCircle, 
  Code, 
  FileText, 
  CheckCircle2, 
  Trash2, 
<<<<<<< HEAD
  Tag,
  Edit2,
  FileDown,
  FileUp,
  X,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Dynamic import helpers for @react-pdf/renderer
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Define styling for the PDF export
const pdfStyles = StyleSheet.create({
  page: { 
    padding: 40, 
    backgroundColor: '#ffffff', 
    fontFamily: 'Helvetica' 
  },
  header: { 
    borderBottomWidth: 2, 
    borderBottomColor: '#1e293b', 
    paddingBottom: 12, 
    marginBottom: 25 
  },
  title: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#0f172a' 
  },
  subtitle: { 
    fontSize: 10, 
    color: '#64748b', 
    marginTop: 6,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  section: { 
    marginBottom: 20, 
    paddingBottom: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#f1f5f9' 
  },
  meta: { 
    fontSize: 9, 
    color: '#475569', 
    fontWeight: 'bold',
    marginBottom: 6,
    backgroundColor: '#f8fafc',
    padding: 4,
    borderRadius: 4
  },
  questionText: { 
    fontSize: 12, 
    color: '#0f172a', 
    lineHeight: 1.5,
    marginBottom: 10 
  },
  optionContainer: {
    marginLeft: 15,
    marginTop: 4,
    marginBottom: 4
  },
  optionText: { 
    fontSize: 10, 
    color: '#334155'
  },
  codeContainer: {
    backgroundColor: '#0f172a',
    padding: 10,
    borderRadius: 6,
    marginTop: 8
  },
  codeText: { 
    fontSize: 8, 
    fontFamily: 'Courier', 
    color: '#38bdf8'
  }
});

// PDF document component
const QuestionBankPDF = ({ bank, questions }: { bank: QuestionBank; questions: Question[] }) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      <View style={pdfStyles.header}>
        <Text style={pdfStyles.title}>{bank.title}</Text>
        <Text style={pdfStyles.subtitle}>Topic: {bank.topic} | Question Count: {questions.length}</Text>
      </View>
      {questions.map((q, idx) => (
        <View key={q.id} style={pdfStyles.section}>
          <Text style={pdfStyles.meta}>
            Question {idx + 1} ({q.type.toUpperCase()} • {q.difficulty.toUpperCase()} • {q.marks || 5} Marks)
          </Text>
          <Text style={pdfStyles.questionText}>{q.content.questionText}</Text>
          
          {q.type === 'mcq' && q.content.options && q.content.options.map((opt, oIdx) => (
            <View key={oIdx} style={pdfStyles.optionContainer}>
              <Text style={pdfStyles.optionText}>
                {String.fromCharCode(65 + oIdx)}. {opt} {q.content.correctAnswer === oIdx ? '(Correct)' : ''}
              </Text>
            </View>
          ))}
          
          {q.type === 'coding' && q.content.starterCode && (
            <View style={pdfStyles.codeContainer}>
              <Text style={pdfStyles.codeText}>{q.content.starterCode}</Text>
            </View>
          )}
        </View>
      ))}
    </Page>
  </Document>
);

export default function QuestionBanksPage() {
  const router = useRouter();

  const [banks, setBanks] = useState<QuestionBank[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedBankId, setSelectedBankId] = useState<string>('');
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
=======
  Tag 
} from 'lucide-react';

export default function QuestionBanksPage() {
  const [banks, setBanks] = useState<QuestionBank[]>(MOCK_QUESTION_BANKS);
  const [questions, setQuestions] = useState<Question[]>(MOCK_QUESTIONS);
  const [selectedBankId, setSelectedBankId] = useState<string>(MOCK_QUESTION_BANKS[0].id);
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4

  // New Question Bank Modal state
  const [showBankModal, setShowBankModal] = useState<boolean>(false);
  const [newBankTitle, setNewBankTitle] = useState<string>('');
  const [newBankTopic, setNewBankTopic] = useState<string>('');
<<<<<<< HEAD
  const [newBankDept, setNewBankDept] = useState<string>('CSE');
  const [newBankYear, setNewBankYear] = useState<string>('3');

  // Edit Question Bank Modal state
  const [showEditBankModal, setShowEditBankModal] = useState<boolean>(false);
  const [editBankId, setEditBankId] = useState<string>('');
  const [editBankTitle, setEditBankTitle] = useState<string>('');
  const [editBankTopic, setEditBankTopic] = useState<string>('');
  const [editBankDept, setEditBankDept] = useState<string>('CSE');
  const [editBankYear, setEditBankYear] = useState<string>('3');

  // New Question Modal state
  const [showQModal, setShowQModal] = useState<boolean>(false);
  const [qType, setQType] = useState<'mcq' | 'coding' | 'short_answer'>('mcq');
  const [qText, setQText] = useState<string>('');
  const [qTopic, setQTopic] = useState<string>('Data Structures');
  const [qDifficulty, setQDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [qMarks, setQMarks] = useState<number>(5);
  const [mcqOptions, setMcqOptions] = useState<string[]>(['Option A', 'Option B', 'Option C', 'Option D']);
  const [mcqCorrect, setMcqCorrect] = useState<number>(0);
  const [starterCode, setStarterCode] = useState<string>('function solution() {\n  // Code here\n}');
  const [testCases, setTestCases] = useState<{input: string; expectedOutput: string; isPublic: boolean}[]>([{input: '', expectedOutput: '', isPublic: true}]);
  const [shortAnswerCorrect, setShortAnswerCorrect] = useState<string>('');

  // Edit Question Modal state
  const [showEditQModal, setShowEditQModal] = useState<boolean>(false);
  const [editQId, setEditQId] = useState<string>('');
  const [editQType, setEditQType] = useState<'mcq' | 'coding' | 'short_answer'>('mcq');
  const [editQText, setEditQText] = useState<string>('');
  const [editQTopic, setEditQTopic] = useState<string>('');
  const [editQDifficulty, setEditQDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [editQMarks, setEditQMarks] = useState<number>(5);
  const [editMcqOptions, setEditMcqOptions] = useState<string[]>([]);
  const [editMcqCorrect, setEditMcqCorrect] = useState<number>(0);
  const [editStarterCode, setEditStarterCode] = useState<string>('');
  const [editTestCases, setEditTestCases] = useState<{input: string; expectedOutput: string; isPublic: boolean}[]>([]);
  const [editShortAnswerCorrect, setEditShortAnswerCorrect] = useState<string>('');

  // PDF ingestion state
  const [isUploadingPDF, setIsUploadingPDF] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
=======

  // New Question Modal state
  const [showQModal, setShowQModal] = useState<boolean>(false);
  const [qType, setQType] = useState<'mcq' | 'coding'>('mcq');
  const [qText, setQText] = useState<string>('');
  const [qTopic, setQTopic] = useState<string>('Data Structures');
  const [qDifficulty, setQDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [mcqOptions, setMcqOptions] = useState<string[]>(['Option A', 'Option B', 'Option C', 'Option D']);
  const [mcqCorrect, setMcqCorrect] = useState<number>(0);
  const [starterCode, setStarterCode] = useState<string>('function solution() {\n  // Code here\n}');
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4

  const activeBank = banks.find((b) => b.id === selectedBankId) || banks[0];
  const bankQuestions = questions.filter((q) => q.bank_id === selectedBankId);

<<<<<<< HEAD
  // Sync state with DatabaseService
  async function loadData() {
    const b = await DatabaseService.getQuestionBanks();
    const q = await DatabaseService.getQuestions();
    setBanks(b);
    setQuestions(q);
    if (b.length > 0 && !selectedBankId) {
      setSelectedBankId(b[0].id);
    }
    setLoading(false);
  }

  useEffect(() => {
    setIsMounted(true);
    loadData();
  }, []);

  const handleCreateBank = async (e: React.FormEvent) => {
    e.preventDefault();
    const bank = await DatabaseService.createQuestionBank(
      newBankTitle,
      newBankTopic,
      'f2222222-2222-2222-2222-222222222222',
      `Question Bank for topic ${newBankTopic}`,
      newBankDept,
      newBankYear
    );
    if (bank) {
      await loadData();
      setSelectedBankId(bank.id);
      setShowBankModal(false);
      setNewBankTitle('');
      setNewBankTopic('');
    }
  };

  const handleOpenEditBank = (bank: QuestionBank, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditBankId(bank.id);
    setEditBankTitle(bank.title);
    setEditBankTopic(bank.topic);
    setEditBankDept(bank.target_department || 'All');
    setEditBankYear(bank.target_year || 'All');
    setShowEditBankModal(true);
  };

  const handleSaveEditBank = async (e: React.FormEvent) => {
    e.preventDefault();
    const bank = await DatabaseService.updateQuestionBank(editBankId, {
      title: editBankTitle,
      topic: editBankTopic,
      target_department: editBankDept,
      target_year: editBankYear
    });
    if (bank) {
      await loadData();
      setShowEditBankModal(false);
    }
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    const content: any = { questionText: qText };
    if (qType === 'mcq') {
      content.options = mcqOptions;
      content.correctAnswer = mcqCorrect;
    } else if (qType === 'coding') {
      content.starterCode = starterCode;
      content.testCases = testCases;
    } else if (qType === 'short_answer') {
      content.correctAnswer = shortAnswerCorrect;
    }

    const q = await DatabaseService.createQuestion({
=======
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
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
      bank_id: selectedBankId,
      type: qType,
      topic: qTopic,
      difficulty: qDifficulty,
<<<<<<< HEAD
      content,
      marks: qMarks,
      created_by: 'f2222222-2222-2222-2222-222222222222'
    });

    if (q) {
      await loadData();
      setShowQModal(false);
      setQText('');
      setStarterCode('function solution() {\n  // Code here\n}');
      setTestCases([{input: '', expectedOutput: '', isPublic: true}]);
      setShortAnswerCorrect('');
    }
  };

  const handleOpenEditQuestion = (q: Question) => {
    setEditQId(q.id);
    setEditQType(q.type);
    setEditQText(q.content.questionText);
    setEditQTopic(q.topic);
    setEditQDifficulty(q.difficulty);
    setEditQMarks(q.marks || 5);
    setEditMcqOptions(q.content.options || ['Option A', 'Option B', 'Option C', 'Option D']);
    setEditMcqCorrect(typeof q.content.correctAnswer === 'number' ? q.content.correctAnswer : 0);
    setEditStarterCode(q.content.starterCode || '');
    setEditTestCases(q.content.testCases ? q.content.testCases.map(tc => ({...tc, isPublic: tc.isPublic ?? true})) : []);
    setEditShortAnswerCorrect(typeof q.content.correctAnswer === 'string' ? q.content.correctAnswer : '');
    setShowEditQModal(true);
  };

  const handleSaveEditQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    const content: any = { questionText: editQText };
    if (editQType === 'mcq') {
      content.options = editMcqOptions;
      content.correctAnswer = editMcqCorrect;
    } else if (editQType === 'coding') {
      content.starterCode = editStarterCode;
      content.testCases = editTestCases;
    } else if (editQType === 'short_answer') {
      content.correctAnswer = editShortAnswerCorrect;
    }

    const q = await DatabaseService.updateQuestion(editQId, {
      type: editQType,
      topic: editQTopic,
      difficulty: editQDifficulty,
      marks: editQMarks,
      content
    });

    if (q) {
      await loadData();
      setShowEditQModal(false);
    }
  };

  // Simulated PDF question sheets parsing
  const handleSimulatePDFUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    setIsUploadingPDF(true);
    setUploadProgress('Analyzing file structures...');

    setTimeout(() => {
      setUploadProgress('Extracting key semantic question items...');
      setTimeout(async () => {
        // Generate extracted mock questions based on active bank topic
        const mockExtracted: Partial<Question>[] = [
          {
            bank_id: selectedBankId,
            type: 'mcq',
            topic: activeBank.topic,
            difficulty: 'medium',
            content: {
              questionText: `[PDF Extracted MCQ] What is the worst-case space complexity of a Hash Table?`,
              options: ['O(1)', 'O(log N)', 'O(N)', 'O(N^2)'],
              correctAnswer: 2,
              explanation: 'In the worst case where all elements hash to the same bucket, it requires linear storage.'
            },
            marks: 5
          },
          {
            bank_id: selectedBankId,
            type: 'coding',
            topic: activeBank.topic,
            difficulty: 'hard',
            content: {
              questionText: `[PDF Extracted Coding] Write a function mergeSortedArrays(arr1, arr2) that merges two sorted arrays and returns a single sorted array.`,
              starterCode: 'function mergeSortedArrays(arr1, arr2) {\n  // Write code here\n  return [...arr1, ...arr2].sort((a,b) => a - b);\n}',
              testCases: [{ input: '[1,3], [2,4]', expectedOutput: '[1,2,3,4]' }]
            },
            marks: 20
          }
        ];

        for (const qObj of mockExtracted) {
          await DatabaseService.createQuestion(qObj);
        }

        setIsUploadingPDF(false);
        setUploadProgress('');
        await loadData();
      }, 1000);
    }, 800);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-slate-400 font-bold">Synchronizing question bank databases...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white py-10 px-4 sm:px-6 lg:px-8 selection:bg-blue-600 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Navigation */}
        <button
          onClick={() => router.push('/faculty')}
          className="inline-flex items-center text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Faculty Hub
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-3xl backdrop-blur-md">
          <div>
            <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-bold text-blue-300 mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Placement Repository</span>
            </div>
            <h1 className="text-2xl font-black text-white">Question Banks & Item Authoring</h1>
            <p className="text-xs text-slate-400">Manage questions repositories, simulate PDF imports, and edit details.</p>
=======
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
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
          </div>

          <button
            onClick={() => setShowBankModal(true)}
<<<<<<< HEAD
            className="inline-flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-600/10 transition-all shrink-0"
=======
            className="inline-flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Create New Question Bank
          </button>
        </div>

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Question Banks Sidebar */}
          <div className="lg:col-span-1 space-y-3">
<<<<<<< HEAD
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Available Banks</h3>
=======
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Available Banks</h3>
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
            {banks.map((bank) => (
              <button
                key={bank.id}
                onClick={() => setSelectedBankId(bank.id)}
<<<<<<< HEAD
                className={`w-full text-left p-4 rounded-2xl border text-xs font-medium transition-all relative group/btn ${
                  selectedBankId === bank.id
                    ? 'bg-gradient-to-r from-slate-900 to-indigo-950/80 border-indigo-500/30 text-white shadow-xl shadow-indigo-600/5'
                    : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-900'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="block font-black text-sm mb-1 pr-6">{bank.title}</span>
                  <Edit2 
                    className="w-3.5 h-3.5 text-slate-400 hover:text-white absolute right-4 top-4"
                    onClick={(e) => handleOpenEditBank(bank, e)}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] opacity-75 mt-3">
                  <span>Topic: {bank.topic}</span>
                  <div className="flex space-x-1">
                    <span className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">{bank.target_department || 'All'}</span>
                    <span className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">Yr {bank.target_year || 'All'}</span>
                  </div>
                  <span className="font-bold text-indigo-300">
                    {questions.filter((q) => q.bank_id === bank.id).length} items
                  </span>
=======
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
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
                </div>
              </button>
            ))}
          </div>

          {/* Questions Panel */}
<<<<<<< HEAD
          {activeBank && (
            <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl relative">
              
              {/* Active Bank Header Details */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-5 border-b border-slate-800">
                <div>
                  <h2 className="text-lg font-black text-white">{activeBank.title}</h2>
                  <span className="text-xs text-slate-400">Primary Topic: {activeBank.topic}</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Download PDF button (isMounted guards from Next.js server-side crashes) */}
                  {isMounted && (
                    <PDFDownloadLink 
                      document={<QuestionBankPDF bank={activeBank} questions={bankQuestions} />} 
                      fileName={`${activeBank.title.replace(/\s+/g, '_')}_questions.pdf`}
                      className="inline-flex items-center px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-colors"
                    >
                      Download PDF
                    </PDFDownloadLink>
                  )}

                  <button
                    onClick={() => setShowQModal(true)}
                    className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/10 transition-colors"
                  >
                    <PlusCircle className="w-4 h-4 mr-1.5" />
                    Add Question
                  </button>
                </div>
              </div>

              {/* Ingest PDF Sim File Card */}
              <div className="p-5 bg-gradient-to-r from-indigo-950/40 via-slate-950/50 to-slate-950 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <FileUp className="w-4 h-4 text-indigo-400" />
                    <h4 className="text-xs font-bold text-slate-200">Import Questions Sheet (PDF)</h4>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed max-w-md">
                    Instantly load mock questions from external syllabus PDFs to this bank using our AI parser.
                  </p>
                </div>

                <div className="relative shrink-0 w-full md:w-auto">
                  <input
                    type="file"
                    accept=".pdf,.doc,.txt"
                    onChange={handleSimulatePDFUpload}
                    disabled={isUploadingPDF}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full"
                  />
                  <button
                    disabled={isUploadingPDF}
                    className="w-full md:w-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold border border-slate-700 rounded-xl transition-colors"
                  >
                    {isUploadingPDF ? 'Uploading file...' : 'Choose File'}
                  </button>
                </div>
              </div>

              {isUploadingPDF && (
                <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold rounded-xl animate-pulse flex items-center space-x-2">
                  <div className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                  <span>{uploadProgress}</span>
                </div>
              )}

              {/* Question Items List */}
              <div className="space-y-4">
                {bankQuestions.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-xs bg-slate-950/20 border border-slate-800 rounded-2xl">
                    No questions created in this bank yet. Click &quot;Add Question&quot; or upload a syllabus PDF sheet!
                  </div>
                ) : (
                  bankQuestions.map((q, idx) => (
                    <div key={q.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 relative group/item">
                      
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-mono font-bold bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded">
                            Q{idx + 1}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded uppercase border border-blue-500/10">
                            {q.type}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-800 text-slate-400 rounded capitalize">
                            {q.difficulty}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-500/10 text-indigo-300 rounded">
                            {q.marks || 5} marks
                          </span>
                        </div>

                        <button
                          onClick={() => handleOpenEditQuestion(q)}
                          className="inline-flex items-center px-2 py-1 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-[10px] font-bold rounded-lg transition-colors"
                        >
                          <Edit2 className="w-3 h-3 mr-1" />
                          Edit Item
                        </button>
                      </div>

                      <p className="text-xs font-bold text-slate-200">{q.content.questionText}</p>

                      {q.type === 'mcq' && q.content.options && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {q.content.options.map((opt, oIdx) => (
                            <div
                              key={oIdx}
                              className={`p-2.5 rounded-xl border ${
                                q.content.correctAnswer === oIdx
                                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-bold'
                                  : 'bg-slate-900/60 border-slate-800/80 text-slate-400'
                              }`}
                            >
                              {String.fromCharCode(65 + oIdx)}. {opt}
                            </div>
                          ))}
                        </div>
                      )}

                      {q.type === 'coding' && (
                        <pre className="p-3 bg-slate-950 text-emerald-400 text-[10px] rounded-xl font-mono overflow-x-auto border border-slate-800">
                          {q.content.starterCode}
                        </pre>
                      )}

                      {q.type === 'short_answer' && q.content.correctAnswer && (
                        <div className="p-2.5 bg-slate-900/40 border border-slate-800/80 text-slate-400 text-xs rounded-xl italic">
                          Grading Keyword: {q.content.correctAnswer}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

            </div>
          )}
=======
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
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4

        </div>

      </div>

      {/* New Question Bank Modal */}
      {showBankModal && (
<<<<<<< HEAD
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form onSubmit={handleCreateBank} className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="text-base font-black text-white">Create Question Bank</h3>
              <X className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer" onClick={() => setShowBankModal(false)} />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Bank Title</label>
=======
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form onSubmit={handleCreateBank} className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900">Create Question Bank</h3>
            
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Bank Title</label>
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
              <input
                required
                type="text"
                value={newBankTitle}
                onChange={(e) => setNewBankTitle(e.target.value)}
                placeholder="e.g. Advanced Operating Systems & Threads"
<<<<<<< HEAD
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
=======
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
              />
            </div>

            <div>
<<<<<<< HEAD
              <label className="block text-xs font-bold text-slate-400 mb-1">Primary Topic</label>
=======
              <label className="block text-xs font-bold text-slate-700 mb-1">Primary Topic</label>
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
              <input
                required
                type="text"
                value={newBankTopic}
                onChange={(e) => setNewBankTopic(e.target.value)}
                placeholder="e.g. Core CS / OS"
<<<<<<< HEAD
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Target Department</label>
                <select
                  value={newBankDept}
                  onChange={(e) => setNewBankDept(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="All">All Departments</option>
                  <option value="AIDS">AIDS</option>
                  <option value="CSE">CSE</option>
                  <option value="IT">IT</option>
                  <option value="ECE">ECE</option>
                  <option value="EEE">EEE</option>
                  <option value="MECH">MECH</option>
                  <option value="BIOTECH">BIOTECH</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Target Year</label>
                <select
                  value={newBankYear}
                  onChange={(e) => setNewBankYear(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="All">All Years</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>
            </div>

=======
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowBankModal(false)}
<<<<<<< HEAD
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl"
=======
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
              >
                Cancel
              </button>
              <button
                type="submit"
<<<<<<< HEAD
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/10"
=======
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md"
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
              >
                Create Bank
              </button>
            </div>
          </form>
        </div>
      )}

<<<<<<< HEAD
      {/* Edit Question Bank Modal */}
      {showEditBankModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form onSubmit={handleSaveEditBank} className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="text-base font-black text-white">Edit Question Bank</h3>
              <X className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer" onClick={() => setShowEditBankModal(false)} />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Bank Title</label>
              <input
                required
                type="text"
                value={editBankTitle}
                onChange={(e) => setEditBankTitle(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Primary Topic</label>
              <input
                required
                type="text"
                value={editBankTopic}
                onChange={(e) => setEditBankTopic(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Target Department</label>
                <select
                  value={editBankDept}
                  onChange={(e) => setEditBankDept(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="All">All Departments</option>
                  <option value="AIDS">AIDS</option>
                  <option value="CSE">CSE</option>
                  <option value="IT">IT</option>
                  <option value="ECE">ECE</option>
                  <option value="EEE">EEE</option>
                  <option value="MECH">MECH</option>
                  <option value="BIOTECH">BIOTECH</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Target Year</label>
                <select
                  value={editBankYear}
                  onChange={(e) => setEditBankYear(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="All">All Years</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowEditBankModal(false)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/10"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* New Question Authoring Modal */}
      {showQModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form onSubmit={handleAddQuestion} className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="text-base font-black text-white">Author New Question</h3>
              <X className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer" onClick={() => setShowQModal(false)} />
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Type</label>
                <select
                  value={qType}
                  onChange={(e) => setQType(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold"
                >
                  <option value="mcq">MCQ</option>
                  <option value="coding">Coding Challenge</option>
                  <option value="short_answer">Short Answer</option>
=======
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
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
                </select>
              </div>

              <div>
<<<<<<< HEAD
                <label className="block text-xs font-bold text-slate-400 mb-1">Difficulty</label>
                <select
                  value={qDifficulty}
                  onChange={(e) => setQDifficulty(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold"
=======
                <label className="block text-xs font-bold text-slate-700 mb-1">Difficulty</label>
                <select
                  value={qDifficulty}
                  onChange={(e) => setQDifficulty(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
<<<<<<< HEAD

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Marks</label>
                <input
                  type="number"
                  value={qMarks}
                  onChange={(e) => setQMarks(Number(e.target.value))}
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Question Statement</label>
=======
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Question Statement</label>
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
              <textarea
                required
                rows={3}
                value={qText}
                onChange={(e) => setQText(e.target.value)}
                placeholder="Enter question text..."
<<<<<<< HEAD
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
=======
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
              />
            </div>

            {qType === 'mcq' && (
              <div className="space-y-2">
<<<<<<< HEAD
                <label className="block text-xs font-bold text-slate-400">Options (Select radio for correct answer)</label>
=======
                <label className="block text-xs font-bold text-slate-700">Options (Select radio for correct answer)</label>
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
                {mcqOptions.map((opt, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="correctOpt"
                      checked={mcqCorrect === idx}
                      onChange={() => setMcqCorrect(idx)}
<<<<<<< HEAD
                      className="w-4 h-4 text-blue-600 bg-slate-950 border-slate-800"
=======
                      className="w-4 h-4 text-blue-600"
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
                    />
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const updated = [...mcqOptions];
                        updated[idx] = e.target.value;
                        setMcqOptions(updated);
                      }}
<<<<<<< HEAD
                      className="flex-1 p-2 bg-slate-950 border border-slate-800 rounded-lg text-xs"
=======
                      className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
                    />
                  </div>
                ))}
              </div>
            )}

            {qType === 'coding' && (
<<<<<<< HEAD
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Starter Code Template</label>
                  <textarea
                    rows={4}
                    value={starterCode}
                    onChange={(e) => setStarterCode(e.target.value)}
                    className="w-full p-3 bg-slate-950 text-emerald-400 font-mono rounded-xl text-xs"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-bold text-slate-400">Test Cases</label>
                    <button type="button" onClick={() => setTestCases([...testCases, {input: '', expectedOutput: '', isPublic: false}])} className="text-[10px] bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 px-2.5 py-1.5 rounded flex items-center font-bold transition-colors">
                      <PlusCircle className="w-3 h-3 mr-1" /> Add Case
                    </button>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {testCases.map((tc, idx) => (
                      <div key={idx} className="bg-slate-950 border border-slate-800 p-3 rounded-xl space-y-2 relative group">
                        <button type="button" onClick={() => setTestCases(testCases.filter((_, i) => i !== idx))} className="absolute top-2 right-2 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-red-400/10 rounded">
                          <Trash2 className="w-3 h-3" />
                        </button>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1">Input</label>
                            <input type="text" value={tc.input} onChange={(e) => { const nt = [...testCases]; nt[idx].input = e.target.value; setTestCases(nt); }} className="w-full p-2 bg-slate-900 border border-slate-800 rounded font-mono text-xs focus:ring-1 focus:ring-blue-500 outline-none" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1">Expected Output</label>
                            <input type="text" value={tc.expectedOutput} onChange={(e) => { const nt = [...testCases]; nt[idx].expectedOutput = e.target.value; setTestCases(nt); }} className="w-full p-2 bg-slate-900 border border-slate-800 rounded font-mono text-xs focus:ring-1 focus:ring-blue-500 outline-none" />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 pt-1">
                          <input type="checkbox" checked={tc.isPublic} onChange={(e) => { const nt = [...testCases]; nt[idx].isPublic = e.target.checked; setTestCases(nt); }} className="w-3 h-3 accent-blue-500" />
                          <span className="text-[10px] font-bold text-slate-400">Public (Visible to students on run)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {qType === 'short_answer' && (
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Expected Correct Keyphrase</label>
                <input
                  type="text"
                  value={shortAnswerCorrect}
                  onChange={(e) => setShortAnswerCorrect(e.target.value)}
                  placeholder="e.g. Referential Integrity"
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
=======
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Starter Code Template</label>
                <textarea
                  rows={4}
                  value={starterCode}
                  onChange={(e) => setStarterCode(e.target.value)}
                  className="w-full p-3 bg-slate-900 text-emerald-400 font-mono rounded-xl text-xs"
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
                />
              </div>
            )}

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowQModal(false)}
<<<<<<< HEAD
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl"
=======
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
              >
                Cancel
              </button>
              <button
                type="submit"
<<<<<<< HEAD
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/10"
=======
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md"
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
              >
                Add Question
              </button>
            </div>
          </form>
        </div>
      )}

<<<<<<< HEAD
      {/* Edit Question Modal */}
      {showEditQModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form onSubmit={handleSaveEditQuestion} className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="text-base font-black text-white">Edit Question Details</h3>
              <X className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer" onClick={() => setShowEditQModal(false)} />
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Type</label>
                <select
                  value={editQType}
                  onChange={(e) => setEditQType(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold"
                >
                  <option value="mcq">MCQ</option>
                  <option value="coding">Coding Challenge</option>
                  <option value="short_answer">Short Answer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Difficulty</label>
                <select
                  value={editQDifficulty}
                  onChange={(e) => setEditQDifficulty(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Marks</label>
                <input
                  type="number"
                  value={editQMarks}
                  onChange={(e) => setEditQMarks(Number(e.target.value))}
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Question Statement</label>
              <textarea
                required
                rows={3}
                value={editQText}
                onChange={(e) => setEditQText(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {editQType === 'mcq' && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-400">Options (Select radio for correct answer)</label>
                {editMcqOptions.map((opt, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="editCorrectOpt"
                      checked={editMcqCorrect === idx}
                      onChange={() => setEditMcqCorrect(idx)}
                      className="w-4 h-4 text-blue-600 bg-slate-950 border-slate-800"
                    />
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const updated = [...editMcqOptions];
                        updated[idx] = e.target.value;
                        setEditMcqOptions(updated);
                      }}
                      className="flex-1 p-2 bg-slate-950 border border-slate-800 rounded-lg text-xs"
                    />
                  </div>
                ))}
              </div>
            )}

            {editQType === 'coding' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Starter Code Template</label>
                  <textarea
                    rows={4}
                    value={editStarterCode}
                    onChange={(e) => setEditStarterCode(e.target.value)}
                    className="w-full p-3 bg-slate-950 text-emerald-400 font-mono rounded-xl text-xs"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-bold text-slate-400">Test Cases</label>
                    <button type="button" onClick={() => setEditTestCases([...editTestCases, {input: '', expectedOutput: '', isPublic: false}])} className="text-[10px] bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 px-2.5 py-1.5 rounded flex items-center font-bold transition-colors">
                      <PlusCircle className="w-3 h-3 mr-1" /> Add Case
                    </button>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {editTestCases.map((tc, idx) => (
                      <div key={idx} className="bg-slate-950 border border-slate-800 p-3 rounded-xl space-y-2 relative group">
                        <button type="button" onClick={() => setEditTestCases(editTestCases.filter((_, i) => i !== idx))} className="absolute top-2 right-2 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-red-400/10 rounded">
                          <Trash2 className="w-3 h-3" />
                        </button>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1">Input</label>
                            <input type="text" value={tc.input} onChange={(e) => { const nt = [...editTestCases]; nt[idx].input = e.target.value; setEditTestCases(nt); }} className="w-full p-2 bg-slate-900 border border-slate-800 rounded font-mono text-xs focus:ring-1 focus:ring-blue-500 outline-none" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1">Expected Output</label>
                            <input type="text" value={tc.expectedOutput} onChange={(e) => { const nt = [...editTestCases]; nt[idx].expectedOutput = e.target.value; setEditTestCases(nt); }} className="w-full p-2 bg-slate-900 border border-slate-800 rounded font-mono text-xs focus:ring-1 focus:ring-blue-500 outline-none" />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 pt-1">
                          <input type="checkbox" checked={tc.isPublic} onChange={(e) => { const nt = [...editTestCases]; nt[idx].isPublic = e.target.checked; setEditTestCases(nt); }} className="w-3 h-3 accent-blue-500" />
                          <span className="text-[10px] font-bold text-slate-400">Public (Visible to students on run)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {editQType === 'short_answer' && (
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Expected Correct Keyphrase</label>
                <input
                  type="text"
                  value={editShortAnswerCorrect}
                  onChange={(e) => setEditShortAnswerCorrect(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            )}

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowEditQModal(false)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/10"
              >
                Save Question
              </button>
            </div>
          </form>
        </div>
      )}

=======
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
    </div>
  );
}
