import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/dbService';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const testId = params.id;
    const body = await req.json();
    const { attemptId, flagCount = 3, reason = 'Exceeded maximum allowed security violations (3-Strike Limit)' } = body;

    const targetId = attemptId || testId;
    await DatabaseService.terminateTestAttempt(targetId, flagCount, reason);

    await DatabaseService.logAdminAction(
      'ASSESSMENT_TERMINATED',
      'test_attempts',
      targetId,
      { flag_count: flagCount, reason, status: 'terminated_for_malpractice' }
    );

    return NextResponse.json({
      success: true,
      status: 'terminated_for_malpractice',
      flagCount,
      reason,
      terminatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
