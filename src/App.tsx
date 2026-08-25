import { useEffect, useLayoutEffect, useReducer, useState } from 'react'
import type { Language } from './case/types'
import { missingCakeCase } from './case/missingCake'
import { createGameRuntime } from './game/runtime'
import { GameShell } from './ui/GameShell'
import { LandingPage, type Theme } from './ui/LandingPage'

const runtime = createGameRuntime(missingCakeCase)
const themeStorageKey = 'reasoning-game:theme'

function initialTheme(): Theme {
  try {
    const stored = localStorage.getItem(themeStorageKey)
    if (stored === 'light' || stored === 'dark') return stored
  } catch { /* storage unavailable */ }
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function App() {
  const [screen, setScreen] = useState<'landing' | 'game'>('landing')
  const [state, dispatch] = useReducer(runtime.reducer, undefined, runtime.loadGame)
  const [hasSavedGame, setHasSavedGame] = useState(runtime.hasSavedGame)
  const [theme, setTheme] = useState<Theme>(initialTheme)

  useEffect(() => {
    if (screen !== 'game') return
    setHasSavedGame(runtime.saveGame(state) === 'saved')
  }, [screen, state])
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])
  useEffect(() => {
    if (screen !== 'landing') return
    document.title = 'For a Reason'
    document.documentElement.lang = state.language
  }, [screen, state.language])

  const changeTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(nextTheme)
    try { localStorage.setItem(themeStorageKey, nextTheme) } catch { /* storage unavailable */ }
  }

  if (screen === 'landing') return <LandingPage
    language={state.language}
    theme={theme}
    hasSavedGame={hasSavedGame}
    onChangeLanguage={() => dispatch({ type: 'setLanguage', language: (state.language === 'en' ? 'ru' : 'en') as Language })}
    onChangeTheme={changeTheme}
    onPlay={() => setScreen('game')}
  />

  return <GameShell caseData={missingCakeCase} runtime={runtime} state={state} dispatch={dispatch} onHome={() => setScreen('landing')} />
}

export default App
