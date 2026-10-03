import { createFileRoute } from '@tanstack/react-router'
import { allEducations, allJobs } from 'content-collections'
import { Download, FileText, MapPin } from 'lucide-react'
import { img, md, profile, skillGroups } from '@/lib/site'

export const Route = createFileRoute('/resume')({
  head: () => ({ meta: [{ title: 'Resume | Muckund Sharma' }] }),
  component: Resume,
})

const jobs = [...allJobs].sort((a, b) => a.order - b.order)
const schools = [...allEducations].sort((a, b) => a.order - b.order)

function Resume() {
  return (
    <div className="mx-auto max-w-4xl px-6 pb-24 pt-36">
      <div className="text-center">
        <h1 className="display text-5xl font-extrabold text-white md:text-7xl">
          Experience
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg">
          Design team work, materials testing, and project coordination,
          alongside a mechanical engineering degree at Waterloo.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href={profile.resumeFile}
            download
            className="inline-flex items-center gap-2 rounded-full bg-sky-400 px-6 py-3 text-sm font-semibold text-ink-950 hover:bg-white"
          >
            <Download size={16} /> Download Resume
          </a>
          <a
            href={profile.resumeFile}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
          >
            <FileText size={16} /> View Resume
          </a>
        </div>
      </div>

      <Section title="Work Experience">
        {jobs.map((j) => (
          <Entry
            key={j._meta.path}
            title={j.jobTitle}
            logo={j.logo}
            org={j.company}
            place={j.location}
            dates={`${j.startDate} – ${j.endDate ?? 'Present'}`}
            tags={j.tags}
            body={j.content}
          />
        ))}
      </Section>

      <Section title="Education">
        {schools.map((s) => (
          <Entry
            key={s._meta.path}
            title={s.degree}
            org={s.school}
            dates={`${s.startDate} – ${s.endDate ?? 'Present'}`}
            list={s.highlights}
          />
        ))}
      </Section>

      <Section title="Technical Skills">
        <div className="grid gap-4 sm:grid-cols-2">
          {skillGroups.map((g) => (
            <div key={g.title} className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
              <h3 className="display text-lg font-bold text-white">{g.title}</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {g.items.map((i) => (
                  <span key={i} className="rounded-full bg-white/[0.07] px-3 py-1 text-sm text-steel-100">
                    {i}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-20">
      <h2 className="display text-3xl font-bold text-white">{title}</h2>
      <div className="mt-8 space-y-6 border-l border-white/15 pl-8 md:ml-2">
        {children}
      </div>
    </section>
  )
}

function Entry({
  title,
  logo,
  org,
  place,
  dates,
  tags,
  body,
  list,
}: {
  title: string
  logo?: string
  org: string
  place?: string
  dates: string
  tags?: string[]
  body?: string
  list?: string[]
}) {
  return (
    <div className="relative">
      <span className="absolute -left-[37px] top-8 h-2.5 w-2.5 rounded-full bg-sky-400" />
      <article className="rounded-xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
        <div className="flex items-start gap-4">
          {logo && (
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04] p-2.5">
              <img src={img(logo)} alt="" className="max-h-full max-w-full object-contain" />
            </div>
          )}
          <div>
            <h3 className="display text-2xl font-bold text-white">{title}</h3>
            <p className="mt-1 flex flex-wrap items-center gap-x-3 text-steel-300">
              <span className="font-medium text-sky-400">{org}</span>
              {place && (
                <span className="inline-flex items-center gap-1 text-sm">
                  <MapPin size={13} /> {place}
                </span>
              )}
            </p>
            <p className="mt-1 text-sm text-steel-400">{dates}</p>
          </div>
        </div>
        {body && (
          <div
            className="bullets mt-5 text-[15px]"
            dangerouslySetInnerHTML={{ __html: md(body) }}
          />
        )}
        {list && (
          <ul className="mt-5 space-y-2.5 text-[15px]">
            {list.map((h) => (
              <li
                key={h}
                className="relative pl-5 leading-relaxed before:absolute before:left-0 before:top-[0.65em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-sky-400/70"
              >
                {h}
              </li>
            ))}
          </ul>
        )}
        {tags && (
          <div className="mt-5 flex flex-wrap gap-2">
            {tags.map((t) => (
              <span key={t} className="rounded-full bg-white/[0.07] px-3 py-1 text-xs text-steel-100">
                {t}
              </span>
            ))}
          </div>
        )}
      </article>
    </div>
  )
}
