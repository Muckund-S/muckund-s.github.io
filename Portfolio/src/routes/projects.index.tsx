import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { allProjects } from 'content-collections'
import { ProjectCard } from '@/components/ProjectCard'

export const Route = createFileRoute('/projects/')({
  head: () => ({ meta: [{ title: 'Projects | Muckund Sharma' }] }),
  component: Projects,
})

const projects = [...allProjects].sort((a, b) => a.order - b.order)
const categories = ['All', ...new Set(projects.map((p) => p.category))]

function Projects() {
  const [filter, setFilter] = useState('All')
  const visible =
    filter === 'All' ? projects : projects.filter((p) => p.category === filter)

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-36">
      <div className="text-center">
        <h1 className="display text-5xl font-extrabold text-white md:text-7xl">
          My Projects
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg">
          Aerospace design, analysis and fabrication work. Open a project for
          the full write-up.
        </p>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          aria-label="Filter projects by category"
          className="mt-10 rounded-lg border border-white/10 bg-ink-800 px-4 py-2.5 text-steel-100"
        >
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((p) => (
          <ProjectCard key={p._meta.path} project={p} />
        ))}
      </div>
    </div>
  )
}
