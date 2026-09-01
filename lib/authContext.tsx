'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_PROFILES, Profile } from '@/lib/mockData';
import { DatabaseService } from '@/lib/dbService';

type PortalRole = 'student' | 'faculty' | 'admin';

interface AuthResult {
  success: boolean;
  error?: string;
  pendingVerification?: boolean;
  role?: PortalRole;
}

interface AuthContextType {
  user: Profile | null;
  role: PortalRole | null;
  isLoading: boolean;
  loginWithRole: (role: PortalRole) => void;
  signInWithEmail: (email: string, pass: string) => Promise<AuthResult>;
  signUpWithEmail: (data: {
    email: string;
    pass: string;
    fullName: string;
    role: 'student' | 'faculty';
    department: string;
    yearOfStudy?: string;
    batchId?: string;
  }) => Promise<AuthResult>;
  logout: () => Promise<void>;
  switchRole: (role: PortalRole) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  isLoading: false,
  loginWithRole: () => {},
  signInWithEmail: async () => ({ success: false }),
  signUpWithEmail: async () => ({ success: false }),
  logout: async () => {},
  switchRole: () => {},
});

function persistSession(profile: Profile) {
  localStorage.setItem('placetrack_role', profile.role);
  localStorage.setItem('placetrack_user_id', profile.id);
  if (profile.email) localStorage.setItem('placetrack_user_email', profile.email);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [role, setRole] = useState<PortalRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function initAuth() {
      const savedId = localStorage.getItem('placetrack_user_id');
      const savedEmail = localStorage.getItem('placetrack_user_email');
      const savedRole = localStorage.getItem('placetrack_role') as PortalRole | null;
      if (!savedId && !savedEmail && !savedRole) return;

      const profiles = await DatabaseService.getProfiles();
      const match =
        profiles.find((p) => p.id === savedId) ||
        profiles.find((p) => p.email && savedEmail && p.email.toLowerCase() === savedEmail.toLowerCase()) ||
        (savedRole ? MOCK_PROFILES.find((p) => p.role === savedRole) : undefined);

      if (match && match.is_verified) {
        setUser(match);
        setRole(match.role);
      }
    }
    initAuth();
  }, []);

  const loginWithRole = (targetRole: PortalRole) => {
    const match = MOCK_PROFILES.find((p) => p.role === targetRole) || MOCK_PROFILES[0];
    setUser(match);
    setRole(match.role);
    persistSession(match);
  };

  const signInWithEmail = async (email: string, pass: string): Promise<AuthResult> => {
    setIsLoading(true);
    const cleanEmail = email.toLowerCase().trim();

    if (cleanEmail === 'placetrackpro@admin.co.in') {
      if (pass !== 'Aswath170805' && pass !== 'password123') {
        setIsLoading(false);
        return { success: false, error: 'Invalid Admin password!' };
      }
      const adminProfile = MOCK_PROFILES.find((p) => p.role === 'admin') || {
        id: 'a3333333-3333-3333-3333-333333333333',
        email: 'placetrackpro@admin.co.in',
        full_name: 'System Admin',
        role: 'admin' as const,
        department: 'Placement Cell',
        year_of_study: 'N/A',
        is_verified: true,
        created_at: new Date().toISOString(),
      };
      setUser(adminProfile as Profile);
      setRole('admin');
      persistSession(adminProfile as Profile);
      setIsLoading(false);
      return { success: true, role: 'admin' };
    }

    if (!cleanEmail.endsWith('@svce.ac.in')) {
      setIsLoading(false);
      return { success: false, error: 'Access Denied: Only @svce.ac.in email addresses are permitted for Students & Teachers!' };
    }

    const profiles = await DatabaseService.getProfiles();
    const existing = profiles.find((p) => p.email?.toLowerCase() === cleanEmail);

    if (!existing) {
      setIsLoading(false);
      return {
        success: false,
        error: 'No account found for this email. Register first so Placement Admin can review your access request.',
      };
    }

    if (!DatabaseService.verifyCredential(cleanEmail, pass)) {
      setIsLoading(false);
      return { success: false, error: 'Invalid password. Please try again.' };
    }

    if (!existing.is_verified) {
      setIsLoading(false);
      return {
        success: false,
        pendingVerification: true,
        role: existing.role,
        error:
          existing.role === 'faculty'
            ? 'Your faculty access request is pending Placement Admin approval. Sign in again after access is granted.'
            : 'Your account is pending verification by Placement Admin. Access will be granted once approved.',
      };
    }

    setUser(existing);
    setRole(existing.role);
    persistSession(existing);
    setIsLoading(false);
    return { success: true, role: existing.role };
  };

  const signUpWithEmail = async (data: {
    email: string;
    pass: string;
    fullName: string;
    role: 'student' | 'faculty';
    department: string;
    yearOfStudy?: string;
    batchId?: string;
  }): Promise<AuthResult> => {
    setIsLoading(true);
    const cleanEmail = data.email.toLowerCase().trim();

    if (!cleanEmail.endsWith('@svce.ac.in')) {
      setIsLoading(false);
      return { success: false, error: 'Registration Rejected: Must use official @svce.ac.in email address!' };
    }

    const profiles = await DatabaseService.getProfiles();
    const existing = profiles.find((p) => p.email?.toLowerCase() === cleanEmail);
    if (existing) {
      setIsLoading(false);
      if (!existing.is_verified) {
        return {
          success: false,
          pendingVerification: true,
          role: existing.role,
          error: 'This email already has a pending access request. Wait for Placement Admin approval, then sign in.',
        };
      }
      return { success: false, error: 'An account with this email already exists. Please sign in instead.' };
    }

    const newProfile: Profile = {
      id: crypto.randomUUID ? crypto.randomUUID() : 'u-' + Math.random().toString(36).substring(2, 9),
      email: cleanEmail,
      full_name: data.fullName,
      role: data.role,
      department: data.department,
      year_of_study: data.role === 'faculty' ? 'N/A' : data.yearOfStudy || 'Final Year',
      batch_id: data.role === 'student' ? data.batchId : undefined,
      is_verified: false,
      created_at: new Date().toISOString(),
    };

    const created = await DatabaseService.createProfile(newProfile);
    const targetUserId = created?.id || newProfile.id;

    await DatabaseService.createVerificationRequest({
      user_id: targetUserId,
      student_name: data.fullName,
      email: cleanEmail,
      role: data.role,
      department: data.department,
      year_of_study: newProfile.year_of_study,
      batch_id: newProfile.batch_id,
    });

    DatabaseService.saveCredential(cleanEmail, data.pass);

    setIsLoading(false);
    return {
      success: false,
      pendingVerification: true,
      role: data.role,
      error:
        data.role === 'faculty'
          ? 'Access request sent to Placement Admin. After they grant access, sign in again to open the Faculty portal.'
          : 'Registration submitted. After Placement Admin approves your account, sign in to open the Student portal.',
    };
  };

  const logout = async () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem('placetrack_role');
    localStorage.removeItem('placetrack_user_id');
    localStorage.removeItem('placetrack_user_email');
  };

  const switchRole = (targetRole: PortalRole) => {
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
