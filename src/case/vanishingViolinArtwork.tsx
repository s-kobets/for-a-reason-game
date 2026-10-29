import type { ReactNode } from 'react'

export const vanishingViolinHotspotBounds: Record<string, { x: readonly [number, number]; y: readonly [number, number] }> = {
  'empty-cabinet': { x: [0.34, 0.64], y: [0.35, 0.69] },
  'water-stain': { x: [0.42, 0.58], y: [0.17, 0.31] },
  'cabinet-lock': { x: [0.59, 0.68], y: [0.48, 0.64] },
  'rehearsal-list': { x: [0.71, 0.87], y: [0.25, 0.42] },
  'key-ledger': { x: [0.72, 0.9], y: [0.61, 0.79] },
  'cart-track': { x: [0.26, 0.5], y: [0.7, 0.81] },
  'service-door': { x: [0.73, 0.9], y: [0.36, 0.69] },
  'rosin-mark': { x: [0.42, 0.58], y: [0.55, 0.68] },
  'concert-program': { x: [0.65, 0.82], y: [0.5, 0.68] },
  'empty-stand': { x: [0.34, 0.53], y: [0.42, 0.7] },
  'repair-bench': { x: [0.26, 0.62], y: [0.43, 0.63] },
  'covered-violin': { x: [0.63, 0.84], y: [0.52, 0.76] },
  'workshop-window': { x: [0.67, 0.86], y: [0.2, 0.42] },
  'roof-plan': { x: [0.16, 0.36], y: [0.28, 0.47] },
}


const leaf = (x: number, y: number, s = 1) => <g transform={`translate(${x} ${y}) scale(${s})`}><path d="M-20 0h40l-7 44h-26z" fill="#c4604a" stroke="#694739" strokeWidth="4" /><path d="M0 0c-30-20-30-50-20-64M0 0c0-26 6-48 22-60M0 0c26-10 38-32 34-50" fill="none" stroke="#4f8a5b" strokeWidth="9" strokeLinecap="round" /></g>
const stars = (pts: [number, number][]) => <g fill="#fffbe0" opacity=".85">{pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 3 : 2} />)}</g>

const note = (x: number, y: number, c = '#8a6fb0') => <g fill={c} opacity=".8"><ellipse cx={x} cy={y} rx="9" ry="6.5" transform={`rotate(-20 ${x} ${y})`} /><path d={`M${x + 8} ${y - 2}V${y - 34}q14 4 16 18`} fill="none" stroke={c} strokeWidth="3.5" /></g>
const poster = (x: number, y: number, w: number, h: number, c: string) => <g><rect x={x} y={y} width={w} height={h} fill="#fffaf3" stroke="#685546" strokeWidth="6" /><rect x={x + 8} y={y + 8} width={w - 16} height={h - 16} fill={c} /><path d={`M${x + 14} ${y + h - 22}h${w - 28}`} stroke="#fffaf3" strokeWidth="4" /></g>

