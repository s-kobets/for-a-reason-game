import { missingCakeCase } from '../case/missingCake';
import type { Character, Condition, Deduction, Question, CaseSolution } from '../case/types';
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

export function canMakeDeduction(deduction: Deduction, state: GameState): boolean {
  return deduction.requiresEvidenceIds.every((id) => state.selectedEvidenceIds.includes(id));
}

export function canPresentContradiction(state: GameState): boolean {
  const contradiction = missingCakeCase.contradiction;
  const observedEvidenceIds = new Set(
    state.discoveredHotspotIds.flatMap((hotspotId) => {
      const hotspot = missingCakeCase.hotspots.find(({ id }) => id === hotspotId);
      return hotspot?.observationId ? [hotspot.observationId] : [];
    }),
  );
  return state.receivedStatementIds.includes(contradiction.initialStatementId)
    && contradiction.evidenceIds.every((id) => observedEvidenceIds.has(id));
}

export function scoreTheory(theory: Theory, solution: CaseSolution): 'wrong' | 'partial' | 'complete' {
  const fields = ['person', 'origin', 'entryMethod', 'event', 'motive'] as const;
  const correct = fields.filter((field) => theory[field] === solution[field].value).length;
  return correct === fields.length ? 'complete' : correct === 0 ? 'wrong' : 'partial';
}
