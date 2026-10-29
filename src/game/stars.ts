const key = (caseId: string) => `reasoning-game:stars:${caseId}`

export function starsForHints(hintsUsed: number): 1 | 2 | 3 {
  return hintsUsed === 0 ? 3 : hintsUsed <= 3 ? 2 : 1
}

export function loadStars(caseId: string): number {
  try {
    const value = Number(localStorage.getItem(key(caseId)))
    return Number.isInteger(value) && value >= 1 && value <= 3 ? value : 0
  } catch {
    return 0
  }
}

export function saveBestStars(caseId: string, stars: number): void {
  if (stars <= loadStars(caseId)) return
  try { localStorage.setItem(key(caseId), String(stars)) } catch { /* storage unavailable */ }
}
