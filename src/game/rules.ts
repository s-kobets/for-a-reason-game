import type { CaseDefinition, Character, Condition, Contradiction, Deduction, Location, Question, TheoryField } from '../case/types'
import type { GameState, Theory } from './state'

function hasCondition(condition: Condition, state: GameState): boolean {
  return ({
    hotspot: state.discoveredHotspotIds,
    statement: state.receivedStatementIds,
    question: state.askedQuestionIds,
    deduction: state.deductionIds,
  }[condition.kind]).includes(condition.id)
}

export function canAsk(question: Question, state: GameState): boolean {
  return (question.requires ?? []).every((condition) => hasCondition(condition, state))
}

export function availableQuestions(character: Character, state: GameState): Question[] {
  return character.questions.filter((question) => !state.askedQuestionIds.includes(question.id) && canAsk(question, state))
}

export function acquiredEvidenceIds(caseData: CaseDefinition, state: GameState): string[] {
  const acquired = new Set<string>()
  for (const hotspotId of state.discoveredHotspotIds) {
    const observationId = caseData.hotspots.find(({ id }) => id === hotspotId)?.observationId
    if (observationId) acquired.add(observationId)
  }
  for (const evidence of caseData.evidence) {
    if (evidence.statementId && state.receivedStatementIds.includes(evidence.statementId)) acquired.add(evidence.id)
  }
  return [...acquired]
}

export function canMakeDeduction(caseData: CaseDefinition, deduction: Deduction, state: GameState): boolean {
  const acquired = new Set(acquiredEvidenceIds(caseData, state))
  return deduction.requiresEvidenceIds.length <= state.selectedEvidenceIds.length
    && deduction.requiresEvidenceIds.every((id) => acquired.has(id) && state.selectedEvidenceIds.includes(id))
}

export function matchingDeduction(caseData: CaseDefinition, state: GameState): Deduction | undefined {
  const selected = new Set(state.selectedEvidenceIds)
  return caseData.deductions.find((deduction) => !state.deductionIds.includes(deduction.id)
    && deduction.requiresEvidenceIds.every((id) => selected.has(id))
    && canMakeDeduction(caseData, deduction, state))
}

export function canUnlockLocation(location: Location, state: GameState): boolean {
  return !location.unlockedBy || hasCondition(location.unlockedBy, state)
}

export function canPresentContradiction(caseData: CaseDefinition, contradiction: Contradiction, state: GameState): boolean {
  const acquired = new Set(acquiredEvidenceIds(caseData, state))
  return !state.resolvedContradictionIds.includes(contradiction.id)
    && state.receivedStatementIds.includes(contradiction.initialStatementId)
    && contradiction.evidenceIds.every((id) => acquired.has(id))
}

export function availableContradictions(caseData: CaseDefinition, character: Character, state: GameState): Contradiction[] {
  const statementIds = new Set(caseData.statements.filter(({ speakerId }) => speakerId === character.id).map(({ id }) => id))
  return caseData.contradictions.filter((contradiction) => statementIds.has(contradiction.initialStatementId) && canPresentContradiction(caseData, contradiction, state))
}

export function scoreTheory(theory: Theory, fields: TheoryField[]): 'wrong' | 'partial' | 'complete' {
  const correct = fields.filter((field) => theory[field.id] === field.value).length
  return correct === fields.length ? 'complete' : correct === 0 ? 'wrong' : 'partial'
}
