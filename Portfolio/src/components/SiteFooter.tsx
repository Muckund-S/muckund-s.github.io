import { Link } from '@tanstack/react-router'
import { profile } from '@/lib/site'

export function SiteFooter() {
  return (
    <footer className="border-t border-white/5">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-steel-100">{profile.name}</p>
          <p className="label mt-1">
            {profile.role} · {profile.school}
          </p>
        </div>
        <div className="flex flex-wrap gap-6 text-sm">
          <Link to="/projects" className="hover:text-steel-100">
            Projects
          </Link>
          <Link to="/resume" className="hover:text-steel-100">
            Resume
          </Link>
          <Link to="/contact" className="hover:text-steel-100">
            Contact
          </Link>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-steel-100"
          >
            LinkedIn ↗
          </a>
        </div>
        <p className="label">© {new Date().getFullYear()} {profile.name}</p>
      </div>
    </footer>
  )
}
