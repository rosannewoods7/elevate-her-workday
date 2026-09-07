import { describe, it, expect } from 'vitest';
import { suggestFocus, selectActions, RoutingContext } from './routing';
import { Profile } from './types';

describe('Routing Rules', () => {
  it('1. Low-control focus day', () => {
    // Q01=focus; controls=none; budget=tiny; demand=interruptions; no exclusions. 
    // Expected F01 then F02. F04 must never appear.
    const ctx: RoutingContext = {
      effectiveControls: [], // 'none' translates to empty
      effectiveDemand: ['interruptions'],
      effortBudget: 'tiny',
      keptTools: [],
      excludedActions: [],
      helpfulActions: []
    };
    
    const actions = selectActions('focus', null, ctx);
    
    expect(actions.length).toBe(2);
    expect(actions[0].id).toBe('F01');
    expect(actions[1].id).toBe('F02');
    expect(actions.find(a => a.id === 'F04')).toBeUndefined();
  });

  it('2. User preference wins', () => {
    // Q01=support; Q02 recovery=3, support=1. Primary=support.
    const profile = {
      goal: 'support',
      interference: { recovery: 3, support: 1 }
    } as unknown as Profile;
    
    const focus = suggestFocus(profile);
    expect(focus.primary).toBe('support');
    
    const ctx: RoutingContext = {
      effectiveControls: [],
      effectiveDemand: [],
      effortBudget: 'tiny',
      keptTools: [],
      excludedActions: [],
      helpfulActions: []
    };
    const actions = selectActions(focus.primary, focus.secondary, ctx);
    expect(actions[0].id).toBe('S01');
    expect(actions[1].id).toBe('S02');
  });

  it('3. Unknown is unknown', () => {
    // Q01=general; all Q02 null; no controls/budget. G01 then G02.
    const profile = {
      goal: 'general',
      interference: {}
    } as unknown as Profile;
    
    const focus = suggestFocus(profile);
    expect(focus.primary).toBe('general');
    
    const ctx: RoutingContext = {
      effectiveControls: [],
      effectiveDemand: [],
      effortBudget: null,
      keptTools: [],
      excludedActions: [],
      helpfulActions: []
    };
    const actions = selectActions(focus.primary, focus.secondary, ctx);
    expect(actions[0].id).toBe('G01');
    expect(actions[1].id).toBe('G02');
  });

  it('5. Tie', () => {
    // Q01=general; Q02 focus=2, energy=2. Tie-break: focus, energy, recovery...
    const profile = {
      goal: 'general',
      interference: { focus: 2, energy: 2 }
    } as unknown as Profile;
    
    const focus = suggestFocus(profile);
    expect(focus.primary).toBe('focus'); // focus comes first in DOMAIN_ORDER
  });
  
  it('6. Constraint filter before rank', () => {
    // Primary=focus, budget=brief, controls=none, demand=deadlines.
    // F04 excluded despite tag match. F01 eligible.
    const ctx: RoutingContext = {
      effectiveControls: [],
      effectiveDemand: ['deadlines'],
      effortBudget: 'brief',
      keptTools: [],
      excludedActions: [],
      helpfulActions: []
    };
    const actions = selectActions('focus', null, ctx);
    expect(actions.find(a => a.id === 'F04')).toBeUndefined();
    expect(actions[0].id).toBe('F01');
  });
});
