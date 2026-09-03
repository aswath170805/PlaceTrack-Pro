export interface Profile {
  id: string;
  full_name: string;
  email?: string;
  role: 'student' | 'faculty' | 'admin';
  department: string;
  year_of_study: string;
  batch_id?: string;
  is_verified?: boolean;
  avatar_url?: string;
  created_at: string;
}

export interface Batch {
  id: string;
  name: string;
  created_by?: string;
  student_count?: number;
}

export interface QuestionBank {
  id: string;
  title: string;
  topic: string;
  question_count?: number;
  created_by: string;
}

export interface Question {
  id: string;
  bank_id: string;
  type: 'mcq' | 'coding' | 'short_answer';
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  content: {
    questionText: string;
    options?: string[];
    correctAnswer?: string | number;
    explanation?: string;
    starterCode?: string;
    testCases?: { input: string; expectedOutput: string; isPublic?: boolean }[];
  };
  created_at: string;
}

export interface Test {
  id: string;
  title: string;
  type: 'daily_practice' | 'weekly_assessment' | 'custom';
  batch_id?: string;
  batch_name?: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  created_by: string;
  is_proctored: boolean;
  question_count?: number;
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
}

export interface AttemptAnswer {
  id: string;
  attempt_id: string;
  question_id: string;
  student_answer: any;
  is_correct?: boolean;
  score?: number;
}

export interface ProctoringEvent {
  id: string;
  attempt_id: string;
  student_name?: string;
  test_title?: string;
  event_type: 'multiple_faces' | 'no_face' | 'gaze_away' | 'phone_detected' | 'tab_switch' | 'window_blur' | 'copy_paste';
  severity: 'low' | 'medium' | 'high';
  snapshot_url?: string;
  created_at: string;
}

export interface AttendanceRecord {
  id: string;
  student_id: string;
  student_name?: string;
  session_id: string;
  session_title: string;
  status: 'present' | 'absent';
  absence_reason?: string;
  reviewed_by_faculty: boolean;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_id: string;
  actor_name?: string;
  action: string;
  target_table: string;
  target_id?: string;
  metadata?: any;
  created_at: string;
}

// Initial Seed Data
export const MOCK_BATCHES: Batch[] = [
  { id: 'b1111111-1111-1111-1111-111111111111', name: 'CS-2026 Batch A', student_count: 45 },
  { id: 'b2222222-2222-2222-2222-222222222222', name: 'CS-2026 Batch B', student_count: 42 },
  { id: 'b3333333-3333-3333-3333-333333333333', name: 'IT-2026 Placement Core', student_count: 38 },
];

export const MOCK_PROFILES: Profile[] = [
  {
    id: 's1111111-1111-1111-1111-111111111111',
    full_name: 'Alex Johnson (Student)',
    role: 'student',
    department: 'Computer Science',
    year_of_study: 'Final Year',
    batch_id: 'b1111111-1111-1111-1111-111111111111',
    created_at: new Date().toISOString(),
  },
  {
    id: 'f2222222-2222-2222-2222-222222222222',
    full_name: 'Dr. Sarah Connor (Faculty)',
    role: 'faculty',
    department: 'Computer Science',
    year_of_study: 'N/A',
    is_verified: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'a3333333-3333-3333-3333-333333333333',
    full_name: 'Placement Admin',
    role: 'admin',
    department: 'Placement Cell',
    year_of_study: 'N/A',
    created_at: new Date().toISOString(),
  },
];

export const MOCK_QUESTION_BANKS: QuestionBank[] = [
  { id: 'qb-1', title: 'Data Structures & Algorithms', topic: 'DSA', question_count: 8, created_by: 'Dr. Sarah Connor' },
  { id: 'qb-2', title: 'Quantitative Aptitude & Reasoning', topic: 'Aptitude', question_count: 6, created_by: 'Dr. Sarah Connor' },
  { id: 'qb-3', title: 'Operating Systems & Networks', topic: 'Core CS', question_count: 5, created_by: 'Dr. Sarah Connor' },
];

