'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Domain } from '@/lib/types';

export default function Results() {
  const router = useRouter();
  const { profile, updateProfile } = useAppStore();
  const [isEditingPriority, setIsEditingPriority] = useState(false);

  if (!profile) return null;

  const handleContinue = () => {
    router.push('/today');
  };

  const handleChangePriority = (newDomain: Domain) => {
    updateProfile({ confirmed_primary: newDomain });
    setIsEditingPriority(false);
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
    <main className="min-h-screen bg-[var(--background)] p-6 text-[var(--foreground)] pb-24 font-sans flex flex-col justify-center">
      <div className="max-w-md mx-auto w-full space-y-6 mt-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-[var(--primary)]">Your Profile Summary</h1>
          <p className="text-gray-800 mt-2">Here is a structured look at the friction you are experiencing.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--accent-1)] space-y-6">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold uppercase text-gray-500 tracking-wider">Calculated Priority</span>
              {!isEditingPriority && (
                <button onClick={() => setIsEditingPriority(true)} className="text-[var(--primary)] text-xs font-bold hover:underline">
                  Change Priority
                </button>
              )}
            </div>
            
            {isEditingPriority ? (
              <div className="mt-3 space-y-2">
                {['focus', 'energy', 'recovery', 'load', 'comfort', 'support'].map((d) => (
                  <button 
                    key={d} 
                    onClick={() => handleChangePriority(d as Domain)}
                    className="w-full text-left p-3 border border-gray-200 rounded-lg text-sm capitalize hover:border-[var(--primary)] hover:bg-gray-50"
                  >
                    {d}
                  </button>
                ))}
                <button onClick={() => setIsEditingPriority(false)} className="w-full text-center p-2 text-gray-500 text-sm mt-2">Cancel</button>
              </div>
            ) : (
              <>
                <h3 className="font-serif text-2xl font-bold text-[var(--primary)] capitalize mt-1">
                  {profile.confirmed_primary}
                </h3>
                <p className="text-sm text-gray-800 mt-2 leading-relaxed bg-[#faf8f9] p-3 rounded-lg border-l-2 border-[var(--primary)]">
                  {domainExplanations[profile.confirmed_primary as string] || domainExplanations.general}
                </p>
              </>
            )}
          </div>

          <div className="border-t border-gray-100 pt-6 mt-6">
            <span className="text-xs font-bold uppercase text-gray-500 tracking-wider">Interference Snapshot</span>
            <div className="space-y-3 mt-4">
              {Object.entries(profile.interference || {}).map(([domain, value]) => {
                const numVal = value as number;
                if (numVal === null) return null;
                const level = numVal === 0 ? 'None' : numVal === 1 ? 'Mild' : numVal === 2 ? 'Moderate' : 'Severe';
                const color = numVal === 0 ? 'text-gray-400' : numVal === 1 ? 'text-green-600' : numVal === 2 ? 'text-orange-500' : 'text-red-600';
                return (
                  <div key={domain} className="flex justify-between items-center text-sm">
                    <span className="capitalize text-gray-700">{domain}</span>
                    <span className={`font-bold ${color}`}>{level} ({numVal}/3)</span>
                  </div>
                );
              })}
              {Object.keys(profile.interference || {}).length === 0 && (
                <p className="text-sm text-gray-500 italic">No specific interference recorded.</p>
              )}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <span className="text-xs font-bold uppercase text-gray-500 tracking-wider">How The Plan Works</span>
            <p className="text-sm text-gray-600 mt-3 leading-relaxed">
              Every day, you will receive two highly specific actions designed to address your priority focus. 
              You don't need to do everything. Treat these actions as a menu, not a mandate. You will also receive a "fallback" option in case your day completely derails.
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-4">
          <button 
            onClick={handleContinue}
            className="w-full py-4 bg-[var(--primary)] text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:opacity-90 transition-all"
          >
            Generate My First Plan
          </button>
          <button 
            onClick={() => router.push('/onboarding')}
            className="w-full py-4 bg-transparent border border-gray-300 text-gray-600 font-bold rounded-lg hover:bg-gray-50 transition-all"
          >
            Retake Assessment
          </button>
        </div>
      </div>
    </main>
  );
}
