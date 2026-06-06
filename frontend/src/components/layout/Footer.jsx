import { motion } from 'framer-motion'
import { Github, Linkedin, Twitter, ArrowUp, Mail, MapPin } from 'lucide-react'
import logoUrl from '../../assets/logo.png'

const NAV_LINKS = [
  { label: 'About',    href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Skills',   href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact',  href: '#contact' },
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

      {/* Main content */}
      <div className="relative max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-16 pb-10">

        {/* Top row */}
        <div className="grid md:grid-cols-3 gap-12 mb-14">

          {/* Brand */}
          <div className="space-y-5">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <img src={logoUrl} alt="Logo" className="h-10 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity duration-300" />
            </button>
            <p className="text-[var(--text-muted)] text-sm leading-relaxed font-body max-w-xs">
              Building production-grade AI systems at the intersection of LLMs, full-stack engineering, and real-world impact.
            </p>
            {/* Socials */}
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
            </div>
          </div>

          {/* Quick links */}
          <div>
            <p className="font-mono text-[10px] tracking-[0.3em] text-[var(--amber-bright)] uppercase mb-5">Navigation</p>
            <ul className="space-y-3">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <button
                    onClick={() => scrollTo(href)}
                    className="font-mono text-xs text-[var(--text-muted)] hover:text-[var(--amber-bright)] transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-3 h-px bg-[var(--border-subtle)] group-hover:bg-[var(--amber-bright)] group-hover:w-5 transition-all duration-300" />
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
              <li>
                <button
                  onClick={() => scrollTo('#contact')}
                  className="mt-2 inline-flex items-center gap-2 px-4 py-2 font-mono text-xs tracking-widest border border-[var(--amber-bright)] text-[var(--amber-bright)] hover:bg-[var(--amber-bright)] hover:text-black transition-all duration-200"
                >
                  HIRE ME →
                </button>
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
