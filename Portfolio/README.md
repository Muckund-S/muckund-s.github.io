# Muckund Sharma: Mechanical Engineering Portfolio

A sleek, dark-themed personal portfolio for Muckund Sharma, a Mechanical Engineering student at the University of Waterloo. It has four tabs:

- **Home**: hero, headline stats, featured projects, experience timeline, technical skills, and a contact call-to-action
- **Projects**: all builds, filterable by discipline, with a detail view for each
- **Resume**: work and leadership experience, education and awards, skills, and a resume download
- **Contact**: a contact form backed by Netlify Forms, plus LinkedIn and resume links

## Tech stack

- [TanStack Start](https://tanstack.com/start) (React 19, file-based routing) on Netlify
- Tailwind CSS 4 with a custom dark "engineering" theme (Space Grotesk, Inter Tight, JetBrains Mono)
- [Content Collections](https://www.content-collections.dev/) for type-safe Markdown content
- Netlify Forms for contact submissions
- Netlify Image CDN for responsive WebP images

## Editing content

All portfolio content is Markdown in `content/`:

| Folder | What it holds |
| --- | --- |
| `content/projects/` | One file per project: title, category, image, metrics, tags, and bullet details |
| `content/jobs/` | Experience and leadership roles |
| `content/education/` | Schools, degrees, and awards |

Name, tagline, LinkedIn and resume links, headline stats, and skills live in `src/lib/site.ts`. Project images live in `public/img/`. To swap in real photos, replace a file there or point a project's `image` field at a new file.

## Running locally

```bash
pnpm install
netlify dev   # or: pnpm dev
```
