import { createClient } from '@/lib/supabase/server';
import type { Profile } from '@/lib/mockData';

export async function getAuthenticatedProfile(): Promise<Profile | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  if (error || !profile) return null;
  return { ...profile, email: user.email } as Profile;
}

export async function requireRole(roles: Profile['role'][]): Promise<Profile> {
  const profile = await getAuthenticatedProfile();
  if (!profile || !roles.includes(profile.role)) throw new Error('UNAUTHORIZED');
  return profile;
}
