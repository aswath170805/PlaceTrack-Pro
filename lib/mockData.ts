export interface Profile {
  id: string;
  email?: string;
  full_name: string;
  role: 'student' | 'faculty' | 'admin';
  department: string;
  year_of_study: string;
  batch_id?: string;
  phone?: string;
  avatar_url?: string;
  is_verified: boolean;
  created_at: string;
}

export interface VerificationRequest {
  id: string;
  user_id: string;
  student_name: string;
  email: string;
  role: 'student' | 'faculty';
  department: string;
  year_of_study?: string;
  batch_id?: string;
  id_card_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
}

export interface Batch {
  id: string;
  name: string;
  department?: string;
  academic_year?: string;
  created_by?: string;
  student_count?: number;
  created_at?: string;
}

export interface QuestionBank {
  id: string;
  title: string;
  topic: string;
  description?: string;
  department?: string;
<<<<<<< HEAD
  target_department?: string;
  target_year?: string;
=======
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
  question_count?: number;
  created_by: string;
  created_at?: string;
}

export interface Question {
  id: string;
  bank_id: string;
  type: 'mcq' | 'coding' | 'short_answer';
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
<<<<<<< HEAD
  target_department?: string;
  target_year?: string;
=======
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
  content: {
    questionText: string;
    options?: string[];
    correctAnswer?: string | number;
    explanation?: string;
    starterCode?: string;
<<<<<<< HEAD
    testCases?: { input: string; expectedOutput: string; isPublic?: boolean }[];
=======
    testCases?: { input: string; expectedOutput: string }[];
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
  };
  marks?: number;
  created_by?: string;
  created_at: string;
}

export interface Test {
  id: string;
  title: string;
  type: 'daily_practice' | 'weekly_assessment' | 'custom';
  batch_id?: string;
  batch_name?: string;
<<<<<<< HEAD
  target_department?: string;
  target_year?: string;
=======
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
  start_time: string;
  end_time: string;
  duration_minutes: number;
  total_marks?: number;
  passing_marks?: number;
  instructions?: string;
  created_by: string;
  is_proctored: boolean;
  is_published?: boolean;
  question_count?: number;
  created_at?: string;
}

export interface TestAttempt {
  id: string;
  test_id: string;
  test_title?: string;
  student_id: string;
  student_name?: string;
  started_at: string;
  submitted_at?: string;
  score: number;
  max_score?: number;
  status: 'in_progress' | 'submitted' | 'auto_submitted' | 'flagged';
  flag_count?: number;
  tab_switch_count?: number;
  time_spent_seconds?: number;
  feedback?: string;
}

export interface AttemptAnswer {
  id: string;
  attempt_id: string;
  question_id: string;
  student_answer: any;
  is_correct?: boolean;
  score?: number;
  time_taken_seconds?: number;
  code_output?: any;
}

export interface ProctoringEvent {
  id: string;
  attempt_id: string;
  student_name?: string;
  test_title?: string;
  event_type: 'multiple_faces' | 'no_face' | 'gaze_away' | 'phone_detected' | 'audio_noise' | 'tab_switch' | 'window_blur' | 'copy_paste';
  severity: 'low' | 'medium' | 'high';
  snapshot_url?: string;
  details?: string;
  metadata?: any;
  created_at: string;
}

export interface AttendanceRecord {
  id: string;
  student_id: string;
  student_name?: string;
  batch_id?: string;
  session_id: string;
  session_title: string;
  date?: string;
  status: 'present' | 'absent';
  absence_reason?: string;
  reviewed_by_faculty: boolean;
  reviewed_by?: string;
  review_notes?: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_id: string;
  actor_name?: string;
  action: string;
  target_table: string;
  target_id?: string;
  ip_address?: string;
  metadata?: any;
  created_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author_id?: string;
  target_batch_id?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: string;
}

export interface PlacementDrive {
  id: string;
  company_name: string;
  role_title: string;
  package_lpa?: number;
  eligible_departments?: string[];
  drive_date?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  created_by?: string;
  created_at: string;
}

