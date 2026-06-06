const techColorMap = {
  python:   'badge-python',
  fastapi:  'badge-fastapi',
  flask:    'badge-fastapi',
  react:    'badge-react',
  nextjs:   'badge-react',
}

export default function Badge({ children, className = '' }) {
  const key = children?.toString().toLowerCase().replace(/[^a-z]/g, '')
  const colorClass = techColorMap[key] || 'badge-default'

  return (
    <span
      className={`
        inline-block px-2.5 py-0.5 text-xs font-mono rounded
        border ${colorClass} ${className}
      `}
    >
      {children}
    </span>
  )
}
