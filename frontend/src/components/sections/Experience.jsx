import { useQuery } from '@tanstack/react-query'
import { getExperiences } from '../../lib/api'
import { Briefcase, GraduationCap, MapPin, Calendar } from 'lucide-react'

const CARD_W = 320
const GAP = 28
const STRIP_H = 96

/* Split a description into clean bullet parts (on the • char), collapsing stray line breaks. */
function parseDescription(desc) {
  if (!desc) return []
  return desc
    .split('•')
    .map(s => s.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
}

/* Render one bullet — bold a leading "Title:" prefix if present. */
function DescItem({ text }) {
  const m = text.match(/^([^:.]{3,45}):\s*(.+)$/)
  if (m) {
    return <li><span className="text-white/90 font-medium">{m[1]}:</span> {m[2]}</li>
  }
  return <li>{text}</li>
}

function JourneyCard({ item }) {
  const isWork = item.type === 'work'
  const accent = isWork ? 'text-green-400' : 'text-purple-400'
  const Icon = isWork ? Briefcase : GraduationCap
  const parts = parseDescription(item.description)

  return (
    <div
      className={`flex flex-col rounded-2xl border bg-white/[0.02] p-5 transition-colors duration-300 hover:bg-white/[0.04]
        ${isWork ? 'border-green-500/15 hover:border-green-500/30' : 'border-purple-500/15 hover:border-purple-500/30'}`}
      style={{ width: CARD_W }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className="flex items-center gap-2 min-w-0">
          <Icon size={15} className={`${accent} shrink-0`} />
          <h3 className="text-white font-semibold text-[15px] leading-tight truncate">{item.title}</h3>
        </div>
        {item.is_current && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/20 shrink-0">
            Current
          </span>
        )}
      </div>

      {item.company && <p className={`text-sm font-medium ${accent}`}>{item.company}</p>}

      {/* Meta */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-white/40 mt-2 mb-3">
        {item.location && (
          <span className="flex items-center gap-1"><MapPin size={11} />{item.location}</span>
        )}
        {(item.start_date || item.end_date) && (
          <span className="flex items-center gap-1">
            <Calendar size={11} />
            {item.start_date}
            {item.is_current ? ' — Present' : (item.end_date && item.end_date !== item.start_date ? ` — ${item.end_date}` : '')}
          </span>
        )}
      </div>

      {/* Description — bullets or paragraph */}
      {parts.length > 1 ? (
        <ul className="space-y-1.5 text-white/60 text-[13px] leading-relaxed text-justify list-disc pl-4 marker:text-green-500/60">
          {parts.map((p, i) => <DescItem key={i} text={p} />)}
        </ul>
      ) : parts.length === 1 ? (
        <p className="text-white/60 text-[13px] leading-relaxed text-justify">{parts[0]}</p>
      ) : null}
    </div>
  )
}

export default function Experience() {
  const { data, isLoading } = useQuery({
    queryKey: ['experience'],
    queryFn: () => getExperiences().then(r => r.data),
  })

  const items = data || []

  if (isLoading) {
    return (
      <section id="experience" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="h-8 w-48 bg-white/5 rounded animate-pulse mb-12 mx-auto" />
          <div className="flex gap-7 justify-center">
            {[1, 2, 3].map(i => <div key={i} className="w-80 h-56 bg-white/5 rounded-2xl animate-pulse" />)}
          </div>
        </div>
      </section>
    )
  }

  if (!items.length) return null

  const n = items.length
  const totalW = n * CARD_W + (n - 1) * GAP
  const nodeX = i => i * (CARD_W + GAP) + CARD_W / 2
  const nodeY = i => (i % 2 === 0 ? 24 : STRIP_H - 24)

  // Smooth curved path weaving through the milestone nodes
  let d = `M 0 ${STRIP_H / 2}`
  for (let i = 0; i < n; i++) {
    const x = nodeX(i), y = nodeY(i)
    const px = i === 0 ? 0 : nodeX(i - 1)
    const py = i === 0 ? STRIP_H / 2 : nodeY(i - 1)
    const cx = (px + x) / 2
    d += ` C ${cx} ${py}, ${cx} ${y}, ${x} ${y}`
  }
  const lastX = nodeX(n - 1), lastY = nodeY(n - 1)
  d += ` C ${(lastX + totalW) / 2} ${lastY}, ${(lastX + totalW) / 2} ${STRIP_H / 2}, ${totalW} ${STRIP_H / 2}`

  return (
    <section id="experience" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-green-400 text-sm font-mono mb-3 tracking-widest uppercase">Journey</p>
          <h2 className="text-4xl font-bold text-white mb-4">
            Experience &{' '}
            <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
              Education
            </span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto">My professional journey and academic background.</p>
        </div>

        {/* Horizontal curved-path timeline */}
        <div className="overflow-x-auto pb-4 -mx-4 px-4 [scrollbar-width:thin]">
          <div className="relative mx-auto" style={{ width: totalW }}>
            {/* Curved path + milestone nodes */}
            <svg width={totalW} height={STRIP_H} className="block">
              <defs>
                <linearGradient id="journeyGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity="0.15" />
                  <stop offset="50%" stopColor="#22c55e" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity="0.15" />
                </linearGradient>
              </defs>
              <path d={d} fill="none" stroke="url(#journeyGrad)" strokeWidth="2" strokeDasharray="2 6" strokeLinecap="round" />
              {items.map((item, i) => {
                const isWork = item.type === 'work'
                const c = isWork ? '#22c55e' : '#a855f7'
                return (
                  <g key={item.id}>
                    <line x1={nodeX(i)} y1={nodeY(i)} x2={nodeX(i)} y2={STRIP_H} stroke="#ffffff14" strokeWidth="1" />
                    <circle cx={nodeX(i)} cy={nodeY(i)} r="9" fill={c} fillOpacity="0.15" />
                    <circle cx={nodeX(i)} cy={nodeY(i)} r="4.5" fill="#0b0b0b" stroke={c} strokeWidth="2" />
                  </g>
                )
              })}
            </svg>

            {/* Cards row */}
            <div className="flex items-stretch" style={{ gap: GAP }}>
              {items.map(item => <JourneyCard key={item.id} item={item} />)}
            </div>
          </div>
        </div>

        <p className="text-center text-white/30 text-xs font-mono mt-4 md:hidden">← scroll to explore →</p>
      </div>
    </section>
  )
}
