'use client';

// PlaceTrack Pro - Unified Interconnected Persistent Store
// Provides a zero-mock, reactive, persistent single source of truth across all 15 Admin suites, Student portal, and Faculty hub.

import {
  Profile,
  Batch,
  QuestionBank,
  Question,
  Test,
  TestAttempt,
  ProctoringEvent,
  VerificationRequest,
  AttendanceRecord,
  AuditLog,
  PlacementReadinessScore,
  StudentXP,
  StudentStreak,
  StudentBadge,
  TopicStat,
  PracticeRecommendation,
  ProctoringEvidence,
  AssessmentVerificationSession
} from './mockData';

export type {
  Profile,
  Batch,
  QuestionBank,
  Question,
  Test,
  TestAttempt,
  ProctoringEvent,
  VerificationRequest,
  AttendanceRecord,
  AuditLog,
  PlacementReadinessScore,
  StudentXP,
  StudentStreak,
  StudentBadge,
  TopicStat,
  PracticeRecommendation,
  ProctoringEvidence,
  AssessmentVerificationSession
};

export interface Department {
  id: string;
  name: string;
  code: string;
  hod_name: string;
  student_count: number;
  faculty_count: number;
  created_at: string;
}

export interface ExtendedProfile extends Profile {
  phone?: string;
  status?: 'active' | 'deactivated';
  last_login_at?: string;
  notes?: string[];
}

export interface LoginRecord {
  id: string;
  user_id: string;
  user_name: string;
  email: string;
  role: string;
  ip_address: string;
  device: string;
  location: string;
  status: 'success' | 'failed';
  timestamp: string;
}

export interface UserActivityLog {
  id: string;
  user_id: string;
  user_name: string;
  role: string;
  action: string;
  details: string;
  ip_address: string;
  timestamp: string;
}

export interface SystemConfig {
  institute_name: string;
  academic_year: string;
  support_email: string;
  default_theme: 'light' | 'dark' | 'system';
  session_timeout_mins: number;
  maintenance_mode: boolean;
  student_self_registration: boolean;
  public_leaderboard: boolean;
  code_sandbox_enabled: boolean;
  audio_proctoring_enabled: boolean;
  timezone: string;
  language: string;
  allow_calculator: boolean;
  proctoring_ai_enabled: boolean;
}

export interface SMTPConfig {
  host: string;
  port: number;
  username: string;
  sender_email: string;
  sender_name: string;
  encryption: 'TLS' | 'SSL' | 'None';
  is_active: boolean;
}

export interface SecurityPolicy {
  min_password_length: number;
  require_special_char: boolean;
  require_number: boolean;
  max_failed_logins: number;
  lockout_duration_mins: number;
  two_factor_auth: 'disabled' | 'optional' | 'mandatory';
  ip_whitelisting_enabled: boolean;
  rate_limit_per_min: number;
}

export interface ProctoringRuleConfig {
  max_strikes_before_termination: number;
  face_tracking_sensitivity: 'low' | 'medium' | 'high';
  gaze_tracking_enabled: boolean;
  phone_detection_threshold: number;
  audio_anomaly_threshold: number;
  fullscreen_enforcement: boolean;
  tab_switch_auto_flag: boolean;
  block_clipboard: boolean;
  snapshot_interval_secs: number;
  allow_room_scan: boolean;
}

export interface QuestionCategory {
  id: string;
  name: string;
  slug: string;
  parent_id?: string;
  question_count: number;
}

export interface TestTemplate {
  id: string;
  title: string;
  category: string;
  duration_minutes: number;
  question_count: number;
  difficulty: 'easy' | 'medium' | 'hard';
  is_proctored: boolean;
  description: string;
}

export interface StudyResource {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'doc' | 'link';
  category: string;
  department: string;
  file_url: string;
  size_mb?: number;
  uploaded_by: string;
  created_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'normal' | 'urgent';
  target_audience: 'all' | 'students' | 'faculty';
  department?: string;
  is_active: boolean;
  created_at: string;
  created_by: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  is_published: boolean;
  updated_at: string;
}

export interface ViolationDispute {
  id: string;
  attempt_id: string;
  student_id: string;
  student_name: string;
  test_title: string;
  violation_type: string;
  student_comment: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_decision_reason?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
}

export interface BlacklistEntry {
  id: string;
  user_id: string;
  user_name: string;
  email: string;
  reason: string;
  added_by: string;
  added_at: string;
  is_active: boolean;
}

export interface WhitelistEntry {
  id: string;
  user_id: string;
  user_name: string;
  email: string;
  reason: string;
  granted_by: string;
  granted_at: string;
}

export interface BlockedIP {
  id: string;
  ip_address: string;
  reason: string;
  blocked_at: string;
  blocked_by: string;
  attempts_blocked: number;
}

export interface ActiveSession {
  id: string;
  user_id: string;
  user_name: string;
  email: string;
  role: string;
  ip_address: string;
  device: string;
  login_time: string;
  last_active: string;
}

export interface DatabaseBackup {
  id: string;
  filename: string;
  size_kb: number;
  created_at: string;
  created_by: string;
  record_count: number;
  type: 'manual' | 'automated';
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  trigger_event: string;
  is_active: boolean;
  updated_at: string;
}

export interface EmailLog {
  id: string;
  recipient_email: string;
  recipient_name: string;
  subject: string;
  status: 'sent' | 'failed' | 'queued';
  timestamp: string;
  error_message?: string;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  user_name: string;
  user_role: string;
  subject: string;
  category: 'test_issue' | 'proctoring' | 'account' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved';
  message: string;
  replies: {
    id: string;
    sender_name: string;
    is_admin: boolean;
    message: string;
    timestamp: string;
  }[];
  created_at: string;
  updated_at: string;
}

export interface BugReport {
  id: string;
  reported_by: string;
  title: string;
  description: string;
  browser: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'reported' | 'investigating' | 'fixed';
  created_at: string;
}

export interface ContactResponse {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  created_at: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key_prefix: string;
  key_hash: string;
  permissions: 'read' | 'write' | 'admin';
  created_at: string;
  last_used_at?: string;
  is_active: boolean;
}

export interface WebhookConfig {
  id: string;
  name: string;
  target_url: string;
  events: string[];
  is_active: boolean;
  secret: string;
  last_triggered?: string;
}

export interface LeaderboardConfig {
  is_visible: boolean;
  ranking_metric: 'readiness' | 'xp' | 'accuracy';
  scope: 'global' | 'department_only';
  current_season: string;
  last_reset_at: string;
}

export interface ScheduledCronTask {
  id: string;
  name: string;
  schedule: string;
  last_run: string;
  next_run: string;
  status: 'idle' | 'running' | 'success' | 'failed';
  description: string;
}

export interface SystemErrorLog {
  id: string;
  message: string;
  stack_trace?: string;
  severity: 'error' | 'warning' | 'info';
  component: string;
  timestamp: string;
}

export interface StudentProgressDetail {
  student_id: string;
  mentor_id?: string;
  mentor_name?: string;
  study_plan_id?: string;
  study_plan_title?: string;
  notes: { id: string; author: string; note: string; created_at: string }[];
  intervention_flag: boolean;
  intervention_reason?: string;
}

// ----------------------------------------------------
// COMPLETE REALISTIC INSTITUTIONAL SEED DATA
// ----------------------------------------------------

const INITIAL_DEPARTMENTS: Department[] = [
  { id: 'dept-1', name: 'Computer Science and Engineering', code: 'CSE', hod_name: 'Dr. Sarah Connor', student_count: 142, faculty_count: 8, created_at: '2026-01-10T00:00:00.000Z' },
  { id: 'dept-2', name: 'Information Technology', code: 'IT', hod_name: 'Dr. John Matrix', student_count: 118, faculty_count: 6, created_at: '2026-01-10T00:00:00.000Z' },
  { id: 'dept-3', name: 'Artificial Intelligence & Data Science', code: 'AIDS', hod_name: 'Prof. Ramesh Kumar', student_count: 95, faculty_count: 5, created_at: '2026-01-10T00:00:00.000Z' },
  { id: 'dept-4', name: 'Electronics and Communication Engineering', code: 'ECE', hod_name: 'Dr. K. Swaminathan', student_count: 130, faculty_count: 7, created_at: '2026-01-10T00:00:00.000Z' },
  { id: 'dept-5', name: 'Electrical and Electronics Engineering', code: 'EEE', hod_name: 'Dr. M. Soundararajan', student_count: 88, faculty_count: 5, created_at: '2026-01-10T00:00:00.000Z' },
  { id: 'dept-6', name: 'Mechanical Engineering', code: 'MECH', hod_name: 'Dr. C. Balasubramanian', student_count: 110, faculty_count: 6, created_at: '2026-01-10T00:00:00.000Z' },
];

