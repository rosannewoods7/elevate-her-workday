import { ActionContent } from './types';

export const actionLibrary: ActionContent[] = [
  {
    "id": "F01",
    "domain": "focus",
    "title": "Give the task a starting point",
    "instruction": "“Write the next visible step for one task: open the document, list three points, or check one figure. Start there rather than holding the whole task in mind.”",
    "fallback": "“If I lose my place, I’ll return to the next step I wrote down.”",
    "setup_seconds": 30,
    "use_seconds": 30,
    "requires": [],
    "demand_tags": [
      "interruptions",
      "deadlines"
    ],
    "prior_tool": "written_list",
    "review_status": "approved",
    "content_version": "1.0",
    "family_id": "task-start"
  },
  {
    "id": "F02",
    "domain": "focus",
    "title": "Leave yourself a return note",
    "instruction": "“Before switching away from a task, write a few words about where you stopped and what comes next. Keep the note with the work.”",
    "fallback": "“If an interruption takes over, I’ll leave a five-word return note when I can.”",
    "setup_seconds": 20,
    "use_seconds": 20,
    "requires": [],
    "demand_tags": [
      "interruptions",
      "unpredictable"
    ],
    "prior_tool": "written_list",
    "review_status": "approved",
    "content_version": "1.0",
    "family_id": "return-note"
  },
  {
    "id": "F03",
    "domain": "focus",
    "title": "Prepare a meeting anchor",
    "instruction": "“Before a meeting, write your main point and one question. Use the note if you lose your train of thought.”",
    "fallback": "“If I cannot prepare fully, I’ll write the one point I need to communicate.”",
    "setup_seconds": 60,
    "use_seconds": 60,
    "requires": [],
    "demand_tags": [
      "meetings",
      "public_facing"
    ],
    "prior_tool": "written_list",
    "review_status": "approved",
    "content_version": "1.0",
    "family_id": "presentation-anchor"
  },
  {
    "id": "F04",
    "domain": "focus",
    "title": "Choose a clearer task window",
    "instruction": "“If you control task order, place one attention-heavy task in a time you usually find easier. Move a less demanding task into the harder window.”",
    "fallback": "“If the schedule changes, I’ll write the task’s next step and choose another feasible window.”",
    "setup_seconds": 120,
    "use_seconds": 120,
    "requires": [
      "task_order"
    ],
    "demand_tags": [
      "deadlines"
    ],
    "prior_tool": "task_order",
    "review_status": "approved",
    "content_version": "1.0",
    "family_id": "task-window"
  },
  {
    "id": "E01",
    "domain": "energy",
    "title": "Define what is enough today",
    "instruction": "“Name the one work outcome that matters most today. Use it to guide your effort; if other expectations conflict, prepare to clarify priorities.”",
    "fallback": "“If energy drops, I’ll identify the next essential step and ask about competing expectations when needed.”",
    "setup_seconds": 30,
    "use_seconds": 30,
    "requires": [],
    "demand_tags": [
      "deadlines",
      "outside_work"
    ],
    "prior_tool": "written_list",
    "review_status": "approved",
    "content_version": "1.0",
    "family_id": "essential-scope"
  },
  {
    "id": "E02",
    "domain": "energy",
    "title": "Prepare for your harder window",
    "instruction": "“If there is a time you often find harder, write what would make the next task easier: a short checklist, materials ready, or a question answered.”",
    "fallback": "“If I cannot change the timing, I’ll reduce setup by keeping the next step ready.”",
    "setup_seconds": 60,
    "use_seconds": 60,
    "requires": [],
    "demand_tags": [
      "public_facing",
      "unpredictable"
    ],
    "prior_tool": "written_list",
    "review_status": "approved",
    "content_version": "1.0",
    "family_id": "prepare-materials"
  },
  {
    "id": "E03",
    "domain": "energy",
    "title": "Use an available pause",
    "instruction": "“At an appropriate pause, briefly change position or rest your attention in a way that is comfortable for you. Resume with one next step.”",
    "fallback": "“If a pause is unavailable, I’ll note when I can next stop and prepare a support request if breaks are routinely impossible.”",
    "setup_seconds": 30,
    "use_seconds": 30,
    "requires": [
      "short_break"
    ],
    "demand_tags": [
      "meetings",
      "public_facing"
    ],
    "prior_tool": "pause",
    "review_status": "approved",
    "content_version": "1.0",
    "family_id": "comfortable-pause"
  },
  {
    "id": "E04",
    "domain": "energy",
    "title": "Clarify the trade-off",
    "instruction": "“Prepare this question: ‘I can complete A or B first within today’s time. Which is the priority?’ Use it with the person who can clarify expectations.”",
    "fallback": "“If I cannot ask now, I’ll write the competing priorities for the next suitable conversation.”",
    "setup_seconds": 60,
    "use_seconds": 60,
    "requires": [],
    "demand_tags": [
      "deadlines"
    ],
    "prior_tool": "support",
    "review_status": "approved",
    "content_version": "1.0",
    "family_id": "priority-tradeoff"
  },
  {
    "id": "R01",
    "domain": "recovery",
    "title": "Make a poor-night plan",
    "instruction": "“Choose one essential task and one support you can use after a poor night: a checklist, written instructions, or a question to clarify priorities. Do not use the app to decide whether safety-sensitive work is safe.”",
    "fallback": "“If the day is harder than expected, I’ll simplify the next step and seek appropriate support.”",
    "setup_seconds": 60,
    "use_seconds": 60,
    "requires": [],
    "demand_tags": [
      "deadlines",
      "unpredictable"
    ],
    "prior_tool": "written_list",
    "review_status": "approved",
    "content_version": "1.0",
    "family_id": "poor-night-plan"
  },
  {
    "id": "R02",
    "domain": "recovery",
    "title": "Put the unfinished task somewhere",
    "instruction": "“Near the end of work, write the next step for an unfinished task. Give yourself a clear place to restart rather than relying on memory.”",
    "fallback": "“If I finish abruptly, I’ll leave one short restart note.”",
    "setup_seconds": 30,
    "use_seconds": 30,
    "requires": [],
    "demand_tags": [
      "outside_work",
      "deadlines"
    ],
    "prior_tool": "written_list",
    "review_status": "approved",
    "content_version": "1.0",
    "family_id": "return-note"
  },
  {
    "id": "R03",
    "domain": "recovery",
    "title": "Plan one workable transition",
    "instruction": "“Choose a brief transition after work that fits your responsibilities: put work materials away, change clothes, or pause before the next task. Keep it realistic.”",
    "fallback": "“If responsibilities begin immediately, I’ll use one small cue to mark the end of work.”",
    "setup_seconds": 60,
    "use_seconds": 60,
    "requires": [],
    "demand_tags": [
      "outside_work"
    ],
    "prior_tool": "pause",
    "review_status": "approved",
    "content_version": "1.0",
    "family_id": "end-work-transition"
  },
  {
    "id": "R04",
    "domain": "recovery",
    "title": "Prepare a sleep conversation",
    "instruction": "“If sleep problems are affecting your days, note when they began, how often they occur, and what they interfere with. Use those observations to prepare for a healthcare discussion.”",
    "fallback": "“If tracking feels too much, I’ll record one recent example and the question I want answered.”",
    "setup_seconds": 120,
    "use_seconds": 120,
    "requires": [],
    "demand_tags": [],
    "prior_tool": "support",
    "review_status": "approved",
    "content_version": "1.0",
    "family_id": "sleep-consultation"
  },
  {
    "id": "L01",
    "domain": "load",
    "title": "Separate your next step from the whole load",
    "instruction": "“Choose one demand you can act on and one that needs a decision or help from someone else. You do not need to resolve both today.”",
    "fallback": "“If everything feels urgent, I’ll write one question that would clarify the next priority.”",
    "setup_seconds": 60,
    "use_seconds": 60,
    "requires": [],
    "demand_tags": [
      "outside_work",
      "deadlines"
    ],
    "prior_tool": "written_list",
    "review_status": "approved",
    "content_version": "1.0",
    "family_id": "separate-demands"
  },
  {
    "id": "L02",
    "domain": "load",
    "title": "Prepare a priority question",
    "instruction": "“Use: ‘With this new request, which existing task should move?’ Prepare the question before agreeing to another deadline.”",
    "fallback": "“If I cannot clarify immediately, I’ll record the conflict and ask at the next appropriate opportunity.”",
    "setup_seconds": 30,
    "use_seconds": 30,
    "requires": [],
    "demand_tags": [
      "unpredictable",
      "deadlines"
    ],
    "prior_tool": "support",
    "review_status": "approved",
    "content_version": "1.0",
    "family_id": "priority-tradeoff"
  },
  {
    "id": "L03",
    "domain": "load",
    "title": "Give one meeting a little space",
    "instruction": "“If you can adjust meetings, leave a short gap after one demanding conversation to capture decisions and prepare the next step.”",
    "fallback": "“If the gap disappears, I’ll write one decision and one next step before they are lost.”",
    "setup_seconds": 120,
    "use_seconds": 120,
    "requires": [
      "meeting_format"
    ],
    "demand_tags": [
      "meetings"
    ],
    "prior_tool": "written_followup",
    "review_status": "approved",
    "content_version": "1.0",
    "family_id": "meeting-space"
  },
  {
    "id": "L04",
    "domain": "load",
    "title": "Make the next request specific",
    "instruction": "“Choose one concrete thing another person could help with. State the task, the timing, and the decision you need, rather than explaining every demand.”",
    "fallback": "“If asking feels difficult, I’ll draft one sentence privately first.”",
    "setup_seconds": 60,
    "use_seconds": 60,
    "requires": [],
    "demand_tags": [
      "outside_work",
      "unpredictable"
    ],
    "prior_tool": "support",
    "review_status": "approved",
    "content_version": "1.0",
    "family_id": "practical-help-request"
  },
  {
    "id": "C01",
    "domain": "comfort",
    "title": "Prepare one practical option",
    "instruction": "“Before a demanding work period, identify one practical option for discomfort or temperature changes: suitable layers, access to water, or knowing where an appropriate pause is possible. Choose what fits your workplace.”",
    "fallback": "“If the option is unavailable, I’ll note the practical change I need to request.”",
    "setup_seconds": 60,
    "use_seconds": 60,
    "requires": [],
    "demand_tags": [
      "public_facing",
      "meetings"
    ],
    "prior_tool": "written_list",
    "review_status": "approved",
    "content_version": "1.0",
    "family_id": "comfort-preparation"
  },
  {
    "id": "C02",
    "domain": "comfort",
    "title": "Adjust what you can control",
    "instruction": "“If you control your workspace, try one comfortable change to seating, airflow, or positioning. Notice whether it makes the task easier.”",
    "fallback": "“If a change is not possible, I’ll prepare a specific request about the workspace.”",
    "setup_seconds": 120,
    "use_seconds": 120,
    "requires": [
      "environment"
    ],
    "demand_tags": [],
    "prior_tool": null,
    "review_status": "approved",
    "content_version": "1.0",
    "family_id": "workspace-adjustment"
  },
  {
    "id": "C03",
    "domain": "comfort",
    "title": "Capture the work impact",
    "instruction": "“Write one factual example of the concern and the task it interrupted. This can help you explain the issue without deciding its cause.”",
    "fallback": "“If I do not want to log details, I’ll keep one question for a healthcare conversation.”",
    "setup_seconds": 30,
    "use_seconds": 30,
    "requires": [],
    "demand_tags": [],
    "prior_tool": "written_list",
    "review_status": "approved",
    "content_version": "1.0",
    "family_id": "health-observation"
  },
  {
    "id": "C04",
    "domain": "comfort",
    "title": "Plan a suitable pause",
    "instruction": "“If brief pauses are available, identify an appropriate point to change position or attend to comfort. Choose a movement or position that is comfortable for you.”",
    "fallback": "“If I cannot pause, I’ll consider what support or adjustment I need to request.”",
    "setup_seconds": 30,
    "use_seconds": 30,
    "requires": [
      "short_break"
    ],
    "demand_tags": [
      "public_facing"
    ],
    "prior_tool": "pause",
    "review_status": "approved",
    "content_version": "1.0",
    "family_id": "comfortable-pause"
  },
  {
    "id": "S01",
    "domain": "support",
    "title": "Start with a work example",
    "instruction": "“Write: ‘When [work situation] happens, [task impact] follows. Could we try [specific adjustment] and review it on [date]?’ You choose how much personal information to share.”",
    "fallback": "“If I am not ready to speak, I’ll save the draft privately.”",
    "setup_seconds": 60,
    "use_seconds": 60,
    "requires": [],
    "demand_tags": [
      "meetings",
      "deadlines"
    ],
    "prior_tool": "support",
    "review_status": "approved",
    "content_version": "1.0",
    "family_id": "work-request"
  },
  {
    "id": "S02",
    "domain": "support",
    "title": "Ask for the useful detail",
    "instruction": "“Prepare a practical request such as written priorities, a clearer deadline, or confirmation of next steps. Choose the detail that would make the task easier.”",
    "fallback": "“If the request is not possible, I’ll ask what alternative could meet the same need.”",
    "setup_seconds": 30,
    "use_seconds": 30,
    "requires": [],
    "demand_tags": [
      "interruptions",
      "unpredictable"
    ],
    "prior_tool": "written_followup",
    "review_status": "approved",
    "content_version": "1.0",
    "family_id": "work-request"
  },
  {
    "id": "S03",
    "domain": "support",
    "title": "Choose an appropriate person",
    "instruction": "“Consider who is best placed to help with this issue: a manager, HR contact, union representative, trusted adviser, or healthcare professional. You can decide whether and when to contact them.”",
    "fallback": "“If I am unsure whom to approach, I’ll first write the kind of help I need.”",
    "setup_seconds": 60,
    "use_seconds": 60,
    "requires": [],
    "demand_tags": [],
    "prior_tool": "support",
    "review_status": "approved",
    "content_version": "1.0",
    "family_id": "support-routing"
  },
  {
    "id": "S04",
    "domain": "support",
    "title": "Prepare a healthcare question",
    "instruction": "“Write one question about a new, persistent, or worrying concern and one example of how it affects your day. You do not need a completed tracker to seek advice.”",
    "fallback": "“If I cannot prepare more, I’ll take the question and example as they are.”",
    "setup_seconds": 60,
    "use_seconds": 60,
    "requires": [],
    "demand_tags": [],
    "prior_tool": "support",
    "review_status": "approved",
    "content_version": "1.0",
    "family_id": "healthcare-question"
  },
  {
    "id": "G01",
    "domain": "general",
    "title": "Choose one next step",
    "instruction": "“Name one small step that would make the next part of your workday clearer.”",
    "fallback": "“If the day changes, I’ll choose the next useful step again.”",
    "setup_seconds": 20,
    "use_seconds": 20,
    "requires": [],
    "demand_tags": [],
    "prior_tool": "written_list",
    "review_status": "approved",
    "content_version": "1.0",
    "family_id": "task-start"
  },
  {
    "id": "G02",
    "domain": "general",
    "title": "Prepare one question",
    "instruction": "“What do you need clarified before you can move forward? Save that question for the appropriate person.”",
    "fallback": "“If I cannot ask now, I’ll keep the question ready.”",
    "setup_seconds": 20,
    "use_seconds": 20,
    "requires": [],
    "demand_tags": [],
    "prior_tool": "support",
    "review_status": "approved",
    "content_version": "1.0",
    "family_id": "clarify-question"
  },
  {
    "id": "F05",
    "domain": "focus",
    "title": "Decision before detail",
    "instruction": "Before opening the papers, write the decision you need to make and the information that would change it. Use that question to guide your review.",
    "fallback": "If time contracts, I’ll identify the decision and the most important unanswered question.",
    "setup_seconds": 30,
    "use_seconds": 30,
    "requires": [],
    "demand_tags": [
      "deadlines"
    ],
    "prior_tool": null,
    "evidence_label": "Practical planning tool",
    "source_ids": [],
    "review_status": "draft",
    "content_version": "1.1",
    "family_id": "decision-preparation"
  },
  {
    "id": "F06",
    "domain": "focus",
    "title": "Capture an open loop",
    "instruction": "Put one distracting unfinished task in a trusted note with its next step. Return to the work in front of you.",
    "fallback": "If I cannot organise the task now, I’ll capture its name.",
    "setup_seconds": 20,
    "use_seconds": 20,
    "requires": [],
    "demand_tags": [
      "interruptions"
    ],
    "prior_tool": null,
    "evidence_label": "Practical planning tool",
    "source_ids": [],
    "review_status": "draft",
    "content_version": "1.1",
    "family_id": "return-note"
  },
  {
    "id": "F07",
    "domain": "focus",
    "title": "Read back the decision",
    "instruction": "At the end of a discussion, confirm the decision, owner and next date in one sentence. Ask the other person to correct anything missing.",
    "fallback": "If the meeting ends quickly, I’ll draft the confirmation for later.",
    "setup_seconds": 30,
    "use_seconds": 30,
    "requires": [],
    "demand_tags": [
      "meetings"
    ],
    "prior_tool": null,
    "evidence_label": "Practical planning tool",
    "source_ids": [],
    "review_status": "draft",
    "content_version": "1.1",
    "family_id": "decision-confirmation"
  },
  {
    "id": "F08",
    "domain": "focus",
    "title": "Make a question queue",
    "instruction": "If your working agreements allow, collect non-urgent questions in one list and answer them at an agreed point. Keep the established urgent route available.",
    "fallback": "If batching is not feasible, I’ll keep a return note for my own task.",
    "setup_seconds": 60,
    "use_seconds": 60,
    "requires": [
      "task_order"
    ],
    "demand_tags": [
      "interruptions"
    ],
    "prior_tool": null,
    "evidence_label": "Practical planning tool",
    "source_ids": [],
    "review_status": "draft",
    "content_version": "1.1",
    "family_id": "interruption-agreement"
  },
  {
    "id": "F09",
    "domain": "focus",
    "title": "Prepare the difficult sentence",
    "instruction": "Write the one sentence you most want to say in the presentation. Keep it available as an anchor.",
    "fallback": "If I lose the thread, I’ll return to that sentence.",
    "setup_seconds": 60,
    "use_seconds": 60,
    "requires": [],
    "demand_tags": [
      "public_facing"
    ],
    "prior_tool": null,
    "evidence_label": "Practical planning tool",
    "source_ids": [],
    "review_status": "draft",
    "content_version": "1.1",
    "family_id": "presentation-anchor"
  },
  {
    "id": "F10",
    "domain": "focus",
    "title": "Check the critical detail",
    "instruction": "Choose the one detail whose accuracy matters most in this task. Use the normal quality-check process for it; do not add repeated checking of everything.",
    "fallback": "If I remain uncertain about a consequential detail, I’ll use the appropriate review route.",
    "setup_seconds": 60,
    "use_seconds": 60,
    "requires": [],
    "demand_tags": [
      "deadlines"
    ],
    "prior_tool": null,
    "evidence_label": "Practical planning tool",
    "source_ids": [],
    "review_status": "draft",
    "content_version": "1.1",
    "family_id": "decision-preparation"
  },
  {
    "id": "E05",
    "domain": "energy",
    "title": "Prepare a food backup",
    "instruction": "Choose a convenient food option that fits your needs for a day when your usual meal is disrupted: for example, fruit with yoghurt or a suitable sandwich. Check storage and allergies.",
    "fallback": "If my usual option is unavailable, I’ll choose another suitable food I can access.",
    "setup_seconds": 60,
    "use_seconds": 60,
    "requires": [],
    "demand_tags": [
      "unpredictable"
    ],
    "prior_tool": null,
    "evidence_label": "Guidance-informed",
    "source_ids": [
      "E07"
    ],
    "review_status": "draft",
    "content_version": "1.1",
    "family_id": "food-access"
  },
  {
    "id": "E06",
    "domain": "energy",
    "title": "Check the meal opportunity",
    "instruction": "Look at the day ahead and identify where your usual meal can fit. If meetings remove that opportunity, prepare a practical scheduling request.",
    "fallback": "If the schedule changes, I’ll use my food backup when appropriate and raise a recurring access problem.",
    "setup_seconds": 60,
    "use_seconds": 60,
    "requires": [],
    "demand_tags": [
      "meetings"
    ],
    "prior_tool": null,
    "evidence_label": "Practical planning tool",
    "source_ids": [],
    "review_status": "draft",
    "content_version": "1.1",
    "family_id": "food-access"
  },
  {
    "id": "E07",
    "domain": "energy",
    "title": "Make water accessible",
    "instruction": "If convenient and permitted, keep drinking water within reach during the workday. Follow any fluid advice given for your own health needs.",
    "fallback": "If I cannot keep water nearby, I’ll identify the next appropriate opportunity to get a drink.",
    "setup_seconds": 30,
    "use_seconds": 30,
    "requires": [],
    "demand_tags": [
      "public_facing"
    ],
    "prior_tool": null,
    "evidence_label": "Guidance-informed",
    "source_ids": [
      "E07"
    ],
    "review_status": "draft",
    "content_version": "1.1",
    "family_id": "water-access"
  },
  {
    "id": "E08",
    "domain": "energy",
    "title": "Reduce one setup barrier",
    "instruction": "Prepare the materials for your next demanding task before the busy period begins. Choose one thing that makes starting easier.",
    "fallback": "If I cannot prepare everything, I’ll open the relevant file or write its location.",
    "setup_seconds": 60,
    "use_seconds": 60,
    "requires": [],
    "demand_tags": [
      "deadlines"
    ],
    "prior_tool": null,
    "evidence_label": "Practical planning tool",
    "source_ids": [],
    "review_status": "draft",
    "content_version": "1.1",
    "family_id": "prepare-materials"
  },
  {
    "id": "E09",
    "domain": "energy",
    "title": "Take an available walk",
    "instruction": "When a pause is available, try a comfortable two-minute walk or a movement option that suits your mobility. This is an optional change of activity, not a treatment.",
    "fallback": "If movement is not suitable, I’ll choose a comfortable position and a brief pause.",
    "setup_seconds": 15,
    "use_seconds": 120,
    "requires": [
      "short_break"
    ],
    "demand_tags": [
      "meetings"
    ],
    "prior_tool": null,
    "evidence_label": "Practical planning tool",
    "source_ids": [],
    "review_status": "draft",
    "content_version": "1.1",
    "family_id": "comfortable-pause"
  },
  {
    "id": "E10",
    "domain": "energy",
    "title": "Protect a minimum scope",
    "instruction": "For one task, define the required standard and what would be extra. Confirm expectations when you are unsure before spending effort on additions.",
    "fallback": "If I cannot clarify now, I’ll list the uncertain requirement for review.",
    "setup_seconds": 60,
    "use_seconds": 60,
    "requires": [],
    "demand_tags": [
      "deadlines"
    ],
    "prior_tool": null,
    "evidence_label": "Practical planning tool",
    "source_ids": [],
    "review_status": "draft",
    "content_version": "1.1",
    "family_id": "essential-scope"
  },
  {
    "id": "R05",
    "domain": "recovery",
    "title": "Ask about persistent insomnia",
    "instruction": "If trouble sleeping keeps affecting your days, add a question about CBT-I or another appropriate assessment to your appointment plan.",
    "fallback": "If I do not have an appointment yet, I’ll keep the question and consider arranging one.",
    "setup_seconds": 30,
    "use_seconds": 30,
    "requires": [],
    "demand_tags": [],
    "prior_tool": null,
    "evidence_label": "Guidance-informed",
    "source_ids": [
      "E05"
    ],
    "review_status": "draft",
    "content_version": "1.1",
    "family_id": "sleep-consultation"
  },
  {
    "id": "R06",
    "domain": "recovery",
    "title": "Note the caffeine timing",
    "instruction": "If you use caffeine and sleep is difficult, note the time of your later intake for a few occasions. Consider discussing a practical adjustment; no single cutoff fits everyone.",
    "fallback": "If tracking is burdensome, I’ll record one typical day.",
    "setup_seconds": 30,
    "use_seconds": 30,
    "requires": [],
    "demand_tags": [],
    "prior_tool": null,
    "evidence_label": "Guidance-informed",
    "source_ids": [
      "E11"
    ],
    "review_status": "draft",
    "content_version": "1.1",
    "family_id": "caffeine-observation"
  },
  {
    "id": "R07",
    "domain": "recovery",
    "title": "Make the next morning easier",
    "instruction": "Choose one small preparation for the next workday: put materials together, draft the first task, or identify the first decision.",
    "fallback": "If tonight is crowded, I’ll choose only the first task.",
    "setup_seconds": 60,
    "use_seconds": 60,
    "requires": [],
    "demand_tags": [
      "outside_work"
    ],
    "prior_tool": null,
    "evidence_label": "Practical planning tool",
    "source_ids": [],
    "review_status": "draft",
    "content_version": "1.1",
    "family_id": "prepare-materials"
  },
  {
    "id": "R08",
    "domain": "recovery",
    "title": "Plan the return from travel",
    "instruction": "Before travel, identify one decision or meeting whose timing may need discussion after the return. Prepare a proposed alternative.",
    "fallback": "If timing is fixed, I’ll ask what preparation or support is feasible.",
    "setup_seconds": 60,
    "use_seconds": 60,
    "requires": [],
    "demand_tags": [
      "unpredictable"
    ],
    "prior_tool": null,
    "evidence_label": "Practical planning tool",
    "source_ids": [],
    "review_status": "draft",
    "content_version": "1.1",
    "family_id": "travel-plan"
  },
  {
    "id": "R09",
    "domain": "recovery",
    "title": "Name the end-of-work boundary",
    "instruction": "Write what is complete enough to stop today and where you will restart. If work must continue, clarify what is actually urgent.",
    "fallback": "If I stop unexpectedly, I’ll leave a restart note.",
    "setup_seconds": 30,
    "use_seconds": 30,
    "requires": [],
    "demand_tags": [
      "deadlines"
    ],
    "prior_tool": null,
    "evidence_label": "Practical planning tool",
    "source_ids": [],
    "review_status": "draft",
    "content_version": "1.1",
    "family_id": "return-note"
  },
  {
    "id": "R10",
    "domain": "recovery",
    "title": "Ask about sleep quality",
    "instruction": "If poor sleep comes with snoring, gasping or daytime sleepiness, add those observations to a healthcare conversation about possible sleep problems.",
    "fallback": "If I am unsure what happens overnight, I’ll report what I do know.",
    "setup_seconds": 30,
    "use_seconds": 30,
    "requires": [],
    "demand_tags": [],
    "prior_tool": null,
    "evidence_label": "Guidance-informed",
    "source_ids": [
      "E04"
    ],
    "review_status": "draft",
    "content_version": "1.1",
    "family_id": "sleep-consultation"
  },
  {
    "id": "L05",
    "domain": "load",
    "title": "Gentle breathing pause",
    "instruction": "If comfortable, sit supported. Breathe gently in for about four seconds and out for about six, for up to one minute. Do not hold or force your breath. Return to normal breathing if uncomfortable.",
    "fallback": "If paced breathing does not suit me, I’ll rest my attention briefly without changing my breathing.",
    "setup_seconds": 10,
    "use_seconds": 60,
    "requires": [
      "short_break"
    ],
    "demand_tags": [
      "public_facing"
    ],
    "prior_tool": null,
    "evidence_label": "Research-informed adaptation",
    "source_ids": [
      "E08"
    ],
    "review_status": "draft",
    "content_version": "1.1",
    "family_id": "breathing"
  },
  {
    "id": "L06",
    "domain": "load",
    "title": "Optional five-minute sighing practice",
    "instruction": "At a suitable pause, gently inhale through your nose, add a small comfortable second inhale, then exhale slowly and fully without forcing. Repeat comfortably for up to five minutes. Stop if dizzy, breathless or uncomfortable.",
    "fallback": "If breathing exercises do not suit me, I’ll choose another strategy.",
    "setup_seconds": 15,
    "use_seconds": 300,
    "requires": [
      "short_break"
    ],
    "demand_tags": [],
    "prior_tool": null,
    "evidence_label": "Research-informed adaptation",
    "source_ids": [
      "E08"
    ],
    "review_status": "draft",
    "content_version": "1.1",
    "family_id": "breathing"
  },
  {
    "id": "L07",
    "domain": "load",
    "title": "Delay a reactive reply",
    "instruction": "If no urgent response is required, draft your reply and check the one outcome you want before sending it.",
    "fallback": "If a response is needed now, I’ll state the immediate fact and the next step.",
    "setup_seconds": 30,
    "use_seconds": 30,
    "requires": [],
    "demand_tags": [
      "unpredictable"
    ],
    "prior_tool": null,
    "evidence_label": "Practical planning tool",
    "source_ids": [],
    "review_status": "draft",
    "content_version": "1.1",
    "family_id": "response-pause"
  },
  {
    "id": "L08",
    "domain": "load",
    "title": "Separate the decision from the worry",
    "instruction": "Write one issue you can make a decision about today and one uncertainty you cannot resolve yet. Choose a next step for the first.",
    "fallback": "If I cannot separate them, I’ll write one question that would help.",
    "setup_seconds": 60,
    "use_seconds": 60,
    "requires": [],
    "demand_tags": [
      "deadlines"
    ],
    "prior_tool": null,
    "evidence_label": "Practical planning tool",
    "source_ids": [],
    "review_status": "draft",
    "content_version": "1.1",
    "family_id": "separate-demands"
  },
  {
    "id": "L09",
    "domain": "load",
    "title": "Set a clear boundary for interruptions (e.g., headphones on)",
    "instruction": "Agree with your team on a visible signal (like headphones, or 'do not disturb' status) that means you are doing deep work and should only be interrupted for emergencies.",
    "fallback": "If the rule cannot change, I’ll prepare a return note for my own task.",
    "setup_seconds": 60,
    "use_seconds": 60,
    "requires": [],
    "demand_tags": [
      "interruptions"
    ],
    "prior_tool": null,
    "evidence_label": "Practical planning tool",
    "source_ids": [],
    "review_status": "draft",
    "content_version": "1.1",
    "family_id": "interruption-agreement"
  },
  {
    "id": "L10",
    "domain": "load",
    "title": "Request one home-side handover",
    "instruction": "If responsibilities outside work are crowding the day, identify one concrete task someone could help with and when you need it.",
    "fallback": "If help is unavailable, I’ll reconsider the task's timing or scope where possible.",
    "setup_seconds": 60,
    "use_seconds": 60,
    "requires": [],
    "demand_tags": [
      "outside_work"
    ],
    "prior_tool": null,
    "evidence_label": "Practical planning tool",
    "source_ids": [],
    "review_status": "draft",
    "content_version": "1.1",
    "family_id": "practical-help-request"
  },
  {
    "id": "C05",
    "domain": "comfort",
    "title": "Bring the main screen in front",
    "instruction": "If you can adjust your workstation, place the screen used most often in front of you so you do not keep turning your head to read it.",
    "fallback": "If the setup is fixed, I’ll note the change to request.",
    "setup_seconds": 60,
    "use_seconds": 60,
    "requires": [
      "environment"
    ],
    "demand_tags": [],
    "prior_tool": null,
    "evidence_label": "Guidance-informed",
    "source_ids": [
      "E09"
    ],
    "review_status": "draft",
    "content_version": "1.1",
    "family_id": "workspace-adjustment"
  },
  {
    "id": "C06",
    "domain": "comfort",
    "title": "Make text easier to read",
    "instruction": "Increase text size or zoom to a comfortable level rather than leaning forward to read small text.",
    "fallback": "If the application will not enlarge, I’ll ask about an accessible format.",
    "setup_seconds": 30,
    "use_seconds": 30,
    "requires": [],
    "demand_tags": [],
    "prior_tool": null,
    "evidence_label": "Guidance-informed",
    "source_ids": [
      "E09,"
    ],
    "review_status": "draft",
    "content_version": "1.1",
    "family_id": "workspace-adjustment"
  },
  {
    "id": "C07",
    "domain": "comfort",
    "title": "Check screen height comfortably",
    "instruction": "Adjust the screen so viewing it does not require tipping your head back. Glasses and individual needs can change the best position.",
    "fallback": "If the position remains uncomfortable, I’ll request a workstation review.",
    "setup_seconds": 60,
    "use_seconds": 60,
    "requires": [
      "environment"
    ],
    "demand_tags": [],
    "prior_tool": null,
    "evidence_label": "Guidance-informed",
    "source_ids": [
      "E09"
    ],
    "review_status": "draft",
    "content_version": "1.1",
    "family_id": "workspace-adjustment"
  },
  {
    "id": "C08",
    "domain": "comfort",
    "title": "Change one pressure point",
    "instruction": "At an available pause, change position in a way that feels comfortable. Avoid forcing a stretch or staying in a painful position.",
    "fallback": "If discomfort continues or worries me, I’ll seek appropriate advice.",
    "setup_seconds": 15,
    "use_seconds": 60,
    "requires": [
      "short_break"
    ],
    "demand_tags": [],
    "prior_tool": null,
    "evidence_label": "Practical planning tool",
    "source_ids": [],
    "review_status": "draft",
    "content_version": "1.1",
    "family_id": "comfortable-pause"
  },
  {
    "id": "C09",
    "domain": "comfort",
    "title": "Prepare a temperature request",
    "instruction": "Choose the practical change you want to discuss: room airflow, a different seat, or an appropriate pause. Describe the work impact rather than assuming others know what is needed.",
    "fallback": "If the first option is unavailable, I’ll ask about an alternative.",
    "setup_seconds": 60,
    "use_seconds": 60,
    "requires": [],
    "demand_tags": [
      "meetings"
    ],
    "prior_tool": null,
    "evidence_label": "Practical planning tool",
    "source_ids": [],
    "review_status": "draft",
    "content_version": "1.1",
    "family_id": "comfort-support"
  },
  {
    "id": "C10",
    "domain": "comfort",
    "title": "Request an ergonomic review",
    "instruction": "If the workstation repeatedly makes work uncomfortable, prepare one example and ask who can review the setup.",
    "fallback": "If I cannot arrange a review yet, I’ll record the main issue to raise.",
    "setup_seconds": 30,
    "use_seconds": 30,
    "requires": [],
    "demand_tags": [],
    "prior_tool": null,
    "evidence_label": "Guidance-informed",
    "source_ids": [
      "E09,"
    ],
    "review_status": "draft",
    "content_version": "1.1",
    "family_id": "comfort-support"
  },
  {
    "id": "S05",
    "domain": "support",
    "title": "Name the decision owner",
    "instruction": "Before asking for a change, identify who can authorise it. If unsure, start by asking who owns the decision.",
    "fallback": "If the owner is unclear, I’ll prepare the request without sending it.",
    "setup_seconds": 30,
    "use_seconds": 30,
    "requires": [],
    "demand_tags": [],
    "prior_tool": null,
    "evidence_label": "Practical planning tool",
    "source_ids": [],
    "review_status": "draft",
    "content_version": "1.1",
    "family_id": "support-routing"
  },
  {
    "id": "S06",
    "domain": "support",
    "title": "Prepare two feasible options",
    "instruction": "Write your preferred adjustment and one alternative that addresses the same work issue.",
    "fallback": "If there is only one workable option, I’ll explain the need it addresses.",
    "setup_seconds": 60,
    "use_seconds": 60,
    "requires": [],
    "demand_tags": [
      "deadlines"
    ],
    "prior_tool": null,
    "evidence_label": "Practical planning tool",
    "source_ids": [],
    "review_status": "draft",
    "content_version": "1.1",
    "family_id": "work-request"
  },
  {
    "id": "S07",
    "domain": "support",
    "title": "Choose what stays private",
    "instruction": "Before a work conversation, decide which functional details are useful and which health details you prefer to handle through a confidential route.",
    "fallback": "If asked unexpectedly, I’ll request time to clarify what information is needed.",
    "setup_seconds": 30,
    "use_seconds": 30,
    "requires": [],
    "demand_tags": [
      "meetings"
    ],
    "prior_tool": null,
    "evidence_label": "Practical planning tool",
    "source_ids": [],
    "review_status": "draft",
    "content_version": "1.1",
    "family_id": "disclosure-boundary"
  },
  {
    "id": "S08",
    "domain": "support",
    "title": "Set the review question",
    "instruction": "Choose one observable question for the review: Did the new timing allow preparation? Were priorities clearer? Keep it relevant to the adjustment.",
    "fallback": "If no review date is agreed, I’ll ask when we should revisit it.",
    "setup_seconds": 30,
    "use_seconds": 30,
    "requires": [],
    "demand_tags": [],
    "prior_tool": null,
    "evidence_label": "Practical planning tool",
    "source_ids": [],
    "review_status": "draft",
    "content_version": "1.1",
    "family_id": "review-agreement"
  },
  {
    "id": "S09",
    "domain": "support",
    "title": "Record the agreed next step",
    "instruction": "After a discussion, capture the action, owner and date. Confirm uncertainties rather than assuming agreement.",
    "fallback": "If I cannot write everything now, I’ll record the next action and owner.",
    "setup_seconds": 30,
    "use_seconds": 30,
    "requires": [],
    "demand_tags": [
      "meetings"
    ],
    "prior_tool": null,
    "evidence_label": "Practical planning tool",
    "source_ids": [],
    "review_status": "draft",
    "content_version": "1.1",
    "family_id": "decision-confirmation"
  },
  {
    "id": "S10",
    "domain": "support",
    "title": "Reopen an unhelpful arrangement",
    "instruction": "If the adjustment is not helping, prepare one example and ask what should change. A trial provides information even when it does not solve the issue.",
    "fallback": "If the situation needs another route, I’ll ask who should be involved.",
    "setup_seconds": 60,
    "use_seconds": 60,
    "requires": [],
    "demand_tags": [],
    "prior_tool": null,
    "evidence_label": "Practical planning tool",
    "source_ids": [],
    "review_status": "draft",
    "content_version": "1.1",
    "family_id": "review-agreement"
  }
];
