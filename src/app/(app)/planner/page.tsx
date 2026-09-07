'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { DownloadPlanButton } from '@/components/PlanPDF';

export default function Planner() {
  const { profile, planCycle, dailyPlans, resetDemo } = useAppStore();
  const [goal, setGoal] = useState('');
  const [activePhase, setActivePhase] = useState<number>(1);
  const [hasStarted, setHasStarted] = useState(!!planCycle);

  // We find the most recent plan for the fallback defaults
  const recentPlan = Object.values(dailyPlans).pop();

  const handleStart = () => {
    // In a real app we'd dispatch to store
    setHasStarted(true);
  };

  if (!hasStarted) {
    return (
      <div className="p-6 max-w-md mx-auto space-y-6 pb-24 font-sans">
        <h1 className="text-3xl font-serif font-bold text-[var(--eh-lilac)] text-center">My 30 Days</h1>
        <p className="text-[var(--eh-lilac)] text-center">
          Commit to a 30-day structured plan. We'll break it into four manageable phases without daily tracking pressure.
        </p>
        
        <div className="bg-white p-6 rounded-[var(--eh-card-radius)] shadow-[var(--eh-shadow)] space-y-4">
          <label className="block text-sm font-bold text-[var(--eh-ink)]">Optional Goal</label>
          <p className="text-xs text-[var(--eh-muted)] mb-2">At the end of this month, what would feel more manageable?</p>
          <select
            value={goal.startsWith('Other: ') ? 'Other' : goal}
            onChange={(e) => {
              if (e.target.value === 'Other') {
                setGoal('Other: ');
              } else {
                setGoal(e.target.value);
              }
            }}
            className="w-full border border-[var(--eh-line)] rounded-[var(--eh-control-radius)] p-3 focus:outline-none text-sm bg-white text-[var(--eh-ink)]"
          >
            <option value="">Select a goal...</option>
            <option value="I want to end my workday with enough energy for my family and evening routine.">End my workday with enough energy for my evening</option>
            <option value="I want to feel less overwhelmed by competing demands and interruptions.">Feel less overwhelmed by competing demands</option>
            <option value="I want to regain my focus and feel more organized at my desk.">Regain my focus and feel more organized</option>
            <option value="I want to find a sustainable way to manage physical discomfort at work.">Find a sustainable way to manage physical discomfort</option>
            <option value="I want to confidently ask for the structural support I need.">Confidently ask for the structural support I need</option>
            <option value="Other">Other (Write my own)</option>
          </select>

          {goal.startsWith('Other: ') && (
            <textarea 
              value={goal.replace('Other: ', '')}
              onChange={(e) => setGoal('Other: ' + e.target.value)}
              className="w-full border border-[var(--eh-line)] rounded-[var(--eh-control-radius)] p-3 h-20 focus:outline-none text-sm mt-3 text-[var(--eh-ink)]"
              placeholder="Write your custom goal here..."
              maxLength={160}
            />
          )}

          <button 
            onClick={handleStart}
            className="w-full py-4 bg-[var(--primary)] text-white font-bold rounded-lg hover:opacity-90 transition-opacity mt-4 shadow-sm"
          >
            Start My 30 Days
          </button>
        </div>
      </div>
    );
  }

  const phases = [
    { num: 1, title: 'Phase 1', timeframe: 'Week 1 (Days 1-7)', focus: 'Make the plan small' },
    { num: 2, title: 'Phase 2', timeframe: 'Week 2 (Days 8-14)', focus: 'Prepare for disruption' },
    { num: 3, title: 'Phase 3', timeframe: 'Week 3 (Days 15-21)', focus: 'Consider useful support' },
    { num: 4, title: 'Phase 4', timeframe: 'Week 4 (Days 22-30)', focus: 'Keep what earns its place' },
  ];

  const renderPhase1 = () => (
    <div className="space-y-6">
      <div className="bg-[#e8dde5] p-4 rounded-lg">
        <h3 className="font-bold text-[var(--primary)] text-lg">Goal for Week 1</h3>
        <p className="text-gray-800 text-sm mt-1">Try your two selected actions in situations where they naturally fit. You don't need to force it every day—just notice if it helps.</p>
      </div>
      
      <div className="bg-white p-5 rounded-xl border border-gray-100 space-y-5 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase text-gray-500">My Priority Focus</span>
          <p className="font-serif text-lg text-[var(--primary)] capitalize">{profile?.confirmed_primary || 'General Balance'}</p>
        </div>
        
        <div className="space-y-3">
          <div className="p-4 border border-gray-200 rounded-lg">
            <span className="text-xs font-bold uppercase text-gray-500">Action 1 to Try</span>
            <p className="font-medium text-gray-800">{recentPlan?.actions[0]?.title || 'Give the task a starting point'}</p>
            <input type="text" placeholder="When might I use this? (e.g. 9am meetings)" className="mt-2 w-full text-sm border-b border-gray-300 focus:outline-none focus:border-[var(--primary)] pb-1" />
          </div>
          
          {recentPlan?.actions[1] && (
            <div className="p-4 border border-gray-200 rounded-lg">
              <span className="text-xs font-bold uppercase text-gray-500">Action 2 to Try</span>
              <p className="font-medium text-gray-800">{recentPlan?.actions[1]?.title}</p>
              <input type="text" placeholder="When might I use this?" className="mt-2 w-full text-sm border-b border-gray-300 focus:outline-none focus:border-[var(--primary)] pb-1" />
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-gray-100">
          <h4 className="font-bold text-gray-800 mb-2">End of Week 1 Review</h4>
          <p className="text-sm text-gray-600 mb-3">Rate how manageable work felt this week overall.</p>
          <div className="flex justify-between max-w-[200px]">
             {[0, 1, 2, 3, 4].map(val => (
               <label key={val} className="flex flex-col items-center cursor-pointer">
                 <input type="radio" name="rating-p1" />
                 <span className="text-sm mt-1">{val}</span>
               </label>
             ))}
          </div>
        </div>
      </div>
      <button onClick={() => setActivePhase(2)} className="w-full py-4 border-2 border-[var(--primary)] text-[var(--primary)] font-bold rounded-lg hover:bg-[#e8dde5] transition-colors">
        Move to Week 2
      </button>
    </div>
  );

  const renderPhase2 = () => (
    <div className="space-y-6">
      <div className="bg-[#e8dde5] p-4 rounded-[var(--eh-control-radius)]">
        <h3 className="font-bold text-[var(--eh-plum)] text-lg">Phase 2 — Prepare for one disruption</h3>
        <p className="text-[var(--eh-ink)] text-sm mt-1">Choose one situation that may make work harder. Prepare a response you could realistically use.</p>
      </div>

      <div className="bg-white p-5 rounded-[var(--eh-card-radius)] shadow-[var(--eh-shadow)] space-y-5">
        <div>
          <label className="text-sm font-bold text-[var(--eh-ink)] block">Possible disruption</label>
          <input type="text" className="mt-1 w-full border border-[var(--eh-line)] rounded-[var(--eh-control-radius)] p-3 focus:outline-none text-sm" placeholder="E.g., Meetings, deadlines, interruptions..." />
        </div>
        
        <div>
          <label className="text-sm font-bold text-[var(--eh-ink)] block">If it happens, I will...</label>
          <textarea className="mt-1 w-full border border-[var(--eh-line)] rounded-[var(--eh-control-radius)] p-3 focus:outline-none text-sm h-20 resize-none" placeholder={recentPlan?.fallback || "If the day changes..."} />
        </div>

        <div>
          <label className="text-sm font-bold text-[var(--eh-ink)] block">If that is not possible, I can ask for (optional):</label>
          <input type="text" className="mt-1 w-full border border-[var(--eh-line)] rounded-[var(--eh-control-radius)] p-3 focus:outline-none text-sm" placeholder="" />
        </div>
        
        <div className="pt-4 border-t border-[var(--eh-line)]">
          <h4 className="font-bold text-[var(--eh-ink)] mb-2">End of Phase Review</h4>
          <label className="text-sm text-[var(--eh-muted)] block mb-2">Did the fallback fit?</label>
          <select className="w-full border border-[var(--eh-line)] rounded-[var(--eh-control-radius)] p-3 text-sm focus:outline-none bg-white">
            <option>-- Select --</option>
            <option>Yes</option>
            <option>Partly</option>
            <option>No</option>
            <option>Did not need it</option>
          </select>

          <label className="text-sm text-[var(--eh-muted)] block mb-2 mt-4">What would you change? (Optional)</label>
          <textarea className="w-full border border-[var(--eh-line)] rounded-[var(--eh-control-radius)] p-3 focus:outline-none text-sm h-16 resize-none" />
        </div>
      </div>
      <button onClick={() => setActivePhase(3)} className="w-full py-4 border-2 border-[var(--eh-plum)] text-white font-bold rounded-[var(--eh-control-radius)] hover:bg-white/10 transition-colors shadow-[var(--eh-shadow)]">
        Move to Phase 3
      </button>
    </div>
  );

  const renderPhase3 = () => (
    <div className="space-y-6">
      <div className="bg-[#e8dde5] p-4 rounded-[var(--eh-control-radius)]">
        <h3 className="font-bold text-[var(--eh-plum)] text-lg">Phase 3 — Consider useful support</h3>
        <p className="text-[var(--eh-ink)] text-sm mt-1">Some difficulties need more than a personal strategy. Decide whether a work conversation, healthcare discussion, or another form of support would help.</p>
      </div>

      <div className="bg-white p-5 rounded-[var(--eh-card-radius)] shadow-[var(--eh-shadow)] space-y-5">
        <div>
          <label className="text-sm font-bold text-[var(--eh-ink)] block mb-2">Consider what external support might help right now:</label>
          <select className="w-full border border-[var(--eh-line)] rounded-[var(--eh-control-radius)] p-3 text-sm focus:outline-none bg-white">
            <option>-- Select an option to explore --</option>
            <option>Work conversation</option>
            <option>Healthcare preparation</option>
            <option>Another support</option>
            <option>Not now</option>
          </select>
          <p className="text-xs text-[var(--eh-plum)] font-bold underline mt-2 text-center cursor-pointer">Open Support Builder</p>
        </div>
        
        <div className="pt-4 border-t border-[var(--eh-line)]">
          <h4 className="font-bold text-[var(--eh-ink)] mb-2">End of Phase Review</h4>
          <label className="text-sm text-[var(--eh-muted)] block mb-2">Do you have a clearer next step?</label>
          <select className="w-full border border-[var(--eh-line)] rounded-[var(--eh-control-radius)] p-3 text-sm focus:outline-none bg-white">
            <option>-- Select --</option>
            <option>Yes</option>
            <option>Partly</option>
            <option>Not yet</option>
            <option>Skip</option>
          </select>
        </div>
      </div>
      <button onClick={() => setActivePhase(4)} className="w-full py-4 border-2 border-[var(--eh-plum)] text-white font-bold rounded-[var(--eh-control-radius)] hover:bg-white/10 transition-colors shadow-[var(--eh-shadow)]">
        Move to Phase 4
      </button>
    </div>
  );

  const renderPhase4 = () => (
    <div className="space-y-6">
      <div className="bg-[#e8dde5] p-4 rounded-[var(--eh-control-radius)]">
        <h3 className="font-bold text-[var(--eh-plum)] text-lg">Phase 4 — Keep what earns its place</h3>
        <p className="text-[var(--eh-ink)] text-sm mt-1">Look at what you actually used. Keep the helpful parts and decide what needs further attention.</p>
      </div>

      <div className="bg-white p-5 rounded-[var(--eh-card-radius)] shadow-[var(--eh-shadow)] space-y-5">
        <div>
          <label className="text-sm font-bold text-[var(--eh-ink)] block">One helpful action I will keep:</label>
          <input type="text" className="mt-1 w-full border border-[var(--eh-line)] rounded-[var(--eh-control-radius)] p-3 text-sm focus:outline-none" placeholder={recentPlan?.actions[0]?.title} />
        </div>

        <div>
          <label className="text-sm font-bold text-[var(--eh-ink)] block">One unresolved concern:</label>
          <input type="text" className="mt-1 w-full border border-[var(--eh-line)] rounded-[var(--eh-control-radius)] p-3 text-sm focus:outline-none" placeholder="" />
        </div>
        
        <div className="pt-4 border-t border-[var(--eh-line)]">
          <label className="text-sm font-bold text-[var(--eh-ink)] block mt-2">Looking ahead, what is your next step?</label>
          <select className="mt-2 w-full border border-[var(--eh-line)] rounded-[var(--eh-control-radius)] p-3 text-sm focus:outline-none bg-white">
            <option>Continue with this exact plan</option>
            <option>Change my priority to a new focus</option>
            <option>Focus entirely on getting medical/workplace support</option>
            <option>Pause the plan for a while</option>
          </select>
        </div>
      </div>
      
      <button onClick={() => {}} className="w-full py-4 bg-[var(--eh-plum)] text-white font-bold rounded-[var(--eh-control-radius)] hover:opacity-90 transition-opacity">
        Save Next Steps
      </button>
      
      {recentPlan && profile && (
        <div className="pt-4 border-t border-gray-200 mt-4 text-center">
          <DownloadPlanButton plan={recentPlan} profile={profile} />
        </div>
      )}
      
      <button onClick={() => {
        setHasStarted(false);
        setActivePhase(1);
      }} className="w-full py-4 text-[var(--primary)] font-bold mt-2 hover:underline">
        Start Another 30 Days
      </button>
    </div>
  );

  return (
    <div className="p-6 max-w-md mx-auto space-y-8 pb-24 font-sans">
      <div className="text-center">
        <h1 className="text-3xl font-serif font-bold text-[var(--primary)]">30-Day Plan</h1>
        {goal && <p className="text-sm text-gray-600 mt-2 italic px-4">"{goal.replace('Other: ', '')}"</p>}
      </div>

      <div className="grid grid-cols-4 gap-2">
        {phases.map(phase => (
          <button 
            key={phase.num}
            onClick={() => setActivePhase(phase.num)}
            className={`flex flex-col items-center justify-center p-2 rounded-lg text-xs font-bold transition-colors ${activePhase === phase.num ? 'bg-[var(--primary)] text-white shadow-md' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'}`}
          >
            <span>Wk {phase.num}</span>
          </button>
        ))}
      </div>

      <div className="text-center -mt-2">
        <span className="text-[var(--accent-1)] font-bold text-sm tracking-widest uppercase">{phases[activePhase-1].timeframe}</span>
        <h2 className="text-xl font-serif font-bold text-gray-800 mt-1">{phases[activePhase-1].focus}</h2>
      </div>

      {activePhase === 1 && renderPhase1()}
      {activePhase === 2 && renderPhase2()}
      {activePhase === 3 && renderPhase3()}
      {activePhase === 4 && renderPhase4()}
    </div>
  );
}