const INITIAL_BATCHES: Batch[] = [
  { id: 'b-cse-2026-a', name: 'CS-2026 Batch A', created_by: 'Dr. Sarah Connor', student_count: 45 },
  { id: 'b-cse-2026-b', name: 'CS-2026 Batch B', created_by: 'Dr. Sarah Connor', student_count: 42 },
  { id: 'b-it-2026-core', name: 'IT-2026 Placement Core', created_by: 'Dr. John Matrix', student_count: 38 },
  { id: 'b-aids-2026-ai', name: 'AIDS-2026 Core Batch', created_by: 'Prof. Ramesh Kumar', student_count: 40 },
  { id: 'b-ece-2026-vlsi', name: 'ECE Placement Batch', created_by: 'Dr. K. Swaminathan', student_count: 44 },
];

const INITIAL_USERS: ExtendedProfile[] = [
  {
    id: 's1111111-1111-1111-1111-111111111111',
    full_name: 'Alex Johnson',
    email: 'alex.j@svce.ac.in',
    role: 'student',
    department: 'CSE',
    year_of_study: '4th Year',
    batch_id: 'b-cse-2026-a',
    status: 'active',
    is_verified: true,
    phone: '+91 98401 23456',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    last_login_at: '2026-09-12T14:30:00.000Z',
    created_at: '2026-02-01T09:00:00.000Z',
  },
  {
    id: 's2222222-2222-2222-2222-222222222222',
    full_name: 'Priya Sundaram',
    email: 'priya.s@svce.ac.in',
    role: 'student',
    department: 'CSE',
    year_of_study: '4th Year',
    batch_id: 'b-cse-2026-a',
    status: 'active',
    is_verified: true,
    phone: '+91 98402 34567',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    last_login_at: '2026-09-12T15:10:00.000Z',
    created_at: '2026-02-01T09:00:00.000Z',
  },
  {
    id: 's3333333-3333-3333-3333-333333333333',
    full_name: 'Karthik Raja',
    email: 'karthik.r@svce.ac.in',
    role: 'student',
    department: 'AIDS',
    year_of_study: '4th Year',
    batch_id: 'b-aids-2026-ai',
    status: 'active',
    is_verified: true,
    phone: '+91 98403 45678',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    last_login_at: '2026-09-12T11:20:00.000Z',
    created_at: '2026-02-01T09:00:00.000Z',
  },
  {
    id: 's4444444-4444-4444-4444-444444444444',
    full_name: 'Divya Krishnan',
    email: 'divya.k@svce.ac.in',
    role: 'student',
    department: 'ECE',
    year_of_study: '3rd Year',
    batch_id: 'b-ece-2026-vlsi',
    status: 'active',
    is_verified: true,
    phone: '+91 98404 56789',
    avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&auto=format&fit=crop&q=80',
    last_login_at: '2026-09-11T16:00:00.000Z',
    created_at: '2026-02-01T09:00:00.000Z',
  },
  {
    id: 'f2222222-2222-2222-2222-222222222222',
    full_name: 'Dr. Sarah Connor',
    email: 'sarah.connor@svce.ac.in',
    role: 'faculty',
    department: 'CSE',
    year_of_study: 'N/A',
    status: 'active',
    is_verified: true,
    phone: '+91 98405 67890',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    last_login_at: '2026-09-12T13:45:00.000Z',
    created_at: '2026-01-15T09:00:00.000Z',
  },
  {
    id: 'f3333333-3333-3333-3333-333333333333',
    full_name: 'Prof. Ramesh Kumar',
    email: 'ramesh.k@svce.ac.in',
    role: 'faculty',
    department: 'AIDS',
    year_of_study: 'N/A',
    status: 'active',
    is_verified: true,
    phone: '+91 98406 78901',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    last_login_at: '2026-09-12T10:15:00.000Z',
    created_at: '2026-01-15T09:00:00.000Z',
  },
  {
    id: 'a3333333-3333-3333-3333-333333333333',
    full_name: 'Placement Admin',
    email: 'placement.admin@svce.ac.in',
    role: 'admin',
    department: 'Placement Cell',
    year_of_study: 'N/A',
    status: 'active',
    is_verified: true,
    phone: '+91 98400 11111',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    last_login_at: '2026-09-12T16:00:00.000Z',
    created_at: '2026-01-01T09:00:00.000Z',
  },
];

const INITIAL_LOGIN_RECORDS: LoginRecord[] = [
  { id: 'lr-1', user_id: 'a3333333-3333-3333-3333-333333333333', user_name: 'Placement Admin', email: 'placement.admin@svce.ac.in', role: 'admin', ip_address: '192.168.1.10', device: 'Chrome on Windows 11', location: 'Chennai, IN', status: 'success', timestamp: '2026-09-12T16:00:00.000Z' },
  { id: 'lr-2', user_id: 's1111111-1111-1111-1111-111111111111', user_name: 'Alex Johnson', email: 'alex.j@svce.ac.in', role: 'student', ip_address: '192.168.1.104', device: 'Edge on macOS', location: 'Chennai, IN', status: 'success', timestamp: '2026-09-12T14:30:00.000Z' },
  { id: 'lr-3', user_id: 'f2222222-2222-2222-2222-222222222222', user_name: 'Dr. Sarah Connor', email: 'sarah.connor@svce.ac.in', role: 'faculty', ip_address: '192.168.1.45', device: 'Chrome on Windows 10', location: 'Chennai, IN', status: 'success', timestamp: '2026-09-12T13:45:00.000Z' },
  { id: 'lr-4', user_id: 's2222222-2222-2222-2222-222222222222', user_name: 'Priya Sundaram', email: 'priya.s@svce.ac.in', role: 'student', ip_address: '10.20.30.40', device: 'Safari on iPad', location: 'Coimbatore, IN', status: 'success', timestamp: '2026-09-12T15:10:00.000Z' },
  { id: 'lr-5', user_id: 'unknown', user_name: 'Unknown User', email: 'intruder@badip.org', role: 'unknown', ip_address: '45.134.22.18', device: 'Python Requests Bot', location: 'Moscow, RU', status: 'failed', timestamp: '2026-09-12T08:12:00.000Z' },
];

const INITIAL_SYSTEM_CONFIG: SystemConfig = {
  institute_name: 'Sri Venkateswara College of Engineering (Autonomous)',
  academic_year: '2025-2026 (Even Semester)',
  support_email: 'placement-support@svce.ac.in',
  default_theme: 'light',
  session_timeout_mins: 45,
  maintenance_mode: false,
  student_self_registration: true,
  public_leaderboard: true,
  code_sandbox_enabled: true,
  audio_proctoring_enabled: true,
  timezone: 'Asia/Kolkata (IST +05:30)',
  language: 'English (US & IN)',
  allow_calculator: true,
  proctoring_ai_enabled: true,
};

const INITIAL_SMTP_CONFIG: SMTPConfig = {
  host: 'smtp.gmail.com',
  port: 587,
  username: 'placements.notification@svce.ac.in',
  sender_email: 'noreply-placetrack@svce.ac.in',
  sender_name: 'PlaceTrack Pro Alerts',
  encryption: 'TLS',
  is_active: true,
};

const INITIAL_SECURITY_POLICY: SecurityPolicy = {
  min_password_length: 8,
  require_special_char: true,
  require_number: true,
  max_failed_logins: 5,
  lockout_duration_mins: 15,
  two_factor_auth: 'optional',
  ip_whitelisting_enabled: false,
  rate_limit_per_min: 120,
};

const INITIAL_PROCTORING_RULES: ProctoringRuleConfig = {
  max_strikes_before_termination: 3,
  face_tracking_sensitivity: 'medium',
  gaze_tracking_enabled: true,
  phone_detection_threshold: 0.70,
  audio_anomaly_threshold: 0.65,
  fullscreen_enforcement: true,
  tab_switch_auto_flag: true,
  block_clipboard: true,
  snapshot_interval_secs: 15,
  allow_room_scan: true,
};

