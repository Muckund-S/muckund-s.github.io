import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowUpRight, Check, Linkedin, FileText, Send } from 'lucide-react'
import { profile } from '@/lib/site'

export const Route = createFileRoute('/contact')({
  head: () => ({ meta: [{ title: 'Contact | Muckund Sharma' }] }),
  component: Contact,
})

const field =
  'w-full rounded-xl border border-white/10 bg-ink-900 px-4 py-3.5 text-steel-100 placeholder:text-steel-400/60 outline-none transition-colors focus:border-burn-500 focus:ring-4 focus:ring-burn-500/15'

function Contact() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>(
    'idle',
  )

  return (
    <div className="relative">
      <div className="blueprint-grid absolute inset-x-0 top-0 h-[480px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="relative mx-auto grid max-w-6xl gap-16 px-5 pb-24 pt-36 md:pb-32 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="label animate-rise">Contact</p>
          <h1 className="animate-rise delay-1 mt-4 font-display text-5xl font-semibold tracking-tight text-steel-100 md:text-7xl">
            Let's build something<span className="text-burn-500">.</span>
          </h1>
          <p className="animate-rise delay-2 mt-6 max-w-md text-lg leading-relaxed">
            Feel free to contact me about co-op roles, design teams,
            collaborations, or any other inquiries.
          </p>

          <div className="animate-rise delay-3 mt-10 space-y-3">
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-2xl border border-white/[0.06] bg-ink-900 p-5 transition-colors hover:border-burn-500/40"
            >
              <span className="flex items-center gap-4">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/5 text-steel-100">
                  <Linkedin size={20} />
                </span>
                <span>
                  <span className="block font-medium text-steel-100">LinkedIn</span>
                  <span className="text-sm text-steel-400">Connect with me</span>
                </span>
              </span>
              <ArrowUpRight className="text-steel-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-burn-400" />
            </a>
            <a
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-2xl border border-white/[0.06] bg-ink-900 p-5 transition-colors hover:border-burn-500/40"
            >
              <span className="flex items-center gap-4">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/5 text-steel-100">
                  <FileText size={20} />
                </span>
                <span>
                  <span className="block font-medium text-steel-100">Resume</span>
                  <span className="text-sm text-steel-400">View or download PDF</span>
                </span>
              </span>
              <ArrowUpRight className="text-steel-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-burn-400" />
            </a>
          </div>
        </div>

        <div className="animate-rise delay-2 rounded-3xl border border-white/[0.06] bg-ink-900/60 p-6 backdrop-blur md:p-10">
          {status === 'sent' ? (
            <div className="flex h-full min-h-[420px] flex-col items-center justify-center text-center">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-burn-500 text-ink-950">
                <Check size={28} />
              </span>
              <h2 className="mt-6 font-display text-2xl font-semibold text-steel-100">
                Message sent
              </h2>
              <p className="mt-2 max-w-xs">
                Thanks for reaching out. I'll get back to you as soon as I can.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-8 rounded-full border border-white/15 px-5 py-2.5 text-sm text-steel-100 hover:border-white/40"
              >
                Send another
              </button>
            </div>
          ) : (
            <form
              name="contact"
              method="POST"
              data-netlify="true"
              netlify-honeypot="bot-field"
              onSubmit={(e) => {
                e.preventDefault()
                setStatus('sending')
                const formData = new FormData(e.currentTarget)
                fetch('/contact.html', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                  body: new URLSearchParams(
                    formData as unknown as Record<string, string>,
                  ).toString(),
                })
                  .then((res) => setStatus(res.ok ? 'sent' : 'error'))
                  .catch(() => setStatus('error'))
              }}
              className="space-y-5"
            >
              <input type="hidden" name="form-name" value="contact" />
              <p hidden>
                <label>
                  Don't fill this out: <input name="bot-field" />
                </label>
              </p>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="label mb-2 block">
                    Name
                  </label>
                  <input id="name" name="name" required className={field} placeholder="Jane Doe" />
                </div>
                <div>
                  <label htmlFor="email" className="label mb-2 block">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className={field}
                    placeholder="jane@company.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="label mb-2 block">
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  className={field}
                  placeholder="Co-op opportunity, collaboration…"
                />
              </div>
              <div>
                <label htmlFor="message" className="label mb-2 block">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  className={`${field} resize-none`}
                  placeholder="Tell me a bit about what you have in mind."
                />
              </div>

              {status === 'error' && (
                <p className="text-sm text-burn-400">
                  Something went wrong. Please try again or reach out on LinkedIn.
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-burn-500 px-6 py-4 text-sm font-semibold text-ink-950 transition-colors hover:bg-burn-400 disabled:opacity-60"
              >
                {status === 'sending' ? 'Sending…' : 'Send message'}
                <Send size={16} className="transition-transform group-hover:translate-x-0.5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
