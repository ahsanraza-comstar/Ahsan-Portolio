import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { TypeAnimation } from 'react-type-animation'
import { Github, Linkedin, Twitter, ArrowRight, Play } from 'lucide-react'
import NeuralCanvas from '../ui/NeuralCanvas'
import ResumePDFViewer from '../ui/ResumePDFViewer'

const BRANDS = ['Python', 'FastAPI', 'LangChain', 'React', 'PyTorch', 'OpenAI API', 'Docker', 'PostgreSQL']

const CODE_LINES = [
  { n: 1, cls: 'text-[#6b7280]', text: '# AI Engineer Portfolio — Ahsan Raza' },
  { n: 2, cls: 'text-[#9ca3af]', text: '' },
  { n: 3, cls: 'text-[#86efac]', text: 'from langchain.chains import LLMChain' },
  { n: 4, cls: 'text-[#86efac]', text: 'from fastapi import FastAPI, Depends' },
  { n: 5, cls: 'text-[#9ca3af]', text: '' },
  { n: 6, cls: 'text-[#9ca3af]', text: 'app = FastAPI(title="AI Portfolio API")' },
  { n: 7, cls: 'text-[#9ca3af]', text: '' },
  { n: 8, cls: 'text-[#4ade80]', text: '@app.post("/ai/generate")' },
  { n: 9, cls: 'text-[#9ca3af]', text: 'async def generate(prompt: str):' },
  { n: 10, cls: 'text-[#9ca3af]', text: '    result = await chain.arun(prompt)' },
  { n: 11, cls: 'text-[#9ca3af]', text: '    return {"output": result, "status": 200}' },
]

const SIDE_LINES = [
  { cls: 'text-[#4ade80]', text: '// Stack' },
  { cls: 'text-[#9ca3af]', text: 'llm = ChatOpenAI()' },
  { cls: 'text-[#9ca3af]', text: 'db  = PostgreSQL()' },
  { cls: 'text-[#9ca3af]', text: 'ui  = React()' },
  { cls: 'text-[#4ade80]', text: '// Status' },
  { cls: 'text-[#86efac]', text: '> Available ✓' },
]

function CodeWindow() {
  return (
    <div className="code-window">
      <div className="code-window-bar">
        <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 font-mono text-xs text-[var(--text-muted)]">~/portfolio/api/main.py</span>
      </div>
      <div className="grid md:grid-cols-[1fr_200px] divide-x divide-[var(--border-subtle)]">
        {/* Main code */}
        <div className="p-5 space-y-0.5">
          {CODE_LINES.map((line) => (
            <div key={line.n} className="flex gap-4 leading-6">
              <span className="text-[var(--text-muted)] select-none w-5 text-right shrink-0 text-xs opacity-50">{line.text ? line.n : ''}</span>
              <span className={`font-mono text-sm ${line.cls}`}>{line.text}</span>
            </div>
          ))}
        </div>
        {/* Side panel */}
        <div className="p-5 space-y-2 hidden md:block">
          {SIDE_LINES.map((l, i) => (
            <p key={i} className={`font-mono text-xs ${l.cls}`}>{l.text}</p>
          ))}
        </div>
      </div>
    </div>
  )
}

function ScrambleCounter({ text }) {
  const [display, setDisplay] = useState(text.replace(/[0-9]/g, '0'))
  const ref = useRef(null)
  const isVisible = useRef(false)
  const intervalRef = useRef(null)
  const textRef = useRef(text)
  textRef.current = text   // keep latest value for the mount-only observer callback

  const runScramble = (target) => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    let iteration = 0
    const maxIterations = 20
    intervalRef.current = setInterval(() => {
      setDisplay(target.split('').map((char) => {
        if (char === '+') return '+'
        if (iteration >= maxIterations) return char
        return Math.floor(Math.random() * 10).toString()
      }).join(''))
      iteration++
      if (iteration > maxIterations) clearInterval(intervalRef.current)
    }, 50)
  }

  // Start when visible
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        isVisible.current = true
        runScramble(textRef.current)
      }
    }, { threshold: 0.1 })
    if (ref.current) observer.observe(ref.current)
    return () => { observer.disconnect(); clearInterval(intervalRef.current) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Re-run when text changes (data loaded after visible)
  useEffect(() => {
    if (isVisible.current) runScramble(text)
    else setDisplay(text.replace(/[0-9]/g, '0'))
  }, [text]) // eslint-disable-line react-hooks/exhaustive-deps

  return <span ref={ref}>{display}</span>
}

