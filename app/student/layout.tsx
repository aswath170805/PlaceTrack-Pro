'use client';

<<<<<<< HEAD
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';

export default function StudentLayoutGuard({ children }: { children: React.ReactNode }) {
  const { user, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || role !== 'student' || !user.is_verified) {
      router.replace('/login');
    }
  }, [user, role, router]);

  // Prevent flash of protected UI during redirect
  if (!user || role !== 'student' || !user.is_verified) {
    return null;
=======
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import { ShieldAlert, Lock, Clock, LogOut } from 'lucide-react';

export default function StudentLayoutGuard({ children }: { children: React.ReactNode }) {
  const { user, role, logout } = useAuth();

  if (!user || role !== 'student') {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 text-center">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full space-y-4 shadow-2xl">
          <Lock className="w-12 h-12 text-red-500 mx-auto animate-pulse" />
          <h2 className="text-xl font-black text-white">Access Restricted to Verified Students</h2>
          <p className="text-xs text-slate-400">
            This area is exclusively reserved for Students with verified <strong>@svce.ac.in</strong> email accounts.
          </p>
          <Link href="/login" className="block py-3 bg-blue-600 hover:bg-blue-500 font-bold text-xs rounded-xl shadow-lg">
            Return to Student Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (user && !user.is_verified) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 text-center">
        <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-8 max-w-md w-full space-y-4 shadow-2xl">
          <Clock className="w-12 h-12 text-amber-400 mx-auto animate-bounce" />
          <h2 className="text-xl font-black text-white">Account Verification Pending</h2>
          <p className="text-xs text-slate-300">
            Hello <strong>{user.full_name}</strong>! Your account registration is undergoing verification by the Placement Cell Admin. Access to tests and dashboards will be unlocked as soon as your account is verified.
          </p>
          <button
            onClick={() => logout()}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 font-bold text-xs rounded-xl text-slate-300 flex items-center justify-center space-x-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out & Try Again Later</span>
          </button>
        </div>
      </div>
    );
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
  }

  return <>{children}</>;
}