export const MOCK_QUESTIONS: Question[] = [
  {
    id: 'q-1',
    bank_id: 'qb-1',
    type: 'mcq',
    topic: 'Data Structures',
    difficulty: 'easy',
    content: {
      questionText: 'What is the worst-case time complexity of accessing an element in an unsorted Array vs a Singly Linked List?',
      options: ['O(1) for Array, O(n) for Linked List', 'O(n) for Array, O(1) for Linked List', 'O(1) for both', 'O(log n) for both'],
      correctAnswer: 0,
      explanation: 'Arrays allow O(1) random access by index, whereas a Singly Linked List requires traversing up to N nodes, resulting in O(n) time.',
    },
    created_at: new Date().toISOString(),
  },
  {
    id: 'q-2',
    bank_id: 'qb-1',
    type: 'mcq',
    topic: 'Algorithms',
    difficulty: 'medium',
    content: {
      questionText: 'Which algorithm is best suited for finding the shortest path in a weighted graph with non-negative edge weights?',
      options: ['Breadth-First Search (BFS)', 'Dijkstra’s Algorithm', 'Bellman-Ford Algorithm', 'Depth-First Search (DFS)'],
      correctAnswer: 1,
      explanation: 'Dijkstra’s algorithm uses a priority queue to efficiently compute single-source shortest paths in O((V + E) log V) for non-negative weights.',
    },
    created_at: new Date().toISOString(),
  },
  {
    id: 'q-3',
    bank_id: 'qb-1',
    type: 'coding',
    topic: 'Data Structures',
    difficulty: 'medium',
    content: {
      questionText: 'Write a function `twoSum(nums, target)` that returns indices of the two numbers such that they add up to target. (e.g., input: `[2,7,11,15], 9` -> returns `[0, 1]`)',
      starterCode: 'function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}',
      testCases: [
        { input: '[2,7,11,15], 9', expectedOutput: '[0, 1]', isPublic: true },
        { input: '[3,2,4], 6', expectedOutput: '[1, 2]', isPublic: true },
        { input: '[3,3], 6', expectedOutput: '[0, 1]', isPublic: false },
        { input: '[1,5,8,3], 11', expectedOutput: '[2, 3]', isPublic: false },
      ],
      explanation: 'Use a hash map to store complements (target - num) and their indices in a single pass O(n) time complexity.',
    },
    created_at: new Date().toISOString(),
  },
  {
    id: 'q-4',
    bank_id: 'qb-2',
    type: 'mcq',
    topic: 'Quantitative Aptitude',
    difficulty: 'easy',
    content: {
      questionText: 'A train 150m long is running at a speed of 54 km/hr. How much time will it take to cross a platform 250m long?',
      options: ['20 seconds', '26.67 seconds', '30 seconds', '15 seconds'],
      correctAnswer: 1,
      explanation: 'Speed = 54 * (5/18) = 15 m/s. Total distance = 150 + 250 = 400m. Time = 400 / 15 = 26.67 seconds.',
    },
    created_at: new Date().toISOString(),
  },
  {
    id: 'q-5',
    bank_id: 'qb-3',
    type: 'mcq',
    topic: 'Operating Systems',
    difficulty: 'medium',
    content: {
      questionText: 'Which CPU scheduling policy minimizes the average waiting time for a given set of processes?',
      options: ['First-Come, First-Served (FCFS)', 'Round Robin (RR)', 'Shortest Job First (SJF)', 'Priority Scheduling'],
      correctAnswer: 2,
      explanation: 'Shortest Job First (SJF) is mathematically optimal for minimizing average waiting time.',
    },
    created_at: new Date().toISOString(),
  },
];

