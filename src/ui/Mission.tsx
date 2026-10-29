import type { Language } from '../case/types'
import { caseUiText, getText } from '../case/translations'

interface MissionProps {
  language: Language
  foundClues: number
  totalClues: number
  hasAsked: boolean
  deductionsDone: number
  deductionsTotal: number
  solved: boolean
  onOpenHint(): void
}

export function missionStep({ foundClues, hasAsked, deductionsDone, deductionsTotal, solved }: Pick<MissionProps, 'foundClues' | 'hasAsked' | 'deductionsDone' | 'deductionsTotal' | 'solved'>): number {
  return solved ? 5 : deductionsDone >= deductionsTotal ? 4 : foundClues >= 3 && hasAsked ? 3 : foundClues >= 3 ? 2 : 1
}

export function missionText(step: number) {
  return [caseUiText.missionLook, caseUiText.missionLook, caseUiText.missionAsk, caseUiText.missionSelect, caseUiText.missionTheory, caseUiText.missionDone][step]
}

export function Mission({ language, foundClues, totalClues, hasAsked, deductionsDone, deductionsTotal, solved, onOpenHint }: MissionProps) {
  const step = missionStep({ foundClues, hasAsked, deductionsDone, deductionsTotal, solved })
  const steps = [caseUiText.missionStep1, caseUiText.missionStep2, caseUiText.missionStep3, caseUiText.missionStep4]
  const progress = [`${foundClues}/${totalClues}`, hasAsked ? '✓' : '', `${deductionsDone}/${deductionsTotal}`, solved ? '✓' : '']
  return <section className="mission" aria-label={getText(caseUiText.missionTitle, language)}>
    <ol className="mission-steps">
      {steps.map((label, index) => {
        const number = index + 1
        const state = number < step ? 'done' : number === step ? 'current' : 'todo'
        return <li key={number} className={`mission-step is-${state}`} aria-current={state === 'current' ? 'step' : undefined}>
          <span className="mission-badge" aria-hidden="true">{state === 'done' ? '✓' : number}</span>
          <span className="mission-label">{getText(label, language)}</span>
          {progress[index] && state !== 'todo' && <small>{progress[index]}</small>}
        </li>
      })}
    </ol>
    <button type="button" className="owl-button" onClick={onOpenHint}><span aria-hidden="true">🦉</span> {getText(caseUiText.hintMenu, language)}</button>
  </section>
}
