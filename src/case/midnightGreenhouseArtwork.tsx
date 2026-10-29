import type { ReactNode } from 'react'

export const midnightGreenhouseHotspotBounds: Record<string, { x: readonly [number, number]; y: readonly [number, number] }> = {
  orchid: { x: [0.39, 0.62], y: [0.3, 0.62] },
  'warm-pot': { x: [0.65, 0.82], y: [0.58, 0.78] },
  'damp-saucer': { x: [0.35, 0.49], y: [0.72, 0.81] },
  'heater-dial': { x: [0.78, 0.94], y: [0.3, 0.48] },
  'service-lock': { x: [0.7, 0.92], y: [0.63, 0.84] },
  'key-hook': { x: [0.42, 0.6], y: [0.38, 0.52] },
  'frost-chart': { x: [0.3, 0.7], y: [0.3, 0.4] },
  'open-log': { x: [0.72, 0.85], y: [0.5, 0.65] },
  'watering-can': { x: [0.27, 0.43], y: [0.52, 0.68] },
  'silver-soil': { x: [0.55, 0.75], y: [0.66, 0.72] },
  'blue-thread': { x: [0.83, 0.92], y: [0.63, 0.75] },
  'night-window': { x: [0.29, 0.52], y: [0.23, 0.47] },
  'boot-prints': { x: [0.58, 0.8], y: [0.65, 0.76] },
  'boiler-gauge': { x: [0.43, 0.61], y: [0.3, 0.52] },
  'thermos-ring': { x: [0.53, 0.67], y: [0.28, 0.54] },
  'courtyard-lamp': { x: [0.7, 0.8], y: [0.2, 0.32] },
}


const leaf = (x: number, y: number, s = 1) => <g transform={`translate(${x} ${y}) scale(${s})`}><path d="M-20 0h40l-7 44h-26z" fill="#c4604a" stroke="#694739" strokeWidth="4" /><path d="M0 0c-30-20-30-50-20-64M0 0c0-26 6-48 22-60M0 0c26-10 38-32 34-50" fill="none" stroke="#4f8a5b" strokeWidth="9" strokeLinecap="round" /></g>
const stars = (pts: [number, number][]) => <g fill="#fffbe0" opacity=".85">{pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 3 : 2} />)}</g>

