import { beforeEach, describe, expect, it } from 'vitest';
import { missingCakeCase } from '../case/missingCake';
import { availableQuestions, canAsk, canPresentContradiction, canMakeDeduction, scoreTheory } from './rules';
import { initialGameState, type GameState, type Theory } from './state';
import { gameReducer } from './reducer';
import { loadGame, saveGame, STORAGE_KEY } from './storage';

const completeTheory: Theory = {
  person: 'petya',
  origin: 'kitchen',
  entryMethod: 'window',
  event: 'moved-to-shed',
  motive: 'surprise',
};

describe('investigation rules', () => {
  it('requires every evidence item before making a deduction', () => {
    const deduction = missingCakeCase.deductions.find(({ id }) => id === 'window-route')!;
    const state = { ...initialGameState, selectedEvidenceIds: ['window-open', 'door-unused'] };

    expect(canMakeDeduction(deduction, state)).toBe(false);
    expect(canMakeDeduction(deduction, { ...state, selectedEvidenceIds: [...state.selectedEvidenceIds, 'footprints-inward'] })).toBe(true);
  });

  it('gates questions on typed conditions and returns only available questions', () => {
    const petya = missingCakeCase.characters.find(({ id }) => id === 'petya')!;
    const question = petya.questions.find(({ id }) => id === 'ask-petya-cake')!;

    expect(canAsk(question, initialGameState)).toBe(false);
    const state = { ...initialGameState, deductionIds: ['petya-likely-took-cake'] };
    expect(canAsk(question, state)).toBe(true);
    expect(availableQuestions(petya, state).map(({ id }) => id)).toContain('ask-petya-cake');
  });

  it('unlocks contradiction only after its statement and evidence are found', () => {
    let state = gameReducer(initialGameState, { type: 'addStatement', statementId: 'petya-denies-garden' });
    expect(canPresentContradiction(state)).toBe(false);
    state = gameReducer(state, { type: 'discoverHotspot', hotspotId: 'garden-path' });
    state = gameReducer(state, { type: 'discoverHotspot', hotspotId: 'scarf-thread' });
    expect(state.discoveredHotspotIds).toEqual(['garden-path', 'scarf-thread']);
    expect(state.receivedStatementIds).toContain('petya-denies-garden');
    expect(canPresentContradiction(state)).toBe(true);
    state = gameReducer(state, { type: 'presentContradiction' });
    expect(state.receivedStatementIds).toContain('petya-admits-window');
  });

  it('unlocks Shed from Petya admission and deduplicates IDs', () => {
    const once = gameReducer(initialGameState, { type: 'addStatement', statementId: 'petya-admits-shed' });
    const twice = gameReducer(once, { type: 'addStatement', statementId: 'petya-admits-shed' });

    expect(once.openedLocationIds).toContain('shed');
    expect(twice.receivedStatementIds).toEqual(['petya-admits-shed']);
    expect(twice.openedLocationIds).toEqual(once.openedLocationIds);
  });

  it('scores theories as wrong, partial, or complete', () => {
    expect(scoreTheory({ person: 'anya', origin: 'garden', entryMethod: 'back-door', event: 'ate-it', motive: 'prank' }, missingCakeCase.solution)).toBe('wrong');
    expect(scoreTheory({ ...completeTheory, motive: 'prank' }, missingCakeCase.solution)).toBe('partial');
    expect(scoreTheory(completeTheory, missingCakeCase.solution)).toBe('complete');
  });

  it('does not mutate prior state when reducing', () => {
    const previous: GameState = { ...initialGameState, discoveredHotspotIds: [] };
    const next = gameReducer(previous, { type: 'discoverHotspot', hotspotId: 'cake-stand' });

    expect(previous.discoveredHotspotIds).toEqual([]);
    expect(next.discoveredHotspotIds).toEqual(['cake-stand']);
  });
});

describe('game storage', () => {
  beforeEach(() => localStorage.clear());

  it('falls back to initial state for malformed or incompatible data', () => {
    localStorage.setItem(STORAGE_KEY, '{not-json');
    expect(loadGame()).toEqual(initialGameState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 99, state: {} }));
    expect(loadGame()).toEqual(initialGameState);
  });

  it('round-trips versioned state and tolerates storage exceptions', () => {
    const state = { ...initialGameState, language: 'ru' as const };
    saveGame(state);
    expect(loadGame()).toEqual(state);
    const original = window.localStorage;
    Object.defineProperty(window, 'localStorage', { configurable: true, get: () => { throw new Error('blocked'); } });
    expect(loadGame()).toEqual(initialGameState);
    expect(() => saveGame(state)).not.toThrow();
    Object.defineProperty(window, 'localStorage', { configurable: true, value: original });
  });
});
