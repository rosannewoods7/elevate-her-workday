'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { ChevronLeft } from 'lucide-react';
import { NotificationSettings } from '@/components/NotificationSettings';

const SupportPDFDownload = dynamic(
  () => import('@/components/SupportPDF').then(m => m.SupportPDFDownload),
  { ssr: false }
);

export default function SupportPage() {
  const [activeBuilder, setActiveBuilder] = useState<'none' | 'work' | 'health'>('none');
  const router = useRouter();

  if (activeBuilder === 'none') {
    return (
      <main className="min-h-screen p-6 pb-24 font-sans text-white flex flex-col justify-center">
        <div className="max-w-md mx-auto space-y-6 w-full">
          <h1 className="text-3xl font-serif font-bold text-[var(--eh-lilac)] leading-tight text-center">Prepare the conversation that matters.</h1>
          
                    <button 
            onClick={() => router.push('/prepare')}
            className="w-full bg-[var(--eh-paper)] p-6 rounded-[var(--eh-card-radius)] shadow-[var(--eh-shadow)] border border-[var(--eh-plum)] text-left hover:border-[var(--eh-mauve)] transition-all group"
          >
            <h2 className="text-xl font-serif font-bold text-[var(--eh-plum)]">Prepare me for...</h2>
            <p className="text-[var(--eh-muted)] text-sm mt-2 mb-4 leading-relaxed">Build a 5-step preparation brief for difficult meetings, tasks, or unpredictable days.</p>
            <span className="inline-block bg-[var(--eh-plum)] text-white text-sm font-bold py-2 px-4 rounded-[var(--eh-control-radius)] group-hover:opacity-90">Start Preparation Brief</span>
          </button>
          
          <div className="h-px w-full bg-white/20 my-4" />

          <button 
            onClick={() => setActiveBuilder('work')}
            className="w-full bg-[var(--eh-paper)] p-6 rounded-[var(--eh-card-radius)] shadow-[var(--eh-shadow)] border border-[var(--eh-line)] text-left hover:border-[var(--eh-mauve)] transition-all group"
          >
            <h2 className="text-xl font-serif font-bold text-[var(--eh-plum)]">At work</h2>
            <p className="text-[var(--eh-muted)] text-sm mt-2 mb-4 leading-relaxed">Prepare a clear request for a functional adjustment while choosing what to share.</p>
            <span className="inline-block bg-[var(--eh-plum)] text-white text-sm font-bold py-2 px-4 rounded-[var(--eh-control-radius)] group-hover:opacity-90">Start Work Builder</span>
          </button>

          <button 
            onClick={() => setActiveBuilder('health')}
            className="w-full bg-[var(--eh-paper)] p-6 rounded-[var(--eh-card-radius)] shadow-[var(--eh-shadow)] border border-[var(--eh-line)] text-left hover:border-[var(--eh-mauve)] transition-all group"
          >
            <h2 className="text-xl font-serif font-bold text-[var(--eh-plum)]">With a healthcare professional</h2>
            <p className="text-[var(--eh-muted)] text-sm mt-2 mb-4 leading-relaxed">Leave with a clearer next step. Bring a concise account of what has changed.</p>
            <span className="inline-block bg-[var(--eh-plum)] text-white text-sm font-bold py-2 px-4 rounded-[var(--eh-control-radius)] group-hover:opacity-90">Start Health Builder</span>
          </button>

          <NotificationSettings />
        </div>
      </main>
    );
  }

  if (activeBuilder === 'work') return <WorkBuilder onBack={() => setActiveBuilder('none')} />;
  return <HealthBuilder onBack={() => setActiveBuilder('none')} />;
}