function greenhouseDecor(sceneId: string): ReactNode {
  switch (sceneId) {
    case 'conservatory-diorama': return <>
      <circle cx="905" cy="62" r="26" fill="#fff4c4" /><circle cx="916" cy="55" r="22" fill="#d3ead1" opacity=".0" />{stars([[820, 40], [760, 70], [950, 120], [60, 60], [200, 30]])}
      <path d="M170 215 Q330 260 500 215 T830 215" fill="none" stroke="#694739" strokeWidth="3" />{[220, 300, 380, 460, 540, 620, 700, 780].map((x, i) => <circle key={x} cx={x} cy={i % 2 ? 236 : 246} r="7" fill={['#f9cf7c', '#e8c7e8', '#fff4c4'][i % 3]} />)}
      <path d="M130 440H870" stroke="#526b58" strokeWidth="4" opacity=".4" /><path d="M0 520H1000M0 580H1000" stroke="#3f5f45" strokeWidth="2" opacity=".35" />
      {leaf(150, 530, 1.2)}{leaf(870, 540, 1.1)}<ellipse cx="560" cy="540" rx="46" ry="12" fill="#a66b4e" opacity=".7" /><path d="M520 540c-4-30 4-50 10-60M560 540c0-30 8-54 20-66M595 540c6-24 18-40 24-50" fill="none" stroke="#557e56" strokeWidth="8" strokeLinecap="round" />
    </>
    case 'potting-diorama': return <>
      <path d="M140 62V118M190 62V104M240 62V122" stroke="#694739" strokeWidth="3" /><g fill="#6f9a5c"><ellipse cx="140" cy="130" rx="14" ry="22" /><ellipse cx="190" cy="118" rx="12" ry="20" /><ellipse cx="240" cy="134" rx="14" ry="22" /></g>
      <path d="M740 60V110M800 60V96M850 60V116" stroke="#694739" strokeWidth="3" /><g fill="#c4604a"><circle cx="740" cy="120" r="12" /><circle cx="800" cy="106" r="11" /><circle cx="850" cy="126" r="12" /></g>
      <g stroke="#725744" strokeWidth="4"><rect x="60" y="480" width="120" height="14" rx="3" fill="#a8825a" /><rect x="820" y="480" width="120" height="14" rx="3" fill="#a8825a" /></g>
      {[80, 110, 140, 840, 870, 900].map((x, i) => <g key={x}><path d={`M${x - 12} 480l4-26h16l4 26z`} fill={['#c4604a', '#d9a066', '#8a6fb0'][i % 3]} /><circle cx={x} cy="446" r="9" fill="#4f8a5b" /></g>)}
      <path d="M0 540H1000M0 585H1000" stroke="#725744" strokeWidth="2" opacity=".3" />{leaf(500, 560, 0.9)}
    </>
    case 'courtyard-diorama': return <>
      <circle cx="905" cy="75" r="28" fill="#fff4c4" />{stars([[600, 40], [660, 90], [830, 130], [40, 40], [320, 40], [420, 110], [960, 40]])}
      <g stroke="#604d43" strokeWidth="5" fill="#d8c59f">{[540, 570, 600, 630, 660].map((x) => <path key={x} d={`M${x} 392V330l8-12 8 12V392z`} />)}<path d="M530 346H676M530 376H676" fill="none" /></g>
      <g fill="#4f8a5b"><circle cx="50" cy="470" r="34" /><circle cx="95" cy="482" r="28" /><circle cx="22" cy="500" r="24" /></g><g fill="#e0657a"><circle cx="40" cy="462" r="5" /><circle cx="98" cy="474" r="5" /></g>
      <path d="M0 560 Q250 520 500 560 T1000 555 V620H0Z" fill="#4f8a5b" opacity=".4" /><ellipse cx="750" cy="345" rx="120" ry="14" fill="#f5d37a" opacity=".2" />
    </>
    case 'head-office-diorama': return <>
      <circle cx="780" cy="205" r="34" fill="#fffaf3" stroke="#725744" strokeWidth="7" /><path d="M780 205V182M780 205l16 8" stroke="#30271f" strokeWidth="4" strokeLinecap="round" />
      <rect x="140" y="165" width="110" height="170" rx="6" fill="#a8825a" stroke="#725744" strokeWidth="6" />{[200, 255].map((y) => <path key={y} d={`M140 ${y}H250`} stroke="#725744" strokeWidth="5" />)}{[[150, 'c4604a'], [168, '5e87a0'], [186, 'f9cf7c'], [204, '5a8f66'], [222, 'c4604a']].map(([x, c]) => <rect key={x as number} x={x as number} y="176" width="14" height="24" fill={`#${c}`} />)}
      <ellipse cx="500" cy="515" rx="260" ry="40" fill="#8a6fb0" opacity=".45" /><ellipse cx="500" cy="515" rx="190" ry="26" fill="none" stroke="#fffaf3" strokeWidth="3" strokeDasharray="8 8" opacity=".6" />
      {leaf(190, 450, 0.9)}<path d="M860 300V220" stroke="#694739" strokeWidth="7" /><path d="M835 222 Q860 185 885 222Z" fill="#f9cf7c" stroke="#694739" strokeWidth="4" />
    </>
    case 'boiler-diorama': return <>
      <path d="M740 130Q750 100 735 70M780 120Q792 88 775 60" fill="none" stroke="#fffaf3" strokeWidth="14" strokeLinecap="round" opacity=".55" />
      <g fill="#c4604a" stroke="#514e49" strokeWidth="4"><circle cx="840" cy="400" r="14" /><circle cx="150" cy="320" r="14" /></g>
      <g stroke="#514e49" strokeWidth="4"><rect x="60" y="470" width="90" height="70" rx="4" fill="#9a6847" /><rect x="110" y="420" width="80" height="60" rx="4" fill="#b07a52" /><path d="M60 505H150M110 450H190" /></g>
      <path d="M790 540Q840 450 900 480T960 540Z" fill="#30271f" opacity=".85" /><path d="M820 520l8-10M860 500l8-10M900 512l8-10" stroke="#6a6a6a" strokeWidth="4" />
      <path d="M60 180V280M110 180V270" stroke="#694739" strokeWidth="5" /><path d="M45 280h30l-6 24H51zM96 270h28l-5 26H101z" fill="#a8a29a" stroke="#514e49" strokeWidth="3" />
      <rect x="860" y="150" width="70" height="50" rx="6" fill="#f9cf7c" stroke="#514e49" strokeWidth="5" /><path d="M895 160v22M895 188v4" stroke="#514e49" strokeWidth="5" strokeLinecap="round" />
      <path d="M0 560H1000" stroke="#514e49" strokeWidth="2" opacity=".35" /><path d="M300 580h370" stroke="#514e49" strokeWidth="2" strokeDasharray="12 8" opacity=".4" />
    </>
    default: return null
  }
}

