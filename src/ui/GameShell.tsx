import { useEffect, useMemo, useState, type Dispatch } from 'react'
import type { CaseDefinition, Character, Hotspot, Language } from '../case/types'
import { caseUiText, getText } from '../case/translations'
import { acquiredEvidenceIds, availableQuestions, canPresentContradiction } from '../game/rules'
import type { GameAction } from '../game/reducer'
import type { GameState } from '../game/state'
import { DialoguePanel } from './DialoguePanel'
import { MapPanel } from './MapPanel'
import { NotebookPanel } from './NotebookPanel'
import { SceneView } from './SceneView'

interface GameShellProps { caseData: CaseDefinition; state: GameState; dispatch: Dispatch<GameAction> }

export function GameShell({ caseData, state, dispatch }: GameShellProps) {
  const [panel, setPanel] = useState<'map' | 'notebook' | null>(null)
  const [character, setCharacter] = useState<Character>()
  const [detail, setDetail] = useState<Hotspot>()
  const location = caseData.locations.find(({ id }) => id === state.locationId) ?? caseData.locations[0]
  const hotspots = caseData.hotspots.filter(({ locationId }) => locationId === location.id)
  const characters = caseData.characters.filter(({ locationId }) => locationId === location.id)
  const evidence = caseData.evidence.filter(({ id }) => acquiredEvidenceIds(state).includes(id))
  const selectedEvidence = state.selectedEvidenceIds
  const questions = character ? availableQuestions(character, state) : []

  useEffect(() => { document.title = getText(caseData.title, state.language) }, [caseData.title, state.language])

  const languageLabel = state.language === 'en' ? 'RU' : 'EN'
  const changeLanguage = () => dispatch({ type: 'setLanguage', language: (state.language === 'en' ? 'ru' : 'en') as Language })
  const ask = (questionId: string) => dispatch({ type: 'askQuestion', questionId })
  const contradictionAvailable = canPresentContradiction(state)
  const feedback = useMemo(() => detail ? getText(detail.description, state.language) : '', [detail, state.language])

  return <main className="game-shell"><header className="game-header"><div><p className="eyebrow">{getText(caseUiText.reasoningGame, state.language)}</p><h1 className="case-title">{getText(caseData.title, state.language)}</h1></div><div className="header-actions"><button className="language-toggle" type="button" onClick={changeLanguage} aria-label={getText(caseUiText.language, state.language)}>{languageLabel}</button><button type="button" onClick={() => setPanel('map')}>{getText(caseUiText.map, state.language)}</button><button type="button" onClick={() => setPanel('notebook')}>{getText(caseUiText.notebook, state.language)}</button></div></header><div className="game-layout"><SceneView location={location} state={state} hotspots={hotspots} characters={characters} onAction={dispatch} onHotspot={(hotspot) => { dispatch({ type: 'discoverHotspot', hotspotId: hotspot.id }); setDetail(hotspot) }} onCharacter={setCharacter} /><aside className="sidebar"><MapPanel locations={caseData.locations.filter(({ id }) => state.openedLocationIds.includes(id))} language={state.language} currentLocationId={location.id} onSelectLocation={(locationId) => dispatch({ type: 'setLocation', locationId })} /><NotebookPanel evidence={evidence} deductions={caseData.deductions} selectedIds={selectedEvidence} language={state.language} onSelectEvidence={(id) => dispatch({ type: 'selectEvidence', evidenceId: id })} onDeduction={(id) => dispatch({ type: 'makeDeduction', deductionId: id })} /></aside></div>{panel === 'map' && <div className="mobile-panel"><MapPanel locations={caseData.locations.filter(({ id }) => state.openedLocationIds.includes(id))} language={state.language} currentLocationId={location.id} onSelectLocation={(locationId) => { dispatch({ type: 'setLocation', locationId }); setPanel(null) }} /></div>}{panel === 'notebook' && <div className="mobile-panel"><NotebookPanel evidence={evidence} deductions={caseData.deductions} selectedIds={selectedEvidence} language={state.language} onSelectEvidence={(id) => dispatch({ type: 'selectEvidence', evidenceId: id })} onDeduction={(id) => dispatch({ type: 'makeDeduction', deductionId: id })} /></div>}<DialoguePanel character={character} questions={questions} language={state.language} contradictionAvailable={contradictionAvailable} onAsk={ask} onContradiction={() => dispatch({ type: 'presentContradiction' })} onClose={() => setCharacter(undefined)} />{detail && <div className="overlay" role="presentation"><section className="evidence-dialog" role="dialog" aria-modal="true" aria-labelledby="evidence-title"><button className="close-button" type="button" onClick={() => setDetail(undefined)}>{getText(caseUiText.close, state.language)}</button><p className="eyebrow">{getText(caseUiText.evidence, state.language)}</p><h2 id="evidence-title">{getText(detail.title, state.language)}</h2><p>{feedback}</p>{detail.falseLead && <p className="false-lead">{getText(detail.falseLead, state.language)}</p>}<button type="button" onClick={() => setDetail(undefined)}>{getText(caseUiText.notebook, state.language)}</button></section></div>}</main>
}
