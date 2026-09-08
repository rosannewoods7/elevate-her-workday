'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { briefTemplates } from '@/lib/brief-templates';
import { useAppStore } from '@/lib/store';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PrepareBuilder() {
  const router = useRouter();
  const { savePreparationBrief } = useAppStore();
  
  const [step, setStep] = useState(1);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [selectedOutcomeId, setSelectedOutcomeId] = useState<string | null>(null);
  const [selectedConcern, setSelectedConcern] = useState<string | null>(null);
  
  const template = briefTemplates.find(t => t.id === selectedTemplateId);
  
  const handleCreate = () => {
    if (!template || !selectedOutcomeId) return;
    
    const outcome = template.outcomes.find(o => o.id === selectedOutcomeId);
    if (!outcome) return;
    
    let finalIntendedOutcome = outcome.intended_outcome;
    if (selectedConcern && selectedConcern !== 'None') {
      finalIntendedOutcome += ` Even if I'm experiencing ${selectedConcern.toLowerCase()}.`;
    }
    
    const newBrief = {
      id: `brief-${Date.now()}`,
      scenario_id: template.id,
      user_title: `Preparing for: ${template.title}`,
      state: 'draft',
      current_revision: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      
      // We store the latest revision data right on the object for Zustand simplicity
      intended_outcome: finalIntendedOutcome,
      opening_sentence: template.opening_sentence,
      practical_preparation: template.practical_preparation,
      fallback: template.fallback,
      leave_with: template.leave_with,
      concern: selectedConcern === 'None' ? null : selectedConcern,
      outcome_id: outcome.id,
      outcome_text: outcome.text,
      provenance: 'template'
    };
    
    savePreparationBrief(newBrief);
    router.push(`/prepare/${newBrief.id}`);
  };

  return (
    <div className="p-6 max-w-md mx-auto font-sans pb-32">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/support" className="p-2 -ml-2 rounded-full hover:bg-[var(--eh-canvas)] text-[var(--eh-plum)]">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-serif font-bold text-[var(--eh-lilac)]">Prepare me for...</h1>
      </div>
      
      <div className="bg-white p-6 rounded-[var(--eh-card-radius)] shadow-[var(--eh-shadow)] space-y-6 relative overflow-hidden">
        {/* Progress bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-100">
          <div className="h-full bg-[var(--eh-plum)] transition-all duration-300" style={{ width: `${(step / 3) * 100}%` }} />
        </div>
        
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <p className="font-bold text-[var(--eh-ink)] text-lg">What are you preparing for?</p>
            <div className="space-y-2">
              {briefTemplates.map(t => (
                <button
                  key={t.id}
                  onClick={() => { setSelectedTemplateId(t.id); setStep(2); }}
                  className="w-full text-left p-4 rounded-[var(--eh-control-radius)] border border-gray-200 hover:border-[var(--eh-plum)] hover:bg-[var(--eh-canvas)] transition-colors flex items-center justify-between group"
                >
                  <span className="font-medium text-[var(--eh-ink)]">{t.title}</span>
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-[var(--eh-plum)]" />
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && template && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <button onClick={() => setStep(1)} className="text-sm text-[var(--eh-plum)] hover:underline">&larr; Back</button>
            <p className="font-bold text-[var(--eh-ink)] text-lg">What is your main goal for this?</p>
            <div className="space-y-2">
              {template.outcomes.map(o => (
                <button
                  key={o.id}
                  onClick={() => { setSelectedOutcomeId(o.id); setStep(3); }}
                  className="w-full text-left p-4 rounded-[var(--eh-control-radius)] border border-gray-200 hover:border-[var(--eh-plum)] hover:bg-[var(--eh-canvas)] transition-colors flex items-center justify-between group"
                >
                  <span className="font-medium text-[var(--eh-ink)]">{o.text}</span>
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-[var(--eh-plum)]" />
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && template && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <button onClick={() => setStep(2)} className="text-sm text-[var(--eh-plum)] hover:underline">&larr; Back</button>
            <p className="font-bold text-[var(--eh-ink)] text-lg">Is there a specific symptom or concern you want to manage during this?</p>
            <div className="space-y-2">
              {[
                'Difficulty concentrating',
                'Low energy or fatigue',
                'Feeling overwhelmed',
                'Anxiety or physical tension',
                'Physical discomfort',
                'None'
              ].map(opt => (
                <button
                  key={opt}
                  onClick={() => { setSelectedConcern(opt); }}
                  className={`w-full text-left p-4 rounded-[var(--eh-control-radius)] border transition-colors flex items-center justify-between group
                    ${selectedConcern === opt ? 'border-[var(--eh-plum)] bg-[var(--eh-canvas)]' : 'border-gray-200 hover:border-[var(--eh-plum)]'}
                  `}
                >
                  <span className="font-medium text-[var(--eh-ink)]">{opt}</span>
                </button>
              ))}
            </div>
            
            <button 
              onClick={handleCreate}
              disabled={!selectedConcern}
              className="w-full mt-6 bg-[var(--eh-plum)] disabled:opacity-50 text-white font-bold py-3 px-4 rounded-[var(--eh-control-radius)] transition-colors flex items-center justify-center gap-2"
            >
              Generate Brief
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
