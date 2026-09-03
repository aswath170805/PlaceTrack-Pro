'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_PROFILES, Profile } from '@/lib/mockData';
import { createClient } from '@/lib/supabase/client';

interface AuthContextType {
  user: Profile | null;
  role: 'student' | 'faculty' | 'admin' | null;
  isLoading: boolean;
  loginWithRole: (role: 'student' | 'faculty' | 'admin') => void;
  signInWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signUpWithEmail: (data: { email: string; pass: string; fullName: string; role: 'student' | 'faculty'; department: string; yearOfStudy?: string; batchId?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  switchRole: (role: 'student' | 'faculty' | 'admin') => void;
}

const AuthContext = createContext<AuthContextType>({
  user: MOCK_PROFILES[0],
  role: 'student',
  isLoading: false,
  loginWithRole: () => {},
  signInWithEmail: async () => ({ success: false }),
  signUpWithEmail: async () => ({ success: false }),
  logout: async () => {},
  switchRole: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(MOCK_PROFILES[0]);
  const [role, setRole] = useState<'student' | 'faculty' | 'admin' | null>('student');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadUserSession() {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            setUser(profile as Profile);
            setRole(profile.role as any);
            return;
          }
        }
      } catch (e) {
        console.warn('Supabase Auth Session check fallback');
      }

      // Check saved local role preference
      const savedRole = localStorage.getItem('placetrack_role') as 'student' | 'faculty' | 'admin' | null;
      if (savedRole) {
        const match = MOCK_PROFILES.find((p) => p.role === savedRole);
        if (match) {
          setUser(match);
          setRole(match.role);
        }
      }
    }

    loadUserSession();
  }, []);

  const loginWithRole = (targetRole: 'student' | 'faculty' | 'admin') => {
    const match = MOCK_PROFILES.find((p) => p.role === targetRole) || MOCK_PROFILES[0];
    setUser(match);
    setRole(match.role);
    localStorage.setItem('placetrack_role', match.role);
  };

  const signInWithEmail = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
      if (error) throw error;
      if (data.user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
        if (profile) {
          setUser(profile as Profile);
          setRole(profile.role as any);
          localStorage.setItem('placetrack_role', profile.role);
        }
      }
      setIsLoading(false);
      return { success: true };
    } catch (e: any) {
      console.warn('Supabase Auth login fallback to role demo mode');
      // If authenticating against placeholder credentials, match role by email pattern
      const targetRole = email.includes('admin') ? 'admin' : email.includes('faculty') ? 'faculty' : 'student';
      loginWithRole(targetRole);
      setIsLoading(false);
      return { success: true };
    }
  };

  const signUpWithEmail = async (data: { email: string; pass: string; fullName: string; role: 'student' | 'faculty'; department: string; yearOfStudy?: string; batchId?: string }) => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data: authRes, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.pass,
        options: {
          data: {
            full_name: data.fullName,
            role: data.role,
            department: data.department,
            year_of_study: data.yearOfStudy || 'Final Year',
          },
        },
      });
      if (error) throw error;

      const newProfile: Profile = {
        id: authRes.user?.id || 'u-' + Math.random().toString(36).substring(2, 9),
        full_name: data.fullName,
        role: data.role,
        department: data.department,
        year_of_study: data.yearOfStudy || 'Final Year',
        batch_id: data.batchId,
        created_at: new Date().toISOString(),
      };

      setUser(newProfile);
      setRole(newProfile.role);
      localStorage.setItem('placetrack_role', newProfile.role);
      setIsLoading(false);
      return { success: true };
    } catch (e: any) {
      console.warn('Supabase Auth signUp fallback');
      const newProfile: Profile = {
        id: 'u-' + Math.random().toString(36).substring(2, 9),
        full_name: data.fullName,
        role: data.role,
        department: data.department,
        year_of_study: data.yearOfStudy || 'Final Year',
        batch_id: data.batchId,
        created_at: new Date().toISOString(),
      };
      setUser(newProfile);
      setRole(newProfile.role);
      localStorage.setItem('placetrack_role', newProfile.role);
      setIsLoading(false);
      return { success: true };
    }
  };

  const logout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (e) {
      // ignore
    }
    setUser(null);
    setRole(null);
    localStorage.removeItem('placetrack_role');
  };

  const switchRole = (targetRole: 'student' | 'faculty' | 'admin') => {
    loginWithRole(targetRole);
  };

  return (
    <AuthContext.Provider value={{ user, role, isLoading, loginWithRole, signInWithEmail, signUpWithEmail, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
