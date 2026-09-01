import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

async function validateAdmin(requesterId: string): Promise<boolean> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
    // Graceful fallback for mock mode: verify against seed system admin ID
    return requesterId === 'a3333333-3333-3333-3333-333333333333';
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('role, is_verified')
      .eq('id', requesterId)
      .single();
    if (error || !data) return false;
    return data.role === 'admin' && data.is_verified === true;
  } catch (e) {
    console.error('validateAdmin DB error:', e);
    return requesterId === 'a3333333-3333-3333-3333-333333333333';
  }
}

export async function POST(req: Request) {
  try {
    const { userId, newRole, requesterId } = await req.json();

    if (!requesterId || !(await validateAdmin(requesterId))) {
      return NextResponse.json(
        { success: false, error: 'Access Denied: Requester must be a verified Administrator!' },
        { status: 403 }
      );
    }

    const supabase = createAdminClient();

    // Fetch original name for audit log
    const { data: profileData } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', userId)
      .single();

    // Perform database role update
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);

    if (updateError) {
      throw updateError;
    }

    // Log admin action in database
    await supabase.from('audit_logs').insert([
      {
        actor_id: requesterId,
        actor_name: 'Placement Admin',
        action: 'UPDATE_USER_ROLE',
        target_table: 'profiles',
        target_id: userId,
        metadata: { new_role: newRole, user_name: profileData?.full_name || 'User' },
      },
    ]);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('API update-role error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
