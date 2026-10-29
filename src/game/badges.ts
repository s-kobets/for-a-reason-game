import type { LocalizedText } from '../case/types'

export interface Badge { id: string; icon: string; title: LocalizedText; hint: LocalizedText }

export const badges: Badge[] = [
  { id: 'first-clue', icon: '🔎', title: { en: 'Sharp Eye', ru: 'Зоркий глаз' }, hint: { en: 'Find your first clue', ru: 'Найди первую улику' } },
  { id: 'first-deduction', icon: '💡', title: { en: 'Bright Idea', ru: 'Светлая мысль' }, hint: { en: 'Make your first deduction', ru: 'Сделай первый вывод' } },
  { id: 'confronter', icon: '🎯', title: { en: 'Caught in a Lie', ru: 'Поймал на лжи' }, hint: { en: 'Show someone a contradiction', ru: 'Предъяви кому-то противоречие' } },
  { id: 'solver', icon: '🕵️', title: { en: 'Detective', ru: 'Детектив' }, hint: { en: 'Solve a case', ru: 'Раскрой дело' } },
  { id: 'perfect', icon: '🌟', title: { en: 'Flawless', ru: 'Без единой подсказки' }, hint: { en: 'Solve a case without hints', ru: 'Раскрой дело без подсказок' } },
  { id: 'all-cases', icon: '🏆', title: { en: 'Master Detective', ru: 'Мастер-сыщик' }, hint: { en: 'Solve all the cases', ru: 'Раскрой все дела' } },
]

const key = 'reasoning-game:badges'

export function loadBadges(): string[] {
  try {
    const value = JSON.parse(localStorage.getItem(key) ?? '[]')
    return Array.isArray(value) ? value.filter((id): id is string => typeof id === 'string' && badges.some((badge) => badge.id === id)) : []
  } catch {
    return []
  }
}

export function awardBadges(ids: string[]): Badge[] {
  const owned = loadBadges()
  const fresh = badges.filter((badge) => ids.includes(badge.id) && !owned.includes(badge.id))
  if (fresh.length === 0) return []
  try { localStorage.setItem(key, JSON.stringify([...owned, ...fresh.map(({ id }) => id)])) } catch { /* storage unavailable */ }
  return fresh
}
