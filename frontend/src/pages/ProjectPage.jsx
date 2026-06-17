import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink, Github, Calendar, ChevronLeft, ChevronRight, X, Star } from 'lucide-react'
import { getProjects } from '../lib/api'
import { slugify } from '../lib/slug'
import SEO from '../components/ui/SEO'
import DOMPurify from 'dompurify'

/* ── Lightbox ── */
function Lightbox({ images, index, onClose }) {
  const [cur, setCur] = useState(index)
  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={onClose}>
      <button className="absolute top-4 right-4 text-white/60 hover:text-white" onClick={onClose}><X size={24} /></button>
      <button className="absolute left-4 text-white/60 hover:text-white p-2"
        onClick={(e) => { e.stopPropagation(); setCur(c => Math.max(0, c - 1)) }}><ChevronLeft size={32} /></button>
      <img src={images[cur]} alt="" className="max-h-[88vh] max-w-[90vw] object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
      <button className="absolute right-4 text-white/60 hover:text-white p-2"
        onClick={(e) => { e.stopPropagation(); setCur(c => Math.min(images.length - 1, c + 1)) }}><ChevronRight size={32} /></button>
      <div className="absolute bottom-4 font-mono text-xs text-white/40">{cur + 1} / {images.length}</div>
    </div>
  )
}

/* ── Tech chip ── */
function TechBadge({ name }) {
  const slug = {
    'python': 'python', 'react': 'react', 'fastapi': 'fastapi', 'typescript': 'typescript',
    'docker': 'docker', 'postgresql': 'postgresql', 'langchain': 'langchain', 'pytorch': 'pytorch',
    'openai api': 'openai', 'tailwind css': 'tailwindcss', 'redis': 'redis', 'aws': 'amazonaws',
    'flutter': 'flutter', 'dart': 'dart', 'firebase': 'firebase', 'supabase': 'supabase',
    'laravel': 'laravel', 'php': 'php', 'javascript': 'javascript', 'flask': 'flask', 'sqlite': 'sqlite',
  }[name.toLowerCase()]
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 border border-white/10 hover:border-[var(--btn-accent)] transition-colors duration-200 bg-[var(--bg-deep)] rounded-lg">
      {slug && <img src={`https://cdn.simpleicons.org/${slug}/f5c518`} alt="" className="w-3.5 h-3.5 object-contain" />}
      <span className="font-mono text-xs text-[var(--text-body)]">{name}</span>
    </div>
  )
}

const cardBase = 'rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:border-white/[0.16] transition-colors duration-300'
const label = 'font-mono text-[10px] tracking-[0.3em] text-[var(--btn-accent)] uppercase'

