'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      setError('Supabase is not configured. Please add NEXT_PUBLIC_SUPABASE_URL to your environment variables.');
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setError(error.message);
    } else {
      router.push('/today');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[var(--eh-mauve)] flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-[var(--eh-card-radius)] shadow-[var(--eh-shadow)] p-8">
        <h1 className="text-3xl font-serif font-bold text-[var(--eh-ink)] text-center mb-6">Welcome Back</h1>
        
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-[var(--eh-ink)] mb-1">Email</label>
            <input 
              type="email" 
              required
              className="w-full border border-[var(--eh-line)] rounded-[var(--eh-control-radius)] p-3 text-sm focus:outline-none bg-white text-[var(--eh-ink)]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[var(--eh-ink)] mb-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full border border-[var(--eh-line)] rounded-[var(--eh-control-radius)] p-3 text-sm focus:outline-none bg-white text-[var(--eh-ink)]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-[var(--eh-plum)] text-white font-bold rounded-[var(--eh-control-radius)] hover:opacity-90 transition-opacity mt-4 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-[var(--eh-muted)]">
          Don't have an account? <Link href="/register" className="text-[var(--eh-plum)] font-bold hover:underline">Register here</Link>
        </div>
      </div>
    </div>
  );
}
