# AGENTS.md

A personal mechanical engineering portfolio for Muckund Sharma, built with TanStack Start and deployed to GitHub Pages as a static prerender (see `.github/workflows/deploy.yml`).

## Architecture

- **Routes** (`src/routes/`): `index.tsx` (Home), `projects.tsx`, `resume.tsx`, `contact.tsx`. `__root.tsx` renders the global `SiteHeader` (fixed glass navigation with the four tabs) and `SiteFooter`, and sets site-wide meta.
- **Content** (`content/` and `content-collections.ts`): typed Markdown collections `projects`, `jobs`, and `education`. Each has an `order` field for sorting. A Markdown body is a short bullet list, rendered with `md()` from `src/lib/site.ts` and styled by the `.bullets` class.
- **Site data** (`src/lib/site.ts`): the profile (name, tagline, LinkedIn, resume URL), stats, and skill groups. It also exports `img(file)`, which returns the path of a file in `public/img/`.
- **Components** (`src/components/`): `ProjectCard`, `ProjectDialog` (modal with project details), `SectionHeading`, header, and footer. `components/ui/` holds leftover shadcn primitives that are currently unused.
- **Contact**: email, LinkedIn and resume links plus a form that opens the visitor's mail app (`mailto:`). It works on any static host.

## Conventions

- Dark theme only. Colour tokens are in `@theme` in `src/styles.css`: `ink-*` backgrounds, `steel-*` text, `sky-400` accent, `burn-*` livery red.
- Typography: `display` utility (Archivo, semi-expanded) for headings, `wide` (expanded caps, tracked) for the subtitle. Body is Hanken Grotesk.
- Motion is minimal: only the hero uses `fade-in`. Reduced motion is respected globally.
- Always reference images through `img()` so paths stay in one place.
- Project images in `public/img/` come from Muckund's own work (CAD, CFD, FEA, photos). Five older projects that used AI-generated stand-in images are parked in `archive/`; restore one only with a real photo.

## Project pages and video

Each project is a full page at `/projects/<file-name>`, rendered from `content/projects/<file-name>.md`. Front matter sets the card and header (title, dates, category, tags, metrics, optional `image`, `gallery`, `problem` / `approach` / `result`); the Markdown body is the write-up (use `##` headings). To add a video, put an mp4 (H.264, ideally under 50 MB) in `public/video/` and set `video: name.mp4`, or set `youtube: <video id>` for a YouTube embed.
