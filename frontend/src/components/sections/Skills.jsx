import { useState } from 'react'
import { motion } from 'framer-motion'
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
  'git': 'git', 'git & github': 'github', 'github': 'github',
  'jupyter': 'jupyter', 'tensorflow': 'tensorflow',
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
  'flutter': 'flutter', 'dart': 'dart',
  'laravel': 'laravel', 'php': 'php', 'laravel / php': 'laravel',
  'railway': 'railway', 'railway / vercel': 'vercel',
  'postman': 'postman', 'gradio': 'gradio', 'opencv': 'opencv',
}

function SkillIcon({ name }) {
  const slug = ICON_SLUGS[name.toLowerCase()]
  const [failed, setFailed] = useState(false)

  if (!slug || failed) {
    return (
      <span className="font-mono text-[11px] font-bold leading-none" style={{ color: '#4ade80' }}>
        {name.replace(/[^a-zA-Z]/g, '').slice(0, 2).toUpperCase()}
      </span>
    )
  }

  return (
    <img
      src={`https://cdn.simpleicons.org/${slug}/4ade80`}
      alt={name}
      className="w-6 h-6 object-contain"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}

function LogoChip({ skill }) {
  return (
    <div className="group/chip flex items-center gap-3 shrink-0 px-5 py-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-void)] hover:border-[var(--amber-bright)] hover:bg-[var(--bg-deep)] transition-colors duration-300">
      <div className="w-6 h-6 flex items-center justify-center shrink-0 opacity-80 group-hover/chip:opacity-100 transition-opacity">
        <SkillIcon name={skill.name} />
      </div>
      <span className="font-mono text-sm text-[var(--text-body)] group-hover/chip:text-white whitespace-nowrap transition-colors">
        {skill.name}
      </span>
    </div>
  )
}

function MarqueeRow({ items, direction = 'left', duration = 45 }) {
  if (!items.length) return null
  const doubled = [...items, ...items]
  return (
    <div className="marquee-row group relative overflow-hidden py-2 [mask-image:linear-gradient(90deg,transparent,black_7%,black_93%,transparent)] [-webkit-mask-image:linear-gradient(90deg,transparent,black_7%,black_93%,transparent)]">
      <div
        className={`marquee-track flex gap-4 ${direction === 'left' ? 'marquee-left' : 'marquee-right'}`}
        style={{ animationDuration: `${duration}s` }}
      >
        {doubled.map((s, i) => <LogoChip key={`${s.id}-${i}`} skill={s} />)}
      </div>
    </div>
  )
}

export default function Skills({ skills }) {
  const items = skills || []
  const row1 = items.filter((_, i) => i % 2 === 0)
  const row2 = items.filter((_, i) => i % 2 === 1)

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

      {/* Logo wall */}
      {items.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-[var(--border-subtle)]">
          <p className="font-mono text-xs text-[var(--text-muted)] tracking-widest">NO SKILLS ADDED YET</p>
          <p className="font-mono text-[10px] text-[var(--text-muted)] opacity-50 mt-1">Add skills from the admin panel</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <MarqueeRow items={row1} direction="left" duration={50} />
          <MarqueeRow items={row2.length ? row2 : row1} direction="right" duration={42} />
        </motion.div>
      )}
    </Section>
  )
}
