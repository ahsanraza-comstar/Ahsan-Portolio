import { motion } from 'framer-motion'
import { ExternalLink, Award, Calendar, CheckCircle, ArrowRight } from 'lucide-react'
import Section from '../layout/Section'
import { useTilt } from '../../hooks/useTilt'


function CertCard({ cert, index }) {
  const { ref, onMouseMove, onMouseLeave } = useTilt(8)
  const dateStr = cert.issued_date
    ? (() => { try { return new Date(cert.issued_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) } catch { return cert.issued_date } })()
    : ''

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className="group p-6 border border-[var(--border-subtle)] bg-[var(--bg-deep)] hover:border-[var(--amber-bright)] transition-colors duration-300 relative overflow-hidden"
      style={{ willChange: 'transform' }}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-[var(--amber-bright)] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

      {/* Header row */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="w-10 h-10 border border-[var(--border-subtle)] flex items-center justify-center shrink-0 group-hover:border-[var(--amber-bright)] transition-colors duration-300">
          {cert.badge_url
            ? <img src={cert.badge_url} alt="" className="w-6 h-6 object-contain" />
            : <Award size={16} className="text-[var(--amber-bright)]" />
          }
        </div>
        <div className="flex items-center gap-1 font-mono text-xs text-[var(--amber-bright)]">
          <CheckCircle size={10} /> Verified
        </div>
      </div>

      {/* Issuer */}
      <p className="font-mono text-[10px] tracking-widest text-[var(--amber-bright)] uppercase mb-2">
        {cert.issuer}
      </p>

      {/* Title */}
      <h3 className="font-display font-bold text-white text-base leading-snug mb-3">
        {cert.title}
      </h3>

      {/* Description */}
      <p className="text-[var(--text-body)] text-xs leading-relaxed mb-5 line-clamp-2">
        {cert.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1 font-mono text-xs text-[var(--text-muted)]">
          <Calendar size={10} /> {dateStr}
        </span>
        {cert.credential_url && cert.credential_url !== '#' && (
          <a href={cert.credential_url} target="_blank" rel="noreferrer"
             className="flex items-center gap-1 font-mono text-xs text-[var(--amber-bright)] hover:underline opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            VIEW <ExternalLink size={10} />
          </a>
        )}
      </div>

      <div className="absolute bottom-0 left-0 h-px w-12 bg-[var(--amber-bright)]" />
    </motion.div>
  )
}

export default function Certifications({ certifications }) {
  const items   = certifications || []
  const issuers = [...new Set(items.map(c => c.issuer))]

  return (
    <Section id="certs" bg="void" reveal={false}>
      {/* Header */}
      <div className="grid lg:grid-cols-2 gap-8 items-end mb-14">
        <div>
          <p className="font-mono text-xs tracking-[0.3em] text-[var(--amber-bright)] uppercase mb-4">&lt; certifications /&gt;</p>
          <h2 className="font-display font-bold text-white" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: 1.15 }}>
            Concentrate on{' '}
            <span className="font-mono text-[var(--amber-bright)]">&#123;credentials&#125;</span>{' '}
            that matter.
          </h2>
        </div>
        <p className="text-[var(--text-body)] text-sm leading-relaxed lg:max-w-sm lg:ml-auto">
          Verified credentials from world-class institutions. Each certification represents hands-on expertise and real-world application.
        </p>
      </div>

      {/* Grid */}
      {items.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-[var(--border-subtle)]">
          <p className="font-mono text-xs text-[var(--text-muted)] tracking-widest">NO CERTIFICATIONS ADDED YET</p>
          <p className="font-mono text-[10px] text-[var(--text-muted)] opacity-50 mt-1">Add certifications from the admin panel</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--border-subtle)]">
          {items.map((cert, i) => (
            <div key={cert.id} className="bg-[var(--bg-void)]">
              <CertCard cert={cert} index={i} />
            </div>
          ))}
        </div>
      )}

      {/* Issuers row */}
      <motion.div
        className="flex flex-wrap justify-center items-center gap-8 mt-14 pt-8 border-t border-[var(--border-subtle)]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {issuers.map(issuer => (
          <span key={issuer} className="font-mono text-xs text-[var(--text-muted)] hover:text-[var(--text-body)] transition-colors cursor-default">
            {issuer}
          </span>
        ))}
      </motion.div>
    </Section>
  )
}
