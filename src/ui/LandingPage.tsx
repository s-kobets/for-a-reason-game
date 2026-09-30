import type { ReactNode } from 'react'
import type { Language, LocalizedText } from '../case/types'
import { getText } from '../case/translations'
import { SCENE_VIEWBOX } from './SceneArtwork'

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
}

interface LandingPageProps {
  language: Language
  theme: Theme
  caseCards: LandingCaseCard[]
  onChangeLanguage(): void
  onChangeTheme(): void
  onPlay(caseId: string): void
}

const text = {
  nav: { en: 'Cases', ru: 'Дела' },
  title: { en: 'Something happened. Can you work out why?', ru: 'Что-то случилось. Сможете понять почему?' },
  intro: { en: 'Explore cozy scenes, question everyone, connect the clues, and rebuild the whole story.', ru: 'Исследуйте уютные сцены, задавайте вопросы, сопоставляйте улики и восстановите всю историю.' },
  start: { en: 'Start investigating', ru: 'Начать расследование' },
  choose: { en: 'Choose a case', ru: 'Выберите дело' },
  ready: { en: '2 cases ready', ru: '2 дела доступны' },
  inProgress: { en: 'In progress', ru: 'В процессе' },
  violin: { en: 'The Vanishing Violin', ru: 'Исчезнувшая скрипка' },
  violinDescription: { en: 'A concert ends with one instrument missing.', ru: 'После концерта исчезает одна скрипка.' },
  comingSoon: { en: 'Coming soon', ru: 'Скоро' },
  explore: { en: 'Explore every scene', ru: 'Исследуйте каждую сцену' },
  connect: { en: 'Connect clues', ru: 'Сопоставляйте улики' },
  explain: { en: 'Tell the full story', ru: 'Расскажите всю историю' },
  footer: { en: 'Small mysteries. No timers. No dead ends.', ru: 'Небольшие тайны. Без таймеров. Без тупиков.' },
  language: { en: 'Switch to Russian', ru: 'Переключить на английский' },
  light: { en: 'Turn on light theme', ru: 'Включить светлую тему' },
  dark: { en: 'Turn on dark theme', ru: 'Включить тёмную тему' },
} satisfies Record<string, LocalizedText>

export function LandingPage({ language, theme, caseCards, onChangeLanguage, onChangeTheme, onPlay }: LandingPageProps) {
  const t = (value: LocalizedText) => getText(value, language)
  return <main className="landing-page">
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
        <p className="eyebrow">For a Reason</p>
        <h1>{t(text.title)}</h1>
        <p>{t(text.intro)}</p>
        <a className="landing-primary" href="#cases">{t(text.start)}</a>
      </div>
      <div className="landing-preview" aria-hidden="true">
        <span className="preview-window" />
        <span className="preview-cake">🍰</span>
        <span className="preview-clue preview-clue-one">?</span>
        <span className="preview-clue preview-clue-two">!</span>
      </div>
    </section>
    <section id="cases" className="landing-cases" aria-labelledby="cases-title">
      <div className="landing-section-heading"><h2 id="cases-title">{t(text.choose)}</h2><span>{t(text.ready)}</span></div>
      <div className="case-grid">
        {caseCards.map((card) => {
          const title = t(card.title)
          const ariaLabel = t(card.hasSavedGame ? card.resumeLabel : card.playLabel)
          return <button key={card.id} className="case-card case-card-live" type="button" onClick={() => onPlay(card.id)} aria-label={ariaLabel}>
            <span className="case-card-preview" aria-hidden="true"><svg viewBox={SCENE_VIEWBOX} focusable="false" aria-hidden="true"><rect width="1000" height="620" fill="#f4d7a1" />{card.preview}</svg></span>
            <span>{t(card.number)}</span><strong>{title}</strong><p>{t(card.description)}</p>{card.hasSavedGame && <small>{t(text.inProgress)}</small>}
          </button>
        })}
        <article className="case-card" aria-disabled="true"><span>{t(text.comingSoon)}</span><strong>{t(text.violin)}</strong><p>{t(text.violinDescription)}</p></article>
      </div>
    </section>
    <section className="landing-steps" aria-label={t(text.explain)}>
      {[text.explore, text.connect, text.explain].map((step, index) => <div key={step.en}><b>0{index + 1}</b><span>{t(step)}</span></div>)}
    </section>
    <footer className="landing-footer">{t(text.footer)}</footer>
  </main>
}
