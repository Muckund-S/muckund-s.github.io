import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { allJobs, allProjects, type Project } from 'content-collections'
import { ArrowRight, ArrowUpRight, GraduationCap } from 'lucide-react'
import { img, profile, skillGroups, stats } from '@/lib/site'
import { ProjectCard } from '@/components/ProjectCard'
import { ProjectDialog } from '@/components/ProjectDialog'
import { SectionHeading } from '@/components/SectionHeading'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const [active, setActive] = useState<Project | null>(null)
  const featured = allProjects
    .filter((p) => p.featured)
    .sort((a, b) => a.order - b.order)
  const jobs = [...allJobs].sort((a, b) => a.order - b.order)

  return (
    <>
      {/* Hero */}
      <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden pb-16 pt-32 md:items-center md:pb-0">
        <img
          src={img('hero.png', 2000)}
          alt=""
          className="absolute inset-0 -z-20 h-full w-full object-cover opacity-55"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink-950 via-ink-950/80 to-ink-950/20" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/60" />
        <div className="blueprint-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_left,black,transparent_70%)]" />

        <div className="mx-auto w-full max-w-6xl px-5">
          <p className="label animate-rise flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-burn-500 shadow-[0_0_12px_2px_rgba(255,106,43,0.7)]" />
            {profile.role} @ {profile.school}
          </p>
          <h1 className="animate-rise delay-1 mt-6 max-w-4xl font-display text-5xl font-semibold leading-[0.95] tracking-tight text-steel-100 sm:text-7xl md:text-8xl">
            Muckund
            <br />
            <span className="text-steel-400">Sharma</span>
            <span className="text-burn-500">.</span>
          </h1>
          <p className="animate-rise delay-2 mt-8 max-w-xl text-lg leading-relaxed text-steel-300 md:text-xl">
            {profile.tagline} I design, simulate, and build mechanical systems,
            from hand-cranked mechanisms to model rockets.
          </p>
          <div className="animate-rise delay-3 mt-10 flex flex-wrap gap-3">
            <Link
              to="/projects"
              className="group inline-flex items-center gap-2 rounded-full bg-burn-500 px-6 py-3.5 text-sm font-semibold text-ink-950 transition-colors hover:bg-burn-400"
            >
              View projects
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
            <Link
              to="/resume"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3.5 text-sm font-medium text-steel-100 backdrop-blur transition-colors hover:border-white/40"
            >
              Experience & resume
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/5 bg-ink-900/50">
        <div className="mx-auto grid max-w-6xl grid-cols-2 md:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`px-5 py-8 md:py-10 ${i > 0 ? 'md:border-l' : ''} ${i % 2 ? 'border-l' : ''} ${i > 1 ? 'border-t md:border-t-0' : ''} border-white/5`}
            >
              <p className="font-display text-4xl font-semibold tracking-tight text-steel-100 md:text-5xl">
                {s.value}
              </p>
              <p className="label mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured projects */}
      <section className="mx-auto max-w-6xl px-5 py-24 md:py-32">
        <SectionHeading index="01" eyebrow="Selected work" title="Featured projects">
          <Link
            to="/projects"
            className="group inline-flex items-center gap-2 text-sm text-steel-100"
          >
            All projects
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </SectionHeading>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((p, i) => (
            <ProjectCard key={p._meta.path} project={p} index={i} onOpen={setActive} />
          ))}
        </div>
      </section>

      {/* Experience preview */}
      <section className="relative border-t border-white/5 bg-ink-900/40">
        <div className="blueprint-grid absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="relative mx-auto grid max-w-6xl gap-16 px-5 py-24 md:grid-cols-[1fr_1.4fr] md:py-32">
          <div>
            <SectionHeading index="02" eyebrow="Experience" title="Where I build" />
            <div className="rounded-2xl border border-white/[0.06] bg-ink-900 p-6">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-burn-500/10 text-burn-400">
                  <GraduationCap size={20} />
                </span>
                <div>
                  <p className="font-display font-semibold text-steel-100">
                    University of Waterloo
                  </p>
                  <p className="text-sm text-steel-400">
                    BASc Mechanical Engineering · 2025–2030
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed">
                3.98 GPA, President's Scholarship of Distinction, and the
                Class of 1988 "BatMech" Leadership Award.
              </p>
            </div>
          </div>

          <ol className="relative border-l border-white/10">
            {jobs.map((j) => (
              <li key={j._meta.path} className="group relative pb-10 pl-8 last:pb-0">
                <span className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full border border-burn-500 bg-ink-950 transition-colors group-hover:bg-burn-500" />
                <p className="label">
                  {j.startDate} to {j.endDate ?? 'Present'}
                </p>
                <h3 className="mt-2 font-display text-xl font-semibold text-steel-100">
                  {j.company}
                </h3>
                <p className="text-sm text-burn-400">{j.jobTitle}</p>
              </li>
            ))}
            <li className="pl-8 pt-2">
              <Link
                to="/resume"
                className="group inline-flex items-center gap-2 text-sm text-steel-100"
              >
                Full resume
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </li>
          </ol>
        </div>
      </section>

      {/* Skills */}
      <section className="mx-auto max-w-6xl px-5 py-24 md:py-32">
        <SectionHeading index="03" eyebrow="Toolkit" title="Technical skills" />
        <div className="grid gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-4">
          {skillGroups.map((g) => (
            <div key={g.title} className="bg-ink-950 p-6 transition-colors hover:bg-ink-900">
              <p className="label !text-burn-400">{g.title}</p>
              <ul className="mt-5 space-y-2.5">
                {g.items.map((s) => (
                  <li key={s} className="text-[15px] text-steel-100">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 pb-24 md:pb-32">
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-br from-ink-800 to-ink-900 p-10 md:p-16">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-burn-500/20 blur-3xl" />
          <p className="label relative">Let's talk</p>
          <h2 className="relative mt-4 max-w-2xl font-display text-3xl font-semibold tracking-tight text-steel-100 md:text-5xl">
            Looking for co-op opportunities in aerospace & mechanical design.
          </h2>
          <div className="relative mt-8 flex flex-wrap gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-steel-100 px-6 py-3.5 text-sm font-semibold text-ink-950 transition-colors hover:bg-burn-500"
            >
              Get in touch <ArrowRight size={16} />
            </Link>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3.5 text-sm font-medium text-steel-100 hover:border-white/40"
            >
              LinkedIn <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </section>

      <ProjectDialog project={active} onClose={() => setActive(null)} />
    </>
  )
}
