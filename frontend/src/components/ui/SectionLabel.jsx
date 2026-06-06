export default function SectionLabel({ children, color = 'amber' }) {
  const colorStyle = color === 'teal'
    ? 'text-[var(--teal-bright)]'
    : 'text-[var(--amber-bright)]'

  return (
    <p className={`font-mono text-sm tracking-widest mb-3 ${colorStyle}`}>
      &lt; {children} /&gt;
    </p>
  )
}
