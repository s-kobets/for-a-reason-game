import { useEffect, useState } from 'react'
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
  getHint(): string
}

export function Mission({ language, foundClues, totalClues, hasAsked, deductionsDone, deductionsTotal, solved, getHint }: MissionProps) {
  const [hint, setHint] = useState('')
  useEffect(() => setHint(''), [foundClues, hasAsked, deductionsDone, solved])
  const step = solved ? 5 : deductionsDone >= deductionsTotal ? 4 : foundClues >= 3 && hasAsked ? 3 : foundClues >= 3 ? 2 : 1
  const text = [caseUiText.missionLook, caseUiText.missionLook, caseUiText.missionAsk, caseUiText.missionSelect, caseUiText.missionTheory, caseUiText.missionDone][step]
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
    <div className="owl-row">
      <span className="owl" aria-hidden="true">🦉</span>
      <div className="owl-bubble">
        <p className="mission-text"><strong>{getText(caseUiText.owlName, language)}:</strong> {getText(text, language)}</p>
        {hint && <p className="owl-hint" role="status">💡 {hint}</p>}
      </div>
      {!solved && <button type="button" className="hint-button" onClick={() => setHint(getHint())}>{getText(caseUiText.hintButton, language)}</button>}
    </div>
  </section>
}
