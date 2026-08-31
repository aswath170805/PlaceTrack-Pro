-- ==============================================================================
-- PlaceTrack Pro — Complete Enterprise Supabase PostgreSQL Database Schema
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. Batches Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  department TEXT DEFAULT 'Computer Science',
  academic_year TEXT DEFAULT '2026',
  student_count INT DEFAULT 0,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. Profiles Table (User Registrations & Governance)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'faculty', 'admin')),
  department TEXT NOT NULL DEFAULT 'Computer Science',
  year_of_study TEXT DEFAULT 'Final Year',
  batch_id UUID REFERENCES public.batches(id) ON DELETE SET NULL,
  phone TEXT,
  avatar_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Foreign Key linking Batches -> Profiles (created_by)
ALTER TABLE public.batches 
  DROP CONSTRAINT IF EXISTS fk_batches_creator;
ALTER TABLE public.batches 
  ADD CONSTRAINT fk_batches_creator 
  FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- ------------------------------------------------------------------------------
-- 3. Question Banks Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.question_banks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  topic TEXT NOT NULL,
  description TEXT,
  department TEXT DEFAULT 'Computer Science',
  question_count INT DEFAULT 0,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. Questions Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bank_id UUID REFERENCES public.question_banks(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('mcq', 'coding', 'short_answer')),
  topic TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')) DEFAULT 'medium',
  content JSONB NOT NULL, -- { questionText, options, correctAnswer, explanation, starterCode, testCases }
  marks INT DEFAULT 1,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. Tests Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('daily_practice', 'weekly_assessment', 'custom')),
  batch_id UUID REFERENCES public.batches(id) ON DELETE SET NULL,
  start_time TIMESTAMPTZ DEFAULT NOW(),
  end_time TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  duration_minutes INT NOT NULL DEFAULT 60,
  total_marks INT DEFAULT 100,
  passing_marks INT DEFAULT 40,
  instructions TEXT,
  is_proctored BOOLEAN DEFAULT true,
  is_published BOOLEAN DEFAULT true,
  question_count INT DEFAULT 0,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. Test Questions Junction Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.test_questions (
  test_id UUID REFERENCES public.tests(id) ON DELETE CASCADE,
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
  order_index INT DEFAULT 0,
  PRIMARY KEY (test_id, question_id)
);

-- ------------------------------------------------------------------------------
-- 7. Test Attempts Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.test_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID REFERENCES public.tests(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  score NUMERIC DEFAULT 0,
  max_score NUMERIC DEFAULT 100,
  status TEXT CHECK (status IN ('in_progress', 'submitted', 'auto_submitted', 'flagged')) DEFAULT 'in_progress',
  flag_count INT DEFAULT 0,
  tab_switch_count INT DEFAULT 0,
  time_spent_seconds INT DEFAULT 0,
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 8. Attempt Answers Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.attempt_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID REFERENCES public.test_attempts(id) ON DELETE CASCADE,
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
  student_answer JSONB,
  is_correct BOOLEAN DEFAULT false,
  score NUMERIC DEFAULT 0,
  time_taken_seconds INT DEFAULT 0,
  code_output JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 9. Proctoring Events Table (Vision & Audio Telemetry Flags)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.proctoring_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID REFERENCES public.test_attempts(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('multiple_faces', 'no_face', 'gaze_away', 'phone_detected', 'audio_noise', 'tab_switch', 'window_blur', 'copy_paste')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
  snapshot_url TEXT,
  details TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 10. Attendance Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  batch_id UUID REFERENCES public.batches(id) ON DELETE SET NULL,
  session_id UUID DEFAULT gen_random_uuid(),
  session_title TEXT NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  status TEXT CHECK (status IN ('present', 'absent')) DEFAULT 'present',
  absence_reason TEXT,
  reviewed_by_faculty BOOLEAN DEFAULT false,
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  review_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 11. Audit Logs Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  actor_name TEXT,
  action TEXT NOT NULL,
  target_table TEXT,
  target_id UUID,
  ip_address TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 12. Announcements Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  target_batch_id UUID REFERENCES public.batches(id) ON DELETE CASCADE,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 13. Placement Drives Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.placement_drives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  role_title TEXT NOT NULL,
  package_lpa NUMERIC,
  eligible_departments TEXT[],
  drive_date TIMESTAMPTZ,
  status TEXT CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')) DEFAULT 'upcoming',
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 14. Verification Requests Table (Admin Verification Desk)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.verification_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'faculty')),
  department TEXT NOT NULL,
  year_of_study TEXT DEFAULT 'Final Year',
  batch_id UUID REFERENCES public.batches(id) ON DELETE SET NULL,
  id_card_url TEXT,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  rejection_reason TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- ==============================================================================
