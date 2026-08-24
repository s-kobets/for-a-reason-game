import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { missingCakeCase } from '../case/missingCake'
import { freshGameState } from '../game/state'
import { TheoryPanel } from './TheoryPanel'

describe('TheoryPanel', () => {
  afterEach(cleanup)
  it('renders and updates all five translated theory fields', () => {
    const onChange = vi.fn()
    const theory = { person: 'anya', origin: 'garden', entryMethod: 'back-door', event: 'ate-it', motive: 'prank' }
    render(<TheoryPanel theory={theory} solution={missingCakeCase.solution} language="en" result={null} onChange={onChange} onSubmit={vi.fn()} />)

    for (const [field, label] of [['person', 'Who'], ['origin', 'Where did it start?'], ['entryMethod', 'How did they enter?'], ['event', 'What happened?'], ['motive', 'Why?']] as const) {
      expect(screen.getByLabelText(label)).toBeTruthy()
      expect(screen.getByLabelText(label).querySelectorAll('option')).toHaveLength(missingCakeCase.solution[field].options.length + 1)
    }

    for (const [field, label, value] of [['person', 'Who', 'petya'], ['origin', 'Where did it start?', 'kitchen'], ['entryMethod', 'How did they enter?', 'window'], ['event', 'What happened?', 'moved-to-shed'], ['motive', 'Why?', 'surprise']] as const) {
      fireEvent.change(screen.getByLabelText(label), { target: { value } })
      expect(onChange).toHaveBeenLastCalledWith({ ...theory, [field]: value })
    }
  })

  it('translates option labels and preserves all fields in Russian', () => {
    render(<TheoryPanel theory={freshGameState().theory} solution={missingCakeCase.solution} language="ru" result={null} onChange={vi.fn()} onSubmit={vi.fn()} />)

    expect(screen.getByRole('option', { name: 'Петя' })).toBeTruthy()
    expect(screen.getByLabelText('Кто')).toBeTruthy()
    expect(screen.getByLabelText('Как он вошёл?')).toBeTruthy()
  })

  it('submits incomplete theory and displays supplied result', () => {
    const onSubmit = vi.fn()
    render(<TheoryPanel theory={freshGameState().theory} solution={missingCakeCase.solution} language="en" result="wrong" onChange={vi.fn()} onSubmit={onSubmit} />)

    fireEvent.click(screen.getByRole('button', { name: 'Submit theory' }))
    expect(onSubmit).toHaveBeenCalledOnce()
    expect(screen.getByRole('status').textContent).toMatch(/wrong/i)
  })
})
