import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import { missingCakeCase } from '../case/missingCake'
import { formatRequiredClues } from '../case/translations'
import { createGameRuntime } from '../game/runtime'
import { MapPanel } from './MapPanel'
import { NotebookPanel } from './NotebookPanel'
import { SceneView } from './SceneView'
import { TheoryPanel } from './TheoryPanel'
import { GameShell } from './GameShell'
import { SceneArtwork } from './SceneArtwork'

const runtime = createGameRuntime(missingCakeCase)
afterEach(cleanup)

it('shows unresolved deductions as mystery cards without spoilers', () => {
  const { container } = render(<NotebookPanel evidence={[]} deductions={missingCakeCase.deductions} selectedIds={[]} completedIds={[]} language="en" onSelectEvidence={vi.fn()} onMakeDeduction={vi.fn()} />)
  expect(container.querySelectorAll('.deduction-item.locked')).toHaveLength(missingCakeCase.deductions.length)
  missingCakeCase.deductions.forEach((deduction) => {
    expect(screen.getByText(deduction.prompt.en)).toBeInTheDocument()
    expect(screen.queryByText(deduction.title.en)).not.toBeInTheDocument()
    expect(screen.queryByText(deduction.text.en)).not.toBeInTheDocument()
  })
})

it('shows the clue requirement on mystery cards in both languages', () => {
  const deduction = missingCakeCase.deductions[0]
  const { rerender } = render(<NotebookPanel evidence={[]} deductions={[deduction]} selectedIds={[]} completedIds={[]} language="en" onSelectEvidence={vi.fn()} onMakeDeduction={vi.fn()} />)
  expect(screen.getByText(`Connect ${deduction.requiresEvidenceIds.length} clues`)).toBeInTheDocument()
  rerender(<NotebookPanel evidence={[]} deductions={[deduction]} selectedIds={[]} completedIds={[]} language="ru" onSelectEvidence={vi.fn()} onMakeDeduction={vi.fn()} />)
  expect(screen.getByText(deduction.prompt.ru)).toBeInTheDocument()
  expect(screen.getByText(`Соедините ${deduction.requiresEvidenceIds.length} улики`)).toBeInTheDocument()
})

it('reveals a completed deduction in its original case-defined position', () => {
  const deduction = missingCakeCase.deductions[1]
  const { container } = render(<NotebookPanel evidence={[]} deductions={missingCakeCase.deductions} selectedIds={[]} completedIds={[deduction.id]} language="en" onSelectEvidence={vi.fn()} onMakeDeduction={vi.fn()} />)
  expect([...container.querySelectorAll('[data-deduction-id]')].map((card) => card.getAttribute('data-deduction-id'))).toEqual(missingCakeCase.deductions.map(({ id }) => id))
  expect(screen.queryByText(deduction.prompt.en)).not.toBeInTheDocument()
  expect(screen.getByText(deduction.title.en)).toBeInTheDocument()
  expect(screen.getByText(deduction.text.en)).toBeInTheDocument()
  missingCakeCase.deductions.filter(({ id }) => id !== deduction.id).forEach((unresolved) => {
    expect(screen.queryByText(unresolved.title.en)).not.toBeInTheDocument()
    expect(screen.queryByText(unresolved.text.en)).not.toBeInTheDocument()
  })
  const list = screen.getByRole('list', { name: 'Deductions' })
  expect(within(list).getAllByRole('listitem')).toHaveLength(missingCakeCase.deductions.length)
})

it('formats singular mystery clue requirements', () => {
  expect(formatRequiredClues(1, 'en')).toBe('Connect 1 clue')
  expect(formatRequiredClues(1, 'ru')).toBe('Соедините 1 улику')
})

it('shows deduction feedback beside the deduction button', () => {
  const { container } = render(<NotebookPanel evidence={[]} deductions={missingCakeCase.deductions} selectedIds={[]} completedIds={[]} language="en" feedback="Not enough evidence" onSelectEvidence={vi.fn()} onMakeDeduction={vi.fn()} />)
  const column = container.querySelector('.deductions-column')!
  const button = within(column as HTMLElement).getByRole('button', { name: 'Make deduction' })
  const status = within(column as HTMLElement).getByRole('status')
  expect(status).toHaveTextContent('Not enough evidence')
  expect(button.nextElementSibling).toBe(status)
})