// ---------------------------------------------------------
// WORK TEMPLATES
// ---------------------------------------------------------
const WORK_TEMPLATES: Record<string, { outcome: string, barrier: string, adjustment: string, commitment: string, review: string }> = {
  competing_priorities: {
    outcome: "Protect delivery of agreed priorities.",
    barrier: "Current deadlines compete for the same capacity.",
    adjustment: "Keep the client launch on schedule and move the internal review by one week.",
    commitment: "Update the delivery plan and communicate the changes.",
    review: "Review progress at the next check-in."
  },
  board_prep: {
    outcome: "Strengthen the preparation process for board decisions.",
    barrier: "Late changes to the papers reduce the time available to assess assumptions.",
    adjustment: "Agree a firm circulation deadline with a defined exception process.",
    commitment: "Consolidate my questions in advance of the meeting.",
    review: "Review the process after two meeting cycles."
  },
  meeting_sequence: {
    outcome: "Maintain quality preparation for the financial review.",
    barrier: "Two early internal meetings compress the preparation window.",
    adjustment: "Move the internal meetings later in the day for a four-week trial.",
    commitment: "Own the revised agenda and ensure client commitments remain unchanged.",
    review: "Review preparation quality at the end of the four-week period."
  },
  travel: {
    outcome: "Ensure high-quality output on the decision discussion.",
    barrier: "The current travel sequence places a demanding review immediately after the return journey.",
    adjustment: "Assign the initial briefing to a team member, and I will take the decision discussion at a workable time.",
    commitment: "Prepare a clear handover in advance.",
    review: "Confirm alignment after the decision discussion."
  },
  environment_temp: {
    outcome: "Maintain focus and physical comfort during deep work.",
    barrier: "Current office temperature and airflow are actively disrupting concentration.",
    adjustment: "Move to a different desk, adjust airflow, or agree on temporary remote focus windows.",
    commitment: "Ensure all deliverables remain on schedule regardless of location.",
    review: "Check if the new arrangement resolves the distraction in 5 days."
  },
  hr_process: {
    outcome: "Understand the confidential process for requesting a work adjustment.",
    barrier: "Unclear on what documentation is needed or who handles it.",
    adjustment: "Receive guidance on the appropriate confidential channel.",
    commitment: "Provide the necessary documentation once the process is clear.",
    review: "Follow up based on the provided timeline."
  }
};

