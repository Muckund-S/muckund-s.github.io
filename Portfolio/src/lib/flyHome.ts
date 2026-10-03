/**
 * Click the plane in the header: a small 3D Concorde takes off from the icon,
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

  // ---- Concorde (nose along +z): ogival delta wing, drooped nose, four engines ----
  const white = new THREE.MeshStandardMaterial({ color: 0xf6f6f4, roughness: 0.4, metalness: 0.1 })
  const red = new THREE.MeshStandardMaterial({ color: 0xf0452d, roughness: 0.5 })
  const dark = new THREE.MeshStandardMaterial({ color: 0x14181f, roughness: 0.5 })
  const metal = new THREE.MeshStandardMaterial({ color: 0x8f959f, metalness: 0.7, roughness: 0.35 })
  const glowMat = new THREE.MeshBasicMaterial({ color: 0xff8a3d })

  const plane = new THREE.Group()
  const body = new THREE.Group()
  plane.add(body)

  // Fuselage: long and slender, tapering at the tail
  const fusFront = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 1.5, 24), white)
  fusFront.rotation.x = Math.PI / 2
  fusFront.position.z = 0.0
  body.add(fusFront)
  const fusRear = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.042, 0.8, 24), white)
  fusRear.rotation.x = Math.PI / 2
  fusRear.position.z = -1.1
  body.add(fusRear)

  // Droop nose: pivots down from the front of the fuselage
  const noseGroup = new THREE.Group()
  noseGroup.position.set(0, 0, 0.75)
  noseGroup.rotation.x = 0.2
  const noseCone = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.75, 24), white)
  noseCone.rotation.x = Math.PI / 2
  noseCone.position.z = 0.375
  noseGroup.add(noseCone)
  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.035, 0.18), dark)
  visor.position.set(0, 0.055, 0.08)
  noseGroup.add(visor)
  body.add(noseGroup)

  // Window line along both sides
  for (const side of [-1, 1]) {
    const windows = new THREE.Mesh(new THREE.BoxGeometry(0.006, 0.018, 1.25), dark)
    windows.position.set(side * 0.0755, 0.025, 0.0)
    body.add(windows)
  }

  // Ogival delta wing
  const wingShape = new THREE.Shape()
  wingShape.moveTo(0, 0.55)
  wingShape.quadraticCurveTo(0.16, 0.0, 0.72, -0.85)
  wingShape.lineTo(0.72, -1.0)
  wingShape.lineTo(-0.72, -1.0)
  wingShape.lineTo(-0.72, -0.85)
  wingShape.quadraticCurveTo(-0.16, 0.0, 0, 0.55)
  const wingGeo = new THREE.ExtrudeGeometry(wingShape, { depth: 0.03, bevelEnabled: false })
  wingGeo.rotateX(Math.PI / 2)
  const wing = new THREE.Mesh(wingGeo, white)
  wing.position.y = -0.045
  body.add(wing)
  const wingTrim = new THREE.Mesh(new THREE.BoxGeometry(1.44, 0.032, 0.03), red)
  wingTrim.position.set(0, -0.043, -0.99)
  body.add(wingTrim)

  // Tall swept fin
  const finShape = new THREE.Shape()
  finShape.moveTo(-0.5, 0.06)
  finShape.lineTo(-1.2, 0.06)
  finShape.lineTo(-1.25, 0.5)
  finShape.lineTo(-1.08, 0.5)
  finShape.closePath()
  const finGeo = new THREE.ExtrudeGeometry(finShape, { depth: 0.03, bevelEnabled: false })
  finGeo.rotateY(-Math.PI / 2)
  finGeo.translate(-0.015, 0, 0)
  body.add(new THREE.Mesh(finGeo, white))
  const finTop = new THREE.Mesh(new THREE.BoxGeometry(0.034, 0.1, 0.2), red)
  finTop.position.set(0, 0.45, -1.165)
  finTop.rotation.x = -0.08
  body.add(finTop)

  // Four engines in two pairs under the wings
  const glows: import('three').Mesh[] = []
  for (const side of [-1, 1]) {
    for (const off of [0.2, 0.31]) {
      const nacelle = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.04, 0.78, 14), metal)
      nacelle.rotation.x = Math.PI / 2
      nacelle.position.set(side * off, -0.085, -0.62)
      body.add(nacelle)
      const intake = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.06, 0.1), dark)
      intake.position.set(side * off, -0.085, -0.2)
      body.add(intake)
      const glow = new THREE.Mesh(new THREE.SphereGeometry(0.034, 10, 10), glowMat)
      glow.position.set(side * off, -0.085, -1.02)
      body.add(glow)
      glows.push(glow)
    }
  }

  const light = (color: number, x: number, y: number, z: number) => {
    const m = new THREE.Mesh(
      new THREE.SphereGeometry(0.03, 12, 12),
      new THREE.MeshBasicMaterial({ color }),
    )
    m.position.set(x, y, z)
    body.add(m)
    return m
  }
  light(0xff3b30, -0.72, -0.03, -0.92)
  light(0x35e07a, 0.72, -0.03, -0.92)
  const strobe = light(0xffffff, 0, 0.52, -1.2)

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
    for (const mat of [white, red, dark, metal, glowMat]) mat.dispose()
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
    plane.scale.setScalar(0.12 + (1.05 - 0.12) * easeOut(clamp(t / 1.4, 0, 1)))
    for (const g of glows) g.scale.setScalar(0.85 + 0.3 * Math.random())
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
