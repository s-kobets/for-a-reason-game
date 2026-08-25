import { expect, it } from 'vitest'
import type { CaseDefinition } from '../case/types'
import { missingCakeCase } from '../case/missingCake'
import { createGameRuntime } from './runtime'

const text = { en: 'Other', ru: 'Другое' }
const otherCase: CaseDefinition = {
  id: 'other-case', title: text, introduction: text,
  initialLocationId: 'other-room', initiallyOpenedLocationIds: ['other-room'],
  locations: [{ id: 'other-room', title: text, description: text, sceneId: 'other-scene' }],
  hotspots: [{ id: 'other-clue', locationId: 'other-room', placement: { x: 0.5, y: 0.5 }, title: text, description: text, observationId: 'other-evidence' }],
  evidence: [{ id: 'other-evidence', kind: 'observation', text }],
  characters: [], statements: [], deductions: [], contradictions: [],
  theoryFields: [{ id: 'culprit', prompt: text, value: 'nobody', options: [{ id: 'nobody', label: text }], evidenceIds: [] }],
  reconstruction: [{ id: 'other-end', timestamp: text, text, sceneId: 'other-end' }],
  renderScene: () => null,
  renderReconstruction: () => null,
}

it('binds state and evidence rules to the supplied case', () => {
  const runtime = createGameRuntime(otherCase) as unknown as {
    freshState(): { locationId: string; theory: Record<string, string> }
    reducer(state: unknown, action: unknown): unknown
    acquiredEvidenceIds(state: unknown): string[]
  }
  let state = runtime.freshState()
  state = runtime.reducer(state, { type: 'discoverHotspot', hotspotId: 'other-clue' }) as typeof state

  expect(state.locationId).toBe('other-room')
  expect(state.theory).toEqual({ culprit: '' })
  expect(runtime.acquiredEvidenceIds(state)).toEqual(['other-evidence'])
})

it('isolates persisted progress by case', () => {
  localStorage.clear()
  const first = createGameRuntime(otherCase) as ReturnType<typeof createGameRuntime> & { storageKey: string; saveGame(state: unknown): unknown; loadGame(): unknown }
  const second = createGameRuntime({ ...otherCase, id: 'second-case' }) as typeof first
  const state = first.reducer(first.freshState(), { type: 'discoverHotspot', hotspotId: 'other-clue' })

  expect(first.storageKey).not.toBe(second.storageKey)
  first.saveGame(state)
  expect(first.loadGame()).toEqual(state)
  expect(second.loadGame()).toEqual(second.freshState())
})

it('reports only valid persisted state as a saved game', () => {
  const runtime = createGameRuntime(missingCakeCase)
  expect(runtime.hasSavedGame()).toBe(false)

  localStorage.setItem(runtime.storageKey, '{broken')
  expect(runtime.hasSavedGame()).toBe(false)

  runtime.saveGame({ ...runtime.freshState(), discoveredHotspotIds: ['cake-stand'] })
  expect(runtime.hasSavedGame()).toBe(true)
})

it('treats unavailable storage as no saved game', () => {
  const runtime = createGameRuntime(missingCakeCase)
  const original = Object.getOwnPropertyDescriptor(window, 'localStorage')
  Object.defineProperty(window, 'localStorage', { configurable: true, get: () => { throw new Error('blocked') } })
  try {
    expect(runtime.hasSavedGame()).toBe(false)
  } finally {
    if (original) Object.defineProperty(window, 'localStorage', original)
  }
})

it('rejects a persisted conditional question without its prerequisites', () => {
  const runtime = createGameRuntime(missingCakeCase)
  const impossible = { ...runtime.freshState(), askedQuestionIds: ['ask-petya-cake'] }
  localStorage.setItem(runtime.storageKey, JSON.stringify({ version: 2, state: impossible }))

  expect(runtime.loadGame()).toEqual(runtime.freshState())
})

