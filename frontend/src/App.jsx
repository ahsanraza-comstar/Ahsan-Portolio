import { useState, lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { motion, useScroll, useSpring } from 'framer-motion'

import { useCursorGlow } from './hooks/useCursorGlow'
import { useAnalytics } from './hooks/useAnalytics'
import { getAbout, getServices, getSkills, getCertifications, getProjects } from './lib/api'

import SEO from './components/ui/SEO'
import LoadingScreen from './components/ui/LoadingScreen'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ErrorBoundary from './components/ui/ErrorBoundary'

// Main sections — eager (above the fold / critical)
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Services from './components/sections/Services'
import Skills from './components/sections/Skills'
import Certifications from './components/sections/Certifications'
import Projects from './components/sections/Projects'
import Contact from './components/sections/Contact'

// Below-fold sections — lazy
const Experience   = lazy(() => import('./components/sections/Experience'))
const Testimonials = lazy(() => import('./components/sections/Testimonials'))
const Blog         = lazy(() => import('./components/sections/Blog'))

// Heavy pages — lazy (not needed until navigation)
const ProjectPage  = lazy(() => import('./pages/ProjectPage'))
const ArticlePage  = lazy(() => import('./pages/ArticlePage'))
const NotFound     = lazy(() => import('./pages/NotFound'))

// Admin — lazy (separate user, large bundle)
const AdminLogin     = lazy(() => import('./admin/AdminLogin'))
const AdminDashboard = lazy(() => import('./admin/AdminDashboard'))
import PrivateRoute from './admin/PrivateRoute'

// Minimal fallback while lazy chunks load
function PageSpin() {
  return (
    <div className="min-h-[200px] flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-green-500/30 border-t-green-400 rounded-full animate-spin" />
    </div>
  )
}

// Smooth scroll progress bar
function ScrollBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 })
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[100] h-[2px] origin-left"
      style={{
        scaleX,
        background: 'linear-gradient(90deg, var(--amber-dim), var(--amber-bright), var(--teal-bright))',
        boxShadow: '0 0 8px var(--amber-bright)',
      }}
    />
  )
}

function Portfolio() {
  useCursorGlow()
  useAnalytics()

  const { data: about }          = useQuery({ queryKey: ['about'],          queryFn: () => getAbout().then(r => r.data),          staleTime: 300_000 })
  const { data: services }       = useQuery({ queryKey: ['services'],       queryFn: () => getServices().then(r => r.data),       staleTime: 300_000 })
  const { data: skills }         = useQuery({ queryKey: ['skills'],         queryFn: () => getSkills().then(r => r.data),         staleTime: 300_000 })
  const { data: certifications } = useQuery({ queryKey: ['certifications'], queryFn: () => getCertifications().then(r => r.data), staleTime: 300_000 })
  const { data: projects }       = useQuery({ queryKey: ['projects'],       queryFn: () => getProjects().then(r => r.data),       staleTime: 300_000 })

  return (
    <>
      <SEO
        description={about?.bio || undefined}
        image={about?.avatar_url || '/og-image.png'}
      />
      <ScrollBar />
      <Navbar />
      <main>
        <Hero          about={about} projects={projects} certifications={certifications} />
        <About         about={about} projects={projects} certifications={certifications} />
        <Services      services={services} about={about} projects={projects} certifications={certifications} />
        <Skills        skills={skills} />
        <Certifications certifications={certifications} />
        <Projects      projects={projects} />
        <Suspense fallback={null}>
          <Experience />
          <Testimonials />
          <Blog />
        </Suspense>
        <Contact       about={about} />
      </main>
      <Footer about={about} />
    </>
  )
}

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const isAdmin = window.location.pathname.startsWith('/admin')

  return (
    <ErrorBoundary>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--bg-overlay)',
            color:      'var(--text-primary)',
            border:     '1px solid var(--border-mid)',
            fontFamily: 'Outfit, sans-serif',
            fontSize:   '14px',
            backdropFilter: 'blur(12px)',
          },
          success: { iconTheme: { primary: 'var(--amber-bright)', secondary: 'var(--bg-void)' } },
          error:   { iconTheme: { primary: 'var(--rose-bright)',  secondary: 'var(--bg-void)' } },
        }}
      />

      {!isAdmin && !loaded && (
        <LoadingScreen onDone={() => setLoaded(true)} />
      )}

      <Suspense fallback={<PageSpin />}>
        <Routes>
          <Route path="/"                  element={<Portfolio />} />
          <Route path="/projects/:id"      element={<ProjectPage />} />
          <Route path="/blog/:slug"        element={<ArticlePage />} />
          <Route path="/admin"             element={<AdminLogin />} />
          <Route path="/admin/dashboard/*" element={
            <PrivateRoute><AdminDashboard /></PrivateRoute>
          } />
          <Route path="*"                  element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  )
}
