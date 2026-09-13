'use client';

import { useAppStore } from '@/lib/store';
import { BarChart3, CalendarCheck, Activity, Brain } from 'lucide-react';
import { Domain, Approach } from '@/lib/types';
import { useMemo } from 'react';

const domainLabels: Record<Domain | string, string> = {
  focus: 'Difficulty concentrating',
  energy: 'Low energy',
  recovery: 'Poor sleep',
  load: 'Overwhelmed / anxious',
  comfort: 'Physical discomfort',
  support: 'Lack of support'
};

const demandLabels: Record<string, string> = {
  routine: 'Routine work',
  concentration: 'Deep focus',
  conversation: 'Meetings / Comms',
  presentation_decision: 'High stakes / Decisions',
  unpredictable: 'Unpredictable demands',
  unsure: 'Unsure'
};

const approachLabels: Record<Approach | string, string> = {
  usual: 'Usual',
  supported: 'Supported',
  simple: 'Simple'
};

const approachTextColors: Record<Approach | string, string> = {
  usual: 'text-[#2e7d32]', 
  supported: 'text-[#ed6c02]', 
  simple: 'text-[#9c27b0]' 
};

export default function Patterns() {
  const { dailyEntries, capacityChecks } = useAppStore();

  const entries = Object.values(dailyEntries).sort((a, b) => new Date(b.local_date).getTime() - new Date(a.local_date).getTime());
  const checksList = Object.entries(capacityChecks).map(([date, data]) => ({ date, ...(data as Record<string, unknown>) })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const totalLogs = entries.length;
  const totalChecks = checksList.length;

  // 1. Capacity Distribution
  const approachCounts = useMemo(() => {
    const counts = { usual: 0, supported: 0, simple: 0 };
    checksList.forEach(c => {
      if (c.selected_approach && counts[c.selected_approach as keyof typeof counts] !== undefined) {
        counts[c.selected_approach as keyof typeof counts]++;
      } else if (c.suggested_approach && counts[c.suggested_approach as keyof typeof counts] !== undefined) {
        counts[c.suggested_approach as keyof typeof counts]++;
      }
    });
    return counts;
  }, [checksList]);

  const mostFrequentApproach = useMemo(() => {
    if (totalChecks === 0) return null;
    let max = 0;
    let freq = 'usual';
    Object.entries(approachCounts).forEach(([a, c]) => {
      if (c > max) { max = c; freq = a; }
    });
    return freq as Approach;
  }, [approachCounts, totalChecks]);

  // 2. Common Interferences
  const interferenceCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    entries.forEach(e => {
      Object.keys(e.interference || {}).forEach(domain => {
        counts[domain] = (counts[domain] || 0) + 1;
      });
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [entries]);

  // 3. The "Why" Correlations (Low Capacity Days)
  const lowCapacityInsights = useMemo(() => {
    const demandsCount: Record<string, number> = {};
    let lowCapDays = 0;

    checksList.forEach(c => {
      const approach = c.selected_approach || c.suggested_approach;
      if (approach === 'simple' || approach === 'supported') {
        lowCapDays++;
        if (c.answers?.demands) {
          c.answers.demands.forEach((d: string) => {
            demandsCount[d] = (demandsCount[d] || 0) + 1;
          });
        }
      }
    });

    const topDemand = Object.entries(demandsCount).sort((a, b) => b[1] - a[1])[0];
    return {
      days: lowCapDays,
      topDemand: topDemand ? topDemand[0] : null,
      topDemandCount: topDemand ? topDemand[1] : 0
    };
  }, [checksList]);

  // 4. 7-Day Timeline
  const timeline = useMemo(() => {
    const today = new Date();
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      
      const check = capacityChecks[dateStr];
      const entry = dailyEntries[dateStr];
      
      let approach = 'none';
      if (check && (check.selected_approach || check.suggested_approach)) {
        approach = check.selected_approach || check.suggested_approach;
      }
      
      days.push({
        date: dateStr,
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        approach,
        hasLog: !!entry
      });
    }
    return days;
  }, [capacityChecks, dailyEntries]);


  // Helper for progress bars
  const total = approachCounts.usual + approachCounts.supported + approachCounts.simple || 1;
  const usualPct = Math.round((approachCounts.usual / total) * 100);
  const supportedPct = Math.round((approachCounts.supported / total) * 100);
  const simplePct = Math.round((approachCounts.simple / total) * 100);

  return (
    <div className="p-6 max-w-md mx-auto space-y-8 pb-24 font-sans">
      <div className="text-center space-y-2 mb-4">
        <h1 className="text-3xl font-serif font-bold text-[var(--eh-lilac)]">Patterns</h1>
        <p className="text-[var(--eh-lilac)] text-sm">A neutral look at your capacity and choices over time.</p>
      </div>

      {totalChecks === 0 && totalLogs === 0 ? (
        <div className="bg-white p-8 rounded-[var(--eh-card-radius)] shadow-[var(--eh-shadow)] text-center space-y-4">
          <BarChart3 className="mx-auto text-[var(--eh-mauve)] opacity-50" size={48} />
          <h3 className="font-bold text-xl text-[var(--eh-ink)]">No Data Yet</h3>
          <p className="text-[var(--eh-muted)] text-sm">Complete your daily Capacity Check or Log an entry to start seeing your patterns here.</p>
        </div>
      ) : (
        <>
          {/* Summary Cards Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-[var(--eh-card-radius)] shadow-[var(--eh-shadow)] flex flex-col justify-between h-[100px]">
              <div className="flex justify-between items-start mb-2">
                <CalendarCheck size={20} className="text-[var(--eh-mauve)]" />
                <span className="text-2xl font-bold text-[var(--eh-ink)]">{totalChecks}</span>
              </div>
              <p className="text-[10px] font-bold uppercase text-[var(--eh-muted)] tracking-wider">Days Tracked</p>
            </div>
            
            <div className="bg-white p-4 rounded-[var(--eh-card-radius)] shadow-[var(--eh-shadow)] flex flex-col justify-between h-[100px]">
              <div className="flex justify-between items-start mb-2">
                <Activity size={20} className={mostFrequentApproach ? approachTextColors[mostFrequentApproach] : 'text-[var(--eh-mauve)]'} />
                <span className="text-sm font-bold text-[var(--eh-ink)] text-right leading-tight">
                  {mostFrequentApproach ? approachLabels[mostFrequentApproach] : 'None'}
                </span>
              </div>
              <p className="text-[10px] font-bold uppercase text-[var(--eh-muted)] tracking-wider">Most Common<br/>Approach</p>
            </div>
          </div>

          {/* 7-Day Timeline */}
          <div className="bg-white p-5 rounded-[var(--eh-card-radius)] shadow-[var(--eh-shadow)] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[var(--eh-plum)]">Past 7 Days</h3>
              <span className="text-xs font-bold text-[var(--eh-muted)] uppercase tracking-wider">Timeline</span>
            </div>
            <div className="flex justify-between items-end gap-1">
              {timeline.map((day, i) => (
                <div key={i} className="flex flex-col items-center gap-2 flex-1">
                  {day.hasLog ? (
                     <div className="w-1.5 h-1.5 rounded-full bg-[var(--eh-mauve)]" title="Log recorded" />
                  ) : (
                     <div className="w-1.5 h-1.5 rounded-full bg-transparent" />
                  )}
                  
                  <div 
                    className={`w-full h-8 rounded-md ${
                      day.approach === 'simple' ? 'bg-[#9c27b0]' :
                      day.approach === 'supported' ? 'bg-[#ed6c02]' :
                      day.approach === 'usual' ? 'bg-[#2e7d32]' :
                      'bg-gray-100'
                    }`}
                    title={day.approach !== 'none' ? approachLabels[day.approach] : 'No check-in'}
                  />
                  <span className="text-[10px] text-[var(--eh-muted)] uppercase font-bold">{day.dayName[0]}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-4 pt-2 border-t border-[var(--eh-line)]">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#2e7d32]"></div><span className="text-[10px] text-[var(--eh-muted)] uppercase font-bold">Usual</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#ed6c02]"></div><span className="text-[10px] text-[var(--eh-muted)] uppercase font-bold">Supported</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#9c27b0]"></div><span className="text-[10px] text-[var(--eh-muted)] uppercase font-bold">Simple</span></div>
            </div>
          </div>

          {/* Capacity Distribution */}
          <div className="bg-white p-5 rounded-[var(--eh-card-radius)] shadow-[var(--eh-shadow)] space-y-4">
            <h3 className="font-bold text-[var(--eh-plum)]">Capacity Distribution</h3>
            <p className="text-sm text-[var(--eh-ink)]">Out of your last {totalChecks} tracked days, here is how often you needed different approaches.</p>
            
            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-[var(--eh-ink)]">
                  <span>Usual</span>
                  <span>{usualPct}% ({approachCounts.usual})</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-[#2e7d32] h-full" style={{ width: `${usualPct}%` }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-[var(--eh-ink)]">
                  <span>Supported</span>
                  <span>{supportedPct}% ({approachCounts.supported})</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-[#ed6c02] h-full" style={{ width: `${supportedPct}%` }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-[var(--eh-ink)]">
                  <span>Simple</span>
                  <span>{simplePct}% ({approachCounts.simple})</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-[#9c27b0] h-full" style={{ width: `${simplePct}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* The Why (Correlations) */}
          {lowCapacityInsights.days > 0 && lowCapacityInsights.topDemand && (
            <div className="bg-[#e8dde5] p-5 rounded-[var(--eh-card-radius)] shadow-[var(--eh-shadow)] space-y-3">
              <div className="flex items-center gap-2 text-[var(--eh-plum)]">
                <Brain size={20} />
                <h3 className="font-bold">Noted Pattern</h3>
              </div>
              <p className="text-sm text-[var(--eh-ink)]">
                On the {lowCapacityInsights.days} days you needed a <strong>Supported</strong> or <strong>Simple</strong> approach, the most frequent work demand you faced was <strong>{demandLabels[lowCapacityInsights.topDemand] || lowCapacityInsights.topDemand}</strong> ({lowCapacityInsights.topDemandCount} times).
              </p>
            </div>
          )}

          {/* Common Interferences */}
          {interferenceCounts.length > 0 && (
            <div className="bg-white p-5 rounded-[var(--eh-card-radius)] shadow-[var(--eh-shadow)] space-y-4">
              <h3 className="font-bold text-[var(--eh-plum)]">Most Frequent Disruptions</h3>
              <p className="text-sm text-[var(--eh-muted)]">Symptoms or factors you have actively logged as interfering with your day.</p>
              
              <div className="space-y-3 pt-2">
                {interferenceCounts.slice(0, 3).map(([domain, count]) => {
                  const maxCount = interferenceCounts[0][1];
                  const pct = Math.max(10, Math.round((count / maxCount) * 100)); // min 10% for visibility
                  
                  return (
                    <div key={domain} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-[var(--eh-ink)]">
                        <span>{domainLabels[domain] || domain}</span>
                        <span>{count} days</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div className="bg-[var(--eh-mauve)] h-full" style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          <div className="pt-4 text-center">
             <p className="text-[10px] text-[var(--eh-lilac)] uppercase tracking-wider font-bold">End of Analytics</p>
          </div>
        </>
      )}
    </div>
  );
}
