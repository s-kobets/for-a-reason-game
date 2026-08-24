import type { Hotspot, Language, LocalizedText } from '../case/types'
import { getText } from '../case/translations'

interface SceneArtworkProps { sceneId: string; hotspots: Hotspot[]; language: Language; sceneTitle: LocalizedText; discoveredHotspotIds: string[]; showHints?: boolean; onHotspot(hotspot: Hotspot): void }
export interface NormalizedBounds { x: readonly [number, number]; y: readonly [number, number] }
export const SCENE_VIEWBOX = '0 0 1000 620'
export const SCENE_ASPECT_RATIO = 1000 / 620

export const sceneHotspotBounds: Record<string, NormalizedBounds> = {
  'cake-stand': { x: [0.58, 0.72], y: [0.38, 0.5] },
  'kitchen-window': { x: [0.09, 0.37], y: [0.2, 0.52] },
  'muddy-footprints': { x: [0.55, 0.8], y: [0.68, 0.84] },
  'blue-frosting': { x: [0.48, 0.58], y: [0.43, 0.53] },
  'pantry-dust': { x: [0.42, 0.54], y: [0.28, 0.4] },
  'party-invitation': { x: [0.58, 0.75], y: [0.38, 0.52] },
  'wet-umbrella': { x: [0.82, 0.96], y: [0.28, 0.45] },
  'garden-path': { x: [0.2, 0.8], y: [0.62, 0.84] },
  'broken-stem': { x: [0.18, 0.32], y: [0.58, 0.7] },
  'garden-lantern': { x: [0.78, 0.94], y: [0.35, 0.48] },
  'scarf-thread': { x: [0.7, 0.82], y: [0.3, 0.48] },
  'back-door': { x: [0.4, 0.6], y: [0.3, 0.75] },
  'shed-latch': { x: [0.48, 0.62], y: [0.58, 0.78] },
  'hidden-cake': { x: [0.23, 0.38], y: [0.6, 0.78] },
} as const

