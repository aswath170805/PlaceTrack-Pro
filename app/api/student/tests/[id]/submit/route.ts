import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/dbService';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const testId = params.id;
    const body = await req.json();
    const { attemptId, answers, studentId = 's1111111-1111-1111-1111-111111111111' } = body;

    // Fetch authoritative full questions containing answer keys
    const allQuestions = await DatabaseService.getQuestions();
    let totalScore = 0;
    let maxScore = allQuestions.length * 25;
    const evaluatedAnswers: Record<string, boolean> = {};

    allQuestions.forEach((q) => {
      const studentAns = answers ? answers[q.id] : undefined;
      const expectedAns = q.content.correctAnswer;
      let isCorrect = false;

      if (q.type === 'mcq') {
        isCorrect = Number(studentAns) === Number(expectedAns);
      } else if (q.type === 'coding') {
        isCorrect = typeof studentAns === 'string' && studentAns.trim().length > 30 && !studentAns.includes('pass');
      }

      if (isCorrect) totalScore += 25;
      evaluatedAnswers[q.id] = isCorrect;
    });

    const finalPercentage = Math.round((totalScore / (maxScore || 100)) * 100);

    // Record submission in Database
    const attempt = await DatabaseService.submitTestAttempt({
      test_id: testId,
      student_id: studentId,
      score: finalPercentage,
      status: 'submitted',
      submitted_at: new Date().toISOString(),
    });

    // Update readiness & topic stats
    const readiness = await DatabaseService.getReadinessScore(studentId);
    const updatedReadiness = Math.min(100, Math.max(0, Math.round((readiness.overall_score * 0.8) + (finalPercentage * 0.2))));
    
    // Log Audit
    await DatabaseService.logAdminAction(
      'ASSESSMENT_SUBMITTED',
      'test_attempts',
      attemptId || attempt.id,
      { score: finalPercentage, student_id: studentId }
    );

    return NextResponse.json({
      success: true,
      score: finalPercentage,
      attemptId: attempt.id,
      evaluatedAnswers,
      updatedReadinessScore: updatedReadiness,
      xpGained: 100 + (finalPercentage > 80 ? 50 : 0)
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
