import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const LETTERS = 'AHSAN RAZA'.split('')

export default function LoadingScreen({ onDone }) {
  const [progress, setProgress]   = useState(0)
  const [visible, setVisible]     = useState(true)

  useEffect(() => {
    // Simulate load progress
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setVisible(false)
            setTimeout(onDone, 700)
          }, 300)
          return 100
        }
        return p + Math.random() * 12 + 3
      })
    }, 80)
    return () => clearInterval(interval)
  }, [onDone])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[var(--bg-void)]"
          exit={{ y: '-100%', transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }}
        >
          {/* Background grid */}
          <div className="grid-bg absolute inset-0 opacity-30" />

          {/* Center content */}
          <div className="relative z-10 flex flex-col items-center gap-8">
            {/* Letter-by-letter name */}
            <div className="flex gap-[2px] overflow-hidden">
              {LETTERS.map((l, i) => (
                <motion.span
                  key={i}
                  className={`font-display font-bold text-4xl md:text-6xl ${
                    l === ' ' ? 'w-4' : 'text-[var(--text-primary)]'
                  }`}
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  {l}
                </motion.span>
              ))}
            </div>

            {/* Tagline */}
            <motion.p
              className="font-mono text-sm text-[var(--amber-bright)] tracking-[0.3em] uppercase"
              initial={{ opacity: 0, letterSpacing: '0.1em' }}
              animate={{ opacity: 1, letterSpacing: '0.3em' }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              AI Engineer
            </motion.p>

            {/* Progress bar */}
            <motion.div
              className="w-64 h-px bg-[var(--bg-raised)] relative overflow-hidden rounded-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  background: 'linear-gradient(90deg, var(--amber-dim), var(--amber-bright))',
                  boxShadow: '0 0 12px var(--amber-bright)',
                }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.2 }}
              />
            </motion.div>

            {/* Percent */}
            <motion.span
              className="font-mono text-xs text-[var(--text-muted)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {Math.min(Math.floor(progress), 100)}%
            </motion.span>
          </div>

          {/* Corner decorations */}
          <div className="absolute top-6 left-6 font-mono text-xs text-[var(--border-mid)]">
            {'{ portfolio.ai }'}
          </div>
          <div className="absolute bottom-6 right-6 font-mono text-xs text-[var(--border-mid)]">
            v1.0.0
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
