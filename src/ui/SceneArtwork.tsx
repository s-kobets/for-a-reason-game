import type { ReactNode } from 'react'
import type { Hotspot, Language, LocalizedText } from '../case/types'
import { getText } from '../case/translations'

interface SceneArtworkProps { sceneId: string; sceneContent?: ReactNode; hotspots: Hotspot[]; language: Language; sceneTitle: LocalizedText; discoveredHotspotIds: string[]; showHints?: boolean; onHotspot(hotspot: Hotspot): void }
export const SCENE_VIEWBOX = '0 0 1000 620'
export const SCENE_ASPECT_RATIO = 1000 / 620

export function SceneArtwork({ sceneId, sceneContent, hotspots, language, sceneTitle, discoveredHotspotIds, showHints = false, onHotspot }: SceneArtworkProps) {
  return <svg className={`scene-artwork${showHints ? ' inspect-mode' : ''}`} data-scene-id={sceneId} viewBox={SCENE_VIEWBOX} role="group" aria-label={getText(sceneTitle, language)}><rect width="1000" height="620" fill="#f4d7a1" /><path d="M0 425 Q250 365 500 425 T1000 410 V620 H0Z" fill="#b9674b" /><circle cx="110" cy="90" r="48" fill="#fff4c4" opacity=".8" /><text x="500" y="82" textAnchor="middle" className="scene-motif">{getText(sceneTitle, language)}</text>{sceneContent}{hotspots.map((hotspot) => { const discovered = discoveredHotspotIds.includes(hotspot.id); const x = hotspot.placement.x * 1000; const y = hotspot.placement.y * 620; return <g id={`hotspot-marker-${hotspot.id}`} data-hotspot-id={hotspot.id} key={hotspot.id} className={`hotspot ${discovered ? 'is-discovered' : ''} ${showHints && !discovered ? 'is-highlighted' : ''}`}><circle cx={x} cy={y} r="29" className="hotspot-ring" /><circle cx={x} cy={y} r="7" className="hotspot-dot" /><foreignObject x={x - 100} y={y + 34} width="200" height="54"><button id={`hotspot-${hotspot.id}`} data-hotspot-id={hotspot.id} type="button" className="hotspot-button" aria-label={`${getText(hotspot.title, language)}: ${getText(hotspot.description, language)}`} onClick={() => onHotspot(hotspot)}>{getText(hotspot.title, language)}</button></foreignObject></g> })}</svg>
}
