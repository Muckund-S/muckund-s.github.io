import { Link } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'

/**
 * Full-page potential-flow backdrop: a cambered Joukowski airfoil with the Kutta
 * condition. Scroll position sets the angle of attack; particles are advected
 * through the exact analytic velocity field. Potential flow has no separation
 * or drag, so this shows streamlines and lift, not stall.
 */

// Circle in the zeta plane that maps to the airfoil under z = zeta + 1/zeta.
const MX = -0.09
const MY = 0.05
const R = Math.hypot(1 - MX, MY)
const BETA = Math.atan2(MY, 1 - MX)

// Airfoil outline in the body frame, and its chord.
const outline: [number, number][] = []
for (let i = 0; i <= 180; i++) {
  const t = (i / 180) * Math.PI * 2
  const zr = MX + R * Math.cos(t)
  const zi = MY + R * Math.sin(t)
  const d = zr * zr + zi * zi
  outline.push([zr + zr / d, zi - zi / d])
}
const CHORD =
  Math.max(...outline.map((p) => p[0])) - Math.min(...outline.map((p) => p[0]))

const DESIGN_AOA = 2.26 // MX-01 wing incidence (2.26° in the Fluent sweep, about 2.3°)
const AOA_START = 0 // top of the page
const AOA_END = 16 // bottom of the page

/** Lift coefficient from the Kutta-Joukowski theorem (U = 1). */
function liftCoefficient(aoaDeg: number) {
  const a = (aoaDeg * Math.PI) / 180
  const gamma = 4 * Math.PI * R * Math.sin(a + BETA)
  return (2 * gamma) / CHORD
}

/** Velocity (body frame) at a point for flow at angle `a`; null inside the body. */
function velocity(x: number, y: number, a: number): [number, number] | null {
  // Invert z = zeta + 1/zeta: pick the root outside the unit circle.
  const zr2 = x * x - y * y - 4
  const zi2 = 2 * x * y
  const mod = Math.hypot(zr2, zi2)
  let sr = Math.sqrt((mod + zr2) / 2)
  let si = Math.sqrt(Math.max(0, (mod - zr2) / 2))
  if (zi2 < 0) si = -si
  let ar = (x + sr) / 2
  let ai = (y + si) / 2
  const br = (x - sr) / 2
  const bi = (y - si) / 2
  if (br * br + bi * bi > ar * ar + ai * ai) {
    ar = br
    ai = bi
  }
  const pr = ar - MX
  const pi = ai - MY
  const p2 = pr * pr + pi * pi
  if (p2 < R * R) return null

  const gamma = 4 * Math.PI * R * Math.sin(a + BETA)
  const ca = Math.cos(a)
  const sa = Math.sin(a)
  // 1/p' and 1/p'^2
  const ir = pr / p2
  const ii = -pi / p2
  const i2r = ir * ir - ii * ii
  const i2i = 2 * ir * ii
  // dw/dzeta = e^{-ia} - R^2 e^{ia}/p'^2 + i*gamma/(2*pi*p')
  const wr =
    ca - R * R * (ca * i2r - sa * i2i) + (-gamma * ii) / (2 * Math.PI)
  const wi =
    -sa - R * R * (ca * i2i + sa * i2r) + (gamma * ir) / (2 * Math.PI)
  // dz/dzeta = 1 - 1/zeta^2
  const zeta2r = ar * ar - ai * ai
  const zeta2i = 2 * ar * ai
  const z2 = zeta2r * zeta2r + zeta2i * zeta2i
  const dzr = 1 - zeta2r / z2
  const dzi = zeta2i / z2
  const dz2 = dzr * dzr + dzi * dzi
  if (dz2 < 1e-6) return [0, 0]
  const fr = (wr * dzr + wi * dzi) / dz2
  const fi = (wi * dzr - wr * dzi) / dz2
  // dw/dz = u - iv
  return [fr, -fi]
}

type Particle = { x: number; y: number; px: number; py: number; life: number }

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

