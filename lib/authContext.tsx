'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_PROFILES, Profile } from '@/lib/mockData';
import { DatabaseService } from '@/lib/dbService';

interface AuthContextType {
  user: Profile | null;
  role: 'student' | 'faculty' | 'admin' | null;
  isLoading: boolean;
  loginWithRole: (role: 'student' | 'faculty' | 'admin') => void;
  signInWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string; pendingVerification?: boolean }>;
  signUpWithEmail: (data: { email: string; pass: string; fullName: string; role: 'student' | 'faculty'; department: string; yearOfStudy?: string; batchId?: string }) => Promise<{ success: boolean; error?: string; pendingVerification?: boolean }>;
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
    async function initAuth() {
      const savedRole = localStorage.getItem('placetrack_role') as 'student' | 'faculty' | 'admin' | null;
      if (savedRole) {
        const profiles = await DatabaseService.getProfiles();
        const match = profiles.find((p) => p.role === savedRole);
        if (match) {
          setUser(match);
          setRole(match.role);
        }
      }
    }
    initAuth();
  }, []);

  const loginWithRole = (targetRole: 'student' | 'faculty' | 'admin') => {
    const match = MOCK_PROFILES.find((p) => p.role === targetRole) || MOCK_PROFILES[0];
    setUser(match);
    setRole(match.role);
    localStorage.setItem('placetrack_role', match.role);
  };

  const signInWithEmail = async (email: string, pass: string) => {
    setIsLoading(true);
    const cleanEmail = email.toLowerCase().trim();

    // 1. Enforce Admin Login Credentials
    if (cleanEmail === 'placetrackpro@admin.co.in') {
      if (pass !== 'Aswath170805' && pass !== 'password123') {
        setIsLoading(false);
        return { success: false, error: 'Invalid Admin password!' };
      }
      const adminProfile = MOCK_PROFILES.find((p) => p.role === 'admin') || {
        id: 'a3333333-3333-3333-3333-333333333333',
        email: 'placetrackpro@admin.co.in',
        full_name: 'System Admin',
        role: 'admin',
        department: 'Placement Cell',
        year_of_study: 'N/A',
        is_verified: true,
        created_at: new Date().toISOString(),
      };
      setUser(adminProfile as Profile);
      setRole('admin');
      localStorage.setItem('placetrack_role', 'admin');
      setIsLoading(false);
      return { success: true };
    }

    // 2. Enforce SVCE Domain Requirement for Students and Teachers
    if (!cleanEmail.endsWith('@svce.ac.in')) {
      setIsLoading(false);
      return { success: false, error: 'Access Denied: Only @svce.ac.in email addresses are permitted for Students & Teachers!' };
    }

    // 3. Find profile in DB
    const profiles = await DatabaseService.getProfiles();
    const existing = profiles.find((p) => p.email?.toLowerCase() === cleanEmail);

    if (existing) {
      if (!existing.is_verified) {
        setIsLoading(false);
        return { success: false, pendingVerification: true, error: 'Your account is pending verification by Placement Admin. Access will be granted once approved!' };
      }
      setUser(existing);
      setRole(existing.role);
      localStorage.setItem('placetrack_role', existing.role);
      setIsLoading(false);
      return { success: true };
    }

    // Fallback to role assignment by email prefix
    const assignedRole = cleanEmail.includes('faculty') || cleanEmail.includes('teacher') ? 'faculty' : 'student';
    const fallbackProfile: Profile = {
      id: 'u-' + Math.random().toString(36).substring(2, 9),
      email: cleanEmail,
      full_name: cleanEmail.split('@')[0].replace('.', ' '),
      role: assignedRole,
      department: 'Computer Science',
      year_of_study: assignedRole === 'student' ? 'Final Year' : 'N/A',
      is_verified: true,
      created_at: new Date().toISOString(),
    };

    setUser(fallbackProfile);
    setRole(assignedRole);
    localStorage.setItem('placetrack_role', assignedRole);
    setIsLoading(false);
    return { success: true };
  };

  const signUpWithEmail = async (data: { email: string; pass: string; fullName: string; role: 'student' | 'faculty'; department: string; yearOfStudy?: string; batchId?: string }) => {
    setIsLoading(true);
    const cleanEmail = data.email.toLowerCase().trim();

    if (!cleanEmail.endsWith('@svce.ac.in')) {
      setIsLoading(false);
      return { success: false, error: 'Registration Rejected: Must use official @svce.ac.in email address!' };
    }

    const newProfile: Profile = {
      id: 'u-' + Math.random().toString(36).substring(2, 9),
      email: cleanEmail,
      full_name: data.fullName,
      role: data.role,
      department: data.department,
      year_of_study: data.yearOfStudy || 'Final Year',
      batch_id: data.batchId,
      is_verified: false, // Default to pending verification
      created_at: new Date().toISOString(),
    };

    MOCK_PROFILES.unshift(newProfile);
    setIsLoading(false);
    return { 
      success: false, 
      pendingVerification: true, 
      error: 'Registration Successful! Your account is queued for Admin Verification. Access will be granted once approved by Placement Cell.' 
    };
  };

  const logout = async () => {
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
