import { motion } from 'framer-motion'
import { MapPin, Download, ArrowRight, Code2, Cpu, Globe } from 'lucide-react'
import Section from '../layout/Section'
import { useCounter } from '../../hooks/useCounter'

/* ── Terminal code window ── */
function buildCodeLines(about) {
  const name     = about?.name       || 'Ahsan Raza'
  const tagline  = about?.tagline    || 'AI Engineer'
  const location = about?.location   || 'Pakistan'
  const email    = about?.email      || ''
  const github   = about?.github_url || ''

  // Strip protocol for display
  const githubDisplay = github.replace(/^https?:\/\/(www\.)?/, '')

  // Parse tagline into focus array items (split by comma or use as single)
  const focusItems = tagline.includes(',')
    ? tagline.split(',').map(s => s.trim()).filter(Boolean)
    : [tagline]

  const lines = [
    { text: '// About me',                cls: 'text-[#4b5563]' },
    { text: `name:     "${name}"`,         cls: 'text-[#86efac]' },
    { text: `role:     "${focusItems[0]}"`,cls: 'text-[#86efac]' },
    { text: `location: "${location}"`,     cls: 'text-[#86efac]' },
  ]

  if (email) {
    lines.push({ text: `email:    "${email}"`, cls: 'text-[#86efac]' })
  }

  if (githubDisplay) {
    lines.push({ text: `github:   "${githubDisplay}"`, cls: 'text-[#86efac]' })
  }

  lines.push({ text: '', cls: '' })
  lines.push({ text: 'focus: [', cls: 'text-[#9ca3af]' })

  focusItems.forEach((item, i) => {
    const comma = i < focusItems.length - 1 ? ',' : ''
    lines.push({ text: `  "${item}"${comma}`, cls: 'text-[#4ade80]' })
  })

  lines.push({ text: ']',                    cls: 'text-[#9ca3af]' })
  lines.push({ text: '',                     cls: '' })
  lines.push({ text: 'status: "open_to_work"', cls: 'text-[#86efac]' })

  return lines
}