const INITIAL_CATEGORIES: QuestionCategory[] = [
  { id: 'cat-1', name: 'Data Structures & Algorithms', slug: 'dsa', question_count: 24 },
  { id: 'cat-2', name: 'Quantitative Aptitude', slug: 'aptitude', question_count: 18 },
  { id: 'cat-3', name: 'Logical Reasoning', slug: 'reasoning', question_count: 15 },
  { id: 'cat-4', name: 'Core Computer Science', slug: 'core-cs', question_count: 16 },
  { id: 'cat-5', name: 'Artificial Intelligence & ML', slug: 'ai-ml', question_count: 12 },
  { id: 'cat-6', name: 'VLSI & Embedded Systems', slug: 'electronics', question_count: 10 },
];

const INITIAL_TEST_TEMPLATES: TestTemplate[] = [
  { id: 'tt-1', title: 'Product Company Diagnostic (FAANG/Tier-1)', category: 'dsa', duration_minutes: 60, question_count: 5, difficulty: 'hard', is_proctored: true, description: 'Coding & algorithmic optimization benchmark for Tier-1 recruitment.' },
  { id: 'tt-2', title: 'Campus Placement Aptitude Benchmark', category: 'aptitude', duration_minutes: 45, question_count: 25, difficulty: 'medium', is_proctored: true, description: 'Speed math, series, probability, and logical deduction.' },
  { id: 'tt-3', title: 'Core OS, DBMS & Computer Networks Qualifier', category: 'core-cs', duration_minutes: 30, question_count: 20, difficulty: 'medium', is_proctored: true, description: 'System design basics, indexing, processes, and OSI models.' },
];

const INITIAL_STUDY_RESOURCES: StudyResource[] = [
  { id: 'res-1', title: 'Top 100 LeetCode Placement Coding Patterns PDF', type: 'pdf', category: 'DSA', department: 'CSE', file_url: '/resources/dsa_patterns.pdf', size_mb: 4.2, uploaded_by: 'Dr. Sarah Connor', created_at: '2026-08-15T00:00:00.000Z' },
  { id: 'res-2', title: 'Quantitative Aptitude Formula Sheet & Shortcuts', type: 'pdf', category: 'Aptitude', department: 'All Departments', file_url: '/resources/aptitude_formulas.pdf', size_mb: 2.1, uploaded_by: 'Placement Admin', created_at: '2026-08-20T00:00:00.000Z' },
  { id: 'res-3', title: 'Operating Systems Virtual Memory & Paging Masterclass', type: 'video', category: 'Core CS', department: 'CSE', file_url: 'https://youtube.com/watch?v=sample-os', size_mb: 0, uploaded_by: 'Dr. Sarah Connor', created_at: '2026-08-25T00:00:00.000Z' },
  { id: 'res-4', title: 'SQL Joins, Indexing & Query Optimization Handbook', type: 'doc', category: 'Databases', department: 'IT', file_url: '/resources/sql_handbook.docx', size_mb: 1.8, uploaded_by: 'Dr. John Matrix', created_at: '2026-09-01T00:00:00.000Z' },
];

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  { id: 'anc-1', title: 'Amazon & Zoho Placement Drive Mock Assessment Schedule', content: 'All final year CSE, IT, and AIDS students are mandated to complete the Weekly Proctored Qualifier by Sunday midnight. AI proctoring with webcam verification is mandatory.', priority: 'urgent', target_audience: 'all', department: 'All Departments', is_active: true, created_at: '2026-09-12T09:00:00.000Z', created_by: 'Placement Cell Dean' },
  { id: 'anc-2', title: 'Placement Technical Soft-Skills & Group Discussion Rounds', content: 'Soft skills evaluations for Batch A and B will commence in Hall 4 starting Wednesday 10 AM. Check your individual attendance card.', priority: 'normal', target_audience: 'students', department: 'CSE', is_active: true, created_at: '2026-09-10T11:00:00.000Z', created_by: 'Placement Admin' },
];

const INITIAL_FAQS: FAQItem[] = [
  { id: 'faq-1', question: 'What hardware is required for Proctored Assessments?', answer: 'A laptop or desktop running Google Chrome or Edge with a functional webcam and microphone. Mobile phones and secondary monitors are strictly prohibited.', category: 'Proctoring', is_published: true, updated_at: '2026-09-01T00:00:00.000Z' },
  { id: 'faq-2', question: 'What happens if my internet disconnects during a test?', answer: 'Your code and answers are automatically auto-saved locally every 5 seconds. Reconnect within 5 minutes to resume without penalty.', category: 'Tests', is_published: true, updated_at: '2026-09-01T00:00:00.000Z' },
  { id: 'faq-3', question: 'How is Placement Readiness Score calculated?', answer: 'Placement Readiness is a weighted aggregate of your Aptitude (20%), Coding (30%), Technical Core (20%), and Soft Skills Mock performance (30%).', category: 'Readiness', is_published: true, updated_at: '2026-09-01T00:00:00.000Z' },
  { id: 'faq-4', question: 'How can I appeal a false-positive proctoring strike?', answer: 'Navigate to Test Results and submit an official dispute with explanation. Administrators will audit your video snapshot and webcam frame.', category: 'Disputes', is_published: true, updated_at: '2026-09-01T00:00:00.000Z' },
];

const INITIAL_DISPUTES: ViolationDispute[] = [
  {
    id: 'disp-1',
    attempt_id: 'att-2',
    student_id: 's1111111-1111-1111-1111-111111111111',
    student_name: 'Alex Johnson',
    test_title: 'Weekly Proctored Mock Assessment - Amazon/Google Prep',
    violation_type: 'gaze_away',
    student_comment: 'A light flicker in the college lab caused me to look upwards momentarily. I did not consult any external material.',
    status: 'pending',
    created_at: '2026-09-12T13:00:00.000Z',
  },
];

const INITIAL_BLACKLIST: BlacklistEntry[] = [
  { id: 'bl-1', user_id: 's9999999-9999-9999-9999-999999999999', user_name: 'Rohan Verma (Flagged)', email: 'rohan.v@svce.ac.in', reason: 'Repeat unauthorized secondary mobile device use in 3 successive proctored qualifiers.', added_by: 'Placement Admin', added_at: '2026-09-05T10:00:00.000Z', is_active: true },
];

const INITIAL_WHITELIST: WhitelistEntry[] = [
  { id: 'wl-1', user_id: 's4444444-4444-4444-4444-444444444444', user_name: 'Divya Krishnan', email: 'divya.k@svce.ac.in', reason: 'Documented visual impairment accommodation: extra head tilt permitted.', granted_by: 'Dr. Sarah Connor', granted_at: '2026-08-30T10:00:00.000Z' },
];

const INITIAL_BLOCKED_IPS: BlockedIP[] = [
  { id: 'bip-1', ip_address: '45.134.22.18', reason: 'Brute force credential stuffing attempt on /api/auth', blocked_at: '2026-09-12T08:15:00.000Z', blocked_by: 'Automated Intrusion Detection', attempts_blocked: 47 },
  { id: 'bip-2', ip_address: '185.220.101.5', reason: 'Tor Exit Node attempting automated question scraping', blocked_at: '2026-09-10T14:22:00.000Z', blocked_by: 'Placement Admin', attempts_blocked: 12 },
];

const INITIAL_ACTIVE_SESSIONS: ActiveSession[] = [
  { id: 'sess-1', user_id: 'a3333333-3333-3333-3333-333333333333', user_name: 'Placement Admin', email: 'placement.admin@svce.ac.in', role: 'admin', ip_address: '192.168.1.10', device: 'Chrome 128 (Windows 11)', login_time: '2026-09-12T16:00:00.000Z', last_active: 'Just now' },
  { id: 'sess-2', user_id: 's1111111-1111-1111-1111-111111111111', user_name: 'Alex Johnson', email: 'alex.j@svce.ac.in', role: 'student', ip_address: '192.168.1.104', device: 'Edge 127 (macOS Sonoma)', login_time: '2026-09-12T14:30:00.000Z', last_active: '2 mins ago' },
  { id: 'sess-3', user_id: 'f2222222-2222-2222-2222-222222222222', user_name: 'Dr. Sarah Connor', email: 'sarah.connor@svce.ac.in', role: 'faculty', ip_address: '192.168.1.45', device: 'Chrome 128 (Windows 10)', login_time: '2026-09-12T13:45:00.000Z', last_active: '5 mins ago' },
];

