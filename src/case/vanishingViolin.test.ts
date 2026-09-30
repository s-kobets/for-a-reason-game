import { describe, expect, it } from 'vitest'
import { createGameRuntime } from '../game/runtime'
import { getText } from './translations'
import type { LocalizedText } from './types'
import { vanishingViolinCase } from './vanishingViolin'
import { renderVanishingViolinReconstruction, renderVanishingViolinScene, vanishingViolinHotspotBounds } from './vanishingViolinArtwork'

const runtime = createGameRuntime(vanishingViolinCase)

function expectLocalized(text: LocalizedText) {
  expect(text.en.trim()).not.toBe('')
  expect(text.ru.trim()).not.toBe('')
}

describe('vanishingViolinCase', () => {
  it('contains a complete bilingual case and renders every scene', () => {
    expect(vanishingViolinCase.locations).toHaveLength(4)
    expect(vanishingViolinCase.hotspots.length).toBeGreaterThanOrEqual(12)
    expect(vanishingViolinCase.evidence.filter(({ kind }) => kind === 'observation').length).toBeGreaterThanOrEqual(12)
    expect(vanishingViolinCase.statements.length).toBeGreaterThanOrEqual(10)
    expect(vanishingViolinCase.deductions.length).toBeGreaterThanOrEqual(3)
    expect(vanishingViolinCase.contradictions).toHaveLength(1)
    expect(vanishingViolinCase.reconstruction).toHaveLength(5)

    for (const text of [vanishingViolinCase.title, vanishingViolinCase.introduction]) expectLocalized(text)
    for (const location of vanishingViolinCase.locations) {
      expectLocalized(location.title)
      expectLocalized(location.description)
      expect(vanishingViolinCase.renderScene(location.sceneId)).not.toBeNull()
    }
    for (const hotspot of vanishingViolinCase.hotspots) {
      expectLocalized(hotspot.title)
      expectLocalized(hotspot.description)
      if (hotspot.falseLead) expectLocalized(hotspot.falseLead)
      expect(vanishingViolinHotspotBounds[hotspot.id], hotspot.id).toBeTruthy()
      expect(hotspot.placement.x).toBeGreaterThanOrEqual(vanishingViolinHotspotBounds[hotspot.id].x[0])
      expect(hotspot.placement.x).toBeLessThanOrEqual(vanishingViolinHotspotBounds[hotspot.id].x[1])
      expect(hotspot.placement.y).toBeGreaterThanOrEqual(vanishingViolinHotspotBounds[hotspot.id].y[0])
      expect(hotspot.placement.y).toBeLessThanOrEqual(vanishingViolinHotspotBounds[hotspot.id].y[1])
    }
    for (const evidence of vanishingViolinCase.evidence) if (evidence.text) expectLocalized(evidence.text)
    for (const statement of vanishingViolinCase.statements) expectLocalized(statement.text)
    for (const character of vanishingViolinCase.characters) {
      expectLocalized(character.name)
      expectLocalized(character.role)
      for (const question of character.questions) expectLocalized(question.text)
    }
    for (const deduction of vanishingViolinCase.deductions) {
      expectLocalized(deduction.prompt)
      expectLocalized(deduction.title)
      expectLocalized(deduction.text)
    }
    for (const contradiction of vanishingViolinCase.contradictions) {
      expectLocalized(contradiction.title)
      expectLocalized(contradiction.prompt)
    }
    for (const field of vanishingViolinCase.theoryFields) {
      expectLocalized(field.prompt)
      for (const option of field.options) expectLocalized(option.label)
    }
    for (const step of vanishingViolinCase.reconstruction) {
      expectLocalized(step.timestamp)
      expectLocalized(step.text)
      expect(vanishingViolinCase.renderReconstruction(step.sceneId)).not.toBeNull()
    }
    expect(getText(vanishingViolinCase.title, 'ru')).toBe('Исчезнувшая скрипка')
    expect(renderVanishingViolinScene('unknown-scene')).not.toBeNull()
    expect(renderVanishingViolinReconstruction('unknown-step')).not.toBeNull()
  })

  it('keeps every case reference valid and starts at the music room', () => {
    const locationIds = new Set(vanishingViolinCase.locations.map(({ id }) => id))
    const hotspotIds = new Set(vanishingViolinCase.hotspots.map(({ id }) => id))
    const evidenceIds = new Set(vanishingViolinCase.evidence.map(({ id }) => id))
    const statementIds = new Set(vanishingViolinCase.statements.map(({ id }) => id))
    const questionIds = new Set(vanishingViolinCase.characters.flatMap(({ questions }) => questions.map(({ id }) => id)))
    const deductionIds = new Set(vanishingViolinCase.deductions.map(({ id }) => id))
    const unique = (ids: string[]) => expect(new Set(ids).size).toBe(ids.length)

    for (const ids of [
      [...locationIds], [...hotspotIds], [...evidenceIds], [...statementIds], [...questionIds],
      [...deductionIds], vanishingViolinCase.contradictions.map(({ id }) => id),
      vanishingViolinCase.theoryFields.map(({ id }) => id), vanishingViolinCase.reconstruction.map(({ id }) => id),
    ]) unique(ids)

    for (const location of vanishingViolinCase.locations) {
      if (location.unlockedBy) expect(({ hotspot: hotspotIds, statement: statementIds, question: questionIds, deduction: deductionIds })[location.unlockedBy.kind].has(location.unlockedBy.id)).toBe(true)
    }
    for (const hotspot of vanishingViolinCase.hotspots) {
      expect(locationIds.has(hotspot.locationId)).toBe(true)
      if (hotspot.observationId) expect(evidenceIds.has(hotspot.observationId)).toBe(true)
      for (const id of hotspot.falseLeadEvidenceIds ?? []) expect(evidenceIds.has(id)).toBe(true)
    }
    for (const evidence of vanishingViolinCase.evidence) {
      if (evidence.statementId) expect(statementIds.has(evidence.statementId)).toBe(true)
    }
    for (const statement of vanishingViolinCase.statements) expect(vanishingViolinCase.characters.some(({ id }) => id === statement.speakerId)).toBe(true)
    for (const character of vanishingViolinCase.characters) {
      expect(locationIds.has(character.locationId)).toBe(true)
      expect(character.placement.x).toBeGreaterThanOrEqual(0)
      expect(character.placement.x).toBeLessThanOrEqual(1)
      expect(character.placement.y).toBeGreaterThanOrEqual(0)
      expect(character.placement.y).toBeLessThanOrEqual(1)
      for (const question of character.questions) {
        for (const id of question.responseStatementIds) expect(statementIds.has(id)).toBe(true)
        for (const id of question.unlockLocationIds ?? []) expect(locationIds.has(id)).toBe(true)
        for (const condition of question.requires ?? []) expect(({ hotspot: hotspotIds, statement: statementIds, question: questionIds, deduction: deductionIds })[condition.kind].has(condition.id)).toBe(true)
      }
    }
    for (const deduction of vanishingViolinCase.deductions) for (const id of deduction.requiresEvidenceIds) expect(evidenceIds.has(id)).toBe(true)
    for (const contradiction of vanishingViolinCase.contradictions) {
      for (const id of contradiction.evidenceIds) expect(evidenceIds.has(id)).toBe(true)
      expect(statementIds.has(contradiction.initialStatementId)).toBe(true)
      expect(statementIds.has(contradiction.revealedStatementId)).toBe(true)
    }
    for (const field of vanishingViolinCase.theoryFields) {
      expect(field.options.map(({ id }) => id)).toContain(field.value)
      for (const id of field.evidenceIds) expect(evidenceIds.has(id)).toBe(true)
    }
    expect(runtime.freshState().locationId).toBe('music-room')
    expect(runtime.freshState().openedLocationIds).toEqual(['music-room', 'backstage-corridor', 'concert-hall'])
  })

  it('unlocks the workshop from route evidence and Vera admits moving the violin when confronted', () => {
    let state = runtime.freshState()
    state = runtime.reducer(state, { type: 'discoverHotspot', hotspotId: 'water-stain' })
    state = runtime.reducer(state, { type: 'discoverHotspot', hotspotId: 'empty-cabinet' })
    state = runtime.reducer(state, { type: 'setLocation', locationId: 'backstage-corridor' })
    state = runtime.reducer(state, { type: 'discoverHotspot', hotspotId: 'cart-track' })
    state = runtime.reducer(state, { type: 'discoverHotspot', hotspotId: 'service-door' })
    state = runtime.reducer(state, { type: 'selectEvidence', evidenceId: 'cart-track-clue' })
    state = runtime.reducer(state, { type: 'selectEvidence', evidenceId: 'service-door-clue' })
    state = runtime.reducer(state, { type: 'makeDeduction', deductionId: 'service-route' })
    expect(state.openedLocationIds).toContain('instrument-workshop')

    state = runtime.reducer(state, { type: 'setLocation', locationId: 'music-room' })
    state = runtime.reducer(state, { type: 'askQuestion', questionId: 'ask-vera-room' })
    const vera = vanishingViolinCase.characters.find(({ id }) => id === 'vera')!
    expect(runtime.availableContradictions(vera, state)).toHaveLength(0)
    state = runtime.reducer(state, { type: 'discoverHotspot', hotspotId: 'key-ledger' })
    expect(runtime.availableContradictions(vera, state).map(({ id }) => id)).toEqual(['vera-key-contradiction'])
    state = runtime.reducer(state, { type: 'presentContradiction', contradictionId: 'vera-key-contradiction' })
    expect(state.receivedStatementIds).toContain('vera-admits-move')
    state = runtime.reducer(state, { type: 'askQuestion', questionId: 'ask-vera-motive' })
    expect(state.receivedStatementIds).toContain('vera-explains-leak')
  })

  it('scores the evidence-backed explanation and identifies the rosin false lead', () => {
    expect(runtime.scoreTheory({ person: 'vera', destination: 'instrument-workshop', access: 'master-key', motive: 'protect-from-leak' })).toBe('complete')
    const falseLead = vanishingViolinCase.hotspots.find(({ id }) => id === 'rosin-mark')!
    let state = runtime.freshState()
    state = runtime.reducer(state, { type: 'discoverHotspot', hotspotId: 'rosin-mark' })
    expect(runtime.acquiredEvidenceIds(state)).not.toContain('pavel-practised-here')
    state = runtime.reducer(state, { type: 'setLocation', locationId: 'concert-hall' })
    state = runtime.reducer(state, { type: 'askQuestion', questionId: 'ask-pavel-rehearsal' })
    expect(falseLead.falseLeadEvidenceIds).toContain('pavel-rehearsal-statement')
    expect(runtime.acquiredEvidenceIds(state)).toContain('pavel-rehearsal-statement')
  })
})
