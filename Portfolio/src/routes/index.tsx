import { Link, createFileRoute } from '@tanstack/react-router'
import { allProjects } from 'content-collections'
import { Linkedin, Mail } from 'lucide-react'
import { ProjectCard } from '@/components/ProjectCard'
import { FlightEnvelope } from '@/components/FlightEnvelope'
import { WingLab } from '@/components/WingLab'
import { img, profile } from '@/lib/site'

export const Route = createFileRoute('/')({
  component: Home,
})

const focus = [
  {
    title: 'Aerodynamics & CFD',
    body: 'Sized and analyzed the wing of my RC trainer, MX-01, at Re ≈ 100k: XFoil and XFLR5 for airfoil and lifting-line results (peak L/D ≈ 15), then a 3D ANSYS Fluent cross-check (best simulated L/D ≈ 13.9 at 2.26°). I read pressure, velocity and turbulence fields to see where lift and drag come from, then built it and flew it 12 times.',
  },
  {
    title: 'Structures & FEA',
    body: 'For WARG I designed a carbon-fiber landing gear with a deliberate breakaway joint and checked it with orthotropic linear-static FEA across a 1–4g sweep: 3.81 factor of safety at 1g, and failure predicted at the sacrificial neck at 4g. Mesh refinement moved peak stress by only 1.22%.',
  },
  {
    title: 'Testing, Manufacturing & Data',
    body: 'Compression-tested six fiberglass laminates for the Polaris airframe to ASTM D695 / DIN EN 2850 on a 15 kN system, machined the Boeing BSS 7260 fixture on the mill and lathe, and wrote the Python pipeline that turned raw load data into stress-strain curves.',
  },
  {
    title: 'Delivery & Teamwork',
    body: 'Built a Jira workspace for a large annual volunteer event so every task had an owner and live status, mentored and evaluated six summer program staff at YRES, and coordinated procurement research across 20+ composite suppliers for Waterloo Rocketry.',
  },
]

function Home() {
  const featured = allProjects
    .filter((p) => p.featured)
    .sort((a, b) => a.order - b.order)

  return (
    <>
      <section className="mx-auto grid min-h-[78vh] max-w-6xl content-center gap-12 px-6 pb-16 pt-32 lg:grid-cols-[1.35fr_1fr] lg:items-center">
        <div className="fade-in">
          <h1 className="display name-gradient text-[clamp(3.5rem,11vw,8.5rem)] font-extrabold leading-[0.92]">
            Muckund
            <br />
            Sharma
          </h1>
          <div className="mt-8 flex items-center gap-4">
            <p className="wide text-lg font-semibold text-white sm:text-xl">
              Mechanical Engineer
            </p>
            {profile.schoolLogo && (
              <>
                <span className="h-7 w-px bg-white/25" aria-hidden="true" />
                <img
                  src={img(profile.schoolLogo)}
                  alt={profile.school}
                  className="h-9 w-auto sm:h-11"
                />
              </>
            )}
          </div>
          <p className="mt-2 text-steel-400">
            {profile.school} · BASc Mechanical Engineering
          </p>
        </div>
        <div className="fade-in" style={{ animationDelay: '150ms' }}>
          <p className="display text-3xl font-bold leading-snug text-white sm:text-4xl">
            {profile.tagline}
          </p>
          <p className="mt-5 text-lg leading-relaxed text-steel-300">
            Aerodynamics, structures, and hand-built aircraft. Looking for
            aerospace and mechanical design co-op opportunities.
          </p>
          <div className="mt-8 flex items-center gap-5 text-steel-300">
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:text-white"
            >
              <Linkedin size={26} />
            </a>
            <a
              href={`mailto:${profile.email}`}
              aria-label="Email"
              className="hover:text-white"
            >
              <Mail size={28} />
            </a>
            <Link
              to="/projects"
              className="ml-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ink-950 hover:bg-sky-400"
            >
              View projects
            </Link>
          </div>
        </div>
      </section>

      <WingLab />

      <section className="mx-auto grid max-w-6xl gap-4 px-6 pt-8 sm:grid-cols-2">
        {[
          ['rc-flight.jpg', 'Flight test of the finished RC aircraft'],
          ['rc-cfd.jpg', 'Turbulence kinetic energy around the wing section (ANSYS Fluent)'],
        ].map(([file, caption]) => (
          <figure key={file}>
            <img
              src={img(file)}
              alt={caption}
              className="aspect-[4/3] w-full rounded-xl border border-white/10 object-cover"
            />
            <figcaption className="mt-2 text-xs text-steel-400">{caption}</figcaption>
          </figure>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="display text-4xl font-bold text-white md:text-5xl">
          What I bring
        </h2>
        <div className="mt-12 divide-y divide-white/10 border-y border-white/10">
          {focus.map((f) => (
            <div key={f.title} className="grid gap-4 py-8 md:grid-cols-[1fr_2fr] md:gap-12">
              <h3 className="display text-2xl font-bold text-steel-100">{f.title}</h3>
              <p className="text-[17px] leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <FlightEnvelope />

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex items-end justify-between gap-6">
          <h2 className="display text-4xl font-bold text-white md:text-5xl">
            Selected projects
          </h2>
          <Link to="/projects" className="hidden text-sm font-medium text-sky-400 hover:text-white sm:block">
            All projects →
          </Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {featured.map((p) => (
            <ProjectCard key={p._meta.path} project={p} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 md:p-14">
          <h2 className="display max-w-2xl text-3xl font-bold text-white md:text-5xl">
            Let's talk about what you're building.
          </h2>
          <p className="mt-4 max-w-xl text-lg">
            I'm available for co-op roles in aerospace, structures, and
            mechanical design.
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink-950 hover:bg-sky-400"
          >
            Get in touch
          </Link>
        </div>
      </section>

    </>
  )
}
