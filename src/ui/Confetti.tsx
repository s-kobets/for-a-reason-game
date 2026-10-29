import { useMemo } from 'react'

const colors = ['#f9cf7c', '#df6945', '#5a8f66', '#5e87a0', '#8a6fb0', '#fffaf3']

export function Confetti({ burst }: { burst: number }) {
  const pieces = useMemo(() => Array.from({ length: 36 }, (_, i) => ({
    left: Math.random() * 100, delay: Math.random() * 0.4, drift: Math.random() * 160 - 80, spin: Math.random() * 720 - 360, color: colors[i % colors.length],
  })), [burst])
  if (!burst) return null
  return <div className="confetti" key={burst} aria-hidden="true">{pieces.map((p, i) => <span key={i} style={{ left: `${p.left}%`, background: p.color, animationDelay: `${p.delay}s`, ['--drift' as string]: `${p.drift}px`, ['--spin' as string]: `${p.spin}deg` }} />)}</div>
}
