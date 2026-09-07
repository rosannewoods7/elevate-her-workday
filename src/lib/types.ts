export type Domain = 'focus' | 'energy' | 'recovery' | 'load' | 'comfort' | 'support' | 'general';
export type WorkContext = 'desk' | 'people' | 'mixed' | 'variable' | null;
export type Control = 'task_order' | 'short_break' | 'meeting_format' | 'environment' | 'none' | 'unknown';
export type DemandTag = 'interruptions' | 'meetings' | 'deadlines' | 'public_facing' | 'unpredictable' | 'outside_work' | 'none' | 'unknown';
export type EffortBudget = 'tiny' | 'brief' | 'flexible' | null;
export type PriorTool = 'written_list' | 'pause' | 'task_order' | 'written_followup' | 'support' | 'none';
export type KeepExclude = 'keep' | 'exclude';
export type SymptomConcern = 'difficulty concentrating' | 'low energy' | 'poor sleep' | 'feeling overwhelmed' | 'feeling anxious or irritable' | 'temperature changes' | 'physical discomfort' | 'another concern' | 'nothing to record';

export interface ActionContent {
  id: string;
  family_id?: string;
  domain: Domain;
  title: string;
  instruction: string;
  fallback: string;
  setup_seconds: number;
  use_seconds: number;
  requires: Control[];
  demand_tags: DemandTag[];
  prior_tool: PriorTool | null;
  evidence_label?: 'Research-informed adaptation' | 'Guidance-informed' | 'Practical planning tool';
  source_ids?: string[];
  review_status?: string;
  content_version?: string;
}

export interface Profile {
  goal: Domain | null;
  interference: Partial<Record<Domain, number | null>>;
  work_context: WorkContext;
  controls: Control[];
  demand_tags: DemandTag[];
  effort_budget: EffortBudget;
  prior_tools: PriorTool[];
  prior_tools_preference: Partial<Record<PriorTool, KeepExclude>>;
  support_preference: 'work' | 'healthcare' | 'both' | 'private' | 'unknown'[];
  schedule: string[] | 'variable' | null;
  timezone: string;
  confirmed_primary: Domain | null;
  confirmed_secondary: Domain | null;
}

export interface DailyPlan {
  id: string;
  local_date: string; // YYYY-MM-DD
  focus: Domain;
  actions: ActionContent[];
  completed_actions: string[]; // action ids
  fallback: string;
  effective_controls: Control[];
  effective_demand: DemandTag[];
}

export interface DailyEntry {
  local_date: string;
  concerns: SymptomConcern[];
  interference: Partial<Record<Domain, number | null>>;
  note?: string;
  demand_tags: DemandTag[];
}

export interface PlanCycle {
  id: string;
  start_local_date: string;
  focus: Domain;
  goal: string | null;
  status: 'active' | 'paused' | 'completed';
}
