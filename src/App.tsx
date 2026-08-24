import { useEffect, useReducer } from 'react'
import { missingCakeCase } from './case/missingCake'
import { gameReducer } from './game/reducer'
import { loadGame, saveGame } from './game/storage'
import { GameShell } from './ui/GameShell'

function App() {
  const [state, dispatch] = useReducer(gameReducer, undefined, loadGame)
  useEffect(() => saveGame(state), [state])
  return <GameShell caseData={missingCakeCase} state={state} dispatch={dispatch} />
}

export default App
