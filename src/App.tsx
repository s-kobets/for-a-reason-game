import { useEffect, useLayoutEffect, useReducer, useState } from 'react'
import type { CaseDefinition, Language } from './case/types'
import { missingCakeCase } from './case/missingCake'
import { midnightGreenhouseCase } from './case/midnightGreenhouse'
import { createGameRuntime } from './game/runtime'
import type { GameRuntime } from './game/runtime'
import { GameShell } from './ui/GameShell'
import { LandingPage, type LandingCaseCard, type Theme } from './ui/LandingPage'

const games = [
  {
    caseData: missingCakeCase, runtime: createGameRuntime(missingCakeCase), number: { en: 'Case 01', ru: 'Дело 01' },
    playLabel: { en: 'Play The Missing Cake', ru: 'Играть в «Исчезнувший торт»' },
    resumeLabel: { en: 'Resume The Missing Cake', ru: 'Продолжить «Исчезнувший торт»' },
  },
  {
    caseData: midnightGreenhouseCase, runtime: createGameRuntime(midnightGreenhouseCase), number: { en: 'Case 02', ru: 'Дело 02' },
    playLabel: { en: 'Play The Midnight Greenhouse', ru: 'Играть в «Полуночную оранжерею»' },
    resumeLabel: { en: 'Resume The Midnight Greenhouse', ru: 'Продолжить «Полуночную оранжерею»' },
  },
] satisfies { caseData: CaseDefinition; runtime: GameRuntime; number: { en: string; ru: string }; playLabel: { en: string; ru: string }; resumeLabel: { en: string; ru: string } }[]
const themeStorageKey = 'reasoning-game:theme'

function initialTheme(): Theme {
  try {
    const stored = localStorage.getItem(themeStorageKey)
    if (stored === 'light' || stored === 'dark') return stored
  } catch { /* storage unavailable */ }
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

interface GameSessionProps {
  caseData: CaseDefinition
  runtime: GameRuntime
  language: Language
  onHome(language: Language): void
}

function GameSession({ caseData, runtime, language, onHome }: GameSessionProps) {
  const [state, dispatch] = useReducer(runtime.reducer, undefined, () => {
    const hasSave = runtime.hasSavedGame()
    const loaded = runtime.loadGame()
    return hasSave ? loaded : { ...loaded, language }
  })

  useEffect(() => { runtime.saveGame(state) }, [runtime, state])
  return <GameShell caseData={caseData} runtime={runtime} state={state} dispatch={dispatch} onHome={() => onHome(state.language)} />
}

function App() {
  const [selectedCaseId, setSelectedCaseId] = useState<string>()
  const [language, setLanguage] = useState<Language>(() => games[0].runtime.loadGame().language)
  const [theme, setTheme] = useState<Theme>(initialTheme)

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])
  useEffect(() => {
    if (selectedCaseId) return
    document.title = 'For a Reason'
    document.documentElement.lang = language
  }, [selectedCaseId, language])

  const changeTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(nextTheme)
    try { localStorage.setItem(themeStorageKey, nextTheme) } catch { /* storage unavailable */ }
  }

  const selectedGame = games.find(({ caseData }) => caseData.id === selectedCaseId)
  if (selectedGame) return <GameSession
    key={selectedGame.caseData.id}
    caseData={selectedGame.caseData}
    runtime={selectedGame.runtime}
    language={language}
    onHome={(nextLanguage) => { setLanguage(nextLanguage); setSelectedCaseId(undefined) }}
  />

  const caseCards: LandingCaseCard[] = games.map(({ caseData, runtime, number, playLabel, resumeLabel }) => ({
    id: caseData.id,
    number,
    title: caseData.title,
    playLabel,
    resumeLabel,
    description: caseData.introduction,
    preview: caseData.renderScene(caseData.locations.find(({ id }) => id === caseData.initialLocationId)?.sceneId ?? ''),
    hasSavedGame: runtime.hasSavedGame(),
  }))

  return <LandingPage
    language={language}
    theme={theme}
    caseCards={caseCards}
    onChangeLanguage={() => setLanguage((current) => current === 'en' ? 'ru' : 'en')}
    onChangeTheme={changeTheme}
    onPlay={setSelectedCaseId}
  />
}

export default App
