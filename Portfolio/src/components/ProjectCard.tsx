import { Link } from '@tanstack/react-router'
import type { Project } from 'content-collections'
import { img } from '@/lib/site'

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      to="/projects/$slug"
      params={{ slug: project._meta.path }}
      className="group flex h-full w-full flex-col overflow-hidden rounded-xl border border-white/10 bg-ink-900/75 text-left backdrop-blur-sm transition-colors hover:border-white/25 hover:bg-ink-800/80"
    >
      {project.image && (
        <div className="aspect-[16/10] overflow-hidden bg-ink-800">
          <img
            src={img(project.image)}
            alt={`${project.title}: ${project.subtitle}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <span className="w-fit rounded-full bg-white/10 px-2.5 py-1 text-xs text-steel-100">
          {project.category}
        </span>
        <h3 className="display mt-3 text-xl font-bold leading-tight text-steel-100">
          {project.title}
        </h3>
        <p className="mt-1 text-sm text-steel-400">{project.dates}</p>
        <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed">
          {project.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.slice(0, 3).map((t) => (
            <span key={t} className="rounded-full bg-white/[0.06] px-2.5 py-1 text-xs text-steel-300">
              {t}
            </span>
          ))}
        </div>
        <span className="mt-auto pt-5 text-sm font-medium text-sky-400 group-hover:text-white">
          View details →
        </span>
      </div>
    </Link>
  )
}
