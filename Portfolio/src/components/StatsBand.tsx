import { useEffect, useRef, useState } from 'react'

type Stat = { value: number; decimals?: number; suffix?: string; label: string; note: string }

const stats: Stat[] = [
  { value: 63497, label: 'ft · Polaris altitude record', note: 'Waterloo Rocketry team, amateur liquid-fuel, 2026' },
  { value: 3.81, decimals: 2, label: 'FOS · Pegasus 1 landing gear', note: 'ANSYS, 1g landing load' },
  { value: 96.7, decimals: 1, suffix: '%', label: 'Coin-detection accuracy', note: 'VEX IQ ATM, optical sensor' },
  { value: 12, label: 'MX-01 test flights', note: 'About 1 hr of airtime' },
]

function fmt(v: number, decimals = 0) {
  return v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

function Counter({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLDivElement>(null)
  // Start at the final value so the HTML is correct without JS; count up when scrolled into view.
  const [v, setV] = useState(stat.value)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        const t0 = performance.now()
        const dur = 1500
        const step = (now: number) => {
          const p = Math.min(1, (now - t0) / dur)
          const e = 1 - Math.pow(1 - p, 3)
          setV(stat.value * e)
          if (p < 1) raf = requestAnimationFrame(step)
        }
        setV(0)
        raf = requestAnimationFrame(step)
      },
      { threshold: 0.6 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [stat.value])

  return (
    <div ref={ref}>
      <p className="display text-4xl font-extrabold text-white sm:text-5xl">
        {fmt(v, stat.decimals)}
        {stat.suffix}
      </p>
      <p className="mono mt-2 text-[11px] uppercase text-sky-400">{stat.label}</p>
      <p className="mt-1 text-sm text-steel-400">{stat.note}</p>
    </div>
  )
}

export function StatsBand() {
  return (
    <section data-waypoint="02 · TELEMETRY" className="mx-auto max-w-6xl px-6 pb-8 pt-4" aria-label="Highlights">
      <div className="grid gap-8 rounded-2xl border border-white/10 bg-white/[0.03] p-8 sm:grid-cols-2 lg:grid-cols-4 md:p-10">
        {stats.map((s) => (
          <Counter key={s.label} stat={s} />
        ))}
      </div>
    </section>
  )
}
