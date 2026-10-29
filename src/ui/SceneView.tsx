import { useLayoutEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { Character, Hotspot, Location } from '../case/types'
import type { GameState } from '../game/state'
import { formatClueCount, getText, caseUiText } from '../case/translations'
import { Avatar } from './Avatar'
import type { Rect } from './labelLayout'
import { SCENE_ASPECT_RATIO, SceneArtwork } from './SceneArtwork'

interface SceneViewProps {
  location: Location;
  state: GameState;
  hotspots: Hotspot[];
  characters: Character[];
  onHotspot(hotspot: Hotspot): void;
  onCharacter(character: Character): void;
  totalClues: number;
  foundClues: number;
  renderScene(sceneId: string): ReactNode;
}

export function SceneView({ location, state, hotspots, characters, onHotspot, onCharacter, totalClues, foundClues, renderScene }: SceneViewProps) {
  const [showHints, setShowHints] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)
  const [cardRects, setCardRects] = useState<Rect[]>([])
  const cardKey = characters.map((character) => character.id).join()
  useLayoutEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const measure = () => {
      const box = stage.getBoundingClientRect()
      if (box.width === 0) return
      const scale = 1000 / box.width
      const next = [...stage.querySelectorAll('.character-card')].map((card) => {
        const rect = card.getBoundingClientRect()
        return { x: (rect.left - box.left) * scale - 6, y: (rect.top - box.top) * scale - 6, w: rect.width * scale + 12, h: rect.height * scale + 12 }
      })
      setCardRects((prev) => prev.length === next.length && prev.every((p, i) => Math.abs(p.x - next[i].x) < 1 && Math.abs(p.y - next[i].y) < 1 && Math.abs(p.w - next[i].w) < 1 && Math.abs(p.h - next[i].h) < 1) ? prev : next)
    }
    measure()
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(measure)
    observer?.observe(stage)
    return () => observer?.disconnect()
  }, [cardKey, state.language])
  return (
    <section className="scene-card" data-mobile-order="1" aria-labelledby="scene-title">
      <div className="scene-heading">
        <div>
          <p className="eyebrow">{getText(caseUiText.inspect, state.language)}</p>
          <h1 id="scene-title">{getText(location.title, state.language)}</h1>
          <p>{getText(location.description, state.language)}</p>
        </div>
            <span className="scene-status">{formatClueCount(foundClues, totalClues, state.language)} {getText(caseUiText.cluesFound, state.language)}</span>
      </div>
      <div ref={stageRef} className="scene-stage" style={{ aspectRatio: SCENE_ASPECT_RATIO }}>
        <SceneArtwork sceneId={location.sceneId} sceneContent={renderScene(location.sceneId)} sceneTitle={location.title} hotspots={hotspots} language={state.language} discoveredHotspotIds={state.discoveredHotspotIds} showHints={showHints} avoid={cardRects} onHotspot={onHotspot} />
        <div className="character-layer" aria-label={getText(caseUiText.talkTo, state.language)}>
          {characters.map((character) => (
            <button id={`character-${character.id}`} data-character-id={character.id} key={character.id} type="button" className="character-card" style={{ left: `${character.placement.x * 100}%`, top: `${character.placement.y * 100}%` }} onClick={() => onCharacter(character)}>
              <Avatar className="character-avatar" name={getText(character.name, state.language)} />
              <span><strong>{getText(character.name, state.language)}</strong><small>{getText(character.role, state.language)}</small><em className="talk-hint">💬 {getText(caseUiText.tapToTalk, state.language)}</em></span>
            </button>
          ))}
        </div>
      </div>
      <div className="scene-actions">
        <button type="button" aria-pressed={showHints} onClick={() => setShowHints((visible) => !visible)}>{getText(showHints ? caseUiText.hideInspectionHints : caseUiText.showInspectionHints, state.language)}</button>
      </div>
    </section>
  )
}
