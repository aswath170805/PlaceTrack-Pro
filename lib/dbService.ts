import { createClient } from '@/lib/supabase/client';
import { 
  MOCK_BATCHES, 
  MOCK_PROFILES, 
  MOCK_QUESTION_BANKS, 
  MOCK_QUESTIONS, 
  MOCK_TESTS, 
  MOCK_TEST_ATTEMPTS, 
  MOCK_PROCTORING_EVENTS, 
  MOCK_ATTENDANCE, 
  MOCK_AUDIT_LOGS,
  Batch,
  Profile,
  QuestionBank,
  Question,
  Test,
  TestAttempt,
  ProctoringEvent,
  AttendanceRecord,
  AuditLog
} from '@/lib/mockData';

export class DatabaseService {
  private static getSupabase() {
    return createClient();
  }

  // BATCHES
  static async getBatches(): Promise<Batch[]> {
    try {
      const supabase = this.getSupabase();
      const { data, error } = await supabase.from('batches').select('*');
      if (!error && data) return data as Batch[];
    } catch (e) {
      console.warn('Supabase DB getBatches error:', e);
    }
    return MOCK_BATCHES;
  }

  static async createBatch(name: string, createdBy?: string): Promise<Batch> {
    try {
      const supabase = this.getSupabase();
      const { data, error } = await supabase.from('batches').insert([{ name, created_by: createdBy }]).select().single();
      if (!error && data) return data as Batch;
    } catch (e) {
      console.warn('Supabase DB createBatch error:', e);
    }
    const newBatch: Batch = { id: 'b-' + Math.random().toString(36).substring(2, 9), name, created_by: createdBy, student_count: 0 };
    MOCK_BATCHES.push(newBatch);
    return newBatch;
  }

  // PROFILES / USERS / VERIFICATION DESK
  static async getProfiles(): Promise<Profile[]> {
    try {
      const supabase = this.getSupabase();
      const { data, error } = await supabase.from('profiles').select('*');
      if (!error && data) return data as Profile[];
    } catch (e) {
      console.warn('Supabase DB getProfiles error:', e);
    }
    return MOCK_PROFILES;
  }

  static async getPendingVerifications(): Promise<Profile[]> {
    try {
      const supabase = this.getSupabase();
      const { data, error } = await supabase.from('profiles').select('*').eq('is_verified', false);
      if (!error && data) return data as Profile[];
    } catch (e) {
      console.warn('Supabase DB getPendingVerifications error:', e);
    }
    return MOCK_PROFILES.filter((p) => !p.is_verified);
  }

  static async verifyUserAccess(userId: string, isVerified: boolean): Promise<void> {
    try {
      const supabase = this.getSupabase();
      await supabase.from('profiles').update({ is_verified: isVerified }).eq('id', userId);
    } catch (e) {
      console.warn('Supabase DB verifyUserAccess error:', e);
    }
    const profile = MOCK_PROFILES.find((p) => p.id === userId);
    if (profile) profile.is_verified = isVerified;

    await this.logAdminAction(isVerified ? 'GRANT_USER_ACCESS' : 'REVOKE_USER_ACCESS', 'profiles', userId, { is_verified: isVerified });
  }

  static async updateProfileRole(userId: string, role: 'student' | 'faculty' | 'admin'): Promise<void> {
    try {
      const supabase = this.getSupabase();
      await supabase.from('profiles').update({ role }).eq('id', userId);
    } catch (e) {
      console.warn('Supabase DB updateProfileRole error:', e);
    }
    const profile = MOCK_PROFILES.find((p) => p.id === userId);
    if (profile) profile.role = role;
  }

  // QUESTION BANKS & QUESTIONS
  static async getQuestionBanks(): Promise<QuestionBank[]> {
    try {
      const supabase = this.getSupabase();
      const { data, error } = await supabase.from('question_banks').select('*');
      if (!error && data) return data as QuestionBank[];
    } catch (e) {
      console.warn('Supabase DB getQuestionBanks error:', e);
    }
    return MOCK_QUESTION_BANKS;
  }

  static async createQuestionBank(title: string, topic: string, createdBy: string): Promise<QuestionBank> {
    try {
      const supabase = this.getSupabase();
      const { data, error } = await supabase.from('question_banks').insert([{ title, topic, created_by: createdBy }]).select().single();
      if (!error && data) return data as QuestionBank;
    } catch (e) {
      console.warn('Supabase DB createQuestionBank error:', e);
    }
    const newBank: QuestionBank = { id: 'qb-' + Math.random().toString(36).substring(2, 9), title, topic, question_count: 0, created_by: createdBy };
    MOCK_QUESTION_BANKS.push(newBank);
    return newBank;
  }

