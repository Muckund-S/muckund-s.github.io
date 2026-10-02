# Muckund Sharma: Mechanical Engineering Portfolio

A dark-themed personal portfolio for Muckund Sharma, a Mechanical Engineering student at the University of Waterloo. It has four pages:

- **Home**: hero, what I bring, selected projects, and a contact call-to-action
- **Projects**: all projects, filterable by category, each with a Problem / Approach / Result view
- **Resume**: work and leadership experience, education and awards, skills, and a resume download
- **Contact**: email, LinkedIn and resume links, plus a form that opens your mail app

## Tech stack

- [TanStack Start](https://tanstack.com/start) (React 19, file-based routing), prerendered to static files
- Tailwind CSS 4 (Archivo and Hanken Grotesk)
- [Content Collections](https://www.content-collections.dev/) for type-safe Markdown content
- Deployed to GitHub Pages with GitHub Actions (`.github/workflows/deploy.yml`)

## Editing content

All portfolio content is Markdown in `content/`:

| Folder | What it holds |
| --- | --- |
| `content/projects/` | One file per project: title, category, image, gallery, Problem / Approach / Result, metrics, tags |
| `content/jobs/` | Experience and leadership roles |
| `content/education/` | Schools, degrees, and awards |

Name, email, LinkedIn, resume path, and skills live in `src/lib/site.ts`. Images live in `public/img/`, and the resume PDF is `public/Muckund-Sharma-Resume.pdf`.

## Running locally

```bash
pnpm install
pnpm dev
```
