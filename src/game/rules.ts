import { missingCakeCase } from '../case/missingCake';
import type { Character, Condition, Deduction, Location, Question, CaseSolution } from '../case/types';
import type { GameState, Theory } from './state';

function hasCondition(condition: Condition, state: GameState): boolean {
  const ids = {
    hotspot: state.discoveredHotspotIds,
    statement: state.receivedStatementIds,
    question: state.askedQuestionIds,
    deduction: state.deductionIds,
  }[condition.kind];
  return ids.includes(condition.id);
}

export function canAsk(question: Question, state: GameState): boolean {
  return (question.requires ?? []).every((condition) => hasCondition(condition, state));
}

export function availableQuestions(character: Character, state: GameState): Question[] {
  return character.questions.filter((question) => !state.askedQuestionIds.includes(question.id) && canAsk(question, state));
}

export function acquiredEvidenceIds(state: GameState): string[] {
  const acquired = new Set<string>();
  for (const hotspotId of state.discoveredHotspotIds) {
    const observationId = missingCakeCase.hotspots.find(({ id }) => id === hotspotId)?.observationId;
    if (observationId) acquired.add(observationId);
  }
  for (const evidence of missingCakeCase.evidence) {
    if (evidence.statementId && state.receivedStatementIds.includes(evidence.statementId)) acquired.add(evidence.id);
  }
  return [...acquired];
}

export function canMakeDeduction(deduction: Deduction, state: GameState): boolean {
  const acquired = new Set(acquiredEvidenceIds(state));
  return deduction.requiresEvidenceIds.every((id) => acquired.has(id) && state.selectedEvidenceIds.includes(id));
}

export function canUnlockLocation(location: Location, state: GameState): boolean {
  return !location.unlockedBy || hasCondition(location.unlockedBy, state);
}

export function canPresentContradiction(state: GameState): boolean {
  const contradiction = missingCakeCase.contradiction;
  const acquired = new Set(acquiredEvidenceIds(state));
  return state.receivedStatementIds.includes(contradiction.initialStatementId)
    && contradiction.evidenceIds.every((id) => acquired.has(id));
}

export function scoreTheory(theory: Theory, solution: CaseSolution): 'wrong' | 'partial' | 'complete' {
  const fields = ['person', 'origin', 'entryMethod', 'event', 'motive'] as const;
  const correct = fields.filter((field) => theory[field] === solution[field].value).length;
  return correct === fields.length ? 'complete' : correct === 0 ? 'wrong' : 'partial';
}
