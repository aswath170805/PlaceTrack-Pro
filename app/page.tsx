'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { 
  GraduationCap, 
  BookOpen, 
  ShieldAlert, 
  Lock, 
  Mail, 
  ArrowRight, 
  Sparkles, 
  Database,
  CheckCircle2,
  RefreshCw,
  Layers,
  Users
} from 'lucide-react';

export default function FrontPortalHub() {
  const router = useRouter();
  const { signInWithEmail, loginWithRole, isLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<'student' | 'faculty' | 'admin'>('student');
  const [email, setEmail] = useState<string>('student@college.edu');
  const [password, setPassword] = useState<string>('password123');
  const [seeding, setSeeding] = useState<boolean>(false);
  const [seedSuccess, setSeedSuccess] = useState<boolean>(false);

  const handleTabChange = (role: 'student' | 'faculty' | 'admin') => {
    setActiveTab(role);
    if (role === 'student') setEmail('alex.johnson@college.edu');
    else if (role === 'faculty') setEmail('dr.connor@college.edu');
    else if (role === 'admin') setEmail('admin@college.edu');
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    loginWithRole(activeTab);
    if (activeTab === 'student') router.push('/student');
    else if (activeTab === 'faculty') router.push('/faculty');
    else if (activeTab === 'admin') router.push('/admin');
  };

  const handleSeedDatabase = async () => {
    setSeeding(true);
    try {
      const res = await fetch('/api/seed');
      const data = await res.json();
      if (data.success) {
        setSeedSuccess(true);
        setTimeout(() => setSeedSuccess(false), 4000);
      }
    } catch (e) {
      console.warn('Seeder API call');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-600 selection:text-white flex flex-col justify-between font-sans relative overflow-hidden">
      
      {/* Background Glowing Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-gradient-to-b from-blue-600/20 via-indigo-600/10 to-transparent blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center relative z-20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-black text-white tracking-tight">PlaceTrack <span className="text-blue-500">Pro</span></span>
            <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">College Placement Portal</span>
          </div>
        </div>

        <button
          onClick={handleSeedDatabase}
          disabled={seeding}
          className="inline-flex items-center px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 rounded-xl transition-all shadow-md"
        >
          <Database className={`w-3.5 h-3.5 mr-1.5 ${seeding ? 'animate-spin text-amber-400' : 'text-emerald-400'}`} />
          {seeding ? 'Seeding Supabase DB...' : 'Sync & Seed Supabase DB'}
        </button>
      </header>

      {/* Main Front Universal Sign-In Center */}
      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 space-y-8">
        
        {seedSuccess && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs text-emerald-300 font-medium flex items-center justify-center space-x-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Supabase Cloud Database successfully synced and seeded with production data!</span>
          </div>
        )}

        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-1.5 text-xs text-blue-300 font-semibold">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Universal College Placement Portal Sign In</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Select Your Role to Access Your <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">Dedicated Environment</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Choose your portal tab below to log in as Student, Faculty / Teacher, or Admin.
          </p>
        </div>

        {/* 3-Role Front Selector Tabs */}
        <div className="bg-slate-900/90 border border-slate-800 p-2 rounded-3xl grid grid-cols-3 gap-2 max-w-2xl mx-auto shadow-2xl">
          
          <button
            onClick={() => handleTabChange('student')}
            className={`py-3 px-4 rounded-2xl font-extrabold text-xs transition-all flex items-center justify-center space-x-2 ${
              activeTab === 'student'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Student Portal</span>
          </button>

          <button
            onClick={() => handleTabChange('faculty')}
            className={`py-3 px-4 rounded-2xl font-extrabold text-xs transition-all flex items-center justify-center space-x-2 ${
              activeTab === 'faculty'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Faculty Hub</span>
          </button>

          <button
            onClick={() => handleTabChange('admin')}
            className={`py-3 px-4 rounded-2xl font-extrabold text-xs transition-all flex items-center justify-center space-x-2 ${
              activeTab === 'admin'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Admin Console</span>
          </button>

        </div>

        {/* Front Role-Specific Sign In Card */}
        <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 relative overflow-hidden">
          
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
            <div className={`p-3 rounded-2xl ${
              activeTab === 'student' ? 'bg-blue-600/20 text-blue-400' : activeTab === 'faculty' ? 'bg-indigo-600/20 text-indigo-400' : 'bg-amber-600/20 text-amber-400'
            }`}>
              {activeTab === 'student' ? <GraduationCap className="w-6 h-6" /> : activeTab === 'faculty' ? <BookOpen className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-white capitalize">{activeTab} Sign In</h3>
              <p className="text-[11px] text-slate-400">
                {activeTab === 'student' ? 'Access tests, AI analytics & attendance' : activeTab === 'faculty' ? 'Manage question banks, tests & absence review' : 'Realtime proctoring stream & user governance'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">College Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center ${
                activeTab === 'student'
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
                  : activeTab === 'faculty'
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                  : 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30'
              }`}
            >
              Sign In to {activeTab.toUpperCase()} Environment
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </form>

          <div className="pt-2 text-center border-t border-slate-800">
            <Link href="/register" className="text-xs text-blue-400 font-bold hover:underline">
              Don&apos;t have an account? Register New Profile
            </Link>
          </div>

        </div>

      </div>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-900 text-center text-xs text-slate-500 relative z-20">
        PlaceTrack Pro — College Placement Preparation & Assessment Platform
      </footer>

    </div>
  );
}
