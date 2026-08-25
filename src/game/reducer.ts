import type { CaseDefinition, Language } from '../case/types'
import { acquiredEvidenceIds, canAsk, canMakeDeduction, canPresentContradiction, canUnlockLocation } from './rules'
import { freshGameState, type GameState, type Theory } from './state'

export type GameAction =
  | { type: 'discoverHotspot'; hotspotId: string }
  | { type: 'askQuestion'; questionId: string }
  | { type: 'addStatement'; statementId: string }
  | { type: 'unlockLocation'; locationId: string }
  | { type: 'selectEvidence'; evidenceId: string }
  | { type: 'toggleEvidence'; evidenceId: string }
  | { type: 'makeDeduction'; deductionId: string }
  | { type: 'presentContradiction'; contradictionId: string }
  | { type: 'setTheory'; theory: Theory }
  | { type: 'setLanguage'; language: Language }
  | { type: 'setLocation'; locationId: string }
  | { type: 'setReconstructionStep'; step: number }
  | { type: 'reset' }

const add = (ids: string[], id: string) => ids.includes(id) ? ids : [...ids, id]

export function createGameReducer(caseData: CaseDefinition) {
  function unlockSatisfiedLocations(state: GameState): GameState {
    const openedLocationIds = caseData.locations.filter((location) => canUnlockLocation(location, state)).map(({ id }) => id)
    return { ...state, openedLocationIds: [...new Set([...state.openedLocationIds, ...openedLocationIds])] }
  }

  return function gameReducer(state: GameState, action: GameAction): GameState {
    if (action.type === 'reset') return freshGameState(caseData)
    let next = state
    switch (action.type) {
      case 'discoverHotspot':
        if (!caseData.hotspots.some(({ id, locationId }) => id === action.hotspotId && locationId === state.locationId)) return state
        next = { ...state, discoveredHotspotIds: add(state.discoveredHotspotIds, action.hotspotId) }
        break
      case 'askQuestion': {
        const owner = caseData.characters.find(({ questions }) => questions.some(({ id }) => id === action.questionId))
        const question = owner?.questions.find(({ id }) => id === action.questionId)
        if (!owner || !question || owner.locationId !== state.locationId || state.askedQuestionIds.includes(action.questionId) || !canAsk(question, state)) return state
        next = { ...state, askedQuestionIds: add(state.askedQuestionIds, action.questionId), receivedStatementIds: question.responseStatementIds.reduce(add, state.receivedStatementIds) }
        next = { ...next, openedLocationIds: [...new Set([...next.openedLocationIds, ...(question.unlockLocationIds ?? [])])] }
        break
      }
      case 'addStatement':
        if (!caseData.statements.some(({ id }) => id === action.statementId)
          || state.receivedStatementIds.includes(action.statementId)
          || !caseData.characters.some(({ questions }) => questions.some((question) => state.askedQuestionIds.includes(question.id) && question.responseStatementIds.includes(action.statementId)))) return state
        next = { ...state, receivedStatementIds: add(state.receivedStatementIds, action.statementId) }
        break
      case 'unlockLocation': {
        const location = caseData.locations.find(({ id }) => id === action.locationId)
        if (!location || !canUnlockLocation(location, state)) return state
        next = { ...state, openedLocationIds: add(state.openedLocationIds, action.locationId) }
        break
      }
      case 'selectEvidence':
      case 'toggleEvidence': {
        if (!caseData.evidence.some(({ id }) => id === action.evidenceId) || !acquiredEvidenceIds(caseData, state).includes(action.evidenceId)) return state
        const selected = state.selectedEvidenceIds.includes(action.evidenceId)
        next = { ...state, selectedEvidenceIds: action.type === 'toggleEvidence' && selected ? state.selectedEvidenceIds.filter((id) => id !== action.evidenceId) : add(state.selectedEvidenceIds, action.evidenceId) }
        break
      }
      case 'makeDeduction': {
        const deduction = caseData.deductions.find(({ id }) => id === action.deductionId)
        if (!deduction || state.deductionIds.includes(action.deductionId) || !canMakeDeduction(caseData, deduction, state)) return state
        next = { ...state, deductionIds: add(state.deductionIds, action.deductionId), selectedEvidenceIds: [] }
        break
      }
      case 'presentContradiction': {
        const contradiction = caseData.contradictions.find(({ id }) => id === action.contradictionId)
        if (!contradiction || !canPresentContradiction(caseData, contradiction, state)) return state
        next = {
          ...state,
          receivedStatementIds: add(state.receivedStatementIds, contradiction.revealedStatementId),
          resolvedContradictionIds: add(state.resolvedContradictionIds, contradiction.id),
        }
        break
      }
      case 'setTheory':
        next = { ...state, theory: { ...action.theory } }
        break
      case 'setLanguage':
        next = { ...state, language: action.language }
        break
      case 'setLocation':
        if (!state.openedLocationIds.includes(action.locationId)) return state
        next = { ...state, locationId: action.locationId }
        break
      case 'setReconstructionStep':
        if (!Number.isInteger(action.step) || action.step < 0 || action.step >= caseData.reconstruction.length) return state
        next = { ...state, reconstructionStep: action.step }
        break
    }
    return unlockSatisfiedLocations(next)
  }
}
