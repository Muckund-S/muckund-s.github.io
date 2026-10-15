import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { Hud } from '@/components/Hud'

import '../styles.css'

// Show the boot sequence once per session, home page only, and never with reduced motion.
// Runs in <head> so the overlay is up before the first paint.
const bootScript =
  "try{if(location.pathname==='/'&&!sessionStorage.getItem('boot')&&!matchMedia('(prefers-reduced-motion: reduce)').matches){sessionStorage.setItem('boot','1');document.documentElement.classList.add('booting')}}catch(e){}"

const siteName = 'Muckund Sharma | Mechanical Engineering Portfolio'
const siteDescription =
  'Mechanical Engineering student at the University of Waterloo. Projects in aerospace, CFD and FEA, composites, and fabrication.'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: siteName,
      },
      {
        name: 'description',
        content: siteDescription,
      },
      {
        name: 'theme-color',
        content: '#07080a',
      },
      {
        property: 'og:title',
        content: siteName,
      },
      {
        property: 'og:description',
        content: siteDescription,
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:image',
        content: '/img/rc-livery.jpg',
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <div id="boot" aria-hidden="true">
          <ol>
            <li>MUCKUND SHARMA // PORTFOLIO</li>
            <li>&gt; AIRFRAME ......... <span className="ok">OK</span></li>
            <li>&gt; STRUCTURES ....... <span className="ok">OK</span></li>
            <li>&gt; PROPULSION ....... <span className="ok">OK</span></li>
            <li>&gt; SYSTEMS CHECK COMPLETE · CLEARED FOR TAKEOFF</li>
          </ol>
          <small>click or press any key to skip</small>
        </div>
        <Hud />
        <SiteHeader />
        <main className="min-h-screen">{children}</main>
        <SiteFooter />
        <Scripts />
      </body>
    </html>
  )
}
