const muteKey = 'reasoning-game:muted'
type Kind = 'clue' | 'win' | 'oops'
let ctx: AudioContext | undefined
let muted = (() => { try { return localStorage.getItem(muteKey) === '1' } catch { return false } })()

export const isMuted = () => muted
export function setMuted(value: boolean) {
  muted = value
  try { localStorage.setItem(muteKey, value ? '1' : '0') } catch { /* storage unavailable */ }
}

const notes: Record<Kind, [number, number][]> = {
  clue: [[660, 0], [880, 0.09]],
  win: [[523, 0], [659, 0.1], [784, 0.2], [1047, 0.3]],
  oops: [[300, 0], [240, 0.12]],
}

export function playSound(kind: Kind) {
  if (muted || typeof window === 'undefined') return
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) return
  try {
    ctx ??= new Ctor()
    const audio = ctx
    for (const [freq, delay] of notes[kind]) {
      const osc = audio.createOscillator()
      const gain = audio.createGain()
      const start = audio.currentTime + delay
      osc.type = kind === 'oops' ? 'triangle' : 'sine'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0.0001, start)
      gain.gain.exponentialRampToValueAtTime(0.18, start + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.22)
      osc.connect(gain).connect(audio.destination)
      osc.start(start)
      osc.stop(start + 0.25)
    }
  } catch { /* audio unavailable */ }
}
