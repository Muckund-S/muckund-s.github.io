import { createFileRoute } from '@tanstack/react-router'
import { allProjects } from 'content-collections'
import { CompactCard, FeaturedCard } from '@/components/ProjectCard'

export const Route = createFileRoute('/projects/')({
  head: () => ({
    meta: [
      { title: 'Projects | Muckund Sharma' },
      {
        name: 'description',
        content:
          'Aerospace design, analysis and fabrication projects by Muckund Sharma: an RC aircraft analyzed with XFoil, XFLR5 and ANSYS Fluent, a carbon-fiber landing gear with FEA, and composite compression testing.',
      },
    ],
  }),
  component: Projects,
})

const projects = [...allProjects].sort((a, b) => a.order - b.order)
const featured = projects.filter((p) => p.featured)
const more = projects.filter((p) => !p.featured)

function Projects() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-36">
      <div className="text-center">
        <h1 className="display text-5xl font-extrabold text-white md:text-7xl">My Projects</h1>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg">
          Aerospace design, analysis and fabrication work.
          <br />
          Open a project for the full write-up.
        </p>
      </div>

      <section className="mt-16 space-y-6" aria-label="Featured projects">
        {featured.map((p, i) => (
          <FeaturedCard key={p._meta.path} project={p} index={i} />
        ))}
      </section>

      {more.length > 0 && (
        <section className="mt-20" aria-label="More projects">
          <h2 className="display text-2xl font-bold text-white">More projects</h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {more.map((p) => (
              <CompactCard key={p._meta.path} project={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
