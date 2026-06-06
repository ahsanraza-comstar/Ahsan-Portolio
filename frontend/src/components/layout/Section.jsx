import { useScrollReveal } from '../../hooks/useScrollReveal'

export default function Section({ id, children, className = '', reveal = true, bg = 'void' }) {
  const ref = useScrollReveal()

  const bgMap = {
    void:    'bg-[var(--bg-void)]',
    deep:    'bg-[var(--bg-deep)]',
    surface: 'bg-[var(--bg-surface)]',
  }

  return (
    <section
      id={id}
      className={`py-24 px-6 md:px-12 lg:px-24 relative ${bgMap[bg] || bgMap.void} ${className}`}
    >
      <div
        ref={reveal ? ref : null}
        className={`${reveal ? 'reveal' : ''} max-w-7xl mx-auto`}
      >
        {children}
      </div>
    </section>
  )
}
