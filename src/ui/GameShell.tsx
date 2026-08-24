import { useEffect, useMemo, useRef, useState, type Dispatch } from 'react'
import type { CaseDefinition, Character, Hotspot, Language } from '../case/types'
import { caseUiText, getText } from '../case/translations'
import { acquiredEvidenceIds, availableQuestions, canMakeDeduction, canPresentContradiction } from '../game/rules'
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
  const [deductionFeedback, setDeductionFeedback] = useState('')
  const mapTriggerRef = useRef<HTMLButtonElement>(null)
  const notebookTriggerRef = useRef<HTMLButtonElement>(null)
  const panelCloseRef = useRef<HTMLButtonElement>(null)
  const dialogueCloseRef = useRef<HTMLButtonElement>(null)
  const focusAfterDialogueRef = useRef<HTMLElement | null>(null)
  const location = caseData.locations.find(({ id }) => id === state.locationId) ?? caseData.locations[0]
  const hotspots = caseData.hotspots.filter(({ locationId }) => locationId === location.id)
  const characters = caseData.characters.filter(({ locationId }) => locationId === location.id)
  const acquiredIds = acquiredEvidenceIds(state)
  const evidence = caseData.evidence.filter(({ id }) => acquiredIds.includes(id))
  const questions = character ? availableQuestions(character, state) : []
  const contradictionAvailable = canPresentContradiction(state) && !state.receivedStatementIds.includes(caseData.contradiction.revealedStatementId)
  const contradictionEvidence = caseData.evidence.filter(({ id }) => caseData.contradiction.evidenceIds.includes(id))
  const responses = character ? caseData.statements.filter(({ id, speakerId }) => speakerId === character.id && state.receivedStatementIds.includes(id)) : []

  useEffect(() => { document.title = getText(caseData.title, state.language) }, [caseData.title, state.language])
  useEffect(() => { if (panel) window.setTimeout(() => panelCloseRef.current?.focus(), 0) }, [panel])
  useEffect(() => { if (character) window.setTimeout(() => dialogueCloseRef.current?.focus(), 0) }, [character])
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (detail) setDetail(undefined)
      else if (character) closeDialogue()
      else if (panel) closePanel()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  })

  const closePanel = () => {
    const trigger = panel === 'map' ? mapTriggerRef.current : notebookTriggerRef.current
    setPanel(null)
    window.setTimeout(() => trigger?.focus(), 0)
  }
  const closeDialogue = () => {
    setCharacter(undefined)
    window.setTimeout(() => focusAfterDialogueRef.current?.focus(), 0)
  }
  const openCharacter = (nextCharacter: Character) => {
    focusAfterDialogueRef.current = document.activeElement as HTMLElement
    setCharacter(nextCharacter)
  }
  const changeLanguage = () => dispatch({ type: 'setLanguage', language: (state.language === 'en' ? 'ru' : 'en') as Language })
  const handleHotspot = (hotspot: Hotspot) => {
    if (!hotspot.decorative) dispatch({ type: 'discoverHotspot', hotspotId: hotspot.id })
    setDetail(hotspot)
  }
  const handleDeduction = (deductionId: string) => {
    const deduction = caseData.deductions.find(({ id }) => id === deductionId)
    if (state.deductionIds.includes(deductionId)) {
      setDeductionFeedback(getText(caseUiText.deductionAlreadyMade, state.language))
      return
    }
    if (!deduction || !canMakeDeduction(deduction, state)) {
      setDeductionFeedback(getText(caseUiText.notEnoughEvidence, state.language))
      return
    }
    dispatch({ type: 'makeDeduction', deductionId })
    setDeductionFeedback(getText(caseUiText.deductionAdded, state.language))
  }
  const mobileLocations = caseData.locations.filter(({ id }) => state.openedLocationIds.includes(id))
  const languageLabel = state.language === 'en' ? 'RU' : 'EN'
  const detailDescription = useMemo(() => detail ? getText(detail.description, state.language) : '', [detail, state.language])

  return <main className="game-shell"><header className="game-header"><div><p className="eyebrow">{getText(caseUiText.reasoningGame, state.language)}</p><h1 className="case-title">{getText(caseData.title, state.language)}</h1></div><div className="header-actions"><button className="language-toggle" type="button" onClick={changeLanguage} aria-label={getText(caseUiText.language, state.language)}>{languageLabel}</button><button ref={mapTriggerRef} type="button" onClick={() => setPanel('map')}>{getText(caseUiText.map, state.language)}</button><button ref={notebookTriggerRef} type="button" onClick={() => setPanel('notebook')}>{getText(caseUiText.notebook, state.language)}</button></div></header><div className="game-layout"><SceneView location={location} state={state} hotspots={hotspots} characters={characters} onAction={dispatch} onHotspot={handleHotspot} onCharacter={openCharacter} /><aside className="sidebar"><MapPanel locations={mobileLocations} language={state.language} currentLocationId={location.id} onSelectLocation={(locationId) => dispatch({ type: 'setLocation', locationId })} /><NotebookPanel evidence={evidence} deductions={caseData.deductions} completedIds={state.deductionIds} selectedIds={state.selectedEvidenceIds} language={state.language} onSelectEvidence={(id) => dispatch({ type: 'toggleEvidence', evidenceId: id })} onMakeDeduction={handleDeduction} feedback={deductionFeedback} /></aside></div>{panel && <div className="mobile-panel-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closePanel() }}><section className="mobile-panel" role="dialog" aria-modal="true" aria-labelledby={panel === 'map' ? 'map-title-mobile' : 'notebook-title-mobile'}>{panel === 'map' ? <MapPanel locations={mobileLocations} language={state.language} currentLocationId={location.id} titleId="map-title-mobile" closeRef={panelCloseRef} onClose={closePanel} onSelectLocation={(locationId) => { dispatch({ type: 'setLocation', locationId }); closePanel() }} /> : <NotebookPanel evidence={evidence} deductions={caseData.deductions} completedIds={state.deductionIds} selectedIds={state.selectedEvidenceIds} language={state.language} titleId="notebook-title-mobile" closeRef={panelCloseRef} onClose={closePanel} onSelectEvidence={(id) => dispatch({ type: 'toggleEvidence', evidenceId: id })} onMakeDeduction={handleDeduction} feedback={deductionFeedback} />}</section></div>}<DialoguePanel character={character} questions={questions} statements={responses} contradiction={caseData.contradiction} contradictionEvidence={contradictionEvidence} language={state.language} contradictionAvailable={contradictionAvailable} closeRef={dialogueCloseRef} onAsk={(questionId) => dispatch({ type: 'askQuestion', questionId })} onContradiction={() => dispatch({ type: 'presentContradiction' })} onClose={closeDialogue} />{detail && <div className="overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setDetail(undefined) }}><section className="evidence-dialog" role="dialog" aria-modal="true" aria-labelledby={`evidence-title-${detail.id}`}><button className="close-button" type="button" onClick={() => setDetail(undefined)}>{getText(caseUiText.close, state.language)}</button><p className="eyebrow">{getText(caseUiText.evidence, state.language)}</p><h2 id={`evidence-title-${detail.id}`}>{getText(detail.title, state.language)}</h2><p>{detailDescription}</p>{detail.falseLead && <p className="false-lead">{getText(detail.falseLead, state.language)}</p>}<button type="button" onClick={() => setDetail(undefined)}>{getText(caseUiText.notebook, state.language)}</button></section></div>}</main>
}
