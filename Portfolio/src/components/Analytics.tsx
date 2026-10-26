import { useEffect, useRef } from 'react'
import { useRouterState } from '@tanstack/react-router'

type GoatCounter = {
  count?: (vars: { path?: string; title?: string; referrer?: string; event?: boolean }) => void
}
declare global {
  interface Window {
    goatcounter?: GoatCounter
  }
}

/**
 * GoatCounter (cookieless) only counts the first page load by itself. This counts client-side route
 * changes as pageviews and PDF downloads/views (resume, portfolio) as events. Links like
 * muckund.ca/?ref=companyname show up as a referrer in the dashboard.
 */
export function Analytics() {
  const path = useRouterState({ select: (s) => s.location.pathname })
  const first = useRef(true)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    const id = window.setTimeout(() => {
      window.goatcounter?.count?.({ path, title: document.title, referrer: '' })
    }, 150) // let the router update document.title first
    return () => window.clearTimeout(id)
  }, [path])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href$=".pdf"]') as HTMLAnchorElement | null
      if (!a) return
      const file = new URL(a.href, window.location.href).pathname.split('/').pop() ?? 'pdf'
      window.goatcounter?.count?.({ path: `download/${file}`, title: `PDF: ${file}`, event: true })
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return null
}
