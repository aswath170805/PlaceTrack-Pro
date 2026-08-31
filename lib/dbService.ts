import { createClient } from '@/lib/supabase/client';
import { 
  Batch,
  Profile,
  VerificationRequest,
  QuestionBank,
  Question,
  Test,
  TestAttempt,
  ProctoringEvent,
  AttendanceRecord,
  AuditLog,
  Announcement,
  PlacementDrive
} from '@/lib/mockData';

export class DatabaseService {
  private static getSupabase() {
    return createClient();
  }

  // BATCHES
  static async getBatches(): Promise<Batch[]> {
    try {
      const supabase = this.getSupabase();
      const { data, error } = await supabase.from('batches').select('*').order('created_at', { ascending: false });
      if (!error && data) return data as Batch[];
    } catch (e) {
      console.warn('Supabase getBatches error:', e);
    }
    return [];
  }

  static async createBatch(name: string, createdBy?: string, department?: string): Promise<Batch | null> {
    try {
      const supabase = this.getSupabase();
      const { data, error } = await supabase.from('batches').insert([{
        name,
        created_by: createdBy,
        department: department || 'Computer Science'
      }]).select().single();
      if (!error && data) return data as Batch;
    } catch (e) {
      console.warn('Supabase createBatch error:', e);
    }
    return null;
  }

  // PROFILES & VERIFICATION
  static async getProfiles(): Promise<Profile[]> {
    try {
      const supabase = this.getSupabase();
      const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (!error && data) return data as Profile[];
    } catch (e) {
      console.warn('Supabase getProfiles error:', e);
    }
    return [];
  }

  static async createProfile(profile: Partial<Profile>): Promise<Profile | null> {
    try {
      const supabase = this.getSupabase();
      const { data, error } = await supabase.from('profiles').insert([{
        id: profile.id || undefined,
        email: profile.email,
        full_name: profile.full_name,
        role: profile.role,
        department: profile.department || 'Computer Science',
        year_of_study: profile.year_of_study || 'Final Year',
        batch_id: profile.batch_id,
        is_verified: profile.is_verified ?? false,
      }]).select().single();

      if (!error && data) return data as Profile;
    } catch (e) {
      console.warn('Supabase createProfile error:', e);
    }
    return null;
  }

  static async updateProfileRole(userId: string, role: 'student' | 'faculty' | 'admin'): Promise<void> {
    try {
      const supabase = this.getSupabase();
      await supabase.from('profiles').update({ role }).eq('id', userId);
      await this.logAdminAction('UPDATE_USER_ROLE', 'profiles', userId, { new_role: role });
    } catch (e) {
      console.warn('Supabase updateProfileRole error:', e);
    }
  }

  // VERIFICATION REQUESTS (Admin Verification Desk)
  static async getVerificationRequests(): Promise<VerificationRequest[]> {
    try {
      const supabase = this.getSupabase();
      const { data, error } = await supabase.from('verification_requests').select('*').order('submitted_at', { ascending: false });
      if (!error && data) return data as VerificationRequest[];
    } catch (e) {
      console.warn('Supabase getVerificationRequests error:', e);
    }
    return [];
  }

  static async createVerificationRequest(reqData: Partial<VerificationRequest>): Promise<VerificationRequest | null> {
    try {
      const supabase = this.getSupabase();
      const { data, error } = await supabase.from('verification_requests').insert([{
        user_id: reqData.user_id,
        student_name: reqData.student_name,
        email: reqData.email,
        role: reqData.role,
        department: reqData.department,
        year_of_study: reqData.year_of_study,
        batch_id: reqData.batch_id,
        status: 'pending',
      }]).select().single();

      if (!error && data) return data as VerificationRequest;
    } catch (e) {
      console.warn('Supabase createVerificationRequest error:', e);
    }
    return null;
  }

  static async approveVerificationRequest(requestId: string, userId: string, reviewerId?: string): Promise<void> {
    try {
      const supabase = this.getSupabase();
      await supabase.from('verification_requests').update({
        status: 'approved',
        reviewed_at: new Date().toISOString(),
        reviewed_by: reviewerId
      }).eq('id', requestId);

      await supabase.from('profiles').update({ is_verified: true }).eq('id', userId);
      await this.logAdminAction('APPROVE_USER_VERIFICATION', 'verification_requests', requestId, { user_id: userId });
    } catch (e) {
      console.warn('Supabase approveVerificationRequest error:', e);
    }
  }

