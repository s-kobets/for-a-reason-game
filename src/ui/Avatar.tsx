const skins = ['#f6d3b3', '#e8b98f', '#c98f66', '#f2c9a0']
const hairs = ['#4a3328', '#1f1a17', '#a8642f', '#d6a24a', '#7a3b2e']
const shirts = ['#5e87a0', '#8b5e4b', '#5a8f66', '#c4604a', '#8a6fb0']

function hash(name: string): number {
  return [...name].reduce((sum, char) => (sum * 31 + char.charCodeAt(0)) >>> 0, 7)
}

export function Avatar({ name, mood = 'happy', className }: { name: string; mood?: 'happy' | 'worried'; className?: string }) {
  const h = hash(name)
  const skin = skins[h % skins.length]
  const hair = hairs[(h >> 3) % hairs.length]
  const shirt = shirts[(h >> 6) % shirts.length]
  const longHair = (h >> 9) % 2 === 0
  return <svg className={className} viewBox="0 0 64 64" aria-hidden="true" data-mood={mood}>
    <circle cx="32" cy="32" r="32" fill="#f8e4bd" />
    <path d="M8 64c2-14 12-18 24-18s22 4 24 18z" fill={shirt} />
    {longHair && <rect x="14" y="20" width="36" height="30" rx="12" fill={hair} />}
    <circle cx="32" cy="30" r="14" fill={skin} />
    <path d="M17 29c0-12 8-16 15-16s15 4 15 16c-4-6-9-8-15-8s-11 2-15 8z" fill={hair} />
    <circle cx="26.5" cy="31" r="2.2" fill="#30271f" /><circle cx="37.5" cy="31" r="2.2" fill="#30271f" />
    {mood === 'worried'
      ? <><path d="M23 26l6 2M41 26l-6 2" stroke="#30271f" strokeWidth="1.6" strokeLinecap="round" /><path d="M27 38.5q5-3.5 10 0" fill="none" stroke="#30271f" strokeWidth="1.8" strokeLinecap="round" /></>
      : <path d="M26.5 36q5.5 5 11 0" fill="none" stroke="#30271f" strokeWidth="1.8" strokeLinecap="round" />}
    <circle cx="23" cy="35" r="2" fill="#e88a7a" opacity=".5" /><circle cx="41" cy="35" r="2" fill="#e88a7a" opacity=".5" />
  </svg>
}
