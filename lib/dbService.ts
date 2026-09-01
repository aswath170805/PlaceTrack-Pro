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
<<<<<<< HEAD
  PlacementDrive,
  MOCK_PROFILES,
  SEED_QUESTION_BANKS,
  SEED_QUESTIONS,
  SEED_TESTS,
  SEED_TEST_ATTEMPTS,
  SEED_ATTENDANCE
} from '@/lib/mockData';

const LS_PROFILES = 'placetrack_local_profiles';
const LS_REQUESTS = 'placetrack_local_verification_requests';
const LS_CREDS = 'placetrack_local_credentials';
const LS_TESTS = 'placetrack_local_tests';
const LS_QUESTION_BANKS = 'placetrack_local_question_banks';
const LS_QUESTIONS = 'placetrack_local_questions';
const LS_TEST_ATTEMPTS = 'placetrack_local_test_attempts';
const LS_ATTENDANCE = 'placetrack_local_attendance';

function newId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function readLocal<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeLocal(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

function mergeById<T extends { id: string }>(primary: T[], extra: T[]): T[] {
  const map = new Map<string, T>();
  primary.forEach((item) => map.set(item.id, item));
  extra.forEach((item) => map.set(item.id, { ...map.get(item.id), ...item }));
  return Array.from(map.values());
}

=======
  PlacementDrive
} from '@/lib/mockData';

>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
export class DatabaseService {
  private static getSupabase() {
    return createClient();
  }

<<<<<<< HEAD
  static saveCredential(email: string, password: string): void {
    const creds = readLocal<Record<string, string>>(LS_CREDS, {});
    creds[email.toLowerCase().trim()] = password;
    writeLocal(LS_CREDS, creds);
  }

  static verifyCredential(email: string, password: string): boolean {
    const creds = readLocal<Record<string, string>>(LS_CREDS, {});
    const stored = creds[email.toLowerCase().trim()];
    if (!stored) return true;
    return stored === password;
  }

=======
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
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
<<<<<<< HEAD
    const local = readLocal<Profile[]>(LS_PROFILES, []);
    let remote: Profile[] = [];
    try {
      const supabase = this.getSupabase();
      const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (!error && data) remote = data as Profile[];
    } catch (e) {
      console.warn('Supabase getProfiles error:', e);
    }

