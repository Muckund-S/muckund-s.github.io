# AGENTS.md

A personal mechanical engineering portfolio for Muckund Sharma, built with TanStack Start and deployed on Netlify.

## Architecture

- **Routes** (`src/routes/`): `index.tsx` (Home), `projects.tsx`, `resume.tsx`, `contact.tsx`. `__root.tsx` renders the global `SiteHeader` (fixed glass navigation with the four tabs) and `SiteFooter`, and sets site-wide meta.
- **Content** (`content/` and `content-collections.ts`): typed Markdown collections `projects`, `jobs`, and `education`. Each has an `order` field for sorting. A Markdown body is a short bullet list, rendered with `md()` from `src/lib/site.ts` and styled by the `.bullets` class.
- **Site data** (`src/lib/site.ts`): the profile (name, tagline, LinkedIn, resume URL), stats, and skill groups. It also exports `img(file, width)`, which builds Netlify Image CDN URLs for files in `public/img/`.
- **Components** (`src/components/`): `ProjectCard`, `ProjectDialog` (modal with project details), `SectionHeading`, header, and footer. `components/ui/` holds leftover shadcn primitives that are currently unused.
- **Contact form**: Netlify Forms. `public/contact.html` is the static form definition that Netlify detects at deploy time. Its fields must match the React form in `contact.tsx` (name, email, subject, message, honeypot `bot-field`). The React form POSTs URL-encoded data to `/contact.html`.

## Conventions

- Dark theme only. Use the colour tokens defined in `@theme` in `src/styles.css`: `ink-*` for backgrounds, `steel-*` for text, `burn-*` for the orange accent, and `ice-400`.
- Typography: `font-display` (Space Grotesk) for headings. The `.label` utility (mono, uppercase, tracked) is for eyebrows and metadata.
- Entrance motion: use `animate-rise` with `delay-1` to `delay-4`. Reduced motion is respected globally.
- Always reference images through `img()` so they go through the Image CDN. Don't link the raw PNGs.
- Project images in `public/img/` were AI-generated stand-ins styled to match the theme. Replace them with real project photos when they're available.