function Terminal({ about, projects, certifications }) {
  const name      = about?.name || 'A'
  const codeLines = buildCodeLines(about)

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="code-window h-full"
    >
      {/* Title bar */}
      <div className="code-window-bar">
        <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 font-mono text-xs text-[var(--text-muted)]">~/profile.json</span>
        {/* blinking cursor indicator */}
        <span className="ml-auto flex items-center gap-1">
          <motion.span
            className="w-1.5 h-1.5 rounded-full bg-[var(--amber-bright)]"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
          <span className="font-mono text-[9px] text-[var(--text-muted)]">LIVE</span>
        </span>
      </div>

      {/* Code body */}
      <div className="p-5 flex flex-col gap-0.5">
        {/* Mini avatar if photo exists */}
        {about?.avatar_url && (
          <div className="w-12 h-12 rounded overflow-hidden border border-[var(--border-subtle)] mb-4">
            <img src={about.avatar_url} alt={name} className="w-full h-full object-cover object-top" />
          </div>
        )}

        {codeLines.map((line, i) => (
          <motion.div
            key={i}
            className="flex gap-4 leading-[1.75]"
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.3 + i * 0.04 }}
          >
            <span className="text-[var(--text-muted)] select-none w-4 text-right shrink-0 text-xs opacity-30">
              {line.text ? i + 1 : ''}
            </span>
            <span className={`font-mono text-sm ${line.cls}`}>{line.text}</span>
          </motion.div>
        ))}

        {/* Blinking cursor line */}
        <div className="flex gap-4 leading-[1.75] mt-1">
          <span className="w-4 shrink-0" />
          <motion.span
            className="font-mono text-sm text-[var(--amber-bright)]"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            █
          </motion.span>
        </div>
      </div>

      {/* Bottom stats strip inside terminal */}
      <div className="border-t border-[var(--border-subtle)] grid grid-cols-3 divide-x divide-[var(--border-subtle)]">
        {[
          { v: about?.years_experience || 0, l: 'YRS' },
          { v: projects?.length ?? 0,        l: 'PROJ' },
          { v: certifications?.length ?? 0,  l: 'CERTS' },
        ].map(({ v, l }) => {
          const { count, ref } = useCounter(v) // eslint-disable-line react-hooks/rules-of-hooks
          return (
            <div key={l} ref={ref} className="px-3 py-3 text-center">
              <p className="font-display text-base font-bold text-[var(--amber-bright)]">{count}+</p>
              <p className="font-mono text-[9px] text-[var(--text-muted)] tracking-wider">{l}</p>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

/* ── Compact photo card ── */
function PhotoCard({ about }) {
  const name = about?.name || 'A'
  return (
    <div className="relative w-[200px] shrink-0">
      {/* Offset frame */}
      <div className="absolute inset-0 translate-x-2.5 translate-y-2.5 border border-[var(--amber-bright)] opacity-25" />
      {/* Dot grid */}
      <div
        className="absolute -inset-3 pointer-events-none opacity-15"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(74,222,128,0.6) 1px, transparent 1px)',
          backgroundSize: '14px 14px',
        }}
      />

      {/* Main frame */}
      <motion.div
        initial={{ opacity: 0, scale: 0.93 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden bg-[var(--bg-surface)] z-10"
        style={{
          aspectRatio: '3/4',
          boxShadow: '0 0 0 1px rgba(74,222,128,0.12), 0 16px 48px rgba(0,0,0,0.5)',
        }}
      >
        {/* Entry sweep */}
        <motion.div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(74,222,128,0.09) 50%, transparent 60%)' }}
          initial={{ x: '-100%' }}
          whileInView={{ x: '200%' }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.5, ease: 'easeInOut' }}
        />

        {/* Pulsing vignette */}
        <motion.div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(74,222,128,0.07) 100%)' }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Photo / placeholder */}
        {about?.avatar_url ? (
          <img src={about.avatar_url} alt={name} className="w-full h-full object-cover object-top" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 grid-bg">
            <motion.div
              className="w-14 h-14 border border-[var(--amber-bright)] flex items-center justify-center"
              animate={{ borderColor: ['rgba(74,222,128,0.3)', 'rgba(74,222,128,0.9)', 'rgba(74,222,128,0.3)'] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="font-display text-2xl font-bold text-[var(--amber-bright)] opacity-50 select-none">
                {name.charAt(0)}
              </span>
            </motion.div>
            <p className="font-mono text-[9px] text-[var(--text-muted)] tracking-widest">UPLOAD PHOTO</p>
          </div>
        )}

        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 z-10"
             style={{ height: '40%', background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, transparent 100%)' }} />

        {/* Corner brackets — all 4 */}
        <div className="absolute top-3 left-3 z-30"><div className="w-4 h-px bg-[var(--amber-bright)]" /><div className="w-px h-4 bg-[var(--amber-bright)]" /></div>
        <div className="absolute top-3 right-3 z-30 flex flex-col items-end"><div className="w-4 h-px bg-[var(--amber-bright)]" /><div className="w-px h-4 bg-[var(--amber-bright)] ml-auto" /></div>
        <div className="absolute bottom-3 left-3 z-30"><div className="w-px h-4 bg-[var(--amber-bright)]" /><div className="w-4 h-px bg-[var(--amber-bright)]" /></div>
        <div className="absolute bottom-3 right-3 z-30 flex flex-col items-end"><div className="w-px h-4 bg-[var(--amber-bright)] ml-auto" /><div className="w-4 h-px bg-[var(--amber-bright)]" /></div>

        {/* Name overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-3">
          <p className="font-mono text-[8px] text-[var(--amber-bright)] tracking-widest mb-0.5">AI ENGINEER</p>
          <p className="font-display font-bold text-white text-xs leading-tight">{name}</p>
        </div>
      </motion.div>

      {/* Open-to-work badge */}
      <motion.div
        className="absolute -bottom-3 -right-3 z-30 bg-[var(--bg-deep)] border border-[var(--amber-bright)] px-2.5 py-1.5"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
        animate={{ y: [0, -4, 0] }}
      >
        <div className="flex items-center gap-1.5">
          <motion.span
            className="w-1.5 h-1.5 rounded-full bg-[var(--amber-bright)]"
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="font-mono text-[9px] text-[var(--amber-bright)] font-semibold">OPEN TO WORK</span>
        </div>
      </motion.div>

      {/* Location chip */}
      <motion.div
        className="absolute -top-3 -left-1 z-30 bg-[var(--bg-deep)] border border-[var(--border-subtle)] px-2.5 py-1.5"
        initial={{ opacity: 0, y: -8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-1">
          <MapPin size={8} className="text-[var(--amber-bright)]" />
          <span className="font-mono text-[9px] text-[var(--text-muted)]">{about?.location || 'Pakistan'}</span>
        </div>
      </motion.div>
    </div>
  )
}

/* ── Main section ── */
export default function About({ about, projects, certifications }) {
  if (!about) return null

  return (
    <Section id="about" bg="deep" reveal={false}>

      {/* ── HEADER ROW: heading + photo side by side ── */}
      <div className="mb-14">
        <p className="font-mono text-xs tracking-[0.3em] text-[var(--amber-bright)] uppercase mb-6">&lt; about /&gt;</p>

        <div className="flex flex-col md:flex-row md:items-start gap-8 md:gap-10">
          {/* Heading + tagline */}
          <motion.div
            className="order-2 md:order-1 flex-1 min-w-0"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2
              className="font-display font-bold text-white mb-5"
              style={{ fontSize: 'clamp(1.8rem, 3.2vw, 3rem)', lineHeight: 1.15 }}
            >
              I build{' '}
              <span className="font-mono text-[var(--amber-bright)]">&#123;full-stack&#125;</span>{' '}
              AI applications — end to end.
            </h2>
            <p className="text-[var(--text-body)] text-sm leading-relaxed max-w-lg">
              I&apos;m an AI engineer who takes products from idea to production — training and wiring
              up LLMs, building FastAPI backends and React frontends, and shipping real systems. I care
              about clean engineering and measurable impact.
            </p>
          </motion.div>

          {/* Photo — top on mobile, right on desktop */}
          <div className="order-1 md:order-2 mt-2 shrink-0 mx-auto md:mx-0">
            <PhotoCard about={about} />
          </div>
        </div>
      </div>

      {/* ── BOTTOM ROW: terminal left | features + CTAs right ── */}
      <div className="grid lg:grid-cols-2 gap-10 border-t border-[var(--border-subtle)] pt-12">

        {/* Terminal */}
        <Terminal about={about} projects={projects} certifications={certifications} />

        {/* Features + CTAs */}
        <div className="space-y-4">
          {[
            { icon: Cpu,   label: 'LLM Engineering',  desc: 'RAG pipelines, agentic workflows, fine-tuning on custom datasets.' },
            { icon: Globe, label: 'Full-Stack Web',   desc: 'FastAPI backends + React frontends with CI/CD and cloud deployment.' },
            { icon: Code2, label: 'ML Systems',       desc: 'End-to-end model training, serving, monitoring, and drift detection.' },
          ].map(({ icon: Icon, label, desc }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group flex items-start gap-4 p-4 border border-[var(--border-subtle)] hover:border-[var(--amber-bright)] transition-colors duration-300"
            >
              <div className="w-8 h-8 border border-[var(--border-subtle)] group-hover:border-[var(--amber-bright)] flex items-center justify-center shrink-0 transition-colors duration-300">
                <Icon size={14} className="text-[var(--amber-bright)]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-mono text-xs text-white font-semibold mb-1">{label}</p>
                <p className="font-mono text-[10px] text-[var(--text-muted)] leading-relaxed">{desc}</p>
              </div>
              <span className="font-mono text-xs text-[var(--amber-bright)] opacity-0 group-hover:opacity-100 transition-opacity duration-200 self-center shrink-0">→</span>
            </motion.div>
          ))}

          {/* CTAs */}
          <motion.div
            className="flex flex-wrap gap-3 pt-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            {about.resume_url && (
              <a
                href={about.resume_url}
                download
                className="inline-flex items-center gap-2 px-5 py-2.5 font-mono text-xs tracking-widest border border-[var(--btn-accent)] text-[var(--btn-accent)] hover:bg-[var(--btn-accent)] hover:text-black transition-all duration-200"
              >
                <Download size={12} /> RESUME
              </a>
            )}
            <button
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 px-5 py-2.5 font-mono text-xs tracking-widest border border-[var(--border-subtle)] text-[var(--text-body)] hover:border-[var(--border-mid)] hover:text-white transition-all duration-200"
            >
              CONTACT ME <ArrowRight size={12} />
            </button>
          </motion.div>
        </div>
      </div>
    </Section>
  )
}