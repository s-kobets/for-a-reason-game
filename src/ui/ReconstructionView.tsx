import type { Language, ReconstructionStep } from '../case/types'
import { caseUiText, getText } from '../case/translations'

interface ReconstructionViewProps {
  steps: ReconstructionStep[];
  currentStep: number;
  language: Language;
  onNext(): void;
  onReplay(): void;
}

export function ReconstructionView({ steps, currentStep, language, onNext, onReplay }: ReconstructionViewProps) {
  const step = steps[currentStep]
  const isLast = currentStep === steps.length - 1
  return <section className="reconstruction-panel" aria-labelledby="reconstruction-title">
    <div className="panel-title"><h2 id="reconstruction-title">{getText(caseUiText.reconstruction, language)}</h2><span>{currentStep + 1} / {steps.length}</span></div>
    <article className="reconstruction-card">
      <svg className="reconstruction-vignette" viewBox="0 0 500 180" role="img" aria-label={getText(step.timestamp, language)} data-scene-id={step.sceneId}>
        <rect width="500" height="180" rx="18" fill="#d8c0a5" />
        <circle cx={90 + currentStep * 70} cy="92" r="30" fill="#8b5e4b" />
        <rect x={210 + currentStep * 35} y="80" width="120" height="48" rx="8" fill="#fff4dc" />
        <path d="M0 145h500" stroke="#694739" strokeWidth="5" />
      </svg>
      <p className="reconstruction-time">{getText(step.timestamp, language)}</p>
      <p>{getText(step.text, language)}</p>
    </article>
    {isLast ? <div className="reconstruction-final" role="status"><strong>{getText(caseUiText.caseUnderstood, language)}</strong><button type="button" onClick={onReplay}>{getText(caseUiText.replay, language)}</button></div> : <button className="reconstruction-next" type="button" onClick={onNext}>{getText(caseUiText.next, language)}</button>}
  </section>
}