export function renderMidnightGreenhouseScene(sceneId: string): ReactNode {
  return <>{renderMidnightGreenhouseProps(sceneId)}<g data-decor={sceneId} pointerEvents="none">{greenhouseDecor(sceneId)}</g></>
}

function renderMidnightGreenhouseProps(sceneId: string): ReactNode {
  switch (sceneId) {
    case 'conservatory-diorama': return <>
      <path d="M110 440V210L500 90 890 210V440Z" fill="#d3ead1" stroke="#526b58" strokeWidth="14" data-scene-prop="glasshouse" />
      <path d="M110 210 500 90 890 210M240 170V440M370 130V440M630 130V440M760 170V440M110 320H890" fill="none" stroke="#78947b" strokeWidth="8" />
      <path d="M420 445V350m0 45q-70-55-92-5m92-20q60-65 96-10m-96 45q-60-30-84 16m84-16q66-35 90 12" fill="none" stroke="#557e56" strokeWidth="18" strokeLinecap="round" data-scene-prop="orchid" />
      <circle cx="420" cy="318" r="45" fill="#e8c7e8" /><circle cx="420" cy="318" r="15" fill="#f5d37a" />
      <ellipse cx="420" cy="470" rx="70" ry="16" fill="#7f9c9d" data-scene-prop="damp-saucer" />
      <ellipse cx="690" cy="475" rx="94" ry="24" fill="#a66b4e" data-scene-prop="warm-pot" />
      <path d="M680 456V384m0 44q-35-38-60-12m60 2q38-42 60-12" fill="none" stroke="#66885a" strokeWidth="12" />
      <circle cx="810" cy="270" r="28" fill="#f5d37a" data-scene-prop="heater-dial" />
    </>
    case 'potting-diorama': return <>
      <rect x="110" y="130" width="780" height="340" rx="18" fill="#dfc79e" stroke="#725744" strokeWidth="14" data-scene-prop="potting-bench" />
      <path d="M150 390H850M220 390V520M780 390V520" stroke="#725744" strokeWidth="22" />
      <path d="M270 320h135l-15 100h-105z" fill="#78947b" data-scene-prop="watering-can" /><path d="M405 336l75-28" stroke="#78947b" strokeWidth="16" />
      <rect x="550" y="205" width="100" height="120" rx="14" fill="#80654b" data-scene-prop="thermos-ring" /><path d="M570 205v-28h60v28" fill="#ad805a" />
      <path d="M555 430q80-20 150 0" fill="none" stroke="#c2b99c" strokeWidth="12" data-scene-prop="silver-soil" />
    </>
    case 'courtyard-diorama': return <>
      <path d="M0 410Q240 350 460 405T1000 380V620H0Z" fill="#66815e" />
      <rect x="155" y="155" width="350" height="245" fill="#b4d6d2" stroke="#604d43" strokeWidth="14" data-scene-prop="night-window" />
      <path d="M330 155V400M155 278H505" stroke="#604d43" strokeWidth="10" />
      <path d="M580 450q55-35 110 0t110 0" fill="none" stroke="#d8c59f" strokeWidth="26" data-scene-prop="boot-prints" />
      <path d="M750 180V340" stroke="#604d43" strokeWidth="14" /><circle cx="750" cy="165" r="35" fill="#f5d37a" />
      <path d="M695 390H920V500H695Z" fill="#8b644d" stroke="#604d43" strokeWidth="10" data-scene-prop="service-lock" />
      <path d="M850 390q-12 20 0 35t-8 30" fill="none" stroke="#6f91a6" strokeWidth="8" data-scene-prop="blue-thread" />
    </>
    case 'head-office-diorama': return <>
      <rect x="120" y="145" width="760" height="300" rx="20" fill="#e9d8b6" stroke="#725744" strokeWidth="14" />
      <rect x="280" y="260" width="440" height="45" rx="12" fill="#8b644d" data-scene-prop="key-hook" />
      <path d="M360 305V445M640 305V445" stroke="#725744" strokeWidth="20" />
      <path d="M300 200h360v40H300z" fill="#fff8df" stroke="#725744" strokeWidth="8" data-scene-prop="frost-chart" />
      <path d="M360 220h50m20 0h70m25 0h65" stroke="#71916e" strokeWidth="9" />
      <rect x="730" y="325" width="100" height="60" rx="8" fill="#c48c58" data-scene-prop="open-log" />
    </>
    case 'boiler-diorama': return <>
      <rect x="260" y="145" width="450" height="350" rx="35" fill="#89918a" stroke="#514e49" strokeWidth="16" data-scene-prop="boiler" />
      <circle cx="485" cy="270" r="74" fill="#e9dfc9" stroke="#514e49" strokeWidth="12" data-scene-prop="boiler-gauge" />
      <path d="M485 270 523 223" stroke="#aa6449" strokeWidth="12" strokeLinecap="round" />
      <path d="M710 220h130v180H710m-450-80H150v150" fill="none" stroke="#b76e4e" strokeWidth="24" />
      <path d="M300 530h370" stroke="#514e49" strokeWidth="20" />
    </>
    default: return null
  }
}

