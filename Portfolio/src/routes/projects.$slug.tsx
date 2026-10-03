import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { allProjects } from 'content-collections'
import { ArrowLeft } from 'lucide-react'
import { img, md } from '@/lib/site'

export const Route = createFileRoute('/projects/$slug')({
  loader: ({ params }) => {
    const project = allProjects.find((p) => p._meta.path === params.slug)
    if (!project) throw notFound()
    return project
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.title ?? 'Project'} | Muckund Sharma` }],
  }),
  component: ProjectPage,
})

function Media({ project }: { project: (typeof allProjects)[number] }) {
  if (project.videos) {
    return (
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {project.videos.map((v) => (
          <figure key={v.youtube}>
            <div className="aspect-video overflow-hidden rounded-xl border border-white/10">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${v.youtube}`}
                title={v.title}
                loading="lazy"
                allow="accelerometer; encrypted-media; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
            <figcaption className="mt-2 text-sm text-steel-400">{v.title}</figcaption>
          </figure>
        ))}
      </div>
    )
  }
  if (project.youtube) {
    return (
      <div className="mt-8 aspect-video overflow-hidden rounded-xl border border-white/10">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${project.youtube}`}
          title={`${project.title} video`}
          allow="accelerometer; encrypted-media; picture-in-picture"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
    )
  }
  if (project.video) {
    return (
      <video
        controls
        playsInline
        preload="metadata"
        src={`/video/${project.video}`}
        className="mt-8 max-h-[560px] w-full rounded-xl border border-white/10 bg-black"
      />
    )
  }
  return null
}

function ProjectPage() {
  const project = Route.useLoaderData()
  const hasPAR = project.problem && project.approach && project.result

  return (
    <div className="mx-auto max-w-5xl px-6 pb-24 pt-32">
      <Link
        to="/projects"
        className="inline-flex items-center gap-2 text-sm text-steel-300 hover:text-white"
      >
        <ArrowLeft size={16} /> All projects
      </Link>

      <header className="mt-8">
        <span className="rounded-full bg-sky-400 px-3 py-1 text-sm font-semibold text-ink-950">
          {project.category}
        </span>
        <h1 className="display mt-5 text-4xl font-extrabold text-white md:text-6xl">
          {project.title}
        </h1>
        <p className="mt-3 text-lg text-steel-300">{project.dates}</p>
      </header>

      <article className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-10">
        <div className="flex flex-wrap gap-2">
          {project.tags.map((t) => (
            <span key={t} className="rounded-full bg-white/[0.08] px-3.5 py-1.5 text-sm text-steel-100">
              {t}
            </span>
          ))}
        </div>

        <p className="mt-6 text-xl leading-relaxed text-steel-100/90">
          {project.description}
        </p>

        {project.metrics && (
          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
            {project.metrics.map((m) => (
              <div key={m.label}>
                <dt className="text-sm text-steel-400">{m.label}</dt>
                <dd className="display text-3xl font-bold text-sky-400">{m.value}</dd>
              </div>
            ))}
          </dl>
        )}

        <Media project={project} />

        {project.image && (
          <img
            src={img(project.image)}
            alt={project.title}
            className="mt-8 w-full rounded-xl border border-white/10 object-cover"
          />
        )}

        {hasPAR && (
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {(
              [
                ['Problem', project.problem],
                ['Approach', project.approach],
                ['Result', project.result],
              ] as const
            ).map(([title, items]) => (
              <section key={title} className="rounded-xl border border-white/10 bg-ink-900/70 p-5">
                <h2 className="display text-xl font-bold text-white">{title}</h2>
                <ul className="mt-3 list-disc space-y-2 pl-4 text-[15px] leading-relaxed text-steel-300">
                  {items!.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}

        <div
          className="prose-project mt-10"
          dangerouslySetInnerHTML={{ __html: md(project.content) }}
        />

        {project.gallery && (
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {project.gallery.map((g) => (
              <figure key={g.file}>
                <img
                  src={img(g.file)}
                  alt={g.caption}
                  loading="lazy"
                  className="w-full rounded-xl border border-white/10 bg-white object-contain"
                />
                <figcaption className="mt-2 text-sm text-steel-400">{g.caption}</figcaption>
              </figure>
            ))}
          </div>
        )}
      </article>
    </div>
  )
}