it('marks deductions whose required clues are selected as available', () => {
  const deduction = missingCakeCase.deductions[0]
  const { container } = render(<NotebookPanel evidence={[]} deductions={missingCakeCase.deductions} selectedIds={deduction.requiresEvidenceIds} completedIds={[]} availableIds={[deduction.id]} language="en" onSelectEvidence={vi.fn()} onMakeDeduction={vi.fn()} />)

  expect(container.querySelector(`[data-deduction-id="${deduction.id}"]`)).toHaveClass('available')
})

it('invokes the single shared deduction action once', () => {
  const onMakeDeduction = vi.fn()
  render(<NotebookPanel evidence={[]} deductions={missingCakeCase.deductions} selectedIds={[]} completedIds={[]} language="en" onSelectEvidence={vi.fn()} onMakeDeduction={onMakeDeduction} />)
  const buttons = screen.getAllByRole('button', { name: 'Make deduction' })
  expect(buttons).toHaveLength(1)
  expect(buttons[0]).toHaveClass('make-deduction-button')
  fireEvent.click(buttons[0])
  expect(onMakeDeduction).toHaveBeenCalledOnce()
})

it('marks the current map location', () => {
  render(<MapPanel locations={missingCakeCase.locations.slice(0, 1)} hotspots={missingCakeCase.hotspots} discoveredHotspotIds={[]} language="en" currentLocationId="kitchen" onSelectLocation={vi.fn()} />)
  expect(screen.getByRole('button', { name: /Kitchen/ })).toHaveAttribute('aria-current', 'location')
})

it('formats a singular English clue count', () => {
  const hotspot = missingCakeCase.hotspots.find(({ id }) => id === 'cake-stand')!
  render(<MapPanel locations={missingCakeCase.locations.slice(0, 1)} hotspots={[hotspot]} discoveredHotspotIds={[hotspot.id]} language="en" currentLocationId="kitchen" onSelectLocation={vi.fn()} />)
  expect(screen.getByText('1 / 1 clue')).toBeInTheDocument()
})

it('uses the selected language for character initials', () => {
  const state = { ...runtime.freshState(), language: 'ru' as const }
  const location = missingCakeCase.locations.find(({ id }) => id === 'living-room')!
  const character = missingCakeCase.characters.find(({ id }) => id === 'anya')!
  render(<SceneView location={location} state={state} hotspots={[]} characters={[character]} totalClues={0} foundClues={0} renderScene={missingCakeCase.renderScene} onHotspot={vi.fn()} onCharacter={vi.fn()} />)
  expect(screen.getByText('А')).toBeInTheDocument()
})

it('renders theory fields supplied by the case', () => {
  const field = { id: 'culprit', prompt: { en: 'Who did it?', ru: 'Кто это сделал?' }, value: 'nobody', options: [{ id: 'nobody', label: { en: 'Nobody', ru: 'Никто' } }], evidenceIds: [] }
  render(<TheoryPanel theory={{ culprit: '' }} fields={[field]} language="en" result={null} onChange={vi.fn()} onSubmit={vi.fn()} />)
  expect(screen.getByRole('combobox', { name: 'Who did it?' })).toBeInTheDocument()
})

it('renders the localized case introduction', () => {
  render(<GameShell caseData={missingCakeCase} runtime={runtime} state={runtime.freshState()} dispatch={vi.fn()} onHome={vi.fn()} />)
  expect(screen.getByText(missingCakeCase.introduction.en)).toBeInTheDocument()
})

it('renders scene artwork supplied by the case', () => {
  const { container } = render(<SceneArtwork sceneId="other" sceneTitle={{ en: 'Other', ru: 'Другое' }} sceneContent={<g data-other-scene="true" />} hotspots={[]} language="en" discoveredHotspotIds={[]} onHotspot={vi.fn()} />)
  expect(container.querySelector('[data-other-scene="true"]')).toBeInTheDocument()
})
