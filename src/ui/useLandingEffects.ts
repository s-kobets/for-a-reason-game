import { useEffect, useRef } from 'react'

/** Pointer parallax + spotlight and scroll reveals for the landing page. Purely decorative. */
export function useLandingEffects() {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
    const targets = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'))
    let io: IntersectionObserver | undefined
    if (!reduce && typeof IntersectionObserver === 'function') {
      root.classList.add('reveal-ready')
      io = new IntersectionObserver((entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io?.unobserve(entry.target) }
      }), { threshold: 0.15 })
      targets.forEach((el) => io?.observe(el))
    }
    let frame = 0
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        root.style.setProperty('--mx', `${event.clientX}px`)
        root.style.setProperty('--my', `${event.clientY}px`)
        root.style.setProperty('--px', `${(event.clientX / window.innerWidth - 0.5).toFixed(3)}`)
        root.style.setProperty('--py', `${(event.clientY / window.innerHeight - 0.5).toFixed(3)}`)
      })
    }
    if (!reduce) window.addEventListener('pointermove', onMove, { passive: true })
    const cards = Array.from(root.querySelectorAll<HTMLElement>('.case-card'))
    const tilt = (event: PointerEvent) => {
      const el = event.currentTarget as HTMLElement
      const r = el.getBoundingClientRect()
      el.style.setProperty('--rx', `${(((event.clientY - r.top) / r.height - 0.5) * -8).toFixed(2)}deg`)
      el.style.setProperty('--ry', `${(((event.clientX - r.left) / r.width - 0.5) * 8).toFixed(2)}deg`)
      el.style.setProperty('--gx', `${event.clientX - r.left}px`)
      el.style.setProperty('--gy', `${event.clientY - r.top}px`)
    }
    const untilt = (event: PointerEvent) => { const el = event.currentTarget as HTMLElement; el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg') }
    if (!reduce) cards.forEach((c) => { c.addEventListener('pointermove', tilt); c.addEventListener('pointerleave', untilt) })
    return () => {
      io?.disconnect()
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      cards.forEach((c) => { c.removeEventListener('pointermove', tilt); c.removeEventListener('pointerleave', untilt) })
      root.classList.remove('reveal-ready')
    }
  }, [])
  return ref
}