    const merged = mergeById(MOCK_PROFILES, mergeById(remote, local));
    const byEmail = new Map<string, Profile>();
    merged.forEach((profile) => {
      const key = profile.email?.toLowerCase() || profile.id;
      const prev = byEmail.get(key);
      if (!prev || new Date(profile.created_at).getTime() >= new Date(prev.created_at).getTime()) {
        byEmail.set(key, profile);
      }
    });
    return Array.from(byEmail.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  static async createProfile(profile: Partial<Profile>): Promise<Profile | null> {
    const existing = (await this.getProfiles()).find(
      (p) => p.email && profile.email && p.email.toLowerCase() === profile.email.toLowerCase()
    );
    if (existing) return existing;

    const localProfile: Profile = {
      id: profile.id || newId(),
      email: profile.email,
      full_name: profile.full_name || 'New User',
      role: profile.role || 'student',
      department: profile.department || 'CSE',
      year_of_study: profile.year_of_study || (profile.role === 'faculty' ? 'All' : '4'),
      batch_id: profile.batch_id,
      is_verified: profile.is_verified ?? false,
      created_at: profile.created_at || new Date().toISOString(),
    };

    const local = readLocal<Profile[]>(LS_PROFILES, []);
    writeLocal(LS_PROFILES, [localProfile, ...local.filter((p) => p.id !== localProfile.id)]);

    try {
      const supabase = this.getSupabase();
      const { data, error } = await supabase.from('profiles').insert([{
        id: localProfile.id,
        email: localProfile.email,
        full_name: localProfile.full_name,
        role: localProfile.role,
        department: localProfile.department,
        year_of_study: localProfile.year_of_study,
        batch_id: localProfile.batch_id,
        is_verified: localProfile.is_verified,
=======
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
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
      }]).select().single();

      if (!error && data) return data as Profile;
    } catch (e) {
      console.warn('Supabase createProfile error:', e);
    }
<<<<<<< HEAD

    return localProfile;
  }

  static async setProfileVerified(userId: string, isVerified: boolean): Promise<void> {
    const local = readLocal<Profile[]>(LS_PROFILES, []);
    const next = local.map((p) => (p.id === userId ? { ...p, is_verified: isVerified } : p));
    if (!next.some((p) => p.id === userId)) {
      const all = await this.getProfiles();
      const match = all.find((p) => p.id === userId);
      if (match) next.unshift({ ...match, is_verified: isVerified });
    }
    writeLocal(LS_PROFILES, next);

    try {
      const supabase = this.getSupabase();
      await supabase.from('profiles').update({ is_verified: isVerified }).eq('id', userId);
    } catch (e) {
      console.warn('Supabase setProfileVerified error:', e);
    }
  }

  static async updateProfileRole(userId: string, role: 'student' | 'faculty' | 'admin', requesterId?: string): Promise<void> {
    const local = readLocal<Profile[]>(LS_PROFILES, []);
    writeLocal(LS_PROFILES, local.map((p) => (p.id === userId ? { ...p, role } : p)));
    try {
      const response = await fetch('/api/admin/update-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, newRole: role, requesterId }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update role');
      }
    } catch (e) {
      console.warn('Backend updateProfileRole error:', e);
=======
    return null;
  }

  static async updateProfileRole(userId: string, role: 'student' | 'faculty' | 'admin'): Promise<void> {
    try {
      const supabase = this.getSupabase();
      await supabase.from('profiles').update({ role }).eq('id', userId);
      await this.logAdminAction('UPDATE_USER_ROLE', 'profiles', userId, { new_role: role });
    } catch (e) {
      console.warn('Supabase updateProfileRole error:', e);
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
    }
  }

  // VERIFICATION REQUESTS (Admin Verification Desk)
  static async getVerificationRequests(): Promise<VerificationRequest[]> {
<<<<<<< HEAD
    const local = readLocal<VerificationRequest[]>(LS_REQUESTS, []);
    let remote: VerificationRequest[] = [];
    try {
      const supabase = this.getSupabase();
      const { data, error } = await supabase.from('verification_requests').select('*').order('submitted_at', { ascending: false });
      if (!error && data) remote = data as VerificationRequest[];
    } catch (e) {
      console.warn('Supabase getVerificationRequests error:', e);
    }
    return mergeById(remote, local);
  }

  static async createVerificationRequest(reqData: Partial<VerificationRequest>): Promise<VerificationRequest | null> {
    const localRequest: VerificationRequest = {
      id: reqData.id || newId(),
      user_id: reqData.user_id || '',
      student_name: reqData.student_name || 'New User',
      email: reqData.email || '',
      role: reqData.role || 'student',
      department: reqData.department || 'Computer Science',
      year_of_study: reqData.year_of_study,
      batch_id: reqData.batch_id,
      status: 'pending',
      submitted_at: new Date().toISOString(),
    };

    const local = readLocal<VerificationRequest[]>(LS_REQUESTS, []);
    writeLocal(LS_REQUESTS, [localRequest, ...local.filter((r) => r.user_id !== localRequest.user_id || r.status !== 'pending')]);

    try {
      const supabase = this.getSupabase();
      const { data, error } = await supabase.from('verification_requests').insert([{
        user_id: localRequest.user_id,
        student_name: localRequest.student_name,
        email: localRequest.email,
        role: localRequest.role,
        department: localRequest.department,
        year_of_study: localRequest.year_of_study,
        batch_id: localRequest.batch_id,
=======
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
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
        status: 'pending',
      }]).select().single();

      if (!error && data) return data as VerificationRequest;
    } catch (e) {
      console.warn('Supabase createVerificationRequest error:', e);
    }
<<<<<<< HEAD

    return localRequest;
  }

  static async approveVerificationRequest(requestId: string, userId: string, reviewerId?: string): Promise<void> {
    const requests = readLocal<VerificationRequest[]>(LS_REQUESTS, []);
    writeLocal(
      LS_REQUESTS,
      requests.map((r) =>
        r.id === requestId || r.user_id === userId
          ? { ...r, status: 'approved', reviewed_at: new Date().toISOString(), reviewed_by: reviewerId }
          : r
      )
    );
    
    const local = readLocal<Profile[]>(LS_PROFILES, []);
    const next = local.map((p) => (p.id === userId ? { ...p, is_verified: true } : p));
    if (!next.some((p) => p.id === userId)) {
      const all = await this.getProfiles();
      const match = all.find((p) => p.id === userId);
      if (match) next.unshift({ ...match, is_verified: true });
    }
    writeLocal(LS_PROFILES, next);

    try {
      const response = await fetch('/api/admin/verify-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, userId, status: 'approved', reviewerId }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to approve request');
      }
    } catch (e) {
      console.warn('Backend approveVerificationRequest error:', e);
=======
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
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
    }
  }

