export default function Card({ children, className = '', hover = true, glow = false }) {
  return (
    <div
      className={`
        bg-[var(--bg-deep)] border border-[var(--border-subtle)]
        rounded-[var(--radius-lg)] p-6
        ${hover ? 'hover:border-[var(--border-mid)] hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(245,197,24,0.08)]' : ''}
        ${glow ? 'shadow-[var(--shadow-amber)]' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}
