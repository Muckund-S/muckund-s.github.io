import { useRef, useState } from 'react'

/**
 * MX-01 level-flight explorer. Lift = weight, using the project's real numbers:
 * 0.6 kg, 0.12 m² wing, 0.15 m chord, XFoil CLmax 1.38 at Re = 100k, and the
 * XFLR5 CL / L/D results for 0–8°.
 */

const WEIGHT = 0.6 * 9.81 // N
const AREA = 0.12 // m²
const CHORD = 0.15 // m
const RHO = 1.225 // kg/m³
const MU = 1.81e-5 // Pa·s
const CL_MAX = 1.38 // XFoil, Re = 100k (2D airfoil value)

const XF = {
  aoa: [0, 2, 4, 6, 8],
  cl: [0.231, 0.411, 0.574, 0.728, 0.873],
  ld: [10.2, 14.1, 15.0, 14.5, 13.3],
}

const V_MIN = 6
const V_MAX = 20
const CL_TOP = 2

const reqCl = (v: number) => (2 * WEIGHT) / (RHO * v * v * AREA)
const reynolds = (v: number) => (RHO * v * CHORD) / MU
const V_STALL = Math.sqrt((2 * WEIGHT) / (RHO * AREA * CL_MAX))

// CL -> alpha / L/D by linear interpolation, only inside the XFLR5 run.
function fromCl(cl: number, ys: number[]): number | null {
  if (cl < XF.cl[0] || cl > XF.cl[XF.cl.length - 1]) return null
  for (let i = 0; i < XF.cl.length - 1; i++) {
    if (cl <= XF.cl[i + 1]) {
      const t = (cl - XF.cl[i]) / (XF.cl[i + 1] - XF.cl[i])
      return ys[i] + t * (ys[i + 1] - ys[i])
    }
  }
  return null
}

// Chart geometry
const W = 640
const H = 270
const M = { l: 46, r: 18, t: 18, b: 40 }
const px = (v: number) => M.l + ((v - V_MIN) / (V_MAX - V_MIN)) * (W - M.l - M.r)
const py = (c: number) => M.t + (1 - Math.min(c, CL_TOP) / CL_TOP) * (H - M.t - M.b)

const curve = (() => {
  const pts: string[] = []
  for (let v = V_MIN; v <= V_MAX + 0.001; v += 0.25) {
    pts.push(`${pts.length ? 'L' : 'M'}${px(v).toFixed(1)},${py(reqCl(v)).toFixed(1)}`)
  }
  return pts.join(' ')
})()

// Speeds at which the XFLR5 run starts and ends (CL 0.873 and 0.231).
const V_XF_LO = Math.sqrt((2 * WEIGHT) / (RHO * AREA * XF.cl[XF.cl.length - 1]))
const V_XF_HI = Math.sqrt((2 * WEIGHT) / (RHO * AREA * XF.cl[0]))

