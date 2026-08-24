import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import { missingCakeCase } from '../case/missingCake'
import { freshGameState } from '../game/state'
import { TheoryPanel } from './TheoryPanel'

describe('TheoryPanel', () => {
  afterEach(cleanup)
  it('renders and updates all five translated theory fields', () => {
    const onChange = vi.fn()
    render(<TheoryPanel theory={freshGameState().theory} solution={missingCakeCase.solution} language="en" result={null} onChange={onChange} onSubmit={vi.fn()} />)

    for (const label of ['Who', 'Where did it start?', 'How did they enter?', 'What happened?', 'Why?']) {
      expect(screen.getByLabelText(label)).toBeTruthy()
    }

    fireEvent.change(screen.getByLabelText('Who'), { target: { value: 'petya' } })
    expect(onChange).toHaveBeenCalledWith({ ...freshGameState().theory, person: 'petya' })
  })

  it('submits incomplete theory and displays supplied result', () => {
    const onSubmit = vi.fn()
    render(<TheoryPanel theory={freshGameState().theory} solution={missingCakeCase.solution} language="en" result="wrong" onChange={vi.fn()} onSubmit={onSubmit} />)

    fireEvent.click(screen.getByRole('button', { name: 'Submit theory' }))
    expect(onSubmit).toHaveBeenCalledOnce()
    expect(screen.getByRole('status').textContent).toMatch(/wrong/i)
  })
})
