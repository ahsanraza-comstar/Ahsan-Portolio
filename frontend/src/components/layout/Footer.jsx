import { motion } from 'framer-motion'
import { Github, Linkedin, Twitter, ArrowUp, Mail, MapPin, CalendarClock } from 'lucide-react'
import logoUrl from '../../assets/logo.png'
import { whatsappLink, WhatsAppIcon } from '../../lib/whatsapp'

const NAV_LINKS = [
  { label: 'About',      href: '#about' },
  { label: 'Services',   href: '#services' },
  { label: 'Skills',     href: '#skills' },
  { label: 'Projects',   href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Blog',       href: '#blog' },
  { label: 'Contact',    href: '#contact' },
]

export default function Footer({ about }) {
  const year = new Date().getFullYear()
  const name = about?.name || 'Ahsan Raza'

  const scrollTo = (href) => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })

  const socials = [
    { href: about?.github_url,   Icon: Github,   label: 'GitHub' },
    { href: about?.linkedin_url, Icon: Linkedin, label: 'LinkedIn' },
    { href: about?.twitter_url,  Icon: Twitter,  label: 'Twitter' },
  ].filter(s => s.href)

  return (
    <footer className="relative bg-[var(--bg-void)] border-t border-[var(--border-subtle)] overflow-hidden">

      {/* Top gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent 0%, var(--amber-bright) 40%, var(--teal-bright) 60%, transparent 100%)' }} />

      {/* Radial glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(74,222,128,0.05) 0%, transparent 70%)' }} />

      <div className="relative max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 pt-14 pb-8">

        {/* ── CTA band ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-12 mb-12 border-b border-[var(--border-subtle)]"
        >
          <div>
            <p className="font-mono text-[10px] tracking-[0.3em] text-[var(--amber-bright)] uppercase mb-3">Let&apos;s connect</p>
            <h2 className="font-display font-bold text-white leading-tight" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.5rem)' }}>
              Have a project in mind?<br />
              Let&apos;s build something{' '}
              <span className="font-mono text-[var(--amber-bright)]">together.</span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <button
              onClick={() => (about?.booking_url ? window.dispatchEvent(new Event('open-booking')) : scrollTo('#contact'))}
              className="inline-flex items-center gap-2 px-5 py-2.5 font-mono text-xs tracking-widest rounded-md border border-[var(--btn-accent)] text-[var(--btn-accent)] hover:bg-[var(--btn-accent)] hover:text-black transition-all duration-200"
            >
              <CalendarClock size={14} /> BOOK A CALL
            </button>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 font-mono text-xs tracking-widest rounded-md border border-[var(--border-subtle)] text-[var(--text-body)] hover:border-[#25D366] hover:text-[#25D366] transition-all duration-200"
            >
              <WhatsAppIcon className="w-3.5 h-3.5" /> WHATSAPP
            </a>
          </div>
        </motion.div>

        {/* ── Columns ── */}
        <div className="grid md:grid-cols-3 gap-10 mb-10">

          {/* Brand */}
          <div className="space-y-4">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <img src={logoUrl} alt="Logo" className="h-10 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity duration-300" />
            </button>
            <p className="text-[var(--text-muted)] text-sm leading-relaxed font-body max-w-xs">
              Building production-grade AI systems at the intersection of LLMs, full-stack engineering, and real-world impact.
            </p>
            <div className="flex items-center gap-3 pt-1">
              {socials.map(({ href, Icon, label }) => (
                <motion.a
                  key={label} href={href} target="_blank" rel="noreferrer"
                  whileHover={{ y: -3 }} whileTap={{ scale: 0.93 }}
                  className="w-8 h-8 border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--amber-bright)] hover:border-[var(--amber-bright)] transition-all duration-200"
                  aria-label={label}
                >
                  <Icon size={14} />
                </motion.a>
              ))}
              <motion.a
                href={whatsappLink()} target="_blank" rel="noreferrer"
                whileHover={{ y: -3 }} whileTap={{ scale: 0.93 }}
                className="w-8 h-8 border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] hover:text-[#25D366] hover:border-[#25D366] transition-all duration-200"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon className="w-3.5 h-3.5" />
              </motion.a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="font-mono text-[10px] tracking-[0.3em] text-[var(--amber-bright)] uppercase mb-5">Navigation</p>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <button
                    onClick={() => scrollTo(href)}
                    className="font-mono text-xs text-[var(--text-muted)] hover:text-[var(--amber-bright)] hover:translate-x-1 transition-all duration-200"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <p className="font-mono text-[10px] tracking-[0.3em] text-[var(--amber-bright)] uppercase mb-5">Get In Touch</p>
            <ul className="space-y-4">
              {about?.email && (
                <li className="flex items-center gap-3">
                  <div className="w-7 h-7 border border-[var(--border-subtle)] flex items-center justify-center shrink-0">
                    <Mail size={12} className="text-[var(--amber-bright)]" />
                  </div>
                  <a href={`mailto:${about.email}`} className="font-mono text-xs text-[var(--text-muted)] hover:text-[var(--amber-bright)] transition-colors break-all">
                    {about.email}
                  </a>
                </li>
              )}
              {about?.location && (
                <li className="flex items-center gap-3">
                  <div className="w-7 h-7 border border-[var(--border-subtle)] flex items-center justify-center shrink-0">
                    <MapPin size={12} className="text-[var(--amber-bright)]" />
                  </div>
                  <span className="font-mono text-xs text-[var(--text-muted)]">{about.location}</span>
                </li>
              )}
              <li className="flex items-center gap-2 pt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#28c840]" style={{ boxShadow: '0 0 6px #28c840' }} />
                <span className="font-mono text-[11px] text-[var(--text-muted)]">Available for new projects</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[var(--border-subtle)]" />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
          <p className="font-mono text-[10px] text-[var(--text-muted)] tracking-widest">
            &copy; {year} {name}. All rights reserved.
          </p>

          <p className="font-mono text-[10px] text-[var(--text-muted)] tracking-widest">
            Built with{' '}
            <span className="text-[var(--amber-bright)]">FastAPI</span>
            {' + '}
            <span className="text-[var(--amber-bright)]">React</span>
          </p>

          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 font-mono text-[10px] tracking-widest text-[var(--text-muted)] hover:text-[var(--amber-bright)] transition-colors border border-[var(--border-subtle)] hover:border-[var(--amber-bright)] px-3 py-1.5"
          >
            <ArrowUp size={10} /> BACK TO TOP
          </motion.button>
        </div>
      </div>
    </footer>
  )
}
