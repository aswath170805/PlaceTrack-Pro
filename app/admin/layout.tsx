'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { ShieldAlert } from 'lucide-react';

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

  return <>{children}</>;
}