-- SAFE TABLE MIGRATIONS (Ensures new columns exist on pre-existing tables)
-- ==============================================================================
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT UNIQUE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS department TEXT DEFAULT 'Computer Science';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS year_of_study TEXT DEFAULT 'Final Year';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS batch_id UUID REFERENCES public.batches(id) ON DELETE SET NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;

ALTER TABLE public.batches ADD COLUMN IF NOT EXISTS department TEXT DEFAULT 'Computer Science';
ALTER TABLE public.batches ADD COLUMN IF NOT EXISTS academic_year TEXT DEFAULT '2026';
ALTER TABLE public.batches ADD COLUMN IF NOT EXISTS student_count INT DEFAULT 0;
ALTER TABLE public.batches ADD COLUMN IF NOT EXISTS created_by UUID;

ALTER TABLE public.question_banks ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.question_banks ADD COLUMN IF NOT EXISTS department TEXT DEFAULT 'Computer Science';
ALTER TABLE public.question_banks ADD COLUMN IF NOT EXISTS question_count INT DEFAULT 0;

ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS marks INT DEFAULT 1;
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS created_by UUID;

ALTER TABLE public.tests ADD COLUMN IF NOT EXISTS total_marks INT DEFAULT 100;
ALTER TABLE public.tests ADD COLUMN IF NOT EXISTS passing_marks INT DEFAULT 40;
ALTER TABLE public.tests ADD COLUMN IF NOT EXISTS instructions TEXT;
ALTER TABLE public.tests ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;
ALTER TABLE public.tests ADD COLUMN IF NOT EXISTS question_count INT DEFAULT 0;

ALTER TABLE public.test_attempts ADD COLUMN IF NOT EXISTS max_score NUMERIC DEFAULT 100;
ALTER TABLE public.test_attempts ADD COLUMN IF NOT EXISTS flag_count INT DEFAULT 0;
ALTER TABLE public.test_attempts ADD COLUMN IF NOT EXISTS tab_switch_count INT DEFAULT 0;
ALTER TABLE public.test_attempts ADD COLUMN IF NOT EXISTS time_spent_seconds INT DEFAULT 0;
ALTER TABLE public.test_attempts ADD COLUMN IF NOT EXISTS feedback TEXT;

ALTER TABLE public.attempt_answers ADD COLUMN IF NOT EXISTS time_taken_seconds INT DEFAULT 0;
ALTER TABLE public.attempt_answers ADD COLUMN IF NOT EXISTS code_output JSONB;

ALTER TABLE public.proctoring_events ADD COLUMN IF NOT EXISTS details TEXT;
ALTER TABLE public.proctoring_events ADD COLUMN IF NOT EXISTS metadata JSONB;

ALTER TABLE public.attendance ADD COLUMN IF NOT EXISTS batch_id UUID;
ALTER TABLE public.attendance ADD COLUMN IF NOT EXISTS date DATE DEFAULT CURRENT_DATE;
ALTER TABLE public.attendance ADD COLUMN IF NOT EXISTS reviewed_by UUID;
ALTER TABLE public.attendance ADD COLUMN IF NOT EXISTS review_notes TEXT;

ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS actor_name TEXT;
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS ip_address TEXT;

-- ==============================================================================
-- AUTOMATED TRIGGERS & FUNCTIONS
-- ==============================================================================

-- 1. Auto-update student_count on Batches
CREATE OR REPLACE FUNCTION update_batch_student_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    IF NEW.batch_id IS NOT NULL THEN
      UPDATE public.batches 
      SET student_count = (SELECT COUNT(*) FROM public.profiles WHERE batch_id = NEW.batch_id AND role = 'student')
      WHERE id = NEW.batch_id;
    END IF;
  END IF;
  IF TG_OP = 'DELETE' OR TG_OP = 'UPDATE' THEN
    IF OLD.batch_id IS NOT NULL THEN
      UPDATE public.batches 
      SET student_count = (SELECT COUNT(*) FROM public.profiles WHERE batch_id = OLD.batch_id AND role = 'student')
      WHERE id = OLD.batch_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_batch_student_count ON public.profiles;
CREATE TRIGGER trg_batch_student_count
AFTER INSERT OR UPDATE OR DELETE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION update_batch_student_count();

-- 2. Auto-update question_count on Question Banks
CREATE OR REPLACE FUNCTION update_question_bank_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE public.question_banks
    SET question_count = (SELECT COUNT(*) FROM public.questions WHERE bank_id = NEW.bank_id)
    WHERE id = NEW.bank_id;
  END IF;
  IF TG_OP = 'DELETE' OR TG_OP = 'UPDATE' THEN
    UPDATE public.question_banks
    SET question_count = (SELECT COUNT(*) FROM public.questions WHERE bank_id = OLD.bank_id)
    WHERE id = OLD.bank_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_question_bank_count ON public.questions;
