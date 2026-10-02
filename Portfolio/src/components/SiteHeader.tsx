import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { profile } from '@/lib/site'

const tabs = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
  { to: '/resume', label: 'Resume' },
  { to: '/contact', label: 'Contact' },
] as const

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const tabClass =
    'relative rounded-full px-4 py-2 text-sm font-medium text-steel-400 transition-colors hover:text-steel-100'
  const activeClass = 'bg-white/[0.07] text-steel-100'

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-white/5 bg-ink-950/75 backdrop-blur-xl'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link
          to="/"
          className="group flex items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <span className="grid h-8 w-8 place-items-center rounded-md border border-burn-500/40 bg-burn-500/10 font-mono text-xs font-medium text-burn-400 transition-colors group-hover:bg-burn-500 group-hover:text-ink-950">
            MS
          </span>
          <span className="font-display text-[15px] font-semibold tracking-tight text-steel-100">
            {profile.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-white/5 bg-ink-900/60 p-1 md:flex">
          {tabs.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              className={tabClass}
              activeProps={{ className: activeClass }}
              activeOptions={{ exact: t.to === '/' }}
            >
              {t.label}
            </Link>
          ))}
        </nav>

        <a
          href={profile.resume}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden rounded-full bg-steel-100 px-4 py-2 text-sm font-medium text-ink-950 transition-colors hover:bg-burn-500 md:inline-flex"
        >
          Résumé ↗
        </a>

        <button
          className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-steel-100 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <nav className="animate-in fade-in slide-in-from-top-2 border-t border-white/5 bg-ink-950/95 px-5 pb-6 pt-2 backdrop-blur-xl md:hidden">
          {tabs.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              onClick={() => setOpen(false)}
              className="block border-b border-white/5 py-4 font-display text-2xl text-steel-400"
              activeProps={{ className: 'text-steel-100' }}
              activeOptions={{ exact: t.to === '/' }}
            >
              {t.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
