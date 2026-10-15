import { useEffect, useRef } from 'react'
import { Plane } from 'lucide-react'

/** A thin line down the left gutter that draws as you scroll, with a small plane at its tip. wide screens only (1440px+), where the gutter is clear of the content. */
export function FlightPath() {
  const wrap = useRef<HTMLDivElement>(null)
  const svg = useRef<SVGSVGElement>(null)
  const prog = useRef<SVGPathElement>(null)
  const plane = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = wrap.current
    const path = prog.current
    const sv = svg.current
    const pl = plane.current
    if (!el || !path || !sv || !pl) return
    if (!window.matchMedia('(min-width: 1440px)').matches) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const len = path.getTotalLength()
    path.style.strokeDasharray = `${len}`
    let raf = 0

    const update = () => {
      raf = 0
      const parent = el.parentElement
      if (!parent) return
      const r = parent.getBoundingClientRect()
      const p = reduce ? 1 : Math.min(1, Math.max(0, (window.innerHeight * 0.55 - r.top) / r.height))
      path.style.strokeDashoffset = `${len * (1 - p)}`
      const w = sv.clientWidth
      const h = sv.clientHeight
      const a = path.getPointAtLength(len * p)
      const b = path.getPointAtLength(Math.min(len, len * p + 3))
      const dx = ((b.x - a.x) * w) / 64
      const dy = ((b.y - a.y) * h) / 1000
      const ang = (Math.atan2(dy, dx) * 180) / Math.PI + 45 // lucide Plane's nose points up-right
      pl.style.transform = `translate(${(a.x * w) / 64 - 10}px, ${(a.y * h) / 1000 - 10}px) rotate(${ang}deg)`
      pl.style.opacity = p > 0.01 && p < 0.995 ? '1' : '0'
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
  }, [])

  const d = 'M32,0 C62,120 2,230 32,340 S62,560 32,670 S2,850 32,1000'
  return (
    <div ref={wrap} className="flight-path pointer-events-none absolute inset-y-0 left-[72px] z-0 w-16" aria-hidden="true">
      <svg ref={svg} viewBox="0 0 64 1000" preserveAspectRatio="none" className="h-full w-full overflow-visible">
        <path d={d} fill="none" stroke="rgb(164 174 191 / 0.18)" strokeWidth="1" strokeDasharray="3 6" vectorEffect="non-scaling-stroke" />
        <path ref={prog} d={d} fill="none" stroke="var(--color-sky-400)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      </svg>
      <div ref={plane} className="absolute left-0 top-0 text-sky-400 opacity-0 transition-opacity" style={{ width: 20, height: 20 }}>
        <Plane size={20} />
      </div>
    </div>
  )
}
