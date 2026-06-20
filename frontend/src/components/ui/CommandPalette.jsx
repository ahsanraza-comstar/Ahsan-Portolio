import { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  Search, Home, User, Wrench, Layers, FolderGit2, Github, Briefcase,
  Quote, Mail, FileText, Linkedin, Sparkles, ArrowRight,
} from 'lucide-react'
import { getProjects, getAbout } from '../../lib/api'
import { slugify } from '../../lib/slug'

const SECTIONS = [
  { id: 'top', label: 'Home / Top', icon: Home },
  { id: 'about', label: 'About', icon: User },
  { id: 'services', label: 'Services', icon: Wrench },
  { id: 'skills', label: 'Skills', icon: Layers },
  { id: 'projects', label: 'Projects', icon: FolderGit2 },
  { id: 'github', label: 'GitHub Activity', icon: Github },
  { id: 'experience', label: 'Experience & Education', icon: Briefcase },
  { id: 'testimonials', label: 'Testimonials', icon: Quote },
  { id: 'contact', label: 'Contact', icon: Mail },
]

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const listRef = useRef(null)

  const { data: projects } = useQuery({ queryKey: ['projects'], queryFn: () => getProjects().then(r => r.data), staleTime: 300_000 })
  const { data: about } = useQuery({ queryKey: ['about'], queryFn: () => getAbout().then(r => r.data), staleTime: 300_000 })

  // Global shortcut: Ctrl/Cmd + K
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault(); setOpen(o => !o)
      } else if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (open) { setQuery(''); setActive(0); setTimeout(() => inputRef.current?.focus(), 30) }
  }, [open])

  function goSection(id) {
    const scroll = () => {
      if (id === 'top') window.scrollTo({ top: 0, behavior: 'smooth' })
      else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
    if (window.location.pathname !== '/') { navigate('/'); setTimeout(scroll, 150) }
    else scroll()
  }

  const commands = useMemo(() => {
    const cmds = []
    SECTIONS.forEach(s => cmds.push({ id: 'nav-' + s.id, group: 'Navigate', label: s.label, icon: s.icon, run: () => goSection(s.id) }))
    ;(projects || []).forEach(p => cmds.push({
      id: 'proj-' + p.id, group: 'Projects', label: `Open: ${p.title}`, icon: FolderGit2,
      run: () => navigate(`/projects/${slugify(p.title)}`),
    }))
    cmds.push({ id: 'act-chat', group: 'Actions', label: 'Ask the AI assistant', icon: Sparkles, run: () => window.dispatchEvent(new Event('open-chat')) })
    if (about?.resume_url) cmds.push({ id: 'act-resume', group: 'Actions', label: 'Download résumé', icon: FileText, run: () => window.open(about.resume_url, '_blank') })
    if (about?.github_url) cmds.push({ id: 'act-gh', group: 'Actions', label: 'Open GitHub', icon: Github, run: () => window.open(about.github_url, '_blank') })
    if (about?.linkedin_url) cmds.push({ id: 'act-li', group: 'Actions', label: 'Open LinkedIn', icon: Linkedin, run: () => window.open(about.linkedin_url, '_blank') })
    if (about?.email) cmds.push({ id: 'act-email', group: 'Actions', label: `Copy email (${about.email})`, icon: Mail, run: () => { navigator.clipboard?.writeText(about.email); toast.success('Email copied') } })
    return cmds
  }, [projects, about]) // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    return commands.filter(c => c.label.toLowerCase().includes(q) || c.group.toLowerCase().includes(q))
  }, [commands, query])

  useEffect(() => { setActive(0) }, [query])
  useEffect(() => {
    listRef.current?.querySelector(`[data-idx="${active}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [active])

  function run(cmd) { if (!cmd) return; setOpen(false); cmd.run() }

  function onKeyDown(e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(filtered.length - 1, a + 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => Math.max(0, a - 1)) }
    else if (e.key === 'Enter') { e.preventDefault(); run(filtered[active]) }
  }

  if (!open) return null

  let idx = -1
  let lastGroup = null

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[12vh] px-4 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[var(--bg-deep)] shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
          <Search size={16} className="text-white/40" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search sections, projects, actions..."
            className="flex-1 bg-transparent text-white text-sm placeholder:text-white/30 focus:outline-none"
          />
          <kbd className="text-[10px] font-mono text-white/30 border border-white/10 rounded px-1.5 py-0.5">ESC</kbd>
        </div>

        <div ref={listRef} className="max-h-[50vh] overflow-y-auto py-2">
          {filtered.length === 0 && <p className="px-4 py-6 text-center text-white/40 text-sm">No results</p>}
          {filtered.map((c) => {
            idx++
            const showHeader = c.group !== lastGroup
            lastGroup = c.group
            const i = idx
            const Icon = c.icon || ArrowRight
            return (
              <div key={c.id}>
                {showHeader && <p className="px-4 pt-3 pb-1 text-[10px] font-mono uppercase tracking-widest text-white/30">{c.group}</p>}
                <button
                  data-idx={i}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => run(c)}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-left text-sm transition-colors ${i === active ? 'bg-white/[0.06] text-white' : 'text-white/70'}`}
                >
                  <Icon size={15} className={i === active ? 'text-[var(--btn-accent)]' : 'text-white/40'} />
                  <span className="flex-1 truncate">{c.label}</span>
                  {i === active && <ArrowRight size={13} className="text-white/30" />}
                </button>
              </div>
            )
          })}
        </div>

        <div className="px-4 py-2 border-t border-white/10 flex items-center gap-4 text-[10px] font-mono text-white/30">
          <span>↑↓ navigate</span><span>↵ select</span><span className="ml-auto">Ctrl / ⌘ + K</span>
        </div>
      </div>
    </div>
  )
}
