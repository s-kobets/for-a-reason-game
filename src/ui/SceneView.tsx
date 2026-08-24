import { useState } from 'react'
import type { Character, Hotspot, Location } from '../case/types'
import type { GameState } from '../game/state'
import { getText, caseUiText } from '../case/translations'
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
}

export function SceneView({ location, state, hotspots, characters, onHotspot, onCharacter, totalClues, foundClues }: SceneViewProps) {
  const [showHints, setShowHints] = useState(false)
  return (
    <section className="scene-card" data-mobile-order="1" aria-labelledby="scene-title">
      <div className="scene-heading">
        <div>
          <p className="eyebrow">{getText(caseUiText.inspect, state.language)}</p>
          <h1 id="scene-title">{getText(location.title, state.language)}</h1>
          <p>{getText(location.description, state.language)}</p>
        </div>
            <span className="scene-status">{foundClues} / {totalClues} {getText(caseUiText.cluesFound, state.language)}</span>
      </div>
      <div className="scene-stage" style={{ aspectRatio: SCENE_ASPECT_RATIO }}>
        <SceneArtwork sceneId={location.sceneId} sceneTitle={location.title} hotspots={hotspots} language={state.language} discoveredHotspotIds={state.discoveredHotspotIds} showHints={showHints} onHotspot={onHotspot} />
        <div className="character-layer" aria-label={getText(caseUiText.talkTo, state.language)}>
          {characters.map((character) => (
            <button id={`character-${character.id}`} data-character-id={character.id} key={character.id} type="button" className="character-card" style={{ left: `${character.placement.x * 100}%`, top: `${character.placement.y * 100}%` }} onClick={() => onCharacter(character)}>
              <span className="character-avatar" aria-hidden="true">{character.name.en.slice(0, 1)}</span>
              <span><strong>{getText(character.name, state.language)}</strong><small>{getText(character.role, state.language)}</small></span>
            </button>
          ))}
        </div>
      </div>
      <div className="scene-actions">
        <button type="button" onClick={() => setShowHints((visible) => !visible)}>{getText(showHints ? caseUiText.hideInspectionHints : caseUiText.showInspectionHints, state.language)}</button>
      </div>
    </section>
  )
}
