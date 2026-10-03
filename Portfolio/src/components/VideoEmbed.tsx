import { Play } from 'lucide-react'
import { useState } from 'react'

/**
 * A click-to-play video that looks like part of the page. It shows a poster and
 * a custom play button; only after the click does it load the YouTube player
 * (privacy-enhanced domain, no related videos, minimal branding).
 */
export function VideoEmbed({ id, title }: { id: string; title: string }) {
  const [playing, setPlaying] = useState(false)
  const [poster, setPoster] = useState<string | null>(
    `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
  )

  if (playing) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&color=white`}
        title={title}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        className="aspect-video w-full rounded-xl border border-white/10 bg-black"
      />
    )
  }

  return (
    <button
      type="button"
      data-nozoom
      onClick={() => setPlaying(true)}
      aria-label={`Play video: ${title}`}
      className="group relative block aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-ink-800 to-ink-950 text-left"
    >
      {poster && (
      <img
        src={poster}
        alt=""
        loading="lazy"
        onError={() =>
          setPoster((p) => (p?.includes('maxres') ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null))
        }
        onLoad={(e) => {
          // A missing max-res thumbnail comes back as a tiny placeholder.
          if (e.currentTarget.naturalWidth <= 120) {
            setPoster(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`)
          }
        }}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />
      )}
      <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />
      <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink-950 shadow-lg transition-transform group-hover:scale-110">
        <Play size={26} className="ml-1 fill-current" />
      </span>
      <span className="absolute bottom-3 left-4 right-4 text-sm font-medium text-white">
        {title}
      </span>
    </button>
  )
}