export const MOCK_TESTS: Test[] = [
  {
    id: 't-101',
    title: 'Daily Practice - Aptitude & Core CS #14',
    type: 'daily_practice',
    batch_id: 'b1111111-1111-1111-1111-111111111111',
    batch_name: 'CS-2026 Batch A',
    start_time: new Date(Date.now() - 3600000 * 24).toISOString(),
    end_time: new Date(Date.now() + 3600000 * 48).toISOString(),
    duration_minutes: 20,
    created_by: 'Dr. Sarah Connor',
    is_proctored: true,
    question_count: 4,
  },
  {
    id: 't-102',
    title: 'Weekly Proctored Mock Assessment - Amazon/Google Prep',
    type: 'weekly_assessment',
    batch_id: 'b1111111-1111-1111-1111-111111111111',
    batch_name: 'CS-2026 Batch A',
    start_time: new Date(Date.now() - 3600000 * 2).toISOString(),
    end_time: new Date(Date.now() + 3600000 * 72).toISOString(),
    duration_minutes: 45,
    created_by: 'Dr. Sarah Connor',
    is_proctored: true,
    question_count: 5,
  },
];

export const MOCK_TEST_ATTEMPTS: TestAttempt[] = [
  {
    id: 'att-1',
    test_id: 't-101',
    test_title: 'Daily Practice - Aptitude & Core CS #14',
    student_id: 's1111111-1111-1111-1111-111111111111',
    student_name: 'Alex Johnson',
    started_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    submitted_at: new Date(Date.now() - 3600000 * 4.5).toISOString(),
    score: 85,
    max_score: 100,
    status: 'submitted',
    flag_count: 0,
  },
  {
    id: 'att-2',
    test_id: 't-102',
    test_title: 'Weekly Proctored Mock Assessment - Amazon/Google Prep',
    student_id: 's1111111-1111-1111-1111-111111111111',
    student_name: 'Alex Johnson',
    started_at: new Date(Date.now() - 1800000).toISOString(),
    submitted_at: undefined,
    score: 60,
    max_score: 100,
    status: 'in_progress',
    flag_count: 2,
  },
];

export const MOCK_PROCTORING_EVENTS: ProctoringEvent[] = [
  {
    id: 'pe-1',
    attempt_id: 'att-2',
    student_name: 'Alex Johnson',
    test_title: 'Weekly Proctored Mock Assessment - Amazon/Google Prep',
    event_type: 'tab_switch',
    severity: 'medium',
    snapshot_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&auto=format&fit=crop&q=60',
    created_at: new Date(Date.now() - 1200000).toISOString(),
  },
  {
    id: 'pe-2',
    attempt_id: 'att-2',
    student_name: 'Alex Johnson',
    test_title: 'Weekly Proctored Mock Assessment - Amazon/Google Prep',
    event_type: 'gaze_away',
    severity: 'low',
    snapshot_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=60',
    created_at: new Date(Date.now() - 600000).toISOString(),
  },
];

export const MOCK_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'attnd-1',
    student_id: 's1111111-1111-1111-1111-111111111111',
    student_name: 'Alex Johnson',
    session_id: 'sess-1',
    session_title: 'Placement Technical Soft Skills Workshop',
    status: 'present',
    reviewed_by_faculty: true,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'attnd-2',
    student_id: 's1111111-1111-1111-1111-111111111111',
    student_name: 'Alex Johnson',
    session_id: 'sess-2',
    session_title: 'Mock Coding Interview Session #3',
    status: 'absent',
    absence_reason: 'Attended University Inter-College Hackathon Finals with prior HOD permission.',
    reviewed_by_faculty: false,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    actor_id: 'a3333333-3333-3333-3333-333333333333',
    actor_name: 'Placement Admin',
    action: 'CREATE_TEST',
    target_table: 'tests',
    target_id: 't-102',
    metadata: { title: 'Weekly Proctored Mock Assessment', batch: 'CS-2026 Batch A' },
    created_at: new Date(Date.now() - 3600000 * 10).toISOString(),
  },
  {
    id: 'log-2',
    actor_id: 'a3333333-3333-3333-3333-333333333333',
    actor_name: 'Placement Admin',
    action: 'UPDATE_ROLE',
    target_table: 'profiles',
    target_id: 'f2222222-2222-2222-2222-222222222222',
    metadata: { new_role: 'faculty', updated_by: 'Placement Admin' },
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
];
