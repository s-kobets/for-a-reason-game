import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { LandingPage } from './LandingPage'

afterEach(cleanup)

describe('LandingPage', () => {
  it('shows playable and unavailable cases and starts from both live actions', () => {
    const onPlay = vi.fn()
    const props = { language: 'en' as const, theme: 'light' as const, onChangeLanguage: vi.fn(), onChangeTheme: vi.fn(), onPlay }
    const { rerender } = render(<LandingPage {...props} hasSavedGame={false} />)

    const liveCard = screen.getByRole('button', { name: 'Play The Missing Cake' })
    expect(screen.getByRole('heading', { name: 'Something happened. Can you work out why?' })).toBeTruthy()
    expect(liveCard.querySelector('.case-card-preview')).toBeTruthy()
    expect(liveCard.querySelector('svg[aria-hidden="true"]')).toBeTruthy()
    expect(liveCard.querySelector('[data-scene-prop="window"]')).toBeTruthy()
    expect(screen.getByText('The Midnight Greenhouse').closest('.case-card')?.querySelector('svg')).toBeNull()
    expect(screen.getByText('The Vanishing Violin').closest('.case-card')?.querySelector('svg')).toBeNull()
    expect(screen.getByText('The Midnight Greenhouse').closest('[aria-disabled="true"]')).toBeTruthy()
    expect(screen.getByText('The Vanishing Violin').closest('[aria-disabled="true"]')).toBeTruthy()
    expect(screen.getByText('A locked glasshouse blooms after dark.')).toBeTruthy()
    expect(screen.getByText('A concert ends with one instrument missing.')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Switch to Russian' })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Start investigating' }))
    fireEvent.click(screen.getByRole('button', { name: 'Play The Missing Cake' }))
    expect(onPlay).toHaveBeenCalledTimes(2)
    rerender(<LandingPage {...props} hasSavedGame />)
    expect(screen.getByRole('button', { name: 'Resume The Missing Cake' })).toBeTruthy()
    expect(screen.getByText('In progress')).toBeTruthy()
  })

  it('localizes resume and theme controls', () => {
    const onChangeLanguage = vi.fn()
    const onChangeTheme = vi.fn()
    render(<LandingPage language="ru" theme="dark" hasSavedGame onChangeLanguage={onChangeLanguage} onChangeTheme={onChangeTheme} onPlay={vi.fn()} />)

    expect(screen.getByRole('heading', { name: 'Что-то случилось. Сможете понять почему?' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Продолжить расследование' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Продолжить «Исчезнувший торт»' })).toBeTruthy()
    expect(screen.getByText('В процессе')).toBeTruthy()
    expect(screen.getByText('Дело 01')).toBeTruthy()
    expect(screen.getByText('Запертая оранжерея расцветает после полуночи.')).toBeTruthy()
    expect(screen.getByText('После концерта исчезает одна скрипка.')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Переключить на английский' }))
    fireEvent.click(screen.getByRole('button', { name: 'Включить светлую тему' }))
    expect(onChangeLanguage).toHaveBeenCalledOnce()
    expect(onChangeTheme).toHaveBeenCalledOnce()
  })
})
