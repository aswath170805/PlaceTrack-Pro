import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireRole } from '@/lib/supabase/auth';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();
    if (!userId) return NextResponse.json({ success: false, error: 'userId is required' }, { status: 400 });
    const requester = await requireRole(['admin']);
    const supabase = createAdminClient();

    const { error } = await supabase.from('profiles').delete().eq('id', userId);
    if (error) throw error;
    await supabase.from('audit_logs').insert([{ actor_id: requester.id, action: 'DELETE_USER', target_table: 'profiles', target_id: userId }]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : 500;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}