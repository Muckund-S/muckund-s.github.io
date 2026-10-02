import type { Project } from 'content-collections'
import { img } from '@/lib/site'

export function ProjectCard({
  project,
  onOpen,
}: {
  project: Project
  onOpen: (p: Project) => void
}) {
  return (
    <button
      onClick={() => onOpen(project)}
      className="group flex h-full w-full flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] text-left transition-colors hover:border-white/25 hover:bg-white/[0.05]"
    >
      <div className="aspect-[16/10] overflow-hidden bg-ink-800">
        <img
          src={img(project.image, 900)}
          alt={`${project.title}: ${project.subtitle}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="display text-xl font-bold leading-tight text-steel-100">
            {project.title}
          </h3>
          <span className="shrink-0 rounded-full bg-white/10 px-2.5 py-1 text-xs text-steel-100">
            {project.category}
          </span>
        </div>
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
    </button>
  )
}
