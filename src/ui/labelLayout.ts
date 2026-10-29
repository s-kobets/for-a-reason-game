export interface Rect { x: number; y: number; w: number; h: number }
export interface LabelInput { id: string; x: number; y: number; text: string }
export interface LabelPlacement { id: string; rect: Rect }

export const SCENE_WIDTH = 1000
export const SCENE_HEIGHT = 620
const RING = 29
const GAP = 8
const TOP = 112

const CHAR = 11.5
const PAD = 30
export function labelSize(text: string): { w: number; h: number } {
  const full = text.length * CHAR + PAD
  const w = Math.min(190, Math.max(70, full))
  const lines = Math.max(1, Math.ceil((text.length * CHAR) / (w - PAD) + 0.15))
  return { w, h: 16 + lines * 22 }
}

const overlaps = (a: Rect, b: Rect, pad = 4) => a.x < b.x + b.w + pad && a.x + a.w + pad > b.x && a.y < b.y + b.h + pad && a.y + a.h + pad > b.y
const circleRect = (x: number, y: number): Rect => ({ x: x - RING, y: y - RING, w: RING * 2, h: RING * 2 })
const inside = (r: Rect) => r.x >= 4 && r.y >= TOP && r.x + r.w <= SCENE_WIDTH - 4 && r.y + r.h <= SCENE_HEIGHT - 4

function candidates(x: number, y: number, w: number, h: number): Rect[] {
  const out: Rect[] = []
  const reach = RING + GAP
  for (let dy = -(reach + h * 3); dy <= reach + h * 3; dy += 12) {
    for (let dx = -(reach + w * 1.5); dx <= reach + w * 1.5; dx += 16) {
      const rect: Rect = { x: x + dx - w / 2, y: y + dy - h / 2, w, h }
      if (!overlaps(rect, circleRect(x, y), GAP / 2)) out.push(rect)
    }
  }
  return out
}

const distance = (r: Rect, x: number, y: number) => Math.hypot(r.x + r.w / 2 - x, r.y + r.h / 2 - y)

/** Places labels near their markers without overlapping each other, other markers or the avoided areas. */
export function layoutLabels(items: LabelInput[], avoid: Rect[] = []): LabelPlacement[] {
  const circles = items.map(({ x, y }) => circleRect(x, y))
  const sizes = new Map(items.map((item) => [item.id, labelSize(item.text)]))
  // Crowded markers go first so they get their pick of free spots.
  const crowding = (item: LabelInput) => items.filter((other) => other !== item && Math.hypot(other.x - item.x, other.y - item.y) < 170).length
  const order = [...items].sort((p, q) => crowding(q) - crowding(p))
  const placed = new Map<string, Rect>()
  for (const item of order) {
    const { w, h } = sizes.get(item.id)!
    let best: { rect: Rect; score: number } | undefined
    for (const rect of candidates(item.x, item.y, w, h)) {
      const clipped = inside(rect) ? 0 : 1
      const hits = [...placed.values()].filter((p) => overlaps(rect, p)).length * 4
        + circles.filter((c) => overlaps(rect, c, 0)).length * 4
        + avoid.filter((a) => overlaps(rect, a, 0)).length * 2
      const score = clipped * 1e6 + hits * 1e4 + distance(rect, item.x, item.y)
      if (!best || score < best.score) best = { rect, score }
    }
    placed.set(item.id, best!.rect)
  }
  return items.map(({ id }) => ({ id, rect: placed.get(id)! }))
}

/** Point on the label's edge closest to the marker, for drawing a leader line. */
export function leaderEnd(rect: Rect, x: number, y: number): { x: number; y: number } {
  return { x: Math.min(Math.max(x, rect.x), rect.x + rect.w), y: Math.min(Math.max(y, rect.y), rect.y + rect.h) }
}
