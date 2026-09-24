import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireRole } from '@/lib/supabase/auth';

export async function POST(request: Request) {
  try {
    const student = await requireRole(['student']);
    const supabase = createClient();
    const { error } = await supabase.from('attendance_logs').insert({ student_id: student.id });
    if (error) throw error;
    await supabase.rpc('touch_student_activity', { target_student: student.id });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : 500;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}