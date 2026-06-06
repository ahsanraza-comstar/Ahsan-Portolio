import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  User, Briefcase, Code2, Award, FolderKanban,
  MessageSquare, LogOut, Menu, X, ExternalLink, ChevronRight, Settings,
  Clock, Star, FileText, BarChart2
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import logoUrl from '../assets/logo.png'
import AboutEditor from './editors/AboutEditor'
import ServicesEditor from './editors/ServicesEditor'
import SkillsEditor from './editors/SkillsEditor'
import CertsEditor from './editors/CertsEditor'
import ProjectsEditor from './editors/ProjectsEditor'
import MessagesEditor from './editors/MessagesEditor'
import AccountEditor from './editors/AccountEditor'
import ExperienceEditor from './editors/ExperienceEditor'
import TestimonialsEditor from './editors/TestimonialsEditor'
import ArticlesEditor from './editors/ArticlesEditor'
import AnalyticsEditor from './editors/AnalyticsEditor'

const NAV_ITEMS = [
  { key: 'about',        label: 'About',          icon: User },
  { key: 'services',     label: 'Services',       icon: Briefcase },
  { key: 'skills',       label: 'Skills',         icon: Code2 },
  { key: 'certs',        label: 'Certifications', icon: Award },
  { key: 'projects',     label: 'Projects',       icon: FolderKanban },
  { key: 'experience',   label: 'Experience',     icon: Clock },
  { key: 'testimonials', label: 'Testimonials',   icon: Star },
  { key: 'articles',     label: 'Blog / Articles',icon: FileText },
  { key: 'analytics',    label: 'Analytics',      icon: BarChart2 },
  { key: 'messages',     label: 'Messages',       icon: MessageSquare },
  { key: 'account',      label: 'Account',        icon: Settings },
]

const EDITORS = {
  about:        AboutEditor,
  services:     ServicesEditor,
  skills:       SkillsEditor,
  certs:        CertsEditor,
  projects:     ProjectsEditor,
  experience:   ExperienceEditor,
  testimonials: TestimonialsEditor,
  articles:     ArticlesEditor,
  analytics:    AnalyticsEditor,
  messages:     MessagesEditor,
  account:      AccountEditor,
}

