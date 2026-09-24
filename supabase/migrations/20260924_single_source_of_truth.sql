-- PlaceTrack Pro canonical Supabase migration.
-- Run after the existing schema.sql. This migration is intentionally idempotent.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS academic_year TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS current_streak INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_active_date DATE;

UPDATE public.profiles SET academic_year = CASE
  WHEN year_of_study ILIKE '1st%' THEN '1st'
  WHEN year_of_study ILIKE '2nd%' THEN '2nd'
  WHEN year_of_study ILIKE '3rd%' THEN '3rd'
  WHEN year_of_study ILIKE '4th%' THEN '4th'
  ELSE academic_year
END WHERE academic_year IS NULL;

ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS academic_year TEXT;
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS options JSONB;
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS test_cases JSONB NOT NULL DEFAULT '[]'::jsonb;

UPDATE public.questions
SET title = COALESCE(title, topic),
    description = COALESCE(description, content->>'questionText'),
    department = COALESCE(department, NULLIF(target_department, 'All Departments')),
    academic_year = COALESCE(academic_year, NULLIF(REPLACE(target_year, ' Year', ''), 'All Years')),
    options = COALESCE(options, content->'options'),
    test_cases = CASE WHEN type = 'coding' THEN COALESCE(content->'testCases', '[]'::jsonb) ELSE '[]'::jsonb END;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, department, year_of_study, academic_year)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    COALESCE(NEW.raw_user_meta_data->>'department', 'CSE'),
    COALESCE(NEW.raw_user_meta_data->>'year_of_study', '4th'),
    COALESCE(NEW.raw_user_meta_data->>'academic_year', '4th')
  );
  IF COALESCE(NEW.raw_user_meta_data->>'role', 'student') IN ('student', 'faculty', 'teacher') THEN
    INSERT INTO public.verification_requests (user_id, role, status)
    VALUES (
      NEW.id,
      CASE WHEN COALESCE(NEW.raw_user_meta_data->>'role', 'student') = 'teacher' THEN 'faculty' ELSE COALESCE(NEW.raw_user_meta_data->>'role', 'student') END,
      'pending'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

INSERT INTO public.verification_requests (user_id, role, status)
SELECT p.id, CASE WHEN p.role = 'teacher' THEN 'faculty' ELSE p.role END, 'pending'
FROM public.profiles p
WHERE p.role IN ('student', 'faculty', 'teacher')
  AND COALESCE(p.is_verified, false) = false
  AND NOT EXISTS (
    SELECT 1 FROM public.verification_requests request
    WHERE request.user_id = p.id AND request.status = 'pending'
  );

CREATE TABLE IF NOT EXISTS public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  code_submitted TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('passed', 'failed', 'partial')),
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.attendance_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  login_timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.tampering_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('tab_switch', 'window_defocus', 'copy_paste_attempt', 'context_menu')),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.touch_student_activity(target_student UUID)
RETURNS VOID AS $$
DECLARE previous_date DATE;
BEGIN
  SELECT last_active_date INTO previous_date FROM public.profiles WHERE id = target_student FOR UPDATE;
  UPDATE public.profiles
  SET current_streak = CASE
        WHEN previous_date = CURRENT_DATE THEN current_streak
        WHEN previous_date = CURRENT_DATE - 1 THEN current_streak + 1
        ELSE 1
      END,
      last_active_date = CURRENT_DATE
  WHERE id = target_student;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tampering_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students view questions" ON public.questions;
DROP POLICY IF EXISTS "Faculty/Admin manage questions" ON public.questions;
DROP POLICY IF EXISTS "Students view routed questions" ON public.questions;
DROP POLICY IF EXISTS "Teachers and admins manage questions" ON public.questions;
CREATE POLICY "Students view routed questions" ON public.questions FOR SELECT USING (
  public.get_user_role() IN ('teacher', 'faculty', 'admin') OR EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p.role = 'student'
      AND (public.questions.department IS NULL OR public.questions.department = p.department)
      AND (public.questions.academic_year IS NULL OR public.questions.academic_year = p.academic_year)
  )
);
CREATE POLICY "Teachers and admins manage questions" ON public.questions FOR ALL USING (public.get_user_role() IN ('teacher', 'faculty', 'admin')) WITH CHECK (public.get_user_role() IN ('teacher', 'faculty', 'admin'));

DROP POLICY IF EXISTS "Students create own submissions" ON public.submissions;
DROP POLICY IF EXISTS "Students view own submissions" ON public.submissions;
CREATE POLICY "Students create own submissions" ON public.submissions FOR INSERT WITH CHECK (student_id = auth.uid() AND public.get_user_role() = 'student');
CREATE POLICY "Students view own submissions" ON public.submissions FOR SELECT USING (student_id = auth.uid() OR public.get_user_role() IN ('teacher', 'faculty', 'admin'));

DROP POLICY IF EXISTS "Students create own attendance logs" ON public.attendance_logs;
DROP POLICY IF EXISTS "Students view own attendance logs" ON public.attendance_logs;
CREATE POLICY "Students create own attendance logs" ON public.attendance_logs FOR INSERT WITH CHECK (student_id = auth.uid() AND public.get_user_role() = 'student');
CREATE POLICY "Students view own attendance logs" ON public.attendance_logs FOR SELECT USING (student_id = auth.uid() OR public.get_user_role() IN ('teacher', 'faculty', 'admin'));

DROP POLICY IF EXISTS "Students create own tampering logs" ON public.tampering_logs;
DROP POLICY IF EXISTS "Admins view tampering logs" ON public.tampering_logs;
CREATE POLICY "Students create own tampering logs" ON public.tampering_logs FOR INSERT WITH CHECK (student_id = auth.uid() AND public.get_user_role() = 'student');
CREATE POLICY "Admins view tampering logs" ON public.tampering_logs FOR SELECT USING (public.get_user_role() = 'admin');

DROP POLICY IF EXISTS "Super admins delete profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins delete profiles" ON public.profiles;
CREATE POLICY "Admins delete profiles" ON public.profiles FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles requester WHERE requester.id = auth.uid() AND requester.role = 'admin')
);
ALTER TABLE public.profiles DROP COLUMN IF EXISTS is_super_admin;

CREATE OR REPLACE FUNCTION public.log_student_activity()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM public.touch_student_activity(NEW.student_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS attendance_updates_student_activity ON public.attendance_logs;
CREATE TRIGGER attendance_updates_student_activity AFTER INSERT ON public.attendance_logs FOR EACH ROW EXECUTE FUNCTION public.log_student_activity();
DROP TRIGGER IF EXISTS submission_updates_student_activity ON public.submissions;
CREATE TRIGGER submission_updates_student_activity AFTER INSERT ON public.submissions FOR EACH ROW EXECUTE FUNCTION public.log_student_activity();
