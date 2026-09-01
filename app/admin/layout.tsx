'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';

export default function AdminLayoutGuard({ children }: { children: React.ReactNode }) {
  const { user, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || role !== 'admin') {
      router.replace('/login');
    }
  }, [user, role, router]);

  // Prevent flash of protected UI during redirect
  if (!user || role !== 'admin') {
    return null;
  }

  return <>{children}</>;
}
