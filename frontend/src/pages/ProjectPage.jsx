import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink, Github, Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react'
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
        className="max-h-[88vh] max-w-[90vw] object-contain rounded-lg"
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

/* ── Phone mockup frame ── */
function PhoneFrame({ src, alt, onClick, className = '' }) {
  return (
    <div
      onClick={onClick}
      className={`relative rounded-[2rem] border-[6px] border-[#161616] bg-[#161616] overflow-hidden
        shadow-[0_25px_60px_-20px_rgba(0,0,0,0.85)] ${onClick ? 'cursor-pointer group' : ''} ${className}`}
    >
      {/* notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-[#161616] rounded-b-xl z-10" />
      {src ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      ) : (
        <div className="w-full h-full grid place-items-center bg-[var(--bg-surface)] text-[var(--text-muted)] font-mono text-[10px]">
          no preview
        </div>
      )}
    </div>
  )
}

/* ── Tech chip ── */
function TechBadge({ name }) {
  const slug = {
    'python': 'python', 'react': 'react', 'fastapi': 'fastapi',
    'typescript': 'typescript', 'docker': 'docker', 'postgresql': 'postgresql',
    'langchain': 'langchain', 'pytorch': 'pytorch', 'openai api': 'openai',
    'tailwind css': 'tailwindcss', 'redis': 'redis', 'aws': 'amazonaws',
    'flutter': 'flutter', 'dart': 'dart', 'firebase': 'firebase', 'supabase': 'supabase',
    'laravel': 'laravel', 'php': 'php', 'javascript': 'javascript', 'flask': 'flask',
  }[name.toLowerCase()]
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 border border-[var(--border-subtle)] hover:border-[var(--btn-accent)] transition-colors duration-200 bg-[var(--bg-deep)] rounded-md">
      {slug && <img src={`https://cdn.simpleicons.org/${slug}/f5c518`} alt="" className="w-3.5 h-3.5 object-contain" />}
      <span className="font-mono text-xs text-[var(--text-body)]">{name}</span>
    </div>
  )
}

export default function ProjectPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [lightbox, setLightbox] = useState(null)
  const { ref, onMouseMove, onMouseLeave } = useTilt(6)

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
        {heroImage && (
          <div className="absolute inset-0">
            <img src={heroImage} alt="" className="w-full h-full object-cover opacity-[0.06]" />
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-void)]/70 via-[var(--bg-void)]/85 to-[var(--bg-void)]" />
          </div>
        )}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none"
          style={{ background: 'radial-gradient(circle at 75% 15%, rgba(245,197,24,0.07) 0%, transparent 60%)' }} />

        <div className="relative max-w-5xl mx-auto px-6 md:px-12 pt-10 pb-16">
          <motion.button
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/#projects')}
            className="flex items-center gap-2 font-mono text-xs text-[var(--text-muted)] hover:text-[var(--btn-accent)] transition-colors mb-10"
          >
            <ArrowLeft size={14} /> BACK TO PROJECTS
          </motion.button>

          <div className={`grid gap-12 items-center ${heroImage ? 'lg:grid-cols-[1fr_auto]' : ''}`}>
            {/* Left: info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] tracking-widest text-[var(--btn-accent)] border border-[var(--btn-accent)] px-2 py-0.5">
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

              <p className="text-[var(--text-body)] text-base leading-relaxed max-w-xl">{project.description}</p>

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

              {project.tech_stack?.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {project.tech_stack.map(t => <TechBadge key={t} name={t} />)}
                </div>
              )}

              {dateStr && (
                <div className="flex items-center gap-2 text-[var(--text-muted)] font-mono text-xs">
                  <Calendar size={12} /> {dateStr}
                </div>
              )}
            </motion.div>

            {/* Right: phone mockup */}
            {heroImage && (
              <motion.div
                ref={ref} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                style={{ willChange: 'transform' }}
                className="hidden lg:block justify-self-center"
              >
                <PhoneFrame
                  src={heroImage}
                  alt={project.title}
                  onClick={images.length ? () => setLightbox(0) : undefined}
                  className="w-[250px] aspect-[9/19]"
                />
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 py-16 space-y-16">
        {/* Overview */}
        {project.long_description && (
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <p className="font-mono text-[10px] tracking-[0.3em] text-[var(--btn-accent)] uppercase mb-8">Overview</p>
            <div
              className="prose prose-invert prose-sm max-w-none
                prose-headings:font-display prose-headings:text-white prose-headings:font-bold
                prose-h2:text-2xl prose-h3:text-xl
                prose-p:text-[var(--text-body)] prose-p:leading-relaxed
                prose-a:text-[var(--btn-accent)] prose-a:no-underline hover:prose-a:underline
                prose-strong:text-white
                prose-code:text-[var(--btn-accent)] prose-code:bg-[var(--bg-surface)] prose-code:px-1 prose-code:rounded
                prose-pre:bg-[var(--bg-surface)] prose-pre:border prose-pre:border-[var(--border-subtle)]
                prose-blockquote:border-l-[var(--btn-accent)] prose-blockquote:text-[var(--text-muted)]
                prose-li:text-[var(--text-body)]
                prose-hr:border-[var(--border-subtle)]
                prose-img:rounded prose-img:border prose-img:border-[var(--border-subtle)]"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(project.long_description) }}
            />
          </motion.div>
        )}

        {/* Screenshots — phone frames */}
        {images.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <p className="font-mono text-[10px] tracking-[0.3em] text-[var(--btn-accent)] uppercase mb-6">
              Screenshots <span className="text-[var(--text-muted)] normal-case tracking-normal">— tap to zoom · scroll →</span>
            </p>
            <div className="flex gap-6 overflow-x-auto pb-4 -mx-1 px-1 snap-x snap-mandatory">
              {images.map((url, i) => (
                <PhoneFrame
                  key={i}
                  src={url}
                  alt={`${project.title} screenshot ${i + 1}`}
                  onClick={() => setLightbox(i)}
                  className="shrink-0 snap-start w-[200px] sm:w-[230px] aspect-[9/19]"
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Back */}
        <div className="border-t border-[var(--border-subtle)] pt-10">
          <button
            onClick={() => { navigate('/'); setTimeout(() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' }), 100) }}
            className="flex items-center gap-2 font-mono text-xs text-[var(--text-muted)] hover:text-[var(--btn-accent)] transition-colors"
          >
            <ArrowLeft size={13} /> ALL PROJECTS
          </button>
        </div>
      </div>
    </div>
  )
}
