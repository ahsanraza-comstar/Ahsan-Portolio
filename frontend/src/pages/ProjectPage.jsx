import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink, Github, Calendar, Tag, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { getProjects } from '../lib/api'
import { slugify } from '../lib/slug'
import SEO from '../components/ui/SEO'
import { useTilt } from '../hooks/useTilt'
import DOMPurify from 'dompurify'

/* ── Lightbox ── */
function Lightbox({ images, index, onClose }) {
  const [cur, setCur] = useState(index)
  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={onClose}>
      <button className="absolute top-4 right-4 text-white/60 hover:text-white" onClick={onClose}><X size={24} /></button>
      <button
        className="absolute left-4 text-white/60 hover:text-white p-2"
        onClick={(e) => { e.stopPropagation(); setCur(c => Math.max(0, c - 1)) }}
      ><ChevronLeft size={32} /></button>
      <img
        src={images[cur]}
        alt=""
        className="max-h-[85vh] max-w-[90vw] object-contain rounded"
        onClick={(e) => e.stopPropagation()}
      />
      <button
        className="absolute right-4 text-white/60 hover:text-white p-2"
        onClick={(e) => { e.stopPropagation(); setCur(c => Math.min(images.length - 1, c + 1)) }}
      ><ChevronRight size={32} /></button>
      <div className="absolute bottom-4 font-mono text-xs text-white/40">{cur + 1} / {images.length}</div>
    </div>
  )
}

/* ── Tech badge ── */
function TechBadge({ name }) {
  const slug = {
    'python': 'python', 'react': 'react', 'fastapi': 'fastapi',
    'typescript': 'typescript', 'docker': 'docker', 'postgresql': 'postgresql',
    'langchain': 'langchain', 'pytorch': 'pytorch', 'openai api': 'openai',
    'tailwind css': 'tailwindcss', 'redis': 'redis', 'aws': 'amazonaws',
  }[name.toLowerCase()]

  return (
    <div className="flex items-center gap-2 px-3 py-2 border border-[var(--border-subtle)] hover:border-[var(--amber-bright)] transition-colors duration-200 bg-[var(--bg-deep)]">
      {slug && (
        <img src={`https://cdn.simpleicons.org/${slug}/4ade80`} alt="" className="w-4 h-4 object-contain" />
      )}
      <span className="font-mono text-xs text-[var(--text-body)]">{name}</span>
    </div>
  )
}