it('rejects discovery outside the current location', () => {
  const runtime = createGameRuntime(missingCakeCase)
  const state = runtime.freshState()

  expect(runtime.reducer(state, { type: 'discoverHotspot', hotspotId: 'garden-path' })).toBe(state)
})

it('rejects persisted questions and contradictions missing their produced statements', () => {
  const runtime = createGameRuntime(missingCakeCase)
  const missingResponse = { ...runtime.freshState(), locationId: 'living-room', askedQuestionIds: ['ask-anya-before'] }
  localStorage.setItem(runtime.storageKey, JSON.stringify({ version: 2, state: missingResponse }))
  expect(runtime.loadGame()).toEqual(runtime.freshState())

  const missingReveal = {
    ...runtime.freshState(),
    discoveredHotspotIds: ['garden-path', 'scarf-thread'],
    askedQuestionIds: ['ask-petya-garden'],
    receivedStatementIds: ['petya-denies-garden'],
    resolvedContradictionIds: ['petya-garden-contradiction'],
  }
  localStorage.setItem(runtime.storageKey, JSON.stringify({ version: 2, state: missingReveal }))
  expect(runtime.loadGame()).toEqual(runtime.freshState())
})

it('does not evaluate questions from another case', () => {
  const runtime = createGameRuntime(otherCase)
  const foreignCharacter = {
    id: 'foreign', locationId: 'other-room', placement: { x: 0.5, y: 0.5 }, name: text, role: text,
    questions: [{ id: 'foreign-question', text, responseStatementIds: [] }],
  }

  expect(runtime.availableQuestions(foreignCharacter, runtime.freshState())).toEqual([])
})

it('matches a deduction when selected evidence includes extra clues', () => {
  const runtime = createGameRuntime(missingCakeCase)
  let state = runtime.freshState()
  state = runtime.reducer(state, { type: 'discoverHotspot', hotspotId: 'muddy-footprints' })
  state = runtime.reducer(state, { type: 'discoverHotspot', hotspotId: 'cake-stand' })
  state = runtime.reducer(state, { type: 'setLocation', locationId: 'living-room' })
  state = runtime.reducer(state, { type: 'discoverHotspot', hotspotId: 'wet-umbrella' })
  for (const evidenceId of ['footprints-inward', 'recent-rain', 'cake-missing']) state = runtime.reducer(state, { type: 'selectEvidence', evidenceId })

  expect(runtime.reducer(state, { type: 'makeDeduction', deductionId: 'fresh-footprints' }).deductionIds).toContain('fresh-footprints')
})

it('accepts a deduction when its clues are selected with other clues', () => {
  const runtime = createGameRuntime(missingCakeCase)
  const state = {
    ...runtime.freshState(),
    discoveredHotspotIds: ['muddy-footprints', 'wet-umbrella', 'cake-stand'],
    selectedEvidenceIds: ['footprints-inward', 'recent-rain', 'cake-missing'],
  }

  expect(runtime.matchingDeduction(state)?.id).toBe('fresh-footprints')
})

it('rejects circular persisted unlocks that cannot be reached from initial state', () => {
  const circularCase: CaseDefinition = {
    ...otherCase,
    id: 'circular-case',
    locations: [
      ...otherCase.locations,
      { id: 'vault', title: text, description: text, sceneId: 'vault', unlockedBy: { kind: 'hotspot', id: 'vault-clue' } },
    ],
    hotspots: [
      ...otherCase.hotspots,
      { id: 'vault-clue', locationId: 'vault', placement: { x: 0.5, y: 0.5 }, title: text, description: text, observationId: 'vault-evidence' },
    ],
    evidence: [...otherCase.evidence, { id: 'vault-evidence', kind: 'observation', text }],
  }
  const runtime = createGameRuntime(circularCase)
  const impossible = { ...runtime.freshState(), openedLocationIds: ['other-room', 'vault'], discoveredHotspotIds: ['vault-clue'] }
  localStorage.setItem(runtime.storageKey, JSON.stringify({ version: 2, state: impossible }))

  expect(runtime.loadGame()).toEqual(runtime.freshState())
})
