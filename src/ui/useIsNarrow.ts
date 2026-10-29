import { useEffect, useState } from 'react'

const query = '(max-width: 900px)'

export function useIsNarrow(): boolean {
  const supported = typeof window !== 'undefined' && typeof window.matchMedia === 'function'
  const [narrow, setNarrow] = useState(() => supported && window.matchMedia(query).matches)
  useEffect(() => {
    if (!supported) return
    const media = window.matchMedia(query)
    const update = () => setNarrow(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [supported])
  return narrow
}
