'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If no Supabase URL is provided, we run in Demo/Graceful Degradation mode
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      setLoading(false);
      return;
    }

    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        const isAuthRoute = pathname === '/login' || pathname === '/register';

        if (session?.user?.id) {
          await useAppStore.getState().hydrateFromCloud(session.user.id);
        }
        if (!session && !isAuthRoute) {
          router.push('/login');
        } else if (session && isAuthRoute) {
          router.push('/today');
        }
      } catch (err) {
        console.error('Supabase session error:', err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user?.id) {
        await useAppStore.getState().hydrateFromCloud(session.user.id);
      }
      const isAuthRoute = pathname === '/login' || pathname === '/register';
      if (!session && !isAuthRoute) {
        router.push('/login');
      } else if (session && isAuthRoute) {
        router.push('/today');
      }
    });

    return () => subscription.unsubscribe();
  }, [pathname, router]);

  if (loading) {
    return <div className="min-h-screen bg-[var(--eh-mauve)] flex items-center justify-center">
      <div className="text-[var(--eh-lilac)] font-serif text-xl animate-pulse">Loading...</div>
    </div>;
  }

  return <>{children}</>;
}
