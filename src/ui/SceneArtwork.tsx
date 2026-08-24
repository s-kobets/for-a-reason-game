import type { Hotspot, Language, LocalizedText } from '../case/types'
import { getText } from '../case/translations'

interface SceneArtworkProps {
  sceneId: string;
  hotspots: Hotspot[];
  language: Language;
  sceneTitle: LocalizedText;
  discoveredHotspotIds: string[];
  onHotspot(hotspot: Hotspot): void;
}

const sceneColors: Record<string, [string, string]> = {
  'kitchen-diorama': ['#f4d7a1', '#b9674b'],
  'living-room-diorama': ['#d7c2a4', '#6d7f73'],
  'garden-diorama': ['#9bc4a1', '#507b62'],
  'corridor-diorama': ['#c7b4a7', '#765a50'],
  'shed-diorama': ['#c39b72', '#755342'],
}

export function SceneArtwork({ sceneId, hotspots, language, sceneTitle, discoveredHotspotIds, onHotspot }: SceneArtworkProps) {
  const [sky, ground] = sceneColors[sceneId] ?? ['#d9c7b4', '#765a50']
  return (
    <svg className="scene-artwork" viewBox="0 0 1000 620" role="group" aria-label={getText(sceneTitle, language)}>
      <rect width="1000" height="620" fill={sky} />
      <path d="M0 405 Q240 340 500 405 T1000 390 V620 H0Z" fill={ground} />
      <path d="M0 120 H1000 M0 180 H1000" stroke="#fff5dc" strokeOpacity=".3" strokeWidth="9" />
      <path d="M90 410 Q500 300 910 410" fill="none" stroke="#f7e6c4" strokeWidth="20" strokeOpacity=".65" />
      <circle cx="120" cy="90" r="48" fill="#fff4c4" opacity=".8" />
      <path d="M120 452 Q150 380 180 452 M820 452 Q850 370 880 452" stroke="#f5d49b" strokeWidth="28" fill="none" strokeLinecap="round" />
      <text x="500" y="82" textAnchor="middle" className="scene-motif">{getText(sceneTitle, language)}</text>
      {hotspots.map((hotspot) => {
        const discovered = discoveredHotspotIds.includes(hotspot.id)
        const x = hotspot.placement.x * 1000
        const y = hotspot.placement.y * 620
        return (
          <g key={hotspot.id} className={`hotspot ${discovered ? 'is-discovered' : ''}`}>
            <circle cx={x} cy={y} r="29" className="hotspot-ring" />
            <circle cx={x} cy={y} r="7" className="hotspot-dot" />
            <foreignObject x={x - 100} y={y + 34} width="200" height="54">
              <button type="button" className="hotspot-button" aria-label={`${getText(hotspot.title, language)}: ${getText(hotspot.description, language)}`} onClick={() => onHotspot(hotspot)}>
                {getText(hotspot.title, language)}
              </button>
            </foreignObject>
          </g>
        )
      })}
    </svg>
  )
}
