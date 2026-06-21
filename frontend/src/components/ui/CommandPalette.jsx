import { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  Home, User, Wrench, Layers, FolderGit2, Github, Briefcase,
  Quote, Mail, FileText, Linkedin, Sparkles, ArrowRight, CalendarClock, MessageCircle,
} from 'lucide-react'
import { getProjects, getAbout } from '../../lib/api'
import { slugify } from '../../lib/slug'
import { whatsappLink } from '../../lib/whatsapp'

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
    if (about?.booking_url) cmds.push({ id: 'act-book', group: 'Actions', label: 'Book a call', icon: CalendarClock, run: () => window.dispatchEvent(new Event('open-booking')) })
    cmds.push({ id: 'act-wa', group: 'Actions', label: 'Chat on WhatsApp', icon: MessageCircle, run: () => window.open(whatsappLink(), '_blank') })
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
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[12vh] px-4 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div className="w-full max-w-xl rounded-xl border border-white/10 bg-[#0c0c0e] shadow-2xl overflow-hidden font-mono" onClick={e => e.stopPropagation()}>
        {/* Title bar */}
        <div className="relative flex items-center gap-2 px-4 py-2.5 bg-[#1b1b1e] border-b border-white/10">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          <span className="absolute left-1/2 -translate-x-1/2 text-[11px] text-white/40">ahsan@portfolio — zsh</span>
        </div>

        {/* Prompt */}
        <div className="flex items-center gap-2 px-4 py-3 text-sm border-b border-white/5">
          <span className="text-[var(--btn-accent)]">❯</span>
          <span className="text-emerald-400">~</span>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="type to search commands…"
            className="flex-1 bg-transparent text-white/90 placeholder:text-white/25 focus:outline-none caret-[var(--btn-accent)]"
          />
        </div>

        {/* Output / list */}
        <div ref={listRef} className="max-h-[52vh] overflow-y-auto py-1.5 text-[13px]">
          {filtered.length === 0 && <p className="px-4 py-6 text-white/30">~ no matching command found</p>}
          {filtered.map((c) => {
            idx++
            const showHeader = c.group !== lastGroup
            lastGroup = c.group
            const i = idx
            const Icon = c.icon || ArrowRight
            return (
              <div key={c.id}>
                {showHeader && <p className="px-4 pt-3 pb-1 text-[10px] uppercase tracking-widest text-emerald-400/50"># {c.group}</p>}
                <button
                  data-idx={i}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => run(c)}
                  className={`w-full flex items-center gap-2.5 px-4 py-1.5 text-left ${i === active ? 'bg-[var(--btn-accent)]/10 text-white' : 'text-white/65'}`}
                >
                  <span className={`w-3 shrink-0 ${i === active ? 'text-[var(--btn-accent)]' : 'text-transparent'}`}>❯</span>
                  <Icon size={13} className={i === active ? 'text-[var(--btn-accent)]' : 'text-white/35'} />
                  <span className="flex-1 truncate">{c.label}</span>
                </button>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-white/10 bg-[#141416] flex items-center gap-4 text-[10px] text-white/30">
          <span><span className="text-white/50">↑↓</span> navigate</span>
          <span><span className="text-white/50">↵</span> run</span>
          <span className="ml-auto"><span className="text-white/50">esc</span> close</span>
        </div>
      </div>
    </div>
  )
}
