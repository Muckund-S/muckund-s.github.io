import { profile } from '@/lib/site'

export function SiteFooter() {
  return (
    <footer className="relative z-10 mt-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-medium text-steel-100">{profile.name}</p>
          <p className="mt-1 text-sm text-steel-400">
            © {new Date().getFullYear()} {profile.name}. {profile.school}, Waterloo, Ontario.
          </p>
        </div>
        <div className="flex gap-6 text-sm">
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white"
          >
            LinkedIn
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white"
          >
            GitHub
          </a>
          <a href={`mailto:${profile.email}`} className="hover:text-white">
            Email
          </a>
          <a href={profile.resumeFile} className="hover:text-white">
            Resume
          </a>
        </div>
      </div>
    </footer>
  )
}
