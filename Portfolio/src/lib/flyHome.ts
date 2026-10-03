/**
 * Click the plane in the header: the same icon lifts off from where it sits,
 * flies a loop across the page, then swings round and rushes at the viewer
 * (it grows as it comes toward you, using CSS 3D depth on the 2D glyph). The page
 * fades to dark as it passes, navigates home underneath, then fades back in.
 */

let running = false

const FLIGHT = 3.4 // seconds of flying
const FADE_IN_AT = 2.85
const NAVIGATE_AT = 3.3
const END_AT = 3.8
const PERSPECTIVE = 900

type Key = { x: number; y: number; z: number }

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
const easeOut = (t: number) => 1 - (1 - t) * (1 - t)

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
  return {
    x: c(p0.x, p1.x, p2.x, p3.x),
    y: c(p0.y, p1.y, p2.y, p3.y),
    z: c(p0.z, p1.z, p2.z, p3.z),
  }
}

export function flyHome(origin: HTMLElement, navigate: () => void) {
  if (running) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    navigate()
    return
  }
  const icon = origin.querySelector('svg')
  if (!icon) {
    navigate()
    return
  }
  running = true

  const w = window.innerWidth
  const h = window.innerHeight
  const rect = origin.getBoundingClientRect()
  const sx = rect.left + rect.width / 2
  const sy = rect.top + rect.height / 2
  const cx = w / 2
  const cy = h / 2

  // Overlay: perspective stage, contrail canvas, and a dark fade layer.
  const overlay = document.createElement('div')
  overlay.setAttribute('aria-hidden', 'true')
  overlay.style.cssText = 'position:fixed;inset:0;z-index:100;cursor:pointer;overflow:hidden;'

  const trailCanvas = document.createElement('canvas')
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  trailCanvas.width = Math.round(w * dpr)
  trailCanvas.height = Math.round(h * dpr)
  trailCanvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;'
  const ctx = trailCanvas.getContext('2d')!
  ctx.scale(dpr, dpr)

  const stage = document.createElement('div')
  stage.style.cssText = `position:absolute;inset:0;perspective:${PERSPECTIVE}px;perspective-origin:50% 50%;`

  const size = rect.width || 36
  const glyph = icon.cloneNode(true) as SVGElement
  glyph.removeAttribute('class')
  glyph.setAttribute('width', '20')
  glyph.setAttribute('height', '20')
  const plane = document.createElement('div')
  plane.style.cssText = `position:absolute;left:${sx - 10}px;top:${sy - 10}px;width:20px;height:20px;color:#fff;will-change:transform;transform-style:preserve-3d;filter:drop-shadow(0 0 6px rgba(124,196,255,0.9));`
  glyph.style.cssText = 'display:block;width:100%;height:100%;transform:rotate(-45deg);'
  plane.append(glyph)
  stage.append(plane)

  const fade = document.createElement('div')
  fade.style.cssText = 'position:absolute;inset:0;background:#04060a;opacity:0;'
  overlay.append(trailCanvas, stage, fade)
  document.body.append(overlay)
  origin.style.visibility = 'hidden'
  void size

  // Flight path: take off, loop across the page, swing round, rush at the viewer.
  const keys: Key[] = [
    { x: sx, y: sy, z: 0 },
    { x: sx + 0.1 * w, y: sy + 0.18 * h, z: 40 },
    { x: 0.78 * w, y: 0.45 * h, z: -150 },
    { x: 0.86 * w, y: 0.25 * h, z: -260 },
    { x: 0.55 * w, y: 0.12 * h, z: -220 },
    { x: 0.25 * w, y: 0.38 * h, z: -120 },
    { x: 0.38 * w, y: 0.62 * h, z: -20 },
    { x: 0.5 * w, y: 0.52 * h, z: 300 },
    { x: 0.5 * w, y: 0.48 * h, z: 700 },
  ]

  const history: { x: number; y: number }[] = []
  const TRAIL = 70
  let heading = 0
  let bank = 0
  let prevHeading = 0
  let navigated = false
  let finished = false
  let skipped = false
  let raf = 0
  const t0 = performance.now()
  let last = t0

  const finish = () => {
    if (finished) return
    finished = true
    cancelAnimationFrame(raf)
    window.removeEventListener('keydown', onKey)
    overlay.remove()
    origin.style.visibility = ''
    running = false
  }
  const goHome = () => {
    if (navigated) return
    navigated = true
    navigate()
    window.scrollTo(0, 0)
  }
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') skipped = true
  }
  window.addEventListener('keydown', onKey)
  overlay.addEventListener('click', () => (skipped = true))

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame)
    let t = (now - t0) / 1000
    if (skipped && t < NAVIGATE_AT) t = NAVIGATE_AT
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now

    const f = clamp(t / FLIGHT, 0, 1)
    const u = clamp(0.5 * f + 0.5 * f * f, 0, 1)
    const p = spline(keys, u)
    const p2 = spline(keys, clamp(u + 0.01, 0, 1))

    // Heading follows the path on screen (0 = nose up, clockwise positive);
    // in the last stretch it straightens to nose-up as the plane comes at you.
    const dx = p2.x - p.x
    const dy = p2.y - p.y
    if (Math.hypot(dx, dy) > 0.01) {
      let target = (Math.atan2(dx, -dy) * 180) / Math.PI
      // unwrap to the nearest equivalent angle
      while (target - heading > 180) target -= 360
      while (target - heading < -180) target += 360
      heading += (target - heading) * Math.min(1, dt * 8)
    }
    const straighten = clamp((f - 0.78) / 0.2, 0, 1)
    const hdg = heading * (1 - straighten)
    bank += ((hdg - prevHeading) * 3 - bank) * Math.min(1, dt * 6)
    bank = clamp(bank, -55, 55)
    prevHeading = hdg

    const baseScale = 1 + 1.2 * easeOut(clamp(t / 1.2, 0, 1))
    const rush = 1 + 5 * Math.pow(clamp((f - 0.78) / 0.22, 0, 1), 2)
    const s = baseScale * rush

    plane.style.transform = `translate3d(${p.x - sx}px, ${p.y - sy}px, ${p.z}px) rotateZ(${hdg}deg) rotateY(${bank}deg) scale(${s})`

    // Contrail in screen space (project through the same perspective)
    const pers = PERSPECTIVE / Math.max(80, PERSPECTIVE - p.z)
    const scx = cx + (p.x - cx) * pers
    const scy = cy + (p.y - cy) * pers
    history.unshift({ x: scx, y: scy })
    if (history.length > TRAIL) history.pop()
    ctx.clearRect(0, 0, w, h)
    ctx.globalCompositeOperation = 'lighter'
    ctx.lineCap = 'round'
    if (t < NAVIGATE_AT) {
      for (let i = 1; i < history.length; i++) {
        const a = Math.pow(1 - i / TRAIL, 2) * 0.55
        ctx.strokeStyle = `rgba(150,208,255,${a})`
        ctx.lineWidth = Math.max(0.6, 3.2 * (1 - i / TRAIL))
        ctx.beginPath()
        ctx.moveTo(history[i - 1].x, history[i - 1].y)
        ctx.lineTo(history[i].x, history[i].y)
        ctx.stroke()
      }
    }

    // Page transition: fade to dark, swap the page, fade back in.
    let o = 0
    if (t < NAVIGATE_AT) o = clamp((t - FADE_IN_AT) / (NAVIGATE_AT - FADE_IN_AT), 0, 1)
    else o = 1 - clamp((t - NAVIGATE_AT) / (END_AT - NAVIGATE_AT), 0, 1)
    fade.style.opacity = String(o)
    if (t >= NAVIGATE_AT) {
      goHome()
      plane.style.visibility = 'hidden'
    }
    if (t >= END_AT) finish()
  }
  raf = requestAnimationFrame(frame)
}
