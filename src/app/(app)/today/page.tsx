'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Domain, DemandTag } from '@/lib/types';
import Link from 'next/link';
import { actionLibrary } from '@/lib/action-library';
import { DownloadPlanButton } from '@/components/PlanPDF';
import { EvidenceDrawer } from '@/components/EvidenceDrawer';
import { DailyCapacityCheck } from '@/components/DailyCapacityCheck';
import { BookmarkPlus } from 'lucide-react';

export default function Today() {
  const { profile, dailyPlans, generateDailyPlan, saveDailyPlan, resetDemo, savePlaybookItem } = useAppStore();
  
  const [localDate, setLocalDate] = useState('');
  useEffect(() => {
    // Generate local date string YYYY-MM-DD
    const d = new Date();
    setLocalDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
  }, []);

  const plan = dailyPlans[localDate];
  
  const [showCheckIn, setShowCheckIn] = useState(!plan);
  const [concern, setConcern] = useState<Domain | 'general' | null>(null);
  
  const [dayChanged, setDayChanged] = useState(false);
  const [enoughForToday, setEnoughForToday] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [triedActions, setTriedActions] = useState<Record<string, boolean>>({});
  const [dayChangedConcern, setDayChangedConcern] = useState<Domain | null>(null);

  if (!localDate) return null;

  const handleShowPlan = (approach?: any, overrideFocus?: string) => {
    if (!plan) {
      const explicitFocus = (overrideFocus as any) || (concern !== 'general' ? concern || undefined : undefined);
      const newPlan = generateDailyPlan(localDate, explicitFocus, undefined, undefined, approach);
      saveDailyPlan(newPlan);
    }
    setShowCheckIn(false);
  };

  const handleTryThis = (actionId: string) => {
    setTriedActions(prev => ({ ...prev, [actionId]: true }));
  };

  const handleSwap = (actionId: string) => {
    // We get swapAction from the store
    useAppStore.getState().swapAction(localDate, actionId);
  };

  const handleSaveStrategy = (action: any) => {
    savePlaybookItem({
      id: crypto.randomUUID(),
      type: 'strategy',
      source_id: action.id,
      user_title: action.title,
      pinned: false,
      saved_to_try: false,
      created_at: new Date().toISOString()
    });
    alert('Saved to My Playbook!');
  };

  const handleDayChanged = () => {
    setDayChanged(true);
  };

  const dayChangedOptions: { label: string, domain: Domain }[] = [
    { label: 'Poor night', domain: 'recovery' },
    { label: 'Unexpected demand', domain: 'load' },
    { label: 'Harder to focus', domain: 'focus' },
    { label: 'Lower energy', domain: 'energy' },
    { label: 'Discomfort or temperature change', domain: 'comfort' },
    { label: 'Difficult conversation', domain: 'support' },
    { label: 'Something else', domain: 'general' }
  ];

  const handleDayChangedSubmit = () => {
    if (dayChangedConcern) {
      const newPlan = generateDailyPlan(localDate, dayChangedConcern);
      saveDailyPlan(newPlan);
    }
    setDayChanged(false);
  };

  const handleEnough = () => {
    setEnoughForToday(true);
  };

  if (enoughForToday) {
    return (
      <div className="p-6 max-w-md mx-auto mt-12 space-y-6 text-center">
        <h1 className="text-2xl font-serif font-bold text-[var(--primary)]">Your plan is saved.</h1>
        <p className="text-lg text-gray-800">Come back when it is useful.</p>
        <button onClick={() => setEnoughForToday(false)} className="mt-8 text-[var(--primary)] underline">Return to Plan</button>
      </div>
    );
  }

  if (dayChanged) {
    return (
      <div className="p-6 max-w-md mx-auto space-y-6">
        <h1 className="text-2xl font-serif font-bold text-[var(--eh-lilac)]">Let’s make the plan fit.</h1>
        <p className="font-medium text-[var(--eh-lilac)]">What happened?</p>
        <div className="space-y-3">
          {dayChangedOptions.map(opt => (
            <label key={opt.label} className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm cursor-pointer border border-transparent hover:border-[var(--accent-1)]">
              <input type="radio" name="changed" checked={dayChangedConcern === opt.domain} onChange={() => setDayChangedConcern(opt.domain)} className="mt-1" />
              <span className="text-[var(--eh-ink)] font-medium">{opt.label}</span>
            </label>
          ))}
        </div>
        <button onClick={handleDayChangedSubmit} disabled={!dayChangedConcern} className="w-full py-4 bg-[var(--primary)] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50">Adjust today’s plan</button>
        <button onClick={() => setDayChanged(false)} className="w-full py-4 text-gray-600 font-medium">Cancel</button>
      </div>
    );
  }

  if (showCheckIn) {
    if (profile?.offer_daily_check !== false) {
      return (
        <DailyCapacityCheck 
          onComplete={(approach, focus) => handleShowPlan(approach, focus)}
          onSkip={() => handleShowPlan('usual')}
        />
      );
    }

    return (
      <div className="p-6 max-w-md mx-auto space-y-6 font-sans pb-32">
        <h1 className="text-2xl font-serif font-bold text-[var(--eh-lilac)]">What Would Help Today?</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-white mb-2">1. Select a primary focus:</label>
            <div className="space-y-2">
              {[
                { id: 'focus', label: 'Focus/concentration' },
                { id: 'energy', label: 'Energy/fatigue' },
                { id: 'recovery', label: 'Poor sleep/recovery' },
                { id: 'load', label: 'Competing demands' },
                { id: 'comfort', label: 'Physical comfort' },
                { id: 'support', label: 'Difficulty asking for support' },
                { id: 'general', label: 'Nothing specific—use my usual plan.' }
              ].map(opt => (
                <label key={opt.id} className="flex items-start space-x-3 p-4 bg-white rounded-[var(--eh-control-radius)] shadow-[var(--eh-shadow)] cursor-pointer border border-transparent hover:border-[var(--eh-mauve)] transition-colors">
                  <input type="radio" name="concern" checked={concern === opt.id} onChange={() => setConcern(opt.id as any)} className="mt-1" />
                  <span className="font-medium text-[var(--eh-ink)]">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
          <button 
            onClick={() => handleShowPlan('usual')}
            className="w-full bg-[var(--eh-plum)] text-white font-bold py-3 px-4 rounded-[var(--eh-control-radius)] hover:bg-[#3a103b] transition-colors"
          >
            Show my plan
          </button>
        </div>
      </div>
    );
  }

  if (!plan) return null;

  return (
    <div className="p-4 md:p-6 max-w-md mx-auto space-y-6 pb-24 font-sans">
            <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-[var(--eh-lilac)]">Plan for Today</h1>
        {plan.selected_approach && plan.selected_approach !== 'usual' ? (
          <div className="mt-2 inline-block bg-[var(--eh-plum)] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
            {plan.selected_approach} Approach
          </div>
        ) : (
          <p className="text-[var(--eh-lilac)] text-sm mt-1">Review your suggested actions or ask for an alternative.</p>
        )}
      </div>



      <div className="space-y-6">
        {plan.actions.map((action, idx) => (
          <div key={action.id} className="bg-white p-6 rounded-[var(--eh-card-radius)] shadow-sm border border-gray-100 space-y-4 relative group">
              <button 
                onClick={() => handleSaveStrategy(action)}
                className="absolute top-4 right-4 p-2 text-gray-300 hover:text-[var(--eh-plum)] hover:bg-gray-50 rounded-full transition-colors"
                title="Keep in Playbook"
              >
                <BookmarkPlus size={20} />
              </button>
              <h3 className="font-serif font-bold text-xl text-[var(--eh-plum)] pr-8">{action.title}</h3>
            <p className="text-gray-800 leading-relaxed">{action.instruction}</p>
            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => handleTryThis(action.id)}
                className={`flex-1 py-3 font-semibold rounded-lg text-sm transition-colors ${triedActions[action.id] ? 'bg-[var(--accent-1)] text-white' : 'bg-[#e8dde5] text-[var(--primary)] hover:bg-[var(--accent-1)] hover:text-white'}`}
              >
                {triedActions[action.id] ? 'Tried' : 'Try this'}
              </button>
              <button onClick={() => handleSwap(action.id)} className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg text-sm hover:bg-gray-200 transition-colors">Swap</button>
            </div>
            {idx === 0 && (
              <div className="mt-5 pt-5 border-t border-gray-100 bg-[#faf8f9] -mx-6 -mb-6 p-6 rounded-b-xl border-t-[var(--accent-1)]">
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--eh-mauve)] mb-2">If the day changes</p>
                <p className="text-sm italic text-[var(--eh-plum)]">{plan.fallback}</p>
              </div>
            )}
            {idx !== 0 && (
              <EvidenceDrawer action={action} />
            )}
            {idx === 0 && (
              <div className="mt-4 pb-2">
                <EvidenceDrawer action={action} />
              </div>
            )}
          </div>
        ))}

        {plan.actions.length === 0 && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-800">The suggestions don’t fit right now. Write one small next step, or open Support to plan a request for help.</p>
          </div>
        )}
      </div>

      <div className="pt-8 space-y-4">
        <button onClick={handleDayChanged} className="w-full py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors">
          My day changed
        </button>
        <button onClick={handleEnough} className="w-full py-4 text-white font-bold hover:text-[var(--eh-lilac)] transition-colors">
          That’s enough for today
        </button>
        
        <div className="pt-8 border-t border-[var(--eh-line)] mt-8">
          <p className="text-sm font-bold text-white mb-4 text-center">Optional Feedback</p>
          <div className="bg-white p-5 rounded-[var(--eh-card-radius)] shadow-[var(--eh-shadow)]">
            {!feedbackGiven ? (
              <>
                <p className="text-sm text-[var(--eh-ink)] mb-3">Was today's plan useful?</p>
                <div className="flex gap-2">
                  <button onClick={() => setFeedbackGiven(true)} className="flex-1 py-2 border border-[var(--eh-line)] rounded-[var(--eh-control-radius)] text-sm font-bold text-[var(--eh-ink)] hover:bg-[var(--eh-canvas)]">Yes, it helped</button>
                  <button onClick={() => setFeedbackGiven(true)} className="flex-1 py-2 border border-[var(--eh-line)] rounded-[var(--eh-control-radius)] text-sm font-bold text-[var(--eh-ink)] hover:bg-[var(--eh-canvas)]">Not today</button>
                </div>
              </>
            ) : (
              <p className="text-sm font-bold text-[var(--eh-plum)] text-center py-2">Thank you for your feedback. Your entry has been saved.</p>
            )}
          </div>
        </div>

        <div className="pt-8 border-t border-[var(--eh-line)] mt-8">
          <p className="text-sm text-white text-center mb-4 font-bold">Export your current plan</p>
          <div onClick={() => {
            import('@/components/PlanPDF').then(m => {
              // Lazy loading of component just to show it
            });
          }}>
            <DownloadPlanButton plan={plan} profile={profile!} />
          </div>
        </div>

        {plan.actions.some(a => (a.title + ' ' + a.instruction).toLowerCase().includes('harder window')) && (
          <div className="mt-8 bg-white p-5 rounded-[var(--eh-card-radius)] shadow-[var(--eh-shadow)] border border-[var(--eh-plum)]">
            <h4 className="font-serif font-bold text-[var(--eh-plum)] mb-1">What is a "Harder Window"?</h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              A <em>harder window</em> refers to the specific time of day when your symptoms (like brain fog, fatigue, or discomfort) or your work demands (like school pick-ups or intense meetings) typically peak. 
              Identifying this window helps you avoid scheduling your most demanding tasks during your lowest capacity times.
            </p>
          </div>
        )}
        
        <div className="mt-8 bg-white p-6 rounded-[var(--eh-card-radius)] shadow-[var(--eh-shadow)] border border-[var(--eh-line)]">
          <h3 className="font-serif font-bold text-xl text-[var(--eh-plum)] mb-2">Prepare me for...</h3>
          <p className="text-[var(--eh-muted)] text-sm mb-4">Build a 5-step preparation brief for difficult meetings, tasks, or unpredictable days.</p>
          <Link href="/prepare" className="block text-center w-full bg-white text-[var(--eh-plum)] border border-[var(--eh-plum)] font-bold py-3 px-4 rounded-[var(--eh-control-radius)] hover:bg-[var(--eh-canvas)] transition-colors">
            Start Preparation Brief
          </Link>
        </div>
      </div>
    </div>
  );
}
