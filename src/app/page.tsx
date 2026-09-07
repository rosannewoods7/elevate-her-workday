'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';

export default function Home() {
  const { profile } = useAppStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      if (profile) {
        router.push('/today');
      } else {
        router.push('/onboarding');
      }
    }
  }, [mounted, profile, router]);

  return (
    <div className="flex h-screen items-center justify-center bg-[var(--background)]">
      <div className="text-lg text-[var(--primary)] animate-pulse">Loading...</div>
    </div>
  );
}
