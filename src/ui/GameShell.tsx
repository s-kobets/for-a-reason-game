import { useEffect, useMemo, useRef, useState, type Dispatch } from 'react'
import type { CaseDefinition, Character, Hotspot, Language } from '../case/types'
import { caseUiText, getText } from '../case/translations'
import type { GameAction } from '../game/reducer'
import type { GameRuntime } from '../game/runtime'
import type { GameState } from '../game/state'
import { DialoguePanel } from './DialoguePanel'
import { MapPanel } from './MapPanel'
import { NotebookPanel } from './NotebookPanel'
import { SceneView } from './SceneView'
import { ReconstructionView } from './ReconstructionView'
import { TheoryPanel, type TheoryResult } from './TheoryPanel'
import { FocusBoundary } from './FocusBoundary'

interface GameShellProps { caseData: CaseDefinition; runtime: GameRuntime; state: GameState; dispatch: Dispatch<GameAction>; onHome(): void }
const helpStorageKey = 'reasoning-game:help-seen:v1'

export function GameShell({ caseData, runtime, state, dispatch, onHome }: GameShellProps) {
  const [panel, setPanel] = useState<'map' | 'notebook' | null>(null)
  const [character, setCharacter] = useState<Character>()
  const [detail, setDetail] = useState<Hotspot>()
  const [deductionFeedback, setDeductionFeedback] = useState('')
  const [theoryResult, setTheoryResult] = useState<TheoryResult | null>(() => runtime.scoreTheory(state.theory) === 'complete' ? 'complete' : null)
  const [resetOpen, setResetOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(() => {
    try {
      return localStorage.getItem(helpStorageKey) === null
    } catch {
      return true
    }
  })
  const mapTriggerRef = useRef<HTMLButtonElement>(null)
  const notebookTriggerRef = useRef<HTMLButtonElement>(null)
  const panelCloseRef = useRef<HTMLButtonElement>(null)
  const dialogueCloseRef = useRef<HTMLButtonElement>(null)
  const detailCloseRef = useRef<HTMLButtonElement>(null)
  const resetCloseRef = useRef<HTMLButtonElement>(null)
  const helpTriggerRef = useRef<HTMLButtonElement>(null)
  const helpCloseRef = useRef<HTMLButtonElement>(null)
  const helpAutoOpenRef = useRef(helpOpen)
  const focusAfterDialogueRef = useRef<HTMLElement | null>(null)
  const focusAfterDetailRef = useRef<HTMLElement | null>(null)
  const resetTriggerRef = useRef<HTMLButtonElement>(null)
  const location = caseData.locations.find(({ id }) => id === state.locationId) ?? caseData.locations[0]
  const hotspots = caseData.hotspots.filter(({ locationId }) => locationId === location.id)
  const characters = caseData.characters.filter(({ locationId }) => locationId === location.id)
  const acquiredIds = runtime.acquiredEvidenceIds(state)
  const evidence = caseData.evidence.filter(({ id }) => acquiredIds.includes(id)).map((item) => item.text ? item : { ...item, text: caseData.statements.find(({ id }) => id === item.statementId)?.text })
  const totalClues = caseData.hotspots.filter(({ observationId }) => observationId).length
  const foundClues = caseData.hotspots.filter(({ observationId, id }) => observationId && state.discoveredHotspotIds.includes(id)).length
  const questions = character ? runtime.availableQuestions(character, state) : []
  const askedQuestions = character ? character.questions.filter(({ id }) => state.askedQuestionIds.includes(id)) : []
  const contradiction = character ? runtime.availableContradictions(character, state)[0] : undefined
  const contradictionEvidence = contradiction ? evidence.filter(({ id }) => contradiction.evidenceIds.includes(id)) : []
  const responses = character ? caseData.statements.filter(({ id, speakerId }) => speakerId === character.id && state.receivedStatementIds.includes(id)) : []
  const availableDeductionIds = caseData.deductions.filter((deduction) => !state.deductionIds.includes(deduction.id) && runtime.canMakeDeduction(deduction, state)).map(({ id }) => id)

  useEffect(() => {
    document.title = getText(caseData.title, state.language)
    document.documentElement.lang = state.language
  }, [caseData.title, state.language])
  useEffect(() => { if (panel) window.setTimeout(() => panelCloseRef.current?.focus(), 0) }, [panel])
  useEffect(() => { if (character) window.setTimeout(() => dialogueCloseRef.current?.focus(), 0) }, [character])
  useEffect(() => { if (detail) window.setTimeout(() => detailCloseRef.current?.focus(), 0) }, [detail])
  useEffect(() => { if (resetOpen) window.setTimeout(() => resetCloseRef.current?.focus(), 0) }, [resetOpen])
  useEffect(() => { if (helpOpen) window.setTimeout(() => helpCloseRef.current?.focus(), 0) }, [helpOpen])
  useEffect(() => {
    if (!helpOpen || !helpAutoOpenRef.current) return
    try { localStorage.setItem(helpStorageKey, '1') } catch { /* storage unavailable */ }
    helpAutoOpenRef.current = false
  }, [helpOpen])
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (helpOpen) closeHelp()
      else if (resetOpen) closeReset()
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
  const navigateToPanel = (nextPanel: 'map' | 'notebook', selector: string) => {
    setPanel(nextPanel)
    const target = document.querySelector(selector)
    if (target instanceof HTMLElement && typeof target.scrollIntoView === 'function') {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
  const closeDialogue = () => {
    setCharacter(undefined)
    window.setTimeout(() => focusAfterDialogueRef.current?.focus(), 0)
  }
  const closeDetail = () => {
    setDetail(undefined)
    window.setTimeout(() => focusAfterDetailRef.current?.focus(), 0)
  }
  const closeReset = () => {
    setResetOpen(false)
    window.setTimeout(() => resetTriggerRef.current?.focus(), 0)
  }
  const closeHelp = () => {
    setHelpOpen(false)
    window.setTimeout(() => helpTriggerRef.current?.focus(), 0)
  }
  const openHelp = () => {
    helpAutoOpenRef.current = false
    setHelpOpen(true)
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
    closeReset()
  }
  const handleDeduction = () => {
    const deduction = runtime.matchingDeduction(state)
    if (!deduction) {
      setDeductionFeedback(getText(caseUiText.notEnoughEvidence, state.language))
      return
    }
    dispatch({ type: 'makeDeduction', deductionId: deduction.id })
    setDeductionFeedback(getText(caseUiText.deductionAdded, state.language))
  }
  const mobileLocations = caseData.locations.filter(({ id }) => state.openedLocationIds.includes(id))
  const languageLabel = state.language === 'en' ? 'RU' : 'EN'
  const detailDescription = useMemo(() => detail ? getText(detail.description, state.language) : '', [detail, state.language])
  const submitTheory = () => setTheoryResult(runtime.scoreTheory(state.theory))

  return <main className="game-shell">
    <header className="game-header">
      <div><p className="eyebrow">{getText(caseUiText.reasoningGame, state.language)}</p><h1 className="case-title">{getText(caseData.title, state.language)}</h1><p>{getText(caseData.introduction, state.language)}</p></div>
      <div className="header-actions">
        <button type="button" onClick={onHome}>{getText(caseUiText.home, state.language)}</button>
        <button className="language-toggle" type="button" onClick={changeLanguage} aria-label={getText(caseUiText.language, state.language)}>{languageLabel}</button>
        <button ref={mapTriggerRef} type="button" onClick={() => navigateToPanel('map', '.map-panel')}>{getText(caseUiText.map, state.language)}</button>
         <button ref={notebookTriggerRef} type="button" onClick={() => navigateToPanel('notebook', '.notebook-layout')}>{getText(caseUiText.notebook, state.language)}</button>
         <button ref={helpTriggerRef} type="button" onClick={openHelp}>{getText(caseUiText.help, state.language)}</button>
         <button ref={resetTriggerRef} type="button" onClick={() => setResetOpen(true)}>{getText(caseUiText.reset, state.language)}</button>
      </div>
    </header>
      <div className="game-layout">
         <SceneView location={location} state={state} hotspots={hotspots} characters={characters} totalClues={totalClues} foundClues={foundClues} renderScene={caseData.renderScene} onHotspot={handleHotspot} onCharacter={openCharacter} />
        <MapPanel locations={mobileLocations} hotspots={caseData.hotspots} discoveredHotspotIds={state.discoveredHotspotIds} language={state.language} currentLocationId={location.id} onSelectLocation={(locationId) => dispatch({ type: 'setLocation', locationId })} />
      </div>
      <div className="notebook-layout" data-mobile-order="3">
         <NotebookPanel evidence={evidence} deductions={caseData.deductions} completedIds={state.deductionIds} availableIds={availableDeductionIds} selectedIds={state.selectedEvidenceIds} language={state.language} onSelectEvidence={(id) => dispatch({ type: 'toggleEvidence', evidenceId: id })} onMakeDeduction={handleDeduction} feedback={deductionFeedback} />
      </div>
      <div className="theory-layout">
         <TheoryPanel theory={state.theory} fields={caseData.theoryFields} language={state.language} result={theoryResult} onChange={(theory) => { setTheoryResult(null); dispatch({ type: 'setTheory', theory }) }} onSubmit={submitTheory} />
      </div>
    {theoryResult === 'complete' && <ReconstructionView steps={caseData.reconstruction} currentStep={state.reconstructionStep} language={state.language} renderScene={caseData.renderReconstruction} onNext={() => dispatch({ type: 'setReconstructionStep', step: state.reconstructionStep + 1 })} onReplay={() => dispatch({ type: 'setReconstructionStep', step: 0 })} />}
     <nav className="mobile-section-nav" aria-label={getText(caseUiText.investigationNavigation, state.language)}>
      <a href="#scene-title">{getText(caseUiText.scene, state.language)}</a>
      <a href="#map-title">{getText(caseUiText.map, state.language)}</a>
      <a href="#notebook-title">{getText(caseUiText.notebook, state.language)}</a>
      <a href="#theory-title">{getText(caseUiText.theory, state.language)}</a>
     </nav>
     {helpOpen && <div className="overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeHelp() }}><FocusBoundary><section className="help-dialog" role="dialog" aria-modal="true" aria-labelledby="help-title"><button ref={helpCloseRef} className="close-button" type="button" onClick={closeHelp}>{getText(caseUiText.close, state.language)}</button><h2 id="help-title">{getText(caseUiText.helpTitle, state.language)}</h2><ol>{[1, 2, 3, 4, 5, 6].map((step) => <li key={step}>{getText(caseUiText[`helpStep${step}` as keyof typeof caseUiText], state.language)}</li>)}</ol></section></FocusBoundary></div>}
      {panel && <div className="mobile-panel-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closePanel() }}><FocusBoundary><section className="mobile-panel" role="dialog" aria-modal="true" aria-labelledby={panel === 'map' ? 'map-title-mobile' : 'notebook-title-mobile'}>{panel === 'map' ? <MapPanel locations={mobileLocations} hotspots={caseData.hotspots} discoveredHotspotIds={state.discoveredHotspotIds} language={state.language} currentLocationId={location.id} titleId="map-title-mobile" closeRef={panelCloseRef} onClose={closePanel} onSelectLocation={(locationId) => { dispatch({ type: 'setLocation', locationId }); closePanel() }} /> : <NotebookPanel evidence={evidence} deductions={caseData.deductions} completedIds={state.deductionIds} availableIds={availableDeductionIds} selectedIds={state.selectedEvidenceIds} language={state.language} titleId="notebook-title-mobile" closeRef={panelCloseRef} onClose={closePanel} onSelectEvidence={(id) => dispatch({ type: 'toggleEvidence', evidenceId: id })} onMakeDeduction={handleDeduction} feedback={deductionFeedback} />}</section></FocusBoundary></div>}
    <DialoguePanel character={character} questions={questions} askedQuestions={askedQuestions} statements={responses} contradiction={contradiction} contradictionEvidence={contradictionEvidence} language={state.language} closeRef={dialogueCloseRef} onAsk={(questionId) => dispatch({ type: 'askQuestion', questionId })} onContradiction={() => contradiction && dispatch({ type: 'presentContradiction', contradictionId: contradiction.id })} onClose={closeDialogue} />
    {detail && <div className="overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeDetail() }}><FocusBoundary><section className="evidence-dialog" role="dialog" aria-modal="true" aria-labelledby={`evidence-title-${detail.id}`} aria-describedby={`evidence-description-${detail.id}`}><button ref={detailCloseRef} className="close-button" type="button" onClick={closeDetail}>{getText(caseUiText.close, state.language)}</button><p className="eyebrow">{getText(caseUiText.evidence, state.language)}</p><h2 id={`evidence-title-${detail.id}`}>{getText(detail.title, state.language)}</h2><p id={`evidence-description-${detail.id}`}>{detailDescription}</p>{detail.falseLead && (detail.falseLeadEvidenceIds ?? []).every((id) => acquiredIds.includes(id)) && <p className="false-lead">{getText(detail.falseLead, state.language)}</p>}<button type="button" onClick={closeDetail}>{getText(caseUiText.notebook, state.language)}</button></section></FocusBoundary></div>}
    {resetOpen && <div className="overlay" role="presentation"><FocusBoundary><section className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="reset-title" aria-describedby="reset-description"><h2 id="reset-title">{getText(caseUiText.resetTitle, state.language)}</h2><p id="reset-description">{getText(caseUiText.resetPrompt, state.language)}</p><div className="dialog-actions"><button ref={resetCloseRef} type="button" onClick={closeReset}>{getText(caseUiText.cancel, state.language)}</button><button className="danger-button" type="button" onClick={resetGame}>{getText(caseUiText.confirmReset, state.language)}</button></div></section></FocusBoundary></div>}
  </main>
}