function violinDecor(sceneId: string): ReactNode {
  switch (sceneId) {
    case 'music-room': return <>
      <path d="M115 380V290h200v90M115 290l-12-18h224l-12 18" fill="#3a2f2a" stroke="#604b3e" strokeWidth="6" /><rect x="125" y="296" width="180" height="18" fill="#fffaf3" /><path d="M125 304h180" stroke="#30271f" strokeWidth="1.5" strokeDasharray="3 5" /><path d="M140 380v50M290 380v50" stroke="#604b3e" strokeWidth="9" />
      {note(160, 220)}{note(230, 180, '#df6945')}{note(280, 240, '#5e87a0')}
      <path d="M440 105v40" stroke="#694739" strokeWidth="4" /><path d="M418 145h44l-8 22h-28z" fill="#f9cf7c" stroke="#694739" strokeWidth="4" />
      <ellipse cx="500" cy="500" rx="240" ry="30" fill="#8a2f2f" opacity=".5" /><ellipse cx="500" cy="500" rx="180" ry="18" fill="none" stroke="#f9cf7c" strokeWidth="3" strokeDasharray="10 8" opacity=".7" />
      <path d="M85 110V300M135 110V280" stroke="#a8432f" strokeWidth="22" opacity=".0" />{leaf(880, 440, 0.9)}
    </>
    case 'backstage-corridor': return <>
      {poster(140, 150, 62, 86, '#5e87a0')}{poster(222, 150, 62, 86, '#c4604a')}{poster(304, 150, 62, 86, '#5a8f66')}
      <path d="M130 270v-24" stroke="#694739" strokeWidth="5" /><path d="M110 246q20-30 40 0z" fill="#f9cf7c" stroke="#694739" strokeWidth="4" /><path d="M560 130v-24" stroke="#694739" strokeWidth="5" opacity="0" />
      <g stroke="#694739" strokeWidth="5"><path d="M395 140v150M420 140v150M445 140v150" opacity="0" /></g>
      <path d="M150 330h210M150 330v110M360 330v110" stroke="#694739" strokeWidth="7" fill="none" /><path d="M175 330l-6 60h28zM240 330l-4 70h34zM310 330l-6 62h30z" fill="#8a6fb0" opacity=".85" /><path d="M165 330h20" stroke="#694739" strokeWidth="6" />
      <path d="M300 520H700L840 585H160Z" fill="#a8432f" opacity=".8" /><path d="M300 520H700L840 585H160Z" fill="none" stroke="#f9cf7c" strokeWidth="4" strokeDasharray="12 9" opacity=".7" />{note(560, 230, '#df6945')}{note(620, 270)}
    </>
    case 'concert-hall': return <>
      <path d="M80 185V455H150Q120 320 150 190Z" fill="#a8432f" stroke="#6a2a1e" strokeWidth="5" /><path d="M920 185V455H850Q880 320 850 190Z" fill="#a8432f" stroke="#6a2a1e" strokeWidth="5" />
      <path d="M300 75 L250 240 L350 240Z" fill="#fff9d6" opacity=".16" /><path d="M700 75 L650 240 L750 240Z" fill="#fff9d6" opacity=".16" /><g fill="#694739"><rect x="285" y="66" width="30" height="14" rx="4" /><rect x="685" y="66" width="30" height="14" rx="4" /></g>
      {[120, 230, 340, 450, 560, 670, 780].map((x) => <g key={x} fill="#5b2a2a" opacity=".92"><rect x={x} y="545" width="70" height="46" rx="10" /><rect x={x + 6} y="520" width="58" height="34" rx="9" /></g>)}
      {note(500, 150, '#f9cf7c')}{note(560, 180)}{note(470, 230, '#df6945')}
    </>
    case 'instrument-workshop': return <>
      <rect x="360" y="135" width="300" height="130" rx="6" fill="#c9a97e" stroke="#685546" strokeWidth="8" />{[[385, 160], [430, 160], [475, 160], [520, 160], [565, 160], [610, 160]].map(([x, y], i) => <g key={x as number} stroke="#514e49" strokeWidth="5" strokeLinecap="round"><path d={`M${x} ${y}v${[70, 55, 80, 60, 75, 50][i]}`} /></g>)}<g fill="#c4604a"><circle cx="385" cy="240" r="7" /><circle cx="475" cy="240" r="7" /></g>
      <path d="M130 440V300Q150 270 170 300V440M130 330h40" fill="none" stroke="#7a5137" strokeWidth="12" strokeLinecap="round" /><ellipse cx="150" cy="360" rx="34" ry="52" fill="#9a6847" stroke="#604b3e" strokeWidth="6" /><path d="M150 310v100" stroke="#604b3e" strokeWidth="3" />
      <path d="M690 305h155" stroke="#685546" strokeWidth="8" /><rect x="700" y="285" width="20" height="20" fill="#f0e6d0" stroke="#685546" strokeWidth="3" /><rect x="735" y="280" width="18" height="25" fill="#c4604a" /><rect x="770" y="288" width="22" height="17" fill="#5e87a0" />
      <path d="M300 280v-34M280 246q20-22 40 0z" fill="none" stroke="#694739" strokeWidth="4" /><path d="M280 246 Q300 224 320 246Z" fill="#f9cf7c" stroke="#694739" strokeWidth="4" />
      <path d="M240 480q20-8 30 4t-6 14M420 495q18-10 28 3M560 482q18-6 28 6" fill="none" stroke="#d9b98a" strokeWidth="6" strokeLinecap="round" />
    </>
    default: return null
  }
}

