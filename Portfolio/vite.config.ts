import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import contentCollections from '@content-collections/vite'

const config = defineConfig({
  plugins: [
    contentCollections(),
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart({
      // Skip links to static files (e.g. the resume PDF) so they are copied as-is, not re-rendered.
      prerender: {
        enabled: true,
        crawlLinks: true,
        filter: (page) => !/\.[a-z0-9]+$/i.test(page.path),
      },
    }),
    viteReact(),
  ],
})

export default config
