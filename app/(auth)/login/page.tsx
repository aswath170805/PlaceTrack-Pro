'use client';

import React, { useState, useEffect } from 'react';
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
  AlertCircle,
  KeyRound 
} from 'lucide-react';

export default function CentralizedLoginPage() {
  const router = useRouter();
  const { signInWithEmail, loginWithRole, isLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<'student' | 'faculty' | 'admin'>('student');
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(false);
  const [shortcutBanner, setShortcutBanner] = useState<boolean>(false);

  const [email, setEmail] = useState<string>('student@svce.ac.in');
  const [password, setPassword] = useState<string>('password123');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [pendingVerification, setPendingVerification] = useState<boolean>(false);

  const { user, role } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user && role) {
      if (role === 'admin') router.push('/admin');
      else if (role === 'faculty') router.push('/faculty');
      else if (role === 'student') router.push('/student');
    }
  }, [user, role, router]);

  // Keyboard shortcut listener for Shift + Ctrl + F
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && (e.ctrlKey || e.metaKey) && (e.key === 'F' || e.key === 'f')) {
        e.preventDefault();
        setIsAdminUnlocked(true);
        setActiveTab('admin');
        setEmail('placetrackpro@admin.co.in');
        setPassword('Aswath170805');
        setShortcutBanner(true);
        setTimeout(() => setShortcutBanner(false), 5000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleTabChange = (role: 'student' | 'faculty' | 'admin') => {
    setActiveTab(role);
    setErrorMsg(null);
    if (role === 'student') setEmail('student@svce.ac.in');
    else if (role === 'faculty') setEmail('faculty@svce.ac.in');
    else if (role === 'admin') setEmail('placetrackpro@admin.co.in');
  };

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
<<<<<<< HEAD
      if (res.role === 'admin') router.push('/admin');
      else if (res.role === 'faculty') router.push('/faculty');
=======
      const cleanEmail = email.toLowerCase().trim();
      if (cleanEmail === 'placetrackpro@admin.co.in') router.push('/admin');
      else if (cleanEmail.includes('faculty') || cleanEmail.includes('teacher')) router.push('/faculty');
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
      else router.push('/student');
    } else {
      setErrorMsg(res.error || 'Invalid credentials. Please check your email and password.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-blue-600 selection:text-white font-sans">
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-blue-600/20 via-indigo-600/10 to-transparent blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <Link href="/" className="inline-flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-600/30">
            <GraduationCap className="w-7 h-7" />
          </div>
        </Link>

        <h2 className="text-3xl font-black tracking-tight text-white">SVCE Portal Sign In</h2>
        <p className="mt-2 text-xs text-slate-400">
          Sign in with your official @svce.ac.in email address
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 space-y-6">
        
        {/* Secret Shortcut Unlocked Banner */}
        {shortcutBanner && (
          <div className="p-4 bg-amber-500/20 border border-amber-500/40 rounded-2xl text-xs text-amber-300 font-bold flex items-center justify-center space-x-2 animate-bounce shadow-xl">
            <KeyRound className="w-5 h-5 text-amber-400 shrink-0" />
            <span>Secret Admin Access Activated via Shortcut (Shift + Ctrl + F)! Log in below.</span>
          </div>
        )}

        {/* 2-Tab / 3-Tab Sign In Selector */}
        <div className={`bg-slate-900/90 border border-slate-800 p-2 rounded-3xl grid ${isAdminUnlocked ? 'grid-cols-3' : 'grid-cols-2'} gap-2 shadow-2xl`}>
          <button
            type="button"
            onClick={() => handleTabChange('student')}
            className={`py-3 rounded-2xl font-extrabold text-xs transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'student' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Student</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('faculty')}
            className={`py-3 rounded-2xl font-extrabold text-xs transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'faculty' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Teacher</span>
          </button>

          {isAdminUnlocked && (
            <button
              type="button"
              onClick={() => handleTabChange('admin')}
              className={`py-3 rounded-2xl font-black text-xs transition-all flex items-center justify-center space-x-1.5 ${
                activeTab === 'admin' ? 'bg-amber-600 text-slate-950 shadow-lg shadow-amber-600/30' : 'text-amber-400 hover:text-amber-300'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Admin</span>
            </button>
          )}
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
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {activeTab === 'admin' ? 'Placement Admin Email' : 'Official SVCE Email Address'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={activeTab === 'admin' ? 'placetrackpro@admin.co.in' : 'student@svce.ac.in'}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
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
              className={`w-full py-3 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center ${
                activeTab === 'student' ? 'bg-blue-600 hover:bg-blue-500 text-white' : activeTab === 'faculty' ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-amber-600 hover:bg-amber-500 text-slate-950 font-black'
              }`}
            >
              {isLoading ? 'Authenticating...' : `Sign In as ${activeTab.toUpperCase()}`}
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
