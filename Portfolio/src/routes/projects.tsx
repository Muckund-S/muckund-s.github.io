import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { allProjects, type Project } from 'content-collections'
import { ProjectCard } from '@/components/ProjectCard'
import { ProjectDialog } from '@/components/ProjectDialog'

export const Route = createFileRoute('/projects')({
  head: () => ({ meta: [{ title: 'Projects | Muckund Sharma' }] }),
  component: Projects,
})

const projects = [...allProjects].sort((a, b) => a.order - b.order)
const categories = ['All', ...new Set(projects.map((p) => p.category))]

function Projects() {
  const [filter, setFilter] = useState('All')
  const [active, setActive] = useState<Project | null>(null)
  const visible =
    filter === 'All' ? projects : projects.filter((p) => p.category === filter)

  return (
    <div className="relative">
      <div className="blueprint-grid absolute inset-x-0 top-0 h-[480px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="relative mx-auto max-w-6xl px-5 pb-24 pt-36 md:pb-32">
        <p className="label animate-rise">
          <span className="text-burn-400">{String(projects.length).padStart(2, '0')}</span>{' '}
          / Projects
        </p>
        <h1 className="animate-rise delay-1 mt-4 max-w-3xl font-display text-5xl font-semibold tracking-tight text-steel-100 md:text-7xl">
          Things I've designed & built.
        </h1>
        <p className="animate-rise delay-2 mt-6 max-w-2xl text-lg leading-relaxed">
          Each project is modelled in CAD, simulated where it counts, and then
          fabricated by hand. Select a project to see the details.
        </p>

        <div className="animate-rise delay-3 mt-12 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                filter === c
                  ? 'border-burn-500 bg-burn-500 font-medium text-ink-950'
                  : 'border-white/10 text-steel-300 hover:border-white/30 hover:text-steel-100'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {visible.map((p) => (
            <div key={p._meta.path} className="animate-rise">
              <ProjectCard
                project={p}
                index={projects.indexOf(p)}
                onOpen={setActive}
                large
              />
            </div>
          ))}
        </div>
      </div>

      <ProjectDialog project={active} onClose={() => setActive(null)} />
    </div>
  )
}
