import { createFileRoute } from '@tanstack/react-router'
import { allEducations, allJobs } from 'content-collections'
import { Award, Download, MapPin } from 'lucide-react'
import { md, profile, skillGroups } from '@/lib/site'

export const Route = createFileRoute('/resume')({
  head: () => ({ meta: [{ title: 'Resume | Muckund Sharma' }] }),
  component: Resume,
})

const jobs = [...allJobs].sort((a, b) => a.order - b.order)
const schools = [...allEducations].sort((a, b) => a.order - b.order)

function Resume() {
  return (
    <div className="relative">
      <div className="blueprint-grid absolute inset-x-0 top-0 h-[480px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="relative mx-auto max-w-6xl px-5 pb-24 pt-36 md:pb-32">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="label animate-rise">Resume</p>
            <h1 className="animate-rise delay-1 mt-4 font-display text-5xl font-semibold tracking-tight text-steel-100 md:text-7xl">
              Experience<span className="text-burn-500">.</span>
            </h1>
          </div>
          <a
            href={profile.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="animate-rise delay-2 inline-flex w-fit items-center gap-2 rounded-full bg-burn-500 px-6 py-3.5 text-sm font-semibold text-ink-950 transition-colors hover:bg-burn-400"
          >
            <Download size={16} /> Download resume
          </a>
        </div>

        <div className="mt-20 grid gap-16 lg:grid-cols-[220px_1fr]">
          <h2 className="label lg:sticky lg:top-28 lg:self-start">
            <span className="text-burn-400">01</span> / Work & leadership
          </h2>
          <div className="space-y-6">
            {jobs.map((j) => (
              <article
                key={j._meta.path}
                className="group rounded-2xl border border-white/[0.06] bg-ink-900 p-6 transition-colors hover:border-white/15 md:p-8"
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="font-display text-2xl font-semibold tracking-tight text-steel-100">
                      {j.company}
                    </h3>
                    <p className="mt-1 text-burn-400">{j.jobTitle}</p>
                  </div>
                  <div className="md:text-right">
                    <p className="label !text-steel-300">
                      {j.startDate} to {j.endDate ?? 'Present'}
                    </p>
                    <p className="mt-1 inline-flex items-center gap-1 text-sm text-steel-400">
                      <MapPin size={13} /> {j.location}
                    </p>
                  </div>
                </div>
                <div
                  className="bullets mt-6 text-[15px]"
                  dangerouslySetInnerHTML={{ __html: md(j.content) }}
                />
                <div className="mt-6 flex flex-wrap gap-2">
                  {j.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/10 px-3 py-1 text-xs"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <h2 className="label lg:sticky lg:top-28 lg:self-start">
            <span className="text-burn-400">02</span> / Education
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {schools.map((s) => (
              <article
                key={s._meta.path}
                className="rounded-2xl border border-white/[0.06] bg-ink-900 p-6 md:p-8"
              >
                <p className="label !text-steel-300">
                  {s.startDate} to {s.endDate ?? 'Present'}
                </p>
                <h3 className="mt-3 font-display text-xl font-semibold text-steel-100">
                  {s.school}
                </h3>
                <p className="mt-1 text-sm text-burn-400">{s.degree}</p>
                <ul className="mt-6 space-y-3">
                  {s.highlights.map((h) => (
                    <li key={h} className="flex gap-3 text-[15px]">
                      <Award size={16} className="mt-0.5 shrink-0 text-steel-400" />
                      {h}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <h2 className="label lg:sticky lg:top-28 lg:self-start">
            <span className="text-burn-400">03</span> / Skills
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {skillGroups.map((g) => (
              <div key={g.title}>
                <p className="font-display font-semibold text-steel-100">{g.title}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {g.items.map((s) => (
                    <span
                      key={s}
                      className="rounded-lg border border-white/[0.06] bg-ink-900 px-3 py-1.5 text-sm text-steel-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
