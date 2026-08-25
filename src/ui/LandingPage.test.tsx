import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { LandingPage } from './LandingPage'

afterEach(cleanup)

describe('LandingPage', () => {
  it('shows playable and unavailable cases and starts from both live actions', () => {
    const onPlay = vi.fn()
    render(<LandingPage language="en" theme="light" hasSavedGame={false} onChangeLanguage={vi.fn()} onChangeTheme={vi.fn()} onPlay={onPlay} />)

    expect(screen.getByRole('heading', { name: 'Something happened. Can you work out why?' })).toBeTruthy()
    expect(screen.getByText('The Midnight Greenhouse').closest('[aria-disabled="true"]')).toBeTruthy()
    expect(screen.getByText('The Vanishing Violin').closest('[aria-disabled="true"]')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Start investigating' }))
    fireEvent.click(screen.getByRole('button', { name: 'Play The Missing Cake' }))
    expect(onPlay).toHaveBeenCalledTimes(2)
  })

  it('localizes resume and theme controls', () => {
    const onChangeLanguage = vi.fn()
    const onChangeTheme = vi.fn()
    render(<LandingPage language="ru" theme="dark" hasSavedGame onChangeLanguage={onChangeLanguage} onChangeTheme={onChangeTheme} onPlay={vi.fn()} />)

    expect(screen.getByRole('heading', { name: 'Что-то случилось. Сможете понять почему?' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Продолжить расследование' })).toBeTruthy()
    expect(screen.getByText('Дело 01')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Сменить язык' }))
    fireEvent.click(screen.getByRole('button', { name: 'Включить светлую тему' }))
    expect(onChangeLanguage).toHaveBeenCalledOnce()
    expect(onChangeTheme).toHaveBeenCalledOnce()
  })
})