  static async getQuestions(bankId?: string): Promise<Question[]> {
    try {
      const supabase = this.getSupabase();
      let query = supabase.from('questions').select('*');
      if (bankId) query = query.eq('bank_id', bankId);
      const { data, error } = await query;
      if (!error && data) return data as Question[];
    } catch (e) {
      console.warn('Supabase DB getQuestions error:', e);
    }
    return bankId ? MOCK_QUESTIONS.filter((q) => q.bank_id === bankId) : MOCK_QUESTIONS;
  }

  static async createQuestion(question: Partial<Question>): Promise<Question> {
    try {
      const supabase = this.getSupabase();
      const { data, error } = await supabase.from('questions').insert([{
        bank_id: question.bank_id,
        type: question.type,
        topic: question.topic,
        difficulty: question.difficulty,
        content: question.content,
      }]).select().single();
      if (!error && data) return data as Question;
    } catch (e) {
      console.warn('Supabase DB createQuestion error:', e);
    }
    const newQ: Question = {
      id: 'q-' + Math.random().toString(36).substring(2, 9),
      bank_id: question.bank_id || MOCK_QUESTION_BANKS[0].id,
      type: question.type || 'mcq',
      topic: question.topic || 'General',
      difficulty: question.difficulty || 'medium',
      content: question.content || { questionText: 'Sample Question' },
      created_at: new Date().toISOString(),
    };
    MOCK_QUESTIONS.unshift(newQ);
    return newQ;
  }

  // TESTS & TEST ATTEMPTS
  static async getTests(): Promise<Test[]> {
    try {
      const supabase = this.getSupabase();
      const { data, error } = await supabase.from('tests').select('*');
      if (!error && data) return data as Test[];
    } catch (e) {
      console.warn('Supabase DB getTests error:', e);
    }
    return MOCK_TESTS;
  }

  static async createTest(testData: Partial<Test>): Promise<Test> {
    try {
      const supabase = this.getSupabase();
      const { data, error } = await supabase.from('tests').insert([{
        title: testData.title,
        type: testData.type,
        batch_id: testData.batch_id,
        duration_minutes: testData.duration_minutes,
        is_proctored: testData.is_proctored,
      }]).select().single();
      if (!error && data) return data as Test;
    } catch (e) {
      console.warn('Supabase DB createTest error:', e);
    }
    const newTest: Test = {
      id: 't-' + Math.random().toString(36).substring(2, 9),
      title: testData.title || 'New Assessment',
      type: testData.type || 'weekly_assessment',
      batch_id: testData.batch_id,
      batch_name: MOCK_BATCHES.find((b) => b.id === testData.batch_id)?.name || 'CS-2026 Batch A (SVCE)',
      start_time: new Date().toISOString(),
      end_time: new Date(Date.now() + 86400000).toISOString(),
      duration_minutes: testData.duration_minutes || 60,
      created_by: testData.created_by || 'Dr. Sarah Connor',
      is_proctored: testData.is_proctored !== undefined ? testData.is_proctored : true,
      question_count: 5,
    };
    MOCK_TESTS.unshift(newTest);
    return newTest;
  }

  static async getTestAttempts(studentId?: string): Promise<TestAttempt[]> {
    try {
      const supabase = this.getSupabase();
      let query = supabase.from('test_attempts').select('*');
      if (studentId) query = query.eq('student_id', studentId);
      const { data, error } = await query;
      if (!error && data) return data as TestAttempt[];
    } catch (e) {
      console.warn('Supabase DB getTestAttempts error:', e);
    }
    return studentId ? MOCK_TEST_ATTEMPTS.filter((a) => a.student_id === studentId) : MOCK_TEST_ATTEMPTS;
  }

  static async submitTestAttempt(attemptData: Partial<TestAttempt>): Promise<TestAttempt> {
    try {
      const supabase = this.getSupabase();
      const { data, error } = await supabase.from('test_attempts').insert([{
        test_id: attemptData.test_id,
        student_id: attemptData.student_id,
        score: attemptData.score,
        status: 'submitted',
      }]).select().single();
      if (!error && data) return data as TestAttempt;
    } catch (e) {
      console.warn('Supabase DB submitTestAttempt error:', e);
    }
    const newAttempt: TestAttempt = {
      id: attemptData.id || 'att-' + Math.random().toString(36).substring(2, 9),
      test_id: attemptData.test_id || 't-101',
      test_title: attemptData.test_title || 'Daily Practice Set',
      student_id: attemptData.student_id || 's1111111-1111-1111-1111-111111111111',
      student_name: attemptData.student_name || 'Alex Johnson',
      started_at: attemptData.started_at || new Date().toISOString(),
      submitted_at: new Date().toISOString(),
      score: attemptData.score !== undefined ? attemptData.score : 85,
      max_score: 100,
      status: 'submitted',
      flag_count: attemptData.flag_count || 0,
    };
    MOCK_TEST_ATTEMPTS.unshift(newAttempt);
    return newAttempt;
  }

