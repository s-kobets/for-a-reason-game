import type { CaseDefinition } from '../case/types'
import { createGameReducer } from './reducer'
import { acquiredEvidenceIds, availableContradictions, availableQuestions, canMakeDeduction, matchingDeduction, scoreTheory } from './rules'
import { freshGameState } from './state'
import { createGameStorage } from './storage'

export function createGameRuntime(caseData: CaseDefinition) {
  const freshState = () => freshGameState(caseData)
  const getAcquiredEvidenceIds = (state: Parameters<typeof acquiredEvidenceIds>[1]) => acquiredEvidenceIds(caseData, state)
  return {
    ...createGameStorage(caseData, freshState, getAcquiredEvidenceIds),
    freshState,
    reducer: createGameReducer(caseData),
    acquiredEvidenceIds: getAcquiredEvidenceIds,
    availableQuestions: (character: Parameters<typeof availableQuestions>[0], state: Parameters<typeof availableQuestions>[1]) => {
      const caseCharacter = caseData.characters.find(({ id }) => id === character.id)
      return caseCharacter ? availableQuestions(caseCharacter, state) : []
    },
    availableContradictions: (character: Parameters<typeof availableContradictions>[1], state: Parameters<typeof availableContradictions>[2]) => availableContradictions(caseData, character, state),
    canMakeDeduction: (deduction: Parameters<typeof canMakeDeduction>[1], state: Parameters<typeof canMakeDeduction>[2]) => {
      const caseDeduction = caseData.deductions.find(({ id }) => id === deduction.id)
      return !!caseDeduction && canMakeDeduction(caseData, caseDeduction, state)
    },
    matchingDeduction: (state: Parameters<typeof matchingDeduction>[1]) => matchingDeduction(caseData, state),
    scoreTheory: (theory: Parameters<typeof scoreTheory>[0]) => scoreTheory(theory, caseData.theoryFields),
  }
}

export type GameRuntime = ReturnType<typeof createGameRuntime>
