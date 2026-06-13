import { useQuery } from '@tanstack/react-query'
import { getTestimonials } from '../../lib/api'
import { Star, StarHalf, Quote } from 'lucide-react'

function TestimonialCard({ item }) {
  return (
    <div className="relative bg-white/[0.03] border border-white/8 rounded-2xl p-6 hover:bg-white/[0.05] hover:border-green-500/20 transition-all duration-300 flex flex-col gap-4">
      {/* Quote icon */}
      <Quote size={24} className="text-green-500/30 flex-shrink-0" />

      {/* Stars */}
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => {
          if (item.rating >= i + 1) return <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
          if (item.rating >= i + 0.5) return <StarHalf key={i} size={14} className="text-amber-400 fill-amber-400" />
          return <Star key={i} size={14} className="text-white/15" />
        })}
        {item.rating ? <span className="ml-1 text-amber-400/90 text-xs font-mono">{Number(item.rating).toFixed(1)}</span> : null}
      </div>

      {/* Content */}
      <p className="text-white/70 text-sm leading-relaxed flex-1 italic">
        &ldquo;{item.content}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-2 border-t border-white/5">
        {item.avatar_url ? (
          <img
            src={item.avatar_url}
            alt={item.name}
            className="w-10 h-10 rounded-full object-cover border border-white/10"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-green-400 text-sm font-bold">
            {item.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <p className="text-white text-sm font-semibold">{item.name}</p>
          {(item.role || item.company) && (
            <p className="text-white/40 text-xs">
              {[item.role, item.company].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Testimonials() {
  const { data, isLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => getTestimonials().then(r => r.data),
  })

  const items = data || []

  if (isLoading) {
    return (
      <section id="testimonials" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="h-8 w-48 bg-white/5 rounded animate-pulse mb-12 mx-auto" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="h-52 bg-white/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!items.length) return null

  return (
    <section id="testimonials" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-green-400 text-sm font-mono mb-3 tracking-widest uppercase">Social Proof</p>
          <h2 className="text-4xl font-bold text-white mb-4">
            What{' '}
            <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
              Clients Say
            </span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto">
            Feedback from people I&apos;ve had the pleasure of working with.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
            <TestimonialCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}
