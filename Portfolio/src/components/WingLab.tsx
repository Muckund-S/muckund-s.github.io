import { Link } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'

/**
 * Scroll-driven potential-flow band: a cambered Joukowski airfoil with the Kutta
 * condition. Air streams across the full width of the page; as the visitor
 * scrolls through the (pinned) section the angle of attack rises. Particles are
 * advected through the exact analytic velocity field. Potential flow has no
 * separation or drag, so this shows streamlines and lift, not stall.
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
const AOA_START = 0
const AOA_END = 16

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

export function WingLab() {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [aoa, setAoa] = useState(AOA_START)

  const cl = liftCoefficient(aoa)
  const atDesign = Math.abs(aoa - DESIGN_AOA) < 0.35

  useEffect(() => {
    const section = sectionRef.current
    const canvas = canvasRef.current
    if (!section || !canvas) return
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
    let halfH = 2.5
    let target = AOA_START
    let current = AOA_START
    let shown = AOA_START
    let visible = false
    let raf = 0
    let staticTimer = 0
    const particles: Particle[] = []

    // 0 before the section pins, 1 once it is about to scroll away.
    const readScroll = () => {
      const rect = section.getBoundingClientRect()
      const pinTop = (window.innerHeight - canvas.clientHeight) / 2
      const travel = rect.height - canvas.clientHeight
      const p = clamp((pinTop - rect.top) / Math.max(1, travel), 0, 1)
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
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      // Wing centred on the page, nudged up so the numbers fit underneath it
      scale = Math.min(w / (w >= 1024 ? 9 : 6.2), h / 4.8)
      cx = w / 2
      cy = h * 0.42
      worldL = cx / scale
      worldR = (w - cx) / scale
      halfH = Math.max(cy, h - cy) / scale
      const count = clamp(Math.round((w * h) / 1500), 360, 1300)
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
        const v = velocity(p.x * ca - p.y * sa, p.x * sa + p.y * ca, a)
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
      const pts = outline.map(([x, y]) => toScreen(x * ca + y * sa, -x * sa + y * ca))
      ctx.beginPath()
      pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)))
      ctx.closePath()
      ctx.fillStyle = 'rgba(5,8,14,0.97)'
      ctx.fill()
      ctx.lineWidth = 2
      ctx.strokeStyle = 'rgba(238,241,246,0.8)'
      ctx.stroke()

      const c = liftCoefficient(current)
      const [ax, ay] = toScreen(-0.9 * ca, 0.9 * sa)
      const len = Math.min(Math.max(0, c) * scale * 0.8, h * 0.34)
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

    const syncReadout = () => {
      const r = Math.round(current * 10) / 10
      if (r !== shown) {
        shown = r
        setAoa(r)
      }
    }

    const frame = () => {
      raf = requestAnimationFrame(frame)
      if (!visible) return
      readScroll()
      current += (target - current) * 0.12
      ctx.globalCompositeOperation = 'destination-out'
      ctx.fillStyle = 'rgba(0,0,0,0.14)'
      ctx.fillRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'source-over'
      step(0.06)
      drawParticles()
      drawBody()
      syncReadout()
    }

    const renderStatic = () => {
      readScroll()
      current = target
      ctx.clearRect(0, 0, w, h)
      for (let i = 0; i < 170; i++) {
        step(0.06)
        drawParticles()
      }
      drawBody()
      syncReadout()
    }

    const onScroll = () => {
      if (!reduced) return
      window.clearTimeout(staticTimer)
      staticTimer = window.setTimeout(renderStatic, 120)
    }
    const onResize = () => {
      resize()
      if (reduced) renderStatic()
    }

    resize()
    readScroll()
    current = target
    if (reduced) renderStatic()
    else raf = requestAnimationFrame(frame)

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(section)

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(staticTimer)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      io.disconnect()
    }
  }, [])

  return (
    <section ref={sectionRef} className="relative h-[200vh]" aria-label="Airflow around a wing at a rising angle of attack">
      <div className="sticky top-[10vh] h-[80vh] min-h-[460px] w-full">
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full [mask-image:linear-gradient(to_bottom,transparent,#000_16%,#000_84%,transparent)]"
        />

        {/* Numbers sit bottom-centre, no box around them */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[4%] px-6 text-center">
          <div className="flex items-end justify-center gap-10 sm:gap-16">
            <div>
              <p className="text-sm text-steel-400">Angle of attack</p>
              <p className="display text-5xl font-extrabold text-white">{aoa.toFixed(1)}°</p>
            </div>
            <div>
              <p className="text-sm text-steel-400">Lift coefficient (idealised)</p>
              <p className="display text-5xl font-bold text-sky-400">{cl.toFixed(2)}</p>
            </div>
          </div>
          <p
            className={`mx-auto mt-4 max-w-md text-xs leading-snug ${atDesign ? 'text-burn-400' : 'text-steel-400'}`}
          >
            {atDesign
              ? 'MX-01 wing incidence (2.3°).'
              : 'Idealised flow: no drag or stall, so lift keeps climbing. Real wings stall.'}
          </p>
          <p className="pointer-events-auto mt-2 text-xs text-steel-400">
            Keep scrolling to pitch the wing up.{' '}
            <Link
              to="/projects/$slug"
              params={{ slug: 'rc-aircraft' }}
              className="text-sky-400 hover:text-white"
            >
              MX-01 write-up →
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