function TerminalCounters({ counters }) {
  return (
    <div className="code-window bg-[var(--bg-surface)]">
      <div className="code-window-bar flex items-center pr-3">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        </div>
        <span className="ml-3 font-mono text-[10px] text-[var(--text-muted)]">portfolio_stats.py</span>
        <span className="ml-auto font-mono text-[9px] px-2 py-0.5 border border-[var(--text-muted)] text-[var(--text-muted)] uppercase">
          Metrics
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 md:p-8 w-full">
        {counters.map((c, i) => (
          <div key={i} className="flex flex-col text-left">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: 'spring' }}
              className="font-display font-bold text-3xl xl:text-4xl mb-1 text-[var(--amber-bright)]"
            >
              <ScrambleCounter text={c.value} />
            </motion.div>
            <div className="text-[10px] tracking-wider uppercase text-[var(--text-muted)] font-mono leading-tight">
              {c.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Hero({ about, projects, certifications }) {
  const [showPDF, setShowPDF] = useState(false)
  const name = about?.name || 'Ahsan Raza'
  const bio = about?.bio || 'Full-stack AI engineer specializing in LLMs, FastAPI backends, and React frontends — building production-grade intelligent systems.'
  const resume = about?.resume_url
  const github = about?.github_url
  const linkedin = about?.linkedin_url
  const twitter = about?.twitter_url

  const counters = [
    { value: `${projects?.length ?? 0}+`,          label: 'PROJECTS' },
    { value: `${about?.years_experience ?? 2}+`,   label: 'YEARS EXP.' },
    { value: `${about?.ai_models_count ?? 20}+`,   label: 'AI MODELS' },
    { value: `${certifications?.length ?? 0}+`,    label: 'CERTIFICATIONS' },
  ]

  return (
    <section id="hero" className="relative min-h-screen flex flex-col bg-[var(--bg-void)] overflow-hidden">
      <NeuralCanvas className="opacity-20" />

      {/* Subtle green radial glow */}
      <div className="absolute top-0 right-0 w-[700px] h-[700px] pointer-events-none"
        style={{ background: 'radial-gradient(circle at 80% 10%, rgba(74,222,128,0.04) 0%, transparent 60%)' }} />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(circle at 10% 90%, rgba(74,222,128,0.03) 0%, transparent 60%)' }} />

      <div className="relative z-10 flex-1 flex flex-col justify-center max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-20 pt-28 pb-16">

        {/* Main — headline left, desc right */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-14">

          {/* LEFT — big headline */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--amber-bright)] animate-pulse" />
              <span className="font-mono text-xs tracking-widest text-[var(--amber-bright)]">AVAILABLE FOR WORK</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1
                className="font-display font-bold text-white leading-[1.1]"
                style={{ fontSize: 'clamp(2.6rem, 5.5vw, 4.8rem)' }}
              >
                Expert AI Engineer<br />
                for a{' '}
                <span className="font-mono text-[var(--amber-bright)]">&#123;</span>
                <TypeAnimation
                  sequence={['Modern', 3000, 'Better', 3000, 'Smarter', 3000]}
                  wrapper="span"
                  repeat={Infinity}
                  className="font-mono text-[var(--amber-bright)]"
                />
                <span className="font-mono text-[var(--amber-bright)]">&#125;</span><br />
                <span className="text-[var(--text-muted)]">World.</span>
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <button
                onClick={() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 px-6 py-2.5 font-mono text-xs tracking-widest border border-[var(--btn-accent)] text-[var(--btn-accent)] hover:bg-[var(--btn-accent)] hover:text-black transition-all duration-200"
              >
                VIEW PROJECTS <ArrowRight size={13} />
              </button>

              <button
                onClick={() => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 px-6 py-2.5 font-mono text-xs tracking-widest border border-[var(--border-subtle)] text-[var(--text-body)] hover:border-[var(--border-mid)] hover:text-white transition-all duration-200"
              >
                <Play size={11} fill="currentColor" /> ABOUT ME
              </button>
            </motion.div>
          </div>

          {/* RIGHT — Terminal Card, description, socials */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-center space-y-6"
          >
            <TerminalCounters counters={counters} />

            <p className="text-[var(--text-body)] leading-relaxed max-w-sm mt-4">
              {bio.slice(0, 220)}{bio.length > 220 ? '...' : ''}
            </p>

            <div className="flex items-center gap-5">
              {[
                { href: github, icon: Github },
                { href: linkedin, icon: Linkedin },
                { href: twitter, icon: Twitter },
              ].filter(s => s.href).map(({ href, icon: Icon }) => (
                <a key={href} href={href} target="_blank" rel="noreferrer"
                  className="text-[var(--text-muted)] hover:text-[var(--amber-bright)] transition-colors">
                  <Icon size={17} />
                </a>
              ))}
              <button
                onClick={() => resume && setShowPDF(true)}
                className={`inline-flex items-center gap-2 px-5 py-2 font-mono text-xs tracking-widest border transition-all duration-200 ${
                  resume
                    ? 'border-[var(--btn-accent)] text-[var(--btn-accent)] hover:bg-[var(--btn-accent)] hover:text-black'
                    : 'border-[var(--border-subtle)] text-[var(--text-muted)] cursor-not-allowed opacity-50'
                }`}
                title={resume ? 'View Resume' : 'Resume not uploaded yet'}
                disabled={!resume}
              >
                VIEW CV {resume ? '↓' : ''}
              </button>
              {showPDF && <ResumePDFViewer url={resume} onClose={() => setShowPDF(false)} />}
            </div>
          </motion.div>
        </div>

        {/* Code window — full width */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <CodeWindow />
        </motion.div>

        {/* Brand strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="mt-12 pt-8 border-t border-[var(--border-subtle)]"
        >
          <p className="text-center font-mono text-[10px] text-[var(--text-muted)] tracking-[0.3em] uppercase mb-6">
            PROVIDING POWER TO WORLD-CLASS AI PRODUCTS
          </p>
          <div className="overflow-hidden">
            <div className="flex gap-12 marquee-track w-max">
              {[...BRANDS, ...BRANDS].map((b, i) => (
                <span key={i} className="font-mono text-sm text-[var(--text-muted)] whitespace-nowrap hover:text-[var(--amber-bright)] transition-colors cursor-default">
                  {b}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