// Initial Seed Data (Used by Database Seeder script)
export const SEED_BATCHES: Batch[] = [
  { id: 'b1111111-1111-1111-1111-111111111111', name: 'CS-2026 Batch A (SVCE)', department: 'Computer Science', academic_year: '2026', student_count: 45 },
  { id: 'b2222222-2222-2222-2222-222222222222', name: 'CS-2026 Batch B (SVCE)', department: 'Computer Science', academic_year: '2026', student_count: 42 },
  { id: 'b3333333-3333-3333-3333-333333333333', name: 'IT-2026 Placement Core (SVCE)', department: 'Information Technology', academic_year: '2026', student_count: 38 },
];

export const SEED_PROFILES: Profile[] = [
  {
    id: 's1111111-1111-1111-1111-111111111111',
    email: 'student@svce.ac.in',
    full_name: 'Alex Johnson',
    role: 'student',
<<<<<<< HEAD
    department: 'CSE',
    year_of_study: '4',
=======
    department: 'Computer Science',
    year_of_study: 'Final Year',
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
    batch_id: 'b1111111-1111-1111-1111-111111111111',
    is_verified: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'f2222222-2222-2222-2222-222222222222',
    email: 'faculty@svce.ac.in',
    full_name: 'Dr. Sarah Connor',
    role: 'faculty',
<<<<<<< HEAD
    department: 'CSE',
    year_of_study: 'All',
=======
    department: 'Computer Science',
    year_of_study: 'N/A',
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
    is_verified: true,
    created_at: new Date().toISOString(),
  },
  {
<<<<<<< HEAD
    id: 's4444444-4444-4444-4444-444444444444',
    email: 'rajesh@svce.ac.in',
    full_name: 'Rajesh Kumar',
    role: 'student',
    department: 'CSE',
    year_of_study: '4',
    batch_id: 'b1111111-1111-1111-1111-111111111111',
    is_verified: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 's5555555-5555-5555-5555-555555555555',
    email: 'priya@svce.ac.in',
    full_name: 'Priya Sharma',
    role: 'student',
    department: 'IT',
    year_of_study: '4',
    batch_id: 'b2222222-2222-2222-2222-222222222222',
    is_verified: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 's6666666-6666-6666-6666-666666666666',
    email: 'karthik@svce.ac.in',
    full_name: 'Karthik S',
    role: 'student',
    department: 'ECE',
    year_of_study: '4',
    batch_id: 'b3333333-3333-3333-3333-333333333333',
    is_verified: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 's7777777-7777-7777-7777-777777777777',
    email: 'divya@svce.ac.in',
    full_name: 'Divya N',
    role: 'student',
    department: 'MECH',
    year_of_study: '4',
    batch_id: 'b1111111-1111-1111-1111-111111111111',
=======
    id: 'a3333333-3333-3333-3333-333333333333',
    email: 'placetrackpro@admin.co.in',
    full_name: 'System Admin',
    role: 'admin',
    department: 'Placement Cell',
    year_of_study: 'N/A',
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
    is_verified: true,
    created_at: new Date().toISOString(),
  },
];

export const MOCK_BATCHES = SEED_BATCHES;
export const MOCK_PROFILES = SEED_PROFILES;
<<<<<<< HEAD

