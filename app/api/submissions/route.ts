import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireRole } from '@/lib/supabase/auth';

export async function POST(request: Request) {
  try {
    const student = await requireRole(['student']);
    const { questionId, code, status } = await request.json();
    if (!questionId || !code || !['passed', 'failed', 'partial'].includes(status)) {
      return NextResponse.json({ success: false, error: 'questionId, code, and valid status are required' }, { status: 400 });
    }
    const supabase = createClient();
    const { data, error } = await supabase.from('submissions').insert({ student_id: student.id, question_id: questionId, code_submitted: code, status }).select().single();
    if (error) throw error;
    return NextResponse.json({ success: true, submission: data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: error.message === 'UNAUTHORIZED' ? 401 : 500 });
  }
}