export function renderVanishingViolinScene(sceneId: string): ReactNode {
  return <>{renderVanishingViolinProps(sceneId)}<g data-decor={sceneId} pointerEvents="none">{violinDecor(sceneId)}</g></>
}

function renderVanishingViolinProps(sceneId: string): ReactNode {
  switch (sceneId) {
    case 'music-room': return <>
      <rect x="80" y="105" width="840" height="345" rx="18" fill="#eee0c7" stroke="#755d4b" strokeWidth="14" />
      <path d="M80 395H920V520H80Z" fill="#9c775c" /><path d="M140 455H860" stroke="#d2b18b" strokeWidth="12" />
      <rect x="340" y="220" width="300" height="210" rx="12" fill="#9a6847" stroke="#604b3e" strokeWidth="12" data-scene-prop="empty-cabinet" />
      <rect x="365" y="247" width="250" height="150" fill="#ead8b7" stroke="#644d3d" strokeWidth="8" /><path d="M490 250V397" stroke="#644d3d" strokeWidth="7" />
      <circle cx="610" cy="323" r="11" fill="#d9b969" data-scene-prop="cabinet-lock" />
      <path d="M470 105q30 18 60 0t60 0" fill="none" stroke="#6f9caf" strokeWidth="12" data-scene-prop="water-stain" />
      <rect x="710" y="165" width="145" height="92" fill="#fff3d8" stroke="#755d4b" strokeWidth="8" data-scene-prop="rehearsal-list" />
      <path d="M735 192H830M735 216H810M735 239H820" stroke="#9f7555" strokeWidth="7" />
      <rect x="720" y="375" width="145" height="80" rx="8" fill="#a9825e" stroke="#604b3e" strokeWidth="8" data-scene-prop="key-ledger" />
    </>
    case 'backstage-corridor': return <>
      <path d="M95 100H905V450L700 520H300L95 450Z" fill="#d8d1c6" stroke="#635a53" strokeWidth="12" />
      <path d="M95 450H905V530H95Z" fill="#877764" />
      <path d="M245 455q65-24 120 0t120 0" fill="none" stroke="#baa98e" strokeWidth="20" data-scene-prop="cart-track" />
      <rect x="690" y="175" width="170" height="270" fill="#765542" stroke="#4c3e35" strokeWidth="12" data-scene-prop="service-door" />
      <circle cx="820" cy="312" r="11" fill="#e2c77b" />
      <path d="M438 378q16-18 32 0t32 0 32 0" fill="none" stroke="#c39a54" strokeWidth="12" data-scene-prop="rosin-mark" />
      <circle cx="460" cy="397" r="5" fill="#c39a54" /><circle cx="514" cy="393" r="6" fill="#c39a54" />
    </>
    case 'concert-hall': return <>
      <path d="M80 185 500 75 920 185V455H80Z" fill="#e9d8bb" stroke="#755d4b" strokeWidth="14" />
      <path d="M80 390H920V520H80Z" fill="#805b4a" />
      <path d="M160 205V370M840 205V370M160 205H840" stroke="#aa835d" strokeWidth="16" />
      <path d="M425 448V300m0 64q-58-50-65-5m65-30q60-61 74-12m-74 47q-42-30-61 9" fill="none" stroke="#503f38" strokeWidth="13" data-scene-prop="empty-stand" />
      <ellipse cx="425" cy="456" rx="80" ry="16" fill="#57473e" />
      <rect x="660" y="320" width="155" height="86" rx="8" fill="#efe0c2" stroke="#735d4a" strokeWidth="8" data-scene-prop="concert-program" />
      <path d="M685 345H790M685 370H765" stroke="#a37e5b" strokeWidth="7" />
    </>
    case 'instrument-workshop': return <>
      <rect x="85" y="105" width="830" height="350" rx="16" fill="#e1d4bd" stroke="#685546" strokeWidth="14" />
      <path d="M85 425H915V530H85Z" fill="#927456" />
      <rect x="220" y="290" width="420" height="130" rx="10" fill="#9b724f" stroke="#5f4938" strokeWidth="12" data-scene-prop="repair-bench" />
      <path d="M260 420V505M600 420V505" stroke="#5f4938" strokeWidth="22" />
      <path d="M690 160H845V285H690Z" fill="#b8d8d4" stroke="#685546" strokeWidth="10" data-scene-prop="workshop-window" />
      <path d="M768 160V285M690 222H845" stroke="#685546" strokeWidth="7" />
      <rect x="670" y="335" width="150" height="112" rx="32" fill="#b7a187" data-scene-prop="covered-violin" />
      <path d="M728 345q-24 16-11 34l-18 23q17 21 34 3l18-24q20 8 32-13-9-24-33-8-9-18-22-15Z" fill="#7a5137" />
      <rect x="135" y="175" width="205" height="86" fill="#f4e8d0" stroke="#685546" strokeWidth="8" data-scene-prop="roof-plan" />
      <path d="m160 235 55-43 45 35 54-40" fill="none" stroke="#aa7655" strokeWidth="8" />
    </>
    default: return <g data-scene-prop="unknown-room"><rect x="100" y="130" width="800" height="350" rx="18" fill="#e8ddc9" stroke="#75624f" strokeWidth="12" /></g>
  }
}