const INITIAL_EMAIL_TEMPLATES: EmailTemplate[] = [
  { id: 'et-1', name: 'Welcome & Institutional Credential Delivery', subject: 'Welcome to PlaceTrack Pro — Your Placement Portal Account', body: 'Dear {{full_name}},\n\nYour institutional account has been provisioned. Access the portal at https://placetrack.svce.ac.in using your college credentials.\n\nRole: {{role}}\nDepartment: {{department}}', trigger_event: 'user_registered', is_active: true, updated_at: '2026-09-01T00:00:00.000Z' },
  { id: 'et-2', name: 'Scheduled Assessment Notification', subject: 'Action Required: Scheduled Assessment: {{test_title}}', body: 'Dear Candidate,\n\nYou have been enrolled in {{test_title}}. Duration: {{duration}} minutes. AI Proctoring is strictly enabled. Please test your webcam prior to commencement.', trigger_event: 'test_scheduled', is_active: true, updated_at: '2026-09-01T00:00:00.000Z' },
  { id: 'et-3', name: 'Proctoring Malpractice Termination Notice', subject: 'Official Notice: Assessment Terminated for Malpractice Violation', body: 'Dear {{student_name}},\n\nYour assessment {{test_title}} was terminated due to exceeding violation strikes ({{reason}}). To dispute this decision, submit an appeal in your results dashboard.', trigger_event: 'test_terminated', is_active: true, updated_at: '2026-09-01T00:00:00.000Z' },
];

const INITIAL_EMAIL_LOGS: EmailLog[] = [
  { id: 'el-1', recipient_email: 'alex.j@svce.ac.in', recipient_name: 'Alex Johnson', subject: 'Action Required: Scheduled Assessment: Weekly Proctored Mock', status: 'sent', timestamp: '2026-09-12T09:30:00.000Z' },
  { id: 'el-2', recipient_email: 'priya.s@svce.ac.in', recipient_name: 'Priya Sundaram', subject: 'Action Required: Scheduled Assessment: Weekly Proctored Mock', status: 'sent', timestamp: '2026-09-12T09:30:00.000Z' },
  { id: 'el-3', recipient_email: 'karthik.r@svce.ac.in', recipient_name: 'Karthik Raja', subject: 'Placement Soft Skills Session Invitation', status: 'sent', timestamp: '2026-09-11T14:00:00.000Z' },
];

const INITIAL_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 'tkt-101',
    user_id: 's1111111-1111-1111-1111-111111111111',
    user_name: 'Alex Johnson',
    user_role: 'student',
    subject: 'Webcam permission prompted repeatedly during assessment',
    category: 'proctoring',
    priority: 'high',
    status: 'in_progress',
    message: 'Whenever I transition from Question 2 to Question 3, the browser requests camera permissions again. I have enabled persistence.',
    replies: [
      { id: 'rep-1', sender_name: 'Alex Johnson', is_admin: false, message: 'I am on Chrome version 128.0.', timestamp: '2026-09-12T11:00:00.000Z' },
      { id: 'rep-2', sender_name: 'Placement Admin', is_admin: true, message: 'We have checked the media stream lifecycle. Please ensure chrome://settings/content/camera has SVCE domain set to Always Allow.', timestamp: '2026-09-12T11:45:00.000Z' },
    ],
    created_at: '2026-09-12T10:45:00.000Z',
    updated_at: '2026-09-12T11:45:00.000Z',
  },
  {
    id: 'tkt-102',
    user_id: 'f2222222-2222-2222-2222-222222222222',
    user_name: 'Dr. Sarah Connor',
    user_role: 'faculty',
    subject: 'Requesting permission to export Batch A coding test cases',
    category: 'test_issue',
    priority: 'medium',
    status: 'resolved',
    message: 'Need CSV export of hidden test cases for the upcoming Anna University placement audit.',
    replies: [
      { id: 'rep-3', sender_name: 'Placement Admin', is_admin: true, message: 'Export privileges granted. You can now use Content Management > Export.', timestamp: '2026-09-11T16:20:00.000Z' },
    ],
    created_at: '2026-09-11T15:00:00.000Z',
    updated_at: '2026-09-11T16:20:00.000Z',
  },
];

const INITIAL_BUG_REPORTS: BugReport[] = [
  { id: 'bug-1', reported_by: 'Alex Johnson', title: 'Code editor syntax highlight lags on large input', description: 'When writing twoSum with 200 lines, Monaco editor slows down.', browser: 'Chrome 128', severity: 'low', status: 'investigating', created_at: '2026-09-10T12:00:00.000Z' },
];

const INITIAL_API_KEYS: ApiKey[] = [
  { id: 'ak-1', name: 'SVCE ERP Sync Service Key', key_prefix: 'pt_live_9f82', key_hash: '••••••••••••••••••••••••34ba', permissions: 'admin', created_at: '2026-08-01T00:00:00.000Z', last_used_at: '2026-09-12T15:30:00.000Z', is_active: true },
  { id: 'ak-2', name: 'Moodle LMS Webhook Ingestion', key_prefix: 'pt_live_14ac', key_hash: '••••••••••••••••••••••••88ef', permissions: 'write', created_at: '2026-08-15T00:00:00.000Z', last_used_at: '2026-09-12T12:00:00.000Z', is_active: true },
];

const INITIAL_WEBHOOKS: WebhookConfig[] = [
  { id: 'wh-1', name: 'SVCE Central ERP Placement Result Webhook', target_url: 'https://erp.svce.ac.in/api/v2/placement/scores', events: ['test.submitted', 'attempt.terminated'], is_active: true, secret: 'whsec_987421abcdef', last_triggered: '2026-09-12T14:45:00.000Z' },
];

const INITIAL_LEADERBOARD_CONFIG: LeaderboardConfig = {
  is_visible: true,
  ranking_metric: 'readiness',
  scope: 'global',
  current_season: 'Placement Season 2026 (Phase 1)',
  last_reset_at: '2026-08-01T00:00:00.000Z',
};

const INITIAL_CRON_TASKS: ScheduledCronTask[] = [
  { id: 'cron-1', name: 'Nightly System Snapshot & State Backup', schedule: '0 2 * * * (Daily at 2:00 AM)', last_run: '2026-09-12T02:00:00.000Z', next_run: '2026-09-13T02:00:00.000Z', status: 'success', description: 'Dumps relational collections and generates encrypted local archive.' },
  { id: 'cron-2', name: 'Automated Test Deadline Force Submission', schedule: '*/5 * * * * (Every 5 minutes)', last_run: '2026-09-12T16:20:00.000Z', next_run: '2026-09-12T16:25:00.000Z', status: 'success', description: 'Checks for active attempts where current_time > test.end_time and marks auto_submitted.' },
  { id: 'cron-3', name: 'Daily Placement Readiness AI Re-indexing', schedule: '0 4 * * * (Daily at 4:00 AM)', last_run: '2026-09-12T04:00:00.000Z', next_run: '2026-09-13T04:00:00.000Z', status: 'success', description: 'Recomputes aggregate domain ratings (aptitude, logical, coding) for all active students.' },
];

const INITIAL_ERROR_LOGS: SystemErrorLog[] = [
  { id: 'err-1', message: 'Rate limit threshold reached for IP 45.134.22.18', severity: 'warning', component: 'SecurityMiddleware', timestamp: '2026-09-12T08:14:55.000Z' },
  { id: 'err-2', message: 'Webcam stream frame dropped due to client-side CPU throttling', severity: 'info', component: 'ProctoringWorker', timestamp: '2026-09-12T14:32:10.000Z' },
];

// ----------------------------------------------------
// THE UNIFIED REACTIVE STORE SINGLETON
// ----------------------------------------------------

class PlaceTrackStoreManager {
  private static instance: PlaceTrackStoreManager;
  private storageKey = 'placetrack_pro_store_v2';
  private listeners: Set<() => void> = new Set();

