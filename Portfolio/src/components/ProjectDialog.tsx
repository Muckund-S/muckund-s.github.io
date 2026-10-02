import { useEffect } from 'react'
import type { Project } from 'content-collections'
import { X } from 'lucide-react'
import { img, md } from '@/lib/site'

export function ProjectDialog({
  project,
  onClose,
}: {
  project: Project | null
  onClose: () => void
}) {
  useEffect(() => {
    if (!project) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [project, onClose])

  if (!project) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-ink-950/80 p-0 backdrop-blur-md animate-in fade-in md:items-center md:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-title"
    >
      <div
        className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl border border-white/10 bg-ink-900 animate-in slide-in-from-bottom-6 md:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-ink-950/70 text-steel-100 backdrop-blur hover:bg-burn-500 hover:text-ink-950"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="relative aspect-[16/9]">
          <img
            src={img(project.image, 1400)}
            alt={`${project.title}: ${project.subtitle}`}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900 to-transparent" />
        </div>

        <div className="-mt-16 relative px-6 pb-8 md:px-10 md:pb-10">
          <p className="label !text-burn-400">{project.category}</p>
          <h2
            id="project-title"
            className="mt-2 font-display text-3xl font-semibold tracking-tight text-steel-100 md:text-4xl"
          >
            {project.title}
          </h2>
          <p className="mt-1 text-steel-400">{project.subtitle}</p>

          {project.metrics && (
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {project.metrics.map((m) => (
                <div
                  key={m.label}
                  className="rounded-xl border border-white/5 bg-ink-800 p-4"
                >
                  <p className="font-display text-2xl font-semibold text-burn-400">
                    {m.value}
                  </p>
                  <p className="label mt-1 !text-[10px]">{m.label}</p>
                </div>
              ))}
            </div>
          )}

          <p className="mt-6 text-[17px] leading-relaxed text-steel-300">
            {project.description}
          </p>

          <h3 className="label mt-8">What I did</h3>
          <div
            className="bullets mt-4 text-[15px]"
            dangerouslySetInnerHTML={{ __html: md(project.content) }}
          />

          <h3 className="label mt-8">Tools & methods</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {project.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/10 px-3 py-1 text-xs text-steel-300"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
