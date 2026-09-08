export interface BriefTemplate {
  id: string; // PB01 - PB06
  title: string;
  scenario: string; // Used in selection step 1
  outcomes: {
    id: string; // e.g. "PB01-1"
    text: string;
    intended_outcome: string; // The goal to load into the brief
  }[];
  opening_sentence: string; // Markdown
  practical_preparation: string; // Markdown
  fallback: string; // Markdown
  leave_with: string; // Markdown
}

export const briefTemplates: BriefTemplate[] = [
  {
    id: 'PB01',
    title: 'A difficult conversation',
    scenario: 'I need to have a difficult conversation',
    outcomes: [
      { id: 'PB01-1', text: 'State my boundaries clearly', intended_outcome: 'I want to state my boundaries clearly and professionally without feeling pressured to explain myself.' },
      { id: 'PB01-2', text: 'Ask for specific support', intended_outcome: 'I want to ask for specific support while maintaining my professional standing.' },
      { id: 'PB01-3', text: 'Navigate a disagreement', intended_outcome: 'I want to navigate a disagreement while keeping my emotions regulated.' },
      { id: 'PB01-4', text: 'Something else', intended_outcome: 'I want to reach a constructive outcome.' }
    ],
    opening_sentence: '"I’m raising this because I want us to work together effectively."',
    practical_preparation: '- Write down my three key points\n- Have a glass of water nearby\n- Take three slow breaths before starting',
    fallback: 'If I feel overwhelmed: "I need to pause and reflect on this. Let’s pick it up tomorrow."',
    leave_with: 'Their agreement on the next specific step.'
  },
  {
    id: 'PB02',
    title: 'A presentation or major meeting',
    scenario: 'I need to lead a presentation or major meeting',
    outcomes: [
      { id: 'PB02-1', text: 'Deliver my key points clearly', intended_outcome: 'I want to deliver my key points clearly even if I experience symptoms.' },
      { id: 'PB02-2', text: 'Handle questions confidently', intended_outcome: 'I want to handle questions confidently without getting flustered.' },
      { id: 'PB02-3', text: 'Manage my time effectively', intended_outcome: 'I want to manage the time effectively and stay on track.' },
      { id: 'PB02-4', text: 'Something else', intended_outcome: 'I want to facilitate a productive session.' }
    ],
    opening_sentence: '"Today I want to focus on three main areas..."',
    practical_preparation: '- Prepare speaker notes with large font\n- Ask a colleague to monitor the chat/time\n- Test tech 15 mins before',
    fallback: 'If I lose my train of thought: "Let me check my notes to make sure I cover everything."',
    leave_with: 'Clear action items and owners.'
  },
  {
    id: 'PB03',
    title: 'A period of sustained concentration',
    scenario: 'I have a period of sustained concentration ahead',
    outcomes: [
      { id: 'PB03-1', text: 'Make meaningful progress', intended_outcome: 'I want to make meaningful progress on this specific task.' },
      { id: 'PB03-2', text: 'Avoid getting distracted', intended_outcome: 'I want to stay focused and avoid getting pulled into other things.' },
      { id: 'PB03-3', text: 'Work without exhausting myself', intended_outcome: 'I want to get this done without completely exhausting myself for the rest of the day.' },
      { id: 'PB03-4', text: 'Something else', intended_outcome: 'I want to complete this work efficiently.' }
    ],
    opening_sentence: '(Not needed for solo work—focus on the first step instead)',
    practical_preparation: '- Turn on Do Not Disturb\n- Block my calendar\n- Break the task into 20-minute chunks',
    fallback: 'If I can’t focus: "I will do 5 minutes of easy admin, then take a break."',
    leave_with: 'A saved draft or clear stopping point.'
  },
  {
    id: 'PB04',
    title: 'An unpredictable day',
    scenario: 'I have an unpredictable or highly reactive day',
    outcomes: [
      { id: 'PB04-1', text: 'Protect my most important task', intended_outcome: 'I want to protect my most important task amidst the chaos.' },
      { id: 'PB04-2', text: 'Not feel overwhelmed', intended_outcome: 'I want to handle incoming requests without feeling overwhelmed.' },
      { id: 'PB04-3', text: 'Finish on time', intended_outcome: 'I want to finish on time regardless of what happens.' },
      { id: 'PB04-4', text: 'Something else', intended_outcome: 'I want to end the day feeling capable.' }
    ],
    opening_sentence: '"I have limited capacity today, so I need to prioritize..."',
    practical_preparation: '- Identify my one non-negotiable task\n- Set a hard finish time\n- Cancel or move non-urgent meetings',
    fallback: 'If everything goes wrong: "I will log off on time and start fresh tomorrow."',
    leave_with: 'My one non-negotiable task completed.'
  },
  {
    id: 'PB05',
    title: 'A social or networking event',
    scenario: 'I have a social or networking event',
    outcomes: [
      { id: 'PB05-1', text: 'Make a few good connections', intended_outcome: 'I want to make a few good connections without draining my energy.' },
      { id: 'PB05-2', text: 'Leave early gracefully', intended_outcome: 'I want to make an appearance and leave early gracefully.' },
      { id: 'PB05-3', text: 'Feel comfortable in the space', intended_outcome: 'I want to feel comfortable in the space and manage my symptoms.' },
      { id: 'PB05-4', text: 'Something else', intended_outcome: 'I want to participate comfortably.' }
    ],
    opening_sentence: '"It’s great to meet you. I can only stay for a short while, but I wanted to say hello."',
    practical_preparation: '- Decide on an exit time in advance\n- Wear layers for temperature control\n- Identify a quiet spot I can retreat to',
    fallback: 'If I need to leave suddenly: "Please excuse me, I have another commitment. Great to see you."',
    leave_with: 'One or two useful contacts, or just having shown my face.'
  },
  {
    id: 'PB06',
    title: 'A performance or review meeting',
    scenario: 'I have a performance or review meeting',
    outcomes: [
      { id: 'PB06-1', text: 'Highlight my achievements', intended_outcome: 'I want to highlight my achievements accurately.' },
      { id: 'PB06-2', text: 'Discuss support needs', intended_outcome: 'I want to discuss my support needs constructively.' },
      { id: 'PB06-3', text: 'Handle feedback well', intended_outcome: 'I want to handle constructive feedback without taking it personally.' },
      { id: 'PB06-4', text: 'Something else', intended_outcome: 'I want a clear, fair review.' }
    ],
    opening_sentence: '"I’m looking forward to reviewing my progress and setting goals for the next period."',
    practical_preparation: '- Send my self-reflection notes in advance\n- Have my evidence of achievements visible\n- Prepare one specific request for support',
    fallback: 'If I am surprised by feedback: "Thank you for that feedback. I’d like some time to reflect on it before we discuss it further."',
    leave_with: 'Documented goals and agreed support.'
  }
];
