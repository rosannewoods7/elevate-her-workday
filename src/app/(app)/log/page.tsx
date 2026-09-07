'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Domain } from '@/lib/types';

export default function LogPage() {
  const [logState, setLogState] = useState<Record<string, string>>({});
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);
  const router = useRouter();
  const saveDailyEntry = useAppStore(state => state.saveDailyEntry);

  const domains: { id: Domain; label: string }[] = [
    { id: 'focus', label: 'Difficulty concentrating' },
    { id: 'energy', label: 'Low energy' },
    { id: 'recovery', label: 'Poor sleep' },
    { id: 'load', label: 'Overwhelmed / anxious / irritable' },
    { id: 'comfort', label: 'Temperature / physical discomfort' }
  ];

  const handleSave = () => {
    const interference: Partial<Record<Domain, number | null>> = {};
    Object.entries(logState).forEach(([k, v]) => {
      if (v) interference[k as Domain] = parseInt(v, 10);
    });

    const localDate = new Date().toISOString().split('T')[0];

    saveDailyEntry({
      local_date: localDate,
      concerns: [],
      interference,
      note,
      demand_tags: []
    });

    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      router.push('/patterns');
    }, 1000);
  };

  return (
    <div className="p-6 max-w-md mx-auto space-y-6 pb-24 font-sans">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-serif font-bold text-[var(--eh-lilac)]">Daily Concern Log</h1>
        <p className="text-[var(--eh-lilac)] text-sm">
          Optional: Record any disruptions today to help identify patterns over time. You only need to track what feels relevant.
        </p>
      </div>

      <div className="space-y-4">
        {domains.map(d => (
          <div key={d.id} className="bg-white p-4 rounded-[var(--eh-card-radius)] shadow-[var(--eh-shadow)]">
            <label className="block text-sm font-bold text-[var(--eh-ink)] mb-2">{d.label}</label>
            <select 
              value={logState[d.id] || ''} 
              onChange={e => setLogState({ ...logState, [d.id]: e.target.value })}
              className="w-full border border-[var(--eh-line)] rounded-[var(--eh-control-radius)] p-3 text-sm focus:outline-none bg-white text-[var(--eh-ink)]"
            >
              <option value="">-- No entry / Not an issue --</option>
              <option value="1">1 - Mildly noticeable</option>
              <option value="2">2 - Moderately disruptive</option>
              <option value="3">3 - Severely disruptive</option>
            </select>
          </div>
        ))}

        <div className="bg-white p-4 rounded-[var(--eh-card-radius)] shadow-[var(--eh-shadow)]">
          <label className="block text-sm font-bold text-[var(--eh-ink)] mb-2">Additional Notes (Optional)</label>
          <textarea 
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full border border-[var(--eh-line)] rounded-[var(--eh-control-radius)] p-3 h-20 text-sm focus:outline-none bg-white text-[var(--eh-ink)] resize-none"
            placeholder="Any specific triggers or context to remember..."
          />
        </div>
      </div>

      <div className="pt-6">
        <button 
          onClick={handleSave} 
          className="w-full py-4 bg-[var(--eh-plum)] text-white font-bold rounded-[var(--eh-control-radius)] hover:opacity-90 transition-opacity shadow-[var(--eh-shadow)]"
        >
          {saved ? 'Entry Saved!' : 'Save Entry'}
        </button>
      </div>
    </div>
  );
}
