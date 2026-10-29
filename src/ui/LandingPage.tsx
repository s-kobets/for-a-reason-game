import type { ReactNode } from 'react'
import type { Language, LocalizedText } from '../case/types'
import { getText } from '../case/translations'
import { badges } from '../game/badges'
import { SCENE_VIEWBOX } from './SceneArtwork'
import { useLandingEffects } from './useLandingEffects'
import './landing.css'

export type Theme = 'light' | 'dark'

export interface LandingCaseCard {
  id: string
  number: LocalizedText
  title: LocalizedText
  playLabel: LocalizedText
  resumeLabel: LocalizedText
  description: LocalizedText
  preview: ReactNode
  hasSavedGame: boolean
  stars?: number
}

interface LandingPageProps {
  language: Language
  theme: Theme
  caseCards: LandingCaseCard[]
  ownedBadgeIds?: string[]
  onChangeLanguage(): void
  onChangeTheme(): void
  onPlay(caseId: string): void
}

const text = {
  nav: { en: 'Cases', ru: 'Дела' },
  title: { en: 'Something happened. Can you work out why?', ru: 'Что-то случилось. Сможете понять почему?' },
  intro: { en: 'Explore cozy scenes, question everyone, connect the clues, and rebuild the whole story.', ru: 'Исследуйте уютные сцены, задавайте вопросы, сопоставляйте улики и восстановите всю историю.' },
  start: { en: 'Start investigating', ru: 'Начать расследование' },
  shelf: { en: 'Your badges', ru: 'Твои значки' },
  choose: { en: 'Choose a case', ru: 'Выберите дело' },
  stars: { en: 'stars', ru: 'звёзд' },
  inProgress: { en: 'In progress', ru: 'В процессе' },
  explore: { en: 'Explore every scene', ru: 'Исследуйте каждую сцену' },
  connect: { en: 'Connect clues', ru: 'Сопоставляйте улики' },
  explain: { en: 'Tell the full story', ru: 'Расскажите всю историю' },
  footer: { en: 'Small mysteries. No timers. No dead ends.', ru: 'Небольшие тайны. Без таймеров. Без тупиков.' },
  language: { en: 'Switch to Russian', ru: 'Переключить на английский' },
  light: { en: 'Turn on light theme', ru: 'Включить светлую тему' },
  dark: { en: 'Turn on dark theme', ru: 'Включить тёмную тему' },
} satisfies Record<string, LocalizedText>

const readyCount = (count: number): LocalizedText => ({ en: `${count} case${count === 1 ? '' : 's'} ready`, ru: `Доступно дел: ${count}` })

export function LandingPage({ language, theme, caseCards, ownedBadgeIds = [], onChangeLanguage, onChangeTheme, onPlay }: LandingPageProps) {
  const t = (value: LocalizedText) => getText(value, language)
  const rootRef = useLandingEffects()
  return <main className="landing-page" ref={rootRef}>
    <div className="landing-bg" aria-hidden="true"><i className="orb orb-a" /><i className="orb orb-b" /><i className="orb orb-c" /><i className="grain" /><i className="spotlight" /></div>
    <header className="landing-header">
      <a className="landing-brand" href="#top">For a Reason</a>
      <nav aria-label={t(text.nav)}>
        <a href="#cases">{t(text.nav)}</a>
        <button type="button" onClick={onChangeLanguage} aria-label={t(text.language)}>{language === 'en' ? 'RU' : 'EN'}</button>
        <button type="button" onClick={onChangeTheme} aria-label={t(theme === 'dark' ? text.light : text.dark)}>{theme === 'dark' ? '☀' : '☾'}</button>
      </nav>
    </header>
    <section id="top" className="landing-hero">
      <div className="landing-hero-copy">
        <p className="landing-eyebrow"><i />For a Reason</p>
        <h1>{t(text.title)}</h1>
        <p>{t(text.intro)}</p>
        <div className="landing-cta"><a className="landing-primary" href="#cases">{t(text.start)}<b aria-hidden="true">→</b></a></div>
      </div>
      <div className="landing-preview" aria-hidden="true">
        <svg className="preview-string" viewBox="0 0 400 400" fill="none"><path d="M70 110 C150 60 190 190 200 210 S320 120 335 300" /></svg>
        <div className="polaroid polaroid-main"><span className="preview-cake">🍰</span><em>CASE 01</em></div>
        <div className="polaroid polaroid-two"><span>🔍</span><em>?</em></div>
        <div className="polaroid polaroid-three"><span>🕯️</span><em>!</em></div>
        <span className="preview-clue preview-clue-one">?</span>
        <span className="preview-clue preview-clue-two">!</span>
        <span className="preview-clue preview-clue-three">✦</span>
      </div>
      <a className="scroll-hint" href="#cases" aria-hidden="true" tabIndex={-1}><i /></a>
    </section>
    <section id="cases" className="landing-cases" aria-labelledby="cases-title">
      <div className="landing-section-heading" data-reveal><h2 id="cases-title">{t(text.choose)}</h2><span>{t(readyCount(caseCards.length))}</span></div>
      <div className="case-grid" data-reveal>
        {caseCards.map((card) => {
          const title = t(card.title)
          const ariaLabel = t(card.hasSavedGame ? card.resumeLabel : card.playLabel)
          return <button key={card.id} className="case-card case-card-live" type="button" onClick={() => onPlay(card.id)} aria-label={ariaLabel}>
            <span className="case-card-preview" aria-hidden="true"><svg viewBox={SCENE_VIEWBOX} focusable="false" aria-hidden="true"><rect width="1000" height="620" fill="#f4d7a1" />{card.preview}</svg></span>
            <span>{t(card.number)}</span><strong>{title}</strong><p>{t(card.description)}</p>{card.stars ? <small className="case-stars" aria-label={`${card.stars} ${t(text.stars)}`}>{'★'.repeat(card.stars)}{'☆'.repeat(3 - card.stars)}</small> : card.hasSavedGame && <small>{t(text.inProgress)}</small>}
          </button>
        })}
      </div>
    </section>
    <section className="badge-shelf" data-reveal aria-labelledby="badges-title">
      <h2 id="badges-title">{t(text.shelf)} {ownedBadgeIds.length}/{badges.length}</h2>
      <ul>{badges.map((badge) => { const owned = ownedBadgeIds.includes(badge.id); return <li key={badge.id} className={owned ? 'badge is-owned' : 'badge'}><span className="badge-icon" aria-hidden="true">{owned ? badge.icon : '🔒'}</span><strong>{owned ? t(badge.title) : '???'}</strong><small>{t(badge.hint)}</small></li> })}</ul>
    </section>
    <section className="landing-steps" data-reveal aria-label={t(text.explain)}>
      {[text.explore, text.connect, text.explain].map((step, index) => <div key={step.en}><b>0{index + 1}</b><span>{t(step)}</span></div>)}
    </section>
    <footer className="landing-footer" data-reveal>{t(text.footer)}</footer>
  </main>
}
