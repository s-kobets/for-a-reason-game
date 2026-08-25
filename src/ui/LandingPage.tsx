import type { Language, LocalizedText } from '../case/types'
import { getText } from '../case/translations'

export type Theme = 'light' | 'dark'

interface LandingPageProps {
  language: Language
  theme: Theme
  hasSavedGame: boolean
  onChangeLanguage(): void
  onChangeTheme(): void
  onPlay(): void
}

const text = {
  nav: { en: 'Cases', ru: 'Дела' },
  title: { en: 'Something happened. Can you work out why?', ru: 'Что-то случилось. Сможете понять почему?' },
  intro: { en: 'Explore cozy scenes, question everyone, connect the clues, and rebuild the whole story.', ru: 'Исследуйте уютные сцены, задавайте вопросы, сопоставляйте улики и восстановите всю историю.' },
  start: { en: 'Start investigating', ru: 'Начать расследование' },
  resume: { en: 'Resume your case', ru: 'Продолжить расследование' },
  choose: { en: 'Choose a case', ru: 'Выберите дело' },
  ready: { en: '1 case ready', ru: '1 дело доступно' },
  missingCake: { en: 'The Missing Cake', ru: 'Исчезнувший торт' },
  playCake: { en: 'Play The Missing Cake', ru: 'Играть в «Исчезнувший торт»' },
  greenhouse: { en: 'The Midnight Greenhouse', ru: 'Полуночная оранжерея' },
  violin: { en: 'The Vanishing Violin', ru: 'Исчезнувшая скрипка' },
  comingSoon: { en: 'Coming soon', ru: 'Скоро' },
  explore: { en: 'Explore every scene', ru: 'Исследуйте каждую сцену' },
  connect: { en: 'Connect clues', ru: 'Сопоставляйте улики' },
  explain: { en: 'Tell the full story', ru: 'Расскажите всю историю' },
  footer: { en: 'Small mysteries. No timers. No dead ends.', ru: 'Небольшие тайны. Без таймеров. Без тупиков.' },
  language: { en: 'Change language', ru: 'Сменить язык' },
  light: { en: 'Turn on light theme', ru: 'Включить светлую тему' },
  dark: { en: 'Turn on dark theme', ru: 'Включить тёмную тему' },
} satisfies Record<string, LocalizedText>

export function LandingPage({ language, theme, hasSavedGame, onChangeLanguage, onChangeTheme, onPlay }: LandingPageProps) {
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
        <button className="landing-primary" type="button" onClick={onPlay}>{t(hasSavedGame ? text.resume : text.start)}</button>
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
        <button className="case-card case-card-live" type="button" onClick={onPlay} aria-label={t(text.playCake)}><span>Case 01</span><strong>{t(text.missingCake)}</strong></button>
        <article className="case-card" aria-disabled="true"><span>{t(text.comingSoon)}</span><strong>{t(text.greenhouse)}</strong></article>
        <article className="case-card" aria-disabled="true"><span>{t(text.comingSoon)}</span><strong>{t(text.violin)}</strong></article>
      </div>
    </section>
    <section className="landing-steps" aria-label={t(text.explain)}>
      {[text.explore, text.connect, text.explain].map((step, index) => <div key={step.en}><b>0{index + 1}</b><span>{t(step)}</span></div>)}
    </section>
    <footer className="landing-footer">{t(text.footer)}</footer>
  </main>
}
