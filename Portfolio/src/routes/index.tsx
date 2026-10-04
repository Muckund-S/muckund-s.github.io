import { Link, createFileRoute } from '@tanstack/react-router'
import { Github, Linkedin, Mail } from 'lucide-react'
import { WingLab } from '@/components/WingLab'
import { img, profile } from '@/lib/site'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <>
      <section className="mx-auto grid min-h-[78vh] max-w-6xl content-center gap-12 px-6 pb-16 pt-32 lg:grid-cols-[1.35fr_1fr] lg:items-center">
        <div className="fade-in">
          <h1 className="display text-[clamp(3.5rem,11vw,8.5rem)] font-extrabold leading-[0.92]">
            <span className="name-line">
              <span className="name-gradient name-rise" style={{ animationDelay: '0.1s' }}>
                Muckund
              </span>
            </span>
            <span className="name-line">
              <span className="name-gradient name-rise" style={{ animationDelay: '0.28s' }}>
                Sharma
              </span>
            </span>
          </h1>
          <p className="wide mt-8 text-lg font-semibold text-white sm:text-xl">
            Mechanical Engineer
          </p>
          <div className="mt-3 flex items-center gap-3">
            {profile.schoolLogo && (
              <img
                src={img(profile.schoolLogo)}
                alt=""
                aria-hidden="true"
                className="h-6 w-auto sm:h-7"
              />
            )}
            <p className="text-steel-400">
              {profile.school} · BASc Mechanical Engineering
            </p>
          </div>
        </div>
        <div className="fade-in" style={{ animationDelay: '150ms' }}>
          <p className="display max-w-md text-[1.7rem] font-normal leading-[1.25] tracking-tight text-steel-100 sm:text-[2rem]">
            Driven to advance
            <br />
            and redefine
            <br />
            <span className="text-sky-400">the next era of flight.</span>
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
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="hover:text-white"
            >
              <Github size={26} />
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

      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 md:p-14">
          <h2 className="display max-w-2xl text-3xl font-bold text-white md:text-5xl">
            Let's talk about what you're building.
          </h2>
          <p className="mt-4 max-w-xl text-lg">
            I'm available for co-op roles in aerospace, structures, and
            mechanical design.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/contact"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink-950 hover:bg-sky-400"
            >
              Get in touch
            </Link>
            <Link
              to="/projects"
              className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              See my projects
            </Link>
          </div>
        </div>
      </section>

    </>
  )
}
