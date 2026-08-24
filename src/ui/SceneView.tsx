import type { Character, Hotspot, Location } from '../case/types'
import type { GameAction } from '../game/reducer'
import type { GameState } from '../game/state'
import { getText, caseUiText } from '../case/translations'
import { SceneArtwork } from './SceneArtwork'

interface SceneViewProps {
  location: Location;
  state: GameState;
  hotspots: Hotspot[];
  characters: Character[];
  onAction(action: GameAction): void;
  onHotspot(hotspot: Hotspot): void;
  onCharacter(character: Character): void;
}

export function SceneView({ location, state, hotspots, characters, onAction, onHotspot, onCharacter }: SceneViewProps) {
  return (
    <section className="scene-card" aria-labelledby="scene-title">
      <div className="scene-heading">
        <div>
          <p className="eyebrow">{getText(caseUiText.inspect, state.language)}</p>
          <h1 id="scene-title">{getText(location.title, state.language)}</h1>
          <p>{getText(location.description, state.language)}</p>
        </div>
        <span className="scene-status">{state.discoveredHotspotIds.length} {getText(caseUiText.discovered, state.language)}</span>
      </div>
      <div className="scene-stage">
        <SceneArtwork sceneId={location.sceneId} sceneTitle={location.title} hotspots={hotspots} language={state.language} discoveredHotspotIds={state.discoveredHotspotIds} onHotspot={onHotspot} />
        <div className="character-strip" aria-label={getText(caseUiText.talkTo, state.language)}>
          {characters.map((character) => (
            <button key={character.id} type="button" className="character-card" onClick={() => onCharacter(character)}>
              <span className="character-avatar" aria-hidden="true">{character.name.en.slice(0, 1)}</span>
              <span><strong>{getText(character.name, state.language)}</strong><small>{getText(character.role, state.language)}</small></span>
            </button>
          ))}
        </div>
      </div>
      <div className="scene-actions">
        <button type="button" onClick={() => onAction({ type: 'setLocation', locationId: location.id })}>{getText(caseUiText.inspect, state.language)}</button>
      </div>
    </section>
  )
}
