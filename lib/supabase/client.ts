import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placetrack-pro-demo.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNldHJhY2stcHJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE2MDAwMDAwMDAsImV4cCI6MjAwMDAwMDAwMH0.placeholder';

  try {
    return createBrowserClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.warn('Supabase browser client init fallback:', err);
    return {
      from: () => ({
        select: () => Promise.resolve({ data: null, error: true }),
        insert: () => Promise.resolve({ data: null, error: true }),
        update: () => Promise.resolve({ data: null, error: true }),
        delete: () => Promise.resolve({ data: null, error: true }),
      }),
      auth: {
        getSession: () => Promise.resolve({ data: { session: null } }),
        signInWithPassword: () => Promise.resolve({ data: { user: null }, error: new Error('Auth fallback') }),
        signUp: () => Promise.resolve({ data: { user: null }, error: new Error('Auth fallback') }),
        signOut: () => Promise.resolve({ error: null }),
      }
    } as any;
  }
}

