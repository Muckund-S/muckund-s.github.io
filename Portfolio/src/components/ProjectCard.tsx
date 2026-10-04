import { Link } from '@tanstack/react-router'
import type { Project } from 'content-collections'
import { img } from '@/lib/site'

/** One cover treatment for every project: same crop, same tone, same bottom fade. */
function Cover({ project, className }: { project: Project; className: string }) {
  return (
    <div className={`relative overflow-hidden bg-ink-800 ${className}`}>
      {project.image && (
        <img
          src={img(project.image)}
          alt={`${project.title}: ${project.subtitle}`}
          loading="lazy"
          className="h-full w-full object-cover [filter:saturate(0.92)_contrast(1.03)] transition-transform duration-500 group-hover:scale-[1.03]"
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/55 via-transparent to-transparent" />
    </div>
  )
}

/** Large card for the featured projects. */
export function FeaturedCard({ project, index }: { project: Project; index: number }) {
  return (
    <Link
      to="/projects/$slug"
      params={{ slug: project._meta.path }}
      className="group grid overflow-hidden rounded-2xl border border-white/10 bg-ink-900/80 transition-colors hover:border-white/25 md:grid-cols-[1.15fr_1fr]"
    >
      <Cover project={project} className="aspect-[16/10] md:aspect-auto md:min-h-[320px]" />
      <div className="flex flex-col p-6 md:p-9">
        <p className="text-sm text-steel-300">
          <span className="font-semibold text-sky-400">0{index + 1}</span> · {project.category}{' '}
          · {project.dates}
        </p>
        <h2 className="display mt-3 text-2xl font-bold leading-tight text-white md:text-3xl">
          {project.title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-steel-100/90">{project.summary}</p>
        {project.role && <p className="mt-3 text-sm text-steel-300">{project.role}</p>}
        {project.metrics && (
          <dl className="mt-5 flex flex-wrap gap-x-7 gap-y-3 border-t border-white/10 pt-5">
            {project.metrics.slice(0, 3).map((m) => (
              <div key={m.label}>
                <dd className="display text-xl font-bold text-sky-400">{m.value}</dd>
                <dt className="text-xs text-steel-300">{m.label}</dt>
              </div>
            ))}
          </dl>
        )}
        <span className="mt-auto pt-6 text-sm font-medium text-sky-400 group-hover:text-white">
          Read the write-up →
        </span>
      </div>
    </Link>
  )
}

/** Compact row card for the rest. */
export function CompactCard({ project }: { project: Project }) {
  return (
    <Link
      to="/projects/$slug"
      params={{ slug: project._meta.path }}
      className="group grid grid-cols-[120px_1fr] overflow-hidden rounded-xl border border-white/10 bg-ink-900/70 transition-colors hover:border-white/25 sm:grid-cols-[170px_1fr]"
    >
      <Cover project={project} className="h-full min-h-[120px]" />
      <div className="p-4 sm:p-5">
        <p className="text-xs text-steel-300">
          {project.category} · {project.dates}
        </p>
        <h3 className="display mt-1 text-lg font-bold leading-snug text-white">{project.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-steel-300">{project.summary}</p>
      </div>
    </Link>
  )
}
