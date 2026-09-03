import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { 
  MOCK_BATCHES, 
  MOCK_QUESTION_BANKS, 
  MOCK_QUESTIONS, 
  MOCK_TESTS, 
  MOCK_ATTENDANCE, 
  MOCK_AUDIT_LOGS 
} from '@/lib/mockData';

export async function GET() {
  try {
    const supabase = createAdminClient();

    // Seed Batches
    await supabase.from('batches').upsert(MOCK_BATCHES.map((b) => ({
      id: b.id,
      name: b.name,
    })));

    // Seed Question Banks
    await supabase.from('question_banks').upsert(MOCK_QUESTION_BANKS.map((qb) => ({
      id: qb.id,
      title: qb.title,
      topic: qb.topic,
    })));

    // Seed Questions
    await supabase.from('questions').upsert(MOCK_QUESTIONS.map((q) => ({
      id: q.id,
      bank_id: q.bank_id,
      type: q.type,
      topic: q.topic,
      difficulty: q.difficulty,
      content: q.content,
    })));

    // Seed Tests
    await supabase.from('tests').upsert(MOCK_TESTS.map((t) => ({
      id: t.id,
      title: t.title,
      type: t.type,
      duration_minutes: t.duration_minutes,
      is_proctored: t.is_proctored,
    })));

    // Seed Attendance
    await supabase.from('attendance').upsert(MOCK_ATTENDANCE.map((a) => ({
      id: a.id,
      session_title: a.session_title,
      status: a.status,
      absence_reason: a.absence_reason,
      reviewed_by_faculty: a.reviewed_by_faculty,
    })));

    return NextResponse.json({ success: true, message: 'Database seeded successfully in Supabase Postgres!' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