export default function ProjectPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [lightbox, setLightbox] = useState(null)

  const { data: projects, isLoading, isError } = useQuery({
    queryKey: ['projects'],
    queryFn: () => getProjects().then(r => r.data),
    staleTime: 300_000,
  })
  const project = (projects || []).find(p => slugify(p.title) === slug || String(p.id) === slug)

  if (isLoading) return (
    <div className="min-h-screen bg-[var(--bg-void)] flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-[var(--btn-accent)] border-t-transparent rounded-full animate-spin" />
    </div>
  )
  if (isError || !project) return (
    <div className="min-h-screen bg-[var(--bg-void)] flex flex-col items-center justify-center gap-4">
      <p className="font-mono text-[var(--text-muted)]">Project not found.</p>
      <button onClick={() => navigate('/')} className="font-mono text-xs text-[var(--btn-accent)] hover:underline">← Back to portfolio</button>
    </div>
  )

  const dateStr = project.created_at
    ? new Date(project.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : ''
  const images = Array.isArray(project.images) ? project.images : []
  const heroImage = project.thumbnail_url || images[0] || null

  const cardEnter = (d = 0) => ({
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay: d, ease: [0.16, 1, 0.3, 1] },
  })

  return (
    <div className="min-h-screen bg-[var(--bg-void)] relative">
      <SEO title={project.title} description={project.description} image={project.thumbnail_url || undefined} url={`/projects/${slug}`} type="article" />
      {lightbox !== null && <Lightbox images={images} index={lightbox} onClose={() => setLightbox(null)} />}

      {/* ambient glow */}
      <div className="absolute top-0 inset-x-0 h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 100% at 50% 0%, rgba(245,197,24,0.06) 0%, transparent 70%)' }} />

      <div className="relative max-w-6xl mx-auto px-5 md:px-10 py-12">
        {/* Back */}
        <motion.button {...cardEnter()} onClick={() => navigate('/#projects')}
          className="flex items-center gap-2 font-mono text-xs text-[var(--text-muted)] hover:text-[var(--btn-accent)] transition-colors mb-8">
          <ArrowLeft size={14} /> BACK TO PROJECTS
        </motion.button>

        {/* Bento grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5">

          {/* Intro */}
          <motion.div {...cardEnter(0.05)} className={`${cardBase} p-7 lg:p-8 lg:col-span-2 flex flex-col`}>
            <div className="flex items-center gap-2.5 mb-5">
              <span className="font-mono text-[10px] tracking-widest text-[var(--btn-accent)] border border-[var(--btn-accent)] px-2 py-0.5 rounded">{project.category}</span>
              {project.is_featured && (
                <span className="flex items-center gap-1 font-mono text-[10px] tracking-widest text-[var(--text-muted)] border border-white/10 px-2 py-0.5 rounded">
                  <Star size={9} fill="currentColor" /> FEATURED
                </span>
              )}
            </div>
            <h1 className="font-display font-bold text-white mb-4" style={{ fontSize: 'clamp(1.9rem, 4.5vw, 3.25rem)', lineHeight: 1.08 }}>
              {project.title}
            </h1>
            <p className="text-[var(--text-body)] text-[15px] leading-relaxed max-w-xl">{project.description}</p>

            <div className="flex flex-wrap items-center gap-3 mt-6">
              {project.demo_url && project.demo_url !== '#' && (
                <a href={project.demo_url} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 font-mono text-xs tracking-widest rounded-lg bg-[var(--btn-accent)] text-black hover:opacity-90 transition-opacity">
                  LIVE DEMO <ExternalLink size={12} />
                </a>
              )}
              {project.repo_url && project.repo_url !== '#' && (
                <a href={project.repo_url} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 font-mono text-xs tracking-widest rounded-lg border border-white/15 text-[var(--text-body)] hover:border-white hover:text-white transition-all">
                  <Github size={13} /> VIEW CODE
                </a>
              )}
              {dateStr && (
                <span className="flex items-center gap-1.5 text-[var(--text-muted)] font-mono text-xs ml-auto">
                  <Calendar size={12} /> {dateStr}
                </span>
              )}
            </div>
          </motion.div>

          {/* Hero screenshot */}
          <motion.div {...cardEnter(0.1)}
            onClick={heroImage && images.length ? () => setLightbox(0) : undefined}
            className={`${cardBase} overflow-hidden relative group min-h-[300px] lg:col-span-1 ${heroImage && images.length ? 'cursor-pointer' : ''}`}>
            {heroImage ? (
              <>
                <img src={heroImage} alt={project.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                {images.length > 0 && (
                  <span className="absolute bottom-4 left-4 font-mono text-[10px] tracking-widest text-white/85 uppercase flex items-center gap-1">
                    tap to view <ExternalLink size={10} />
                  </span>
                )}
              </>
            ) : (
              <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-[var(--btn-accent)]/10 to-transparent">
                <span className="font-display text-7xl font-bold text-white/15">{project.title.charAt(0)}</span>
              </div>
            )}
          </motion.div>

          {/* Overview */}
          {project.long_description && (
            <motion.div {...cardEnter(0.15)} className={`${cardBase} p-7 lg:p-8 lg:col-span-2`}>
              <p className={`${label} mb-6`}>Overview</p>
              <div
                className="prose prose-invert prose-sm max-w-none
                  prose-headings:font-display prose-headings:text-white prose-headings:font-bold
                  prose-h2:text-xl prose-h3:text-lg
                  prose-p:text-[var(--text-body)] prose-p:leading-relaxed
                  prose-a:text-[var(--btn-accent)] prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-white
                  prose-li:text-[var(--text-body)] prose-li:marker:text-[var(--btn-accent)]
                  prose-hr:border-white/10"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(project.long_description) }}
              />
            </motion.div>
          )}

          {/* Tech stack */}
          {project.tech_stack?.length > 0 && (
            <motion.div {...cardEnter(0.2)} className={`${cardBase} p-7 lg:col-span-1`}>
              <p className={`${label} mb-5`}>Tech Stack</p>
              <div className="flex flex-wrap gap-2">
                {project.tech_stack.map(t => <TechBadge key={t} name={t} />)}
              </div>
            </motion.div>
          )}

          {/* Screenshots */}
          {images.length > 0 && (
            <motion.div {...cardEnter(0.1)} className={`${cardBase} p-7 lg:col-span-3`}>
              <p className={`${label} mb-5`}>
                Screenshots <span className="text-[var(--text-muted)] normal-case tracking-normal">— tap to zoom · scroll →</span>
              </p>
              <div className="flex gap-4 overflow-x-auto pb-3 -mx-1 px-1 snap-x snap-mandatory">
                {images.map((url, i) => (
                  <button key={i} type="button" onClick={() => setLightbox(i)}
                    className="shrink-0 snap-start rounded-xl overflow-hidden border border-white/10 hover:border-[var(--btn-accent)] transition-colors cursor-pointer group">
                    <img src={url} alt={`${project.title} screenshot ${i + 1}`} loading="lazy"
                      className="h-[20rem] sm:h-[24rem] w-auto object-cover block group-hover:scale-[1.04] transition-transform duration-500" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Back link */}
        <div className="mt-10">
          <button onClick={() => { navigate('/'); setTimeout(() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' }), 100) }}
            className="flex items-center gap-2 font-mono text-xs text-[var(--text-muted)] hover:text-[var(--btn-accent)] transition-colors">
            <ArrowLeft size={13} /> ALL PROJECTS
          </button>
        </div>
      </div>
    </div>
  )
}
