import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { getArticles } from '../../lib/api'
import { Calendar, Tag, ArrowRight } from 'lucide-react'

function ArticleCard({ article }) {
  const navigate = useNavigate()

  const date = article.published_at
    ? new Date(article.published_at).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
      })
    : null

  return (
    <article
      onClick={() => navigate(`/blog/${article.slug}`)}
      className="group cursor-pointer bg-white/[0.03] border border-white/8 rounded-2xl overflow-hidden hover:border-green-500/25 hover:bg-white/[0.05] transition-all duration-300 flex flex-col"
    >
      {article.thumbnail_url && (
        <div className="aspect-video overflow-hidden">
          <img
            src={article.thumbnail_url}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-6 flex flex-col gap-3 flex-1">
        {/* Tags */}
        {article.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {article.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 flex items-center gap-1">
                <Tag size={9} />{tag}
              </span>
            ))}
          </div>
        )}

        <h3 className="text-white font-semibold text-lg leading-snug group-hover:text-green-400 transition-colors">
          {article.title}
        </h3>

        {article.excerpt && (
          <p className="text-white/50 text-sm leading-relaxed flex-1 line-clamp-3">
            {article.excerpt}
          </p>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          {date && (
            <span className="flex items-center gap-1.5 text-xs text-white/35">
              <Calendar size={11} />{date}
            </span>
          )}
          <span className="flex items-center gap-1 text-xs text-green-400 ml-auto group-hover:gap-2 transition-all">
            Read more <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </article>
  )
}

export default function Blog() {
  const { data, isLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: () => getArticles().then(r => r.data),
  })

  const items = data || []

  if (isLoading) {
    return (
      <section id="blog" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="h-8 w-48 bg-white/5 rounded animate-pulse mb-12 mx-auto" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => <div key={i} className="h-64 bg-white/5 rounded-2xl animate-pulse" />)}
          </div>
        </div>
      </section>
    )
  }

  if (!items.length) return null

  return (
    <section id="blog" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-green-400 text-sm font-mono mb-3 tracking-widest uppercase">Insights</p>
          <h2 className="text-4xl font-bold text-white mb-4">
            Blog &{' '}
            <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
              Articles
            </span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto">
            Thoughts on AI, machine learning, and software engineering.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  )
}
