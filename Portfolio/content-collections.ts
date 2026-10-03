import { defineCollection, defineConfig } from '@content-collections/core'
import { z } from 'zod'

const jobs = defineCollection({
  name: 'jobs',
  directory: 'content/jobs',
  include: '**/*.md',
  schema: z.object({
    jobTitle: z.string(),
    logo: z.string().optional(),
    company: z.string(),
    location: z.string(),
    startDate: z.string(),
    endDate: z.string().optional(),
    order: z.number(),
    tags: z.array(z.string()),
    content: z.string(),
  }),
})

const education = defineCollection({
  name: 'education',
  directory: 'content/education',
  include: '**/*.md',
  schema: z.object({
    school: z.string(),
    degree: z.string(),
    startDate: z.string(),
    endDate: z.string().optional(),
    order: z.number(),
    highlights: z.array(z.string()),
    content: z.string(),
  }),
})

const projects = defineCollection({
  name: 'projects',
  directory: 'content/projects',
  include: '**/*.md',
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    description: z.string(),
    category: z.string(),
    order: z.number(),
    featured: z.boolean().optional(),
    image: z.string().optional(),
    dates: z.string(),
    video: z.string().optional(),
    youtube: z.string().optional(),
    videos: z.array(z.object({ youtube: z.string(), title: z.string() })).optional(),
    gallery: z.array(z.object({ file: z.string(), caption: z.string() })).optional(),
    problem: z.array(z.string()).optional(),
    approach: z.array(z.string()).optional(),
    result: z.array(z.string()).optional(),
    tags: z.array(z.string()),
    metrics: z
      .array(z.object({ value: z.string(), label: z.string() }))
      .optional(),
    content: z.string(),
  }),
})

export default defineConfig({
  collections: [jobs, education, projects],
})
