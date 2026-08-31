'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { 
  GraduationCap, 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldAlert, 
  BookOpen, 
  Clock, 
  AlertCircle 
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { signInWithEmail, loginWithRole, isLoading } = useAuth();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [pendingVerification, setPendingVerification] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setPendingVerification(false);

    const res = await signInWithEmail(email, password);

    if (res.pendingVerification) {
      setPendingVerification(true);
      setErrorMsg(res.error || 'Your account is pending verification by Placement Cell Admin.');
      return;
    }

    if (res.success) {
      const cleanEmail = email.toLowerCase().trim();
      if (cleanEmail === 'placetrackpro@admin.co.in') router.push('/admin');
      else if (cleanEmail.includes('faculty') || cleanEmail.includes('teacher')) router.push('/faculty');
      else router.push('/student');
    } else {
      setErrorMsg(res.error || 'Invalid credentials. Please check your email and password.');
    }
  };

  const handleQuickLogin = (targetRole: 'student' | 'faculty' | 'admin') => {
    loginWithRole(targetRole);
    if (targetRole === 'student') router.push('/student');
    else if (targetRole === 'faculty') router.push('/faculty');
    else if (targetRole === 'admin') router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-blue-600 selection:text-white">
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-blue-600/20 via-indigo-600/10 to-transparent blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <Link href="/" className="inline-flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-600/30">
            <GraduationCap className="w-7 h-7" />
          </div>
        </Link>

        <h2 className="text-3xl font-black tracking-tight text-white">PlaceTrack Pro Portal Sign In</h2>
        <p className="mt-2 text-xs text-slate-400">
          Sign in with your official college credentials (@svce.ac.in or Admin login)
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 space-y-6">
        
        {/* Quick Role Persona Sign In Buttons */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-3xl space-y-2">
          <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-2">
            Instant Demo Sign In (1-Click)
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('student')}
              className="p-2.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 font-bold text-xs rounded-xl transition-all flex flex-col items-center justify-center space-y-1"
            >
              <GraduationCap className="w-4 h-4 text-blue-400" />
              <span>Student (@svce)</span>
            </button>
            
            <button
              type="button"
              onClick={() => handleQuickLogin('faculty')}
              className="p-2.5 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 font-bold text-xs rounded-xl transition-all flex flex-col items-center justify-center space-y-1"
            >
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>Teacher (@svce)</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              className="p-2.5 bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/30 text-amber-300 font-bold text-xs rounded-xl transition-all flex flex-col items-center justify-center space-y-1"
            >
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Email & Password Sign In Form */}
        <div className="bg-slate-900 border border-slate-800 py-8 px-6 shadow-2xl sm:rounded-3xl sm:px-10">
          
          {errorMsg && (
            <div className={`mb-4 p-3 rounded-xl text-xs flex items-start space-x-2 ${
              pendingVerification ? 'bg-amber-500/10 border border-amber-500/30 text-amber-300' : 'bg-red-500/10 border border-red-500/30 text-red-400'
            }`}>
              {pendingVerification ? <Clock className="w-4 h-4 shrink-0 text-amber-400" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">College Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@svce.ac.in or placetrackpro@admin.co.in"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <span className="block text-[10px] text-slate-500 mt-1">Must use @svce.ac.in for Student/Teacher or placetrackpro@admin.co.in for Admin</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center"
            >
              {isLoading ? 'Authenticating...' : 'Sign In to Portal'}
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </button>
          </form>

          <div className="mt-6 border-t border-slate-800 pt-4 text-center">
            <p className="text-xs text-slate-400">
              Don&apos;t have an account yet?{' '}
              <Link href="/register" className="font-bold text-blue-400 hover:underline">
                Register New SVCE Account
              </Link>
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
