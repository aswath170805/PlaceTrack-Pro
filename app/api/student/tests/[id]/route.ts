import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/dbService';
import { Question } from '@/lib/mockData';
import { requireRole } from '@/lib/supabase/auth';

// Fisher-Yates shuffle helper
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const testId = params.id;
    const student = await requireRole(['student']);
    const department = student.department;
    const year = student.academic_year || student.year_of_study.replace(' Year', '');
    const questions = (await DatabaseService.getQuestionsForStudent(department, year)).filter((question) => {
      const departmentMatch = !department || !question.target_department || question.target_department === 'All Departments' || question.target_department.toLowerCase() === department.toLowerCase();
      const yearMatch = !year || !question.target_year || question.target_year === 'All Years' || question.target_year.toLowerCase().startsWith(year.toLowerCase());
      return departmentMatch && yearMatch;
    });

    // 1. Randomize Question Presentation Order per session
    const randomizedQuestions = shuffleArray(questions);

    // 2. Randomize MCQ Answer Options & Strip Answer Keys
    const safeQuestions: Question[] = randomizedQuestions.map((q) => {
      const safeContent = { ...q.content };
      
      // CRITICAL SERVER SECURITY: Never expose correctAnswer, answerKey, or explanation to browser
      delete (safeContent as any).correctAnswer;
      delete (safeContent as any).answerKey;
      delete (safeContent as any).explanation;

      // Randomize MCQ options if present (preserving option text, stripping original key)
      if (q.type === 'mcq' && Array.isArray(safeContent.options)) {
        // Create shallow copy before shuffling
        safeContent.options = shuffleArray(safeContent.options);
      }

      return {
        ...q,
        content: safeContent as any,
      };
    });

    return NextResponse.json({
      success: true,
      testId,
      sessionSecurityActive: true,
      questions: safeQuestions,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
