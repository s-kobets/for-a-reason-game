import type { RefObject } from 'react'
import type { Location, Language } from '../case/types'
import { getText, caseUiText } from '../case/translations'

interface MapPanelProps { locations: Location[]; language: Language; currentLocationId: string; titleId?: string; closeRef?: RefObject<HTMLButtonElement | null>; onSelectLocation(locationId: string): void; onClose?: () => void }

export function MapPanel({ locations, language, currentLocationId, titleId = 'map-title', closeRef, onSelectLocation, onClose }: MapPanelProps) {
  return <section className="map-panel" aria-labelledby={titleId}>{onClose && <button ref={closeRef} className="panel-close-button" type="button" onClick={onClose}>{getText(caseUiText.closeMap, language)}</button>}<div className="panel-title"><h2 id={titleId}>{getText(caseUiText.map, language)}</h2><span>{locations.length}</span></div><div className="map-grid">{locations.map((location) => <button id={`location-${location.id}`} data-location-id={location.id} key={location.id} type="button" className={location.id === currentLocationId ? 'map-location active' : 'map-location'} onClick={() => onSelectLocation(location.id)}><span className="map-pin" aria-hidden="true" />{getText(location.title, language)}</button>)}</div></section>
}