function sceneProps(sceneId: string) {
  switch (sceneId) {
    case 'kitchen-diorama':
      return <><rect x="90" y="130" width="280" height="190" rx="12" fill="#9bd0d2" stroke="#694739" strokeWidth="12" data-scene-prop="window" /><path d="M230 130V320M90 225H370" stroke="#694739" strokeWidth="10" /><rect x="500" y="290" width="300" height="34" rx="12" fill="#694739" data-scene-prop="counter" /><path d="M580 290V410M720 290V410" stroke="#694739" strokeWidth="18" /><ellipse cx="650" cy="270" rx="75" ry="18" fill="#fffaf3" stroke="#694739" strokeWidth="8" data-scene-prop="cake-stand" /><path d="M590 270 Q650 205 710 270" fill="#8b5e4b" /><circle cx="650" cy="216" r="10" fill="#f9cf7c" /><path d="M620 450l12 10m30-25 12 10m28-30 12 10" stroke="#694739" strokeWidth="10" strokeLinecap="round" data-scene-prop="muddy-footprints" /><circle cx="520" cy="298" r="10" fill="#5e87a0" data-scene-prop="blue-frosting" /><path d="M420 210H540" stroke="#f3d9aa" strokeWidth="10" data-scene-prop="pantry-dust" /></>;
    case 'living-room-diorama':
      return <><rect x="120" y="180" width="370" height="145" rx="35" fill="#b97969" stroke="#694739" strokeWidth="10" data-scene-prop="sofa" /><path d="M165 180V135M445 180V135" stroke="#694739" strokeWidth="18" /><rect x="565" y="300" width="220" height="30" rx="10" fill="#694739" data-scene-prop="table" /><path d="M600 330V430M750 330V430" stroke="#694739" strokeWidth="16" /><circle cx="675" cy="270" r="35" fill="#f9cf7c" /><rect x="650" y="255" width="50" height="30" fill="#fffaf3" transform="rotate(-8 675 270)" data-scene-prop="party-invitation" /><path d="M865 220 Q920 290 870 360" fill="none" stroke="#263b4a" strokeWidth="22" data-scene-prop="umbrella" /><path d="M845 220 Q900 170 945 220" fill="#5e87a0" /></>;
    case 'garden-diorama':
      return <><path d="M80 540 Q310 430 520 470 T940 360" fill="none" stroke="#d8b77c" strokeWidth="120" data-scene-prop="garden-path" /><path d="M0 375 Q120 310 220 375 T430 370" fill="none" stroke="#5a8f66" strokeWidth="42" /><path d="M650 430 Q760 360 1000 410" fill="none" stroke="#5a8f66" strokeWidth="44" /><path d="M240 420V370m0 20-20-15m20 8 20-18" stroke="#694739" strokeWidth="10" strokeLinecap="round" data-scene-prop="broken-stem" /><path d="M180 380V255M850 395V260" stroke="#694739" strokeWidth="12" /><circle cx="180" cy="245" r="42" fill="#f9cf7c" /><circle cx="850" cy="250" r="38" fill="#f9cf7c" data-scene-prop="garden-lantern" /></>;
    case 'corridor-diorama':
      return <><path d="M145 145 L330 110 V450 L145 510Z" fill="#a98574" stroke="#694739" strokeWidth="12" /><path d="M855 145 L670 110 V450 L855 510Z" fill="#a98574" stroke="#694739" strokeWidth="12" /><rect x="410" y="135" width="180" height="330" rx="10" fill="#6d493b" stroke="#f3d9aa" strokeWidth="14" data-scene-prop="back-door" /><circle cx="500" cy="300" r="12" fill="#f9cf7c" /><rect x="220" y="190" width="100" height="80" fill="#9bd0d2" stroke="#694739" strokeWidth="9" /><path d="M720 200h80v80h-80" fill="#f8e4bd" stroke="#694739" strokeWidth="9" data-scene-prop="scarf-thread" /></>;
    case 'shed-diorama':
      return <><path d="M180 260 L500 105 L820 260 V540 H180Z" fill="#9a654a" stroke="#694739" strokeWidth="14" data-scene-prop="shed" /><path d="M145 260 L500 75 L855 260" fill="none" stroke="#694739" strokeWidth="32" /><rect x="420" y="300" width="165" height="240" fill="#5d3e35" stroke="#f3d9aa" strokeWidth="12" data-scene-prop="shed-latch" /><circle cx="550" cy="420" r="14" fill="#f9cf7c" /><path d="M250 400h100v55H250z" fill="#fffaf3" opacity=".8" data-scene-prop="hidden-cake" /></>;
    default:
      return null;
  }
}

export function SceneArtwork({ sceneId, hotspots, language, sceneTitle, discoveredHotspotIds, showHints = false, onHotspot }: SceneArtworkProps) {
  return <svg className={`scene-artwork${showHints ? ' inspect-mode' : ''}`} viewBox={SCENE_VIEWBOX} role="group" aria-label={getText(sceneTitle, language)}><rect width="1000" height="620" fill="#f4d7a1" /><path d="M0 425 Q250 365 500 425 T1000 410 V620 H0Z" fill="#b9674b" /><circle cx="110" cy="90" r="48" fill="#fff4c4" opacity=".8" /><text x="500" y="82" textAnchor="middle" className="scene-motif">{getText(sceneTitle, language)}</text>{sceneProps(sceneId)}{hotspots.map((hotspot) => { const discovered = discoveredHotspotIds.includes(hotspot.id); const x = hotspot.placement.x * 1000; const y = hotspot.placement.y * 620; return <g id={`hotspot-marker-${hotspot.id}`} data-hotspot-id={hotspot.id} key={hotspot.id} className={`hotspot ${discovered ? 'is-discovered' : ''} ${showHints && !discovered ? 'is-highlighted' : ''}`}><circle cx={x} cy={y} r="29" className="hotspot-ring" /><circle cx={x} cy={y} r="7" className="hotspot-dot" /><foreignObject x={x - 100} y={y + 34} width="200" height="54"><button id={`hotspot-${hotspot.id}`} data-hotspot-id={hotspot.id} type="button" className="hotspot-button" aria-label={`${getText(hotspot.title, language)}: ${getText(hotspot.description, language)}`} onClick={() => onHotspot(hotspot)}>{getText(hotspot.title, language)}</button></foreignObject></g> })}</svg>
}
