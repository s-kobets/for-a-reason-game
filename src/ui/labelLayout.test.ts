import { describe, expect, it } from 'vitest'
import { layoutLabels, type Rect } from './labelLayout'

const overlap = (a: Rect, b: Rect) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y

describe('layoutLabels', () => {
  it('keeps labels of neighbouring markers from overlapping', () => {
    const items = [
      { id: 'a', x: 500, y: 300, text: 'Empty cake stand' },
      { id: 'b', x: 470, y: 330, text: 'Blue frosting smear' },
      { id: 'c', x: 440, y: 270, text: 'Pantry shelf' },
      { id: 'd', x: 520, y: 340, text: 'Muddy footprints' },
    ]
    const placed = layoutLabels(items)
    for (let i = 0; i < placed.length; i++) for (let j = i + 1; j < placed.length; j++) expect(overlap(placed[i].rect, placed[j].rect)).toBe(false)
  })

  it('does not cover another marker', () => {
    const items = [{ id: 'a', x: 500, y: 300, text: 'Window' }, { id: 'b', x: 500, y: 372, text: 'Door' }]
    const [a] = layoutLabels(items)
    expect(overlap(a.rect, { x: 471, y: 343, w: 58, h: 58 })).toBe(false)
  })

  it('stays inside the scene near the edges', () => {
    const [label] = layoutLabels([{ id: 'a', x: 980, y: 590, text: 'Garden lantern in the corner' }])
    expect(label.rect.x + label.rect.w).toBeLessThanOrEqual(1000)
    expect(label.rect.y + label.rect.h).toBeLessThanOrEqual(620)
  })

  it('avoids reserved areas such as character cards', () => {
    const card = { x: 400, y: 340, w: 200, h: 60 }
    const [label] = layoutLabels([{ id: 'a', x: 500, y: 300, text: 'Cake stand' }], [card])
    expect(overlap(label.rect, card)).toBe(false)
  })
})

import { missingCakeCase } from '../case/missingCake'
import { midnightGreenhouseCase } from '../case/midnightGreenhouse'
import { vanishingViolinCase } from '../case/vanishingViolin'

describe('layoutLabels on real cases', () => {
  for (const caseData of [missingCakeCase, midnightGreenhouseCase, vanishingViolinCase]) {
    for (const location of caseData.locations) {
      it(`${caseData.id}/${location.id} has clickable, non-overlapping labels`, () => {
        const hotspots = caseData.hotspots.filter(({ locationId }) => locationId === location.id)
        const items = hotspots.map((h) => ({ id: h.id, x: h.placement.x * 1000, y: h.placement.y * 620, text: h.title.ru.length > h.title.en.length ? h.title.ru : h.title.en }))
        const placed = layoutLabels(items)
        for (let i = 0; i < placed.length; i++) {
          for (let j = i + 1; j < placed.length; j++) expect(overlap(placed[i].rect, placed[j].rect), `${placed[i].id} / ${placed[j].id}`).toBe(false)
          for (const item of items) expect(overlap(placed[i].rect, { x: item.x - 29, y: item.y - 29, w: 58, h: 58 }), `${placed[i].id} covers marker ${item.id}`).toBe(false)
        }
      })
    }
  }
})