  static async rejectVerificationRequest(requestId: string, userId: string, reason?: string, reviewerId?: string): Promise<void> {
<<<<<<< HEAD
    const requests = readLocal<VerificationRequest[]>(LS_REQUESTS, []);
    writeLocal(
      LS_REQUESTS,
      requests.map((r) =>
        r.id === requestId || r.user_id === userId
          ? {
              ...r,
              status: 'rejected',
              rejection_reason: reason || 'Access request rejected by Placement Admin.',
              reviewed_at: new Date().toISOString(),
              reviewed_by: reviewerId,
            }
          : r
      )
    );
    
    const local = readLocal<Profile[]>(LS_PROFILES, []);
    const next = local.map((p) => (p.id === userId ? { ...p, is_verified: false } : p));
    if (!next.some((p) => p.id === userId)) {
      const all = await this.getProfiles();
      const match = all.find((p) => p.id === userId);
      if (match) next.unshift({ ...match, is_verified: false });
    }
    writeLocal(LS_PROFILES, next);

    try {
      const response = await fetch('/api/admin/verify-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, userId, status: 'rejected', reason, reviewerId }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to reject request');
      }
    } catch (e) {
      console.warn('Backend rejectVerificationRequest error:', e);
=======
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
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
    }
  }

  // QUESTION BANKS & QUESTIONS
  static async getQuestionBanks(): Promise<QuestionBank[]> {
<<<<<<< HEAD
    const local = readLocal<QuestionBank[]>(LS_QUESTION_BANKS, SEED_QUESTION_BANKS);
    let remote: QuestionBank[] = [];
    try {
      const supabase = this.getSupabase();
      const { data, error } = await supabase.from('question_banks').select('*').order('created_at', { ascending: false });
      if (!error && data) remote = data as QuestionBank[];
    } catch (e) {
      console.warn('Supabase getQuestionBanks error:', e);
    }
    return mergeById(local, remote);
  }

  static async createQuestionBank(title: string, topic: string, createdBy: string, description?: string, targetDepartment?: string, targetYear?: string): Promise<QuestionBank | null> {
    const localBank: QuestionBank = {
      id: 'qb-' + newId(),
      title,
      topic,
      description,
      target_department: targetDepartment || 'All',
      target_year: targetYear || 'All',
      question_count: 0,
      created_by: createdBy,
      created_at: new Date().toISOString()
    };
    const local = readLocal<QuestionBank[]>(LS_QUESTION_BANKS, SEED_QUESTION_BANKS);
    writeLocal(LS_QUESTION_BANKS, [localBank, ...local]);

    try {
      const supabase = this.getSupabase();
      const { data, error } = await supabase.from('question_banks').insert([{
        id: localBank.id,
        title,
        topic,
        created_by: createdBy,
        description,
        target_department: localBank.target_department,
        target_year: localBank.target_year
=======
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
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
      }]).select().single();
      if (!error && data) return data as QuestionBank;
    } catch (e) {
      console.warn('Supabase createQuestionBank error:', e);
    }
<<<<<<< HEAD
    return localBank;
  }

  static async updateQuestionBank(bankId: string, updates: Partial<QuestionBank>): Promise<QuestionBank | null> {
    const local = readLocal<QuestionBank[]>(LS_QUESTION_BANKS, SEED_QUESTION_BANKS);
    const updated = local.map(b => b.id === bankId ? { ...b, ...updates } : b);
    writeLocal(LS_QUESTION_BANKS, updated);

    try {
      const supabase = this.getSupabase();
      const { data, error } = await supabase.from('question_banks').update(updates).eq('id', bankId).select().single();
      if (!error && data) return data as QuestionBank;
    } catch (e) {
      console.warn('Supabase updateQuestionBank error:', e);
    }
    return updated.find(b => b.id === bankId) || null;
  }

  static async getQuestions(bankId?: string): Promise<Question[]> {
    const local = readLocal<Question[]>(LS_QUESTIONS, SEED_QUESTIONS);
    let remote: Question[] = [];
=======
    return null;
  }

  static async getQuestions(bankId?: string): Promise<Question[]> {
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
    try {
      const supabase = this.getSupabase();
      let query = supabase.from('questions').select('*').order('created_at', { ascending: false });
      if (bankId) query = query.eq('bank_id', bankId);
      const { data, error } = await query;
<<<<<<< HEAD
      if (!error && data) remote = data as Question[];
    } catch (e) {
      console.warn('Supabase getQuestions error:', e);
    }
    const merged = mergeById(local, remote);
    return bankId ? merged.filter(q => q.bank_id === bankId) : merged;
  }

  static async createQuestion(question: Partial<Question>): Promise<Question | null> {
    const localQ: Question = {
      id: question.id || 'q-' + newId(),
      bank_id: question.bank_id || '',
      type: question.type || 'mcq',
      topic: question.topic || '',
      difficulty: question.difficulty || 'medium',
      target_department: question.target_department || 'All',
      target_year: question.target_year || 'All',
      content: question.content || { questionText: '' },
      marks: question.marks || 1,
      created_by: question.created_by,
      created_at: new Date().toISOString()
    };
    const local = readLocal<Question[]>(LS_QUESTIONS, SEED_QUESTIONS);
    writeLocal(LS_QUESTIONS, [localQ, ...local]);

    try {
      const supabase = this.getSupabase();
      const { data, error } = await supabase.from('questions').insert([{
        id: localQ.id,
        bank_id: localQ.bank_id,
        type: localQ.type,
        topic: localQ.topic,
        difficulty: localQ.difficulty,
        content: localQ.content,
        marks: localQ.marks,
        target_department: localQ.target_department,
        target_year: localQ.target_year
=======
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
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
      }]).select().single();
      if (!error && data) return data as Question;
    } catch (e) {
      console.warn('Supabase createQuestion error:', e);
    }
<<<<<<< HEAD
    return localQ;
  }

  static async updateQuestion(questionId: string, updates: Partial<Question>): Promise<Question | null> {
    const local = readLocal<Question[]>(LS_QUESTIONS, SEED_QUESTIONS);
    const updated = local.map(q => q.id === questionId ? { ...q, ...updates } : q);
    writeLocal(LS_QUESTIONS, updated);

    try {
      const supabase = this.getSupabase();
      const { data, error } = await supabase.from('questions').update(updates).eq('id', questionId).select().single();
      if (!error && data) return data as Question;
    } catch (e) {
      console.warn('Supabase updateQuestion error:', e);
    }
    return updated.find(q => q.id === questionId) || null;
=======
    return null;
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
  }

  // TESTS & TEST ATTEMPTS
  static async getTests(): Promise<Test[]> {
<<<<<<< HEAD
    const local = readLocal<Test[]>(LS_TESTS, SEED_TESTS);
    let remote: Test[] = [];
    try {
      const supabase = this.getSupabase();
      const { data, error } = await supabase.from('tests').select('*').order('created_at', { ascending: false });
      if (!error && data) remote = data as Test[];
    } catch (e) {
      console.warn('Supabase getTests error:', e);
    }
    return mergeById(local, remote);
  }

  static async createTest(testData: Partial<Test>): Promise<Test | null> {
    const localTest: Test = {
      id: testData.id || 'test-' + newId(),
      title: testData.title || 'Untitled Test',
      type: testData.type || 'custom',
      batch_id: testData.batch_id,
      batch_name: testData.batch_name,
      target_department: testData.target_department || 'All',
      target_year: testData.target_year || 'All',
      start_time: testData.start_time || new Date().toISOString(),
      end_time: testData.end_time || new Date(Date.now() + 86400000 * 7).toISOString(),
      duration_minutes: testData.duration_minutes || 60,
      total_marks: testData.total_marks || 100,
      passing_marks: testData.passing_marks || 40,
      instructions: testData.instructions,
      is_proctored: testData.is_proctored ?? true,
      is_published: testData.is_published ?? true,
      question_count: testData.question_count || 0,
      created_by: testData.created_by || '',
      created_at: new Date().toISOString()
    };
    const local = readLocal<Test[]>(LS_TESTS, SEED_TESTS);
    writeLocal(LS_TESTS, [localTest, ...local]);

    try {
      const supabase = this.getSupabase();
      const { data, error } = await supabase.from('tests').insert([{
        id: localTest.id,
        title: localTest.title,
        type: localTest.type,
        batch_id: localTest.batch_id,
        duration_minutes: localTest.duration_minutes,
        is_proctored: localTest.is_proctored,
        instructions: localTest.instructions,
        target_department: localTest.target_department,
        target_year: localTest.target_year,
=======
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
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
      }]).select().single();
      if (!error && data) return data as Test;
    } catch (e) {
      console.warn('Supabase createTest error:', e);
    }
<<<<<<< HEAD
    return localTest;
  }

  static async getTestAttempts(studentId?: string): Promise<TestAttempt[]> {
    const local = readLocal<TestAttempt[]>(LS_TEST_ATTEMPTS, SEED_TEST_ATTEMPTS);
    let remote: TestAttempt[] = [];
=======
    return null;
  }

  static async getTestAttempts(studentId?: string): Promise<TestAttempt[]> {
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
    try {
      const supabase = this.getSupabase();
      let query = supabase.from('test_attempts').select('*').order('started_at', { ascending: false });
      if (studentId) query = query.eq('student_id', studentId);
      const { data, error } = await query;
<<<<<<< HEAD
      if (!error && data) remote = data as TestAttempt[];
    } catch (e) {
      console.warn('Supabase getTestAttempts error:', e);
    }
    const merged = mergeById(local, remote);
    return studentId ? merged.filter(a => a.student_id === studentId) : merged;
  }

  static async submitTestAttempt(attemptData: Partial<TestAttempt>): Promise<TestAttempt | null> {
    const localAttempt: TestAttempt = {
      id: attemptData.id || 'attempt-' + newId(),
      test_id: attemptData.test_id || '',
      test_title: attemptData.test_title || 'Mock Test',
      student_id: attemptData.student_id || '',
      student_name: attemptData.student_name || 'Alex Johnson',
      started_at: attemptData.started_at || new Date().toISOString(),
      submitted_at: new Date().toISOString(),
      score: attemptData.score || 0,
      max_score: attemptData.max_score || 100,
      status: 'submitted',
      flag_count: attemptData.flag_count || 0,
      tab_switch_count: attemptData.tab_switch_count || 0,
      time_spent_seconds: attemptData.time_spent_seconds || 1800,
      feedback: attemptData.feedback || 'Test attempt submitted successfully.'
    };
    const local = readLocal<TestAttempt[]>(LS_TEST_ATTEMPTS, SEED_TEST_ATTEMPTS);
    writeLocal(LS_TEST_ATTEMPTS, [localAttempt, ...local]);

    try {
      const supabase = this.getSupabase();
      const { data, error } = await supabase.from('test_attempts').insert([{
        id: localAttempt.id,
=======
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
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
        test_id: attemptData.test_id,
        student_id: attemptData.student_id,
        score: attemptData.score,
        status: 'submitted',
<<<<<<< HEAD
        submitted_at: localAttempt.submitted_at,
=======
        submitted_at: new Date().toISOString(),
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
      }]).select().single();
      if (!error && data) return data as TestAttempt;
    } catch (e) {
      console.warn('Supabase submitTestAttempt error:', e);
    }
<<<<<<< HEAD
    return localAttempt;
=======
    return null;
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
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
<<<<<<< HEAD
    const local = readLocal<AttendanceRecord[]>(LS_ATTENDANCE, SEED_ATTENDANCE);
    let remote: AttendanceRecord[] = [];
=======
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
    try {
      const supabase = this.getSupabase();
      let query = supabase.from('attendance').select('*').order('created_at', { ascending: false });
      if (studentId) query = query.eq('student_id', studentId);
      const { data, error } = await query;
<<<<<<< HEAD
      if (!error && data) remote = data as AttendanceRecord[];
    } catch (e) {
      console.warn('Supabase getAttendanceRecords error:', e);
    }
    const merged = mergeById(local, remote);
    return studentId ? merged.filter(a => a.student_id === studentId) : merged;
  }

  static async submitAbsenceReason(recordId: string, reason: string): Promise<void> {
    const local = readLocal<AttendanceRecord[]>(LS_ATTENDANCE, SEED_ATTENDANCE);
    const updated = local.map(a => a.id === recordId ? { ...a, absence_reason: reason, reviewed_by_faculty: false } : a);
    writeLocal(LS_ATTENDANCE, updated);

=======
      if (!error && data) return data as AttendanceRecord[];
    } catch (e) {
      console.warn('Supabase getAttendanceRecords error:', e);
    }
    return [];
  }

  static async submitAbsenceReason(recordId: string, reason: string): Promise<void> {
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
    try {
      const supabase = this.getSupabase();
      await supabase.from('attendance').update({ absence_reason: reason, reviewed_by_faculty: false }).eq('id', recordId);
    } catch (e) {
      console.warn('Supabase submitAbsenceReason error:', e);
    }
  }

  static async reviewAttendance(recordId: string, statusOverride?: 'present' | 'absent'): Promise<void> {
<<<<<<< HEAD
    const local = readLocal<AttendanceRecord[]>(LS_ATTENDANCE, SEED_ATTENDANCE);
    const updated = local.map(a => a.id === recordId ? { ...a, reviewed_by_faculty: true, status: statusOverride || a.status } : a);
    writeLocal(LS_ATTENDANCE, updated);

=======
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
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

