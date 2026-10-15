import { useEffect, useRef, useState } from 'react'
import { useRouterState } from '@tanstack/react-router'

/** Altitude readout tops out at the Polaris record (Waterloo Rocketry, Launch Canada 2026). */
const RECORD_FT = 63497

function routeLabel(raw: string) {
  // The prerendered HTML sees '/projects/' and the client sees '/projects'; normalize so they agree.
  const path = raw.replace(/\/+$/, '') || '/'
  if (path === '/') return '01 · HOME'
  if (path === '/projects') return 'PROJECTS'
  if (path.startsWith('/projects/')) return 'PROJECT FILE'
  if (path.startsWith('/resume')) return 'EXPERIENCE'
  if (path.startsWith('/contact')) return 'CONTACT'
  return 'PORTFOLIO'
}

const pad = (n: number, w: number) => String(Math.max(0, Math.round(n))).padStart(w, '0')

/** Crosshair ring + dot that follow the mouse. Desktop, fine pointer, motion allowed only. */
function HudCursor() {
  const ring = useRef<HTMLDivElement>(null)
  const dot = useRef<HTMLDivElement>(null)
  const read = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine) and (hover: hover)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduce) return
    const root = document.documentElement
    root.classList.add('hud-cursor')

    let x = -100
    let y = -100
    let rx = -100
    let ry = -100
    let raf = 0

    const loop = () => {
      rx += (x - rx) * 0.22
      ry += (y - ry) * 0.22
      if (Math.abs(x - rx) < 0.05 && Math.abs(y - ry) < 0.05) {
        raf = requestAnimationFrame(loop)
        return
      }
      if (ring.current) ring.current.style.transform = `translate(${rx}px, ${ry}px)`
      if (read.current) read.current.style.transform = `translate(${rx}px, ${ry}px)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      x = e.clientX
      y = e.clientY
      root.classList.add('hud-live')
      if (dot.current) dot.current.style.transform = `translate(${x}px, ${y}px)`
      if (read.current) read.current.textContent = `X ${pad(x, 4)}  Y ${pad(y, 4)}`
      const t = e.target as Element | null
      const over = !!t?.closest('a, button, [role="button"], summary, select, label')
      ring.current?.classList.toggle('is-link', over)
    }
    const onLeave = () => root.classList.remove('hud-live')

    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)
    window.addEventListener('blur', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('blur', onLeave)
      root.classList.remove('hud-cursor', 'hud-live')
    }
  }, [])

  return (
    <>
      <div ref={ring} className="hud-ring" aria-hidden="true" />
      <div ref={dot} className="hud-dot" aria-hidden="true" />
      <div ref={read} className="hud-read" aria-hidden="true" />
    </>
  )
}

/** Corner brackets and telemetry: altitude follows scroll, waypoint follows the section on screen. */
function CockpitFrame() {
  const path = useRouterState({ select: (s) => s.location.pathname })
  const [alt, setAlt] = useState(0)
  const [wp, setWp] = useState(routeLabel(path))
  const [t, setT] = useState(0)
  const [ir, setIr] = useState(false)

  useEffect(() => {
    const start = Date.now()
    const id = window.setInterval(() => setT(Math.floor((Date.now() - start) / 1000)), 1000)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      setAlt(Math.round(p * RECORD_FT))
      let label = ''
      document.querySelectorAll<HTMLElement>('[data-waypoint]').forEach((el) => {
        if (el.getBoundingClientRect().top <= window.innerHeight * 0.4) label = el.dataset.waypoint ?? label
      })
      setWp(label || routeLabel(path))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [path])

  // Press I to toggle the infrared / thermal palette.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== 'i' || e.metaKey || e.ctrlKey || e.altKey) return
      const el = e.target as HTMLElement | null
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) return
      const on = document.documentElement.classList.toggle('ir')
      setIr(on)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const mm = pad(Math.floor(t / 60), 2)
  const ss = pad(t % 60, 2)

  return (
    <div className="hud-frame" aria-hidden="true">
      <span className="hud-corner tl" />
      <span className="hud-corner tr" />
      <span className="hud-corner bl" />
      <span className="hud-corner br" />
      <div className="hud-tele tl">
        MX-SHARMA // SYS <b>{ir ? 'THERMAL' : 'NOMINAL'}</b> · [I] IR
      </div>
      <div className="hud-tele tr">
        T+<b>{mm}:{ss}</b>
      </div>
      <div className="hud-tele bl">
        ALT <b>{alt.toLocaleString('en-US')}</b> FT
      </div>
      <div className="hud-tele br">
        WPT <b>{wp}</b>
      </div>
    </div>
  )
}

/** The boot overlay itself is static HTML in the root shell; this only lets people skip it. */
function BootGate() {
  useEffect(() => {
    const root = document.documentElement
    if (!root.classList.contains('booting')) return
    const boot = document.getElementById('boot')
    const finish = () => {
      root.classList.remove('booting')
      boot?.classList.add('is-done')
      window.removeEventListener('keydown', finish)
      window.removeEventListener('pointerdown', finish)
    }
    const timer = window.setTimeout(finish, 2500)
    window.addEventListener('keydown', finish)
    window.addEventListener('pointerdown', finish)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('keydown', finish)
      window.removeEventListener('pointerdown', finish)
    }
  }, [])
  return null
}

export function Hud() {
  return (
    <>
      <HudCursor />
      <CockpitFrame />
      <BootGate />
    </>
  )
}
