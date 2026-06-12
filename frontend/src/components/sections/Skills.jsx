import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Section from '../layout/Section'

/* ── Simple Icons slug map (name → simpleicons.org slug) ── */
const ICON_SLUGS = {
  'python': 'python', 'langchain': 'langchain', 'pytorch': 'pytorch',
  'scikit-learn': 'scikitlearn', 'openai api': 'openai', 'openai': 'openai',
  'hugging face': 'huggingface', 'huggingface': 'huggingface',
  'fastapi': 'fastapi', 'sqlalchemy': 'sqlalchemy', 'postgresql': 'postgresql',
  'postgres': 'postgresql', 'redis': 'redis', 'react': 'react',
  'typescript': 'typescript', 'javascript': 'javascript',
  'tailwind css': 'tailwindcss', 'tailwindcss': 'tailwindcss',
  'docker': 'docker', 'github actions': 'githubactions',
  'aws': 'amazonaws', 'amazon web services': 'amazonaws',
  'git': 'git', 'jupyter': 'jupyter', 'tensorflow': 'tensorflow',
  'keras': 'keras', 'flask': 'flask', 'django': 'django',
  'node.js': 'nodedotjs', 'nodejs': 'nodedotjs',
  'mongodb': 'mongodb', 'mysql': 'mysql', 'sqlite': 'sqlite',
  'kubernetes': 'kubernetes', 'k8s': 'kubernetes',
  'next.js': 'nextdotjs', 'nextjs': 'nextdotjs',
  'vue': 'vuedotjs', 'vue.js': 'vuedotjs', 'angular': 'angular',
  'graphql': 'graphql', 'firebase': 'firebase',
  'linux': 'linux', 'ubuntu': 'ubuntu', 'nginx': 'nginx',
  'jenkins': 'jenkins', 'terraform': 'terraform',
  'pandas': 'pandas', 'numpy': 'numpy', 'matplotlib': 'plotly',
  'gcp': 'googlecloud', 'google cloud': 'googlecloud',
  'azure': 'microsoftazure', 'vercel': 'vercel', 'netlify': 'netlify',
  'supabase': 'supabase', 'prisma': 'prisma',
  'celery': 'celery', 'rabbitmq': 'rabbitmq', 'kafka': 'apachekafka',
  'elasticsearch': 'elasticsearch', 'pinecone': 'pinecone',
}

function SkillIcon({ name }) {
  const slug = ICON_SLUGS[name.toLowerCase()]
  const [failed, setFailed] = useState(false)

  if (!slug || failed) {
    return (
      <span className="font-mono text-[10px] font-bold leading-none" style={{ color: '#4ade80' }}>
        {name.slice(0, 2).toUpperCase()}
      </span>
    )
  }

  return (
    <img
      src={`https://cdn.simpleicons.org/${slug}/4ade80`}
      alt={name}
      className="w-5 h-5 object-contain"
      onError={() => setFailed(true)}
    />
  )
}


/* level label + color based on proficiency */
function getLevel(p) {
  if (p >= 90) return { label: 'EXPERT',     color: '#4ade80' }
  if (p >= 80) return { label: 'ADVANCED',   color: '#86efac' }
  if (p >= 70) return { label: 'PROFICIENT', color: '#6ee7b7' }
  return              { label: 'FAMILIAR',   color: '#9ca3af' }
}

