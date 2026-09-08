'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { CheckCircle, Calendar, LineChart, MessageCircle, BookOpen, ClipboardEdit } from 'lucide-react';

import { useAppStore } from '@/lib/store';
import { useEffect } from 'react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile } = useAppStore();

  useEffect(() => {
    if (!profile) {
      router.push('/onboarding');
    }
  }, [profile, router]);

  if (!profile) return null;

  return (
    <div className="flex flex-col h-screen bg-[var(--background)]">
      <div className="sticky top-0 z-20 bg-[var(--eh-paper)] shadow-sm border-b border-[var(--eh-line)]">
        <header className="p-4 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Elevate HER" className="h-8 w-auto object-contain" />
            <h1 className="font-serif font-bold text-lg text-[var(--eh-plum)]">Elevate HER Workday</h1>
          </div>
          <button 
            onClick={() => {
              router.push('/onboarding');
            }}
            className="text-xs font-bold text-[var(--eh-muted)] uppercase tracking-wider hover:text-[var(--eh-plum)] transition-colors"
          >
            Reset Profile
          </button>
        </header>

        <nav className="w-full flex justify-around items-center h-16 px-1">
          {[
            { href: '/today', label: 'Today', icon: <CheckCircle size={18} /> },
            { href: '/planner', label: '30 Days', icon: <Calendar size={18} /> },
            { href: '/log', label: 'Log', icon: <ClipboardEdit size={18} /> },
            { href: '/patterns', label: 'Patterns', icon: <LineChart size={18} /> },
            { href: '/education', label: 'Learn', icon: <BookOpen size={18} /> },
            { href: '/support', label: 'Support', icon: <MessageCircle size={18} /> },
          ].map((item) => (
            <NavItem 
              key={item.href}
              href={item.href} 
              label={item.label} 
              icon={item.icon} 
              active={pathname === item.href} 
            />
          ))}
        </nav>
      </div>

      <main className="flex-1 overflow-y-auto pb-8">
        {children}
      </main>

      <footer className="w-full bg-[var(--eh-paper)] border-t border-[var(--eh-line)] p-4 text-center pb-safe">
        <Link href="/support" className="text-sm font-bold text-[var(--eh-plum)] hover:underline flex items-center justify-center gap-2">
          <MessageCircle size={16} /> Need a workplace or healthcare adjustment? Open Support
        </Link>
      </footer>
    </div>
  );
}

function NavItem({ href, label, icon, active }: { href: string, label: string, icon: React.ReactNode, active: boolean }) {
  return (
    <Link href={href} className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${active ? 'text-[var(--eh-plum)]' : 'text-[var(--eh-muted)] hover:text-[var(--eh-mauve)]'}`}>
      {icon}
      <span className="text-xs font-bold">{label}</span>
    </Link>
  );
}
