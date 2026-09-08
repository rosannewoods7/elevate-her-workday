import { CapacityAnswers, Approach, Demand } from './types';

export interface CapacityRouteResult {
  approach: Approach;
  focus: string; // The suggested focus
  reason_keys: string[];
  algorithm_version: 'capacity-1.0';
}

export function routeCapacity(answers: CapacityAnswers, profileFocus: string | null): CapacityRouteResult {
  const { sleep, energy, clarity, settled, demands } = answers;
  let approach: Approach = 'usual';
  const reason_keys: string[] = [];

  const d = demands || [];

  // 1. If energy=very_little OR clarity=difficult_to_concentrate OR settled=overwhelmed -> simple
  if (energy === 'very_little' || clarity === 'difficult_to_concentrate' || settled === 'overwhelmed') {
    approach = 'simple';
    if (energy === 'very_little') reason_keys.push('energy:very_little');
    if (clarity === 'difficult_to_concentrate') reason_keys.push('clarity:difficult_to_concentrate');
    if (settled === 'overwhelmed') reason_keys.push('settled:overwhelmed');
  } 
  // 2. Otherwise, if sleep is somewhat_restorative/not_restorative OR energy=some OR clarity=somewhat_scattered OR settled=some_tension -> supported
  else if (
    sleep === 'somewhat_restorative' || sleep === 'not_restorative' ||
    energy === 'some' ||
    clarity === 'somewhat_scattered' ||
    settled === 'some_tension'
  ) {
    approach = 'supported';
    if (sleep === 'not_restorative') reason_keys.push('sleep:not_restorative');
    else if (sleep === 'somewhat_restorative') reason_keys.push('sleep:somewhat_restorative');
    if (energy === 'some') reason_keys.push('energy:some');
    if (clarity === 'somewhat_scattered') reason_keys.push('clarity:somewhat_scattered');
    if (settled === 'some_tension') reason_keys.push('settled:some_tension');
  }
  // 3. Otherwise, if D05 contains concentration/conversation/presentation_decision/unpredictable -> supported
  else if (d.some(x => ['concentration', 'conversation', 'presentation_decision', 'unpredictable'].includes(x))) {
    approach = 'supported';
    if (d.includes('conversation')) reason_keys.push('demand:conversation');
    else if (d.includes('presentation_decision')) reason_keys.push('demand:presentation_decision');
    else if (d.includes('concentration')) reason_keys.push('demand:concentration');
    else if (d.includes('unpredictable')) reason_keys.push('demand:unpredictable');
  }

  // Precedence sorting for reason keys as specified:
  const reasonOrder = [
    'energy:very_little',
    'clarity:difficult_to_concentrate',
    'settled:overwhelmed',
    'sleep:not_restorative',
    'sleep:somewhat_restorative',
    'energy:some',
    'clarity:somewhat_scattered',
    'settled:some_tension',
    'demand:conversation',
    'demand:presentation_decision',
    'demand:concentration',
    'demand:unpredictable'
  ];

  const sortedReasons = reason_keys.sort((a, b) => reasonOrder.indexOf(a) - reasonOrder.indexOf(b)).slice(0, 2);

  // Focus
  let focus = profileFocus || 'general';

  if (d.includes('conversation')) focus = 'support';
  else if (d.includes('presentation_decision') || d.includes('concentration')) focus = 'focus';
  else if (d.includes('unpredictable')) focus = 'load';
  else if (clarity === 'difficult_to_concentrate') focus = 'focus';
  else if (energy === 'very_little') focus = 'energy';
  else if (settled === 'overwhelmed') focus = 'load';
  else if (sleep === 'not_restorative') focus = 'recovery';
  else if (clarity === 'somewhat_scattered') focus = 'focus';
  else if (energy === 'some') focus = 'energy';
  else if (settled === 'some_tension') focus = 'load';
  else if (sleep === 'somewhat_restorative') focus = 'recovery';

  return {
    approach,
    focus,
    reason_keys: sortedReasons,
    algorithm_version: 'capacity-1.0'
  };
}

export function formatReason(key: string): string {
  switch(key) {
    case 'energy:very_little': return 'Energy: very little';
    case 'clarity:difficult_to_concentrate': return 'Thinking: difficult to concentrate';
    case 'settled:overwhelmed': return 'Settled: overwhelmed';
    case 'sleep:not_restorative': return 'Sleep: not restorative';
    case 'sleep:somewhat_restorative': return 'Sleep: somewhat restorative';
    case 'energy:some': return 'Energy: some';
    case 'clarity:somewhat_scattered': return 'Thinking: somewhat scattered';
    case 'settled:some_tension': return 'Settled: some tension';
    case 'demand:conversation': return 'Ahead: difficult conversation';
    case 'demand:presentation_decision': return 'Ahead: presentation or major decision';
    case 'demand:concentration': return 'Ahead: sustained concentration';
    case 'demand:unpredictable': return 'Ahead: unpredictable demands';
    default: return key;
  }
}
