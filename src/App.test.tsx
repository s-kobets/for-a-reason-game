import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { missingCakeCase } from './case/missingCake'
import { midnightGreenhouseCase } from './case/midnightGreenhouse'
import { vanishingViolinCase } from './case/vanishingViolin'
import { createGameRuntime } from './game/runtime'

const cakeRuntime = createGameRuntime(missingCakeCase)
const greenhouseRuntime = createGameRuntime(midnightGreenhouseCase)
const violinRuntime = createGameRuntime(vanishingViolinCase)

describe('App landing flow', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('reasoning-game:help-seen:v1', '1')
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })))
  })
  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    document.documentElement.removeAttribute('data-theme')
  })

  it('opens the game and returns home with resume available', async () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Play The Missing Cake' }))
    expect(screen.getByRole('heading', { name: 'Kitchen' })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Home' }))
    expect(screen.getByRole('button', { name: 'Resume The Missing Cake' })).toBeTruthy()
    await waitFor(() => expect(cakeRuntime.hasSavedGame()).toBe(true))
  })

  it('loads saved language and labels the case as resumable', () => {
    cakeRuntime.saveGame({ ...cakeRuntime.freshState(), language: 'ru', discoveredHotspotIds: ['cake-stand'] })
    render(<App />)
    expect(screen.getByRole('button', { name: 'Продолжить «Исчезнувший торт»' })).toBeTruthy()
  })

  it('opens and resumes each case through its own runtime', async () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Play The Midnight Greenhouse' }))
    expect(screen.getByRole('heading', { name: 'The Midnight Greenhouse' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Glasshouse' })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Home' }))

    await waitFor(() => expect(greenhouseRuntime.hasSavedGame()).toBe(true))
    expect(screen.getByRole('button', { name: 'Resume The Midnight Greenhouse' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Play The Missing Cake' })).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Play The Missing Cake' }))
    expect(screen.getByRole('heading', { name: 'Kitchen' })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Home' }))
    await waitFor(() => expect(cakeRuntime.hasSavedGame()).toBe(true))
    expect(screen.getByRole('button', { name: 'Resume The Midnight Greenhouse' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Resume The Missing Cake' })).toBeTruthy()
  })

  it('opens the third case with its own save and localized card labels', async () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Play The Vanishing Violin' }))
    expect(screen.getByRole('heading', { name: 'The Vanishing Violin' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Music Room' })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Home' }))
    await waitFor(() => expect(violinRuntime.hasSavedGame()).toBe(true))
    expect(screen.getByRole('button', { name: 'Resume The Vanishing Violin' })).toBeTruthy()
  })

  it('uses system theme without saving it, then remembers a manual override', () => {
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })))
    const { unmount } = render(<App />)
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(localStorage.getItem('reasoning-game:theme')).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Turn on light theme' }))
    expect(document.documentElement.dataset.theme).toBe('light')
    expect(localStorage.getItem('reasoning-game:theme')).toBe('light')
    unmount()
    render(<App />)
    expect(document.documentElement.dataset.theme).toBe('light')
  })

  it('renders landing when storage is unavailable', () => {
    const original = Object.getOwnPropertyDescriptor(window, 'localStorage')
    Object.defineProperty(window, 'localStorage', { configurable: true, get: () => { throw new Error('blocked') } })
    try {
      render(<App />)
      expect(screen.getByRole('link', { name: 'Start investigating' })).toBeTruthy()
    } finally {
      if (original) Object.defineProperty(window, 'localStorage', original)
    }
  })

  it('returns home to Start when saving fails', async () => {
    render(<App />)
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked') })

    fireEvent.click(screen.getByRole('button', { name: 'Play The Missing Cake' }))
    fireEvent.click(screen.getByRole('button', { name: 'Home' }))

    await waitFor(() => expect(screen.getByRole('button', { name: 'Play The Missing Cake' })).toBeTruthy())
  })
})
