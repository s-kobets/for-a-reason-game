import { useRef, type KeyboardEvent, type ReactNode } from 'react'

interface FocusBoundaryProps { children: ReactNode }

const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

export function FocusBoundary({ children }: FocusBoundaryProps) {
  const boundaryRef = useRef<HTMLDivElement>(null)
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab' || !boundaryRef.current) return
    const focusable = Array.from(boundaryRef.current.querySelectorAll<HTMLElement>(focusableSelector))
      .filter((element) => !element.hasAttribute('disabled') && element.getAttribute('aria-hidden') !== 'true')
    if (!focusable.length) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }
  return <div ref={boundaryRef} onKeyDown={onKeyDown}>{children}</div>
}
