'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import { ShieldAlert, Lock } from 'lucide-react';

export default function AdminLayoutGuard({ children }: { children: React.ReactNode }) {
  const { user, role } = useAuth();

  if (!user || role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 text-center">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full space-y-4 shadow-2xl">
          <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto animate-pulse" />
          <h2 className="text-xl font-black text-white">Administrator Access Only</h2>
          <p className="text-xs text-slate-400">
            This console is restricted to the Placement Cell Administrator account (<strong>placetrackpro@admin.co.in</strong>).
          </p>
          <Link href="/login" className="block py-3 bg-amber-600 hover:bg-amber-500 font-extrabold text-xs text-slate-950 rounded-xl shadow-lg">
            Return to Admin Sign In
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
