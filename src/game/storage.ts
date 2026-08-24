import { missingCakeCase } from '../case/missingCake';
import { freshGameState, type GameState } from './state';

export const STORAGE_KEY = 'missing-cake-game-v1';
const STORAGE_VERSION = 1;

function isState(value: unknown): value is GameState {
  if (!value || typeof value !== 'object') return false;
  const state = value as Partial<GameState>;
  const arrays = ['openedLocationIds', 'discoveredHotspotIds', 'askedQuestionIds', 'receivedStatementIds', 'deductionIds', 'selectedEvidenceIds'] as const;
  return typeof state.locationId === 'string'
    && missingCakeCase.locations.some(({ id }) => id === state.locationId)
    && arrays.every((key) => Array.isArray(state[key]) && state[key].every((id) => typeof id === 'string'))
    && !!state.theory && typeof state.theory === 'object'
    && (['person', 'origin', 'entryMethod', 'event', 'motive'] as const).every((key) => typeof state.theory?.[key] === 'string')
    && (state.language === 'en' || state.language === 'ru')
    && typeof state.reconstructionStep === 'number' && Number.isInteger(state.reconstructionStep);
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
