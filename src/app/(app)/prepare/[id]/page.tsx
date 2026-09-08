'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { DiscreetText } from '@/components/DiscreetText';
import { ArrowLeft, Save, Edit3, Eye, Download } from 'lucide-react';
import Link from 'next/link';
import { useDiscreet } from '@/components/DiscreetProvider';

export default function PrepareBriefView() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { preparationBriefs, savePreparationBrief, savePlaybookItem } = useAppStore();
  const { discreetModeEnabled } = useDiscreet();
  
  const [brief, setBrief] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  
  useEffect(() => {
    if (preparationBriefs[id]) {
      setBrief(JSON.parse(JSON.stringify(preparationBriefs[id])));
    }
  }, [id, preparationBriefs]);

  if (!brief) return <div className="p-6">Loading...</div>;

  const handleSave = () => {
    savePreparationBrief(brief);
    setIsEditing(false);
  };

  const handleSaveToPlaybook = () => {
    const playbookItem = {
      id: `pb-${Date.now()}`,
      type: 'preparation brief',
      source_id: brief.id,
      user_title: brief.user_title,
      pinned: false,
      saved_to_try: false,
      created_at: new Date().toISOString()
    };
    savePlaybookItem(playbookItem);
    alert('Saved to My Playbook!');
  };

  const handleChange = (field: string, value: string) => {
    setBrief((prev: any) => ({ ...prev, [field]: value }));
  };

  if (focusMode) {
    return (
      <div className="min-h-screen bg-white p-6 md:p-12 pb-32">
        <div className="max-w-2xl mx-auto space-y-8">
          <button onClick={() => setFocusMode(false)} className="text-[var(--eh-plum)] text-sm flex items-center gap-1 hover:underline print:hidden">
            <Eye size={16} /> Exit Focus View
          </button>
          
          <h1 className="text-3xl font-serif font-bold text-[var(--eh-plum)] mb-8">
            <DiscreetText fallbackLabel="Preparation Brief" forceShow={!discreetModeEnabled}>{brief.user_title}</DiscreetText>
          </h1>

          <div className="space-y-8 text-lg text-[var(--eh-ink)] leading-relaxed">
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--eh-muted)] mb-2">My Goal</h2>
              <p><DiscreetText fallbackLabel="My personal goal for this situation">{brief.intended_outcome}</DiscreetText></p>
            </section>
            
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--eh-muted)] mb-2">Practical Preparation</h2>
              <div className="whitespace-pre-wrap"><DiscreetText fallbackLabel="My preparation steps">{brief.practical_preparation}</DiscreetText></div>
            </section>
            
            {brief.opening_sentence && brief.opening_sentence !== '(Not needed for solo work—focus on the first step instead)' && (
              <section>
                <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--eh-muted)] mb-2">Opening Sentence</h2>
                <p className="font-serif text-xl italic"><DiscreetText fallbackLabel="Opening words">{brief.opening_sentence}</DiscreetText></p>
              </section>
            )}
            
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--eh-muted)] mb-2">If things get tough (Fallback)</h2>
              <p><DiscreetText fallbackLabel="My backup plan">{brief.fallback}</DiscreetText></p>
            </section>
            
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--eh-muted)] mb-2">What I need to leave with</h2>
              <p><DiscreetText fallbackLabel="My exit condition">{brief.leave_with}</DiscreetText></p>
            </section>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto font-sans pb-32 space-y-6">
      <div className="flex items-center justify-between mb-2">
        <Link href="/support" className="p-2 -ml-2 rounded-full hover:bg-[var(--eh-canvas)] text-[var(--eh-plum)]">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex gap-2">
          <button onClick={() => setFocusMode(true)} className="p-2 bg-white rounded-full shadow-sm text-[var(--eh-plum)] hover:bg-[var(--eh-canvas)]" title="Focus View">
            <Eye size={18} />
          </button>
          <button onClick={handleSaveToPlaybook} className="p-2 bg-white rounded-full shadow-sm text-[var(--eh-plum)] hover:bg-[var(--eh-canvas)]" title="Save to Playbook">
            <Save size={18} />
          </button>
        </div>
      </div>
      
      {isEditing ? (
        <input 
          type="text" 
          value={brief.user_title}
          onChange={(e) => handleChange('user_title', e.target.value)}
          className="w-full text-2xl font-serif font-bold text-[var(--eh-lilac)] bg-transparent border-b border-[var(--eh-plum)] focus:outline-none pb-1"
        />
      ) : (
        <h1 className="text-2xl font-serif font-bold text-[var(--eh-lilac)] flex items-center justify-between group cursor-pointer" onClick={() => setIsEditing(true)}>
          <DiscreetText fallbackLabel="Preparation Brief">{brief.user_title}</DiscreetText>
          <Edit3 size={16} className="text-transparent group-hover:text-[var(--eh-muted)]" />
        </h1>
      )}
      
      <div className="space-y-4">
        <Section title="My Goal" field="intended_outcome" value={brief.intended_outcome} isEditing={isEditing} onChange={handleChange} />
        <Section title="Practical Preparation" field="practical_preparation" value={brief.practical_preparation} isEditing={isEditing} onChange={handleChange} multiline />
        <Section title="Opening Sentence" field="opening_sentence" value={brief.opening_sentence} isEditing={isEditing} onChange={handleChange} />
        <Section title="If things get tough (Fallback)" field="fallback" value={brief.fallback} isEditing={isEditing} onChange={handleChange} />
        <Section title="What I need to leave with" field="leave_with" value={brief.leave_with} isEditing={isEditing} onChange={handleChange} />
      </div>

      <div className="pt-4 border-t border-[var(--eh-line)]">
        {isEditing ? (
          <button onClick={handleSave} className="w-full bg-[var(--eh-plum)] text-white font-bold py-3 px-4 rounded-[var(--eh-control-radius)] hover:bg-[#3a103b] transition-colors">
            Save Changes
          </button>
        ) : (
          <button onClick={() => setIsEditing(true)} className="w-full bg-white text-[var(--eh-plum)] border border-[var(--eh-plum)] font-bold py-3 px-4 rounded-[var(--eh-control-radius)] transition-colors text-sm flex justify-center items-center gap-2">
            <Edit3 size={16} /> Edit Brief
          </button>
        )}
      </div>
    </div>
  );
}

function Section({ title, field, value, isEditing, onChange, multiline = false }: any) {
  return (
    <div className="bg-white p-4 rounded-[var(--eh-card-radius)] shadow-sm border border-gray-100">
      <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--eh-muted)] mb-2">{title}</h3>
      {isEditing ? (
        multiline ? (
          <textarea 
            value={value}
            onChange={(e) => onChange(field, e.target.value)}
            className="w-full text-sm text-[var(--eh-ink)] p-2 border border-[var(--eh-line)] rounded focus:outline-none focus:border-[var(--eh-plum)] min-h-[100px]"
          />
        ) : (
          <input 
            type="text"
            value={value}
            onChange={(e) => onChange(field, e.target.value)}
            className="w-full text-sm text-[var(--eh-ink)] p-2 border border-[var(--eh-line)] rounded focus:outline-none focus:border-[var(--eh-plum)]"
          />
        )
      ) : (
        <div className="text-sm text-[var(--eh-ink)] whitespace-pre-wrap">
          <DiscreetText fallbackLabel={`Hidden ${title.toLowerCase()}`}>{value}</DiscreetText>
        </div>
      )}
    </div>
  );
}
