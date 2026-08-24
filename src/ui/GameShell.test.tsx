import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import * as React from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { missingCakeCase } from '../case/missingCake'
import { gameReducer } from '../game/reducer'
import { acquiredEvidenceIds, canPresentContradiction } from '../game/rules'
import { freshGameState, type GameState } from '../game/state'
import { GameShell } from './GameShell'

function renderGame(state: GameState = freshGameState()) {
  function Harness() {
    const [gameState, dispatch] = React.useReducer(gameReducer, state)
    return <GameShell caseData={missingCakeCase} state={gameState} dispatch={dispatch} />
  }
  return render(<Harness />)
}

describe('GameShell', () => {
  afterEach(cleanup)
  it('renders current location and investigation controls', () => {
    renderGame()

    expect(screen.getByRole('heading', { name: 'Kitchen' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Notebook' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Map' })).toBeTruthy()
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
    expect(screen.getByRole('status').textContent).toMatch(/not enough evidence/i)
    expect(screen.getByRole('status').textContent).not.toMatch(/Rain timing/)

    fireEvent.click(screen.getByRole('button', { name: /Rain made the footprints/ }))
    fireEvent.click(screen.getAllByRole('button', { name: 'Make deduction' })[0])
    expect(screen.getByRole('status').textContent).toMatch(/deduction added/i)
    expect(screen.getByText('Rain timing and soft mud place the tracks after the shower.')).toBeTruthy()
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

  it('renders Russian labels after language switch', () => {
    renderGame()

    fireEvent.click(screen.getByRole('button', { name: 'Change language' }))
    expect(screen.getByRole('heading', { name: 'Кухня' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Блокнот' })).toBeTruthy()
  })
})
