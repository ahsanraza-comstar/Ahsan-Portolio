import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import api from '../lib/api'

// Lightweight page-view tracker — fires a non-blocking request on each route change.
// The backend endpoint is optional; if it 404s the error is silently swallowed.
export function useAnalytics() {
  const location = useLocation()

  useEffect(() => {
    const payload = {
      path: location.pathname,
      referrer: document.referrer || '',
      ts: new Date().toISOString(),
    }
    // Fire-and-forget — don't await, don't throw
    api.post('/api/analytics/pageview', payload).catch(() => {})
  }, [location.pathname])
}