export function FlightEnvelope() {
  const [v, setV] = useState(10)
  const svgRef = useRef<SVGSVGElement>(null)

  const cl = reqCl(v)
  const re = reynolds(v)
  const aoa = fromCl(cl, XF.aoa)
  const ld = fromCl(cl, XF.ld)
  const ratio = cl / CL_MAX

  const status =
    ratio > 1
      ? { icon: '▲', label: 'Below stall speed: cannot hold level flight', cls: 'text-burn-400' }
      : ratio > 0.8
        ? { icon: '●', label: 'Close to stall: very little margin', cls: 'text-burn-400' }
        : Math.abs(v - 10) < 0.3
          ? { icon: '✓', label: 'Design cruise point', cls: 'text-sky-400' }
          : { icon: '✓', label: 'Comfortable margin above stall', cls: 'text-sky-400' }

  const setFromPointer = (clientX: number) => {
    const svg = svgRef.current
    if (!svg) return
    const r = svg.getBoundingClientRect()
    const x = ((clientX - r.left) / r.width) * W
    const t = (x - M.l) / (W - M.l - M.r)
    setV(Math.round((V_MIN + Math.min(1, Math.max(0, t)) * (V_MAX - V_MIN)) * 10) / 10)
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-8">
      <div className="rounded-2xl border border-white/10 bg-ink-950/60 p-5 sm:p-6">
        <h2 className="display text-2xl font-bold text-white sm:text-3xl">
          Fly MX-01: how slow can it go?
        </h2>
        <p className="mt-2 max-w-2xl text-steel-400">
          Pick an airspeed. For level flight the wing must make 0.6 kg of lift, so
          slower flight needs a higher lift coefficient, until the wing runs out.
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <svg
              ref={svgRef}
              viewBox={`0 0 ${W} ${H}`}
              className="w-full cursor-ew-resize touch-none select-none"
              role="img"
              aria-label="Required lift coefficient versus airspeed for MX-01, with the wing's maximum lift coefficient"
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId)
                setFromPointer(e.clientX)
              }}
              onPointerMove={(e) => {
                if (e.buttons === 1 || e.pointerType === 'mouse') setFromPointer(e.clientX)
              }}
            >
              <defs>
                <clipPath id="env-clip">
                  <rect x={M.l} y={M.t} width={W - M.l - M.r} height={H - M.t - M.b} />
                </clipPath>
              </defs>

              {/* horizontal grid + y labels */}
              {[0, 0.5, 1, 1.5, 2].map((c) => (
                <g key={c}>
                  <line
                    x1={M.l}
                    x2={W - M.r}
                    y1={py(c)}
                    y2={py(c)}
                    stroke="rgba(255,255,255,0.08)"
                  />
                  <text x={M.l - 8} y={py(c) + 4} textAnchor="end" fontSize="11" fill="#8b95a7">
                    {c}
                  </text>
                </g>
              ))}
              {/* x labels */}
              {[6, 8, 10, 12, 14, 16, 18, 20].map((s) => (
                <text key={s} x={px(s)} y={H - 20} textAnchor="middle" fontSize="11" fill="#8b95a7">
                  {s}
                </text>
              ))}
              <text x={(M.l + W - M.r) / 2} y={H - 4} textAnchor="middle" fontSize="11" fill="#8b95a7">
                Airspeed (m/s)
              </text>
              <text
                x={12}
                y={(M.t + H - M.b) / 2}
                textAnchor="middle"
                fontSize="11"
                fill="#8b95a7"
                transform={`rotate(-90 12 ${(M.t + H - M.b) / 2})`}
              >
                Lift coefficient needed
              </text>

              {/* stall region above CLmax */}
              <rect
                x={M.l}
                y={M.t}
                width={W - M.l - M.r}
                height={py(CL_MAX) - M.t}
                fill="rgba(240,69,45,0.10)"
              />
              <line
                x1={M.l}
                x2={W - M.r}
                y1={py(CL_MAX)}
                y2={py(CL_MAX)}
                stroke="#f0452d"
                strokeWidth="1.5"
                strokeDasharray="5 4"
              />
              <text x={W - M.r - 6} y={py(CL_MAX) - 6} textAnchor="end" fontSize="11" fill="#ff6b52">
                Wing limit: CLmax 1.38 (XFoil, Re 100k)
              </text>

              {/* XFLR5 range */}
              <rect
                x={px(V_XF_LO)}
                y={py(0.873)}
                width={px(V_XF_HI) - px(V_XF_LO)}
                height={py(0.231) - py(0.873)}
                fill="rgba(124,196,255,0.07)"
                stroke="rgba(124,196,255,0.25)"
              />
              <text x={px(V_XF_HI) - 6} y={py(0.231) - 6} textAnchor="end" fontSize="11" fill="#7cc4ff">
                XFLR5 run (0–8°)
              </text>

              {/* required-CL curve */}
              <path
                d={curve}
                fill="none"
                stroke="#eef1f6"
                strokeWidth="2"
                clipPath="url(#env-clip)"
              />

              {/* design cruise tick */}
              <line x1={px(10)} x2={px(10)} y1={py(reqCl(10))} y2={H - M.b} stroke="rgba(255,255,255,0.25)" strokeDasharray="2 3" />
              <text x={px(10) + 6} y={H - M.b - 8} fontSize="11" fill="#b9c1ce">
                Design cruise 10 m/s
              </text>

              {/* current point */}
              <line x1={px(v)} x2={px(v)} y1={py(cl)} y2={H - M.b} stroke="#7cc4ff" strokeWidth="1" />
              <circle cx={px(v)} cy={py(cl)} r="7" fill="#7cc4ff" stroke="#04060a" strokeWidth="2" />
            </svg>

            <label className="mt-2 flex items-center gap-4 text-sm text-steel-300">
              <span className="shrink-0">Airspeed</span>
              <input
                type="range"
                min={V_MIN}
                max={V_MAX}
                step={0.1}
                value={v}
                onChange={(e) => setV(Number(e.target.value))}
                className="h-2 w-full cursor-pointer accent-sky-400"
                aria-label="Airspeed in metres per second"
              />
              <span className="display w-24 shrink-0 whitespace-nowrap text-right text-lg font-bold text-white">
                {v.toFixed(1)} m/s
              </span>
            </label>
          </div>

          <div>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <dt className="text-xs text-steel-400">Reynolds number</dt>
                <dd className="display text-2xl font-bold text-white">
                  {Math.round(re / 1000)}k
                </dd>
              </div>
              <div>
                <dt className="text-xs text-steel-400">Lift coefficient needed</dt>
                <dd className="display text-2xl font-bold text-sky-400">{cl.toFixed(2)}</dd>
              </div>
              <div>
                <dt className="text-xs text-steel-400">Wing angle (XFLR5)</dt>
                <dd className="display text-2xl font-bold text-white">
                  {aoa === null ? '–' : `${aoa.toFixed(1)}°`}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-steel-400">Lift-to-drag (XFLR5)</dt>
                <dd className="display text-2xl font-bold text-white">
                  {ld === null ? '–' : ld.toFixed(1)}
                </dd>
              </div>
            </dl>

            <p className={`mt-5 flex items-start gap-2 text-sm font-medium ${status.cls}`}>
              <span aria-hidden="true">{status.icon}</span>
              <span>{status.label}</span>
            </p>
            <p className="mt-3 text-xs leading-relaxed text-steel-400">
              Stall speed with this wing limit: {V_STALL.toFixed(1)} m/s.
              {aoa === null && cl <= CL_MAX
                ? ' Angle and L/D are shown only inside the XFLR5 run.'
                : ''}
              {re < 75000
                ? ' At this Reynolds number the XFoil runs showed a laminar separation bubble (Re 50k), which cuts peak CL/CD from about 53 to 29.'
                : ''}
            </p>
            <p className="mt-3 text-xs leading-relaxed text-steel-400">
              Back-of-envelope: lift = weight (0.6 kg, 0.12 m² wing, 0.15 m chord,
              sea-level air). CLmax is a 2D airfoil number, so the real 3D wing
              stalls a little sooner.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
