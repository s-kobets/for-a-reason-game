import { missingCakeCase } from '../case/missingCake';
import type { Language } from '../case/types';
import { acquiredEvidenceIds, canAsk, canMakeDeduction, canPresentContradiction, canUnlockLocation } from './rules';
import { freshGameState, type GameState, type Theory } from './state';

export type GameAction =
  | { type: 'discoverHotspot'; hotspotId: string }
  | { type: 'askQuestion'; questionId: string }
  | { type: 'addStatement'; statementId: string }
  | { type: 'unlockLocation'; locationId: string }
  | { type: 'selectEvidence'; evidenceId: string }
  | { type: 'makeDeduction'; deductionId: string }
  | { type: 'presentContradiction' }
  | { type: 'setTheory'; theory: Theory }
  | { type: 'setLanguage'; language: Language }
  | { type: 'setLocation'; locationId: string }
  | { type: 'setReconstructionStep'; step: number }
  | { type: 'reset' };

const add = (ids: string[], id: string) => ids.includes(id) ? ids : [...ids, id];

function unlockSatisfiedLocations(state: GameState): GameState {
  const openedLocationIds = missingCakeCase.locations
    .filter(({ unlockedBy }) => !unlockedBy || ({ hotspot: state.discoveredHotspotIds, statement: state.receivedStatementIds, question: state.askedQuestionIds, deduction: state.deductionIds }[unlockedBy.kind].includes(unlockedBy.id)))
    .map(({ id }) => id);
  return { ...state, openedLocationIds: [...new Set([...state.openedLocationIds, ...openedLocationIds])] };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  if (action.type === 'reset') return freshGameState();

  let next = state;
  switch (action.type) {
    case 'discoverHotspot': {
      const hotspot = missingCakeCase.hotspots.find(({ id }) => id === action.hotspotId);
      if (!hotspot) return state;
      next = { ...state, discoveredHotspotIds: add(state.discoveredHotspotIds, action.hotspotId) };
      break;
    }
    case 'askQuestion': {
      const owner = missingCakeCase.characters.find(({ questions }) => questions.some(({ id }) => id === action.questionId));
      const question = owner?.questions.find(({ id }) => id === action.questionId);
      if (!owner || !question || owner.locationId !== state.locationId || state.askedQuestionIds.includes(action.questionId) || !canAsk(question, state)) return state;
      next = { ...state, askedQuestionIds: add(state.askedQuestionIds, action.questionId), receivedStatementIds: question.responseStatementIds.reduce(add, state.receivedStatementIds) };
      next = { ...next, openedLocationIds: [...new Set([...next.openedLocationIds, ...(question.unlockLocationIds ?? [])])] };
      break;
    }
    case 'addStatement':
      if (!missingCakeCase.statements.some(({ id }) => id === action.statementId)
        || state.receivedStatementIds.includes(action.statementId)
        || !missingCakeCase.characters.some(({ questions }) => questions.some((question) => state.askedQuestionIds.includes(question.id) && question.responseStatementIds.includes(action.statementId)))) return state;
      next = { ...state, receivedStatementIds: add(state.receivedStatementIds, action.statementId) };
      break;
    case 'unlockLocation':
      {
        const location = missingCakeCase.locations.find(({ id }) => id === action.locationId);
        if (!location || !canUnlockLocation(location, state)) return state;
      }
      next = { ...state, openedLocationIds: add(state.openedLocationIds, action.locationId) };
      break;
    case 'selectEvidence':
      if (!missingCakeCase.evidence.some(({ id }) => id === action.evidenceId) || !acquiredEvidenceIds(state).includes(action.evidenceId)) return state;
      next = { ...state, selectedEvidenceIds: add(state.selectedEvidenceIds, action.evidenceId) };
      break;
    case 'makeDeduction': {
      const deduction = missingCakeCase.deductions.find(({ id }) => id === action.deductionId);
      if (!deduction || state.deductionIds.includes(action.deductionId) || !canMakeDeduction(deduction, state)) return state;
      next = { ...state, deductionIds: add(state.deductionIds, action.deductionId) };
      break;
    }
    case 'presentContradiction':
      if (!canPresentContradiction(state) || state.receivedStatementIds.includes(missingCakeCase.contradiction.revealedStatementId)) return state;
      next = { ...state, receivedStatementIds: add(state.receivedStatementIds, missingCakeCase.contradiction.revealedStatementId) };
      break;
    case 'setTheory':
      next = { ...state, theory: { ...action.theory } };
      break;
    case 'setLanguage':
      next = { ...state, language: action.language };
      break;
    case 'setLocation':
      if (!state.openedLocationIds.includes(action.locationId)) return state;
      next = { ...state, locationId: action.locationId };
      break;
    case 'setReconstructionStep':
      if (!Number.isInteger(action.step) || action.step < 0 || action.step >= missingCakeCase.reconstruction.length) return state;
      next = { ...state, reconstructionStep: action.step };
      break;
  }
  return unlockSatisfiedLocations(next);
}
