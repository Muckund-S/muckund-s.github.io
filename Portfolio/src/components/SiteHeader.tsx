import { Link, useNavigate } from '@tanstack/react-router'
import { Plane } from 'lucide-react'
import { flyHome } from '@/lib/flyHome'

const tabs = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
  { to: '/resume', label: 'Resume' },
  { to: '/contact', label: 'Contact' },
] as const

export function SiteHeader() {
  const navigate = useNavigate()

  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-3">
      <nav className="pointer-events-auto flex items-center gap-0.5 rounded-full border border-white/10 bg-ink-950/70 p-1.5 backdrop-blur-xl">
        <Link
          to="/"
          aria-label="Home (the plane takes off)"
          className="grid h-9 w-9 place-items-center text-steel-100 transition-transform hover:scale-110"
          onClick={(e) => {
            e.preventDefault()
            flyHome(e.currentTarget, () => navigate({ to: '/' }))
          }}
        >
          <Plane size={18} className="-rotate-45" />
        </Link>
        {tabs.map((t) => (
          <Link
            key={t.to}
            to={t.to}
            className="rounded-full px-3 py-2 text-[13px] font-medium text-steel-300 transition-colors hover:text-white sm:px-4 sm:text-sm"
            activeProps={{ className: 'bg-white/10 !text-white' }}
            activeOptions={{ exact: t.to === '/' }}
          >
            {t.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
