import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { 
  SEED_BATCHES,
  SEED_PROFILES
} from '@/lib/mockData';

export async function GET() {
  try {
    const supabase = createAdminClient();

    // 1. Seed Batches
    await supabase.from('batches').upsert(SEED_BATCHES.map((b) => ({
      id: b.id,
      name: b.name,
      department: b.department || 'Computer Science',
      academic_year: b.academic_year || '2026',
      student_count: b.student_count || 0,
    })));

    // 2. Seed Profiles
    await supabase.from('profiles').upsert(SEED_PROFILES.map((p) => ({
      id: p.id,
      email: p.email,
      full_name: p.full_name,
      role: p.role,
      department: p.department,
      year_of_study: p.year_of_study,
      batch_id: p.batch_id,
      is_verified: p.is_verified,
    })));

    return NextResponse.json({ 
      success: true, 
      message: 'Database seeded successfully in Supabase Postgres! Initial batches, admin/faculty/student profiles are ready.' 
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