const reconstructions: Record<string, ReactNode> = {
  'reconstruction-frost': <g data-vignette="frost"><path d="M45 135V40h180v95Z" fill="#b4d6d2" stroke="#526b58" strokeWidth="8" /><path d="M130 40v95m-85-48h180" stroke="#526b58" strokeWidth="7" /><path d="M300 140V85m0 30q-35-35-60-5m60 5q35-40 60-5" fill="none" stroke="#66885a" strokeWidth="12" /></g>,
  'reconstruction-key': <g data-vignette="key"><path d="M90 120h270" stroke="#8b644d" strokeWidth="18" /><circle cx="210" cy="120" r="21" fill="none" stroke="#d7b55e" strokeWidth="12" /><path d="M210 141v35h25v-15h22" fill="none" stroke="#d7b55e" strokeWidth="10" /></g>,
  'reconstruction-water': <g data-vignette="water"><path d="M160 135h110l-12-90h-86Z" fill="#78947b" stroke="#526b58" strokeWidth="8" /><path d="m270 65 60-26" stroke="#78947b" strokeWidth="12" /><path d="M450 135V48m0 53q-48-38-70-2m70-4q45-46 70-2" fill="none" stroke="#66885a" strokeWidth="13" /></g>,
  'reconstruction-heat': <g data-vignette="heat"><rect x="165" y="35" width="170" height="110" rx="18" fill="#89918a" stroke="#514e49" strokeWidth="8" /><circle cx="250" cy="90" r="32" fill="#e9dfc9" /><path d="M250 90l19-20" stroke="#aa6449" strokeWidth="8" /><path d="M410 140q-26-38 0-75t0-40m50 115q-26-38 0-75t0-40" fill="none" stroke="#dc9465" strokeWidth="10" /></g>,
  'reconstruction-bloom': <g data-vignette="bloom"><path d="M250 145V85m0 45q-40-45-75-8m75-7q40-45 75-8" fill="none" stroke="#557e56" strokeWidth="14" /><circle cx="250" cy="52" r="33" fill="#e8c7e8" /><circle cx="250" cy="52" r="12" fill="#f5d37a" /><path d="M90 152h320" stroke="#ad805a" strokeWidth="12" /></g>,
}

export function renderMidnightGreenhouseReconstruction(sceneId: string): ReactNode {
  return reconstructions[sceneId] ?? <g data-vignette="default"><rect x="80" y="40" width="340" height="100" rx="16" fill="#d8c0a5" /><circle cx="250" cy="90" r="28" fill="#66885a" /></g>
}
