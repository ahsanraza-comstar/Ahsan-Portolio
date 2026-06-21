import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { X, CalendarClock } from 'lucide-react'
import { getAbout } from '../../lib/api'

// Append dark-theme params so the embedded scheduler matches the site.
function themedUrl(url) {
  if (!url) return ''
  try {
    const u = new URL(url)
    if (u.hostname.includes('calendly.com')) {
      u.searchParams.set('hide_gdpr_banner', '1')
      u.searchParams.set('background_color', '0d0d0f')
      u.searchParams.set('text_color', 'e5e5e5')
      u.searchParams.set('primary_color', 'f5c518')
    } else if (u.hostname.includes('cal.com')) {
      u.searchParams.set('theme', 'dark')
    }
    return u.toString()
  } catch {
    return url
  }
}

export default function BookingModal() {
  const [open, setOpen] = useState(false)
  const { data: about } = useQuery({ queryKey: ['about'], queryFn: () => getAbout().then(r => r.data), staleTime: 300_000 })
  const url = about?.booking_url?.trim()

  useEffect(() => {
    const openIt = () => { if (url) setOpen(true) }
    window.addEventListener('open-booking', openIt)
    return () => window.removeEventListener('open-booking', openIt)
  }, [url])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  if (!open || !url) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div className="relative w-full max-w-3xl h-[85vh] rounded-2xl border border-white/10 bg-[#0d0d0f] shadow-2xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 shrink-0">
          <span className="flex items-center gap-2 text-white font-semibold text-sm">
            <CalendarClock size={16} className="text-[var(--btn-accent)]" /> Book a Call
          </span>
          <button onClick={() => setOpen(false)} className="text-white/40 hover:text-white transition-colors" aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <iframe
          src={themedUrl(url)}
          title="Schedule a call"
          className="flex-1 w-full bg-[#0d0d0f]"
          style={{ border: 'none' }}
        />
      </div>
    </div>
  )
}
