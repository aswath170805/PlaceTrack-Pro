'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_PROFILES, Profile } from '@/lib/mockData';
import { DatabaseService } from '@/lib/dbService';

<<<<<<< HEAD
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
=======
interface AuthContextType {
  user: Profile | null;
  role: 'student' | 'faculty' | 'admin' | null;
  isLoading: boolean;
  loginWithRole: (role: 'student' | 'faculty' | 'admin') => void;
  signInWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string; pendingVerification?: boolean }>;
  signUpWithEmail: (data: { email: string; pass: string; fullName: string; role: 'student' | 'faculty'; department: string; yearOfStudy?: string; batchId?: string }) => Promise<{ success: boolean; error?: string; pendingVerification?: boolean }>;
  logout: () => Promise<void>;
  switchRole: (role: 'student' | 'faculty' | 'admin') => void;
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
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

<<<<<<< HEAD
function persistSession(profile: Profile) {
  localStorage.setItem('placetrack_role', profile.role);
  localStorage.setItem('placetrack_user_id', profile.id);
  if (profile.email) localStorage.setItem('placetrack_user_email', profile.email);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [role, setRole] = useState<PortalRole | null>(null);
=======
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [role, setRole] = useState<'student' | 'faculty' | 'admin' | null>(null);
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function initAuth() {
<<<<<<< HEAD
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
=======
      const savedRole = localStorage.getItem('placetrack_role') as 'student' | 'faculty' | 'admin' | null;
      if (savedRole) {
        const profiles = await DatabaseService.getProfiles();
        const match = profiles.find((p) => p.role === savedRole);
        if (match) {
          setUser(match);
          setRole(match.role);
        }
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
      }
    }
    initAuth();
  }, []);

<<<<<<< HEAD
  const loginWithRole = (targetRole: PortalRole) => {
    const match = MOCK_PROFILES.find((p) => p.role === targetRole) || MOCK_PROFILES[0];
    setUser(match);
    setRole(match.role);
    persistSession(match);
  };

  const signInWithEmail = async (email: string, pass: string): Promise<AuthResult> => {
    setIsLoading(true);
    const cleanEmail = email.toLowerCase().trim();

=======
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
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
    if (cleanEmail === 'placetrackpro@admin.co.in') {
      if (pass !== 'Aswath170805' && pass !== 'password123') {
        setIsLoading(false);
        return { success: false, error: 'Invalid Admin password!' };
      }
      const adminProfile = MOCK_PROFILES.find((p) => p.role === 'admin') || {
        id: 'a3333333-3333-3333-3333-333333333333',
        email: 'placetrackpro@admin.co.in',
        full_name: 'System Admin',
<<<<<<< HEAD
        role: 'admin' as const,
=======
        role: 'admin',
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
        department: 'Placement Cell',
        year_of_study: 'N/A',
        is_verified: true,
        created_at: new Date().toISOString(),
      };
      setUser(adminProfile as Profile);
      setRole('admin');
<<<<<<< HEAD
      persistSession(adminProfile as Profile);
      setIsLoading(false);
      return { success: true, role: 'admin' };
    }

=======
      localStorage.setItem('placetrack_role', 'admin');
      setIsLoading(false);
      return { success: true };
    }

    // 2. Enforce SVCE Domain Requirement for Students and Teachers
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
    if (!cleanEmail.endsWith('@svce.ac.in')) {
      setIsLoading(false);
      return { success: false, error: 'Access Denied: Only @svce.ac.in email addresses are permitted for Students & Teachers!' };
    }

<<<<<<< HEAD
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
=======
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

    await DatabaseService.createProfile(fallbackProfile);
    setUser(fallbackProfile);
    setRole(assignedRole);
    localStorage.setItem('placetrack_role', assignedRole);
    setIsLoading(false);
    return { success: true };
  };

  const signUpWithEmail = async (data: { email: string; pass: string; fullName: string; role: 'student' | 'faculty'; department: string; yearOfStudy?: string; batchId?: string }) => {
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
    setIsLoading(true);
    const cleanEmail = data.email.toLowerCase().trim();

    if (!cleanEmail.endsWith('@svce.ac.in')) {
      setIsLoading(false);
      return { success: false, error: 'Registration Rejected: Must use official @svce.ac.in email address!' };
    }

<<<<<<< HEAD
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
=======
    const newProfile: Profile = {
      id: 'u-' + Math.random().toString(36).substring(2, 9),
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
      email: cleanEmail,
      full_name: data.fullName,
      role: data.role,
      department: data.department,
<<<<<<< HEAD
      year_of_study: data.role === 'faculty' ? 'N/A' : data.yearOfStudy || 'Final Year',
      batch_id: data.role === 'student' ? data.batchId : undefined,
      is_verified: false,
      created_at: new Date().toISOString(),
    };

    const created = await DatabaseService.createProfile(newProfile);
    const targetUserId = created?.id || newProfile.id;

=======
      year_of_study: data.yearOfStudy || 'Final Year',
      batch_id: data.batchId,
      is_verified: false, // Default to pending verification
      created_at: new Date().toISOString(),
    };

    // Save profile into DatabaseService so it appears live on Admin Verification Desk!
    const created = await DatabaseService.createProfile(newProfile);
    const targetUserId = created?.id || newProfile.id;

    // Create verification request record in verification_requests table
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
    await DatabaseService.createVerificationRequest({
      user_id: targetUserId,
      student_name: data.fullName,
      email: cleanEmail,
      role: data.role,
      department: data.department,
<<<<<<< HEAD
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
=======
      year_of_study: data.yearOfStudy,
      batch_id: data.batchId,
    });

    setIsLoading(false);
    return { 
      success: false, 
      pendingVerification: true, 
      error: 'Registration Successful! Your account is queued for Admin Verification. Access will be granted once approved by Placement Cell.' 
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
    };
  };

  const logout = async () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem('placetrack_role');
<<<<<<< HEAD
    localStorage.removeItem('placetrack_user_id');
    localStorage.removeItem('placetrack_user_email');
  };

  const switchRole = (targetRole: PortalRole) => {
=======
  };

  const switchRole = (targetRole: 'student' | 'faculty' | 'admin') => {
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
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
