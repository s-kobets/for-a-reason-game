import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import * as React from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { missingCakeCase } from '../case/missingCake'
import { missingCakeHotspotBounds } from '../case/missingCakeArtwork'
import { caseUiText, getText } from '../case/translations'
import type { GameState, Theory } from '../game/state'
import type { GameAction } from '../game/reducer'
import { createGameRuntime } from '../game/runtime'
import { GameShell } from './GameShell'
import { SCENE_ASPECT_RATIO, SCENE_VIEWBOX } from './SceneArtwork'
import { readFileSync } from 'node:fs'

const globalCss = readFileSync('src/styles/global.css', 'utf8')
const runtime = createGameRuntime(missingCakeCase)
const { reducer: gameReducer, freshState: freshGameState, acquiredEvidenceIds, loadGame, saveGame } = runtime
const petya = missingCakeCase.characters.find(({ id }) => id === 'petya')!
const canPresentContradiction = (state: GameState) => runtime.availableContradictions(petya, state).length > 0

function renderGame(state: GameState = freshGameState()) {
  function Harness() {
    const [gameState, dispatch] = React.useReducer(gameReducer, state)
    return <GameShell caseData={missingCakeCase} runtime={runtime} state={gameState} dispatch={dispatch} onHome={vi.fn()} />
  }
  return render(<Harness />)
}

function renderTheoryHarness(initialState: GameState = freshGameState()) {
  const actions: GameAction[] = []
  let currentState = initialState
  function Harness() {
    const [state, setState] = React.useState(initialState)
    const dispatch = (action: GameAction) => {
      actions.push(action)
      currentState = gameReducer(currentState, action)
      setState(currentState)
    }
    return <GameShell caseData={missingCakeCase} runtime={runtime} state={state} dispatch={dispatch} onHome={vi.fn()} />
  }
  render(<Harness />)
  return { actions, getState: () => currentState }
}

const completeTheory: Theory = { person: 'petya', origin: 'garden', entryMethod: 'window', event: 'moved-to-shed', motive: 'surprise' }

