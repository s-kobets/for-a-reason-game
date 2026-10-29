import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import type { Evidence, Language } from '../case/types'
import { caseUiText, getText } from '../case/translations'

interface EvidenceBoardProps {
  evidence: Evidence[]
  selectedIds: string[]
  language: Language
  onToggle(id: string): void
  onMakeDeduction(): void
}

export function EvidenceBoard({ evidence, selectedIds, language, onToggle, onMakeDeduction }: EvidenceBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null)
  const [drag, setDrag] = useState<{ id: string; x: number; y: number } | null>(null)
  const items = evidence.filter((item) => item.text)
  const selected = items.filter((item) => selectedIds.includes(item.id))
  const tray = items.filter((item) => !selectedIds.includes(item.id))
  const label = (id: string) => getText(items.find((item) => item.id === id)!.text!, language)

  const startDrag = (event: ReactPointerEvent, id: string) => {
    event.preventDefault()
    const startX = event.clientX
    const startY = event.clientY
    const wasSelected = selectedIds.includes(id)
    let moved = false
    const move = (ev: PointerEvent) => {
      if (Math.hypot(ev.clientX - startX, ev.clientY - startY) > 6) moved = true
      if (moved) setDrag({ id, x: ev.clientX, y: ev.clientY })
    }
    const up = (ev: PointerEvent) => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      setDrag(null)
      const rect = boardRef.current?.getBoundingClientRect()
      const inside = !!rect && ev.clientX >= rect.left && ev.clientX <= rect.right && ev.clientY >= rect.top && ev.clientY <= rect.bottom
      if (!moved || inside !== wasSelected) onToggle(id)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  const points = selected.map((_, index) => {
    const angle = (2 * Math.PI * index) / selected.length - Math.PI / 2
    return { x: 50 + 36 * Math.cos(angle), y: 50 + 34 * Math.sin(angle) }
  })

  return <div className="evidence-board" aria-hidden="true">
    <p className="board-title">{getText(caseUiText.boardTitle, language)}</p>
    <div ref={boardRef} className={`board-surface${drag && !selectedIds.includes(drag.id) ? ' is-target' : ''}`}>
      <svg className="board-strings" viewBox="0 0 100 100" preserveAspectRatio="none">
        {points.map((point, index) => <line key={selected[index].id} x1="50" y1="50" x2={point.x} y2={point.y} />)}
      </svg>
      {selected.map((item, index) => <div key={item.id} className="board-card is-pinned" style={{ left: `${points[index].x}%`, top: `${points[index].y}%`, opacity: drag?.id === item.id ? 0.35 : 1 }} onPointerDown={(event) => startDrag(event, item.id)}>{label(item.id)}</div>)}
      <button type="button" tabIndex={-1} className={`board-center${selected.length >= 2 ? ' is-ready' : ''}`} onClick={onMakeDeduction}>
        <span>💡</span>
        {getText(caseUiText.makeDeduction, language)}
      </button>
      {selected.length === 0 && <p className="board-empty">{getText(caseUiText.boardDrop, language)}</p>}
    </div>
    <div className="board-tray">
      {tray.map((item) => <div key={item.id} className="board-card" style={{ opacity: drag?.id === item.id ? 0.35 : 1 }} onPointerDown={(event) => startDrag(event, item.id)}>{label(item.id)}</div>)}
      {tray.length === 0 && <p className="board-empty">{getText(caseUiText.boardTrayEmpty, language)}</p>}
    </div>
    {drag && <div className="board-card is-ghost" style={{ left: drag.x, top: drag.y }}>{label(drag.id)}</div>}
  </div>
}
