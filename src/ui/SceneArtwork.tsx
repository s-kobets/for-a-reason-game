import type { Hotspot, Language, LocalizedText } from '../case/types'
import { getText } from '../case/translations'

interface SceneArtworkProps { sceneId: string; hotspots: Hotspot[]; language: Language; sceneTitle: LocalizedText; discoveredHotspotIds: string[]; onHotspot(hotspot: Hotspot): void }

function sceneProps(sceneId: string) {
  switch (sceneId) {
    case 'kitchen-diorama':
      return <><rect x="90" y="130" width="280" height="190" rx="12" fill="#9bd0d2" stroke="#694739" strokeWidth="12" data-scene-prop="window" /><path d="M230 130V320M90 225H370" stroke="#694739" strokeWidth="10" /><rect x="500" y="290" width="300" height="34" rx="12" fill="#694739" data-scene-prop="counter" /><path d="M580 290V410M720 290V410" stroke="#694739" strokeWidth="18" /><ellipse cx="650" cy="270" rx="75" ry="18" fill="#fffaf3" stroke="#694739" strokeWidth="8" data-scene-prop="cake-stand" /><path d="M590 270 Q650 205 710 270" fill="#8b5e4b" /><circle cx="650" cy="216" r="10" fill="#f9cf7c" /></>;
    case 'living-room-diorama':
      return <><rect x="120" y="180" width="370" height="145" rx="35" fill="#b97969" stroke="#694739" strokeWidth="10" data-scene-prop="sofa" /><path d="M165 180V135M445 180V135" stroke="#694739" strokeWidth="18" /><rect x="565" y="300" width="220" height="30" rx="10" fill="#694739" data-scene-prop="table" /><path d="M600 330V430M750 330V430" stroke="#694739" strokeWidth="16" /><circle cx="675" cy="270" r="35" fill="#f9cf7c" /><path d="M865 220 Q920 290 870 360" fill="none" stroke="#263b4a" strokeWidth="22" data-scene-prop="umbrella" /><path d="M845 220 Q900 170 945 220" fill="#5e87a0" /></>;
    case 'garden-diorama':
      return <><path d="M80 540 Q310 430 520 470 T940 360" fill="none" stroke="#d8b77c" strokeWidth="120" data-scene-prop="garden-path" /><path d="M0 375 Q120 310 220 375 T430 370" fill="none" stroke="#5a8f66" strokeWidth="42" /><path d="M650 430 Q760 360 1000 410" fill="none" stroke="#5a8f66" strokeWidth="44" /><path d="M180 380V255M850 395V260" stroke="#694739" strokeWidth="12" /><circle cx="180" cy="245" r="42" fill="#f9cf7c" data-scene-prop="lantern" /><circle cx="850" cy="250" r="38" fill="#f9cf7c" /></>;
    case 'corridor-diorama':
      return <><path d="M145 145 L330 110 V450 L145 510Z" fill="#a98574" stroke="#694739" strokeWidth="12" /><path d="M855 145 L670 110 V450 L855 510Z" fill="#a98574" stroke="#694739" strokeWidth="12" /><rect x="410" y="135" width="180" height="330" rx="10" fill="#6d493b" stroke="#f3d9aa" strokeWidth="14" data-scene-prop="back-door" /><circle cx="445" cy="300" r="12" fill="#f9cf7c" /><rect x="220" y="190" width="100" height="80" fill="#9bd0d2" stroke="#694739" strokeWidth="9" /><path d="M720 200h80v80h-80" fill="#f8e4bd" stroke="#694739" strokeWidth="9" /></>;
    case 'shed-diorama':
      return <><path d="M180 260 L500 105 L820 260 V540 H180Z" fill="#9a654a" stroke="#694739" strokeWidth="14" data-scene-prop="shed" /><path d="M145 260 L500 75 L855 260" fill="none" stroke="#694739" strokeWidth="32" /><rect x="420" y="300" width="165" height="240" fill="#5d3e35" stroke="#f3d9aa" strokeWidth="12" data-scene-prop="shed-latch" /><circle cx="550" cy="420" r="14" fill="#f9cf7c" /><path d="M250 400h100v55H250z" fill="#fffaf3" opacity=".8" data-scene-prop="covered-cake" /></>;
    default:
      return null;
  }
}

export function SceneArtwork({ sceneId, hotspots, language, sceneTitle, discoveredHotspotIds, onHotspot }: SceneArtworkProps) {
  return <svg className="scene-artwork" viewBox="0 0 1000 620" role="group" aria-label={getText(sceneTitle, language)}><rect width="1000" height="620" fill="#f4d7a1" /><path d="M0 425 Q250 365 500 425 T1000 410 V620 H0Z" fill="#b9674b" /><circle cx="110" cy="90" r="48" fill="#fff4c4" opacity=".8" /><text x="500" y="82" textAnchor="middle" className="scene-motif">{getText(sceneTitle, language)}</text>{sceneProps(sceneId)}{hotspots.map((hotspot) => { const discovered = discoveredHotspotIds.includes(hotspot.id); const x = hotspot.placement.x * 1000; const y = hotspot.placement.y * 620; return <g id={`hotspot-marker-${hotspot.id}`} data-hotspot-id={hotspot.id} key={hotspot.id} className={`hotspot ${discovered ? 'is-discovered' : ''}`}><circle cx={x} cy={y} r="29" className="hotspot-ring" /><circle cx={x} cy={y} r="7" className="hotspot-dot" /><foreignObject x={x - 100} y={y + 34} width="200" height="54"><button id={`hotspot-${hotspot.id}`} data-hotspot-id={hotspot.id} type="button" className="hotspot-button" aria-label={`${getText(hotspot.title, language)}: ${getText(hotspot.description, language)}`} onClick={() => onHotspot(hotspot)}>{getText(hotspot.title, language)}</button></foreignObject></g> })}</svg>
}
