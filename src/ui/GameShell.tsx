import { useEffect, useMemo, useRef, useState, type Dispatch } from 'react'
import type { CaseDefinition, Character, Hotspot, Language } from '../case/types'
import { caseUiText, getText } from '../case/translations'
import { acquiredEvidenceIds, availableQuestions, canMakeDeduction, canPresentContradiction, scoreTheory } from '../game/rules'
import type { GameAction } from '../game/reducer'
import type { GameState } from '../game/state'
import { DialoguePanel } from './DialoguePanel'
import { MapPanel } from './MapPanel'
import { NotebookPanel } from './NotebookPanel'
import { SceneView } from './SceneView'
import { ReconstructionView } from './ReconstructionView'
import { TheoryPanel, type TheoryResult } from './TheoryPanel'

interface GameShellProps { caseData: CaseDefinition; state: GameState; dispatch: Dispatch<GameAction>; saveStatus?: 'saved' | 'memory'; saveStatusText?: typeof caseUiText.saved }

export function GameShell({ caseData, state, dispatch, saveStatus = 'saved', saveStatusText = caseUiText.saved }: GameShellProps) {
  const [panel, setPanel] = useState<'map' | 'notebook' | null>(null)
  const [character, setCharacter] = useState<Character>()
  const [detail, setDetail] = useState<Hotspot>()
  const [deductionFeedback, setDeductionFeedback] = useState('')
  const [theoryResult, setTheoryResult] = useState<TheoryResult | null>(() => scoreTheory(state.theory, caseData.solution) === 'complete' ? 'complete' : null)
  const [resetOpen, setResetOpen] = useState(false)
  const mapTriggerRef = useRef<HTMLButtonElement>(null)
  const notebookTriggerRef = useRef<HTMLButtonElement>(null)
  const panelCloseRef = useRef<HTMLButtonElement>(null)
  const dialogueCloseRef = useRef<HTMLButtonElement>(null)
  const detailCloseRef = useRef<HTMLButtonElement>(null)
  const resetCloseRef = useRef<HTMLButtonElement>(null)
  const focusAfterDialogueRef = useRef<HTMLElement | null>(null)
  const focusAfterDetailRef = useRef<HTMLElement | null>(null)
  const resetTriggerRef = useRef<HTMLButtonElement>(null)
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
  useEffect(() => { if (detail) window.setTimeout(() => detailCloseRef.current?.focus(), 0) }, [detail])
  useEffect(() => { if (resetOpen) window.setTimeout(() => resetCloseRef.current?.focus(), 0) }, [resetOpen])
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (resetOpen) setResetOpen(false)
      else if (detail) closeDetail()
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
  const closeDetail = () => {
    setDetail(undefined)
    window.setTimeout(() => focusAfterDetailRef.current?.focus(), 0)
  }
  const openCharacter = (nextCharacter: Character) => {
    focusAfterDialogueRef.current = document.activeElement as HTMLElement
    setCharacter(nextCharacter)
  }
  const changeLanguage = () => dispatch({ type: 'setLanguage', language: (state.language === 'en' ? 'ru' : 'en') as Language })
  const handleHotspot = (hotspot: Hotspot) => {
    if (!hotspot.decorative) dispatch({ type: 'discoverHotspot', hotspotId: hotspot.id })
    focusAfterDetailRef.current = document.activeElement as HTMLElement
    setDetail(hotspot)
  }
  const resetGame = () => {
    dispatch({ type: 'reset' })
    setTheoryResult(null)
    setResetOpen(false)
    window.setTimeout(() => resetTriggerRef.current?.focus(), 0)
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
  const submitTheory = () => setTheoryResult(scoreTheory(state.theory, caseData.solution))

  return <main className="game-shell">
    <header className="game-header">
      <div><p className="eyebrow">{getText(caseUiText.reasoningGame, state.language)}</p><h1 className="case-title">{getText(caseData.title, state.language)}</h1></div>
      <div className="header-actions">
        <span className={`save-indicator save-${saveStatus}`} aria-live="polite">{getText(saveStatusText, state.language)}</span>
        <button className="language-toggle" type="button" onClick={changeLanguage} aria-label={getText(caseUiText.language, state.language)}>{languageLabel}</button>
        <button ref={mapTriggerRef} type="button" onClick={() => setPanel('map')}>{getText(caseUiText.map, state.language)}</button>
        <button ref={notebookTriggerRef} type="button" onClick={() => setPanel('notebook')}>{getText(caseUiText.notebook, state.language)}</button>
        <button ref={resetTriggerRef} type="button" onClick={() => setResetOpen(true)}>{getText(caseUiText.reset, state.language)}</button>
      </div>
    </header>
    <div className="game-layout"><SceneView location={location} state={state} hotspots={hotspots} characters={characters} onAction={dispatch} onHotspot={handleHotspot} onCharacter={openCharacter} /><aside className="sidebar"><MapPanel locations={mobileLocations} language={state.language} currentLocationId={location.id} onSelectLocation={(locationId) => dispatch({ type: 'setLocation', locationId })} /><NotebookPanel evidence={evidence} deductions={caseData.deductions} completedIds={state.deductionIds} selectedIds={state.selectedEvidenceIds} language={state.language} onSelectEvidence={(id) => dispatch({ type: 'toggleEvidence', evidenceId: id })} onMakeDeduction={handleDeduction} feedback={deductionFeedback} /></aside></div>
    <TheoryPanel theory={state.theory} solution={caseData.solution} language={state.language} result={theoryResult} onChange={(theory) => { setTheoryResult(null); dispatch({ type: 'setTheory', theory }) }} onSubmit={submitTheory} />
    {theoryResult === 'complete' && <ReconstructionView steps={caseData.reconstruction} currentStep={state.reconstructionStep} language={state.language} onNext={() => dispatch({ type: 'setReconstructionStep', step: state.reconstructionStep + 1 })} onReplay={() => dispatch({ type: 'setReconstructionStep', step: 0 })} />}
    {panel && <div className="mobile-panel-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closePanel() }}><section className="mobile-panel" role="dialog" aria-modal="true" aria-labelledby={panel === 'map' ? 'map-title-mobile' : 'notebook-title-mobile'}>{panel === 'map' ? <MapPanel locations={mobileLocations} language={state.language} currentLocationId={location.id} titleId="map-title-mobile" closeRef={panelCloseRef} onClose={closePanel} onSelectLocation={(locationId) => { dispatch({ type: 'setLocation', locationId }); closePanel() }} /> : <NotebookPanel evidence={evidence} deductions={caseData.deductions} completedIds={state.deductionIds} selectedIds={state.selectedEvidenceIds} language={state.language} titleId="notebook-title-mobile" closeRef={panelCloseRef} onClose={closePanel} onSelectEvidence={(id) => dispatch({ type: 'toggleEvidence', evidenceId: id })} onMakeDeduction={handleDeduction} feedback={deductionFeedback} />}</section></div>}
    <DialoguePanel character={character} questions={questions} statements={responses} contradiction={caseData.contradiction} contradictionEvidence={contradictionEvidence} language={state.language} contradictionAvailable={contradictionAvailable} closeRef={dialogueCloseRef} onAsk={(questionId) => dispatch({ type: 'askQuestion', questionId })} onContradiction={() => dispatch({ type: 'presentContradiction' })} onClose={closeDialogue} />
    {detail && <div className="overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeDetail() }}><section className="evidence-dialog" role="dialog" aria-modal="true" aria-labelledby={`evidence-title-${detail.id}`} aria-describedby={`evidence-description-${detail.id}`}><button ref={detailCloseRef} className="close-button" type="button" onClick={closeDetail}>{getText(caseUiText.close, state.language)}</button><p className="eyebrow">{getText(caseUiText.evidence, state.language)}</p><h2 id={`evidence-title-${detail.id}`}>{getText(detail.title, state.language)}</h2><p id={`evidence-description-${detail.id}`}>{detailDescription}</p>{detail.falseLead && <p className="false-lead">{getText(detail.falseLead, state.language)}</p>}<button type="button" onClick={closeDetail}>{getText(caseUiText.notebook, state.language)}</button></section></div>}
    {resetOpen && <div className="overlay" role="presentation"><section className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="reset-title" aria-describedby="reset-description"><h2 id="reset-title">{getText(caseUiText.resetTitle, state.language)}</h2><p id="reset-description">{getText(caseUiText.resetPrompt, state.language)}</p><div className="dialog-actions"><button ref={resetCloseRef} type="button" onClick={() => setResetOpen(false)}>{getText(caseUiText.cancel, state.language)}</button><button className="danger-button" type="button" onClick={resetGame}>{getText(caseUiText.confirmReset, state.language)}</button></div></section></div>}
  </main>
}
