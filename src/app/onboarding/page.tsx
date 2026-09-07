'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Domain, Profile, WorkContext, Control, DemandTag, EffortBudget, PriorTool } from '@/lib/types';
import { suggestFocus } from '@/lib/routing';

export default function Onboarding() {
  const router = useRouter();
  const { updateProfile } = useAppStore();
  const [step, setStep] = useState(0);

  // Q01 & Q02
  const [goal, setGoal] = useState<Domain | 'general' | null>(null);
  const [interference, setInterference] = useState<Partial<Record<Domain, number | null>>>({});

  // Q03-Q06
  const [workContext, setWorkContext] = useState<WorkContext>(null);
  const [controls, setControls] = useState<Control[]>([]);
  const [demandTags, setDemandTags] = useState<DemandTag[]>([]);
  const [effortBudget, setEffortBudget] = useState<EffortBudget>(null);

  // Q07-Q09
  const [priorTools, setPriorTools] = useState<PriorTool[]>([]);
  const [supportPref, setSupportPref] = useState<string[]>([]);
  const [schedule, setSchedule] = useState<string[]>([]);

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => Math.max(0, s - 1));

  const toggleArray = (arr: any[], setArr: any, item: any, max?: number, exclusive?: string[]) => {
    if (exclusive && exclusive.includes(item)) {
      setArr([item]);
      return;
    }
    
    let newArr = arr.filter(x => !exclusive?.includes(x));
    if (newArr.includes(item)) {
      newArr = newArr.filter(i => i !== item);
    } else {
      newArr = [...newArr, item];
    }

    if (max && newArr.length > max) return; // Prevent selecting more than max
    setArr(newArr);
  };

  const handleComplete = () => {
    const calculatedFocus = suggestFocus({ goal, interference } as Profile);
    
    updateProfile({ 
      goal, 
      interference, 
      work_context: workContext,
      controls,
      demand_tags: demandTags,
      effort_budget: effortBudget,
      prior_tools: priorTools,
      support_preference: supportPref as any,
      schedule,
      confirmed_primary: calculatedFocus.primary 
    });
    router.push('/onboarding/results');
  };

  return (
    <main className="min-h-screen bg-[var(--background)] p-6 text-[var(--foreground)] pb-24 font-sans">
      {step === 0 && (
        <div className="max-w-md mx-auto mt-12 space-y-6 flex flex-col items-center text-center">
          <div className="mb-4 flex flex-col items-center">
            <img src="/logo.png" alt="Elevate HER Wellness" className="h-24 w-auto mb-2 object-contain" />
            <h1 className="text-3xl font-serif font-bold text-[var(--primary)] mt-4">Elevate HER Workday</h1>
          </div>
          
          <h2 className="text-2xl font-serif font-bold text-[var(--primary)] capitalize">
            Make Tomorrow Feel More Manageable
          </h2>
          <p className="text-lg text-gray-800">
            Tell us what is getting in the way at work. We’ll help you choose a small starting plan, prepare for changes, and notice what helps. You can change your plan at any time.
          </p>
          <p className="text-sm text-gray-600 italic">
            This is a personal planning tool. It does not diagnose symptoms or determine whether you are fit for work.
          </p>
          
          <div className="bg-white p-6 rounded-xl shadow-sm space-y-4 w-full mt-4 text-left border border-gray-100">
            <p className="text-sm text-gray-600"><strong>Privacy Notice:</strong> This example uses fictional information and resets when you leave. Please do not enter personal health details.</p>
            <button 
              onClick={nextStep}
              className="w-full py-4 bg-[var(--primary)] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              Explore a Fictional Example
            </button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="max-w-md mx-auto space-y-6">
          <button onClick={prevStep} className="text-[var(--primary)] font-medium mb-4 block hover:underline">← Back</button>
          <h2 className="text-2xl font-serif font-bold text-[var(--primary)] text-center">What Would Help Most?</h2>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
            <div>
              <p className="font-semibold text-gray-800 mb-3">1. What would make the biggest difference over the next month?</p>
              <div className="space-y-3">
                {[
                  { id: 'focus', label: 'Feel clearer and more organised at work.' },
                  { id: 'energy', label: 'Make the workday feel more manageable.' },
                  { id: 'recovery', label: 'Have a workable plan after poor sleep.' },
                  { id: 'load', label: 'Reduce the feeling that everything is too much.' },
                  { id: 'comfort', label: 'Handle physical discomfort or temperature changes at work.' },
                  { id: 'support', label: 'Know how to ask for useful support.' },
                  { id: 'general', label: 'I’m not sure yet.' }
                ].map(opt => (
                  <label key={opt.id} className="flex items-start space-x-3 p-3 bg-[#faf8f9] rounded-lg cursor-pointer border border-transparent hover:border-[var(--accent-1)]">
                    <input type="radio" name="goal" checked={goal === opt.id} onChange={() => setGoal(opt.id as any)} className="mt-1" />
                    <span className="text-sm">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t pt-6">
              <p className="font-semibold text-gray-800 mb-1">2. During the past seven days, how much has each concern interfered with work?</p>
              <p className="text-xs mb-4 text-gray-500">0: Not at all | 1: A little | 2: Moderately | 3: A lot</p>
              <div className="space-y-4">
                {[
                  { id: 'focus', label: 'Focus/concentration' },
                  { id: 'energy', label: 'Energy/fatigue' },
                  { id: 'recovery', label: 'Poor sleep/recovery' },
                  { id: 'load', label: 'Competing demands/feeling overwhelmed' },
                  { id: 'comfort', label: 'Physical comfort/temperature changes' },
                  { id: 'support', label: 'Difficulty asking for support' },
                ].map(domain => (
                  <div key={domain.id} className="flex justify-between items-center bg-[#faf8f9] p-3 rounded-lg">
                    <span className="text-sm font-medium">{domain.label}</span>
                    <div className="flex gap-2">
                      {[0, 1, 2, 3].map(val => (
                        <button 
                          key={val}
                          onClick={() => setInterference(prev => ({...prev, [domain.id]: val}))}
                          className={`w-8 h-8 rounded-full text-xs font-bold transition-colors ${interference[domain.id as Domain] === val ? 'bg-[var(--primary)] text-white' : 'bg-gray-200 text-gray-600'}`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button onClick={nextStep} disabled={!goal} className="w-full py-4 bg-[var(--primary)] text-white font-semibold rounded-lg hover:opacity-90 mt-6 transition-opacity disabled:opacity-50">Next</button>
        </div>
      )}

      {step === 2 && (
        <div className="max-w-md mx-auto space-y-6 animate-in slide-in-from-right duration-300">
          <button onClick={prevStep} className="text-[var(--primary)] font-medium mb-4 block hover:underline">← Back</button>
          <h2 className="text-2xl font-serif font-bold text-[var(--primary)] text-center">What does your workday allow?</h2>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
            
            {/* Q03 */}
            <div>
              <p className="font-semibold text-gray-800 mb-3 text-sm">3. Which best describes your usual work?</p>
              <div className="grid grid-cols-2 gap-2">
                {[{ id: 'desk', label: 'Mostly desk-based' }, { id: 'people', label: 'Mostly with people' }, { id: 'mixed', label: 'A mixture' }, { id: 'variable', label: 'It changes' }].map(opt => (
                  <button 
                    key={opt.id} onClick={() => setWorkContext(opt.id as any)}
                    className={`p-3 text-xs rounded-lg border text-center ${workContext === opt.id ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'bg-[#faf8f9] border-gray-200'}`}
                  >{opt.label}</button>
                ))}
              </div>
            </div>

            {/* Q04 */}
            <div className="border-t pt-6">
              <p className="font-semibold text-gray-800 mb-3 text-sm">4. Which adjustments can you usually make? (Select all that apply)</p>
              <div className="space-y-2">
                {[
                  { id: 'task_order', label: 'Change task order' },
                  { id: 'short_break', label: 'Take a brief pause' },
                  { id: 'meeting_format', label: 'Adjust a meeting' },
                  { id: 'environment', label: 'Adjust environment' },
                  { id: 'none', label: 'Very little control' },
                  { id: 'unknown', label: 'Not sure' }
                ].map(opt => (
                  <label key={opt.id} className="flex items-center space-x-3 p-3 bg-[#faf8f9] rounded-lg cursor-pointer">
                    <input type="checkbox" checked={controls.includes(opt.id as any)} onChange={() => toggleArray(controls, setControls, opt.id, undefined, ['none', 'unknown'])} />
                    <span className="text-sm">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Q05 */}
            <div className="border-t pt-6">
              <p className="font-semibold text-gray-800 mb-3 text-sm">5. Which situations tend to make work harder? (Select up to 2)</p>
              <div className="grid grid-cols-2 gap-2">
                {[{ id: 'interruptions', label: 'Interruptions' }, { id: 'meetings', label: 'Back-to-back meetings' }, { id: 'deadlines', label: 'Competing deadlines' }, { id: 'public_facing', label: 'Working with people' }, { id: 'unpredictable', label: 'Unexpected changes' }, { id: 'outside_work', label: 'Outside responsibilities' }, { id: 'none', label: 'None' }, { id: 'unknown', label: 'Not sure' }].map(opt => (
                  <button 
                    key={opt.id} onClick={() => toggleArray(demandTags, setDemandTags, opt.id, 2, ['none', 'unknown'])}
                    className={`p-2 text-xs rounded-lg border text-center ${demandTags.includes(opt.id as any) ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'bg-[#faf8f9] border-gray-200'}`}
                  >{opt.label}</button>
                ))}
              </div>
            </div>

            {/* Q06 */}
            <div className="border-t pt-6">
              <p className="font-semibold text-gray-800 mb-3 text-sm">6. How much time can you reasonably give a new strategy?</p>
              <div className="space-y-2">
                {[{ id: 'tiny', label: 'About a minute' }, { id: 'brief', label: 'About two minutes' }, { id: 'flexible', label: 'Up to five minutes' }].map(opt => (
                  <button 
                    key={opt.id} onClick={() => setEffortBudget(opt.id as any)}
                    className={`w-full p-3 text-sm rounded-lg border text-left ${effortBudget === opt.id ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'bg-[#faf8f9] border-gray-200'}`}
                  >{opt.label}</button>
                ))}
              </div>
            </div>

          </div>
          <button onClick={nextStep} className="w-full py-4 bg-[var(--primary)] text-white font-semibold rounded-lg hover:opacity-90 mt-6 transition-opacity">Next</button>
        </div>
      )}

      {step === 3 && (
        <div className="max-w-md mx-auto space-y-6 animate-in slide-in-from-right duration-300">
          <button onClick={prevStep} className="text-[var(--primary)] font-medium mb-4 block hover:underline">← Back</button>
          <h2 className="text-2xl font-serif font-bold text-[var(--primary)] text-center">Make it fit you</h2>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
            
            {/* Q07 */}
            <div>
              <p className="font-semibold text-gray-800 mb-3 text-sm">7. Which tools already help you?</p>
              <div className="space-y-2">
                {[
                  { id: 'written_list', label: 'Written list' },
                  { id: 'pause', label: 'Brief pauses' },
                  { id: 'task_order', label: 'Changing task order' },
                  { id: 'written_followup', label: 'Written follow-up' },
                  { id: 'support', label: 'Asking for help' },
                  { id: 'none', label: 'Nothing consistent yet' }
                ].map(opt => (
                  <label key={opt.id} className="flex items-center space-x-3 p-3 bg-[#faf8f9] rounded-lg cursor-pointer">
                    <input type="checkbox" checked={priorTools.includes(opt.id as any)} onChange={() => toggleArray(priorTools, setPriorTools, opt.id, undefined, ['none'])} />
                    <span className="text-sm">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Q08 */}
            <div className="border-t pt-6">
              <p className="font-semibold text-gray-800 mb-3 text-sm">8. What support would you like help preparing for?</p>
              <div className="space-y-2">
                {[
                  { id: 'work', label: 'Work conversation' },
                  { id: 'healthcare', label: 'Healthcare appointment' },
                  { id: 'both', label: 'Both' },
                  { id: 'private', label: 'Keep it private' },
                  { id: 'unknown', label: 'Not sure' }
                ].map(opt => (
                  <label key={opt.id} className="flex items-center space-x-3 p-3 bg-[#faf8f9] rounded-lg cursor-pointer">
                    <input type="checkbox" checked={supportPref.includes(opt.id)} onChange={() => toggleArray(supportPref, setSupportPref, opt.id, undefined, ['private', 'unknown'])} />
                    <span className="text-sm">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Q09 */}
            <div className="border-t pt-6">
              <p className="font-semibold text-gray-800 mb-3 text-sm">9. Which days would you usually use a workday plan?</p>
              <div className="grid grid-cols-4 gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <button 
                    key={day} onClick={() => toggleArray(schedule, setSchedule, day, undefined, ['variable'])}
                    className={`p-2 text-xs rounded-lg border text-center ${schedule.includes(day) ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'bg-[#faf8f9] border-gray-200'}`}
                  >{day}</button>
                ))}
                <button 
                  onClick={() => setSchedule(['variable'])}
                  className={`p-2 text-xs rounded-lg border text-center ${schedule.includes('variable') ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'bg-[#faf8f9] border-gray-200'}`}
                >Variable</button>
              </div>
            </div>

          </div>
          <button onClick={handleComplete} className="w-full py-4 bg-[var(--primary)] text-white font-semibold rounded-lg hover:opacity-90 mt-6 transition-opacity shadow-lg">Confirm My Profile</button>
        </div>
      )}
    </main>
  );
}
