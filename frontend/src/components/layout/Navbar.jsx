import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Menu, X } from 'lucide-react'
import logoUrl from '../../assets/logo.png'
import { getAbout } from '../../lib/api'

const ALL_NAV_LINKS = [
  { href: '#about',        label: 'ABOUT' },
  { href: '#services',     label: 'SERVICES' },
  { href: '#skills',       label: 'SKILLS' },
  { href: '#certs',        label: 'CERTS' },
  { href: '#projects',     label: 'PROJECTS' },
  { href: '#experience',   label: 'EXP' },
  { href: '#testimonials', label: 'REVIEWS' },
  { href: '#blog',         label: 'BLOG' },
  { href: '#contact',      label: 'CONTACT' },
]

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false)
  const [active, setActive]         = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [visibleLinks, setVisibleLinks] = useState(ALL_NAV_LINKS)

  // After mount (and after data-driven sections render), filter to only
  // links whose target section actually exists in the DOM.
  useEffect(() => {
    const check = () => {
      const present = ALL_NAV_LINKS.filter(({ href }) => !!document.querySelector(href))
      setVisibleLinks(present)
    }
    // Run immediately and again after a short delay to catch async-rendered sections
    check()
    const t = setTimeout(check, 1500)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const sections = visibleLinks
        .map(({ href }) => document.querySelector(href))
        .filter(Boolean)
      const navH = 80
      let current = ''
      for (const el of sections) {
        if (el.getBoundingClientRect().top <= navH + 10) {
          current = '#' + el.id
        }
      }
      setActive(current)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [visibleLinks])

  const scrollTo = (href) => {
    setMobileOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  // Primary CTA: open the booking scheduler if a link is set, else go to Contact.
  const { data: about } = useQuery({ queryKey: ['about'], queryFn: () => getAbout().then(r => r.data), staleTime: 300_000 })
  const hasBooking = !!about?.booking_url?.trim()
  const ctaLabel = hasBooking ? 'BOOK A CALL' : 'HIRE ME →'
  const onCTA = () => {
    setMobileOpen(false)
    if (hasBooking) window.dispatchEvent(new Event('open-booking'))
    else scrollTo('#contact')
  }

  return (
    <>
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'navbar-scrolled' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">

          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <img src={logoUrl} alt="Logo" className="h-10 w-auto object-contain" />
          </button>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-5">
            {visibleLinks.map(({ href, label }) => (
              <li key={href}>
                <button
                  onClick={() => scrollTo(href)}
                  className={`font-mono text-xs tracking-widest transition-colors duration-200 ${
                    active === href
                      ? 'text-[var(--amber-bright)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-body)]'
                  }`}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onCTA}
              className="hidden md:flex items-center gap-1.5 font-mono text-xs tracking-widest bg-[var(--btn-accent)] text-black px-4 py-2 hover:brightness-110 transition-all duration-200"
            >
              {ctaLabel}
            </button>

            {/* Mobile burger */}
            <button
              className="md:hidden text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1"
              onClick={() => setMobileOpen(v => !v)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/80"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 bottom-0 z-50 w-64 bg-[var(--bg-deep)] border-l border-[var(--border-subtle)] flex flex-col p-6 pt-16 gap-1"
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <button className="absolute top-5 right-5 text-[var(--text-muted)]" onClick={() => setMobileOpen(false)}>
                <X size={18} />
              </button>
              {visibleLinks.map(({ href, label }, i) => (
                <motion.button
                  key={href}
                  onClick={() => scrollTo(href)}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`text-left px-3 py-3 font-mono text-xs tracking-widest transition-colors border-b border-[var(--border-subtle)] ${
                    active === href ? 'text-[var(--amber-bright)]' : 'text-[var(--text-body)]'
                  }`}
                >
                  {label}
                </motion.button>
              ))}
              <button
                onClick={onCTA}
                className="mt-4 font-mono text-xs tracking-widest bg-[var(--btn-accent)] text-black px-4 py-2.5 text-center hover:brightness-110 transition-all"
              >
                {ctaLabel}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
