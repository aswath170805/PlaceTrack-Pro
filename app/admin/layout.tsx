'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayoutGuard({ children }: { children: React.ReactNode }) {
  const { user, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || role !== 'admin') {
      router.replace('/login');
    }
  }, [user, role, router]);

  if (!user || role !== 'admin') {
    return null;
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-slate-100">
      <AdminSidebar />
      <main className="flex-1 overflow-x-hidden min-w-0">
        {children}
      </main>
    </div>
  );
}
