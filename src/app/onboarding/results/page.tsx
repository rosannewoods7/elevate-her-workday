'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Domain } from '@/lib/types';

const DOMAIN_LABELS: Record<Domain, string> = {
  focus: 'Protecting time and focus',
  energy: 'Managing physical energy and pacing',
  recovery: 'Improving detachment and evening recovery',
  load: 'Reducing administrative or cognitive load',
  comfort: 'Managing physical comfort and environment',
  support: 'Getting better support from my team or manager',
  general: 'Balanced Mix'
};

export default function Results() {
  const router = useRouter();
  const { profile, updateProfile } = useAppStore();
  const [isEditingPriority, setIsEditingPriority] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (!profile) return null;

  const handleContinue = () => {
    router.push('/today');
  };

  const domainExplanations: Record<string, string> = {
    recovery: "Your scores indicate that poor sleep and lack of recovery are currently driving the most friction. Your daily plans will prioritize protecting your energy and scaling back demands when your biological battery is low.",
    load: "Your scores show that competing demands and overwhelm are peaking. Your daily plans will focus heavily on strategies to drop, delegate, or delay tasks to restore your operational capacity.",
    focus: "Your scores point to difficulty with concentration and clarity. Your daily plans will provide micro-strategies to break tasks down, manage your physical environment, and optimize your working windows.",
    energy: "Your scores indicate that fatigue is a primary barrier. Your daily plans will prioritize strategic pacing and micro-breaks so you don't burn out by 2 PM.",
    comfort: "Your scores show physical discomfort or temperature changes are disrupting your flow. Your daily plans will focus on environmental control and physiological comfort.",
    support: "Your scores indicate a need for structural help. Your daily plans will prioritize identifying what you need and formulating structured asks for your team or family.",
    general: "Your plan will provide a balanced mix of executive strategies."
  };

  return (
    <main className="min-h-screen bg-[var(--eh-mauve)] p-4 text-white pb-24 font-sans flex flex-col items-center">
      <div className="max-w-md w-full space-y-6 mt-8 animate-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-3xl font-serif font-bold text-[var(--eh-lilac)] text-center">Your Profile is Ready</h1>
        
        <div className="bg-white p-6 rounded-[var(--eh-card-radius)] shadow-[var(--eh-shadow)] space-y-6 border border-[var(--eh-line)]">
          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xs font-bold text-[var(--eh-muted)] uppercase tracking-wider">Primary Focus</h3>
              {!isEditingPriority && (
                <button onClick={() => setIsEditingPriority(true)} className="text-[var(--eh-plum)] text-xs font-bold hover:underline">
                  Change
                </button>
              )}
            </div>
            
            {isEditingPriority ? (
              <div className="mt-3 space-y-2">
                {(Object.keys(DOMAIN_LABELS) as Domain[]).map((d) => (
                  <button 
                    key={d} 
                    onClick={() => {
                        updateProfile({ confirmed_primary: d });
                        setIsEditingPriority(false);
                    }}
                    className="w-full text-left p-3 border border-[var(--eh-line)] rounded-[var(--eh-control-radius)] text-sm text-[var(--eh-ink)] capitalize hover:border-[var(--eh-plum)] hover:bg-[var(--eh-canvas)]"
                  >
                    {DOMAIN_LABELS[d]}
                  </button>
                ))}
                <button onClick={() => setIsEditingPriority(false)} className="w-full text-center p-2 text-[var(--eh-muted)] text-sm mt-2 font-bold">Cancel</button>
              </div>
            ) : (
              <>
                <h3 className="font-serif text-2xl font-bold text-[var(--eh-plum)] capitalize mt-1">
                  {DOMAIN_LABELS[profile.confirmed_primary as Domain] || 'General Strategy'}
                </h3>
                <p className="text-sm text-[var(--eh-ink)] mt-2 leading-relaxed bg-[var(--eh-canvas)] p-3 rounded-[var(--eh-control-radius)] border-l-2 border-[var(--eh-plum)]">
                  {domainExplanations[profile.confirmed_primary as string] || domainExplanations.general}
                </p>
              </>
            )}
          </div>

          <div className="border-t border-[var(--eh-line)] pt-6 mt-6">
            <span className="text-xs font-bold uppercase text-[var(--eh-muted)] tracking-wider">Interference Snapshot</span>
            <div className="space-y-3 mt-4">
              {Object.entries(profile.interference || {}).map(([domain, value]) => {
                const numVal = value as number;
                if (numVal === null) return null;
                const level = numVal === 0 ? 'None' : numVal === 1 ? 'Mild' : numVal === 2 ? 'Moderate' : 'Severe';
                const color = numVal === 0 ? 'text-[var(--eh-muted)]' : numVal === 1 ? 'text-[#849b87]' : numVal === 2 ? 'text-[#e6b360]' : 'text-[#c67373]';
                return (
                  <div key={domain} className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm mb-3">
                    <span className="font-bold text-[var(--eh-ink)] mb-1 sm:mb-0 leading-tight">{DOMAIN_LABELS[domain as Domain] || domain}</span>
                    <span className={`font-bold ${color} text-xs uppercase tracking-wider`}>{level} ({numVal}/3)</span>
                  </div>
                );
              })}
              {Object.keys(profile.interference || {}).length === 0 && (
                <p className="text-sm text-[var(--eh-muted)] italic">No specific interference recorded.</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <button 
            onClick={handleContinue}
            className="w-full py-4 bg-[var(--eh-plum)] text-white font-bold rounded-[var(--eh-control-radius)] shadow-lg hover:shadow-xl hover:opacity-90 transition-all"
          >
            Generate My First Plan
          </button>
          <button 
            onClick={() => router.push('/onboarding')}
            className="w-full py-4 bg-transparent border border-white text-white font-bold rounded-[var(--eh-control-radius)] hover:bg-white hover:text-[var(--eh-plum)] transition-all"
          >
            Retake Assessment
          </button>
        </div>
      </div>
    </main>
  );
}
