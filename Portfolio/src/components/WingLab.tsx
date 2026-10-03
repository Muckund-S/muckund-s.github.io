import { Link } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'

/**
 * Potential-flow demo: a cambered Joukowski airfoil with the Kutta condition.
 * The visitor sets the angle of attack; particles are advected through the exact
 * analytic velocity field. Potential flow has no separation or drag, so this
 * shows streamlines and lift, not stall.
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
const AOA_MIN = -4
const AOA_MAX = 16

// XFLR5 results for the MX-01 wing (Re ~ 100k, 10 m/s lifting-line run).
const XFLR5 = {
  aoa: [0, 2, 4, 6, 8],
  cl: [0.231, 0.411, 0.574, 0.728, 0.873],
  ld: [10.2, 14.1, 15.0, 14.5, 13.3],
}

function interp(xs: number[], ys: number[], x: number): number | null {
  if (x < xs[0] || x > xs[xs.length - 1]) return null
  for (let i = 0; i < xs.length - 1; i++) {
    if (x <= xs[i + 1]) {
      const t = (x - xs[i]) / (xs[i + 1] - xs[i])
      return ys[i] + t * (ys[i + 1] - ys[i])
    }
  }
  return null
}

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

const VIEW_W = 9
const VIEW_H = 4.4

const PRESETS: [number, string][] = [
  [0, '0°'],
  [DESIGN_AOA, '2.26° MX-01'],
  [4, '4° peak L/D'],
  [8, '8°'],
  [15, '15°'],
]

export function WingLab() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const targetRef = useRef(DESIGN_AOA)
  const redrawRef = useRef<(() => void) | null>(null)
  const [aoa, setAoa] = useState(DESIGN_AOA)

  const cl = liftCoefficient(aoa)
  const xCl = interp(XFLR5.aoa, XFLR5.cl, aoa)
  const xLd = interp(XFLR5.aoa, XFLR5.ld, aoa)
  const atDesign = Math.abs(aoa - DESIGN_AOA) < 0.35

  useEffect(() => {
    targetRef.current = aoa
    redrawRef.current?.()
  }, [aoa])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let w = 0
    let h = 0
    let scale = 1
    let current = targetRef.current
    let visible = true
    let raf = 0
    const particles: Particle[] = []

    const spawn = (p: Particle, anywhere: boolean) => {
      p.x = anywhere ? (Math.random() - 0.5) * VIEW_W * 1.2 : -VIEW_W * 0.62
      p.y = (Math.random() - 0.5) * VIEW_H * 1.3
      p.px = p.x
      p.py = p.y
      p.life = 0
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      w = rect.width
      h = rect.height
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      scale = Math.min(w / VIEW_W, h / VIEW_H)
      const count = w < 640 ? 360 : 700
      particles.length = 0
      for (let i = 0; i < count; i++) {
        const p = { x: 0, y: 0, px: 0, py: 0, life: 0 }
        spawn(p, true)
        particles.push(p)
      }
    }

    const toScreen = (X: number, Y: number): [number, number] => [
      w / 2 + X * scale,
      h / 2 - Y * scale,
    ]

    const speedColor = (q: number) => {
      if (q < 1) {
        const t = Math.max(0, q)
        return `rgba(${Math.round(40 + 120 * t)},${Math.round(90 + 120 * t)},255,0.75)`
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
        if (p.x > VIEW_W * 0.62 || Math.abs(p.y) > VIEW_H * 0.8 || p.life > 14) {
          spawn(p, false)
        }
      }
    }

    const drawParticles = () => {
      const a = (current * Math.PI) / 180
      const ca = Math.cos(a)
      const sa = Math.sin(a)
      ctx.lineWidth = 1.4
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
      ctx.fillStyle = '#05070b'
      ctx.fill()
      ctx.lineWidth = 1.8
      ctx.strokeStyle = 'rgba(238,241,246,0.7)'
      ctx.stroke()

      const c = liftCoefficient(current)
      const [ax, ay] = toScreen(-0.9 * ca, 0.9 * sa)
      const len = Math.min(Math.max(0, c) * scale * 0.9, h * 0.38)
      if (len > 6) {
        ctx.strokeStyle = '#f0452d'
        ctx.fillStyle = '#f0452d'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(ax, ay)
        ctx.lineTo(ax, ay - len)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(ax, ay - len - 8)
        ctx.lineTo(ax - 6, ay - len + 2)
        ctx.lineTo(ax + 6, ay - len + 2)
        ctx.closePath()
        ctx.fill()
      }
    }

    const frame = () => {
      raf = requestAnimationFrame(frame)
      if (!visible) return
      current += (targetRef.current - current) * 0.12
      ctx.globalCompositeOperation = 'destination-out'
      ctx.fillStyle = 'rgba(0,0,0,0.16)'
      ctx.fillRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'source-over'
      step(0.045)
      drawParticles()
      drawBody()
    }

    const renderStatic = () => {
      current = targetRef.current
      ctx.clearRect(0, 0, w, h)
      for (let i = 0; i < 160; i++) {
        step(0.05)
        drawParticles()
      }
      drawBody()
    }

    resize()
    if (reduced) {
      redrawRef.current = renderStatic
      renderStatic()
    } else {
      raf = requestAnimationFrame(frame)
    }

    const onResize = () => {
      resize()
      if (reduced) renderStatic()
    }
    window.addEventListener('resize', onResize)
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(canvas)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      io.disconnect()
    }
  }, [])

  return (
    <section className="mx-auto max-w-6xl px-6 pb-8">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink-950/60">
        <div className="grid lg:grid-cols-[1.7fr_1fr]">
          <div className="relative border-b border-white/10 lg:border-b-0 lg:border-r">
            <canvas
              ref={canvasRef}
              className="block h-[240px] w-full cursor-ns-resize sm:h-[300px]"
              onPointerMove={(e) => {
                if (e.pointerType !== 'mouse') return
                const r = e.currentTarget.getBoundingClientRect()
                const f = 1 - (e.clientY - r.top) / r.height
                setAoa(Math.round((AOA_MIN + f * (AOA_MAX - AOA_MIN)) * 10) / 10)
              }}
              aria-label="Airflow around a wing. Move the pointer up and down, or use the slider, to change the angle of attack."
            />
            <p className="pointer-events-none absolute left-4 top-3 text-xs text-steel-400">
              Airflow around a cambered wing. Move your mouse up and down on it.
            </p>
            <div className="pointer-events-none absolute bottom-3 right-4 hidden items-center gap-2 text-[11px] text-steel-400 sm:flex">
              <span>slower</span>
              <span className="h-1.5 w-20 rounded-full bg-gradient-to-r from-[#2a5aff] via-[#a0d2ff] to-[#fa5028]" />
              <span>faster air</span>
            </div>
          </div>

          <div className="grid grid-cols-2 content-start gap-x-6 gap-y-4 p-5">
            <div>
              <p className="text-xs text-steel-400">Angle of attack</p>
              <p className="display text-3xl font-extrabold text-white">{aoa.toFixed(1)}°</p>
            </div>
            <div>
              <p className="text-xs text-steel-400">Lift coeff. (idealised)</p>
              <p className="display text-3xl font-bold text-sky-400">{cl.toFixed(2)}</p>
            </div>
            <div className="col-span-2 rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs text-steel-400">XFLR5, MX-01 wing (0–8° run)</p>
              <div className="mt-1 flex gap-8">
                <p className="text-sm text-steel-300">
                  CL{' '}
                  <span className="display text-xl font-bold text-white">
                    {xCl === null ? '–' : xCl.toFixed(2)}
                  </span>
                </p>
                <p className="text-sm text-steel-300">
                  L/D{' '}
                  <span className="display text-xl font-bold text-white">
                    {xLd === null ? '–' : xLd.toFixed(1)}
                  </span>
                </p>
              </div>
              <p className="mt-2 text-[11px] leading-snug text-steel-400">
                {xCl === null
                  ? 'Outside the angles I ran in XFLR5.'
                  : 'Linearly interpolated between the XFLR5 points.'}
              </p>
            </div>
            <p
              className={`col-span-2 text-sm leading-snug ${
                atDesign ? 'text-burn-400' : 'text-steel-400'
              }`}
            >
              {atDesign
                ? 'MX-01 wing incidence (2.3°). Best simulated L/D in my ANSYS Fluent runs: 13.9.'
                : 'The idealised model has no drag or stall, so its lift keeps climbing. Real wings stall.'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/10 p-4 sm:px-5">
          <label className="flex min-w-[200px] flex-1 items-center gap-3 text-sm text-steel-300">
            <span className="shrink-0">Pitch</span>
            <input
              type="range"
              min={AOA_MIN}
              max={AOA_MAX}
              step={0.1}
              value={aoa}
              onChange={(e) => setAoa(Number(e.target.value))}
              className="h-2 w-full cursor-pointer accent-sky-400"
              aria-label="Angle of attack in degrees"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map(([v, label]) => (
              <button
                key={label}
                onClick={() => setAoa(v)}
                className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                  Math.abs(aoa - v) < 0.05
                    ? 'border-sky-400 bg-sky-400 font-semibold text-ink-950'
                    : 'border-white/15 text-steel-100 hover:border-white/40'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <p className="mt-3 text-sm text-steel-400">
        The real analysis is in the{' '}
        <Link
          to="/projects/$slug"
          params={{ slug: 'rc-aircraft' }}
          className="text-sky-400 hover:text-white"
        >
          MX-01 write-up
        </Link>
        .
      </p>
    </section>
  )
}
