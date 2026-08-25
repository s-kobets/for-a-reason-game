import type { CaseDefinition } from '../case/types'
import type { GameState } from './state'

const STORAGE_VERSION = 2

function hasUniqueKnownIds(ids: unknown, validIds: Set<string>): ids is string[] {
  return Array.isArray(ids)
    && ids.every((id) => typeof id === 'string' && validIds.has(id))
    && new Set(ids).size === ids.length
}

export function createGameStorage(
  caseData: CaseDefinition,
  freshState: () => GameState,
  acquiredEvidenceIds: (state: GameState) => string[],
) {
  const storageKey = `reasoning-game:${caseData.id}:v${STORAGE_VERSION}`

  function isState(value: unknown): value is GameState {
    if (!value || typeof value !== 'object') return false
    const state = value as Partial<GameState>
    const locationIds = new Set(caseData.locations.map(({ id }) => id))
    const hotspotIds = new Set(caseData.hotspots.map(({ id }) => id))
    const questionIds = new Set(caseData.characters.flatMap(({ questions }) => questions.map(({ id }) => id)))
    const statementIds = new Set(caseData.statements.map(({ id }) => id))
    const deductionIds = new Set(caseData.deductions.map(({ id }) => id))
    const evidenceIds = new Set(caseData.evidence.map(({ id }) => id))
    const contradictionIds = new Set(caseData.contradictions.map(({ id }) => id))
    if (typeof state.locationId !== 'string'
      || !locationIds.has(state.locationId)
      || !hasUniqueKnownIds(state.openedLocationIds, locationIds)
      || !hasUniqueKnownIds(state.discoveredHotspotIds, hotspotIds)
      || !hasUniqueKnownIds(state.askedQuestionIds, questionIds)
      || !hasUniqueKnownIds(state.receivedStatementIds, statementIds)
      || !hasUniqueKnownIds(state.deductionIds, deductionIds)
      || !hasUniqueKnownIds(state.selectedEvidenceIds, evidenceIds)
      || !hasUniqueKnownIds(state.resolvedContradictionIds, contradictionIds)
      || !state.openedLocationIds.includes(state.locationId)
      || !caseData.initiallyOpenedLocationIds.every((id) => state.openedLocationIds?.includes(id))
      || (state.language !== 'en' && state.language !== 'ru')
      || !Number.isInteger(state.reconstructionStep)
      || state.reconstructionStep! < 0
      || state.reconstructionStep! >= caseData.reconstruction.length
      || !state.theory || typeof state.theory !== 'object') return false

    const theoryKeys = Object.keys(state.theory)
    if (theoryKeys.length !== caseData.theoryFields.length || caseData.theoryFields.some((field) => {
      const value = state.theory?.[field.id]
      return typeof value !== 'string' || (value !== '' && !field.options.some(({ id }) => id === value))
    })) return false

    const candidate = state as GameState
    const opened = new Set(caseData.initiallyOpenedLocationIds)
    const discovered = new Set<string>()
    const asked = new Set<string>()
    const statements = new Set<string>()
    const deductions = new Set<string>()
    const resolved = new Set<string>()
    const wanted = {
      opened: new Set(candidate.openedLocationIds), discovered: new Set(candidate.discoveredHotspotIds),
      asked: new Set(candidate.askedQuestionIds), statements: new Set(candidate.receivedStatementIds),
      deductions: new Set(candidate.deductionIds), resolved: new Set(candidate.resolvedContradictionIds),
    }
    const evidence = () => new Set(caseData.evidence.filter((item) =>
      (item.statementId && statements.has(item.statementId))
      || caseData.hotspots.some((hotspot) => discovered.has(hotspot.id) && hotspot.observationId === item.id),
    ).map(({ id }) => id))
    const hasCondition = ({ kind, id }: { kind: 'hotspot' | 'statement' | 'question' | 'deduction'; id: string }) => ({ hotspot: discovered, statement: statements, question: asked, deduction: deductions }[kind]).has(id)

    let changed = true
    while (changed) {
      changed = false
      for (const location of caseData.locations) {
        if (!opened.has(location.id) && (!location.unlockedBy || hasCondition(location.unlockedBy))) {
          opened.add(location.id)
          changed = true
        }
      }
      for (const hotspot of caseData.hotspots) {
        if (wanted.discovered.has(hotspot.id) && !discovered.has(hotspot.id) && opened.has(hotspot.locationId)) {
          discovered.add(hotspot.id)
          changed = true
        }
      }
      for (const character of caseData.characters) {
        if (!opened.has(character.locationId)) continue
        for (const question of character.questions) {
          if (wanted.asked.has(question.id) && !asked.has(question.id) && (question.requires ?? []).every(hasCondition)) {
            asked.add(question.id)
            question.responseStatementIds.forEach((id) => statements.add(id))
            question.unlockLocationIds?.forEach((id) => opened.add(id))
            changed = true
          }
        }
      }
      const acquired = evidence()
      for (const deduction of caseData.deductions) {
        if (wanted.deductions.has(deduction.id) && !deductions.has(deduction.id) && deduction.requiresEvidenceIds.every((id) => acquired.has(id))) {
          deductions.add(deduction.id)
          changed = true
        }
      }
      for (const contradiction of caseData.contradictions) {
        if (wanted.resolved.has(contradiction.id) && !resolved.has(contradiction.id)
          && statements.has(contradiction.initialStatementId) && contradiction.evidenceIds.every((id) => acquired.has(id))) {
          resolved.add(contradiction.id)
          statements.add(contradiction.revealedStatementId)
          changed = true
        }
      }
    }

    const same = (actual: Set<string>, expected: Set<string>) => actual.size === expected.size && [...actual].every((id) => expected.has(id))
    if (!same(opened, wanted.opened) || !same(discovered, wanted.discovered) || !same(asked, wanted.asked)
      || !same(statements, wanted.statements) || !same(deductions, wanted.deductions) || !same(resolved, wanted.resolved)) return false
    const acquired = new Set(acquiredEvidenceIds(candidate))
    return candidate.selectedEvidenceIds.every((id) => acquired.has(id))
  }

  function readGame(): GameState | undefined {
    try {
      const raw = localStorage.getItem(storageKey)
      if (!raw) return undefined
      const envelope: unknown = JSON.parse(raw)
      if (!envelope || typeof envelope !== 'object'
        || (envelope as { version?: unknown }).version !== STORAGE_VERSION
        || !isState((envelope as { state?: unknown }).state)) return undefined
      return structuredClone((envelope as { state: GameState }).state)
    } catch {
      return undefined
    }
  }

  function loadGame(): GameState {
    return readGame() ?? freshState()
  }

  function hasSavedGame(): boolean {
    return readGame() !== undefined
  }

  function saveGame(state: GameState): 'saved' | 'memory' {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ version: STORAGE_VERSION, state }))
      return 'saved'
    } catch {
      return 'memory'
    }
  }

  return { storageKey, loadGame, saveGame, hasSavedGame }
}
