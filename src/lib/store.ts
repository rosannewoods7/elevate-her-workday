import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from './supabase';
import { 
  Profile, 
  DailyPlan, 
  DailyEntry, 
  PlanCycle, 
  Domain, 
  ActionContent,
  Control,
  DemandTag,
  EffortBudget,
  PriorTool
} from './types';
import { suggestFocus, selectActions, RoutingContext } from './routing';

export interface AppState {
  hydrateFromCloud: (userId: string) => Promise<void>;
  profile: Profile | null;
  dailyPlans: Record<string, DailyPlan>; // keyed by local_date
  dailyEntries: Record<string, DailyEntry>; // keyed by local_date
  planCycle: PlanCycle | null;
  
  excludedActionsPerm: string[];
  excludedActionsToday: Record<string, string[]>; // keyed by local_date
  helpfulActions: string[];
  
  // Premium Upgrades (Local overrides for demo/testing until DB is wired)
  capacityChecks: Record<string, any>;
  saveCapacityCheck: (local_date: string, data: any) => void;
  
  preparationBriefs: Record<string, any>;
  savePreparationBrief: (brief: any) => void;
  deletePreparationBrief: (id: string) => void;
  
  playbookItems: Record<string, any>;
  savePlaybookItem: (item: any) => void;
  deletePlaybookItem: (id: string) => void;
  
  setProfile: (profile: Profile) => void;
  updateProfile: (updates: Partial<Profile>) => void;
  
  generateDailyPlan: (local_date: string, explicitFocus?: Domain, explicitControls?: Control[], explicitDemand?: DemandTag[], approach?: "usual" | "supported" | "simple" | null) => DailyPlan;
  saveDailyPlan: (plan: DailyPlan) => void;
  
  saveDailyEntry: (entry: DailyEntry) => void;
  
  markActionHelpful: (actionId: string, isHelpful: boolean) => void;
  excludeAction: (actionId: string, isPermanent: boolean, local_date?: string) => void;
  swapAction: (local_date: string, actionIdToSwap: string) => void;
  
  resetDemo: () => void;
}

