import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { missingCakeCase } from '../case/missingCake'
import { freshGameState } from '../game/state'
import { GameShell } from './GameShell'

describe('GameShell', () => {
  it('renders current location and investigation controls', () => {
    render(<GameShell caseData={missingCakeCase} state={freshGameState()} dispatch={() => undefined} />)

    expect(screen.getByRole('heading', { name: 'Kitchen' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Notebook' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Map' })).toBeTruthy()
  })
})