function SkillRow({ skill, inView, index }) {
  const { label, color } = getLevel(skill.proficiency)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
      className="group relative"
    >
      {/* Card */}
      <div
        className="relative border border-[var(--border-subtle)] bg-[var(--bg-void)] px-5 py-4 overflow-hidden
                   transition-all duration-300
                   hover:border-[var(--amber-bright)] hover:bg-[var(--bg-deep)]"
      >
        {/* Left accent bar — grows on hover */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[3px] transition-all duration-300 origin-top"
          style={{ background: color, opacity: 0.2 }}
        />
        <div
          className="absolute left-0 top-0 bottom-0 w-[3px] scale-y-0 group-hover:scale-y-100
                     transition-transform duration-500 origin-top"
          style={{ background: color }}
        />

        {/* Subtle glow on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 0% 50%, ${color}08 0%, transparent 60%)` }}
        />

        {/* Top row: icon + name + level + % */}
        <div className="flex items-center gap-3 mb-3">
          {/* Icon box */}
          <div
            className="w-8 h-8 flex items-center justify-center border border-[var(--border-subtle)]
                       group-hover:border-[var(--border-mid)] transition-colors duration-300 shrink-0"
          >
            <SkillIcon name={skill.name} />
          </div>

          {/* Name */}
          <span className="font-mono text-sm text-[var(--text-body)] group-hover:text-white transition-colors duration-200 flex-1 min-w-0">
            {skill.name}
          </span>

          {/* Level badge — fades in on hover */}
          <span
            className="font-mono text-[9px] tracking-widest px-1.5 py-0.5 border opacity-0 group-hover:opacity-100
                       transition-opacity duration-300 shrink-0 hidden sm:block"
            style={{ color, borderColor: `${color}40` }}
          >
            {label}
          </span>

          {/* Percentage */}
          <span className="font-mono text-sm font-bold shrink-0" style={{ color }}>
            {skill.proficiency}%
          </span>
        </div>

        {/* Progress bar track */}
        <div className="relative h-[2px] bg-[var(--border-subtle)] overflow-visible">
          {/* Fill */}
          <motion.div
            className="absolute top-0 left-0 h-full"
            style={{ background: `linear-gradient(90deg, ${color}60, ${color})` }}
            initial={{ width: 0 }}
            animate={inView ? { width: `${skill.proficiency}%` } : { width: 0 }}
            transition={{ duration: 1.1, delay: index * 0.04 + 0.15, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Glowing tip dot */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-[6px] h-[6px] rounded-full"
            style={{ background: color, boxShadow: `0 0 8px 2px ${color}` }}
            initial={{ left: 0, opacity: 0 }}
            animate={inView
              ? { left: `calc(${skill.proficiency}% - 3px)`, opacity: 1 }
              : { left: 0, opacity: 0 }}
            transition={{ duration: 1.1, delay: index * 0.04 + 0.15, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Shimmer sweep on the fill */}
          <motion.div
            className="absolute top-0 h-full w-12 pointer-events-none"
            style={{ background: `linear-gradient(90deg, transparent, ${color}50, transparent)` }}
            initial={{ left: '-3rem', opacity: 0 }}
            animate={inView ? { left: `${skill.proficiency}%`, opacity: [0, 1, 0] } : {}}
            transition={{ duration: 0.6, delay: index * 0.04 + 1.1, ease: 'easeOut' }}
          />
        </div>
      </div>
    </motion.div>
  )
}

export default function Skills({ skills }) {
  const [activeTab, setActiveTab] = useState('All')
  const [inView, setInView]       = useState(false)
  const sectionRef                = useRef(null)
  const items    = skills || []
  const available = ['All', ...new Set(items.map(s => s.category))]
  const filtered  = activeTab === 'All' ? items : items.filter(s => s.category === activeTab)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true) },
      { threshold: 0.05 }
    )
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  const handleTab = (t) => {
    setActiveTab(t)
    setInView(false)
    setTimeout(() => setInView(true), 60)
  }

  /* top-3 per level for summary */
  const expert   = items.filter(s => s.proficiency >= 90).slice(0, 4)
  const advanced = items.filter(s => s.proficiency >= 80 && s.proficiency < 90).slice(0, 4)

  return (
    <Section id="skills" bg="deep" reveal={false}>

      {/* Header */}
      <div className="grid lg:grid-cols-2 gap-8 items-end mb-14">
        <div>
          <p className="font-mono text-xs tracking-[0.3em] text-[var(--amber-bright)] uppercase mb-4">&lt; skills /&gt;</p>
          <h2 className="font-display font-bold text-white" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: 1.15 }}>
            Useful{' '}
            <span className="font-mono text-[var(--amber-bright)]">&#123;software&#125;</span>{' '}
            that can assist.
          </h2>
        </div>
        <p className="text-[var(--text-body)] text-sm leading-relaxed lg:max-w-sm lg:ml-auto">
          Depth-first expertise across the full AI engineering stack — from model training to production deployment.
        </p>
      </div>

      {/* Summary strip */}
      <motion.div
        className="grid sm:grid-cols-2 gap-4 mb-12"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {/* Expert */}
        <div className="border border-[var(--border-subtle)] p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-[#4ade80]" style={{ boxShadow: '0 0 6px #4ade80' }} />
            <span className="font-mono text-[10px] tracking-widest text-[#4ade80]">EXPERT LEVEL</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {expert.map(s => (
              <span key={s.id} className="inline-flex items-center gap-1.5 font-mono text-xs px-2 py-1 border border-[#4ade8030] text-[var(--text-body)] hover:text-white hover:border-[#4ade8080] transition-colors">
                <SkillIcon name={s.name} /> {s.name}
              </span>
            ))}
          </div>
        </div>
        {/* Advanced */}
        <div className="border border-[var(--border-subtle)] p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-[#86efac]" style={{ boxShadow: '0 0 6px #86efac' }} />
            <span className="font-mono text-[10px] tracking-widest text-[#86efac]">ADVANCED LEVEL</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {advanced.map(s => (
              <span key={s.id} className="inline-flex items-center gap-1.5 font-mono text-xs px-2 py-1 border border-[#86efac30] text-[var(--text-body)] hover:text-white hover:border-[#86efac80] transition-colors">
                <SkillIcon name={s.name} /> {s.name}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Filter tabs */}
      <div ref={sectionRef}>
        <div className="flex flex-wrap gap-0 mb-6 border border-[var(--border-subtle)] w-fit">
          {available.map((cat) => (
            <button
              key={cat}
              onClick={() => handleTab(cat)}
              className={`px-5 py-2.5 font-mono text-xs tracking-widest border-r border-[var(--border-subtle)]
                         last:border-r-0 transition-all duration-200 ${
                activeTab === cat
                  ? 'bg-[var(--btn-accent)] text-black'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-body)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Count label */}
        <p className="font-mono text-[10px] text-[var(--text-muted)] tracking-widest mb-6">
          SHOWING {filtered.length} SKILLS
          {activeTab !== 'All' && ` IN ${activeTab.toUpperCase()}`}
        </p>

        {/* Skill rows grid */}
        {items.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-[var(--border-subtle)]">
            <p className="font-mono text-xs text-[var(--text-muted)] tracking-widest">NO SKILLS ADDED YET</p>
            <p className="font-mono text-[10px] text-[var(--text-muted)] opacity-50 mt-1">Add skills from the admin panel</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {filtered.map((skill, i) => (
                <SkillRow key={skill.id} skill={skill} inView={inView} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Legend */}
        <motion.div
          className="flex flex-wrap items-center gap-6 mt-10 pt-6 border-t border-[var(--border-subtle)]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="font-mono text-[10px] text-[var(--text-muted)] tracking-widest">PROFICIENCY SCALE</span>
          {[
            { label: 'Expert',     range: '90–100%', color: '#4ade80' },
            { label: 'Advanced',   range: '80–89%',  color: '#86efac' },
            { label: 'Proficient', range: '70–79%',  color: '#6ee7b7' },
            { label: 'Familiar',   range: '<70%',    color: '#9ca3af' },
          ].map(({ label, range, color }) => (
            <div key={label} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color, boxShadow: `0 0 5px ${color}` }} />
              <span className="font-mono text-[10px] text-[var(--text-muted)]">
                {label} <span className="opacity-50">({range})</span>
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </Section>
  )
}