function WorkBuilder({ onBack }: { onBack: () => void }) {
  const [audience, setAudience] = useState('');
  const [situation, setSituation] = useState('');
  
  const [outcome, setOutcome] = useState('');
  const [barrier, setBarrier] = useState('');
  const [adjustment, setAdjustment] = useState('');
  const [commitment, setCommitment] = useState('');
  const [review, setReview] = useState('');
  
  useEffect(() => {
    if (situation && WORK_TEMPLATES[situation]) {
      const t = WORK_TEMPLATES[situation];
      setOutcome(t.outcome);
      setBarrier(t.barrier);
      setAdjustment(t.adjustment);
      setCommitment(t.commitment);
      setReview(t.review);
    } else if (!situation) {
      setOutcome(''); setBarrier(''); setAdjustment(''); setCommitment(''); setReview('');
    }
  }, [situation]);

  const isComplete = outcome || barrier || adjustment || commitment || review;

  return (
    <div className="p-6 max-w-md mx-auto space-y-6 pb-32 animate-in slide-in-from-right duration-300">
      <button onClick={onBack} className="flex items-center text-[var(--eh-lilac)] font-bold hover:underline mb-2 -ml-2">
        <ChevronLeft size={20} /> Back
      </button>
      
      <h1 className="text-2xl font-serif font-bold text-[var(--eh-lilac)]">Executive Support Builder</h1>
      <p className="text-sm text-[var(--eh-lilac)]">Select a situation to pre-fill the strategy, then edit the text to fit your exact needs.</p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-white mb-1">1. Who is the audience?</label>
          <select value={audience} onChange={e => setAudience(e.target.value)} className="w-full p-3 rounded-[var(--eh-control-radius)] border border-[var(--eh-line)] text-sm bg-white text-[var(--eh-ink)]">
            <option value="">Select an audience...</option>
            <option value="CEO">CEO / Line Leader</option>
            <option value="Board">Board Chair</option>
            <option value="HR">HR / People</option>
            <option value="Peer">Peer</option>
            <option value="Report">Direct Report</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-white mb-1">2. What is the situation?</label>
          <select value={situation} onChange={e => setSituation(e.target.value)} className="w-full p-3 rounded-[var(--eh-control-radius)] border border-[var(--eh-line)] text-sm bg-white text-[var(--eh-ink)]">
            <option value="">Custom (Type it yourself)...</option>
            <option value="competing_priorities">Competing priorities</option>
            <option value="board_prep">Quality of board preparation</option>
            <option value="meeting_sequence">Temporary meeting adjustment</option>
            <option value="travel">Executive travel sequence</option>
            <option value="environment_temp">Environmental / Temperature adjustment</option>
            <option value="hr_process">Understand confidential HR process</option>
          </select>
        </div>

        <div className="pt-4 space-y-4 border-t border-[var(--eh-line)]">
          <p className="text-xs font-bold uppercase text-white tracking-wider">Your Draft (Editable)</p>
          
          <div>
            <label className="block text-xs font-bold text-[var(--eh-muted)] mb-1">What outcome matters?</label>
            <textarea rows={2} value={outcome} onChange={e => setOutcome(e.target.value)} className="w-full p-3 rounded-[var(--eh-control-radius)] border border-[var(--eh-line)] text-sm bg-white resize-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-[var(--eh-muted)] mb-1">What is getting in the way?</label>
            <textarea rows={2} value={barrier} onChange={e => setBarrier(e.target.value)} className="w-full p-3 rounded-[var(--eh-control-radius)] border border-[var(--eh-line)] text-sm bg-white resize-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-[var(--eh-muted)] mb-1">What would help?</label>
            <textarea rows={2} value={adjustment} onChange={e => setAdjustment(e.target.value)} className="w-full p-3 rounded-[var(--eh-control-radius)] border border-[var(--eh-line)] text-sm bg-white resize-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-[var(--eh-muted)] mb-1">What will you own?</label>
            <textarea rows={2} value={commitment} onChange={e => setCommitment(e.target.value)} className="w-full p-3 rounded-[var(--eh-control-radius)] border border-[var(--eh-line)] text-sm bg-white resize-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-[var(--eh-muted)] mb-1">How will you review it?</label>
            <textarea rows={2} value={review} onChange={e => setReview(e.target.value)} className="w-full p-3 rounded-[var(--eh-control-radius)] border border-[var(--eh-line)] text-sm bg-white resize-none" />
          </div>
        </div>
      </div>

      <div className="bg-[#e8dde5] p-4 rounded-[var(--eh-control-radius)]">
        <p className="text-xs font-bold uppercase tracking-wider text-[var(--eh-plum)] mb-2">Support Note</p>
        <p className="text-sm text-[var(--eh-ink)]">If your concern involves unfair treatment, unsafe conditions, or a situation you do not feel comfortable raising directly, consider an appropriate HR contact, union representative, or independent adviser. This tool does not determine your legal rights.</p>
      </div>

      <div className="pt-6 border-t border-[var(--eh-line)]">
        <SupportPDFDownload type="work" workData={{ outcome, barrier, adjustment, commitment, review, audience }} disabled={!isComplete} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// HEALTH BUILDER
// ---------------------------------------------------------

function HealthBuilder({ onBack }: { onBack: () => void }) {
  const [concern, setConcern] = useState('');
  const [onset, setOnset] = useState('');
  const [impact, setImpact] = useState('');
  const [context, setContext] = useState('');
  const [questions, setQuestions] = useState<Record<string, boolean>>({});

  const toggleQuestion = (q: string) => {
    setQuestions(prev => ({ ...prev, [q]: !prev[q] }));
  };

  const isComplete = concern || onset || impact || Object.values(questions).some(Boolean);

  const hcQuestions = [
    "What could be contributing to these changes?",
    "Is there anything that needs further assessment?",
    "What options might help, and what should I know about them?",
    "When should I follow up or seek help sooner?"
  ];

  return (
    <div className="p-6 max-w-md mx-auto space-y-6 pb-32 animate-in slide-in-from-right duration-300">
      <button onClick={onBack} className="flex items-center text-[var(--eh-lilac)] font-bold hover:underline mb-2 -ml-2">
        <ChevronLeft size={20} /> Back
      </button>

      <h1 className="text-2xl font-serif font-bold text-[var(--eh-lilac)]">Healthcare Appointment Builder</h1>
      <p className="text-sm text-[var(--eh-lilac)]">Bring a clear picture to your appointment. A few examples can help you explain what has changed. You do not need to know the cause.</p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-white mb-1">1. What do you most want help with?</label>
          <select value={concern} onChange={e => setConcern(e.target.value)} className="w-full p-3 rounded-[var(--eh-control-radius)] border border-[var(--eh-line)] text-sm bg-white text-[var(--eh-ink)]">
            <option value="">Select a concern...</option>
            <option value="Persistent fatigue and low energy">Persistent fatigue and low energy</option>
            <option value="Severe disruption to sleep/recovery">Severe disruption to sleep/recovery</option>
            <option value="Difficulty maintaining focus and concentration">Difficulty maintaining focus and concentration</option>
            <option value="Physical discomfort or extreme temperature changes">Physical discomfort or extreme temperature changes</option>
            <option value="Feeling constantly overwhelmed or anxious">Feeling constantly overwhelmed or anxious</option>
            <option value="Other (Write below)">Other (Write below)</option>
          </select>
          {concern === 'Other (Write below)' && (
            <input type="text" placeholder="Specify concern..." onChange={e => setConcern(e.target.value)} className="w-full p-3 rounded-[var(--eh-control-radius)] border border-[var(--eh-line)] text-sm mt-2 text-[var(--eh-ink)] bg-white" />
          )}
        </div>

          <div>
            <label className="block text-sm font-bold text-white mb-1">2. Approximate start date?</label>
            <select value={onset} onChange={e => setOnset(e.target.value)} className="w-full p-3 rounded-[var(--eh-control-radius)] border border-[var(--eh-line)] text-sm bg-white text-[var(--eh-ink)]">
              <option value="">Select start date...</option>
              <option value="Today">Today</option>
              <option value="This week">This week</option>
              <option value="This month">This month</option>
              <option value="Gradually">Gradually</option>
              <option value="Not sure">Not sure</option>
              <option value="Other">Other (Write below)</option>
            </select>
            {onset === 'Other' && (
              <input type="text" placeholder="Specify..." onChange={e => setOnset(e.target.value)} className="w-full p-3 rounded-[var(--eh-control-radius)] border border-[var(--eh-line)] text-sm mt-2 text-[var(--eh-ink)] bg-white" />
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-white mb-1">3. Work impact example:</label>
            <select value={impact} onChange={e => setImpact(e.target.value)} className="w-full p-3 rounded-[var(--eh-control-radius)] border border-[var(--eh-line)] text-sm bg-white text-[var(--eh-ink)]">
              <option value="">Select impact...</option>
              <option value="Requiring extra checking at work">Requiring extra checking at work</option>
              <option value="Taking longer to complete tasks">Taking longer to complete tasks</option>
              <option value="Needing more frequent breaks">Needing more frequent breaks</option>
              <option value="Struggling to stay focused in meetings">Struggling to stay focused in meetings</option>
              <option value="Having difficulty retaining new information">Having difficulty retaining new information</option>
              <option value="Other">Other (Write below)</option>
            </select>
            {impact === 'Other' && (
              <input type="text" placeholder="Specify impact..." onChange={e => setImpact(e.target.value)} className="w-full p-3 rounded-[var(--eh-control-radius)] border border-[var(--eh-line)] text-sm mt-2 text-[var(--eh-ink)] bg-white" />
            )}
          </div>

        <div>
          <label className="block text-sm font-bold text-white mb-2">4. Questions for the clinician (Select all that apply):</label>
          <div className="space-y-2">
            {hcQuestions.map((q, idx) => (
              <label key={idx} className="flex items-start space-x-3 p-3 bg-white rounded-[var(--eh-control-radius)] cursor-pointer">
                <input type="checkbox" checked={!!questions[q]} onChange={() => toggleQuestion(q)} className="mt-1" />
                <span className="text-sm text-[var(--eh-ink)]">{q}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-bold text-white mb-1">Optional Context / Log Summary (Private)</label>
          <textarea rows={2} placeholder="e.g. Previous investigations, supplements..." value={context} onChange={e => setContext(e.target.value)} className="w-full p-3 rounded-[var(--eh-control-radius)] border border-[var(--eh-line)] text-sm bg-white resize-none text-[var(--eh-ink)]" />
        </div>
      </div>

      <div className="pt-6 border-t border-[var(--eh-line)]">
        <SupportPDFDownload 
          type="health" 
          healthData={{ concern, onset, impact, context, questions: Object.keys(questions).filter(k => questions[k]) }} 
          disabled={!isComplete} 
        />
      </div>
    </div>
  );
}
