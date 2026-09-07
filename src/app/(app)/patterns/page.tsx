'use client';

import { useAppStore } from '@/lib/store';
import { BarChart3, CalendarCheck, AlertTriangle } from 'lucide-react';
import { Domain } from '@/lib/types';

const domainLabels: Record<Domain | string, string> = {
  focus: 'Difficulty concentrating',
  energy: 'Low energy',
  recovery: 'Poor sleep',
  load: 'Overwhelmed / anxious / irritable',
  comfort: 'Temperature / physical discomfort'
};

export default function Patterns() {
  const { dailyEntries } = useAppStore();

  const entries = Object.values(dailyEntries).sort((a, b) => new Date(b.local_date).getTime() - new Date(a.local_date).getTime());
  const totalDays = entries.length;

  // Find patterns: any score of 3 multiple times
  const countsOfThree: Record<string, number> = {};
  entries.forEach(entry => {
    Object.entries(entry.interference || {}).forEach(([domain, score]) => {
      if (score === 3) {
        countsOfThree[domain] = (countsOfThree[domain] || 0) + 1;
      }
    });
  });

  const highPatterns = Object.entries(countsOfThree)
    .filter(([_, count]) => count > 1)
    .map(([domain, count]) => ({ domain, count }));

  return (
    <div className="p-6 max-w-md mx-auto space-y-6 pb-24 font-sans">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-serif font-bold text-[var(--eh-lilac)]">Patterns</h1>
        <p className="text-[var(--eh-lilac)]">A neutral look at your recorded check-ins and choices.</p>
      </div>

      <div className="bg-white p-5 rounded-[var(--eh-card-radius)] shadow-[var(--eh-shadow)] flex flex-col items-center justify-center text-center space-y-2">
        <CalendarCheck size={28} className="text-[var(--eh-mauve)]" />
        <h3 className="font-bold text-2xl text-[var(--eh-ink)]">{totalDays}</h3>
        <p className="text-xs font-bold uppercase text-[var(--eh-muted)] tracking-wider">Log Entries Recorded</p>
      </div>

      {highPatterns.length > 0 && (
        <div className="bg-[#e8dde5] p-5 rounded-[var(--eh-card-radius)] shadow-[var(--eh-shadow)] space-y-3">
          <div className="flex items-center gap-2 text-[var(--eh-plum)]">
            <AlertTriangle size={20} />
            <h3 className="font-bold">Noted Patterns</h3>
          </div>
          {highPatterns.map(({ domain, count }) => (
            <p key={domain} className="text-sm text-[var(--eh-ink)]">
              A score of 3 (Severely disruptive) was selected for <strong>{domainLabels[domain] || domain}</strong> on {count} different days.
            </p>
          ))}
        </div>
      )}

      <div className="space-y-4 mt-6">
        <h3 className="font-bold text-white uppercase text-xs tracking-wider">Recent Entries</h3>
        {entries.length === 0 ? (
          <p className="text-[var(--eh-lilac)] text-sm italic">No entries recorded yet.</p>
        ) : (
          entries.map(entry => (
            <div key={entry.local_date} className="bg-white p-4 rounded-[var(--eh-card-radius)] shadow-[var(--eh-shadow)] space-y-2">
              <p className="text-xs font-bold text-[var(--eh-plum)] uppercase tracking-wider">{new Date(entry.local_date).toLocaleDateString()}</p>
              
              {Object.keys(entry.interference || {}).length === 0 ? (
                <p className="text-sm text-[var(--eh-muted)]">No specific disruptions tracked.</p>
              ) : (
                <ul className="space-y-1">
                  {Object.entries(entry.interference || {}).map(([domain, score]) => (
                    <li key={domain} className="text-sm flex justify-between">
                      <span className="text-[var(--eh-ink)] font-medium">{domainLabels[domain] || domain}</span>
                      <span className="text-[var(--eh-muted)]">Score: {score}</span>
                    </li>
                  ))}
                </ul>
              )}
              {entry.note && (
                <div className="pt-2 mt-2 border-t border-[var(--eh-line)]">
                  <p className="text-xs font-bold text-[var(--eh-muted)] uppercase">Note</p>
                  <p className="text-sm text-[var(--eh-ink)] italic mt-1">{entry.note}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      
      <div className="pt-6">
        <p className="text-xs text-[var(--eh-lilac)] leading-relaxed italic text-center">
          This dashboard displays simple counts of what you've recorded. It does not calculate trends or determine if you are improving. 
        </p>
      </div>
    </div>
  );
}
