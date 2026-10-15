import { useEffect, useRef } from 'react'

/** Blueprint grid, a twinkling starfield and a one-time scan line behind the hero. */
export function HeroBackdrop() {
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = canvas.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    if (!ctx) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0
    let h = 0
    let raf = 0
    let visible = true
    type Star = { x: number; y: number; r: number; ph: number; sp: number }
    let stars: Star[] = []

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = cv.getBoundingClientRect()
      w = rect.width
      h = rect.height
      cv.width = Math.round(w * dpr)
      cv.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const n = Math.min(160, Math.round((w * h) / 9000))
      stars = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.4 + Math.random() * 1.1,
        ph: Math.random() * Math.PI * 2,
        sp: 0.6 + Math.random() * 1.6,
      }))
    }

    const draw = (time: number) => {
      ctx.clearRect(0, 0, w, h)
      for (const s of stars) {
        const a = reduce ? 0.55 : 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(time / 1000 * s.sp + s.ph))
        ctx.fillStyle = `rgba(200, 225, 255, ${a})`
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const tick = (time: number) => {
      raf = 0
      if (!visible) return
      draw(time)
      raf = requestAnimationFrame(tick)
    }

    resize()
    draw(0)
    if (!reduce) raf = requestAnimationFrame(tick)

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !reduce && !raf) raf = requestAnimationFrame(tick)
    })
    io.observe(cv)
    window.addEventListener('resize', resize)
    return () => {
      io.disconnect()
      window.removeEventListener('resize', resize)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="hero-grid" />
      <canvas
        ref={canvas}
        className="h-full w-full [mask-image:radial-gradient(ellipse_80%_75%_at_50%_45%,#000_30%,transparent_80%)]"
      />
      <div className="hero-scan" />
    </div>
  )
}
