'use client';

import { useState } from 'react';
import { ActionContent } from '@/lib/types';
import { ChevronDown, ChevronUp } from 'lucide-react';

const evidenceSources: Record<string, { title: string, link?: string, supports: string }> = {
  E01: {
    title: 'NICE NG23: Menopause identification and management',
    link: 'https://www.nice.org.uk/guidance/ng23/resources/menopause-identification-and-management-pdf-1837330217413',
    supports: 'Clinical identification and selective use of testing; not a universal panel or app diagnosis.'
  },
  E02: {
    title: 'BC Guidelines: Iron Deficiency—Diagnosis and Management',
    link: 'https://www2.gov.bc.ca/gov/content/health/practitioner-professional-resources/bc-guidelines/iron-deficiency',
    supports: 'CBC/ferritin in assessment of suspected iron deficiency; not blanket screening or treatment guidance for app users.'
  },
  E03: {
    title: 'NICE NG145: Thyroid disease recommendations',
    link: 'https://www.nice.org.uk/guidance/ng145/chapter/recommendations',
    supports: 'Testing when there is clinical suspicion; one symptom does not establish thyroid disease.'
  },
  E04: {
    title: 'NHLBI: Sleep Apnea',
    link: 'https://www.nhlbi.nih.gov/health/sleep-apnea',
    supports: 'Discuss snoring/gasping and sleepiness with a clinician; app entries do not diagnose sleep apnoea.'
  },
  E05: {
    title: 'NHLBI: Insomnia Treatment',
    link: 'https://www.nhlbi.nih.gov/health/insomnia/treatment',
    supports: 'CBT-I as a first treatment for long-term insomnia; generic recovery tips are not a CBT-I program.'
  },
  E06: {
    title: 'NHS: Postmenopausal bleeding',
    link: 'https://www.nhs.uk/symptoms/post-menopausal-bleeding/',
    supports: 'Arrange medical assessment even after a single episode; no wait-for-tracking rule.'
  },
  E07: {
    title: 'Health Canada: Food guide snapshot',
    link: 'https://www.canada.ca/en/health-canada/services/food-guide/explore/snapshot.html',
    supports: 'General healthy food choices; no tested executive-focus timing protocol.'
  },
  E08: {
    title: 'Brief structured respiration practices enhance mood and reduce physiological arousal',
    link: 'https://pubmed.ncbi.nlm.nih.gov/36630953/',
    supports: 'A small randomized study tested five minutes of daily structured breathing over a month and reported changes in mood and breathing measures. It did not establish that a one-minute version improves executive decision-making, treats menopause, or lowers an individual\'s cortisol.'
  },
  E09: {
    title: 'CCOHS: Positioning the Monitor',
    link: 'https://www.ccohs.ca/oshanswers/ergonomics/office/monitor_positioning.html',
    supports: 'Workstation viewing guidance; individual setup needs vary and disease prevention is not guaranteed.'
  },
  E10: {
    title: 'Cochrane 2025: Work-break interventions',
    link: 'https://www.cochrane.org/evidence/CD012886_work-break-interventions-preventing-musculoskeletal-symptoms-and-disorders-healthy-workers',
    supports: 'Important uncertainty about musculoskeletal benefits; used to limit claims, not validate every break card.'
  },
  E11: {
    title: 'NHLBI: Healthy Sleep Habits',
    link: 'https://www.nhlbi.nih.gov/health/sleep-deprivation/healthy-sleep-habits',
    supports: 'Caffeine can interfere with sleep; no universal precise cutoff prescribed by this app.'
  }
};

export function EvidenceDrawer({ action }: { action: ActionContent }) {
  const [isOpen, setIsOpen] = useState(false);

  const label = action.evidence_label || 'Practical planning tool';
  const sources = (action.source_ids || []).map(id => evidenceSources[id]).filter(s => s);

  return (
    <div className="mt-4 border-t border-[var(--eh-line)] pt-3">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-xs font-bold text-[var(--eh-mauve)] hover:text-[var(--eh-plum)] transition-colors"
      >
        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        Why this may help
      </button>

      {isOpen && (
        <div className="mt-3 space-y-3 bg-[var(--eh-canvas)] p-4 rounded-[var(--eh-control-radius)] text-sm">
          <div>
            <span className="font-bold text-[var(--eh-plum)] text-xs uppercase tracking-wider">{label}</span>
          </div>

          {sources.length > 0 ? (
            sources.map((source, i) => (
              <div key={i} className="space-y-1 pb-2">
                <p className="text-[var(--eh-ink)] leading-relaxed">
                  <strong>What the evidence covers:</strong> {source.supports}
                </p>
                {source.link && (
                  <a href={source.link} target="_blank" rel="noreferrer" className="text-xs text-[var(--eh-plum)] underline block mt-1">
                    {source.title}
                  </a>
                )}
              </div>
            ))
          ) : (
            <div className="space-y-2">
              <p className="text-[var(--eh-ink)] leading-relaxed">
                <strong>Why this may help:</strong> {
                  action.id.startsWith('F') || action.id.startsWith('G') ? `By focusing on "${action.title}", this practical tool helps reduce cognitive load. Externalizing memory or breaking tasks into concrete steps minimizes the impact of temporary brain fog or distraction.` :
                  action.id.startsWith('E') ? `By focusing on "${action.title}", this practical tool helps structure your workload. It preserves your capacity for critical tasks and reduces the daily drain of low-value friction.` :
                  action.id.startsWith('R') ? `By focusing on "${action.title}", this practical tool creates boundaries around off-work time. This helps you protect the rest and recovery necessary for long-term endurance.` :
                  action.id.startsWith('L') ? `By focusing on "${action.title}", this practical tool helps manage competing demands. It clarifies priorities and establishes realistic communication boundaries with colleagues.` :
                  action.id.startsWith('C') ? `By focusing on "${action.title}", this practical tool addresses your immediate environment. Modifying your physical workspace or task posture reduces unnecessary physical strain while working.` :
                  action.id.startsWith('S') ? `By focusing on "${action.title}", this practical tool provides a structured approach to requesting necessary adjustments or clarifying needs with managers and healthcare providers.` :
                  `By focusing on "${action.title}", this practical planning tool reduces workday friction through structured approaches.`
                }
              </p>
              <p className="text-[var(--eh-muted)] text-xs italic leading-relaxed pt-2 border-t border-[var(--eh-line)]">
                What the evidence covers: This is an authored coaching suggestion to organize work. It has not been tested in a clinical trial and is not a medical treatment.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
