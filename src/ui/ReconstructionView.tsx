import type { ReactNode } from 'react'
import type { Language, ReconstructionStep } from '../case/types'
import { caseUiText, getText } from '../case/translations'

interface ReconstructionViewProps {
  steps: ReconstructionStep[];
  currentStep: number;
  language: Language;
  renderScene(sceneId: string): ReactNode;
  onNext(): void;
  onReplay(): void;
}

export function ReconstructionView({ steps, currentStep, language, renderScene, onNext, onReplay }: ReconstructionViewProps) {
  const step = steps[currentStep]
  const isLast = currentStep === steps.length - 1
  return <section className="reconstruction-panel" aria-labelledby="reconstruction-title">
    <div className="panel-title"><h2 id="reconstruction-title">{getText(caseUiText.reconstruction, language)}</h2><span>{currentStep + 1} / {steps.length}</span></div>
    <article className="reconstruction-card">
      <svg className="reconstruction-vignette" viewBox="0 0 500 180" role="img" aria-label={getText(step.text, language)} data-scene-id={step.sceneId}>
        <rect width="500" height="180" rx="18" fill="#d8c0a5" />{renderScene(step.sceneId)}<path d="M0 145h500" stroke="#694739" strokeWidth="5" />
      </svg>
      <p className="reconstruction-time">{getText(step.timestamp, language)}</p><p>{getText(step.text, language)}</p>
    </article>
    {isLast ? <div className="reconstruction-final" role="status"><strong>{getText(caseUiText.caseUnderstood, language)}</strong><button type="button" onClick={onReplay}>{getText(caseUiText.replay, language)}</button></div> : <button className="reconstruction-next" type="button" onClick={onNext}>{getText(caseUiText.next, language)}</button>}
  </section>
}
