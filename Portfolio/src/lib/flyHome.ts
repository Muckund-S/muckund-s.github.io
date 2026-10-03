/**
 * Click the plane in the header: the same icon lifts off, flies a loop across the
 * page with a glowing contrail and lands back on its spot in the header. Part-way
 * through, the site switches to the home page underneath, so the plane's flight
 * hides the change. Esc skips it.
 */

let running = false

const FLIGHT = 2.7 // seconds
const NAVIGATE_AT = 0.42 // fraction of the flight

type Key = { x: number; y: number }

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))

// Uniform Catmull-Rom through the key points
function spline(keys: Key[], u: number): Key {
  const n = keys.length - 1
  const f = clamp(u, 0, 1) * n
  const i = Math.min(n - 1, Math.floor(f))
  const t = f - i
  const p0 = keys[Math.max(0, i - 1)]
  const p1 = keys[i]
  const p2 = keys[i + 1]
  const p3 = keys[Math.min(n, i + 2)]
  const c = (a: number, b: number, c2: number, d: number) =>
    0.5 *
    (2 * b +
      (-a + c2) * t +
      (2 * a - 5 * b + 4 * c2 - d) * t * t +
      (-a + 3 * b - 3 * c2 + d) * t * t * t)
  return { x: c(p0.x, p1.x, p2.x, p3.x), y: c(p0.y, p1.y, p2.y, p3.y) }
}

export function flyHome(origin: HTMLElement, navigate: () => void) {
  if (running) return
  const icon = origin.querySelector('svg')
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !icon) {
    navigate()
    window.scrollTo(0, 0)
    return
  }
  running = true

  const w = window.innerWidth
  const h = window.innerHeight
  const rect = origin.getBoundingClientRect()
  const sx = rect.left + rect.width / 2
  const sy = rect.top + rect.height / 2

  // Overlay that never blocks clicks: contrail canvas + the flying icon.
  const overlay = document.createElement('div')
  overlay.setAttribute('aria-hidden', 'true')
  overlay.style.cssText = 'position:fixed;inset:0;z-index:100;pointer-events:none;overflow:hidden;'

  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const trailCanvas = document.createElement('canvas')
  trailCanvas.width = Math.round(w * dpr)
  trailCanvas.height = Math.round(h * dpr)
  trailCanvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;'
  const ctx = trailCanvas.getContext('2d')!
  ctx.scale(dpr, dpr)

  const glyph = icon.cloneNode(true) as SVGElement
  glyph.removeAttribute('class')
  glyph.setAttribute('width', '20')
  glyph.setAttribute('height', '20')
  glyph.style.cssText = 'display:block;width:100%;height:100%;transform:rotate(-45deg);'
  const plane = document.createElement('div')
  plane.style.cssText = `position:absolute;left:${sx - 10}px;top:${sy - 10}px;width:20px;height:20px;color:#eef1f6;will-change:transform;filter:drop-shadow(0 0 6px rgba(124,196,255,0.9));`
  plane.append(glyph)

  overlay.append(trailCanvas, plane)
  document.body.append(overlay)
  origin.style.visibility = 'hidden'

  // Take off, loop across the page, then come back down onto the header icon.
  const keys: Key[] = [
    { x: sx, y: sy },
    { x: sx + 0.07 * w, y: sy + 0.2 * h },
    { x: 0.62 * w, y: 0.4 * h },
    { x: 0.86 * w, y: 0.3 * h },
    { x: 0.78 * w, y: 0.14 * h },
    { x: 0.5 * w, y: 0.2 * h },
    { x: 0.22 * w, y: 0.42 * h },
    { x: sx - 0.1 * w, y: sy + 0.24 * h },
    { x: sx - 0.015 * w, y: sy + 0.07 * h },
    { x: sx, y: sy },
  ]

  const history: Key[] = []
  const TRAIL = 60
  let heading = 0
  let navigated = false
  let finished = false
  let skipped = false
  let raf = 0
  const t0 = performance.now()
  let last = t0

  const goHome = () => {
    if (navigated) return
    navigated = true
    navigate()
    window.scrollTo(0, 0)
  }
  const finish = () => {
    if (finished) return
    finished = true
    cancelAnimationFrame(raf)
    window.removeEventListener('keydown', onKey)
    goHome()
    overlay.remove()
    origin.style.visibility = ''
    running = false
  }
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') skipped = true
  }
  window.addEventListener('keydown', onKey)

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame)
    if (skipped) return finish()
    const t = (now - t0) / 1000
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now

    const f = clamp(t / FLIGHT, 0, 1)
    const u = f * f * (3 - 2 * f) // ease in and out, so it lifts off and lands gently
    const p = spline(keys, u)
    const p2 = spline(keys, clamp(u + 0.01, 0, 1))

    // Face the direction of travel (0 = nose up, clockwise positive); level out to land.
    const dx = p2.x - p.x
    const dy = p2.y - p.y
    if (Math.hypot(dx, dy) > 0.005) {
      let target = (Math.atan2(dx, -dy) * 180) / Math.PI
      while (target - heading > 180) target -= 360
      while (target - heading < -180) target += 360
      heading += (target - heading) * Math.min(1, dt * 9)
    }
    const land = clamp((f - 0.9) / 0.1, 0, 1)
    const hdg = heading * (1 - land)

    const s = 1 + 1.1 * Math.sin(Math.PI * f)
    plane.style.transform = `translate(${p.x - sx}px, ${p.y - sy}px) rotate(${hdg}deg) scale(${s})`

    // Contrail
    history.unshift({ x: p.x, y: p.y })
    if (history.length > TRAIL) history.pop()
    ctx.clearRect(0, 0, w, h)
    ctx.globalCompositeOperation = 'lighter'
    ctx.lineCap = 'round'
    const fadeOut = 1 - clamp((f - 0.85) / 0.15, 0, 1)
    for (let i = 1; i < history.length; i++) {
      const a = Math.pow(1 - i / TRAIL, 2) * 0.55 * fadeOut
      ctx.strokeStyle = `rgba(150,208,255,${a})`
      ctx.lineWidth = Math.max(0.6, 3.2 * (1 - i / TRAIL))
      ctx.beginPath()
      ctx.moveTo(history[i - 1].x, history[i - 1].y)
      ctx.lineTo(history[i].x, history[i].y)
      ctx.stroke()
    }

    if (f >= NAVIGATE_AT) goHome()
    if (f >= 1) finish()
  }
  raf = requestAnimationFrame(frame)
}
