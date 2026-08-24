import { beforeEach, describe, expect, it } from 'vitest';
import { missingCakeCase } from '../case/missingCake';
import { acquiredEvidenceIds, availableQuestions, canAsk, canPresentContradiction, canMakeDeduction, scoreTheory } from './rules';
import { freshGameState, initialGameState, type GameState, type Theory } from './state';
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
    let state = gameReducer(initialGameState, { type: 'discoverHotspot', hotspotId: 'kitchen-window' });
    state = gameReducer(state, { type: 'discoverHotspot', hotspotId: 'back-door' });
    state = gameReducer(state, { type: 'discoverHotspot', hotspotId: 'muddy-footprints' });
    state = gameReducer(state, { type: 'selectEvidence', evidenceId: 'window-open' });
    state = gameReducer(state, { type: 'selectEvidence', evidenceId: 'door-unused' });

    expect(canMakeDeduction(deduction, state)).toBe(false);
    state = gameReducer(state, { type: 'selectEvidence', evidenceId: 'footprints-inward' });
    expect(canMakeDeduction(deduction, state)).toBe(true);
    expect(missingCakeCase.deductions.every((item) => canMakeDeduction(item, { ...state, selectedEvidenceIds: [] }))).toBe(false);
  });

  it('keeps acquired evidence separate from explicit selection', () => {
    const discovered = gameReducer(initialGameState, { type: 'discoverHotspot', hotspotId: 'cake-stand' });
    expect(acquiredEvidenceIds(discovered)).toContain('cake-missing');
    expect(discovered.selectedEvidenceIds).toEqual([]);
    expect(gameReducer(discovered, { type: 'selectEvidence', evidenceId: 'shed-frosting' })).toBe(discovered);
    const selected = gameReducer(discovered, { type: 'selectEvidence', evidenceId: 'cake-missing' });
    expect(selected.selectedEvidenceIds).toEqual(['cake-missing']);
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
    let state = gameReducer(initialGameState, { type: 'askQuestion', questionId: 'ask-petya-garden' });
    expect(canPresentContradiction(state)).toBe(false);
    state = gameReducer(state, { type: 'discoverHotspot', hotspotId: 'garden-path' });
    state = gameReducer(state, { type: 'discoverHotspot', hotspotId: 'scarf-thread' });
    expect(state.discoveredHotspotIds).toEqual(['garden-path', 'scarf-thread']);
    expect(state.receivedStatementIds).toContain('petya-denies-garden');
    expect(canPresentContradiction(state)).toBe(true);
    state = gameReducer(state, { type: 'presentContradiction' });
    expect(state.receivedStatementIds).toContain('petya-admits-window');
    expect(gameReducer(state, { type: 'presentContradiction' })).toBe(state);
  });

  it('unlocks Shed from Petya admission and deduplicates IDs', () => {
    expect(gameReducer(initialGameState, { type: 'unlockLocation', locationId: 'shed' })).toBe(initialGameState);
    const eligible = { ...initialGameState, receivedStatementIds: ['petya-admits-shed'] };
    expect(gameReducer(eligible, { type: 'unlockLocation', locationId: 'shed' }).openedLocationIds).toContain('shed');
    const producerState = { ...initialGameState, askedQuestionIds: ['ask-petya-cake'] };
    const once = gameReducer(producerState, { type: 'addStatement', statementId: 'petya-admits-shed' });
    const twice = gameReducer(once, { type: 'addStatement', statementId: 'petya-admits-shed' });

    expect(once.openedLocationIds).toContain('shed');
    expect(gameReducer(once, { type: 'unlockLocation', locationId: 'shed' }).openedLocationIds).toEqual(once.openedLocationIds);
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

  it('answers questions once and applies response statements', () => {
    const anya = missingCakeCase.characters.find(({ id }) => id === 'anya')!;
    const before = gameReducer({ ...initialGameState, locationId: 'living-room' }, { type: 'askQuestion', questionId: 'ask-anya-before' });
    expect(before.receivedStatementIds).toEqual(['anya-saw-petya']);
    expect(availableQuestions(anya, before).map(({ id }) => id)).not.toContain('ask-anya-before');
    expect(gameReducer(before, { type: 'askQuestion', questionId: 'ask-anya-before' })).toBe(before);
  });

  it('rejects invalid direct actions and unopened locations', () => {
    expect(gameReducer(initialGameState, { type: 'addStatement', statementId: 'unknown' })).toBe(initialGameState);
    expect(gameReducer(initialGameState, { type: 'addStatement', statementId: 'anya-saw-petya' })).toBe(initialGameState);
    expect(gameReducer(initialGameState, { type: 'selectEvidence', evidenceId: 'shed-frosting' })).toBe(initialGameState);
    expect(gameReducer(initialGameState, { type: 'setLocation', locationId: 'shed' })).toBe(initialGameState);
    expect(gameReducer(initialGameState, { type: 'setLocation', locationId: 'unknown' })).toBe(initialGameState);
    expect(gameReducer(initialGameState, { type: 'setReconstructionStep', step: missingCakeCase.reconstruction.length })).toBe(initialGameState);
    expect(gameReducer(initialGameState, { type: 'setReconstructionStep', step: -1 })).toBe(initialGameState);
  });

  it('does not let direct addStatement inject statement-backed evidence', () => {
    const injected = gameReducer(initialGameState, { type: 'addStatement', statementId: 'anya-saw-petya' });
    expect(injected.receivedStatementIds).not.toContain('anya-saw-petya');
    expect(acquiredEvidenceIds(injected)).not.toContain('anya-saw-petya');
    const produced = gameReducer({ ...initialGameState, askedQuestionIds: ['ask-anya-before'] }, { type: 'addStatement', statementId: 'anya-saw-petya' });
    expect(produced.receivedStatementIds).toContain('anya-saw-petya');
  });

  it('isolates fresh and reset state containers', () => {
    const fresh = freshGameState();
    fresh.discoveredHotspotIds.push('cake-stand');
    fresh.theory.person = 'petya';
    expect(initialGameState.discoveredHotspotIds).toEqual([]);
    expect(initialGameState.theory.person).toBe('');
    const reset = gameReducer(fresh, { type: 'reset' });
    reset.selectedEvidenceIds.push('cake-missing');
    expect(gameReducer(initialGameState, { type: 'reset' }).selectedEvidenceIds).toEqual([]);
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

  it.each([
    ['unknown location', { locationId: 'unknown' }],
    ['unknown hotspot', { discoveredHotspotIds: ['unknown'] }],
    ['unknown question', { askedQuestionIds: ['unknown'] }],
    ['unknown statement', { receivedStatementIds: ['unknown'] }],
    ['unknown deduction', { deductionIds: ['unknown'] }],
    ['unknown evidence', { selectedEvidenceIds: ['unknown'] }],
    ['unacquired known evidence', { selectedEvidenceIds: ['shed-frosting'] }],
    ['duplicate IDs', { discoveredHotspotIds: ['cake-stand', 'cake-stand'] }],
    ['current location not open', { locationId: 'shed' }],
    ['locked location opened', { openedLocationIds: ['kitchen', 'living-room', 'garden', 'corridor', 'shed'] }],
    ['invalid theory option', { theory: { ...initialGameState.theory, person: 'unknown' } }],
    ['invalid reconstruction step', { reconstructionStep: missingCakeCase.reconstruction.length }],
    ['negative reconstruction step', { reconstructionStep: -1 }],
  ])('rejects %s persisted state', (_, patch) => {
    const state = { ...initialGameState, ...patch } as GameState;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, state }));
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