  // PROCTORING EVENTS
  static async getProctoringEvents(attemptId?: string): Promise<ProctoringEvent[]> {
    try {
      const supabase = this.getSupabase();
      let query = supabase.from('proctoring_events').select('*');
      if (attemptId) query = query.eq('attempt_id', attemptId);
      const { data, error } = await query;
      if (!error && data) return data as ProctoringEvent[];
    } catch (e) {
      console.warn('Supabase DB getProctoringEvents error:', e);
    }
    return attemptId ? MOCK_PROCTORING_EVENTS.filter((e) => e.attempt_id === attemptId) : MOCK_PROCTORING_EVENTS;
  }

  static async logProctoringEvent(eventData: Partial<ProctoringEvent>): Promise<ProctoringEvent> {
    try {
      const supabase = this.getSupabase();
      const { data, error } = await supabase.from('proctoring_events').insert([{
        attempt_id: eventData.attempt_id,
        event_type: eventData.event_type,
        severity: eventData.severity,
        snapshot_url: eventData.snapshot_url,
      }]).select().single();
      if (!error && data) return data as ProctoringEvent;
    } catch (e) {
      console.warn('Supabase DB logProctoringEvent error:', e);
    }
    const newEvent: ProctoringEvent = {
      id: eventData.id || 'pe-' + Math.random().toString(36).substring(2, 9),
      attempt_id: eventData.attempt_id || 'att-2',
      student_name: eventData.student_name || 'Alex Johnson',
      test_title: eventData.test_title || 'Weekly Proctored Assessment',
      event_type: eventData.event_type || 'tab_switch',
      severity: eventData.severity || 'medium',
      snapshot_url: eventData.snapshot_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&auto=format&fit=crop&q=60',
      created_at: new Date().toISOString(),
    };
    MOCK_PROCTORING_EVENTS.unshift(newEvent);
    return newEvent;
  }

  // ATTENDANCE
  static async getAttendanceRecords(studentId?: string): Promise<AttendanceRecord[]> {
    try {
      const supabase = this.getSupabase();
      let query = supabase.from('attendance').select('*');
      if (studentId) query = query.eq('student_id', studentId);
      const { data, error } = await query;
      if (!error && data) return data as AttendanceRecord[];
    } catch (e) {
      console.warn('Supabase DB getAttendanceRecords error:', e);
    }
    return studentId ? MOCK_ATTENDANCE.filter((a) => a.student_id === studentId) : MOCK_ATTENDANCE;
  }

  static async submitAbsenceReason(recordId: string, reason: string): Promise<void> {
    try {
      const supabase = this.getSupabase();
      await supabase.from('attendance').update({ absence_reason: reason, reviewed_by_faculty: false }).eq('id', recordId);
    } catch (e) {
      console.warn('Supabase DB submitAbsenceReason error:', e);
    }
    const rec = MOCK_ATTENDANCE.find((a) => a.id === recordId);
    if (rec) {
      rec.absence_reason = reason;
      rec.reviewed_by_faculty = false;
    }
  }

  static async reviewAttendance(recordId: string, statusOverride?: 'present' | 'absent'): Promise<void> {
    try {
      const supabase = this.getSupabase();
      const updates: any = { reviewed_by_faculty: true };
      if (statusOverride) updates.status = statusOverride;
      await supabase.from('attendance').update(updates).eq('id', recordId);
    } catch (e) {
      console.warn('Supabase DB reviewAttendance error:', e);
    }
    const rec = MOCK_ATTENDANCE.find((a) => a.id === recordId);
    if (rec) {
      rec.reviewed_by_faculty = true;
      if (statusOverride) rec.status = statusOverride;
    }
  }

  // AUDIT LOGS
  static async getAuditLogs(): Promise<AuditLog[]> {
    try {
      const supabase = this.getSupabase();
      const { data, error } = await supabase.from('audit_logs').select('*');
      if (!error && data) return data as AuditLog[];
    } catch (e) {
      console.warn('Supabase DB getAuditLogs error:', e);
    }
    return MOCK_AUDIT_LOGS;
  }

  static async logAdminAction(action: string, targetTable: string, targetId?: string, metadata?: any): Promise<void> {
    try {
      const supabase = this.getSupabase();
      await supabase.from('audit_logs').insert([{ action, target_table: targetTable, target_id: targetId, metadata }]);
    } catch (e) {
      console.warn('Supabase DB logAdminAction error:', e);
    }
    const newLog: AuditLog = {
      id: 'log-' + Math.random().toString(36).substring(2, 9),
      actor_id: 'a3333333-3333-3333-3333-333333333333',
      actor_name: 'System Admin',
      action,
      target_table: targetTable,
      target_id: targetId,
      metadata,
      created_at: new Date().toISOString(),
    };
    MOCK_AUDIT_LOGS.unshift(newLog);
  }
}
