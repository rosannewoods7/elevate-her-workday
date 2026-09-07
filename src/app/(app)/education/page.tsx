'use client';

import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export default function Education() {
  const [expandedTopic, setExpandedTopic] = useState<number | null>(null);

  const topics = [
    {
      title: "Hormones & Symptoms",
      description: "Understanding your baseline, recognizing symptom clusters, and learning how to track effectively.",
      content: "As a leader, unpredictability can feel like a liability. However, midlife hormonal shifts follow recognizable patterns if you know what to look for. Estrogen and progesterone fluctuations don't just cause hot flashes; they influence cognitive stamina, joint comfort, and stress resilience. \n\nThe goal isn't to fix every symptom, but to establish your baseline. By tracking symptom clusters over a few weeks, you can identify your 'harder windows'—specific times of the month or day when friction peaks. With this data, you can strategically schedule high-stakes decision-making and deep work outside of these windows, allowing you to lead with confidence rather than constantly fighting your biology."
    },
    {
      title: "Nutrition & Energy",
      description: "Blood sugar regulation, managing cravings, and fueling your workday for sustained focus.",
      content: "Executive fatigue is often compounded by inadequate fueling. During the menopausal transition, insulin sensitivity can decrease, meaning that the quick carbohydrate snacks you once relied on for energy may now trigger blood sugar crashes and brain fog. \n\nSustaining executive focus requires a shift toward protein-forward meals and structured hydration. Prioritizing 25-30 grams of protein at breakfast sets a stable metabolic foundation for the day. When back-to-back meetings disrupt lunch, having emergency, shelf-stable protein options in your office prevents the mid-afternoon energy slump that derails strategic thinking."
    },
    {
      title: "Sleep & Recovery",
      description: "The reality of midlife sleep architecture and how to recover when a good night isn't possible.",
      content: "Deep (slow-wave) sleep and REM sleep frequently become fragmented during midlife due to temperature dysregulation and nervous system changes. For leaders, operating on compromised sleep can increase reactivity and degrade complex problem-solving. \n\nIf you cannot control the quality of your night, you must control the quality of your recovery during the day. This means shifting away from the 'push through' mentality. When sleep is poor, lower your cognitive load the next day where possible. Implement 5-minute sensory resets between meetings—step away from screens, regulate your breathing, and lower physiological arousal. Recovery is a leadership skill, not a luxury."
    },
    {
      title: "Stress & Nervous System",
      description: "Cortisol changes in midlife and practical micro-breaks to reset your nervous system at work.",
      content: "Midlife naturally elevates baseline cortisol (the stress hormone), meaning your threshold for feeling 'overwhelmed' is biologically lowered. When workplace friction occurs, your nervous system may jump into a 'fight or flight' response much faster than it did a decade ago. \n\nManaging this requires proactive nervous system regulation. You cannot eliminate workplace stress, but you can alter your physiological response to it. Techniques like 'physiological sighs' (two quick inhales followed by a long exhale) or briefly shifting your visual focus to a distant horizon can rapidly signal safety to your brain, allowing you to respond to workplace challenges with executive clarity rather than reactive emotion."
    },
    {
      title: "Daily Movement",
      description: "Sedentary behavior vs. planned exercise. Establishing progressive targets and incorporating movement snacks.",
      content: "Many female leaders separate 'exercise' (a 45-minute gym session) from 'work' (8 hours of sitting). However, prolonged sedentary behavior restricts blood flow to the brain, exacerbating brain fog and joint stiffness. \n\nThe most effective strategy is integrating 'movement snacks' directly into your workday. Stand up during phone calls, take walking 1:1 meetings, or do 60 seconds of mobility work between Zoom calls. While hitting 10,000 steps is a great target, research shows that even accumulating 4,000-6,000 steps significantly benefits metabolic and cognitive health. Movement is the mechanism that clears cortisol from your bloodstream—use it strategically during your workday."
    }
  ];

  const toggleTopic = (index: number) => {
    if (expandedTopic === index) {
      setExpandedTopic(null);
    } else {
      setExpandedTopic(index);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto space-y-6 pb-24 font-sans">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-serif font-bold text-[var(--eh-lilac)]">Learn</h1>
        <p className="text-[var(--eh-lilac)]">Understand the context behind your strategies. None of this is a test.</p>
      </div>

      <div className="space-y-4">
        {topics.map((topic, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all">
            <div 
              className="p-5 flex gap-4 cursor-pointer hover:bg-gray-50 items-start"
              onClick={() => toggleTopic(i)}
            >
              <div className="mt-1 text-[var(--eh-plum)] shrink-0">
                <BookOpen size={24} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-serif font-bold text-lg text-[var(--primary)]">{topic.title}</h3>
                  {expandedTopic === i ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                </div>
                {expandedTopic !== i && (
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">{topic.description}</p>
                )}
              </div>
            </div>
            
            {expandedTopic === i && (
              <div className="px-5 pb-5 pt-2 border-t border-gray-50 bg-[#faf8f9]">
                <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{topic.content}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
