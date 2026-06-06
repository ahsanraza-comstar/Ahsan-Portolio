import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Github, ArrowRight, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Section from '../layout/Section'
import { useTilt } from '../../hooks/useTilt'

const FILTERS = ['All', 'AI/ML', 'Web', 'Research']


const PROJECT_CODE = {
  1: ['from langchain import RAGChain', 'chain = RAGChain(vectordb)', 'result = chain.query(q)'],
  2: ['bot = GitHubBot(gpt4)', 'pr = bot.review(pull_req)', 'bot.comment(pr.suggestions)'],
  3: ['app = FastAPI()', '@app.get("/about")', 'return portfolio_data'],
  4: ['model = DistilBERT()', 'serve(model, port=8080)', '> 200 OK — 12ms'],
  5: ['df = load_csv(dataset)', 'model = AutoML(df)', 'model.fit().evaluate()'],
  6: ['bench = LLMBench(gpt4)', 'scores = bench.run(tasks)', 'bench.report()'],
}

function MiniCodeWindow({ projectId, title }) {
  const lines = PROJECT_CODE[projectId] || ['# project code']
  return (
    <div className="code-window h-full">
      <div className="code-window-bar">
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 font-mono text-[10px] text-[var(--text-muted)] truncate">{title.toLowerCase().replace(/ /g, '_')}.py</span>
      </div>
      <div className="p-4 space-y-1.5">
        {lines.map((line, i) => (
          <div key={i} className="flex gap-3">
            <span className="text-[var(--text-muted)] text-[10px] opacity-40 w-3 shrink-0">{i + 1}</span>
            <span className={`font-mono text-xs ${line.startsWith('#') || line.startsWith('//')  ? 'text-[#4b5563]' : line.startsWith('>') ? 'text-[#4ade80]' : 'text-[#9ca3af]'}`}>
              {line}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function FeaturedProject({ project }) {
  const navigate = useNavigate()
  return (
    <motion.div
      onClick={() => navigate(`/projects/${project.id}`)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mb-12 border border-[var(--border-subtle)] bg-[var(--bg-deep)] hover:border-[var(--amber-bright)] transition-colors duration-300 relative overflow-hidden group cursor-pointer"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-[var(--amber-bright)]" />

      <div className="grid lg:grid-cols-2">
        {/* Code window side */}
        <div className="min-h-[240px] relative overflow-hidden bg-[var(--bg-surface)]">
          {project.thumbnail_url
            ? <img src={project.thumbnail_url} alt={project.title} className="w-full h-full object-cover" />
            : (
              <div className="absolute inset-0 p-6 flex items-center">
                <div className="w-full">
                  <MiniCodeWindow projectId={project.id} title={project.title} />
                </div>
              </div>
            )
          }
          <div className="absolute inset-0 lg:bg-gradient-to-r from-transparent to-[var(--bg-deep)]" />
        </div>

        {/* Content side */}
        <div className="p-8 lg:p-10 flex flex-col justify-center space-y-5">
          <div className="flex items-center gap-2">
            <Star size={12} fill="currentColor" className="text-[var(--amber-bright)]" />
            <span className="font-mono text-[10px] tracking-[0.2em] text-[var(--amber-bright)] uppercase">Featured Project</span>
          </div>

          <h3 className="font-display font-bold text-white text-2xl lg:text-3xl">{project.title}</h3>
          <p className="text-[var(--text-body)] text-sm leading-relaxed">{project.description}</p>

          <div className="flex flex-wrap gap-2">
            {project.tech_stack?.map(t => (
              <span key={t} className="font-mono text-[10px] px-2 py-1 border border-[var(--border-subtle)] text-[var(--text-muted)]">{t}</span>
            ))}
          </div>

          <div className="flex gap-4 pt-1">
            {project.demo_url && project.demo_url !== '#' && (
              <a href={project.demo_url} target="_blank" rel="noreferrer"
                 className="inline-flex items-center gap-1.5 font-mono text-xs tracking-widest border border-[var(--amber-bright)] text-[var(--amber-bright)] px-4 py-2 hover:bg-[var(--amber-bright)] hover:text-black transition-all duration-200">
                LIVE DEMO <ExternalLink size={11} />
              </a>
            )}
            {project.repo_url && project.repo_url !== '#' && (
              <a href={project.repo_url} target="_blank" rel="noreferrer"
                 className="inline-flex items-center gap-1.5 font-mono text-xs tracking-widest border border-[var(--border-subtle)] text-[var(--text-body)] px-4 py-2 hover:border-[var(--border-mid)] hover:text-white transition-all duration-200">
                <Github size={11} /> SOURCE
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function ProjectCard({ project, index }) {
  const { ref, onMouseMove, onMouseLeave } = useTilt(8)
  const navigate = useNavigate()
  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={() => navigate(`/projects/${project.id}`)}
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className="group border border-[var(--border-subtle)] bg-[var(--bg-deep)] hover:border-[var(--amber-bright)] transition-colors duration-300 relative overflow-hidden flex flex-col cursor-pointer"
      style={{ willChange: 'transform' }}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-[var(--amber-bright)] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

      {/* Code thumbnail */}
      <div className="h-40 overflow-hidden bg-[var(--bg-surface)] relative">
        {project.thumbnail_url
          ? <img src={project.thumbnail_url} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          : (
            <div className="absolute inset-0 p-4">
              <MiniCodeWindow projectId={project.id} title={project.title} />
            </div>
          )
        }
        {/* Category */}
        <div className="absolute top-3 right-3">
          <span className="font-mono text-[9px] px-2 py-0.5 border border-[var(--amber-bright)] text-[var(--amber-bright)] bg-[var(--bg-deep)]">
            {project.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col gap-3">
        <h3 className="font-display font-bold text-white text-base group-hover:text-[var(--amber-bright)] transition-colors duration-300">
          {project.title}
        </h3>
        <p className="text-[var(--text-body)] text-xs leading-relaxed line-clamp-2 flex-1">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {project.tech_stack?.map(t => (
            <span key={t} className="font-mono text-[9px] px-1.5 py-0.5 border border-[var(--border-subtle)] text-[var(--text-muted)]">{t}</span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 pb-4 flex items-center justify-between border-t border-[var(--border-subtle)] pt-3">
        {project.repo_url && project.repo_url !== '#' && (
          <a href={project.repo_url} target="_blank" rel="noreferrer"
             className="flex items-center gap-1 font-mono text-[10px] text-[var(--text-muted)] hover:text-white transition-colors">
            <Github size={11} /> Code
          </a>
        )}
        {project.demo_url && project.demo_url !== '#' && (
          <a href={project.demo_url} target="_blank" rel="noreferrer"
             className="flex items-center gap-1 font-mono text-[10px] text-[var(--amber-bright)]">
            Live Demo <ArrowRight size={10} />
          </a>
        )}
      </div>

      <div className="absolute bottom-0 left-0 h-px w-12 bg-[var(--amber-bright)]" />
    </motion.div>
  )
}

export default function Projects({ projects }) {
  const [filter, setFilter] = useState('All')
  const items    = projects || []
  const featured = items.find(p => p.is_featured)
  const rest     = items.filter(p => !p.is_featured)
  const grid     = filter === 'All' ? rest : rest.filter(p => p.category === filter)

  return (
    <Section id="projects" bg="deep" reveal={false}>
      {/* Header */}
      <div className="grid lg:grid-cols-2 gap-8 items-end mb-14">
        <div>
          <p className="font-mono text-xs tracking-[0.3em] text-[var(--amber-bright)] uppercase mb-4">&lt; projects /&gt;</p>
          <h2 className="font-display font-bold text-white" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: 1.15 }}>
            Selected{' '}
            <span className="font-mono text-[var(--amber-bright)]">&#123;work&#125;</span>{' '}
            built with precision.
          </h2>
        </div>
        <p className="text-[var(--text-body)] text-sm leading-relaxed lg:max-w-sm lg:ml-auto">
          AI systems, web applications, and research projects — each built with production quality and attention to detail.
        </p>
      </div>

      {/* Featured */}
      {featured && <FeaturedProject project={featured} />}

      {/* Filters */}
      <div className="flex flex-wrap gap-0 mb-8 border border-[var(--border-subtle)]">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2 font-mono text-xs tracking-widest border-r border-[var(--border-subtle)] last:border-r-0 transition-all duration-200 ${
              filter === f
                ? 'bg-[var(--amber-bright)] text-black'
                : 'text-[var(--text-muted)] hover:text-[var(--text-body)]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Grid */}
      {items.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-[var(--border-subtle)]">
          <p className="font-mono text-xs text-[var(--text-muted)] tracking-widest">NO PROJECTS ADDED YET</p>
          <p className="font-mono text-[10px] text-[var(--text-muted)] opacity-50 mt-1">Add projects from the admin panel</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--border-subtle)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {grid.map((p, i) => (
              <div key={p.id} className="bg-[var(--bg-deep)]">
                <ProjectCard project={p} index={i} />
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </Section>
  )
}