const reconstructions: Record<string, ReactNode> = {
  'reconstruction-leak': <g data-vignette="leak"><path d="M60 130H430V45H60Z" fill="#ead8b7" stroke="#755d4b" strokeWidth="8" /><path d="M250 50q-18 24 0 42t0 40" fill="none" stroke="#6f9caf" strokeWidth="9" /><path d="M235 145q15-20 30 0" fill="#78a9bb" /></g>,
  'reconstruction-key': <g data-vignette="master-key"><path d="M75 110h270" stroke="#9a6847" strokeWidth="14" /><circle cx="205" cy="110" r="22" fill="none" stroke="#d9b969" strokeWidth="10" /><path d="M205 132v35h22v-13h23" fill="none" stroke="#d9b969" strokeWidth="9" /></g>,
  'reconstruction-cart': <g data-vignette="service-route"><path d="M75 135q55-25 105 0t105 0" fill="none" stroke="#9b8061" strokeWidth="22" /><rect x="300" y="45" width="100" height="100" fill="#765542" /></g>,
  'reconstruction-workshop': <g data-vignette="hidden-violin"><rect x="90" y="90" width="350" height="45" rx="10" fill="#9b724f" /><path d="M250 62q-24 15-10 32l-18 20q17 18 34 2l18-21q20 8 30-12-9-21-31-7-9-16-23-14Z" fill="#7a5137" /></g>,
  'reconstruction-concert': <g data-vignette="return-to-music"><path d="M75 140V45h140v95Z" fill="#b8d8d4" stroke="#685546" strokeWidth="8" /><path d="M285 145V85m0 40q-35-40-60-7m60-8q36-41 62-8" fill="none" stroke="#7a5137" strokeWidth="12" /></g>,
}

export function renderVanishingViolinReconstruction(sceneId: string): ReactNode {
  return reconstructions[sceneId] ?? <g data-vignette="default"><rect x="80" y="40" width="340" height="100" rx="16" fill="#d8c0a5" /><circle cx="250" cy="90" r="28" fill="#9a6847" /></g>
}
