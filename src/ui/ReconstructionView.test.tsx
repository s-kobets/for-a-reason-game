import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { missingCakeCase } from '../case/missingCake'
import { ReconstructionView } from './ReconstructionView'

describe('ReconstructionView', () => {
  afterEach(cleanup)
  it('advances one step and replays from the beginning', () => {
    const onNext = vi.fn()
    const onReplay = vi.fn()
    render(<ReconstructionView steps={missingCakeCase.reconstruction} currentStep={0} language="en" onNext={onNext} onReplay={onReplay} />)

    expect(screen.getByText('After the rain, Petya crosses the garden with a secret plan.')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(onNext).toHaveBeenCalledOnce()
  })

  it('shows final understood state on last step', () => {
    const onReplay = vi.fn()
    render(<ReconstructionView steps={missingCakeCase.reconstruction} currentStep={4} language="en" onNext={vi.fn()} onReplay={onReplay} />)

    expect(screen.getByRole('status').textContent).toMatch(/case understood/i)
    expect(screen.queryByRole('button', { name: 'Next' })).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Replay' }))
    expect(onReplay).toHaveBeenCalledOnce()
  })
})