describe('GameShell', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('reasoning-game:help-seen:v1', '1')
  })
  afterEach(() => {
    cleanup()
    localStorage.clear()
  })
  it('renders current location and investigation controls', () => {
    renderGame()

    expect(screen.getByRole('heading', { name: 'Kitchen' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Home' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Notebook' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Map' })).toBeTruthy()
    expect(screen.getByText('0 / 13 clues found')).toBeTruthy()
  })

  it('keeps localized Help copy available and removes the Saved label', () => {
    renderGame()

    expect(screen.queryByText('Saved')).toBeNull()
    expect(getText(caseUiText.help, 'en')).toBe('Help')
    expect(getText(caseUiText.helpTitle, 'en')).toBe('How to investigate')
    expect(getText(caseUiText.helpStep1, 'en')).toBe('Explore locations and inspect objects.')
  })

  it('opens Help automatically on first visit and reopens it from the header', async () => {
    localStorage.clear()
    renderGame()

    expect(screen.getByRole('dialog', { name: 'How to investigate' })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(screen.queryByRole('dialog', { name: 'How to investigate' })).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Help' }))
    expect(screen.getByRole('dialog', { name: 'How to investigate' })).toBeTruthy()
    expect(localStorage.getItem('reasoning-game:help-seen:v1')).toBe('1')
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Close' })))
  })

  it('opens Help and still renders gameplay when localStorage access fails', () => {
    const originalDescriptor = Object.getOwnPropertyDescriptor(window, 'localStorage')
    Object.defineProperty(window, 'localStorage', { configurable: true, get: () => { throw new Error('blocked') } })

    try {
      renderGame()

      expect(screen.getByRole('dialog', { name: 'How to investigate' })).toBeTruthy()
      expect(screen.getByRole('heading', { name: 'Kitchen' })).toBeTruthy()
      fireEvent.click(screen.getByRole('button', { name: 'Close' }))
      fireEvent.click(screen.getByRole('button', { name: 'Help' }))
      expect(screen.getByRole('dialog', { name: 'How to investigate' })).toBeTruthy()
      fireEvent.click(screen.getByRole('button', { name: 'Close' }))

      const inspectionToggle = screen.getByRole('button', { name: 'Show inspection hints' })
      fireEvent.click(inspectionToggle)
      expect(inspectionToggle.getAttribute('aria-pressed')).toBe('true')
    } finally {
      if (originalDescriptor) Object.defineProperty(window, 'localStorage', originalDescriptor)
    }
  })

  it('does not open Help automatically when first visit was stored', () => {
    localStorage.setItem('reasoning-game:help-seen:v1', '1')

    renderGame()

    expect(screen.queryByRole('dialog', { name: 'How to investigate' })).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Help' }))
    expect(screen.getByRole('dialog', { name: 'How to investigate' })).toBeTruthy()
  })

  it('closes Help with Escape and restores focus to its trigger', async () => {
    localStorage.setItem('reasoning-game:help-seen:v1', '1')
    renderGame()

    const helpTrigger = screen.getByRole('button', { name: 'Help' })
    fireEvent.click(helpTrigger)
    fireEvent.keyDown(document, { key: 'Escape' })

    await waitFor(() => expect(document.activeElement).toBe(helpTrigger))
    expect(screen.queryByRole('dialog', { name: 'How to investigate' })).toBeNull()
  })

  it('localizes Help dialog and contains focus within it', () => {
    localStorage.setItem('reasoning-game:help-seen:v1', '1')
    renderGame()

    fireEvent.click(screen.getByRole('button', { name: 'Help' }))
    fireEvent.click(screen.getByRole('button', { name: 'Change language' }))

    const dialog = screen.getByRole('dialog', { name: 'Как расследовать дело' })
    expect(dialog).toBeTruthy()
    expect(screen.getByText('Исследуйте локации и осматривайте предметы.')).toBeTruthy()
    const buttons = dialog.querySelectorAll('button')
    buttons[buttons.length - 1].focus()
    fireEvent.keyDown(buttons[buttons.length - 1], { key: 'Tab' })
    expect(document.activeElement).toBe(buttons[0])
  })

  it('shows evidence progress for every map location', () => {
    renderGame()

    expect(screen.getAllByText('0 / 5 clues').length).toBeGreaterThan(0)
    expect(screen.getAllByText('0 / 2 clues').length).toBeGreaterThan(0)
  })

  it('makes Inspect reveal hotspot guidance', () => {
    renderGame()

    const toggle = screen.getByRole('button', { name: 'Show inspection hints' })
    expect(toggle.getAttribute('aria-pressed')).toBe('false')
    fireEvent.click(toggle)
    expect(document.querySelector('.scene-artwork.inspect-mode')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Hide inspection hints' }).getAttribute('aria-pressed')).toBe('true')
  })

  it('discovers meaningful hotspots but keeps decorative hotspots atmospheric', () => {
    const dispatch = vi.fn()
    const state = { ...freshGameState(), locationId: 'garden' }
    render(<GameShell caseData={missingCakeCase} runtime={runtime} state={state} dispatch={dispatch} onHome={vi.fn()} />)

    expect(document.getElementById('hotspot-garden-lantern')?.dataset.hotspotId).toBe('garden-lantern')
    fireEvent.click(screen.getByRole('button', { name: /Garden lantern/ }))
    expect(dispatch).not.toHaveBeenCalledWith({ type: 'discoverHotspot', hotspotId: 'garden-lantern' })
    expect(screen.getByRole('dialog', { name: 'Garden lantern' })).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: /Close/ }))
    fireEvent.click(screen.getByRole('button', { name: /Garden path/ }))
    expect(dispatch).toHaveBeenCalledWith({ type: 'discoverHotspot', hotspotId: 'garden-path' })
  })

  it('selects evidence and gives non-revealing invalid feedback before valid deduction feedback', () => {
    const state = { ...freshGameState(), discoveredHotspotIds: ['muddy-footprints', 'wet-umbrella'] }
    renderGame(state)

    fireEvent.click(screen.getByRole('button', { name: /Small muddy prints/ }))
    fireEvent.click(screen.getAllByRole('button', { name: 'Make deduction' })[0])
    expect(screen.getByRole('status').textContent).toMatch(/not enough evidence/i)
    expect(screen.getByRole('status').textContent).not.toMatch(/Rain timing/)

    fireEvent.click(screen.getByRole('button', { name: /Rain made the footprints/ }))
    fireEvent.click(screen.getAllByRole('button', { name: 'Make deduction' })[0])
    expect(screen.getByRole('status').textContent).toMatch(/deduction added/i)
    expect(screen.getByText('Rain timing and soft mud place the tracks after the shower.')).toBeTruthy()
  })

  it('explains that observations and statements are selected for deductions', () => {
    renderGame()

    expect(screen.getByText(/select observations and statements/i)).toBeTruthy()
    expect(screen.queryByText('Petya handled the cake')).toBeNull()
    expect(screen.getAllByRole('button', { name: 'Make deduction' })).toHaveLength(1)
  })

  it('places notebook before the long theory content', () => {
    renderGame()

    const theory = screen.getByRole('heading', { name: 'Your theory' })
    const notebook = screen.getByRole('heading', { name: 'Notebook' }).closest('section')!
    expect(notebook.compareDocumentPosition(theory) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('renders desktop investigation panels in Scene, Map, Notebook, Theory order', () => {
    renderGame()

    const map = screen.getByRole('heading', { name: 'Map' })
    const scene = screen.getByRole('heading', { name: 'Kitchen' })
    const theory = screen.getByRole('heading', { name: 'Your theory' })
    const notebook = screen.getByRole('heading', { name: 'Notebook' })

    expect(scene.compareDocumentPosition(map) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(map.compareDocumentPosition(notebook) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(notebook.compareDocumentPosition(theory) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('keeps only Scene and Map in upper grid', () => {
    renderGame()

    const upperGrid = document.querySelector('.game-layout')!
    const notebookLayout = document.querySelector('.notebook-layout')!
    const theoryLayout = document.querySelector('.theory-layout')!

    expect(upperGrid.children).toHaveLength(2)
    expect(upperGrid.querySelector('.scene-card')).toBe(upperGrid.children[0])
    expect(upperGrid.querySelector('.map-panel')).toBe(upperGrid.children[1])
    expect(notebookLayout.parentElement).toBe(document.querySelector('.game-shell'))
    expect(notebookLayout.previousElementSibling).toBe(upperGrid)
    expect(theoryLayout.previousElementSibling).toBe(notebookLayout)
  })

  it('orders mobile panels as Scene, Map, Notebook, Theory', () => {
    renderGame()

    expect([
      document.querySelector('.scene-card')?.getAttribute('data-mobile-order'),
      document.querySelector('.map-panel')?.getAttribute('data-mobile-order'),
      document.querySelector('.notebook-layout')?.getAttribute('data-mobile-order'),
      document.querySelector('.theory-panel')?.getAttribute('data-mobile-order'),
    ]).toEqual(['1', '2', '3', '4'])
  })

  it('orders completed reconstruction after Theory on mobile', () => {
    renderGame({ ...freshGameState(), theory: completeTheory })

    expect(screen.getByRole('heading', { name: 'Reconstruction' })).toBeTruthy()
    expect(globalCss).toMatch(/@media \(max-width: 900px\)[^{]*\{[^]*?\.reconstruction-panel\s*\{[^}]*order:\s*5;/)
  })

  it('renders mobile navigation links to every investigation section', () => {
    renderGame()

    const navigation = screen.getByRole('navigation', { name: 'Investigation navigation' })
    expect([...navigation.querySelectorAll('a')].map((link) => [link.textContent, link.getAttribute('href')])).toEqual([
      ['Scene', '#scene-title'],
      ['Map', '#map-title'],
      ['Notebook', '#notebook-title'],
      ['Your theory', '#theory-title'],
    ])
    for (const id of ['scene-title', 'map-title', 'notebook-title', 'theory-title']) {
      expect(document.getElementById(id)).toBeTruthy()
    }
    expect(globalCss).toMatch(/\.mobile-section-nav\s*\{[^}]*display:\s*none;/)
    expect(globalCss).toMatch(/@media \(max-width: 900px\)[^{]*\{[^]*?\.mobile-section-nav\s*\{[^}]*position:\s*fixed;[^}]*bottom:\s*0;/)
    expect(globalCss).toMatch(/@media \(max-width: 900px\)[^{]*\{[^]*?\.game-shell\s*\{[^}]*env\(safe-area-inset-bottom\)/)
    expect(globalCss).toMatch(/\.mobile-section-nav a:focus-visible\s*\{[^}]*outline:\s*3px solid #694739;/)
  })

  it('renders Notebook content columns in observations, statements, deductions order', () => {
    renderGame()

    const notebook = document.querySelector('.notebook-panel')!
    expect([...notebook.querySelectorAll('.notebook-column')].map((column) => column.className)).toEqual([
      'notebook-column observations-column',
      'notebook-column statements-column',
      'notebook-column deductions-column',
    ])
    expect(globalCss).toMatch(/\.notebook-content\s*\{[^}]*grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\);/)
    expect(globalCss).toMatch(/\.notebook-column\s*\{[^}]*min-width:\s*0;/)
    expect(globalCss).toContain('.notebook-content { grid-template-columns: 1fr; }')
  })

  it('declares desktop theory width and mobile field layout contracts', () => {
    expect(globalCss).toMatch(/\.theory-layout \.theory-fields\s*\{[^}]*grid-template-columns:\s*1fr;/)
    expect(globalCss).toMatch(/@media \(max-width: 900px\)[^{]*\{[^]*?\.theory-layout \.theory-fields\s*\{[^}]*grid-template-columns:\s*repeat\(2, 1fr\);/)
    expect(globalCss).toMatch(/@media \(max-width: 480px\)[^{]*\{[^]*?\.theory-layout \.theory-fields\s*\{[^}]*grid-template-columns:\s*1fr;/)
  })

  it('keeps hotspot labels readable over scene artwork', () => {
    expect(globalCss).toMatch(/\.hotspot-button\s*\{(?=[^}]*font-size:\s*\.9rem;)(?=[^}]*padding:\s*\.45rem \.6rem;)(?=[^}]*color:\s*#30271f;)(?=[^}]*background:\s*#fffaf3;)[^}]*\}/)
    expect(globalCss).toMatch(/@media \(max-width: 600px\)[^{]*\{[^]*?\.hotspot-button\s*\{[^}]*font-size:\s*\.65rem;/)
  })

  it('keeps modal widths stable on desktop and fluid on narrow screens', () => {
    expect(globalCss).toMatch(/\.dialogue-panel, \.evidence-dialog\s*\{[^}]*width:\s*34rem;[^}]*min-width:\s*34rem;/)
    expect(globalCss).toMatch(/\.confirm-dialog\s*\{[^}]*width:\s*28rem;[^}]*min-width:\s*28rem;/)
    expect(globalCss).toMatch(/\.help-dialog\s*\{[^}]*position:\s*relative;/)
    expect(globalCss).toContain('@media (max-width: 600px)')
    expect(globalCss).toContain('.dialogue-panel, .evidence-dialog, .confirm-dialog { width: 100%; min-width: 0; max-width: 100%; }')
  })

  it('scrolls to Map and Notebook when desktop navigation is clicked', () => {
    renderGame()

    const map = document.querySelector('.map-panel')!
    const notebook = document.querySelector('.notebook-layout')!
    const mapScroll = vi.fn()
    const notebookScroll = vi.fn()
    Object.defineProperty(map, 'scrollIntoView', { value: mapScroll })
    Object.defineProperty(notebook, 'scrollIntoView', { value: notebookScroll })

    fireEvent.click(screen.getByRole('button', { name: 'Map' }))
    fireEvent.click(screen.getByRole('button', { name: 'Notebook' }))

    expect(mapScroll).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' })
    expect(notebookScroll).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' })
    expect(globalCss).toMatch(/\.map-panel\s*\{[^}]*position:\s*sticky;[^}]*top:\s*1rem;/)
  })

  it('keeps every case hotspot inside its visible scene prop bounds', () => {
    for (const hotspot of missingCakeCase.hotspots) {
      const bounds = missingCakeHotspotBounds[hotspot.id]
      expect(bounds, hotspot.id).toBeTruthy()
      expect(hotspot.placement.x).toBeGreaterThanOrEqual(bounds.x[0])
      expect(hotspot.placement.x).toBeLessThanOrEqual(bounds.x[1])
      expect(hotspot.placement.y).toBeGreaterThanOrEqual(bounds.y[0])
      expect(hotspot.placement.y).toBeLessThanOrEqual(bounds.y[1])
    }
  })

  it('keeps scene artwork and character coordinates in one responsive aspect-ratio system', () => {
    renderGame()

    const stage = document.querySelector('.scene-stage') as HTMLElement
    const artwork = stage.querySelector('svg')!
    const character = document.getElementById('character-petya')!

    expect(artwork.getAttribute('viewBox')).toBe(SCENE_VIEWBOX)
    expect(SCENE_ASPECT_RATIO).toBeCloseTo(1000 / 620)
    expect(Number.parseFloat(stage.style.aspectRatio)).toBeCloseTo(SCENE_ASPECT_RATIO)
    expect(character.style.left).toBe('86%')
    expect(Number.parseFloat(character.style.top)).toBeCloseTo(58)
  })

  it('does not report success after a completed deduction clears selection', () => {
    const state = { ...freshGameState(), discoveredHotspotIds: ['muddy-footprints', 'wet-umbrella'] }
    renderGame(state)

    fireEvent.click(screen.getByRole('button', { name: /Small muddy prints/ }))
    fireEvent.click(screen.getByRole('button', { name: /Rain made the footprints/ }))
    fireEvent.click(screen.getAllByRole('button', { name: 'Make deduction' })[0])
    expect(screen.getByRole('status').textContent).toMatch(/deduction added/i)
    fireEvent.click(screen.getAllByRole('button', { name: 'Make deduction' })[0])
    expect(screen.getByRole('status').textContent).toMatch(/not enough evidence/i)
    expect(screen.getByRole('status').textContent).not.toMatch(/^Deduction added\.$/)
  })

  it('shows statement responses and contradiction evidence before presenting it', async () => {
    const state = { ...freshGameState(), locationId: 'kitchen', discoveredHotspotIds: ['muddy-footprints', 'scarf-thread', 'garden-path'] }
    const afterQuestion = gameReducer(state, { type: 'askQuestion', questionId: 'ask-petya-garden' })
    expect(afterQuestion.receivedStatementIds).toContain('petya-denies-garden')
    expect(acquiredEvidenceIds(afterQuestion)).toEqual(expect.arrayContaining(['footprints-outward', 'scarf-thread']))
    expect(canPresentContradiction(afterQuestion)).toBe(true)
    renderGame(state)

    const characterTrigger = document.getElementById('character-petya')!
    characterTrigger.focus()
    fireEvent.click(characterTrigger)
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Close' })))
    fireEvent.click(screen.getByRole('button', { name: /Were you in the garden/ }))
    expect(screen.getByRole('status').textContent).toMatch(/never went into the garden/i)

    expect(screen.getByText(/Show Petya the footprint chain/)).toBeTruthy()
    expect(screen.getAllByText(/matching prints continue/).length).toBeGreaterThan(1)
    fireEvent.click(screen.getByRole('button', { name: /Present contradiction/ }))
    expect(screen.getByRole('status').textContent).toMatch(/entering through the kitchen window/i)
    fireEvent.keyDown(document, { key: 'Escape' })
    await waitFor(() => expect(document.activeElement).toBe(characterTrigger))
  })

  it('closes mobile notebook with close button and Escape, and uses unique dialog IDs', async () => {
    renderGame()

    const notebookTrigger = screen.getByRole('button', { name: 'Notebook' })
    fireEvent.click(notebookTrigger)
    expect(screen.getByRole('dialog', { name: 'Notebook' })).toBeTruthy()
    expect(document.getElementById('notebook-title-mobile')).toBeTruthy()
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Close notebook' })))
    fireEvent.keyDown(document, { key: 'Escape' })
    await waitFor(() => expect(document.activeElement).toBe(notebookTrigger))
    expect(screen.queryByRole('dialog', { name: 'Notebook' })).toBeNull()
  })

  it('closes mobile map through its close button and backdrop', () => {
    renderGame()

    fireEvent.click(screen.getByRole('button', { name: 'Map' }))
    expect(screen.getByRole('dialog', { name: 'Map' })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Close map' }))
    expect(screen.queryByRole('dialog', { name: 'Map' })).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'Map' }))
    fireEvent.mouseDown(screen.getByRole('presentation'))
    expect(screen.queryByRole('dialog', { name: 'Map' })).toBeNull()
  })

  it('restores focus to reset trigger after Cancel and Escape', async () => {
    renderGame()
    const resetTrigger = screen.getByRole('button', { name: 'Reset case' })

    fireEvent.click(resetTrigger)
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Cancel' })))
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    await waitFor(() => expect(document.activeElement).toBe(resetTrigger))

    fireEvent.click(resetTrigger)
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Cancel' })))
    fireEvent.keyDown(document, { key: 'Escape' })
    await waitFor(() => expect(document.activeElement).toBe(resetTrigger))
  })

  it('wraps Tab within mobile, detail, and dialogue dialogs', async () => {
    renderGame()

    fireEvent.click(screen.getByRole('button', { name: 'Notebook' }))
    const notebookDialog = screen.getByRole('dialog', { name: 'Notebook' })
    const notebookButtons = notebookDialog.querySelectorAll('button')
    notebookButtons[notebookButtons.length - 1].focus()
    fireEvent.keyDown(notebookButtons[notebookButtons.length - 1], { key: 'Tab' })
    expect(document.activeElement).toBe(notebookButtons[0])
    fireEvent.keyDown(notebookButtons[0], { key: 'Tab', shiftKey: true })
    expect(document.activeElement).toBe(notebookButtons[notebookButtons.length - 1])
    fireEvent.keyDown(document, { key: 'Escape' })

    const hotspot = screen.getByRole('button', { name: /Empty cake stand/ })
    fireEvent.click(hotspot)
    const detailDialog = screen.getByRole('dialog', { name: 'Empty cake stand' })
    const detailButtons = detailDialog.querySelectorAll('button')
    detailButtons[detailButtons.length - 1].focus()
    fireEvent.keyDown(detailButtons[detailButtons.length - 1], { key: 'Tab' })
    expect(document.activeElement).toBe(detailButtons[0])
    fireEvent.keyDown(document, { key: 'Escape' })

    const character = document.getElementById('character-petya')!
    fireEvent.click(character)
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Close' })))
    const dialogueDialog = screen.getByRole('dialog', { name: 'Petya' })
    const dialogueButtons = dialogueDialog.querySelectorAll('button')
    dialogueButtons[dialogueButtons.length - 1].focus()
    fireEvent.keyDown(dialogueButtons[dialogueButtons.length - 1], { key: 'Tab' })
    expect(document.activeElement).toBe(dialogueButtons[0])
  })

  it('renders one Russian question-list label after language switch', async () => {
    renderGame()

    fireEvent.click(screen.getByRole('button', { name: 'Change language' }))
    expect(screen.getByRole('heading', { name: 'Кухня' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Блокнот' })).toBeTruthy()
    expect(document.documentElement.lang).toBe('ru')

    fireEvent.click(screen.getByRole('button', { name: /Петя/ }))
    await waitFor(() => expect(screen.getAllByText('Спросить')).toHaveLength(1))
    expect(screen.getByRole('heading', { name: 'Спросить', level: 3 })).toBeTruthy()
  })

  it('integrates theory scoring, retry, evidence preservation, and reconstruction actions', () => {
    const { actions, getState } = renderTheoryHarness({ ...freshGameState(), discoveredHotspotIds: ['cake-stand'] })
    expect(screen.getByText('The cake was lifted from its stand, not eaten there.')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Submit theory' }))
    expect(screen.getByRole('status').textContent).toMatch(/wrong/i)
    expect(screen.queryByRole('heading', { name: 'Reconstruction' })).toBeNull()

    fireEvent.change(screen.getByLabelText('Who?'), { target: { value: completeTheory.person } })
    expect(screen.queryByRole('status')).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Submit theory' }))
    expect(screen.getByRole('status').textContent).toMatch(/part of your theory/i)
    expect(screen.queryByRole('heading', { name: 'Reconstruction' })).toBeNull()

    for (const [field, value] of Object.entries(completeTheory)) {
      const label = missingCakeCase.theoryFields.find(({ id }) => id === field)!.prompt.en
      fireEvent.change(screen.getByLabelText(label), { target: { value } })
    }
    fireEvent.click(screen.getByRole('button', { name: 'Submit theory' }))
    expect(screen.getByText('Case understood. Here is what happened.')).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Reconstruction' })).toBeTruthy()
    expect(actions).toContainEqual({ type: 'setTheory', theory: completeTheory })
    expect(getState().theory).toEqual(completeTheory)
    expect(screen.getByText('The cake was lifted from its stand, not eaten there.')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(actions).toContainEqual({ type: 'setReconstructionStep', step: 1 })
    expect(getState().reconstructionStep).toBe(1)
    for (let step = 2; step < missingCakeCase.reconstruction.length; step += 1) fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(screen.getByText('Case understood', { exact: true })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Replay' }))
    expect(actions).toContainEqual({ type: 'setReconstructionStep', step: 0 })
    expect(getState().reconstructionStep).toBe(0)
  })

  it('opens reconstruction at persisted reconstruction step for completed theory', () => {
    const persistedStep = missingCakeCase.reconstruction.length - 2
    renderTheoryHarness({ ...freshGameState(), theory: completeTheory, reconstructionStep: persistedStep })

    expect(screen.getByText(missingCakeCase.reconstruction[persistedStep].text.en)).toBeTruthy()
  })

  it('round-trips theory and reconstruction progress through storage boundary', () => {
    const persistedStep = missingCakeCase.reconstruction.length - 2
    const { getState } = renderTheoryHarness({ ...freshGameState(), theory: completeTheory, reconstructionStep: persistedStep })
    saveGame(getState())

    const loadedState = loadGame()
    expect(loadedState.theory).toEqual(completeTheory)
    expect(loadedState.reconstructionStep).toBe(persistedStep)

    cleanup()
    renderGame(loadedState)
    expect((screen.getByLabelText('Who?') as HTMLSelectElement).value).toBe('petya')
    expect(screen.getByText(missingCakeCase.reconstruction[persistedStep].text.en)).toBeTruthy()
  })
})
