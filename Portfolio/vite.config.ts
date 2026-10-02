import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import netlify from '@netlify/vite-plugin-tanstack-start'
import contentCollections from '@content-collections/vite'

const config = defineConfig({
  plugins: [
    contentCollections(),
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    // Netlify's adapter builds a server function; GitHub Pages needs plain static files.
    ...(process.env.NETLIFY ? [netlify()] : []),
    tanstackStart({
      prerender: { enabled: true, crawlLinks: true },
    }),
    viteReact(),
  ],
})

export default config