const defaultProfile: Profile = {
  goal: null,
  interference: {},
  work_context: null,
  controls: [],
  demand_tags: [],
  effort_budget: null,
  prior_tools: [],
  prior_tools_preference: {},
  support_preference: [],
  schedule: null,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  confirmed_primary: null,
  confirmed_secondary: null,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      hydrateFromCloud: async (userId: string) => {
        try {
          const [
            { data: profileData },
            { data: planData },
            { data: playbookData },
            { data: briefData }
          ] = await Promise.all([
            supabase.from('profiles').select('full_profile').eq('account_id', userId).single(),
            supabase.from('daily_plans').select('local_date, full_plan').eq('account_id', userId),
            supabase.from('playbook_items').select('full_item').eq('account_id', userId),
            supabase.from('preparation_briefs').select('full_brief').eq('account_id', userId)
          ]);

          set((state) => {
            const newPlans = { ...state.dailyPlans };
            planData?.forEach(p => { if (p.full_plan) newPlans[p.local_date] = p.full_plan; });
            
            const newPlaybook = { ...state.playbookItems };
            playbookData?.forEach(p => { if (p.full_item) newPlaybook[p.full_item.id] = p.full_item; });
            
            const newBriefs = { ...state.preparationBriefs };
            briefData?.forEach(b => { if (b.full_brief) newBriefs[b.full_brief.id] = b.full_brief; });

            return {
              profile: profileData?.full_profile || state.profile,
              dailyPlans: newPlans,
              playbookItems: newPlaybook,
              preparationBriefs: newBriefs,
            };
          });
        } catch (err) {
          console.error("Hydration error:", err);
        }
      },
      profile: null,
      dailyPlans: {},
      dailyEntries: {},
      planCycle: null,
      excludedActionsPerm: [],
      excludedActionsToday: {},
      helpfulActions: [],
      capacityChecks: {},
      saveCapacityCheck: (local_date, data) => set((state) => ({
        capacityChecks: { ...state.capacityChecks, [local_date]: data }
      })),
      
      preparationBriefs: {},
      savePreparationBrief: (brief) => set((state) => ({
        preparationBriefs: { ...state.preparationBriefs, [brief.id]: brief }
      })),
      deletePreparationBrief: (id) => set((state) => {
        const next = { ...state.preparationBriefs };
        delete next[id];
        return { preparationBriefs: next };
      }),
      
      playbookItems: {},
      savePlaybookItem: (item) => set((state) => ({
        playbookItems: { ...state.playbookItems, [item.id]: item }
      })),
      deletePlaybookItem: (id) => set((state) => {
        const next = { ...state.playbookItems };
        delete next[id];
        return { playbookItems: next };
      }),
      
      setProfile: (profile) => set({ profile }),
      updateProfile: (updates) => set((state) => ({ 
        profile: state.profile ? { ...state.profile, ...updates } : { ...defaultProfile, ...updates } 
      })),
      
      generateDailyPlan: (local_date, explicitFocus, explicitControls, explicitDemand, approach) => {
        const state = get();
        const profile = state.profile || defaultProfile;
        
        const focus = explicitFocus || profile.confirmed_primary || suggestFocus(profile).primary;
        const controls = explicitControls ?? profile.controls;
        // explicit none in controls clears it
        const effectiveControls = controls.includes('none') ? [] : controls;
        
        const demand = explicitDemand ?? profile.demand_tags;
        const effectiveDemand = demand.includes('none') ? [] : demand;
        
        const excludedToday = state.excludedActionsToday[local_date] || [];
        const excludedPerm = state.excludedActionsPerm;
        
        // Exclude tools the user didn't want to keep
        const excludeTools = Object.entries(profile.prior_tools_preference)
          .filter(([_, pref]) => pref === 'exclude')
          .map(([tool]) => tool);
        
        const keptTools = profile.prior_tools.filter(t => profile.prior_tools_preference[t as PriorTool] === 'keep');
        
        const ctx: RoutingContext = {
          effectiveControls,
          effectiveDemand,
          effortBudget: profile.effort_budget,
          keptTools: keptTools as PriorTool[],
          excludedActions: [...excludedPerm, ...excludedToday],
          helpfulActions: state.helpfulActions,
          pinnedActions: [],
          recentFamilies: [], approach
        };
        
        const actions = selectActions(focus, profile.confirmed_secondary, ctx);
        const finalActions = actions.filter(a => !a.prior_tool || !excludeTools.includes(a.prior_tool));
        
        return {
          id: crypto.randomUUID(),
          local_date,
          focus,
          actions: finalActions,
          completed_actions: [],
          fallback: finalActions.length > 0 ? finalActions[0].fallback : 'If the day changes, I’ll choose the next useful step again.',
          effective_controls: effectiveControls,
          effective_demand: effectiveDemand,
          suggested_approach: approach,
          selected_approach: approach,
          approach_source: approach ? "suggested" : null
        };
      },
      
      saveDailyPlan: (plan) => set((state) => ({
        dailyPlans: { ...state.dailyPlans, [plan.local_date]: plan }
      })),
      
      saveDailyEntry: (entry) => set((state) => ({
        dailyEntries: { ...state.dailyEntries, [entry.local_date]: entry }
      })),
      
      markActionHelpful: (actionId, isHelpful) => set((state) => {
        const setHelpful = new Set(state.helpfulActions);
        if (isHelpful) setHelpful.add(actionId);
        else setHelpful.delete(actionId);
        return { helpfulActions: Array.from(setHelpful) };
      }),
      
      excludeAction: (actionId, isPermanent, local_date) => set((state) => {
        if (isPermanent) {
          const setPerm = new Set(state.excludedActionsPerm);
          setPerm.add(actionId);
          return { excludedActionsPerm: Array.from(setPerm) };
        } else if (local_date) {
          const today = state.excludedActionsToday[local_date] || [];
          return {
            excludedActionsToday: {
              ...state.excludedActionsToday,
              [local_date]: [...today, actionId]
            }
          };
        }
        return state;
      }),
      
      swapAction: (local_date, actionIdToSwap) => {
        const state = get();
        const plan = state.dailyPlans[local_date];
        if (!plan) return;
        
        // Exclude this action for today so it doesn't get picked again
        const todayExcluded = state.excludedActionsToday[local_date] || [];
        const newTodayExcluded = [...todayExcluded, actionIdToSwap];
        set({ excludedActionsToday: { ...state.excludedActionsToday, [local_date]: newTodayExcluded } });
        
        // Re-generate plan with updated exclusions
        const newPlan = get().generateDailyPlan(local_date, plan.focus, plan.effective_controls, plan.effective_demand);
        // We only want to replace the swapped action, but generateDailyPlan creates a new plan.
        // Let's just manually find a replacement.
        
        const profile = state.profile || defaultProfile;
        const ctx: RoutingContext = {
          effectiveControls: plan.effective_controls,
          effectiveDemand: plan.effective_demand,
          effortBudget: profile.effort_budget,
          keptTools: profile.prior_tools.filter(t => profile.prior_tools_preference[t as PriorTool] === 'keep') as PriorTool[],
          excludedActions: [...state.excludedActionsPerm, ...newTodayExcluded],
          helpfulActions: state.helpfulActions,
          pinnedActions: [],
          recentFamilies: []
        };
        
        const excludeTools = Object.entries(profile.prior_tools_preference)
          .filter(([_, pref]) => pref === 'exclude')
          .map(([tool]) => tool);
          
        const allCandidates = selectActions(plan.focus, profile.confirmed_secondary, ctx);
        const finalCandidates = allCandidates.filter(a => !a.prior_tool || !excludeTools.includes(a.prior_tool));
        
        // Try to keep the action that wasn't swapped, and just replace the one that was
        const otherAction = plan.actions.find(a => a.id !== actionIdToSwap);
        
        const newActions: ActionContent[] = [];
        if (otherAction) newActions.push(otherAction);
        
        // Add a new one from candidates that isn't the other action
        const replacement = finalCandidates.find(a => a.id !== otherAction?.id);
        if (replacement) newActions.push(replacement);
        
        set((state) => ({
          dailyPlans: {
            ...state.dailyPlans,
            [local_date]: { ...plan, actions: newActions, fallback: newActions.length > 0 ? newActions[0].fallback : 'If the day changes, I’ll choose the next useful step again.' }
          }
        }));
      },
      
      resetDemo: () => set({
        profile: null,
        dailyPlans: {},
        dailyEntries: {},
        planCycle: null,
        excludedActionsPerm: [],
        excludedActionsToday: {},
        helpfulActions: [],
      })
    }),
    {
      name: 'elevate-her-storage',
    }
  )
);