  static async rejectVerificationRequest(requestId: string, userId: string, reason?: string, reviewerId?: string): Promise<void> {
    try {
      const supabase = this.getSupabase();
      await supabase.from('verification_requests').update({
        status: 'rejected',
        rejection_reason: reason || 'Access request rejected by Placement Admin.',
        reviewed_at: new Date().toISOString(),
        reviewed_by: reviewerId
      }).eq('id', requestId);

      await supabase.from('profiles').update({ is_verified: false }).eq('id', userId);
      await this.logAdminAction('REJECT_USER_VERIFICATION', 'verification_requests', requestId, { user_id: userId, reason });
    } catch (e) {
      console.warn('Supabase rejectVerificationRequest error:', e);
    }
  }

  // QUESTION BANKS & QUESTIONS
  static async getQuestionBanks(): Promise<QuestionBank[]> {
    try {
      const supabase = this.getSupabase();
      const { data, error } = await supabase.from('question_banks').select('*').order('created_at', { ascending: false });
      if (!error && data) return data as QuestionBank[];
    } catch (e) {
      console.warn('Supabase getQuestionBanks error:', e);
    }
    return [];
  }

  static async createQuestionBank(title: string, topic: string, createdBy: string, description?: string): Promise<QuestionBank | null> {
    try {
      const supabase = this.getSupabase();
      const { data, error } = await supabase.from('question_banks').insert([{
        title,
        topic,
        created_by: createdBy,
        description
      }]).select().single();
      if (!error && data) return data as QuestionBank;
    } catch (e) {
      console.warn('Supabase createQuestionBank error:', e);
    }
    return null;
  }

  static async getQuestions(bankId?: string): Promise<Question[]> {
    try {
      const supabase = this.getSupabase();
      let query = supabase.from('questions').select('*').order('created_at', { ascending: false });
      if (bankId) query = query.eq('bank_id', bankId);
      const { data, error } = await query;
      if (!error && data) return data as Question[];
    } catch (e) {
      console.warn('Supabase getQuestions error:', e);
    }
    return [];
  }

  static async createQuestion(question: Partial<Question>): Promise<Question | null> {
    try {
      const supabase = this.getSupabase();
      const { data, error } = await supabase.from('questions').insert([{
        bank_id: question.bank_id,
        type: question.type,
        topic: question.topic,
        difficulty: question.difficulty,
        content: question.content,
        marks: question.marks || 1,
      }]).select().single();
      if (!error && data) return data as Question;
    } catch (e) {
      console.warn('Supabase createQuestion error:', e);
    }
    return null;
  }

  // TESTS & TEST ATTEMPTS
  static async getTests(): Promise<Test[]> {
    try {
      const supabase = this.getSupabase();
      const { data, error } = await supabase.from('tests').select('*').order('created_at', { ascending: false });
      if (!error && data) return data as Test[];
    } catch (e) {
      console.warn('Supabase getTests error:', e);
    }
    return [];
  }

  static async createTest(testData: Partial<Test>): Promise<Test | null> {
    try {
      const supabase = this.getSupabase();
      const { data, error } = await supabase.from('tests').insert([{
        title: testData.title,
        type: testData.type,
        batch_id: testData.batch_id,
        duration_minutes: testData.duration_minutes,
        is_proctored: testData.is_proctored,
        instructions: testData.instructions,
      }]).select().single();
      if (!error && data) return data as Test;
    } catch (e) {
      console.warn('Supabase createTest error:', e);
    }
    return null;
  }

  static async getTestAttempts(studentId?: string): Promise<TestAttempt[]> {
    try {
      const supabase = this.getSupabase();
      let query = supabase.from('test_attempts').select('*').order('started_at', { ascending: false });
      if (studentId) query = query.eq('student_id', studentId);
      const { data, error } = await query;
      if (!error && data) return data as TestAttempt[];
    } catch (e) {
      console.warn('Supabase getTestAttempts error:', e);
    }
    return [];
  }

  static async submitTestAttempt(attemptData: Partial<TestAttempt>): Promise<TestAttempt | null> {
    try {
      const supabase = this.getSupabase();
      const { data, error } = await supabase.from('test_attempts').insert([{
        test_id: attemptData.test_id,
        student_id: attemptData.student_id,
        score: attemptData.score,
        status: 'submitted',
        submitted_at: new Date().toISOString(),
      }]).select().single();
      if (!error && data) return data as TestAttempt;
    } catch (e) {
      console.warn('Supabase submitTestAttempt error:', e);
    }
    return null;
  }

  // PROCTORING EVENTS
  static async getProctoringEvents(attemptId?: string): Promise<ProctoringEvent[]> {
    try {
      const supabase = this.getSupabase();
      let query = supabase.from('proctoring_events').select('*').order('created_at', { ascending: false });
      if (attemptId) query = query.eq('attempt_id', attemptId);
      const { data, error } = await query;
      if (!error && data) return data as ProctoringEvent[];
    } catch (e) {
      console.warn('Supabase getProctoringEvents error:', e);
    }
    return [];
  }

