import { missingCakeCase } from '../case/missingCake';
import type { Theory } from './state';
import { freshGameState, type GameState } from './state';
import { acquiredEvidenceIds } from './rules';

export const STORAGE_KEY = 'missing-cake-game-v1';
const STORAGE_VERSION = 1;

const theoryFields = ['person', 'origin', 'entryMethod', 'event', 'motive'] as const;

function hasUniqueKnownIds(ids: unknown, validIds: Set<string>): ids is string[] {
  return Array.isArray(ids)
    && ids.every((id) => typeof id === 'string' && validIds.has(id))
    && new Set(ids).size === ids.length;
}

function validTheory(theory: unknown): theory is Theory {
  if (!theory || typeof theory !== 'object') return false;
  return theoryFields.every((field) => {
    const value = (theory as Theory)[field];
    return typeof value === 'string' && (value === '' || missingCakeCase.solution[field].options.some(({ id }) => id === value));
  });
}

function isState(value: unknown): value is GameState {
  if (!value || typeof value !== 'object') return false;
  const state = value as Partial<GameState>;
  const locationIds = new Set(missingCakeCase.locations.map(({ id }) => id));
  const hotspotIds = new Set(missingCakeCase.hotspots.map(({ id }) => id));
  const questionIds = new Set(missingCakeCase.characters.flatMap(({ questions }) => questions.map(({ id }) => id)));
  const statementIds = new Set(missingCakeCase.statements.map(({ id }) => id));
  const deductionIds = new Set(missingCakeCase.deductions.map(({ id }) => id));
  const evidenceIds = new Set(missingCakeCase.evidence.map(({ id }) => id));
  if (typeof state.locationId !== 'string'
    || !locationIds.has(state.locationId)
    || !hasUniqueKnownIds(state.openedLocationIds, locationIds)
    || !hasUniqueKnownIds(state.discoveredHotspotIds, hotspotIds)
    || !hasUniqueKnownIds(state.askedQuestionIds, questionIds)
    || !hasUniqueKnownIds(state.receivedStatementIds, statementIds)
    || !hasUniqueKnownIds(state.deductionIds, deductionIds)
    || !hasUniqueKnownIds(state.selectedEvidenceIds, evidenceIds)
    || !state.openedLocationIds.includes(state.locationId)
    || !validTheory(state.theory)
    || (state.language !== 'en' && state.language !== 'ru')
    || typeof state.reconstructionStep !== 'number'
    || !Number.isInteger(state.reconstructionStep)
    || state.reconstructionStep < 0
    || state.reconstructionStep >= missingCakeCase.reconstruction.length) return false;

  const candidate = state as GameState;
  const acquired = new Set(acquiredEvidenceIds(candidate));
  if (candidate.selectedEvidenceIds.some((id) => !acquired.has(id))) return false;

  return candidate.openedLocationIds.every((locationId) => {
    const location = missingCakeCase.locations.find(({ id }) => id === locationId)!;
    const openedByQuestion = missingCakeCase.characters.some(({ questions }) => questions.some((question) => candidate.askedQuestionIds.includes(question.id) && question.unlockLocationIds?.includes(locationId)));
    return !location.unlockedBy || openedByQuestion || ({ hotspot: candidate.discoveredHotspotIds, statement: candidate.receivedStatementIds, question: candidate.askedQuestionIds, deduction: candidate.deductionIds }[location.unlockedBy.kind].includes(location.unlockedBy.id));
  });
}

export function loadGame(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return freshGameState();
    const envelope: unknown = JSON.parse(raw);
    if (!envelope || typeof envelope !== 'object' || (envelope as { version?: unknown }).version !== STORAGE_VERSION || !isState((envelope as { state?: unknown }).state)) return freshGameState();
    return JSON.parse(JSON.stringify((envelope as { state: GameState }).state)) as GameState;
  } catch {
    return freshGameState();
  }
}

export function saveGame(state: GameState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: STORAGE_VERSION, state }));
  } catch {
    // Storage can be blocked by browser privacy settings; gameplay stays in memory.
  }
}
