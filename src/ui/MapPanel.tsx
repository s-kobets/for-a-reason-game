import type { RefObject } from 'react'
import type { Hotspot, Location, Language } from '../case/types'
import { getText, caseUiText } from '../case/translations'

interface MapPanelProps { locations: Location[]; hotspots: Hotspot[]; discoveredHotspotIds: string[]; language: Language; currentLocationId: string; titleId?: string; closeRef?: RefObject<HTMLButtonElement | null>; onSelectLocation(locationId: string): void; onClose?: () => void }

export function MapPanel({ locations, hotspots, discoveredHotspotIds, language, currentLocationId, titleId = 'map-title', closeRef, onSelectLocation, onClose }: MapPanelProps) {
  return <section className="map-panel" aria-labelledby={titleId}>{onClose && <button ref={closeRef} className="panel-close-button" type="button" onClick={onClose}>{getText(caseUiText.closeMap, language)}</button>}<div className="panel-title"><h2 id={titleId}>{getText(caseUiText.map, language)}</h2><span>{locations.length}</span></div><div className="map-grid">{locations.map((location) => { const clues = hotspots.filter((hotspot) => hotspot.locationId === location.id && !hotspot.decorative); const found = clues.filter((hotspot) => discoveredHotspotIds.includes(hotspot.id)).length; const complete = clues.length > 0 && found === clues.length; return <button id={`location-${location.id}`} data-location-id={location.id} key={location.id} type="button" className={`${location.id === currentLocationId ? 'map-location active' : 'map-location'}${complete ? ' complete' : ''}`} onClick={() => onSelectLocation(location.id)}><span className="map-pin" aria-hidden="true" /><span>{getText(location.title, language)}<small>{found} / {clues.length} {getText(caseUiText.clues, language)}</small></span></button> })}</div></section>
}
