import { useQuery } from '@tanstack/react-query'
import { getExperiences } from '../../lib/api'
import { Briefcase, GraduationCap, MapPin, Calendar } from 'lucide-react'

function TimelineItem({ item, index, isLast }) {
  const isWork = item.type === 'work'
  const Icon = isWork ? Briefcase : GraduationCap

  return (
    <div className="relative flex gap-6 group">
      {/* Line */}
      <div className="flex flex-col items-center">
        <div className={`
          w-10 h-10 rounded-full flex items-center justify-center z-10 flex-shrink-0
          border-2 transition-all duration-300 group-hover:scale-110
          ${isWork
            ? 'bg-green-500/10 border-green-500 text-green-400'
            : 'bg-purple-500/10 border-purple-500 text-purple-400'}
        `}>
          <Icon size={16} />
        </div>
        {!isLast && (
          <div className="w-px flex-1 mt-2 bg-gradient-to-b from-white/10 to-transparent min-h-[40px]" />
        )}
      </div>

      {/* Card */}
      <div className={`
        flex-1 pb-10 rounded-2xl border bg-white/[0.02] p-5
        transition-all duration-300 group-hover:bg-white/[0.04] group-hover:border-white/15
        ${isWork ? 'border-green-500/10' : 'border-purple-500/10'}
      `}>
        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="text-white font-semibold text-base">{item.title}</h3>
            {item.company && (
              <p className={`text-sm font-medium mt-0.5 ${isWork ? 'text-green-400' : 'text-purple-400'}`}>
                {item.company}
              </p>
            )}
          </div>
          {item.is_current && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/20">
              Current
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-3 text-xs text-white/40 mb-3">
          {item.location && (
            <span className="flex items-center gap-1">
              <MapPin size={11} />
              {item.location}
            </span>
          )}
          {(item.start_date || item.end_date) && (
            <span className="flex items-center gap-1">
              <Calendar size={11} />
              {item.start_date}
              {item.end_date && item.end_date !== item.start_date && ` — ${item.end_date}`}
              {item.is_current && ' — Present'}
            </span>
          )}
        </div>

        {item.description && (
          <p className="text-white/60 text-sm leading-relaxed">{item.description}</p>
        )}
      </div>
    </div>
  )
}

export default function Experience() {
  const { data, isLoading } = useQuery({
    queryKey: ['experience'],
    queryFn: () => getExperiences().then(r => r.data),
  })

  const items = data || []
  const work = items.filter(e => e.type === 'work')
  const education = items.filter(e => e.type === 'education')

  if (isLoading) {
    return (
      <section id="experience" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="h-8 w-48 bg-white/5 rounded animate-pulse mb-12 mx-auto" />
          <div className="space-y-6">
            {[1,2,3].map(i => (
              <div key={i} className="flex gap-6">
                <div className="w-10 h-10 rounded-full bg-white/5 animate-pulse flex-shrink-0" />
                <div className="flex-1 h-28 bg-white/5 rounded-2xl animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!items.length) return null

  return (
    <section id="experience" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-green-400 text-sm font-mono mb-3 tracking-widest uppercase">Journey</p>
          <h2 className="text-4xl font-bold text-white mb-4">
            Experience &{' '}
            <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
              Education
            </span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto">
            My professional journey and academic background.
          </p>
        </div>

        {work.length && education.length ? (
          /* Two-column layout when both exist */
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-green-400 mb-6 uppercase tracking-wider">
                <Briefcase size={14} /> Work
              </h3>
              {work.map((item, i) => (
                <TimelineItem key={item.id} item={item} index={i} isLast={i === work.length - 1} />
              ))}
            </div>
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-purple-400 mb-6 uppercase tracking-wider">
                <GraduationCap size={14} /> Education
              </h3>
              {education.map((item, i) => (
                <TimelineItem key={item.id} item={item} index={i} isLast={i === education.length - 1} />
              ))}
            </div>
          </div>
        ) : (
          /* Single column if only one type */
          <div className="max-w-2xl mx-auto">
            {items.map((item, i) => (
              <TimelineItem key={item.id} item={item} index={i} isLast={i === items.length - 1} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
