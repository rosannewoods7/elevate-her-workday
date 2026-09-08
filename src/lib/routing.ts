import { Domain, Profile, ActionContent, Control, DemandTag, EffortBudget, PriorTool } from './types';
import { actionLibrary } from './action-library';

const DOMAIN_ORDER: Domain[] = ['focus', 'energy', 'recovery', 'load', 'comfort', 'support'];

export function getBudgetSeconds(budget: EffortBudget, approach?: 'usual' | 'supported' | 'simple' | null): number {
  if (approach === 'simple') return 60; // Hard cap
  if (budget === 'flexible') return 300;
  if (budget === 'brief') return 120;
  return 60; // tiny or null
}

export function suggestFocus(profile: Profile): { primary: Domain, secondary: Domain | null } {
  if (profile.goal && profile.goal !== 'general') {
    let secondary: Domain | null = null;
    let maxInterference = -1;
    for (const domain of DOMAIN_ORDER) {
      if (domain === profile.goal) continue;
      const val = profile.interference[domain];
      if (val != null && val >= 2 && val > maxInterference) {
        maxInterference = val;
        secondary = domain;
      }
    }
    return { primary: profile.goal, secondary };
  }

  let maxInterference = 0;
  let primary: Domain = 'general';
  
  for (const domain of DOMAIN_ORDER) {
    const val = profile.interference[domain];
    if (val != null && val > maxInterference) {
      maxInterference = val;
      primary = domain;
    }
  }

  let secondary: Domain | null = null;
  if (primary !== 'general') {
    let secondMax = 0;
    for (const domain of DOMAIN_ORDER) {
      if (domain === primary) continue;
      const val = profile.interference[domain];
      if (val != null && val >= 2 && val > secondMax) {
        secondMax = val;
        secondary = domain;
      }
    }
  }

  return { primary, secondary };
}

export interface RoutingContext {
  effectiveControls: Control[];
  effectiveDemand: DemandTag[];
  effortBudget: EffortBudget;
  keptTools: PriorTool[];
  excludedActions: string[];
  helpfulActions: string[];
  pinnedActions: string[];
  recentFamilies: string[]; // Families shown recently, to avoid duplicating
  approach?: 'usual' | 'supported' | 'simple' | null;
}

function scoreAction(action: ActionContent, ctx: RoutingContext): number {
  let score = 0;
  const matchDemand = action.demand_tags.some(tag => ctx.effectiveDemand.includes(tag));
  if (matchDemand) score += 2;
  
  if (action.prior_tool && ctx.keptTools.includes(action.prior_tool)) score += 1;
  if (ctx.helpfulActions.includes(action.id)) score += 1;
  
  // Penalize recently shown families heavily to force rotation, unless they are pinned
  if (action.family_id && ctx.recentFamilies.includes(action.family_id)) {
    score -= 100; 
  }
  
  return score;
}

export function selectActions(
  primaryDomain: Domain, 
  secondaryDomain: Domain | null, 
  ctx: RoutingContext
): ActionContent[] {
  const budgetSec = getBudgetSeconds(ctx.effortBudget, ctx.approach);
  
  const eligibleActions = actionLibrary.filter(action => {
    if (ctx.excludedActions.includes(action.id)) return false;
    // Both setup and use seconds must fit within the budget
    if ((action.setup_seconds || 0) > budgetSec) return false;
    if ((action.use_seconds || 0) > budgetSec) return false;
    
    // required control must be explicitly present
    for (const req of action.requires) {
      if (!ctx.effectiveControls.includes(req)) return false;
    }
    return true;
  });

  const getSortedForDomain = (domain: Domain, excludeFamilies: string[]) => {
    return eligibleActions
      .filter(a => a.domain === domain)
      .filter(a => !a.family_id || !excludeFamilies.includes(a.family_id))
      .map(a => ({ action: a, score: scoreAction(a, ctx) }))
      .sort((a, b) => {
        if (a.score !== b.score) return b.score - a.score;
        return a.action.id.localeCompare(b.action.id);
      })
      .map(a => a.action);
  };

  const selected: ActionContent[] = [];
  const selectedFamilies: string[] = [];

  // Pinned card
  if (ctx.pinnedActions.length > 0) {
    const pinnedCard = eligibleActions.find(a => a.id === ctx.pinnedActions[0]);
    if (pinnedCard) {
      selected.push(pinnedCard);
      if (pinnedCard.family_id) selectedFamilies.push(pinnedCard.family_id);
    }
  }

  // Demand Preparation Preference (Supported / Simple)
  if ((ctx.approach === 'supported' || ctx.approach === 'simple') && selected.length === 0) {
    const DEMAND_MAP: Record<string, { domain: Domain, ids: string[] }> = {
      conversation: { domain: 'support', ids: ['S01', 'S07', 'S06', 'S02', 'S05'] },
      presentation_decision: { domain: 'focus', ids: ['F03', 'F09', 'F05', 'F01', 'F10'] },
      concentration: { domain: 'focus', ids: ['F01', 'F05', 'F02', 'F06', 'F04'] },
      unpredictable: { domain: 'load', ids: ['L02', 'L01', 'L04', 'L09', 'L08'] }
    };
    
    let demandCardFound = false;
    for (const demand of ctx.effectiveDemand) {
      const mapping = DEMAND_MAP[demand];
      if (mapping && mapping.domain === primaryDomain) {
        for (const pid of mapping.ids) {
          const card = eligibleActions.find(a => a.id === pid && (!a.family_id || !selectedFamilies.includes(a.family_id)));
          if (card) {
            selected.push(card);
            if (card.family_id) selectedFamilies.push(card.family_id);
            demandCardFound = true;
            break;
          }
        }
      }
      if (demandCardFound) break;
    }
  }

  // Primary card
  if (selected.length < (ctx.approach === 'simple' ? 1 : 2)) {
    const primaryActions = getSortedForDomain(primaryDomain, selectedFamilies);
    if (primaryActions.length > 0) {
      const card = primaryActions[0];
      selected.push(card);
      if (card.family_id) selectedFamilies.push(card.family_id);
    }
  }

  // Secondary card
  if (selected.length < (ctx.approach === 'simple' ? 1 : 2)) {
    if (secondaryDomain) {
      const secondaryActions = getSortedForDomain(secondaryDomain, selectedFamilies);
      if (secondaryActions.length > 0) {
        selected.push(secondaryActions[0]);
      }
    } else {
      const primaryActions = getSortedForDomain(primaryDomain, selectedFamilies);
      if (primaryActions.length > 0) {
        selected.push(primaryActions[0]);
      }
    }
  }

  const uniqueSelected = selected.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);
  const maxCards = ctx.approach === 'simple' ? 1 : 2;

  if (uniqueSelected.length < maxCards) {
    const g01 = eligibleActions.find(a => a.id === 'G01');
    if (g01 && !uniqueSelected.find(a => a.id === 'G01')) uniqueSelected.push(g01);
  }
  
  if (uniqueSelected.length < maxCards) {
    const g02 = eligibleActions.find(a => a.id === 'G02');
    if (g02 && !uniqueSelected.find(a => a.id === 'G02')) uniqueSelected.push(g02);
  }

  return uniqueSelected.slice(0, maxCards);
}
