'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile } from '@/lib/mockData';
import { createClient } from '@/lib/supabase/client';

async function logStudentAttendance(studentId: string) {
  try {
    await fetch('/api/attendance/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, sessionTitle: 'Student portal login' }),
    });
  } catch (error) {
    console.warn('Attendance logging unavailable', error);
  }
}

interface AuthContextType {
  user: Profile | null;
  role: 'student' | 'faculty' | 'admin' | null;
  isLoading: boolean;
  isSessionReady: boolean;
  refreshSession: () => Promise<void>;
  isAdminAccessVisible: boolean;
  isFacultyAccessVisible: boolean;
  signInWithEmail: (email: string, pass: string) => Promise<{ success: boolean; role?: 'student' | 'faculty' | 'admin'; error?: string }>;
  signUpWithEmail: (data: { email: string; pass: string; fullName: string; role: 'student' | 'faculty'; department: string; yearOfStudy?: string; batchId?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  isLoading: true,
  isSessionReady: false,
  refreshSession: async () => {},
  isAdminAccessVisible: false,
  isFacultyAccessVisible: false,
  signInWithEmail: async () => ({ success: false }),
  signUpWithEmail: async () => ({ success: false }),
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [role, setRole] = useState<'student' | 'faculty' | 'admin' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSessionReady, setIsSessionReady] = useState(false);
  const [isAdminAccessVisible, setIsAdminAccessVisible] = useState(false);
  const [isFacultyAccessVisible, setIsFacultyAccessVisible] = useState(false);

  const refreshSession = async () => {
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setUser(null);
        setRole(null);
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      if (profile) {
        setUser({ ...profile, email: session.user.email } as Profile);
        setRole(profile.role as any);
      }
    } catch (error) {
      console.warn('Supabase Auth session refresh failed', error);
    } finally {
      setIsLoading(false);
      setIsSessionReady(true);
    }
  };

  useEffect(() => {
    const handleAccessHotkey = (event: KeyboardEvent) => {
      if (!event.altKey) return;

      if (event.key.toLowerCase() === 't') {
        event.preventDefault();
        setIsAdminAccessVisible((visible) => !visible);
      }

      if (event.key.toLowerCase() === 'q') {
        event.preventDefault();
        setIsFacultyAccessVisible((visible) => !visible);
      }
    };

    window.addEventListener('keydown', handleAccessHotkey);
    return () => window.removeEventListener('keydown', handleAccessHotkey);
  }, []);

  useEffect(() => {
    void refreshSession();
    const refreshOnFocus = () => void refreshSession();
    window.addEventListener('focus', refreshOnFocus);
    const interval = window.setInterval(refreshOnFocus, 10000);
    return () => {
      window.removeEventListener('focus', refreshOnFocus);
      window.clearInterval(interval);
    };
  }, []);

  const signInWithEmail = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      let authenticatedRole: 'student' | 'faculty' | 'admin' | undefined;
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
      if (error) throw error;
      if (data.user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
        if (profile) {
          authenticatedRole = profile.role as 'student' | 'faculty' | 'admin';
          setUser(profile as Profile);
          setRole(profile.role as any);
          if (profile.role === 'student') void logStudentAttendance(profile.id);
        } else {
          await supabase.auth.signOut();
          throw new Error('No profile is assigned to this account.');
        }
      }
      setIsLoading(false);
      return { success: true, role: authenticatedRole };
    } catch (e: any) {
      setIsLoading(false);
      return { success: false, error: e?.message || 'Invalid credentials.' };
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
            academic_year: (data.yearOfStudy || '4th').replace(' Year', ''),
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
        academic_year: (data.yearOfStudy || '4th').replace(' Year', ''),
        batch_id: data.batchId,
        created_at: new Date().toISOString(),
      };

      setIsLoading(false);
      return { success: true };
    } catch (e: any) {
      setIsLoading(false);
      return { success: false, error: e?.message || 'Registration failed.' };
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
  };

  return (
    <AuthContext.Provider value={{ user, role, isLoading, isSessionReady, refreshSession, isAdminAccessVisible, isFacultyAccessVisible, signInWithEmail, signUpWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
