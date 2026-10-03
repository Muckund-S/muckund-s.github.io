/**
 * Click the plane in the header: a small 3D aircraft takes off from the icon,
 * flies a loop away from the viewer and comes back straight at the screen. The
 * page fades to dark as it passes, navigates home underneath, then fades back in.
 * three.js is loaded on demand, so it costs nothing until the plane is clicked.
 */

let running = false

const FLIGHT = 3.7 // seconds of flying
const FADE_IN_AT = 3.2
const NAVIGATE_AT = 3.6
const END_AT = 4.05

export function warmUpFlyHome() {
  void import('three')
}

export async function flyHome(origin: HTMLElement, navigate: () => void) {
  if (running) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    navigate()
    return
  }
  running = true

  let THREE: typeof import('three')
  try {
    THREE = await import('three')
  } catch {
    running = false
    navigate()
    return
  }

  const w = window.innerWidth
  const h = window.innerHeight
  const rect = origin.getBoundingClientRect()
  const sx = rect.left + rect.width / 2
  const sy = rect.top + rect.height / 2

  let renderer: import('three').WebGLRenderer
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  } catch {
    running = false
    navigate()
    return
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.setSize(w, h)

  // Overlay: transparent canvas + a dark fade layer for the page transition.
  const overlay = document.createElement('div')
  overlay.setAttribute('aria-hidden', 'true')
  overlay.style.cssText = 'position:fixed;inset:0;z-index:100;cursor:pointer;'
  renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;'
  const fade = document.createElement('div')
  fade.style.cssText = 'position:absolute;inset:0;background:#04060a;opacity:0;'
  overlay.append(renderer.domElement, fade)
  document.body.append(overlay)
  origin.style.visibility = 'hidden'

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100)
  camera.position.set(0, 0, 10)

  scene.add(new THREE.AmbientLight(0xffffff, 1.1))
  const key = new THREE.DirectionalLight(0xffffff, 2.4)
  key.position.set(3, 5, 6)
  scene.add(key)
  const rim = new THREE.DirectionalLight(0x7cc4ff, 1.4)
  rim.position.set(-4, 1, -3)
  scene.add(rim)

  // ---- The aircraft (nose along +z) ----
  const white = new THREE.MeshStandardMaterial({ color: 0xf4f4f2, roughness: 0.55 })
  const red = new THREE.MeshStandardMaterial({ color: 0xf0452d, roughness: 0.5 })
  const dark = new THREE.MeshStandardMaterial({ color: 0x1b1f27, roughness: 0.6 })
  const metal = new THREE.MeshStandardMaterial({ color: 0xb8bcc4, metalness: 0.6, roughness: 0.35 })

  const plane = new THREE.Group()
  const body = new THREE.Group()
  plane.add(body)

  const fus = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.9, 20), white)
  fus.rotation.x = Math.PI / 2
  fus.position.z = 0.05
  body.add(fus)
  const nose = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.1, 0.22, 20), white)
  nose.rotation.x = Math.PI / 2
  nose.position.z = 0.61
  body.add(nose)
  const cowl = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.05, 16), red)
  cowl.rotation.x = Math.PI / 2
  cowl.position.z = 0.74
  body.add(cowl)
  const boom = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.1, 0.8, 16), white)
  boom.rotation.x = Math.PI / 2
  boom.position.z = -0.78
  body.add(boom)
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.1, 0.34), dark)
  cabin.position.set(0, 0.09, 0.28)
  body.add(cabin)

  const wing = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.035, 0.36), white)
  wing.position.set(0, 0.13, 0.12)
  body.add(wing)
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.038, 0.09), red)
  stripe.position.set(0, 0.13, 0.12)
  body.add(stripe)
  const strutL = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.28, 0.03), white)
  strutL.position.set(-0.4, 0.02, 0.12)
  strutL.rotation.z = -0.5
  const strutR = strutL.clone()
  strutR.position.x = 0.4
  strutR.rotation.z = 0.5
  body.add(strutL, strutR)

  const fin = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.3, 0.22), white)
  fin.position.set(0, 0.2, -1.1)
  fin.rotation.x = -0.25
  body.add(fin)
  const finTip = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.08, 0.2), red)
  finTip.position.set(0, 0.36, -1.14)
  finTip.rotation.x = -0.25
  body.add(finTip)
  const stab = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.025, 0.18), white)
  stab.position.set(0, 0.04, -1.12)
  body.add(stab)
  const stabStripe = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.028, 0.05), red)
  stabStripe.position.set(0, 0.04, -1.12)
  body.add(stabStripe)

  const gear = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.02, 0.02), dark)
  gear.position.set(0, -0.14, 0.2)
  body.add(gear)

  const prop = new THREE.Group()
  prop.position.z = 0.79
  const blade = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.7, 0.025), metal)
  prop.add(blade)
  const spinner = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.1, 14), red)
  spinner.rotation.x = Math.PI / 2
  spinner.position.z = 0.04
  prop.add(spinner)
  body.add(prop)

  const light = (color: number, x: number, y: number, z: number) => {
    const m = new THREE.Mesh(
      new THREE.SphereGeometry(0.045, 12, 12),
      new THREE.MeshBasicMaterial({ color }),
    )
    m.position.set(x, y, z)
    body.add(m)
    return m
  }
  light(0xff3b30, -1.05, 0.13, 0.12)
  light(0x35e07a, 1.05, 0.13, 0.12)
  const strobe = light(0xffffff, 0, 0.5, -1.15)

  scene.add(plane)

  // ---- Flight path: take off at the icon, loop away, return at the viewer ----
  const halfH = Math.tan((50 / 2) * (Math.PI / 180)) * 10
  const wx = ((sx - w / 2) / (h / 2)) * halfH
  const wy = (-(sy - h / 2) / (h / 2)) * halfH
  const aspect = w / h
  const path = new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(wx, wy, 0),
      new THREE.Vector3(wx + 0.9, wy - 0.6, -2.5),
      new THREE.Vector3(2.4 * aspect * 0.5, -1.0, -6),
      new THREE.Vector3(2.0, 1.5, -8),
      new THREE.Vector3(-2.0 * aspect * 0.5, 1.1, -7),
      new THREE.Vector3(-1.6, -0.2, -4),
      new THREE.Vector3(-0.7, -0.4, 0),
      new THREE.Vector3(-0.3, -0.3, 3),
      new THREE.Vector3(0.1, -0.2, 6),
      new THREE.Vector3(0.1, -0.1, 12),
    ],
    false,
    'centripetal',
  )

  // Contrail
  const TRAIL = 80
  const trailPos = new Float32Array(TRAIL * 3)
  const trailCol = new Float32Array(TRAIL * 3)
  const trailGeo = new THREE.BufferGeometry()
  trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPos, 3))
  trailGeo.setAttribute('color', new THREE.BufferAttribute(trailCol, 3))
  const trail = new THREE.Line(
    trailGeo,
    new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  )
  trail.frustumCulled = false
  scene.add(trail)
  const history: import('three').Vector3[] = []

  // ---- Animation loop ----
  const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
  const easeOut = (t: number) => 1 - (1 - t) * (1 - t)
  const pos = new THREE.Vector3()
  const tan = new THREE.Vector3()
  const tan2 = new THREE.Vector3()
  const ahead = new THREE.Vector3()
  const cross = new THREE.Vector3()
  let bank = 0
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
    scene.traverse((o) => {
      const m = o as import('three').Mesh
      if (m.geometry) m.geometry.dispose()
    })
    for (const mat of [white, red, dark, metal]) mat.dispose()
    renderer.dispose()
    renderer.forceContextLoss()
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
    path.getPoint(u, pos)
    path.getTangent(u, tan)
    path.getTangent(clamp(u + 0.012, 0, 1), tan2)

    // Bank into turns
    cross.crossVectors(tan, tan2)
    const targetBank = clamp(cross.y * 90, -1, 1) * 0.95
    bank += (targetBank - bank) * Math.min(1, dt * 6)

    plane.position.copy(pos)
    plane.up.set(Math.sin(bank), Math.cos(bank), 0)
    ahead.copy(pos).add(tan)
    plane.lookAt(ahead)
    plane.scale.setScalar(0.14 + (1 - 0.14) * easeOut(clamp(t / 1.4, 0, 1)))
    prop.rotation.z += 60 * dt
    strobe.visible = Math.floor(t * 4) % 2 === 0

    // Trail follows the tail
    history.unshift(pos.clone())
    if (history.length > TRAIL) history.pop()
    for (let i = 0; i < TRAIL; i++) {
      const p = history[Math.min(i, history.length - 1)] ?? pos
      trailPos[i * 3] = p.x
      trailPos[i * 3 + 1] = p.y
      trailPos[i * 3 + 2] = p.z
      const a = Math.pow(1 - i / TRAIL, 2) * 0.55
      trailCol[i * 3] = 0.6 * a
      trailCol[i * 3 + 1] = 0.82 * a
      trailCol[i * 3 + 2] = 1.0 * a
    }
    trailGeo.attributes.position.needsUpdate = true
    trailGeo.attributes.color.needsUpdate = true

    // Page transition: fade to dark, swap the page, fade back in.
    let o = 0
    if (t < NAVIGATE_AT) o = clamp((t - FADE_IN_AT) / (NAVIGATE_AT - FADE_IN_AT), 0, 1)
    else o = 1 - clamp((t - NAVIGATE_AT) / (END_AT - NAVIGATE_AT), 0, 1)
    fade.style.opacity = String(o)
    if (t >= NAVIGATE_AT) goHome()
    if (t >= NAVIGATE_AT) trail.visible = false

    renderer.render(scene, camera)
    if (t >= END_AT) finish()
  }
  raf = requestAnimationFrame(frame)
}
