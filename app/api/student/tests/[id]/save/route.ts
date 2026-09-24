import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const testId = params.id;
    const body = await req.json();
    const { attemptId, answers } = body;

    // Transient answer auto-save acknowledgment
    return NextResponse.json({
      success: true,
      testId,
      attemptId,
      savedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
