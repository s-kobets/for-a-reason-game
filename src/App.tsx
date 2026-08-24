import { useEffect, useReducer, useState } from 'react'
import { missingCakeCase } from './case/missingCake'
import { gameReducer } from './game/reducer'
import { loadGame, saveGame } from './game/storage'
import { GameShell } from './ui/GameShell'
import { caseUiText } from './case/translations'

function App() {
  const [state, dispatch] = useReducer(gameReducer, undefined, loadGame)
  const [saveStatus, setSaveStatus] = useState<'saved' | 'memory'>('saved')
  useEffect(() => setSaveStatus(saveGame(state)), [state])
  return <GameShell caseData={missingCakeCase} state={state} dispatch={dispatch} saveStatus={saveStatus} saveStatusText={saveStatus === 'saved' ? caseUiText.saved : caseUiText.saveInMemory} />
}

export default App
