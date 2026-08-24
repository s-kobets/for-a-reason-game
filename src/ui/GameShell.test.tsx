import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import * as React from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { missingCakeCase } from '../case/missingCake'
import { gameReducer } from '../game/reducer'
import { acquiredEvidenceIds, canPresentContradiction } from '../game/rules'
import { freshGameState, type GameState, type Theory } from '../game/state'
import type { GameAction } from '../game/reducer'
import { GameShell } from './GameShell'
import { SCENE_ASPECT_RATIO, SCENE_VIEWBOX, sceneHotspotBounds } from './SceneArtwork'
import { loadGame, saveGame } from '../game/storage'

function renderGame(state: GameState = freshGameState()) {
  function Harness() {
    const [gameState, dispatch] = React.useReducer(gameReducer, state)
    return <GameShell caseData={missingCakeCase} state={gameState} dispatch={dispatch} />
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
    return <GameShell caseData={missingCakeCase} state={state} dispatch={dispatch} />
  }
  render(<Harness />)
  return { actions, getState: () => currentState }
}

const completeTheory: Theory = { person: 'petya', origin: 'kitchen', entryMethod: 'window', event: 'moved-to-shed', motive: 'surprise' }

describe('GameShell', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => {
    cleanup()
    localStorage.clear()
  })
  it('renders current location and investigation controls', () => {
    renderGame()

    expect(screen.getByRole('heading', { name: 'Kitchen' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Notebook' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Map' })).toBeTruthy()
    expect(screen.getByText('0 / 13 clues found')).toBeTruthy()
  })

  it('shows evidence progress for every map location', () => {
    renderGame()

    expect(screen.getAllByText('0 / 5 clues').length).toBeGreaterThan(0)
    expect(screen.getAllByText('0 / 2 clues').length).toBeGreaterThan(0)
  })

  it('makes Inspect reveal hotspot guidance', () => {
    renderGame()

    expect(screen.getByRole('button', { name: 'Show inspection hints' })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Show inspection hints' }))
    expect(document.querySelector('.scene-artwork.inspect-mode')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Hide inspection hints' })).toBeTruthy()
  })

  it('discovers meaningful hotspots but keeps decorative hotspots atmospheric', () => {
    const dispatch = vi.fn()
    const state = { ...freshGameState(), locationId: 'garden' }
    render(<GameShell caseData={missingCakeCase} state={state} dispatch={dispatch} />)

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
    expect(screen.getByRole('status').textContent).toMatch(/select the required clues/i)
    expect(screen.getByRole('status').textContent).not.toMatch(/Rain timing/)

    fireEvent.click(screen.getByRole('button', { name: /Rain made the footprints/ }))
    fireEvent.click(screen.getAllByRole('button', { name: 'Make deduction' })[0])
    expect(screen.getByRole('status').textContent).toMatch(/deduction added/i)
    expect(screen.getByText('Rain timing and soft mud place the tracks after the shower.')).toBeTruthy()
  })

  it('explains that observations and statements are selected for deductions', () => {
    renderGame()

    expect(screen.getByText(/select observations and statements/i)).toBeTruthy()
    expect(screen.getAllByText(/needed clues/i).length).toBeGreaterThan(0)
  })

  it('places theory before the long notebook content', () => {
    renderGame()

    const theory = screen.getByRole('heading', { name: 'Your theory' })
    const notebook = screen.getByRole('heading', { name: 'Notebook' }).closest('section')!
    expect(theory.compareDocumentPosition(notebook) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('renders desktop investigation panels in Map, Scene, Theory, Notebook order', () => {
    renderGame()

    const map = screen.getByRole('heading', { name: 'Map' })
    const scene = screen.getByRole('heading', { name: 'Kitchen' })
    const theory = screen.getByRole('heading', { name: 'Your theory' })
    const notebook = screen.getByRole('heading', { name: 'Notebook' })

    expect(map.compareDocumentPosition(scene) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(scene.compareDocumentPosition(theory) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(theory.compareDocumentPosition(notebook) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('keeps Notebook outside upper grid and declares mobile panel order', () => {
    renderGame()

    const upperGrid = document.querySelector('.game-layout')!
    const notebookLayout = document.querySelector('.notebook-layout')!

    expect(upperGrid.children).toHaveLength(3)
    expect(upperGrid.querySelector('.map-panel')).toBe(upperGrid.children[0])
    expect(upperGrid.querySelector('.scene-card')).toBe(upperGrid.children[1])
    expect(upperGrid.querySelector('.theory-panel')).toBe(upperGrid.children[2])
    expect(notebookLayout.parentElement).toBe(document.querySelector('.game-shell'))
    expect(notebookLayout.previousElementSibling).toBe(upperGrid)
    expect([
      upperGrid.children[0].getAttribute('data-mobile-order'),
      upperGrid.children[1].getAttribute('data-mobile-order'),
      upperGrid.children[2].getAttribute('data-mobile-order'),
      notebookLayout.getAttribute('data-mobile-order'),
    ]).toEqual(['3', '1', '2', '4'])
  })

  it('keeps every case hotspot inside its visible scene prop bounds', () => {
    for (const hotspot of missingCakeCase.hotspots) {
      const bounds = sceneHotspotBounds[hotspot.id]
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

  it('does not report success when repeating a completed deduction', () => {
    const state = { ...freshGameState(), discoveredHotspotIds: ['muddy-footprints', 'wet-umbrella'] }
    renderGame(state)

    fireEvent.click(screen.getByRole('button', { name: /Small muddy prints/ }))
    fireEvent.click(screen.getByRole('button', { name: /Rain made the footprints/ }))
    fireEvent.click(screen.getAllByRole('button', { name: 'Make deduction' })[0])
    expect(screen.getByRole('status').textContent).toMatch(/deduction added/i)
    fireEvent.click(screen.getAllByRole('button', { name: 'Make deduction' })[0])
    expect(screen.getByRole('status').textContent).toMatch(/already made/i)
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

  it('renders Russian labels after language switch', () => {
    renderGame()

    fireEvent.click(screen.getByRole('button', { name: 'Change language' }))
    expect(screen.getByRole('heading', { name: 'Кухня' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Блокнот' })).toBeTruthy()
    expect(document.documentElement.lang).toBe('ru')
  })

  it('integrates theory scoring, retry, evidence preservation, and reconstruction actions', () => {
    const { actions, getState } = renderTheoryHarness({ ...freshGameState(), discoveredHotspotIds: ['cake-stand'] })
    expect(screen.getByText('The cake was lifted from its stand, not eaten there.')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Submit theory' }))
    expect(screen.getByRole('status').textContent).toMatch(/wrong/i)
    expect(screen.queryByRole('heading', { name: 'Reconstruction' })).toBeNull()

    fireEvent.change(screen.getByLabelText('Who'), { target: { value: completeTheory.person } })
    expect(screen.queryByRole('status')).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Submit theory' }))
    expect(screen.getByRole('status').textContent).toMatch(/part of your theory/i)
    expect(screen.queryByRole('heading', { name: 'Reconstruction' })).toBeNull()

    for (const [field, value] of Object.entries(completeTheory)) {
      const label = { person: 'Who', origin: 'Where did it start?', entryMethod: 'How did they enter?', event: 'What happened?', motive: 'Why?' }[field as keyof Theory]
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
    expect((screen.getByLabelText('Who') as HTMLSelectElement).value).toBe('petya')
    expect(screen.getByText(missingCakeCase.reconstruction[persistedStep].text.en)).toBeTruthy()
  })
})
