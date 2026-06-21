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
      <div className="relative w-full max-w-3xl h-[85vh] rounded-xl border border-white/10 bg-[#0c0c0e] shadow-2xl overflow-hidden flex flex-col font-mono" onClick={e => e.stopPropagation()}>
        {/* macOS terminal title bar — red dot closes */}
        <div className="relative flex items-center gap-2 px-4 py-2.5 bg-[#1b1b1e] border-b border-white/10 shrink-0">
          <button
            onClick={() => setOpen(false)}
            aria-label="Close"
            title="Close"
            className="group w-3 h-3 rounded-full bg-[#ff5f57] flex items-center justify-center hover:brightness-110 transition"
          >
            <X size={8} strokeWidth={3} className="text-black/70 opacity-0 group-hover:opacity-100" />
          </button>
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          <span className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-[11px] text-white/40">
            <CalendarClock size={12} className="text-[var(--btn-accent)]" /> book-a-call — zsh
          </span>
        </div>
        {/* Calendly renders its own scrollbar inside a cross-origin iframe, which
            can't be recolored. We clip it by making the iframe slightly wider than
            its container so the native scrollbar falls outside the visible area
            (wheel/trackpad scrolling still works). */}
        <div className="flex-1 overflow-hidden">
          <iframe
            src={themedUrl(url)}
            title="Schedule a call"
            className="block h-full bg-[#0d0d0f]"
            style={{ border: 'none', width: 'calc(100% + 17px)' }}
          />
        </div>
      </div>
    </div>
  )
}
