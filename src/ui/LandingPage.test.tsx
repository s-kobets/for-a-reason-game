import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { LandingPage } from './LandingPage'

afterEach(cleanup)

const caseCards = [
  {
    id: 'missing-cake',
    number: { en: 'Case 01', ru: 'Дело 01' },
    title: { en: 'The Missing Cake', ru: 'Исчезнувший торт' },
    playLabel: { en: 'Play The Missing Cake', ru: 'Играть в «Исчезнувший торт»' },
    resumeLabel: { en: 'Resume The Missing Cake', ru: 'Продолжить «Исчезнувший торт»' },
    description: { en: 'A birthday cake vanished before the family celebration.', ru: 'Праздничный торт исчез перед семейным праздником.' },
    preview: <rect data-scene-prop="cake-preview" width="100" height="100" />,
    hasSavedGame: false,
  },
  {
    id: 'midnight-greenhouse',
    number: { en: 'Case 02', ru: 'Дело 02' },
    title: { en: 'The Midnight Greenhouse', ru: 'Полуночная оранжерея' },
    playLabel: { en: 'Play The Midnight Greenhouse', ru: 'Играть в «Полуночную оранжерею»' },
    resumeLabel: { en: 'Resume The Midnight Greenhouse', ru: 'Продолжить «Полуночную оранжерею»' },
    description: { en: 'A locked glasshouse blooms after dark.', ru: 'Запертая оранжерея расцветает после полуночи.' },
    preview: <circle data-scene-prop="greenhouse-preview" r="30" />,
    hasSavedGame: false,
  },
]

describe('LandingPage', () => {
  it('launches either available case and leaves the violin unavailable', () => {
    const onPlay = vi.fn()
    const props = { language: 'en' as const, theme: 'light' as const, caseCards, onChangeLanguage: vi.fn(), onChangeTheme: vi.fn(), onPlay }
    const { rerender } = render(<LandingPage {...props} />)

    expect(screen.getByRole('heading', { name: 'Something happened. Can you work out why?' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Start investigating' }).getAttribute('href')).toBe('#cases')
    expect(screen.getByText('2 cases ready')).toBeTruthy()
    const cakeCard = screen.getByRole('button', { name: 'Play The Missing Cake' })
    const greenhouseCard = screen.getByRole('button', { name: 'Play The Midnight Greenhouse' })
    expect(cakeCard.querySelector('[data-scene-prop="cake-preview"]')).toBeTruthy()
    expect(greenhouseCard.querySelector('[data-scene-prop="greenhouse-preview"]')).toBeTruthy()
    expect(greenhouseCard.querySelector('svg[aria-hidden="true"]')).toBeTruthy()
    expect(screen.getByText('The Vanishing Violin').closest('[aria-disabled="true"]')).toBeTruthy()
    expect(screen.getByText('A concert ends with one instrument missing.')).toBeTruthy()

    fireEvent.click(cakeCard)
    fireEvent.click(greenhouseCard)
    expect(onPlay).toHaveBeenNthCalledWith(1, 'missing-cake')
    expect(onPlay).toHaveBeenNthCalledWith(2, 'midnight-greenhouse')

    rerender(<LandingPage {...props} caseCards={caseCards.map((card) => ({ ...card, hasSavedGame: card.id === 'midnight-greenhouse' }))} />)
    expect(screen.getByRole('button', { name: 'Play The Missing Cake' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Resume The Midnight Greenhouse' })).toBeTruthy()
    expect(screen.getByText('In progress')).toBeTruthy()
  })

  it('localizes cards and keeps language and theme controls available', () => {
    const onChangeLanguage = vi.fn()
    const onChangeTheme = vi.fn()
    render(<LandingPage language="ru" theme="dark" caseCards={caseCards} onChangeLanguage={onChangeLanguage} onChangeTheme={onChangeTheme} onPlay={vi.fn()} />)

    expect(screen.getByRole('heading', { name: 'Что-то случилось. Сможете понять почему?' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Начать расследование' }).getAttribute('href')).toBe('#cases')
    expect(screen.getByText('2 дела доступны')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Играть в «Полуночную оранжерею»' })).toBeTruthy()
    expect(screen.getByText('Запертая оранжерея расцветает после полуночи.')).toBeTruthy()
    expect(screen.getByText('Дело 02')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Переключить на английский' }))
    fireEvent.click(screen.getByRole('button', { name: 'Включить светлую тему' }))
    expect(onChangeLanguage).toHaveBeenCalledOnce()
    expect(onChangeTheme).toHaveBeenCalledOnce()
  })
})