// Optimistic Cloud Sync
if (typeof window !== 'undefined') {
  useAppStore.subscribe(async (state, prevState) => {
    const { data: { session } } = await supabase.auth.getSession();
    const uid = session?.user?.id;
    if (!uid) return;

    // Sync Profile
    if (state.profile !== prevState.profile && state.profile) {
      supabase.from('profiles').upsert({ account_id: uid, full_profile: state.profile }).then();
    }
    
    // Sync Daily Plans
    if (state.dailyPlans !== prevState.dailyPlans) {
      for (const date in state.dailyPlans) {
        if (state.dailyPlans[date] !== prevState.dailyPlans[date]) {
          supabase.from('daily_plans').upsert({ 
            account_id: uid, 
            local_date: date, 
            full_plan: state.dailyPlans[date] 
          }, { onConflict: 'account_id,local_date' }).then();
        }
      }
    }

    // Sync Playbook Items
    if (state.playbookItems !== prevState.playbookItems) {
      for (const id in state.playbookItems) {
        if (state.playbookItems[id] !== prevState.playbookItems[id]) {
          const item = state.playbookItems[id];
          supabase.from('playbook_items').upsert({
            id: item.id,
            account_id: uid,
            type: item.type,
            source_id: item.source_id,
            user_title: item.user_title,
            pinned: item.pinned,
            saved_to_try: item.saved_to_try,
            full_item: item
          }).then();
        }
      }
    }

    // Sync Preparation Briefs
    if (state.preparationBriefs !== prevState.preparationBriefs) {
      for (const id in state.preparationBriefs) {
        if (state.preparationBriefs[id] !== prevState.preparationBriefs[id]) {
          const brief = state.preparationBriefs[id];
          supabase.from('preparation_briefs').upsert({
            id: brief.id,
            account_id: uid,
            scenario_id: brief.scenario_id,
            user_title: brief.user_title,
            state: brief.state,
            full_brief: brief
          }).then();
        }
      }
    }
  });
}