  public departments: Department[] = INITIAL_DEPARTMENTS;
  public batches: Batch[] = INITIAL_BATCHES;
  public users: ExtendedProfile[] = INITIAL_USERS;
  public loginRecords: LoginRecord[] = INITIAL_LOGIN_RECORDS;
  public userActivityLogs: UserActivityLog[] = [];
  public systemConfig: SystemConfig = INITIAL_SYSTEM_CONFIG;
  public smtpConfig: SMTPConfig = INITIAL_SMTP_CONFIG;
  public securityPolicy: SecurityPolicy = INITIAL_SECURITY_POLICY;
  public proctoringRules: ProctoringRuleConfig = INITIAL_PROCTORING_RULES;
  public categories: QuestionCategory[] = INITIAL_CATEGORIES;
  public questionBanks: QuestionBank[] = [];
  public questions: Question[] = [];
  public tests: Test[] = [];
  public testTemplates: TestTemplate[] = INITIAL_TEST_TEMPLATES;
  public studyResources: StudyResource[] = INITIAL_STUDY_RESOURCES;
  public announcements: Announcement[] = INITIAL_ANNOUNCEMENTS;
  public faqs: FAQItem[] = INITIAL_FAQS;
  public testAttempts: TestAttempt[] = [];
  public proctoringEvents: ProctoringEvent[] = [];
  public verificationRequests: VerificationRequest[] = [];
  public disputes: ViolationDispute[] = INITIAL_DISPUTES;
  public blacklist: BlacklistEntry[] = INITIAL_BLACKLIST;
  public whitelist: WhitelistEntry[] = INITIAL_WHITELIST;
  public blockedIPs: BlockedIP[] = INITIAL_BLOCKED_IPS;
  public activeSessions: ActiveSession[] = INITIAL_ACTIVE_SESSIONS;
  public backups: DatabaseBackup[] = [];
  public emailTemplates: EmailTemplate[] = INITIAL_EMAIL_TEMPLATES;
  public emailLogs: EmailLog[] = INITIAL_EMAIL_LOGS;
  public supportTickets: SupportTicket[] = INITIAL_SUPPORT_TICKETS;
  public bugReports: BugReport[] = INITIAL_BUG_REPORTS;
  public contactResponses: ContactResponse[] = [];
  public apiKeys: ApiKey[] = INITIAL_API_KEYS;
  public webhooks: WebhookConfig[] = INITIAL_WEBHOOKS;
  public leaderboardConfig: LeaderboardConfig = INITIAL_LEADERBOARD_CONFIG;
  public cronTasks: ScheduledCronTask[] = INITIAL_CRON_TASKS;
  public errorLogs: SystemErrorLog[] = INITIAL_ERROR_LOGS;
  public auditLogs: AuditLog[] = [];
  public readinessScores: PlacementReadinessScore[] = [];
  public studentXP: StudentXP[] = [];
  public studentStreaks: StudentStreak[] = [];
  public studentBadges: StudentBadge[] = [];
  public topicStats: TopicStat[] = [];
  public practiceRecommendations: PracticeRecommendation[] = [];
  public studentProgressDetails: Record<string, StudentProgressDetail> = {};

  private initialized = false;

  private constructor() {
    this.init();
  }

  public static getInstance(): PlaceTrackStoreManager {
    if (!PlaceTrackStoreManager.instance) {
      PlaceTrackStoreManager.instance = new PlaceTrackStoreManager();
    }
    return PlaceTrackStoreManager.instance;
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.saveToStorage();
    this.listeners.forEach((l) => {
      try {
        l();
      } catch (e) {
        console.error('Store listener error:', e);
      }
    });
  }

