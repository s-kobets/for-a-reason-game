import { describe, expect, it } from 'vitest'
import { createGameRuntime } from '../game/runtime'
import { midnightGreenhouseHotspotBounds } from './midnightGreenhouseArtwork'
import { getText } from './translations'
import type { LocalizedText } from './types'
import { midnightGreenhouseCase } from './midnightGreenhouse'

const runtime = createGameRuntime(midnightGreenhouseCase)

function expectLocalized(text: LocalizedText) {
  expect(text.en.trim()).not.toBe('')
  expect(text.ru.trim()).not.toBe('')
}

describe('midnightGreenhouseCase', () => {
  it('starts a fresh case with its own initial state', () => {
    const runtime = createGameRuntime(midnightGreenhouseCase)
    const state = runtime.freshState()

    expect(state.locationId).toBe(midnightGreenhouseCase.initialLocationId)
    expect(state.openedLocationIds).toEqual(midnightGreenhouseCase.initiallyOpenedLocationIds)
    expect(state.theory).toEqual(Object.fromEntries(midnightGreenhouseCase.theoryFields.map(({ id }) => [id, ''])))
  })

  it('provides bilingual text throughout the case', () => {
    expectLocalized(midnightGreenhouseCase.title)
    expectLocalized(midnightGreenhouseCase.introduction)
    for (const location of midnightGreenhouseCase.locations) {
      expectLocalized(location.title)
      expectLocalized(location.description)
    }
    for (const hotspot of midnightGreenhouseCase.hotspots) {
      expectLocalized(hotspot.title)
      expectLocalized(hotspot.description)
      if (hotspot.falseLead) expectLocalized(hotspot.falseLead)
    }
    for (const statement of midnightGreenhouseCase.statements) expectLocalized(statement.text)
    for (const character of midnightGreenhouseCase.characters) {
      expectLocalized(character.name)
      expectLocalized(character.role)
      for (const question of character.questions) expectLocalized(question.text)
    }
    for (const deduction of midnightGreenhouseCase.deductions) {
      expectLocalized(deduction.prompt)
      expectLocalized(deduction.title)
      expectLocalized(deduction.text)
    }
    for (const contradiction of midnightGreenhouseCase.contradictions) {
      expectLocalized(contradiction.title)
      expectLocalized(contradiction.prompt)
    }
    for (const field of midnightGreenhouseCase.theoryFields) {
      expectLocalized(field.prompt)
      for (const option of field.options) expectLocalized(option.label)
    }
    for (const step of midnightGreenhouseCase.reconstruction) {
      expectLocalized(step.timestamp)
      expectLocalized(step.text)
    }
    expect(getText(midnightGreenhouseCase.title, 'ru')).toBe('Полуночная оранжерея')
  })

  it('keeps evidence links and scene placements valid', () => {
    const locationIds = new Set(midnightGreenhouseCase.locations.map(({ id }) => id))
    const hotspotIds = new Set(midnightGreenhouseCase.hotspots.map(({ id }) => id))
    const evidenceIds = new Set(midnightGreenhouseCase.evidence.map(({ id }) => id))
    const statementIds = new Set(midnightGreenhouseCase.statements.map(({ id }) => id))
    const characterIds = new Set(midnightGreenhouseCase.characters.map(({ id }) => id))
    const uniqueIds = (ids: string[]) => expect(new Set(ids).size).toBe(ids.length)

    uniqueIds([...locationIds])
    uniqueIds([...hotspotIds])
    uniqueIds([...evidenceIds])
    uniqueIds([...statementIds])
    uniqueIds(midnightGreenhouseCase.characters.flatMap(({ questions }) => questions.map(({ id }) => id)))
    uniqueIds(midnightGreenhouseCase.deductions.map(({ id }) => id))
    uniqueIds(midnightGreenhouseCase.contradictions.map(({ id }) => id))
    uniqueIds(midnightGreenhouseCase.theoryFields.map(({ id }) => id))
    uniqueIds(midnightGreenhouseCase.reconstruction.map(({ id }) => id))
    expect(midnightGreenhouseCase.hotspots.find(({ id }) => id === 'service-lock')?.locationId).toBe('courtyard')

    for (const hotspot of midnightGreenhouseCase.hotspots) {
      expect(locationIds.has(hotspot.locationId)).toBe(true)
      expect(hotspot.placement.x).toBeGreaterThanOrEqual(0)
      expect(hotspot.placement.x).toBeLessThanOrEqual(1)
      expect(hotspot.placement.y).toBeGreaterThanOrEqual(0)
      expect(hotspot.placement.y).toBeLessThanOrEqual(1)
      if (hotspot.observationId) expect(evidenceIds.has(hotspot.observationId)).toBe(true)
      if (hotspot.decorative) expect(hotspot.observationId).toBeUndefined()
      for (const id of hotspot.falseLeadEvidenceIds ?? []) expect(evidenceIds.has(id)).toBe(true)
    }
    for (const evidence of midnightGreenhouseCase.evidence) {
      if (evidence.text) expectLocalized(evidence.text)
      if (evidence.statementId) expect(statementIds.has(evidence.statementId)).toBe(true)
    }
    for (const location of midnightGreenhouseCase.locations) {
      if (location.unlockedBy) {
        const validIds = { hotspot: hotspotIds, statement: statementIds, question: new Set(midnightGreenhouseCase.characters.flatMap(({ questions }) => questions.map(({ id }) => id))), deduction: new Set(midnightGreenhouseCase.deductions.map(({ id }) => id)) }[location.unlockedBy.kind]
        expect(validIds.has(location.unlockedBy.id)).toBe(true)
      }
    }
    for (const character of midnightGreenhouseCase.characters) {
      expect(locationIds.has(character.locationId)).toBe(true)
      for (const question of character.questions) {
        for (const id of question.responseStatementIds) expect(statementIds.has(id)).toBe(true)
        for (const id of question.unlockLocationIds ?? []) expect(locationIds.has(id)).toBe(true)
        for (const condition of question.requires ?? []) {
          const validIds = { hotspot: hotspotIds, statement: statementIds, question: new Set(midnightGreenhouseCase.characters.flatMap(({ questions }) => questions.map(({ id }) => id))), deduction: new Set(midnightGreenhouseCase.deductions.map(({ id }) => id)) }[condition.kind]
          expect(validIds.has(condition.id)).toBe(true)
        }
      }
    }
    for (const statement of midnightGreenhouseCase.statements) expect(characterIds.has(statement.speakerId)).toBe(true)
    for (const deduction of midnightGreenhouseCase.deductions) {
      expect(deduction.requiresEvidenceIds.length).toBeGreaterThan(0)
      for (const id of deduction.requiresEvidenceIds) expect(evidenceIds.has(id)).toBe(true)
    }
    for (const contradiction of midnightGreenhouseCase.contradictions) {
      for (const id of contradiction.evidenceIds) expect(evidenceIds.has(id)).toBe(true)
      expect(statementIds.has(contradiction.initialStatementId)).toBe(true)
      expect(statementIds.has(contradiction.revealedStatementId)).toBe(true)
    }
    for (const field of midnightGreenhouseCase.theoryFields) {
      expect(field.options.map(({ id }) => id)).toContain(field.value)
      for (const id of field.evidenceIds) expect(evidenceIds.has(id)).toBe(true)
    }
    for (const location of midnightGreenhouseCase.locations) expect(midnightGreenhouseCase.renderScene(location.sceneId)).not.toBeNull()
    for (const step of midnightGreenhouseCase.reconstruction) expect(midnightGreenhouseCase.renderReconstruction(step.sceneId)).not.toBeNull()
  })

  it('keeps every hotspot marker inside its illustrated prop bounds', () => {
    for (const hotspot of midnightGreenhouseCase.hotspots) {
      const bounds = midnightGreenhouseHotspotBounds[hotspot.id]
      expect(bounds, hotspot.id).toBeTruthy()
      expect(hotspot.placement.x).toBeGreaterThanOrEqual(bounds.x[0])
      expect(hotspot.placement.x).toBeLessThanOrEqual(bounds.x[1])
      expect(hotspot.placement.y).toBeGreaterThanOrEqual(bounds.y[0])
      expect(hotspot.placement.y).toBeLessThanOrEqual(bounds.y[1])
    }
  })

  it('reveals Mila’s visit only after both matching clues are found', () => {
    let state = runtime.reducer(runtime.freshState(), { type: 'askQuestion', questionId: 'ask-mila-night' })
    const mila = midnightGreenhouseCase.characters.find(({ id }) => id === 'mila')!
    expect(runtime.availableContradictions(mila, state)).toHaveLength(0)

    state = runtime.reducer(state, { type: 'setLocation', locationId: 'potting-room' })
    state = runtime.reducer(state, { type: 'discoverHotspot', hotspotId: 'watering-can' })
    state = runtime.reducer(state, { type: 'setLocation', locationId: 'courtyard' })
    state = runtime.reducer(state, { type: 'discoverHotspot', hotspotId: 'blue-thread' })
    expect(runtime.availableContradictions(mila, state).map(({ id }) => id)).toEqual(['mila-visit-contradiction'])

    state = runtime.reducer(state, { type: 'presentContradiction', contradictionId: 'mila-visit-contradiction' })
    expect(state.receivedStatementIds).toContain('mila-admits-visits')
    expect(state.openedLocationIds).toContain('boiler')
  })

  it('accepts the coherent rescue explanation as a complete theory', () => {
    expect(runtime.scoreTheory({
      person: 'mila', entry: 'spare-key', action: 'warm-and-water', motive: 'save-from-frost', time: 'after-closing',
    })).toBe('complete')
  })
})
