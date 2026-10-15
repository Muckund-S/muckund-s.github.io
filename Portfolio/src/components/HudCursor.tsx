import { useEffect, useRef, useState } from 'react'

const TARGETS =
  'a, button, [role="button"], summary, label, input, textarea, select'
const NATIVE = 'input, textarea, select'

const pad = (n: number) => String(Math.round(n)).padStart(4, '0')

/**
 * Fighter-jet style reticle that follows the pointer, snaps brackets around
 * interactive elements and shows telemetry. Fine pointers only.
 */
export function HudCursor() {
  const [enabled, setEnabled] = useState(false)
  const ring = useRef<HTMLDivElement>(null)
  const dot = useRef<HTMLDivElement>(null)
  const lock = useRef<HTMLDivElement>(null)
  const readout = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!fine.matches) return
    setEnabled(true)
    document.documentElement.classList.add('hud-cursor')

    let tx = -100
    let ty = -100
    let rx = tx
    let ry = ty
    let lastX = tx
    let lastY = ty
    let heading = 0
    let target: HTMLElement | null = null
    let visible = false
    let raf = 0

    const onMove = (e: PointerEvent) => {
      tx = e.clientX
      ty = e.clientY
      visible = true
      const dx = tx - lastX
      const dy = ty - lastY
      if (dx * dx + dy * dy > 64) {
        heading = (Math.atan2(dx, -dy) * 180) / Math.PI
        if (heading < 0) heading += 360
        lastX = tx
        lastY = ty
      }
      const el = (e.target as Element | null)?.closest<HTMLElement>(TARGETS)
      target = el && !el.matches(NATIVE) ? el : null
      document.documentElement.classList.toggle(
        'hud-native',
        !!el && el.matches(NATIVE),
      )
    }
    const onLeave = () => {
      visible = false
    }
    const onDown = () => {
      const r = ring.current
      if (!r || reduced.matches) return
      r.animate(
        [
          { transform: `translate(${rx}px, ${ry}px) scale(1)` },
          { transform: `translate(${rx}px, ${ry}px) scale(0.6)` },
          { transform: `translate(${rx}px, ${ry}px) scale(1)` },
        ],
        { duration: 220, easing: 'ease-out' },
      )
    }

    const tick = () => {
      const k = reduced.matches ? 1 : 0.22
      rx += (tx - rx) * k
      ry += (ty - ry) * k
      const opacity = visible ? '1' : '0'

      if (dot.current) {
        dot.current.style.transform = `translate(${tx}px, ${ty}px)`
        dot.current.style.opacity = opacity
      }
      if (ring.current) {
        ring.current.style.transform = `translate(${rx}px, ${ry}px)`
        ring.current.style.opacity = target ? '0' : opacity
      }
      if (lock.current) {
        if (target) {
          const b = target.getBoundingClientRect()
          const p = 6
          lock.current.style.transform = `translate(${b.left - p}px, ${b.top - p}px)`
          lock.current.style.width = `${b.width + p * 2}px`
          lock.current.style.height = `${b.height + p * 2}px`
          lock.current.style.opacity = visible ? '1' : '0'
        } else {
          lock.current.style.opacity = '0'
        }
      }
      if (readout.current) {
        readout.current.style.transform = `translate(${rx + 22}px, ${ry + 22}px)`
        readout.current.style.opacity = opacity
        readout.current.textContent = `${target ? 'LOCK ' : ''}X${pad(tx)} Y${pad(ty)} HDG${pad(heading).slice(1)}°`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerdown', onDown)
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      document.documentElement.classList.remove('hud-cursor', 'hud-native')
    }
  }, [])

  if (!enabled) return null

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[9999]">
      <div
        ref={ring}
        className="absolute left-0 top-0 opacity-0 will-change-transform"
      >
        <div className="hud-ring -ml-4 -mt-4 h-8 w-8" />
      </div>
      <div ref={dot} className="absolute left-0 top-0 opacity-0">
        <div className="-ml-[2px] -mt-[2px] h-1 w-1 rounded-full bg-burn-500" />
      </div>
      <div
        ref={lock}
        className="hud-lock absolute left-0 top-0 opacity-0 transition-[width,height,opacity] duration-150 ease-out"
      />
      <div
        ref={readout}
        className="label absolute left-0 top-0 whitespace-nowrap text-[10px] text-burn-400 opacity-0"
      />
    </div>
  )
}