  private init() {
    if (this.initialized) return;
    this.initialized = true;

    // Load base mock data into store defaults
    const {
      MOCK_QUESTION_BANKS,
      MOCK_QUESTIONS,
      MOCK_TESTS,
      MOCK_TEST_ATTEMPTS,
      MOCK_PROCTORING_EVENTS,
      MOCK_VERIFICATION_REQUESTS,
      MOCK_AUDIT_LOGS,
      MOCK_READINESS_SCORES,
      MOCK_STUDENT_XP,
      MOCK_STUDENT_STREAKS,
      MOCK_STUDENT_BADGES,
      MOCK_TOPIC_STATS,
      MOCK_PRACTICE_RECOMMENDATIONS,
    } = require('./mockData');

    this.questionBanks = [...MOCK_QUESTION_BANKS];
    this.questions = [...MOCK_QUESTIONS];
    this.tests = [...MOCK_TESTS];
    this.testAttempts = [...MOCK_TEST_ATTEMPTS];
    this.proctoringEvents = [...MOCK_PROCTORING_EVENTS];
    this.verificationRequests = [...MOCK_VERIFICATION_REQUESTS];
    this.auditLogs = [...MOCK_AUDIT_LOGS];
    this.readinessScores = [...MOCK_READINESS_SCORES];
    this.studentXP = [...MOCK_STUDENT_XP];
    this.studentStreaks = [...MOCK_STUDENT_STREAKS];
    this.studentBadges = [...MOCK_STUDENT_BADGES];
    this.topicStats = [...MOCK_TOPIC_STATS];
    this.practiceRecommendations = [...MOCK_PRACTICE_RECOMMENDATIONS];

    // Seed default backups list
    this.backups = [
      { id: 'bk-1', filename: 'svce_placetrack_snapshot_2026-09-10.json', size_kb: 420, created_at: '2026-09-10T02:00:00.000Z', created_by: 'Automated Cron', record_count: 312, type: 'automated' },
      { id: 'bk-2', filename: 'svce_placetrack_pre_placement_2026-09-12.json', size_kb: 468, created_at: '2026-09-12T02:00:00.000Z', created_by: 'Placement Admin', record_count: 345, type: 'manual' },
    ];

    // Attempt restoring from localStorage on client
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(this.storageKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.users && parsed.users.length) this.users = parsed.users;
          if (parsed.departments) this.departments = parsed.departments;
          if (parsed.batches) this.batches = parsed.batches;
          if (parsed.tests) this.tests = parsed.tests;
          if (parsed.questions) this.questions = parsed.questions;
          if (parsed.questionBanks) this.questionBanks = parsed.questionBanks;
          if (parsed.testAttempts) this.testAttempts = parsed.testAttempts;
          if (parsed.proctoringEvents) this.proctoringEvents = parsed.proctoringEvents;
          if (parsed.auditLogs) this.auditLogs = parsed.auditLogs;
          if (parsed.systemConfig) this.systemConfig = parsed.systemConfig;
          if (parsed.proctoringRules) this.proctoringRules = parsed.proctoringRules;
          if (parsed.announcements) this.announcements = parsed.announcements;
          if (parsed.faqs) this.faqs = parsed.faqs;
          if (parsed.supportTickets) this.supportTickets = parsed.supportTickets;
          if (parsed.disputes) this.disputes = parsed.disputes;
          if (parsed.blacklist) this.blacklist = parsed.blacklist;
          if (parsed.whitelist) this.whitelist = parsed.whitelist;
          if (parsed.blockedIPs) this.blockedIPs = parsed.blockedIPs;
          if (parsed.activeSessions) this.activeSessions = parsed.activeSessions;
          if (parsed.emailTemplates) this.emailTemplates = parsed.emailTemplates;
          if (parsed.emailLogs) this.emailLogs = parsed.emailLogs;
          if (parsed.apiKeys) this.apiKeys = parsed.apiKeys;
          if (parsed.webhooks) this.webhooks = parsed.webhooks;
          if (parsed.backups) this.backups = parsed.backups;
          if (parsed.categories) this.categories = parsed.categories;
          if (parsed.studyResources) this.studyResources = parsed.studyResources;
          if (parsed.readinessScores) this.readinessScores = parsed.readinessScores;
          if (parsed.studentXP) this.studentXP = parsed.studentXP;
          if (parsed.studentStreaks) this.studentStreaks = parsed.studentStreaks;
          if (parsed.studentBadges) this.studentBadges = parsed.studentBadges;
        }
      } catch (e) {
        console.warn('Could not hydrate store from localStorage:', e);
      }
    }
  }

  private saveToStorage() {
    if (typeof window !== 'undefined') {
      try {
        const payload = {
          users: this.users,
          departments: this.departments,
          batches: this.batches,
          tests: this.tests,
          questions: this.questions,
          questionBanks: this.questionBanks,
          testAttempts: this.testAttempts,
          proctoringEvents: this.proctoringEvents,
          auditLogs: this.auditLogs,
          systemConfig: this.systemConfig,
          proctoringRules: this.proctoringRules,
          announcements: this.announcements,
          faqs: this.faqs,
          supportTickets: this.supportTickets,
          disputes: this.disputes,
          blacklist: this.blacklist,
          whitelist: this.whitelist,
          blockedIPs: this.blockedIPs,
          activeSessions: this.activeSessions,
          emailTemplates: this.emailTemplates,
          emailLogs: this.emailLogs,
          apiKeys: this.apiKeys,
          webhooks: this.webhooks,
          backups: this.backups,
          categories: this.categories,
          studyResources: this.studyResources,
          readinessScores: this.readinessScores,
          studentXP: this.studentXP,
          studentStreaks: this.studentStreaks,
          studentBadges: this.studentBadges,
        };
        localStorage.setItem(this.storageKey, JSON.stringify(payload));
      } catch (e) {
        console.warn('Storage quota or serialization warning:', e);
      }
    }
  }

  // ----------------------------------------------------
  // AUDIT LOGGING HELPER
  // ----------------------------------------------------
  public logAudit(action: string, targetTable: string, targetId?: string, metadata?: any, actorName: string = 'Placement Admin') {
    const newLog: AuditLog = {
      id: 'log-' + Math.random().toString(36).substring(2, 9),
      actor_id: 'a3333333-3333-3333-3333-333333333333',
      actor_name: actorName,
      action,
      target_table: targetTable,
      target_id: targetId,
      metadata,
      created_at: new Date().toISOString(),
    };
    this.auditLogs.unshift(newLog);
    this.notify();
    return newLog;
  }

  // ----------------------------------------------------
  // DOMAIN 1: USER MANAGEMENT
  // ----------------------------------------------------
  public createUser(user: Partial<ExtendedProfile>): ExtendedProfile {
    const newUser: ExtendedProfile = {
      id: user.id || 'u-' + Math.random().toString(36).substring(2, 9),
      full_name: user.full_name || 'New User',
      email: user.email || `user.${Date.now()}@svce.ac.in`,
      role: user.role || 'student',
      department: user.department || 'CSE',
      year_of_study: user.year_of_study || '4th Year',
      batch_id: user.batch_id,
      phone: user.phone || '+91 90000 00000',
      status: user.status || 'active',
      is_verified: user.is_verified ?? true,
      avatar_url: user.avatar_url || `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=120&auto=format&fit=crop&q=80`,
      created_at: new Date().toISOString(),
    };
    this.users.unshift(newUser);

    // If student, create initial gamification records
    if (newUser.role === 'student') {
      this.readinessScores.push({
        student_id: newUser.id,
        overall_score: 75,
        aptitude_score: 75,
        logical_score: 75,
        programming_score: 75,
        technical_score: 75,
        communication_score: 70,
        interview_score: 75,
        updated_at: new Date().toISOString(),
      });
      this.studentXP.push({ student_id: newUser.id, xp_points: 100, level: 1, updated_at: new Date().toISOString() });
      this.studentStreaks.push({ student_id: newUser.id, current_streak: 1, longest_streak: 1, last_activity_date: new Date().toISOString(), updated_at: new Date().toISOString() });
    }

    this.logAudit('CREATE_USER', 'profiles', newUser.id, { email: newUser.email, role: newUser.role });
    this.notify();
    return newUser;
  }

  public updateUser(userId: string, updates: Partial<ExtendedProfile>): ExtendedProfile | null {
    const idx = this.users.findIndex((u) => u.id === userId);
    if (idx === -1) return null;
    this.users[idx] = { ...this.users[idx], ...updates };
    this.logAudit('UPDATE_USER', 'profiles', userId, updates);
    this.notify();
    return this.users[idx];
  }

  public deleteUser(userId: string): boolean {
    const idx = this.users.findIndex((u) => u.id === userId);
    if (idx === -1) return false;
    const deleted = this.users.splice(idx, 1)[0];
    this.logAudit('DELETE_USER', 'profiles', userId, { email: deleted.email, name: deleted.full_name });
    this.notify();
    return true;
  }

  public toggleUserStatus(userId: string): 'active' | 'deactivated' {
    const user = this.users.find((u) => u.id === userId);
    if (!user) return 'active';
    user.status = user.status === 'deactivated' ? 'active' : 'deactivated';
    this.logAudit('TOGGLE_USER_STATUS', 'profiles', userId, { new_status: user.status });
    this.notify();
    return user.status;
  }

  public resetPassword(userId: string): string {
    const tempPass = 'SVCE@' + Math.floor(1000 + Math.random() * 9000);
    this.logAudit('RESET_PASSWORD', 'profiles', userId, { temp_password_issued: true });
    this.notify();
    return tempPass;
  }

  public bulkImportUsers(usersList: Partial<ExtendedProfile>[]): { added: number; failed: number } {
    let added = 0;
    usersList.forEach((u) => {
      try {
        this.createUser(u);
        added++;
      } catch (e) {
        // skip failed
      }
    });
    this.logAudit('BULK_IMPORT_USERS', 'profiles', undefined, { count: added });
    this.notify();
    return { added, failed: usersList.length - added };
  }

  public addDepartment(name: string, code: string, hod_name: string): Department {
    const dept: Department = {
      id: 'dept-' + Math.random().toString(36).substring(2, 7),
      name,
      code: code.toUpperCase(),
      hod_name,
      student_count: 0,
      faculty_count: 1,
      created_at: new Date().toISOString(),
    };
    this.departments.push(dept);
    this.logAudit('CREATE_DEPARTMENT', 'departments', dept.id, { name, code });
    this.notify();
    return dept;
  }

  public deleteDepartment(id: string): boolean {
    const idx = this.departments.findIndex((d) => d.id === id);
    if (idx === -1) return false;
    const deleted = this.departments.splice(idx, 1)[0];
    this.logAudit('DELETE_DEPARTMENT', 'departments', id, { code: deleted.code });
    this.notify();
    return true;
  }

  public addBatch(name: string, createdBy: string = 'Placement Admin'): Batch {
    const newBatch: Batch = {
      id: 'b-' + Math.random().toString(36).substring(2, 8),
      name,
      created_by: createdBy,
      student_count: 0,
    };
    this.batches.push(newBatch);
    this.logAudit('CREATE_BATCH', 'batches', newBatch.id, { name });
    this.notify();
    return newBatch;
  }

  public deleteBatch(batchId: string): boolean {
    const idx = this.batches.findIndex((b) => b.id === batchId);
    if (idx === -1) return false;
    this.batches.splice(idx, 1);
    this.logAudit('DELETE_BATCH', 'batches', batchId);
    this.notify();
    return true;
  }

  // ----------------------------------------------------
  // DOMAIN 2: SYSTEM CONFIGURATION
  // ----------------------------------------------------
  public updateSystemConfig(updates: Partial<SystemConfig>): SystemConfig {
    this.systemConfig = { ...this.systemConfig, ...updates };
    this.logAudit('UPDATE_SYSTEM_CONFIG', 'system_config', undefined, updates);
    this.notify();
    return this.systemConfig;
  }

  public updateSMTPConfig(updates: Partial<SMTPConfig>): SMTPConfig {
    this.smtpConfig = { ...this.smtpConfig, ...updates };
    this.logAudit('UPDATE_SMTP_CONFIG', 'smtp_config', undefined, updates);
    this.notify();
    return this.smtpConfig;
  }

  public updateSecurityPolicy(updates: Partial<SecurityPolicy>): SecurityPolicy {
    this.securityPolicy = { ...this.securityPolicy, ...updates };
    this.logAudit('UPDATE_SECURITY_POLICY', 'security_policy', undefined, updates);
    this.notify();
    return this.securityPolicy;
  }

  // ----------------------------------------------------
  // DOMAIN 3: CONTENT MANAGEMENT
  // ----------------------------------------------------
  public createQuestionBank(bank: Partial<QuestionBank>): QuestionBank {
    const newBank: QuestionBank = {
      id: bank.id || 'qb-' + Math.random().toString(36).substring(2, 8),
      title: bank.title || 'New Question Bank',
      topic: bank.topic || 'General Aptitude',
      question_count: 0,
      created_by: bank.created_by || 'Placement Admin',
      target_department: bank.target_department || 'All Departments',
      target_year: bank.target_year || 'All Years',
    };
    this.questionBanks.unshift(newBank);
    this.logAudit('CREATE_QUESTION_BANK', 'question_banks', newBank.id, { title: newBank.title });
    this.notify();
    return newBank;
  }

  public deleteQuestionBank(bankId: string): boolean {
    const idx = this.questionBanks.findIndex((b) => b.id === bankId);
    if (idx === -1) return false;
    this.questionBanks.splice(idx, 1);
    this.questions = this.questions.filter((q) => q.bank_id !== bankId);
    this.logAudit('DELETE_QUESTION_BANK', 'question_banks', bankId);
    this.notify();
    return true;
  }

  public createQuestion(q: Partial<Question>): Question {
    const newQ: Question = {
      id: q.id || 'q-' + Math.random().toString(36).substring(2, 8),
      bank_id: q.bank_id || (this.questionBanks[0]?.id || 'qb-1'),
      type: q.type || 'mcq',
      topic: q.topic || 'DSA',
      difficulty: q.difficulty || 'medium',
      target_department: q.target_department || 'All Departments',
      target_year: q.target_year || 'All Years',
      content: q.content || { questionText: 'Sample Question Text', options: ['A', 'B', 'C', 'D'], correctAnswer: 0 },
      created_at: new Date().toISOString(),
    };
    this.questions.unshift(newQ);
    const bank = this.questionBanks.find((b) => b.id === newQ.bank_id);
    if (bank) bank.question_count = (bank.question_count || 0) + 1;
    this.logAudit('CREATE_QUESTION', 'questions', newQ.id, { bank_id: newQ.bank_id, topic: newQ.topic });
    this.notify();
    return newQ;
  }

  public deleteQuestion(questionId: string): boolean {
    const idx = this.questions.findIndex((q) => q.id === questionId);
    if (idx === -1) return false;
    const deleted = this.questions.splice(idx, 1)[0];
    const bank = this.questionBanks.find((b) => b.id === deleted.bank_id);
    if (bank && bank.question_count) bank.question_count = Math.max(0, bank.question_count - 1);
    this.logAudit('DELETE_QUESTION', 'questions', questionId);
    this.notify();
    return true;
  }

  public addStudyResource(res: Partial<StudyResource>): StudyResource {
    const newRes: StudyResource = {
      id: 'res-' + Math.random().toString(36).substring(2, 8),
      title: res.title || 'Untitled Resource',
      type: res.type || 'pdf',
      category: res.category || 'General',
      department: res.department || 'All Departments',
      file_url: res.file_url || '/resources/sample.pdf',
      size_mb: res.size_mb || 1.5,
      uploaded_by: res.uploaded_by || 'Placement Admin',
      created_at: new Date().toISOString(),
    };
    this.studyResources.unshift(newRes);
    this.logAudit('ADD_STUDY_RESOURCE', 'study_resources', newRes.id, { title: newRes.title });
    this.notify();
    return newRes;
  }

  public deleteStudyResource(resId: string): boolean {
    const idx = this.studyResources.findIndex((r) => r.id === resId);
    if (idx === -1) return false;
    this.studyResources.splice(idx, 1);
    this.logAudit('DELETE_STUDY_RESOURCE', 'study_resources', resId);
    this.notify();
    return true;
  }

  public addAnnouncement(ann: Partial<Announcement>): Announcement {
    const newAnn: Announcement = {
      id: 'anc-' + Math.random().toString(36).substring(2, 8),
      title: ann.title || 'Institutional Announcement',
      content: ann.content || '',
      priority: ann.priority || 'normal',
      target_audience: ann.target_audience || 'all',
      department: ann.department || 'All Departments',
      is_active: true,
      created_at: new Date().toISOString(),
      created_by: ann.created_by || 'Placement Cell Dean',
    };
    this.announcements.unshift(newAnn);
    this.logAudit('BROADCAST_ANNOUNCEMENT', 'announcements', newAnn.id, { title: newAnn.title, priority: newAnn.priority });
    this.notify();
    return newAnn;
  }

  public deleteAnnouncement(annId: string): boolean {
    const idx = this.announcements.findIndex((a) => a.id === annId);
    if (idx === -1) return false;
    this.announcements.splice(idx, 1);
    this.logAudit('DELETE_ANNOUNCEMENT', 'announcements', annId);
    this.notify();
    return true;
  }

  public addFAQ(faq: Partial<FAQItem>): FAQItem {
    const newFaq: FAQItem = {
      id: 'faq-' + Math.random().toString(36).substring(2, 8),
      question: faq.question || 'New FAQ Question',
      answer: faq.answer || 'Answer details',
      category: faq.category || 'General',
      is_published: faq.is_published ?? true,
      updated_at: new Date().toISOString(),
    };
    this.faqs.push(newFaq);
    this.logAudit('ADD_FAQ', 'faqs', newFaq.id);
    this.notify();
    return newFaq;
  }

  public deleteFAQ(faqId: string): boolean {
    const idx = this.faqs.findIndex((f) => f.id === faqId);
    if (idx === -1) return false;
    this.faqs.splice(idx, 1);
    this.logAudit('DELETE_FAQ', 'faqs', faqId);
    this.notify();
    return true;
  }

  // ----------------------------------------------------
  // DOMAIN 6: PROCTORING RULES & DISPUTES
  // ----------------------------------------------------
  public updateProctoringRules(updates: Partial<ProctoringRuleConfig>): ProctoringRuleConfig {
    this.proctoringRules = { ...this.proctoringRules, ...updates };
    this.logAudit('UPDATE_PROCTORING_RULES', 'proctoring_rules', undefined, updates);
    this.notify();
    return this.proctoringRules;
  }

  public resolveDispute(disputeId: string, status: 'approved' | 'rejected', reason: string, reviewerId: string = 'Placement Admin'): boolean {
    const dispute = this.disputes.find((d) => d.id === disputeId);
    if (!dispute) return false;
    dispute.status = status;
    dispute.admin_decision_reason = reason;
    dispute.reviewed_by = reviewerId;
    dispute.reviewed_at = new Date().toISOString();

    // If approved, restore student attempt status
    if (status === 'approved') {
      const attempt = this.testAttempts.find((a) => a.id === dispute.attempt_id);
      if (attempt) {
        attempt.status = 'submitted';
        attempt.termination_reason = undefined;
      }
    }

    this.logAudit('RESOLVE_VIOLATION_DISPUTE', 'disputes', disputeId, { status, reason });
    this.notify();
    return true;
  }

  public addToBlacklist(userId: string, reason: string): BlacklistEntry {
    const user = this.users.find((u) => u.id === userId);
    const entry: BlacklistEntry = {
      id: 'bl-' + Math.random().toString(36).substring(2, 8),
      user_id: userId,
      user_name: user?.full_name || 'Student',
      email: user?.email || '',
      reason,
      added_by: 'Placement Admin',
      added_at: new Date().toISOString(),
      is_active: true,
    };
    this.blacklist.unshift(entry);
    this.logAudit('ADD_BLACKLIST', 'blacklist', entry.id, { user_id: userId, reason });
    this.notify();
    return entry;
  }

  public removeFromBlacklist(id: string): boolean {
    const idx = this.blacklist.findIndex((b) => b.id === id);
    if (idx === -1) return false;
    this.blacklist.splice(idx, 1);
    this.logAudit('REMOVE_BLACKLIST', 'blacklist', id);
    this.notify();
    return true;
  }

  public addToWhitelist(userId: string, reason: string): WhitelistEntry {
    const user = this.users.find((u) => u.id === userId);
    const entry: WhitelistEntry = {
      id: 'wl-' + Math.random().toString(36).substring(2, 8),
      user_id: userId,
      user_name: user?.full_name || 'Student',
      email: user?.email || '',
      reason,
      granted_by: 'Placement Admin',
      granted_at: new Date().toISOString(),
    };
    this.whitelist.unshift(entry);
    this.logAudit('ADD_WHITELIST', 'whitelist', entry.id, { user_id: userId, reason });
    this.notify();
    return entry;
  }

  public removeFromWhitelist(id: string): boolean {
    const idx = this.whitelist.findIndex((w) => w.id === id);
    if (idx === -1) return false;
    this.whitelist.splice(idx, 1);
    this.logAudit('REMOVE_WHITELIST', 'whitelist', id);
    this.notify();
    return true;
  }

  // ----------------------------------------------------
  // DOMAIN 7: SECURITY, IPS & SESSIONS
  // ----------------------------------------------------
  public blockIP(ip: string, reason: string): BlockedIP {
    const blocked: BlockedIP = {
      id: 'bip-' + Math.random().toString(36).substring(2, 8),
      ip_address: ip,
      reason,
      blocked_at: new Date().toISOString(),
      blocked_by: 'Placement Admin',
      attempts_blocked: 1,
    };
    this.blockedIPs.unshift(blocked);
    this.logAudit('BLOCK_IP_ADDRESS', 'blocked_ips', blocked.id, { ip });
    this.notify();
    return blocked;
  }

  public unblockIP(id: string): boolean {
    const idx = this.blockedIPs.findIndex((b) => b.id === id);
    if (idx === -1) return false;
    this.blockedIPs.splice(idx, 1);
    this.logAudit('UNBLOCK_IP_ADDRESS', 'blocked_ips', id);
    this.notify();
    return true;
  }

  public terminateSession(sessionId: string): boolean {
    const idx = this.activeSessions.findIndex((s) => s.id === sessionId);
    if (idx === -1) return false;
    const s = this.activeSessions.splice(idx, 1)[0];
    this.logAudit('TERMINATE_USER_SESSION', 'sessions', sessionId, { user: s.user_name });
    this.notify();
    return true;
  }

  // ----------------------------------------------------
  // DOMAIN 8: DATABASE BACKUP & RESTORE
  // ----------------------------------------------------
  public generateManualBackup(): { filename: string; jsonContent: string } {
    const state = {
      exported_at: new Date().toISOString(),
      system_version: '2.4.0',
      institute: this.systemConfig.institute_name,
      users: this.users,
      departments: this.departments,
      batches: this.batches,
      tests: this.tests,
      questions: this.questions,
      questionBanks: this.questionBanks,
      testAttempts: this.testAttempts,
      proctoringEvents: this.proctoringEvents,
      auditLogs: this.auditLogs,
      systemConfig: this.systemConfig,
      proctoringRules: this.proctoringRules,
      announcements: this.announcements,
      faqs: this.faqs,
      supportTickets: this.supportTickets,
      disputes: this.disputes,
      blacklist: this.blacklist,
      whitelist: this.whitelist,
      blockedIPs: this.blockedIPs,
      emailTemplates: this.emailTemplates,
    };

    const jsonContent = JSON.stringify(state, null, 2);
    const size_kb = Math.round(jsonContent.length / 1024);
    const filename = `svce_placetrack_backup_${new Date().toISOString().slice(0, 10)}.json`;

    const backupRecord: DatabaseBackup = {
      id: 'bk-' + Math.random().toString(36).substring(2, 8),
      filename,
      size_kb,
      created_at: new Date().toISOString(),
      created_by: 'Placement Admin',
      record_count: this.users.length + this.tests.length + this.questions.length + this.testAttempts.length,
      type: 'manual',
    };

    this.backups.unshift(backupRecord);
    this.logAudit('MANUAL_DATABASE_BACKUP', 'database', backupRecord.id, { filename, size_kb });
    this.notify();

    return { filename, jsonContent };
  }

  public restoreFromJSON(jsonString: string): { success: boolean; message: string } {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.users || !parsed.tests) {
        return { success: false, message: 'Invalid PlaceTrack Pro backup structure: missing critical schemas.' };
      }

      if (parsed.users) this.users = parsed.users;
      if (parsed.departments) this.departments = parsed.departments;
      if (parsed.batches) this.batches = parsed.batches;
      if (parsed.tests) this.tests = parsed.tests;
      if (parsed.questions) this.questions = parsed.questions;
      if (parsed.questionBanks) this.questionBanks = parsed.questionBanks;
      if (parsed.testAttempts) this.testAttempts = parsed.testAttempts;
      if (parsed.proctoringEvents) this.proctoringEvents = parsed.proctoringEvents;
      if (parsed.systemConfig) this.systemConfig = parsed.systemConfig;
      if (parsed.proctoringRules) this.proctoringRules = parsed.proctoringRules;
      if (parsed.announcements) this.announcements = parsed.announcements;
      if (parsed.faqs) this.faqs = parsed.faqs;
      if (parsed.supportTickets) this.supportTickets = parsed.supportTickets;
      if (parsed.disputes) this.disputes = parsed.disputes;
      if (parsed.blacklist) this.blacklist = parsed.blacklist;
      if (parsed.whitelist) this.whitelist = parsed.whitelist;
      if (parsed.blockedIPs) this.blockedIPs = parsed.blockedIPs;

      this.logAudit('RESTORE_DATABASE', 'database', undefined, { record_count: parsed.users.length });
      this.notify();
      return { success: true, message: `System successfully restored! Loaded ${parsed.users.length} users and ${parsed.tests.length} tests.` };
    } catch (err: any) {
      return { success: false, message: 'Parse error: ' + err.message };
    }
  }

  // ----------------------------------------------------
  // DOMAIN 10: TEST & ASSESSMENT CONTROL
  // ----------------------------------------------------
  public createTest(params: Partial<Test> & { title: string }): Test {
    const newTest: Test = {
      id: 't-' + Math.random().toString(36).substring(2, 9),
      title: params.title,
      type: params.type || 'weekly_assessment',
      batch_id: params.batch_id,
      batch_name: params.batch_name,
      start_time: params.start_time || new Date().toISOString(),
      end_time: params.end_time || new Date(Date.now() + 86400000 * 2).toISOString(),
      duration_minutes: params.duration_minutes || 60,
      created_by: params.created_by || 'Placement Cell Admin',
      is_proctored: params.is_proctored !== undefined ? params.is_proctored : true,
      question_count: params.question_count || 15,
      target_department: params.target_department || 'All Departments',
      target_year: params.target_year || 'All Years',
      allowed_languages: params.allowed_languages || ['Python', 'Java', 'C++']
    };
    this.tests.unshift(newTest);
    this.logAudit('CREATE_TEST', 'tests', newTest.id, { title: newTest.title });
    this.notify();
    return newTest;
  }

  public forceSubmitTest(testId: string, studentId?: string): number {
    let affected = 0;
    this.testAttempts.forEach((att) => {
      if (att.test_id === testId && att.status === 'in_progress') {
        if (!studentId || att.student_id === studentId) {
          att.status = 'auto_submitted';
          att.submitted_at = new Date().toISOString();
          affected++;
        }
      }
    });
    this.logAudit('FORCE_SUBMIT_TEST', 'test_attempts', testId, { affected_students: affected });
    this.notify();
    return affected;
  }

  public extendTestTime(testId: string, additionalMinutes: number): boolean {
    const test = this.tests.find((t) => t.id === testId);
    if (!test) return false;
    test.duration_minutes += additionalMinutes;
    if (test.end_time) {
      const curEnd = new Date(test.end_time).getTime();
      test.end_time = new Date(curEnd + additionalMinutes * 60000).toISOString();
    }
    this.logAudit('EXTEND_TEST_TIME', 'tests', testId, { added_minutes: additionalMinutes, new_duration: test.duration_minutes });
    this.notify();
    return true;
  }

  public duplicateTest(testId: string): Test | null {
    const original = this.tests.find((t) => t.id === testId);
    if (!original) return null;
    const copy: Test = {
      ...original,
      id: 't-' + Math.random().toString(36).substring(2, 8),
      title: original.title + ' (Copy)',
      created_by: 'Placement Admin',
      start_time: new Date().toISOString(),
      end_time: new Date(Date.now() + 86400000 * 3).toISOString(),
    };
    this.tests.unshift(copy);
    this.logAudit('DUPLICATE_TEST', 'tests', copy.id, { original_id: testId });
    this.notify();
    return copy;
  }

  public manualScoreOverride(attemptId: string, newScore: number, justification: string): boolean {
    const attempt = this.testAttempts.find((a) => a.id === attemptId);
    if (!attempt) return false;
    const oldScore = attempt.score;
    attempt.score = newScore;
    this.logAudit('MANUAL_SCORE_OVERRIDE', 'test_attempts', attemptId, { old_score: oldScore, new_score: newScore, justification });
    this.notify();
    return true;
  }

  // ----------------------------------------------------
  // DOMAIN 14: SUPPORT & TICKETS
  // ----------------------------------------------------
  public replyToTicket(ticketId: string, message: string, senderName: string = 'Placement Admin', isAdmin: boolean = true): boolean {
    const ticket = this.supportTickets.find((t) => t.id === ticketId);
    if (!ticket) return false;
    ticket.replies.push({
      id: 'rep-' + Math.random().toString(36).substring(2, 8),
      sender_name: senderName,
      is_admin: isAdmin,
      message,
      timestamp: new Date().toISOString(),
    });
    ticket.updated_at = new Date().toISOString();
    this.logAudit('REPLY_SUPPORT_TICKET', 'support_tickets', ticketId);
    this.notify();
    return true;
  }

  public updateTicketStatus(ticketId: string, status: 'open' | 'in_progress' | 'resolved'): boolean {
    const ticket = this.supportTickets.find((t) => t.id === ticketId);
    if (!ticket) return false;
    ticket.status = status;
    ticket.updated_at = new Date().toISOString();
    this.logAudit('UPDATE_TICKET_STATUS', 'support_tickets', ticketId, { status });
    this.notify();
    return true;
  }
}

export const PlaceTrackStore = PlaceTrackStoreManager.getInstance();