export function WingBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const aoaRef = useRef<HTMLSpanElement>(null)
  const clRef = useRef<HTMLSpanElement>(null)
  const markerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let w = 0
    let h = 0
    let scale = 1
    let cx = 0
    let cy = 0
    let worldL = 4
    let worldR = 4
    let halfH = 3
    let target = AOA_START
    let current = AOA_START
    let visible = true
    let raf = 0
    const particles: Particle[] = []

    const readScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      const p = clamp(window.scrollY / max, 0, 1)
      target = AOA_START + p * (AOA_END - AOA_START)
    }

    const spawn = (p: Particle, anywhere: boolean) => {
      p.x = anywhere ? -worldL - 0.4 + Math.random() * (worldL + worldR + 0.8) : -worldL - 0.4
      p.y = (Math.random() - 0.5) * 2 * (halfH + 0.6)
      p.px = p.x
      p.py = p.y
      p.life = 0
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const wide = w >= 1024
      // On wide screens the wing sits in the right-hand column, clear of the text.
      scale = wide ? Math.min(w / 10, h / 5) : Math.min(w / 6.2, h / 4.6)
      cx = wide ? w * 0.74 : w / 2
      cy = h / 2
      worldL = cx / scale
      worldR = (w - cx) / scale
      halfH = h / 2 / scale
      const count = clamp(Math.round((w * h) / 1900), 320, 1200)
      particles.length = 0
      for (let i = 0; i < count; i++) {
        const p = { x: 0, y: 0, px: 0, py: 0, life: 0 }
        spawn(p, true)
        particles.push(p)
      }
    }

    const toScreen = (X: number, Y: number): [number, number] => [
      cx + X * scale,
      cy - Y * scale,
    ]

    const speedColor = (q: number) => {
      // slow = deep blue, free-stream = light blue, fast = warm orange/red
      if (q < 1) {
        const t = Math.max(0, q)
        return `rgba(${Math.round(40 + 120 * t)},${Math.round(90 + 120 * t)},255,0.7)`
      }
      const t = Math.min(1, (q - 1) / 0.9)
      return `rgba(${Math.round(160 + 90 * t)},${Math.round(210 - 130 * t)},${Math.round(255 - 215 * t)},0.85)`
    }

    const step = (dt: number) => {
      const a = (current * Math.PI) / 180
      const ca = Math.cos(a)
      const sa = Math.sin(a)
      for (const p of particles) {
        p.px = p.x
        p.py = p.y
        // flow frame -> body frame
        const bx = p.x * ca - p.y * sa
        const by = p.x * sa + p.y * ca
        const v = velocity(bx, by, a)
        if (!v) {
          spawn(p, false)
          continue
        }
        let [u, vv] = v
        const sp = Math.hypot(u, vv)
        if (sp > 4) {
          u = (u / sp) * 4
          vv = (vv / sp) * 4
        }
        // body frame -> flow frame
        p.x += (u * ca + vv * sa) * dt
        p.y += (-u * sa + vv * ca) * dt
        p.life += dt
        if (p.x > worldR + 0.6 || Math.abs(p.y) > halfH + 1.5 || p.life > 40) {
          spawn(p, false)
        }
      }
    }

    const drawParticles = () => {
      const a = (current * Math.PI) / 180
      const ca = Math.cos(a)
      const sa = Math.sin(a)
      ctx.lineWidth = 1.5
      ctx.lineCap = 'round'
      for (const p of particles) {
        if (p.life === 0) continue
        const v = velocity(p.x * ca - p.y * sa, p.x * sa + p.y * ca, a)
        const q = v ? Math.hypot(v[0], v[1]) : 1
        const [x0, y0] = toScreen(p.px, p.py)
        const [x1, y1] = toScreen(p.x, p.y)
        ctx.strokeStyle = speedColor(q)
        ctx.beginPath()
        ctx.moveTo(x0, y0)
        ctx.lineTo(x1, y1)
        ctx.stroke()
      }
    }

    const drawBody = () => {
      const a = (current * Math.PI) / 180
      const ca = Math.cos(a)
      const sa = Math.sin(a)
      // body frame -> flow frame (rotate by -a)
      const pts = outline.map(([x, y]) => toScreen(x * ca + y * sa, -x * sa + y * ca))
      ctx.beginPath()
      pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)))
      ctx.closePath()
      ctx.fillStyle = 'rgba(6,10,18,0.96)'
      ctx.fill()
      ctx.lineWidth = 2
      ctx.strokeStyle = 'rgba(238,241,246,0.8)'
      ctx.stroke()

      // lift arrow, perpendicular to the free stream
      const c = liftCoefficient(current)
      const [ax, ay] = toScreen(-0.9 * ca, 0.9 * sa)
      const len = Math.min(Math.max(0, c) * scale * 0.7, h * 0.3)
      if (len > 6) {
        ctx.strokeStyle = '#f0452d'
        ctx.fillStyle = '#f0452d'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(ax, ay)
        ctx.lineTo(ax, ay - len)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(ax, ay - len - 9)
        ctx.lineTo(ax - 6, ay - len + 2)
        ctx.lineTo(ax + 6, ay - len + 2)
        ctx.closePath()
        ctx.fill()
      }
    }

    const updateHud = () => {
      if (aoaRef.current) aoaRef.current.textContent = `${current.toFixed(1)}°`
      if (clRef.current) clRef.current.textContent = liftCoefficient(current).toFixed(2)
      if (markerRef.current) {
        const f = (current - AOA_START) / (AOA_END - AOA_START)
        markerRef.current.style.top = `${clamp(f, 0, 1) * 100}%`
      }
    }

    const frame = () => {
      raf = requestAnimationFrame(frame)
      if (!visible) return
      current += (target - current) * 0.1
      ctx.globalCompositeOperation = 'destination-out'
      ctx.fillStyle = 'rgba(0,0,0,0.14)'
      ctx.fillRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'source-over'
      step(0.06)
      drawParticles()
      drawBody()
      updateHud()
    }

    let staticTimer = 0
    const renderStatic = () => {
      current = target
      ctx.clearRect(0, 0, w, h)
      for (let i = 0; i < 160; i++) {
        step(0.06)
        drawParticles()
      }
      drawBody()
      updateHud()
    }

    const onScroll = () => {
      readScroll()
      if (reduced) {
        window.clearTimeout(staticTimer)
        staticTimer = window.setTimeout(renderStatic, 120)
      }
    }
    const onResize = () => {
      resize()
      readScroll()
      if (reduced) renderStatic()
    }

    resize()
    readScroll()
    current = target
    if (reduced) {
      renderStatic()
    } else {
      raf = requestAnimationFrame(frame)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    const onVis = () => (visible = !document.hidden)
    document.addEventListener('visibilitychange', onVis)

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(staticTimer)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  const designPos = ((DESIGN_AOA - AOA_START) / (AOA_END - AOA_START)) * 100

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 h-screen w-screen opacity-60 lg:opacity-95"
      />

      {/* Gauge: the angle of attack follows the page scroll */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed right-5 top-[22vh] z-30 hidden h-[56vh] sm:block"
      >
        <div className="absolute inset-y-0 right-0 w-px bg-white/20" />
        {[0, 5, 10, 15].map((v) => (
          <div
            key={v}
            className="absolute right-0 flex -translate-y-1/2 items-center gap-2 text-[11px] text-steel-400"
            style={{ top: `${((v - AOA_START) / (AOA_END - AOA_START)) * 100}%` }}
          >
            {v}°<span className="h-px w-2 bg-white/30" />
          </div>
        ))}
        <div
          className="absolute right-0 flex -translate-y-1/2 items-center gap-2 text-[11px] font-medium text-burn-400"
          style={{ top: `${designPos}%` }}
        >
          MX-01 2.26°<span className="h-px w-3 bg-burn-400" />
        </div>
        <div
          ref={markerRef}
          className="absolute -right-[5px] h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-sky-400 shadow-[0_0_12px_2px_rgba(124,196,255,0.7)]"
          style={{ top: 0 }}
        />
      </div>

      <div className="fixed right-3 top-[74px] z-30 max-w-[260px] rounded-xl border border-white/10 bg-ink-950/75 p-2.5 backdrop-blur-md lg:bottom-6 lg:right-14 lg:top-auto lg:p-4">
        <div className="flex items-baseline gap-5">
          <div>
            <p className="text-[11px] text-steel-400">Angle of attack</p>
            <p className="display text-xl font-extrabold text-white lg:text-2xl">
              <span ref={aoaRef}>0.0°</span>
            </p>
          </div>
          <div>
            <p className="text-[11px] text-steel-400">Lift coeff.</p>
            <p className="display text-xl font-bold text-sky-400 lg:text-2xl">
              <span ref={clRef}>0.00</span>
            </p>
          </div>
        </div>
        <p className="mt-2 hidden text-[11px] leading-snug text-steel-400 sm:block">
          Scroll to pitch the wing. Idealised flow model (no drag or stall); the
          real analysis is the{' '}
          <Link
            to="/projects/$slug"
            params={{ slug: 'rc-aircraft' }}
            className="pointer-events-auto text-sky-400 hover:text-white"
          >
            MX-01 CFD
          </Link>
          .
        </p>
      </div>
    </>
  )
}