export default function AdminDashboard() {
  const [active, setActive]         = useState('about')
  const [sideOpen, setSideOpen]     = useState(true)
  const [mobileDrawer, setMobileDrawer] = useState(false)
  const { admin, logout }           = useAuth()
  const navigate                    = useNavigate()

  const handleLogout = () => { logout(); navigate('/admin') }
  const ActiveEditor = EDITORS[active] || (() => <div />)

  const NAV_LIST = NAV_ITEMS.map(({ key, label, icon: Icon }) => (
    <button
      key={key}
      onClick={() => { setActive(key); setMobileDrawer(false) }}
      className={`
        admin-nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-sm)] text-sm transition-all
        ${active === key ? 'active' : 'text-[var(--text-muted)] hover:text-[var(--text-body)] hover:bg-[var(--bg-raised)]'}
      `}
    >
      <Icon size={16} className="flex-shrink-0" />
      <span className="font-body">{label}</span>
      {active === key && <ChevronRight size={14} className="ml-auto" />}
    </button>
  ))

  const SIDEBAR_FOOTER = (
    <div className="p-2 border-t border-[var(--border-subtle)] space-y-1">
      <a href="/" target="_blank" rel="noreferrer"
        className="flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:text-[var(--text-body)] transition-colors text-sm">
        <ExternalLink size={15} className="flex-shrink-0" />
        <span>View Site</span>
      </a>
      <button onClick={handleLogout}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-sm)] text-[var(--rose-bright)] hover:bg-[rgba(255,107,107,0.06)] transition-colors text-sm">
        <LogOut size={15} className="flex-shrink-0" />
        <span>Logout</span>
      </button>
    </div>
  )

  return (
    <div className="min-h-screen bg-[var(--bg-void)] flex">

      {/* ── Desktop sidebar ─────────────────────────────────────────────────── */}
      <aside className={`admin-sidebar hidden md:flex fixed inset-y-0 left-0 z-40 flex-col transition-all duration-300 ${sideOpen ? 'w-60' : 'w-16'}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)]">
          {sideOpen && <img src={logoUrl} alt="Logo" className="h-8 w-auto object-contain" />}
          <button onClick={() => setSideOpen(v => !v)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] ml-auto">
            {sideOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
        {/* Nav */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`admin-nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-sm)] text-sm transition-all ${active === key ? 'active' : 'text-[var(--text-muted)] hover:text-[var(--text-body)] hover:bg-[var(--bg-raised)]'}`}
            >
              <Icon size={16} className="flex-shrink-0" />
              {sideOpen && <span className="font-body">{label}</span>}
              {sideOpen && active === key && <ChevronRight size={14} className="ml-auto" />}
            </button>
          ))}
        </nav>
        {/* Footer */}
        <div className="p-2 border-t border-[var(--border-subtle)] space-y-1">
          <a href="/" target="_blank" rel="noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:text-[var(--text-body)] transition-colors text-sm">
            <ExternalLink size={15} className="flex-shrink-0" />
            {sideOpen && <span>View Site</span>}
          </a>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-sm)] text-[var(--rose-bright)] hover:bg-[rgba(255,107,107,0.06)] transition-colors text-sm">
            <LogOut size={15} className="flex-shrink-0" />
            {sideOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ── Mobile drawer ────────────────────────────────────────────────────── */}
      {mobileDrawer && (
        <div className="fixed inset-0 z-40 bg-black/70 md:hidden" onClick={() => setMobileDrawer(false)} />
      )}
      <aside className={`admin-sidebar fixed inset-y-0 left-0 z-50 w-64 flex flex-col md:hidden transition-transform duration-300 ${mobileDrawer ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)]">
          <img src={logoUrl} alt="Logo" className="h-8 w-auto object-contain" />
          <button onClick={() => setMobileDrawer(false)} className="text-[var(--text-muted)]"><X size={16} /></button>
        </div>
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => { setActive(key); setMobileDrawer(false) }}
              className={`admin-nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-sm)] text-sm transition-all ${active === key ? 'active' : 'text-[var(--text-muted)] hover:text-[var(--text-body)] hover:bg-[var(--bg-raised)]'}`}
            >
              <Icon size={16} className="flex-shrink-0" />
              <span className="font-body">{label}</span>
              {active === key && <ChevronRight size={14} className="ml-auto" />}
            </button>
          ))}
        </nav>
        <div className="p-2 border-t border-[var(--border-subtle)] space-y-1">
          <a href="/" target="_blank" rel="noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:text-[var(--text-body)] transition-colors text-sm">
            <ExternalLink size={15} /><span>View Site</span>
          </a>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-sm)] text-[var(--rose-bright)] hover:bg-[rgba(255,107,107,0.06)] transition-colors text-sm">
            <LogOut size={15} /><span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────────────────── */}
      <main className={`flex-1 transition-all duration-300 ${sideOpen ? 'md:ml-60' : 'md:ml-16'}`}>
        <header className="sticky top-0 z-30 bg-[var(--bg-deep)] border-b border-[var(--border-subtle)] px-4 md:px-6 py-4 flex items-center gap-3">
          <button className="md:hidden text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 flex-shrink-0" onClick={() => setMobileDrawer(v => !v)}>
            <Menu size={20} />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="font-body font-semibold text-[var(--text-primary)] capitalize truncate">
              {NAV_ITEMS.find(n => n.key === active)?.label}
            </h1>
            <p className="text-[var(--text-muted)] text-xs font-mono truncate">{admin?.email}</p>
          </div>
        </header>
        <div className="p-4 md:p-6">
          <ActiveEditor />
        </div>
      </main>
    </div>
  )
}
