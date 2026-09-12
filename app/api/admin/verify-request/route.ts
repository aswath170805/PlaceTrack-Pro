import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

async function validateAdmin(requesterId: string): Promise<boolean> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
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
    const { requestId, userId, status, reason, reviewerId } = await req.json();

    if (!reviewerId || !(await validateAdmin(reviewerId))) {
      return NextResponse.json(
        { success: false, error: 'Access Denied: Reviewer must be a verified Administrator!' },
        { status: 403 }
      );
    }

    const supabase = createAdminClient();
    const isApproved = status === 'approved';

    // 1. Update verification requests table
    const { error: reqError } = await supabase
      .from('verification_requests')
      .update({
        status: status,
        rejection_reason: isApproved ? null : reason || 'Access request rejected by Placement Admin.',
        reviewed_at: new Date().toISOString(),
        reviewed_by: reviewerId,
      })
      .eq('id', requestId);

    if (reqError) {
      throw reqError;
    }

    // 2. Update user profile verification status
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ is_verified: isApproved })
      .eq('id', userId);

    if (profileError) {
      throw profileError;
    }

    // Fetch user name for auditing
    const { data: profileData } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', userId)
      .single();

    // 3. Log audit entry
    await supabase.from('audit_logs').insert([
      {
        actor_id: reviewerId,
        actor_name: 'Placement Admin',
        action: isApproved ? 'APPROVE_USER_VERIFICATION' : 'REJECT_USER_VERIFICATION',
        target_table: 'verification_requests',
        target_id: requestId,
        metadata: {
          user_id: userId,
          user_name: profileData?.full_name || 'User',
          reason: isApproved ? 'Access granted' : reason || 'Access request rejected',
        },
      },
    ]);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('API verify-request error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
