'use client';

import React, { useState } from 'react';
import { CapacityAnswers, SleepAnswer, EnergyAnswer, ClarityAnswer, SettledAnswer, Demand } from '@/lib/types';
import { routeCapacity, formatReason } from '@/lib/capacity';
import { useAppStore } from '@/lib/store';
import { Check, ChevronRight } from 'lucide-react';

interface DailyCapacityCheckProps {
  onComplete: (approach: any, focus: string) => void;
  onSkip: () => void;
}

export function DailyCapacityCheck({ onComplete, onSkip }: DailyCapacityCheckProps) {
  const { profile, saveCapacityCheck } = useAppStore();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<CapacityAnswers>({
    sleep: null,
    energy: null,
    clarity: null,
    settled: null,
    demands: null,
  });

  const [result, setResult] = useState<any>(null);

  const handleNext = () => setStep(prev => prev + 1);

  const handleSubmit = () => {
    const res = routeCapacity(answers, profile?.confirmed_primary || 'general');
    setResult(res);
  };

  const confirmApproach = (overrideApproach?: 'usual' | 'supported' | 'simple') => {
    const finalApproach = overrideApproach || result.approach;
    
    // Save to store for persistence testing
    const d = new Date();
    const localDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    
    saveCapacityCheck(localDate, {
      answers,
      suggested_approach: result.approach,
      selected_approach: finalApproach,
      suggested_focus: result.focus,
      reason_keys: result.reason_keys
    });
    
    onComplete(finalApproach, result.focus);
  };

  if (result) {
    return (
      <div className="p-6 max-w-md mx-auto space-y-6 font-sans pb-32">
        <h1 className="text-2xl font-serif font-bold text-[var(--eh-lilac)] mb-6">Today's Approach</h1>
        
        <div className="bg-white p-6 rounded-[var(--eh-card-radius)] shadow-[var(--eh-shadow)] space-y-4">
          <p className="font-bold text-[var(--eh-plum)]">
            Based on your check-in, we recommend a <span className="uppercase">{result.approach}</span> approach today.
          </p>
          
          {result.reason_keys.length > 0 && (
            <div className="space-y-1">
              <p className="text-sm font-bold text-[var(--eh-muted)] uppercase tracking-wider">Factors</p>
              <ul className="text-sm text-[var(--eh-ink)] list-disc pl-4 space-y-1">
                {result.reason_keys.map((k: string) => (
                  <li key={k}>{formatReason(k)}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="pt-4 border-t border-[var(--eh-line)] space-y-3">
            <button 
              onClick={() => confirmApproach()}
              className="w-full bg-[var(--eh-plum)] text-white font-bold py-3 px-4 rounded-[var(--eh-control-radius)] transition-colors"
            >
              Start {result.approach} plan
            </button>
            
            <button 
              onClick={() => confirmApproach('usual')}
              className="w-full bg-white text-[var(--eh-plum)] border border-[var(--eh-plum)] font-bold py-3 px-4 rounded-[var(--eh-control-radius)] transition-colors text-sm"
            >
              Use my usual plan instead
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto space-y-6 font-sans pb-32">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-serif font-bold text-[var(--eh-lilac)]">Before you plan your day...</h1>
        <button onClick={onSkip} className="text-xs font-bold text-white uppercase opacity-80 hover:opacity-100 transition-opacity">
          Skip
        </button>
      </div>

      <div className="bg-white p-6 rounded-[var(--eh-card-radius)] shadow-[var(--eh-shadow)] space-y-6 relative overflow-hidden">
        {/* Progress bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-100">
          <div className="h-full bg-[var(--eh-plum)] transition-all duration-300" style={{ width: `${(step / 5) * 100}%` }} />
        </div>
        
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <p className="font-bold text-[var(--eh-ink)] text-lg">1. How restorative was your sleep?</p>
            <div className="space-y-2">
              {[
                { id: 'restorative', label: 'Restorative' },
                { id: 'somewhat_restorative', label: 'Somewhat restorative' },
                { id: 'not_restorative', label: 'Not restorative' },
                { id: 'unsure', label: 'Unsure' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => { setAnswers({...answers, sleep: opt.id as SleepAnswer}); handleNext(); }}
                  className="w-full text-left p-4 rounded-[var(--eh-control-radius)] border border-gray-200 hover:border-[var(--eh-plum)] hover:bg-[var(--eh-canvas)] transition-colors flex items-center justify-between group"
                >
                  <span className="font-medium text-[var(--eh-ink)]">{opt.label}</span>
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-[var(--eh-plum)]" />
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <p className="font-bold text-[var(--eh-ink)] text-lg">2. How much energy do you have?</p>
            <div className="space-y-2">
              {[
                { id: 'plenty', label: 'Plenty' },
                { id: 'some', label: 'Some' },
                { id: 'very_little', label: 'Very little' },
                { id: 'unsure', label: 'Unsure' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => { setAnswers({...answers, energy: opt.id as EnergyAnswer}); handleNext(); }}
                  className="w-full text-left p-4 rounded-[var(--eh-control-radius)] border border-gray-200 hover:border-[var(--eh-plum)] hover:bg-[var(--eh-canvas)] transition-colors flex items-center justify-between group"
                >
                  <span className="font-medium text-[var(--eh-ink)]">{opt.label}</span>
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-[var(--eh-plum)]" />
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <p className="font-bold text-[var(--eh-ink)] text-lg">3. How clear is your thinking?</p>
            <div className="space-y-2">
              {[
                { id: 'clear', label: 'Clear' },
                { id: 'somewhat_scattered', label: 'Somewhat scattered' },
                { id: 'difficult_to_concentrate', label: 'Difficult to concentrate' },
                { id: 'unsure', label: 'Unsure' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => { setAnswers({...answers, clarity: opt.id as ClarityAnswer}); handleNext(); }}
                  className="w-full text-left p-4 rounded-[var(--eh-control-radius)] border border-gray-200 hover:border-[var(--eh-plum)] hover:bg-[var(--eh-canvas)] transition-colors flex items-center justify-between group"
                >
                  <span className="font-medium text-[var(--eh-ink)]">{opt.label}</span>
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-[var(--eh-plum)]" />
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <p className="font-bold text-[var(--eh-ink)] text-lg">4. How settled do you feel?</p>
            <div className="space-y-2">
              {[
                { id: 'settled', label: 'Settled' },
                { id: 'some_tension', label: 'Some tension' },
                { id: 'overwhelmed', label: 'Overwhelmed' },
                { id: 'unsure', label: 'Unsure' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => { setAnswers({...answers, settled: opt.id as SettledAnswer}); handleNext(); }}
                  className="w-full text-left p-4 rounded-[var(--eh-control-radius)] border border-gray-200 hover:border-[var(--eh-plum)] hover:bg-[var(--eh-canvas)] transition-colors flex items-center justify-between group"
                >
                  <span className="font-medium text-[var(--eh-ink)]">{opt.label}</span>
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-[var(--eh-plum)]" />
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <p className="font-bold text-[var(--eh-ink)] text-lg">5. What demands are ahead today?</p>
            <p className="text-sm text-[var(--eh-muted)] -mt-2">Select all that apply.</p>
            <div className="space-y-2">
              {[
                { id: 'routine', label: 'Routine tasks' },
                { id: 'concentration', label: 'Sustained concentration' },
                { id: 'conversation', label: 'Difficult conversation' },
                { id: 'presentation_decision', label: 'Presentation or major decision' },
                { id: 'unpredictable', label: 'Unpredictable demands' }
              ].map(opt => {
                const isSelected = answers.demands?.includes(opt.id as Demand) || false;
                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      const current = answers.demands || [];
                      let next;
                      if (isSelected) {
                        next = current.filter(x => x !== opt.id);
                      } else {
                        next = [...current, opt.id as Demand];
                      }
                      setAnswers({...answers, demands: next.length > 0 ? next : null});
                    }}
                    className={`w-full text-left p-4 rounded-[var(--eh-control-radius)] border transition-colors flex items-center gap-3
                      ${isSelected ? 'border-[var(--eh-plum)] bg-[var(--eh-canvas)]' : 'border-gray-200 hover:border-[var(--eh-plum)]'}
                    `}
                  >
                    <div className={`w-5 h-5 rounded border flex items-center justify-center
                      ${isSelected ? 'bg-[var(--eh-plum)] border-[var(--eh-plum)] text-white' : 'border-gray-300'}
                    `}>
                      {isSelected && <Check size={14} />}
                    </div>
                    <span className="font-medium text-[var(--eh-ink)]">{opt.label}</span>
                  </button>
                );
              })}
            </div>
            <button 
              onClick={handleSubmit}
              className="w-full mt-6 bg-[var(--eh-plum)] text-white font-bold py-3 px-4 rounded-[var(--eh-control-radius)] transition-colors flex items-center justify-center gap-2"
            >
              See Today's Approach <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
