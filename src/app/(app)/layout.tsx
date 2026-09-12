'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bookmark, CheckCircle, Calendar, LineChart, MessageCircle, BookOpen, ClipboardEdit } from 'lucide-react';

import { useAppStore } from '@/lib/store';
import { useEffect, useState } from 'react';
import { InstallPrompt } from '@/components/InstallPrompt';
import { DiscreetProvider, useDiscreet } from '@/components/DiscreetProvider';
import { EyeOff } from 'lucide-react';

function HeaderControls() {
  const router = useRouter();
  const { setQuickCoverActive } = useDiscreet();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setQuickCoverActive(true)}
        className="text-xs font-bold text-[var(--eh-plum)] uppercase tracking-wider hover:bg-[var(--eh-canvas)] px-2 py-1 rounded transition-colors flex items-center gap-1"
      >
        <EyeOff size={14} />
        <span className="hidden sm:inline">Hide personal details</span>
        <span className="sm:hidden">Hide</span>
      </button>
      <button 
        onClick={() => {
          router.push('/onboarding');
        }}
        className="text-xs font-bold text-[var(--eh-muted)] uppercase tracking-wider hover:text-[var(--eh-plum)] px-2 py-1 transition-colors"
      >
        Reset
      </button>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !profile) {
      router.push('/onboarding');
    }
  }, [profile, router, mounted]);

  useEffect(() => {
    const mainContent = document.getElementById('main-scroll-container');
    if (mainContent) {
      mainContent.scrollTop = 0;
    }
  }, [pathname]);

  if (!mounted) return null;
  if (!profile) return null;

  return (
    <DiscreetProvider>
      <div className="flex flex-col h-screen bg-[var(--background)]">
        <div className="sticky top-0 z-20 bg-[var(--eh-paper)] shadow-sm border-b border-[var(--eh-line)]">
          <header className="px-3 py-2 flex items-center justify-between border-b border-[var(--eh-line)]">
            <div className="flex items-center gap-2 min-w-0">
              <img src="/logo.png" alt="Elevate HER" className="h-6 w-auto object-contain shrink-0" />
              <h1 className="font-serif font-bold text-base sm:text-lg text-[var(--eh-plum)] truncate">Elevate HER Workday</h1>
            </div>
            <div className="shrink-0 pl-2">
              <HeaderControls />
            </div>
          </header>

        <nav className="w-full flex justify-around items-center h-14 px-1">
          {[
            { href: '/today', label: 'Today', icon: <CheckCircle size={18} /> },
            { href: '/planner', label: '30 Days', icon: <Calendar size={18} /> },
            { href: '/log', label: 'Log', icon: <ClipboardEdit size={18} /> },
            { href: '/patterns', label: 'Patterns', icon: <LineChart size={18} /> },
            { href: '/education', label: 'Learn', icon: <BookOpen size={18} /> },
            { href: '/support', label: 'Support', icon: <MessageCircle size={18} /> },
            { href: '/playbook', label: 'Playbook', icon: <Bookmark size={18} /> },
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

      <main id="main-scroll-container" className="flex-1 overflow-y-auto pb-8 relative">
        <InstallPrompt />
        {children}
      </main>
    </div>
    </DiscreetProvider>
  );
}

function NavItem({ href, label, icon, active }: { href: string, label: string, icon: React.ReactNode, active: boolean }) {
  return (
    <Link href={href} className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${active ? 'text-[var(--eh-plum)]' : 'text-[var(--eh-muted)] hover:text-[var(--eh-mauve)]'}`}>
      {icon}
      <span className="text-[10px] sm:text-xs font-bold">{label}</span>
    </Link>
  );
}
