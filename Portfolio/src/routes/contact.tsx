import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Check, Copy, FileText, Linkedin, Mail } from 'lucide-react'
import { profile } from '@/lib/site'

export const Route = createFileRoute('/contact')({
  head: () => ({ meta: [{ title: 'Contact | Muckund Sharma' }] }),
  component: Contact,
})

const field =
  'w-full rounded-lg border border-white/10 bg-ink-900/80 px-4 py-3 text-steel-100 placeholder:text-steel-400/60 outline-none focus:border-sky-400'

const links = [
  { icon: Linkedin, label: 'LinkedIn', detail: 'Connect with me', href: profile.linkedin },
  { icon: FileText, label: 'Resume', detail: 'View or download PDF', href: profile.resumeFile },
]

function Contact() {
  const [copied, setCopied] = useState(false)
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }
  const [name, setName] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(
    subject || `Message from ${name || 'your portfolio'}`,
  )}&body=${encodeURIComponent(`${message}\n\n${name}`)}`

  return (
    <div className="mx-auto max-w-5xl px-6 pb-24 pt-36">
      <div className="text-center">
        <h1 className="display text-5xl font-extrabold text-white md:text-7xl">
          Contact Me
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg">
          Reach out about co-op roles, design teams, collaborations, or any
          other inquiries.
        </p>
      </div>

      <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-3">
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] pr-3 hover:border-white/25">
            <a href={`mailto:${profile.email}`} className="flex flex-1 items-center gap-4 p-5">
              <Mail size={22} className="text-sky-400" />
              <span>
                <span className="block font-medium text-steel-100">Email</span>
                <span className="text-sm text-steel-400">{profile.email}</span>
              </span>
            </a>
            <button
              type="button"
              onClick={copyEmail}
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-1.5 text-sm text-steel-100 hover:border-white/40"
              aria-live="polite"
            >
              {copied ? <Check size={15} className="text-sky-400" /> : <Copy size={15} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          {links.map(({ icon: Icon, label, detail, href }) => (
            <a
              key={label}
              href={href}
              {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-5 hover:border-white/25"
            >
              <Icon size={22} className="text-sky-400" />
              <span>
                <span className="block font-medium text-steel-100">{label}</span>
                <span className="text-sm text-steel-400">{detail}</span>
              </span>
            </a>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            window.location.href = mailto
          }}
          className="space-y-4 rounded-xl border border-white/10 bg-white/[0.03] p-6 md:p-8"
        >
          <div>
            <label htmlFor="name" className="mb-2 block text-sm text-steel-100">Name</label>
            <input id="name" required value={name} onChange={(e) => setName(e.target.value)} className={field} />
          </div>
          <div>
            <label htmlFor="subject" className="mb-2 block text-sm text-steel-100">Subject</label>
            <input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} className={field} />
          </div>
          <div>
            <label htmlFor="message" className="mb-2 block text-sm text-steel-100">Message</label>
            <textarea id="message" required rows={6} value={message} onChange={(e) => setMessage(e.target.value)} className={field} />
          </div>
          <button type="submit" className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink-950 hover:bg-sky-400">
            Open in email app
          </button>
          <p className="text-xs text-steel-400">
            This opens your email app with the message ready to send to {profile.email}.
          </p>
        </form>
      </div>
    </div>
  )
}