export const SEED_QUESTION_BANKS: QuestionBank[] = [
  {
    id: 'qb-seed-111',
    title: 'Aptitude & Core CS Prep',
    topic: 'Aptitude, OS & DBMS',
    description: 'Core questions covering Operating Systems scheduling, memory management, and general aptitude.',
    department: 'Computer Science',
    question_count: 3,
    created_by: 'f2222222-2222-2222-2222-222222222222',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'qb-seed-222',
    title: 'DS & Algorithms Core',
    topic: 'Coding Challenges',
    description: 'Handpicked data structures and algorithm challenges on Arrays, Strings, and recursion.',
    department: 'Computer Science',
    question_count: 2,
    created_by: 'f2222222-2222-2222-2222-222222222222',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

export const SEED_QUESTIONS: Question[] = [
  {
    id: 'q-seed-1',
    bank_id: 'qb-seed-111',
    type: 'mcq',
    topic: 'Operating Systems',
    difficulty: 'medium',
    content: {
      questionText: 'Which process scheduling algorithm can potentially lead to starvation?',
      options: ['Round Robin', 'First Come First Served', 'Shortest Job First', 'Priority Scheduling'],
      correctAnswer: 3,
      explanation: 'Priority scheduling algorithm can leave some low priority processes waiting indefinitely, causing starvation. High priority processes keep getting the CPU.'
    },
    marks: 10,
    created_by: 'f2222222-2222-2222-2222-222222222222',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'q-seed-2',
    bank_id: 'qb-seed-111',
    type: 'mcq',
    topic: 'Probability & Aptitude',
    difficulty: 'easy',
    content: {
      questionText: 'If a card is drawn from a well-shuffled pack of 52 cards, what is the probability of getting a Queen?',
      options: ['1/13', '1/26', '1/52', '4/13'],
      correctAnswer: 0,
      explanation: 'There are 4 Queens in a deck of 52 cards. Probability = 4/52 = 1/13.'
    },
    marks: 10,
    created_by: 'f2222222-2222-2222-2222-222222222222',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'q-seed-3',
    bank_id: 'qb-seed-111',
    type: 'mcq',
    topic: 'Operating Systems',
    difficulty: 'easy',
    content: {
      questionText: 'What is Virtual Memory?',
      options: ['Extremely large main memory', 'An illusion of an extremely large memory space provided by OS', 'A type of physical RAM expansion module', 'None of the options'],
      correctAnswer: 1,
      explanation: 'Virtual memory is a memory management capability of an OS that uses hardware and software to allow a computer to compensate for physical memory shortages, by temporarily transferring data from random access memory (RAM) to disk storage.'
    },
    marks: 10,
    created_by: 'f2222222-2222-2222-2222-222222222222',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'q-seed-4',
    bank_id: 'qb-seed-222',
    type: 'coding',
    topic: 'Arrays',
    difficulty: 'medium',
    content: {
      questionText: 'Write a function findMax(arr) that returns the maximum integer value in a given array of numbers.',
      starterCode: 'function findMax(arr) {\n  // Write your code here\n  return Math.max(...arr);\n}',
      testCases: [
        { input: '[1, 5, 3, 9, 2]', expectedOutput: '9', isPublic: true },
        { input: '[-10, -5, -20]', expectedOutput: '-5', isPublic: true },
        { input: '[100, 200, 300, 50, 400]', expectedOutput: '400', isPublic: false },
        { input: '[0]', expectedOutput: '0', isPublic: false }
      ]
    },
    marks: 20,
    created_by: 'f2222222-2222-2222-2222-222222222222',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'q-seed-5',
    bank_id: 'qb-seed-222',
    type: 'coding',
    topic: 'Strings',
    difficulty: 'easy',
    content: {
      questionText: 'Write a function isPalindrome(str) that checks if a string reads the same backwards as forwards (case-insensitive).',
      starterCode: 'function isPalindrome(str) {\n  // Write your code here\n  const clean = str.toLowerCase().replace(/[^a-z0-9]/g, "");\n  return clean === clean.split("").reverse().join("");\n}',
      testCases: [
        { input: '"racecar"', expectedOutput: 'true', isPublic: true },
        { input: '"hello"', expectedOutput: 'false', isPublic: true },
        { input: '"A man, a plan, a canal: Panama"', expectedOutput: 'true', isPublic: false },
        { input: '"No lemon, no melon"', expectedOutput: 'true', isPublic: false },
        { input: '"not a palindrome"', expectedOutput: 'false', isPublic: false }
      ]
    },
    marks: 20,
    created_by: 'f2222222-2222-2222-2222-222222222222',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

export const SEED_TESTS: Test[] = [
  {
    id: 'test-seed-11',
    title: 'Weekly TCS NQT & Wipro Prep Mock',
    type: 'weekly_assessment',
    batch_id: 'b1111111-1111-1111-1111-111111111111',
    batch_name: 'CS-2026 Batch A (SVCE)',
    target_department: 'CSE',
    target_year: '4',
    start_time: new Date(Date.now() - 86400000).toISOString(),
    end_time: new Date(Date.now() + 86400000 * 5).toISOString(),
    duration_minutes: 45,
    total_marks: 50,
    passing_marks: 20,
    instructions: '1. This is a proctored assessment. Ensure webcam is enabled.\n2. Do not switch tabs. Tab switches will be flagged.\n3. Complete all MCQ and Coding sections.',
    created_by: 'f2222222-2222-2222-2222-222222222222',
    is_proctored: true,
    is_published: true,
    question_count: 5,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'test-seed-22',
    title: 'Daily Practice - OS Starvation & Arrays',
    type: 'daily_practice',
    batch_id: 'b1111111-1111-1111-1111-111111111111',
    batch_name: 'CS-2026 Batch A (SVCE)',
    target_department: 'All',
    target_year: 'All',
    start_time: new Date(Date.now() - 86400000 * 4).toISOString(),
    end_time: new Date(Date.now() + 86400000 * 2).toISOString(),
    duration_minutes: 20,
    total_marks: 30,
    passing_marks: 12,
    instructions: 'Short continuous set for regular practice.',
    created_by: 'f2222222-2222-2222-2222-222222222222',
    is_proctored: false,
    is_published: true,
    question_count: 2,
    created_at: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: 'test-seed-33',
    title: 'AIDS 3rd Year Core AI & ML Evaluation',
    type: 'weekly_assessment',
    batch_id: 'b1111111-1111-1111-1111-111111111111',
    batch_name: 'AIDS-2027 Core',
    target_department: 'AIDS',
    target_year: '3',
    start_time: new Date(Date.now() - 86400000).toISOString(),
    end_time: new Date(Date.now() + 86400000 * 6).toISOString(),
    duration_minutes: 60,
    total_marks: 60,
    passing_marks: 24,
    instructions: 'Exclusive assessment for AIDS 3rd Year students.',
    created_by: 'f2222222-2222-2222-2222-222222222222',
    is_proctored: true,
    is_published: true,
    question_count: 4,
    created_at: new Date(Date.now() - 86400000).toISOString()
  }
];

export const SEED_TEST_ATTEMPTS: TestAttempt[] = [
  {
    id: 'attempt-seed-1',
    test_id: 'test-seed-11',
    test_title: 'Weekly TCS NQT & Wipro Prep Mock',
    student_id: 's1111111-1111-1111-1111-111111111111',
    student_name: 'Alex Johnson',
    started_at: new Date(Date.now() - 86400000 * 1.5).toISOString(),
    submitted_at: new Date(Date.now() - 86400000 * 1.5 + 25 * 60000).toISOString(),
    score: 85,
    max_score: 100,
    status: 'submitted',
    flag_count: 1,
    tab_switch_count: 1,
    time_spent_seconds: 1500,
    feedback: 'Excellent work in coding, minor error in OS aptitude.'
  },
  {
    id: 'attempt-seed-2',
    test_id: 'test-seed-11',
    test_title: 'Weekly TCS NQT & Wipro Prep Mock',
    student_id: 's4444444-4444-4444-4444-444444444444',
    student_name: 'Rajesh Kumar',
    started_at: new Date(Date.now() - 86400000 * 1.2).toISOString(),
    submitted_at: new Date(Date.now() - 86400000 * 1.2 + 30 * 60000).toISOString(),
    score: 70,
    max_score: 100,
    status: 'submitted',
    flag_count: 0,
    tab_switch_count: 0,
    time_spent_seconds: 1800,
    feedback: 'Steady attempt. Focus more on array boundary cases.'
  },
  {
    id: 'attempt-seed-3',
    test_id: 'test-seed-11',
    test_title: 'Weekly TCS NQT & Wipro Prep Mock',
    student_id: 's5555555-5555-5555-5555-555555555555',
    student_name: 'Priya Sharma',
    started_at: new Date(Date.now() - 86400000 * 0.8).toISOString(),
    submitted_at: new Date(Date.now() - 86400000 * 0.8 + 20 * 60000).toISOString(),
    score: 95,
    max_score: 100,
    status: 'submitted',
    flag_count: 3,
    tab_switch_count: 3,
    time_spent_seconds: 1200,
    feedback: 'Top performer, but flagged for multiple tab switches.'
  },
  {
    id: 'attempt-seed-4',
    test_id: 'test-seed-11',
    test_title: 'Weekly TCS NQT & Wipro Prep Mock',
    student_id: 's6666666-6666-6666-6666-666666666666',
    student_name: 'Karthik S',
    started_at: new Date(Date.now() - 86400000 * 0.5).toISOString(),
    submitted_at: new Date(Date.now() - 86400000 * 0.5 + 38 * 60000).toISOString(),
    score: 60,
    max_score: 100,
    status: 'submitted',
    flag_count: 0,
    tab_switch_count: 0,
    time_spent_seconds: 2280,
    feedback: 'Passed, but needs practice in advanced string manipulation.'
  },
  {
    id: 'attempt-seed-5',
    test_id: 'test-seed-11',
    test_title: 'Weekly TCS NQT & Wipro Prep Mock',
    student_id: 's7777777-7777-7777-7777-777777777777',
    student_name: 'Divya N',
    started_at: new Date(Date.now() - 86400000 * 0.2).toISOString(),
    submitted_at: new Date(Date.now() - 86400000 * 0.2 + 27 * 60000).toISOString(),
    score: 80,
    max_score: 100,
    status: 'submitted',
    flag_count: 1,
    tab_switch_count: 1,
    time_spent_seconds: 1620,
    feedback: 'Good overall performance. Keep it up!'
  }
];

export const SEED_PROCTORING_EVENTS: ProctoringEvent[] = [
  {
    id: 'pe-seed-1',
    attempt_id: 'attempt-seed-1',
    student_name: 'Alex Johnson',
    test_title: 'Weekly TCS NQT & Wipro Prep Mock',
    event_type: 'tab_switch',
    severity: 'medium',
    details: 'Switched tabs to search documentation.',
    created_at: new Date(Date.now() - 86400000 * 1.5 + 10 * 60000).toISOString()
  },
  {
    id: 'pe-seed-2',
    attempt_id: 'attempt-seed-3',
    student_name: 'Priya Sharma',
    test_title: 'Weekly TCS NQT & Wipro Prep Mock',
    event_type: 'tab_switch',
    severity: 'medium',
    details: 'Tab switch detected.',
    created_at: new Date(Date.now() - 86400000 * 0.8 + 5 * 60000).toISOString()
  },
  {
    id: 'pe-seed-3',
    attempt_id: 'attempt-seed-3',
    student_name: 'Priya Sharma',
    test_title: 'Weekly TCS NQT & Wipro Prep Mock',
    event_type: 'gaze_away',
    severity: 'low',
    details: 'Student looked away from screen for 5 seconds.',
    created_at: new Date(Date.now() - 86400000 * 0.8 + 12 * 60000).toISOString()
  },
  {
    id: 'pe-seed-4',
    attempt_id: 'attempt-seed-3',
    student_name: 'Priya Sharma',
    test_title: 'Weekly TCS NQT & Wipro Prep Mock',
    event_type: 'multiple_faces',
    severity: 'high',
    details: 'Another person detected in webcam view.',
    created_at: new Date(Date.now() - 86400000 * 0.8 + 15 * 60000).toISOString()
  }
];

export const SEED_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att-seed-1',
    student_id: 's1111111-1111-1111-1111-111111111111',
    student_name: 'Alex Johnson',
    batch_id: 'b1111111-1111-1111-1111-111111111111',
    session_id: 'session-seed-1',
    session_title: 'Introduction to Proctoring & Mock Rules',
    status: 'absent',
    absence_reason: 'I was representing SVCE in the National Hackathon on this day.',
    reviewed_by_faculty: false,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'att-seed-2',
    student_id: 's4444444-4444-4444-4444-444444444444',
    student_name: 'Rajesh Kumar',
    batch_id: 'b1111111-1111-1111-1111-111111111111',
    session_id: 'session-seed-1',
    session_title: 'Introduction to Proctoring & Mock Rules',
    status: 'present',
    reviewed_by_faculty: true,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

export const MOCK_QUESTION_BANKS = SEED_QUESTION_BANKS;
export const MOCK_QUESTIONS = SEED_QUESTIONS;
export const MOCK_TESTS = SEED_TESTS;
export const MOCK_TEST_ATTEMPTS = SEED_TEST_ATTEMPTS;
export const MOCK_PROCTORING_EVENTS = SEED_PROCTORING_EVENTS;
export const MOCK_ATTENDANCE = SEED_ATTENDANCE;
export const MOCK_AUDIT_LOGS: AuditLog[] = [];


=======
export const MOCK_QUESTION_BANKS: QuestionBank[] = [];
export const MOCK_QUESTIONS: Question[] = [];
export const MOCK_TESTS: Test[] = [];
export const MOCK_TEST_ATTEMPTS: TestAttempt[] = [];
export const MOCK_PROCTORING_EVENTS: ProctoringEvent[] = [];
export const MOCK_ATTENDANCE: AttendanceRecord[] = [];
export const MOCK_AUDIT_LOGS: AuditLog[] = [];

>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
