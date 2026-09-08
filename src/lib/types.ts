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
  
  // Premium Upgrades
  offer_daily_check?: boolean;
  discreet_mode?: boolean;
  auto_cover_on_blur?: boolean;
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
  
  // Daily Capacity Check Upgrades
  capacity_revision_id?: string | null;
  suggested_approach?: Approach | null;
  selected_approach?: Approach | null;
  approach_source?: 'suggested' | 'user_override' | 'skip' | 'profile_default' | null;
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

export type Approach = 'usual' | 'supported' | 'simple';
export type SleepAnswer = 'restorative' | 'somewhat_restorative' | 'not_restorative' | 'unsure' | null;
export type EnergyAnswer = 'plenty' | 'some' | 'very_little' | 'unsure' | null;
export type ClarityAnswer = 'clear' | 'somewhat_scattered' | 'difficult_to_concentrate' | 'unsure' | null;
export type SettledAnswer = 'settled' | 'some_tension' | 'overwhelmed' | 'unsure' | null;
export type Demand = 'routine' | 'concentration' | 'conversation' | 'presentation_decision' | 'unpredictable' | 'unsure';

export interface CapacityAnswers {
  sleep: SleepAnswer;
  energy: EnergyAnswer;
  clarity: ClarityAnswer;
  settled: SettledAnswer;
  demands: Demand[] | null;
}

export interface CapacityRevision {
  id: string;
  account_id: string;
  local_work_date: string; // YYYY-MM-DD
  timezone_at_entry: string;
  revision: number;
  status: 'draft' | 'completed' | 'skipped';
  answers: CapacityAnswers;
  suggested_approach: Approach | null;
  suggested_focus: string | null;
  reason_keys: string[];
  algorithm_version: 'capacity-1.0';
  created_at: string;
  updated_at: string;
}

export interface PreparationBrief {
  id: string;
  account_id: string;
  scenario_id: string;
  event_local_date: string | null; // optional date
  timezone: string | null;
  user_title: string;
  state: 'draft' | 'saved' | 'archived';
  current_revision: number;
  created_at: string;
  updated_at: string;
}

export interface BriefRevision {
  brief_id: string;
  revision: number;
  outcome_id: string | null;
  outcome_text: string | null;
  concern: string | null;
  intended_outcome: string;
  opening_sentence: string;
  practical_preparation: string;
  fallback: string;
  leave_with: string;
  provenance: 'template' | 'user' | 'source';
  selected_approach: string | null; // 'usual' | 'supported' | 'simple' | 'independent'
  capacity_revision_id: string | null;
  version: 'experience-1.0';
  created_at: string;
}

export interface PlaybookItem {
  id: string;
  account_id: string;
  type: 'strategy' | 'work script' | 'fallback' | 'preparation brief';
  source_id: string | null; // ID of the action, brief, etc
  source_version: string | null;
  snapshot_text: string | null; // preview text
  user_title: string;
  note: string | null;
  pinned: boolean;
  saved_to_try: boolean;
  created_at: string;
  last_used_at: string | null;
  archived_at: string | null;
}

export interface PlaybookCollection {
  id: string;
  account_id: string;
  category_key: string; // meetings, poor_sleep, priorities, support, changes, custom
  custom_label: string | null;
}

export interface PlaybookMembership {
  account_id: string;
  item_id: string;
  collection_id: string;
}

export interface DisplayPreference {
  account_id: string;
  discreet_enabled: boolean;
  auto_cover_on_blur: boolean;
  version: string;
  updated_at: string;
}

