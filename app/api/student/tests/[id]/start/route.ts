import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/dbService';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const assessmentId = params.id;
    const body = await req.json();
    const {
      verificationSessionId,
      studentId = 's1111111-1111-1111-1111-111111111111',
      studentName = 'Alex Johnson',
    } = body;

    if (!verificationSessionId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Verification session ID is required. Client-side verification bypass is prohibited.',
        },
        { status: 403 }
      );
    }

    // 1. Authoritative Server-Side Database Verification Check
    const verificationSession = await DatabaseService.getVerificationSession(verificationSessionId);

    if (!verificationSession) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid or non-existent verification session. Please complete the 4-Step Verification process.',
        },
        { status: 403 }
      );
    }

    // 2. Validate mandatory verification session steps
    const isPhotoValid = !!verificationSession.captured_photo_path;
    const isIdCardValid = !!verificationSession.id_card_path;
    const isLaptopCheckPassed =
      verificationSession.camera_verified &&
      verificationSession.microphone_verified &&
      verificationSession.face_verified &&
      verificationSession.browser_verified &&
      verificationSession.laptop_verified &&
      verificationSession.network_verified;

    if (!isPhotoValid || !isIdCardValid || !isLaptopCheckPassed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Incomplete verification requirements. Candidate photo, ID card upload, and laptop checks are mandatory.',
          details: {
            photoCaptured: isPhotoValid,
            idUploaded: isIdCardValid,
            laptopPassed: isLaptopCheckPassed,
          },
        },
        { status: 403 }
      );
    }

    // 3. Mark verification session as completed server-side
    await DatabaseService.updateVerificationSession(verificationSessionId, {
      final_verified: true,
      verification_status: 'completed',
      completed_at: new Date().toISOString(),
    });

    // 4. Create official Test Attempt in Database
    const attempt = await DatabaseService.submitTestAttempt({
      id: 'att-' + Math.random().toString(36).substring(2, 9),
      test_id: assessmentId,
      student_id: studentId,
      student_name: studentName,
      status: 'in_progress',
      started_at: new Date().toISOString(),
      score: 0,
    });

    // Log security audit trail
    await DatabaseService.logAdminAction(
      'ASSESSMENT_SESSION_STARTED',
      'test_attempts',
      attempt.id,
      {
        assessment_id: assessmentId,
        student_id: studentId,
        verification_session_id: verificationSessionId,
        captured_photo_path: verificationSession.captured_photo_path,
        id_card_path: verificationSession.id_card_path,
      }
    );

    return NextResponse.json({
      success: true,
      assessmentId,
      attemptId: attempt.id,
      verificationSessionId,
      sessionToken: 'sess_tok_' + Math.random().toString(36).substring(2, 12),
      authorizedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