CREATE TRIGGER trg_question_bank_count
AFTER INSERT OR UPDATE OR DELETE ON public.questions
FOR EACH ROW EXECUTE FUNCTION update_question_bank_count();

-- 3. Auto-update flag_count on Test Attempts when Proctoring Events logged
CREATE OR REPLACE FUNCTION update_proctoring_flag_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.test_attempts
  SET flag_count = (SELECT COUNT(*) FROM public.proctoring_events WHERE attempt_id = NEW.attempt_id)
  WHERE id = NEW.attempt_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_proctoring_flag_count ON public.proctoring_events;
CREATE TRIGGER trg_proctoring_flag_count
AFTER INSERT ON public.proctoring_events
FOR EACH ROW EXECUTE FUNCTION update_proctoring_flag_count();

-- ==============================================================================
-- REPORTING VIEWS
-- ==============================================================================

CREATE OR REPLACE VIEW public.v_student_performance AS
SELECT 
  p.id AS student_id,
  p.full_name,
  p.email,
  p.department,
  b.name AS batch_name,
  COUNT(ta.id) AS total_attempts,
  COALESCE(AVG(ta.score), 0) AS average_score,
  COALESCE(SUM(ta.flag_count), 0) AS total_proctor_flags
FROM public.profiles p
LEFT JOIN public.batches b ON p.batch_id = b.id
LEFT JOIN public.test_attempts ta ON p.id = ta.student_id
WHERE p.role = 'student'
GROUP BY p.id, p.full_name, p.email, p.department, b.name;

CREATE OR REPLACE VIEW public.v_proctoring_summary AS
SELECT 
  pe.id AS event_id,
  ta.id AS attempt_id,
  t.title AS test_title,
  p.full_name AS student_name,
  pe.event_type,
  pe.severity,
  pe.snapshot_url,
  pe.created_at
FROM public.proctoring_events pe
JOIN public.test_attempts ta ON pe.attempt_id = ta.id
JOIN public.tests t ON ta.test_id = t.id
JOIN public.profiles p ON ta.student_id = p.id;

-- ==============================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_banks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attempt_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proctoring_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placement_drives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;

-- Allow public / authenticated access policies
CREATE POLICY "Public Read Profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public Insert Profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Profiles" ON public.profiles FOR UPDATE USING (true);

CREATE POLICY "Public Read Batches" ON public.batches FOR SELECT USING (true);
CREATE POLICY "Public Write Batches" ON public.batches FOR ALL USING (true);

CREATE POLICY "Public Read Question Banks" ON public.question_banks FOR SELECT USING (true);
CREATE POLICY "Public Write Question Banks" ON public.question_banks FOR ALL USING (true);

CREATE POLICY "Public Read Questions" ON public.questions FOR SELECT USING (true);
CREATE POLICY "Public Write Questions" ON public.questions FOR ALL USING (true);

CREATE POLICY "Public Read Tests" ON public.tests FOR SELECT USING (true);
CREATE POLICY "Public Write Tests" ON public.tests FOR ALL USING (true);

CREATE POLICY "Public Read Test Questions" ON public.test_questions FOR SELECT USING (true);
CREATE POLICY "Public Write Test Questions" ON public.test_questions FOR ALL USING (true);

CREATE POLICY "Public Read Test Attempts" ON public.test_attempts FOR SELECT USING (true);
CREATE POLICY "Public Write Test Attempts" ON public.test_attempts FOR ALL USING (true);

CREATE POLICY "Public Read Attempt Answers" ON public.attempt_answers FOR SELECT USING (true);
CREATE POLICY "Public Write Attempt Answers" ON public.attempt_answers FOR ALL USING (true);

CREATE POLICY "Public Read Proctoring Events" ON public.proctoring_events FOR SELECT USING (true);
CREATE POLICY "Public Write Proctoring Events" ON public.proctoring_events FOR ALL USING (true);

CREATE POLICY "Public Read Attendance" ON public.attendance FOR SELECT USING (true);
CREATE POLICY "Public Write Attendance" ON public.attendance FOR ALL USING (true);

CREATE POLICY "Public Read Audit Logs" ON public.audit_logs FOR SELECT USING (true);
CREATE POLICY "Public Write Audit Logs" ON public.audit_logs FOR ALL USING (true);

CREATE POLICY "Public Read Announcements" ON public.announcements FOR SELECT USING (true);
CREATE POLICY "Public Write Announcements" ON public.announcements FOR ALL USING (true);

CREATE POLICY "Public Read Placement Drives" ON public.placement_drives FOR SELECT USING (true);
CREATE POLICY "Public Write Placement Drives" ON public.placement_drives FOR ALL USING (true);

CREATE POLICY "Public Read Verification Requests" ON public.verification_requests FOR SELECT USING (true);
CREATE POLICY "Public Write Verification Requests" ON public.verification_requests FOR ALL USING (true);