export default function ProjectPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [lightbox, setLightbox] = useState(null)
  const { ref, onMouseMove, onMouseLeave } = useTilt(5)

  const { data: projects, isLoading, isError } = useQuery({
    queryKey: ['projects'],
    queryFn: () => getProjects().then(r => r.data),
    staleTime: 300_000,
  })
  const project = (projects || []).find(p => slugify(p.title) === slug || String(p.id) === slug)

  if (isLoading) return (
    <div className="min-h-screen bg-[var(--bg-void)] flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-[var(--amber-bright)] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (isError || !project) return (
    <div className="min-h-screen bg-[var(--bg-void)] flex flex-col items-center justify-center gap-4">
      <p className="font-mono text-[var(--text-muted)]">Project not found.</p>
      <button onClick={() => navigate('/')} className="font-mono text-xs text-[var(--amber-bright)] hover:underline">← Back to portfolio</button>
    </div>
  )

  const dateStr = project.created_at
    ? new Date(project.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : ''

  const images = Array.isArray(project.images) ? project.images : []

  return (
    <div className="min-h-screen bg-[var(--bg-void)]">
      <SEO
        title={project.title}
        description={project.description}
        image={project.thumbnail_url || undefined}
        url={`/projects/${slug}`}
        type="article"
      />
      {lightbox !== null && <Lightbox images={images} index={lightbox} onClose={() => setLightbox(null)} />}

      {/* Hero */}
      <div className="relative overflow-hidden border-b border-[var(--border-subtle)]">
        {/* Background cover image with overlay */}
        {project.thumbnail_url && (
          <div className="absolute inset-0">
            <img src={project.thumbnail_url} alt="" className="w-full h-full object-cover opacity-10" />
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-void)]/60 via-[var(--bg-void)]/80 to-[var(--bg-void)]" />
          </div>
        )}
        {/* Radial glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none"
          style={{ background: 'radial-gradient(circle at 80% 20%, rgba(74,222,128,0.06) 0%, transparent 60%)' }} />

        <div className="relative max-w-5xl mx-auto px-6 md:px-12 pt-10 pb-16">
          {/* Back */}
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/#projects')}
            className="flex items-center gap-2 font-mono text-xs text-[var(--text-muted)] hover:text-[var(--amber-bright)] transition-colors mb-10"
          >
            <ArrowLeft size={14} /> BACK TO PROJECTS
          </motion.button>

          <div className="grid lg:grid-cols-[1fr_320px] gap-12 items-start">
            {/* Left: info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              {/* Category + featured */}
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] tracking-widest text-[var(--amber-bright)] border border-[var(--amber-bright)] px-2 py-0.5">
                  {project.category}
                </span>
                {project.is_featured && (
                  <span className="font-mono text-[10px] tracking-widest text-[var(--text-muted)] border border-[var(--border-subtle)] px-2 py-0.5">
                    ★ FEATURED
                  </span>
                )}
              </div>

              <h1 className="font-display font-bold text-white" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.1 }}>
                {project.title}
              </h1>

              <p className="text-[var(--text-body)] text-base leading-relaxed max-w-xl">
                {project.description}
              </p>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                {project.demo_url && project.demo_url !== '#' && (
                  <a href={project.demo_url} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 font-mono text-xs tracking-widest border border-[var(--btn-accent)] text-[var(--btn-accent)] hover:bg-[var(--btn-accent)] hover:text-black transition-all duration-200">
                    LIVE DEMO <ExternalLink size={12} />
                  </a>
                )}
                {project.repo_url && project.repo_url !== '#' && (
                  <a href={project.repo_url} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 font-mono text-xs tracking-widest border border-[var(--border-subtle)] text-[var(--text-body)] hover:border-white hover:text-white transition-all duration-200">
                    <Github size={13} /> VIEW CODE
                  </a>
                )}
              </div>

              {dateStr && (
                <div className="flex items-center gap-2 text-[var(--text-muted)] font-mono text-xs">
                  <Calendar size={12} /> {dateStr}
                </div>
              )}
            </motion.div>

            {/* Right: cover image card with tilt */}
            {project.thumbnail_url && (
              <motion.div
                ref={ref}
                onMouseMove={onMouseMove}
                onMouseLeave={onMouseLeave}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="border border-[var(--border-subtle)] overflow-hidden"
                style={{ willChange: 'transform' }}
              >
                <img src={project.thumbnail_url} alt={project.title} className="w-full h-52 object-cover" />
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 py-16 space-y-16">

        {/* Tech stack */}
        {project.tech_stack?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Tag size={14} className="text-[var(--amber-bright)]" />
              <span className="font-mono text-[10px] tracking-[0.3em] text-[var(--amber-bright)] uppercase">Tech Stack</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.tech_stack.map(t => <TechBadge key={t} name={t} />)}
            </div>
          </motion.div>
        )}

        {/* Detailed description */}
        {project.long_description && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="font-mono text-[10px] tracking-[0.3em] text-[var(--amber-bright)] uppercase mb-8">Overview</p>
            <div
              className="prose prose-invert prose-sm max-w-none
                prose-headings:font-display prose-headings:text-white prose-headings:font-bold
                prose-h2:text-2xl prose-h3:text-xl
                prose-p:text-[var(--text-body)] prose-p:leading-relaxed
                prose-a:text-[var(--amber-bright)] prose-a:no-underline hover:prose-a:underline
                prose-strong:text-white
                prose-code:text-[var(--amber-bright)] prose-code:bg-[var(--bg-surface)] prose-code:px-1 prose-code:rounded
                prose-pre:bg-[var(--bg-surface)] prose-pre:border prose-pre:border-[var(--border-subtle)]
                prose-blockquote:border-l-[var(--amber-bright)] prose-blockquote:text-[var(--text-muted)]
                prose-li:text-[var(--text-body)]
                prose-hr:border-[var(--border-subtle)]
                prose-img:rounded prose-img:border prose-img:border-[var(--border-subtle)]"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(project.long_description) }}
            />
          </motion.div>
        )}

        {/* Image gallery */}
        {images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="font-mono text-[10px] tracking-[0.3em] text-[var(--amber-bright)] uppercase mb-6">
              Gallery <span className="text-[var(--text-muted)] normal-case tracking-normal">— scroll →</span>
            </p>
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-1 px-1 snap-x snap-mandatory">
              {images.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setLightbox(i)}
                  className="shrink-0 snap-start overflow-hidden rounded-lg border border-[var(--border-subtle)] hover:border-[var(--btn-accent)] transition-colors cursor-pointer group"
                >
                  <img
                    src={url}
                    alt={`Screenshot ${i + 1}`}
                    loading="lazy"
                    className="h-[22rem] sm:h-[28rem] w-auto object-cover block group-hover:scale-[1.03] transition-transform duration-500"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Back link */}
        <div className="border-t border-[var(--border-subtle)] pt-10">
          <button
            onClick={() => { navigate('/'); setTimeout(() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' }), 100) }}
            className="flex items-center gap-2 font-mono text-xs text-[var(--text-muted)] hover:text-[var(--amber-bright)] transition-colors"
          >
            <ArrowLeft size={13} /> ALL PROJECTS
          </button>
        </div>
      </div>
    </div>
  )
}
