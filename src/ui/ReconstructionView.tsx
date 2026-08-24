import type { Language, ReconstructionStep } from '../case/types'
import { caseUiText, getText } from '../case/translations'
import type { ReactNode } from 'react'

interface ReconstructionViewProps {
  steps: ReconstructionStep[];
  currentStep: number;
  language: Language;
  onNext(): void;
  onReplay(): void;
}

const sceneVignettes: Record<string, ReactNode> = {
  'reconstruction-garden': <g data-vignette="garden"><path d="M0 140 Q120 75 250 140 T500 110" fill="none" stroke="#6f8d58" strokeWidth="28" /><circle cx="115" cy="92" r="24" fill="#8b5e4b" /><path d="M140 92h110" stroke="#694739" strokeWidth="12" /></g>,
  'reconstruction-window': <g data-vignette="window"><rect x="70" y="35" width="160" height="105" fill="#9bd0d2" stroke="#694739" strokeWidth="10" /><path d="M150 35v105M70 88h160" stroke="#694739" strokeWidth="8" /><circle cx="320" cy="100" r="28" fill="#8b5e4b" /></g>,
  'reconstruction-cake': <g data-vignette="cake"><ellipse cx="250" cy="120" rx="115" ry="22" fill="#fffaf3" stroke="#694739" strokeWidth="8" /><path d="M165 120 Q250 35 335 120" fill="#8b5e4b" /><circle cx="250" cy="48" r="10" fill="#f9cf7c" /></g>,
  'reconstruction-shed': <g data-vignette="shed"><path d="M90 135V65l100-45 100 45v70Z" fill="#a86e4e" stroke="#694739" strokeWidth="8" /><rect x="165" y="78" width="50" height="57" fill="#f8e4bd" stroke="#694739" strokeWidth="6" /><circle cx="330" cy="110" r="26" fill="#8b5e4b" /></g>,
  'reconstruction-reveal': <g data-vignette="reveal"><rect x="90" y="72" width="230" height="70" rx="12" fill="#fff4dc" stroke="#694739" strokeWidth="8" /><path d="M90 72 Q205 25 320 72" fill="#5e87a0" stroke="#694739" strokeWidth="8" /><path d="M365 55v75M340 80h50" stroke="#8b5e4b" strokeWidth="12" /></g>,
  default: <g data-vignette="default"><rect x="80" y="40" width="340" height="100" rx="16" fill="#d8c0a5" /><circle cx="250" cy="90" r="28" fill="#8b5e4b" /></g>,
}

export function ReconstructionView({ steps, currentStep, language, onNext, onReplay }: ReconstructionViewProps) {
  const step = steps[currentStep]
  const isLast = currentStep === steps.length - 1
  const vignette = sceneVignettes[step.sceneId] ?? sceneVignettes.default
  return <section className="reconstruction-panel" aria-labelledby="reconstruction-title">
    <div className="panel-title"><h2 id="reconstruction-title">{getText(caseUiText.reconstruction, language)}</h2><span>{currentStep + 1} / {steps.length}</span></div>
    <article className="reconstruction-card">
      <svg className="reconstruction-vignette" viewBox="0 0 500 180" role="img" aria-label={getText(step.text, language)} data-scene-id={step.sceneId}>
        <rect width="500" height="180" rx="18" fill="#d8c0a5" />
        {vignette}
        <path d="M0 145h500" stroke="#694739" strokeWidth="5" />
      </svg>
      <p className="reconstruction-time">{getText(step.timestamp, language)}</p>
      <p>{getText(step.text, language)}</p>
    </article>
    {isLast ? <div className="reconstruction-final" role="status"><strong>{getText(caseUiText.caseUnderstood, language)}</strong><button type="button" onClick={onReplay}>{getText(caseUiText.replay, language)}</button></div> : <button className="reconstruction-next" type="button" onClick={onNext}>{getText(caseUiText.next, language)}</button>}
  </section>
}
