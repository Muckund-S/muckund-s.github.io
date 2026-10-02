import type { Project } from 'content-collections'
import { ArrowUpRight } from 'lucide-react'
import { img } from '@/lib/site'

export function ProjectCard({
  project,
  index,
  onOpen,
  large = false,
}: {
  project: Project
  index: number
  onOpen: (p: Project) => void
  large?: boolean
}) {
  return (
    <button
      onClick={() => onOpen(project)}
      className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-ink-900 text-left transition-all duration-500 hover:-translate-y-1 hover:border-burn-500/30 hover:shadow-[0_30px_80px_-30px_rgba(255,106,43,0.35)]"
    >
      <div
        className={`relative overflow-hidden ${large ? 'aspect-[16/10]' : 'aspect-[16/10]'}`}
      >
        <img
          src={img(project.image, large ? 1100 : 760)}
          alt={`${project.title}: ${project.subtitle}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/10 to-transparent" />
        <span className="label absolute left-4 top-4 rounded-full border border-white/10 bg-ink-950/70 px-3 py-1 !text-steel-300 backdrop-blur">
          {project.category}
        </span>
        <span className="absolute right-4 top-4 font-mono text-xs text-steel-400">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-xl font-semibold tracking-tight text-steel-100">
              {project.title}
            </h3>
            <p className="mt-0.5 text-sm text-steel-400">{project.subtitle}</p>
          </div>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 text-steel-300 transition-all group-hover:rotate-45 group-hover:border-burn-500 group-hover:bg-burn-500 group-hover:text-ink-950">
            <ArrowUpRight size={16} />
          </span>
        </div>

        <p className="mt-4 line-clamp-3 text-[15px] leading-relaxed">
          {project.description}
        </p>

        {project.metrics && (
          <div className="mt-auto flex gap-6 border-t border-white/5 pt-5">
            {project.metrics.map((m) => (
              <div key={m.label}>
                <p className="font-display text-lg font-semibold text-burn-400">
                  {m.value}
                </p>
                <p className="label !text-[10px]">{m.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </button>
  )
}
