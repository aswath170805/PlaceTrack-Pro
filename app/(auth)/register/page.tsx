'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { DatabaseService } from '@/lib/dbService';
import { Batch } from '@/lib/mockData';
import { GraduationCap, Lock, Mail, User, BookOpen, ArrowRight, AlertCircle, Clock } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { signUpWithEmail, isLoading } = useAuth();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [role, setRole] = useState<'student' | 'faculty'>('student');
  const [department, setDepartment] = useState<string>('CSE');
  const [yearOfStudy, setYearOfStudy] = useState<string>('4');
  const [batchId, setBatchId] = useState<string>('');
  const [batches, setBatches] = useState<Batch[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [pendingNotice, setPendingNotice] = useState<boolean>(false);

  useEffect(() => {
    async function loadBatches() {
      const bList = await DatabaseService.getBatches();
      setBatches(bList);
      if (bList.length > 0) setBatchId(bList[0].id);
    }
    loadBatches();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setPendingNotice(false);

    if (!email.toLowerCase().trim().endsWith('@svce.ac.in')) {
      setErrorMsg('Registration Rejected: Email MUST end with @svce.ac.in!');
      return;
    }

    const res = await signUpWithEmail({
      email,
      pass: password,
      fullName,
      role,
      department,
      yearOfStudy,
      batchId,
    });

    if (res.pendingVerification) {
      setPendingNotice(true);
      setErrorMsg(
        res.error ||
          (role === 'faculty'
            ? 'Access request sent to Placement Admin. After they grant access, sign in again to open the Faculty portal.'
            : 'Registration submitted. After Placement Admin approves, sign in to open the Student portal.')
      );
    } else if (res.success) {
      if (role === 'faculty') router.push('/faculty');
      else router.push('/student');
    } else {
      setErrorMsg(res.error || 'Registration failed. Please check form fields.');
    }
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

        <h2 className="text-3xl font-black tracking-tight text-white">
          {role === 'faculty' ? 'Request Faculty Access' : 'Create SVCE Account'}
        </h2>
        <p className="mt-2 text-xs text-slate-400">
          {role === 'faculty'
            ? 'New faculty accounts are queued for Placement Admin approval. You can sign in only after access is granted.'
            : 'Register your Student or Teacher account (Must use official @svce.ac.in email)'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-slate-900 border border-slate-800 py-8 px-6 shadow-2xl sm:rounded-3xl sm:px-10">
          
          {errorMsg && (
            <div className={`mb-4 p-3 rounded-xl text-xs flex items-start space-x-2 ${
              pendingNotice ? 'bg-amber-500/10 border border-amber-500/30 text-amber-300' : 'bg-red-500/10 border border-red-500/30 text-red-400'
            }`}>
              {pendingNotice ? <Clock className="w-4 h-4 shrink-0 text-amber-400" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Account Role */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Account Role</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    role === 'student' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  Student (@svce)
                </button>
                <button
                  type="button"
                  onClick={() => setRole('faculty')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    role === 'faculty' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  Teacher / Faculty (@svce)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  required
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Official SVCE Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@svce.ac.in"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <span className="block text-[10px] text-slate-500 mt-1">Must end with @svce.ac.in</span>
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

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                >
                  <option value="AIDS">AIDS</option>
                  <option value="CSE">CSE</option>
                  <option value="IT">IT</option>
                  <option value="ECE">ECE</option>
                  <option value="EEE">EEE</option>
                  <option value="MECH">MECH</option>
                  <option value="BIOTECH">BIOTECH</option>
                </select>
              </div>

              {role === 'student' && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Year of Study</label>
                  <select
                    value={yearOfStudy}
                    onChange={(e) => setYearOfStudy(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  >
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year (Final)</option>
                  </select>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center mt-2"
            >
              {isLoading
                ? 'Submitting request...'
                : role === 'faculty'
                  ? 'Send Access Request to Admin'
                  : 'Submit Registration for Admin Approval'}
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </button>
          </form>

          {pendingNotice && (
            <div className="mt-4 p-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 text-center space-y-3">
              <p className="text-xs text-amber-200">
                Placement Admin will see this request on the User Governance desk. After they click <strong>Grant Access</strong>, come back and sign in.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center justify-center w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 font-bold text-xs rounded-xl"
              >
                Go to Sign In (after admin approval)
              </Link>
            </div>
          )}

          <div className="mt-6 border-t border-slate-800 pt-4 text-center">
            <p className="text-xs text-slate-400">
              Already registered?{' '}
              <Link href="/login" className="font-bold text-blue-400 hover:underline">
                Sign In Instead
              </Link>
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