  static async logProctoringEvent(eventData: Partial<ProctoringEvent>): Promise<ProctoringEvent | null> {
    try {
      const supabase = this.getSupabase();
      const { data, error } = await supabase.from('proctoring_events').insert([{
        attempt_id: eventData.attempt_id,
        event_type: eventData.event_type,
        severity: eventData.severity,
        snapshot_url: eventData.snapshot_url,
        details: eventData.details,
      }]).select().single();
      if (!error && data) return data as ProctoringEvent;
    } catch (e) {
      console.warn('Supabase logProctoringEvent error:', e);
    }
    return null;
  }

  // ATTENDANCE
  static async getAttendanceRecords(studentId?: string): Promise<AttendanceRecord[]> {
    try {
      const supabase = this.getSupabase();
      let query = supabase.from('attendance').select('*').order('created_at', { ascending: false });
      if (studentId) query = query.eq('student_id', studentId);
      const { data, error } = await query;
      if (!error && data) return data as AttendanceRecord[];
    } catch (e) {
      console.warn('Supabase getAttendanceRecords error:', e);
    }
    return [];
  }

  static async submitAbsenceReason(recordId: string, reason: string): Promise<void> {
    try {
      const supabase = this.getSupabase();
      await supabase.from('attendance').update({ absence_reason: reason, reviewed_by_faculty: false }).eq('id', recordId);
    } catch (e) {
      console.warn('Supabase submitAbsenceReason error:', e);
    }
  }

  static async reviewAttendance(recordId: string, statusOverride?: 'present' | 'absent'): Promise<void> {
    try {
      const supabase = this.getSupabase();
      const updates: any = { reviewed_by_faculty: true };
      if (statusOverride) updates.status = statusOverride;
      await supabase.from('attendance').update(updates).eq('id', recordId);
    } catch (e) {
      console.warn('Supabase reviewAttendance error:', e);
    }
  }

  // AUDIT LOGS
  static async getAuditLogs(): Promise<AuditLog[]> {
    try {
      const supabase = this.getSupabase();
      const { data, error } = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false });
      if (!error && data) return data as AuditLog[];
    } catch (e) {
      console.warn('Supabase getAuditLogs error:', e);
    }
    return [];
  }

  static async logAdminAction(action: string, targetTable: string, targetId?: string, metadata?: any): Promise<void> {
    try {
      const supabase = this.getSupabase();
      await supabase.from('audit_logs').insert([{ action, target_table: targetTable, target_id: targetId, metadata }]);
    } catch (e) {
      console.warn('Supabase logAdminAction error:', e);
    }
  }

  // ANNOUNCEMENTS
  static async getAnnouncements(): Promise<Announcement[]> {
    try {
      const supabase = this.getSupabase();
      const { data, error } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
      if (!error && data) return data as Announcement[];
    } catch (e) {
      console.warn('Supabase getAnnouncements error:', e);
    }
    return [];
  }

  static async createAnnouncement(announcement: Partial<Announcement>): Promise<Announcement | null> {
    try {
      const supabase = this.getSupabase();
      const { data, error } = await supabase.from('announcements').insert([{
        title: announcement.title,
        content: announcement.content,
        priority: announcement.priority || 'medium',
        target_batch_id: announcement.target_batch_id,
      }]).select().single();
      if (!error && data) return data as Announcement;
    } catch (e) {
      console.warn('Supabase createAnnouncement error:', e);
    }
    return null;
  }

  // PLACEMENT DRIVES
  static async getPlacementDrives(): Promise<PlacementDrive[]> {
    try {
      const supabase = this.getSupabase();
      const { data, error } = await supabase.from('placement_drives').select('*').order('created_at', { ascending: false });
      if (!error && data) return data as PlacementDrive[];
    } catch (e) {
      console.warn('Supabase getPlacementDrives error:', e);
    }
    return [];
  }

  static async createPlacementDrive(drive: Partial<PlacementDrive>): Promise<PlacementDrive | null> {
    try {
      const supabase = this.getSupabase();
      const { data, error } = await supabase.from('placement_drives').insert([{
        company_name: drive.company_name,
        role_title: drive.role_title,
        package_lpa: drive.package_lpa,
        eligible_departments: drive.eligible_departments,
        drive_date: drive.drive_date,
        status: drive.status || 'upcoming',
      }]).select().single();
      if (!error && data) return data as PlacementDrive;
    } catch (e) {
      console.warn('Supabase createPlacementDrive error:', e);
    }
    return null;
  }
}

