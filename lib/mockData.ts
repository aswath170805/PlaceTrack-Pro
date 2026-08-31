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
  content: {
    questionText: string;
    options?: string[];
    correctAnswer?: string | number;
    explanation?: string;
    starterCode?: string;
    testCases?: { input: string; expectedOutput: string }[];
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
    department: 'Computer Science',
    year_of_study: 'Final Year',
    batch_id: 'b1111111-1111-1111-1111-111111111111',
    is_verified: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'f2222222-2222-2222-2222-222222222222',
    email: 'faculty@svce.ac.in',
    full_name: 'Dr. Sarah Connor',
    role: 'faculty',
    department: 'Computer Science',
    year_of_study: 'N/A',
    is_verified: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'a3333333-3333-3333-3333-333333333333',
    email: 'placetrackpro@admin.co.in',
    full_name: 'System Admin',
    role: 'admin',
    department: 'Placement Cell',
    year_of_study: 'N/A',
    is_verified: true,
    created_at: new Date().toISOString(),
  },
];

export const MOCK_BATCHES = SEED_BATCHES;
export const MOCK_PROFILES = SEED_PROFILES;
export const MOCK_QUESTION_BANKS: QuestionBank[] = [];
export const MOCK_QUESTIONS: Question[] = [];
export const MOCK_TESTS: Test[] = [];
export const MOCK_TEST_ATTEMPTS: TestAttempt[] = [];
export const MOCK_PROCTORING_EVENTS: ProctoringEvent[] = [];
export const MOCK_ATTENDANCE: AttendanceRecord[] = [];
export const MOCK_AUDIT_LOGS: AuditLog[] = [];

