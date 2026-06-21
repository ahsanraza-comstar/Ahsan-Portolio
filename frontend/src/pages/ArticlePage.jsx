import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getArticle } from '../lib/api'
import { ArrowLeft, Calendar, Tag, X } from 'lucide-react'
import SEO from '../components/ui/SEO'
import DOMPurify from 'dompurify'

export default function ArticlePage() {
  const { slug } = useParams()
  const navigate = useNavigate()

  const { data: article, isLoading, isError } = useQuery({
    queryKey: ['article', slug],
    queryFn: () => getArticle(slug).then(r => r.data),
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] pt-28 px-4">
        <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
          <div className="h-6 w-24 bg-white/5 rounded" />
          <div className="h-10 w-3/4 bg-white/5 rounded" />
          <div className="h-4 w-1/2 bg-white/5 rounded" />
          <div className="aspect-video bg-white/5 rounded-2xl" />
          <div className="space-y-3">
            {[1,2,3,4,5].map(i => <div key={i} className="h-4 bg-white/5 rounded" />)}
          </div>
        </div>
      </div>
    )
  }

  if (isError || !article) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center text-center px-4">
        <p className="text-6xl mb-6">📄</p>
        <h1 className="text-2xl font-bold text-white mb-2">Article not found</h1>
        <p className="text-white/50 mb-8">This article may have been removed or the link is incorrect.</p>
        <button
          onClick={() => navigate('/#blog')}
          className="flex items-center gap-2 px-5 py-2 bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl hover:bg-green-500/20 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Blog
        </button>
      </div>
    )
  }

  const date = article.published_at
    ? new Date(article.published_at).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : null

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <SEO
        title={article.title}
        description={article.excerpt || undefined}
        image={article.thumbnail_url || undefined}
        url={`https://ahsanraza.dev/blog/${article.slug}`}
        type="article"
        article={{ publishedAt: article.published_at, tags: article.tags }}
      />
      <div className="max-w-3xl mx-auto px-4 pt-12 pb-20">
        {/* Back — macOS window controls (red dot goes back) */}
        <div className="group flex items-center gap-2 mb-10 w-fit">
          <button
            onClick={() => { navigate('/'); setTimeout(() => document.querySelector('#blog')?.scrollIntoView({ behavior: 'smooth' }), 100) }}
            aria-label="Back to blog"
            title="Back to blog"
            className="w-3.5 h-3.5 rounded-full bg-[#ff5f57] flex items-center justify-center hover:brightness-110 transition"
          >
            <X size={9} strokeWidth={3} className="text-black/70 opacity-0 group-hover:opacity-100" />
          </button>
          <span className="w-3.5 h-3.5 rounded-full bg-[#febc2e]" />
          <span className="w-3.5 h-3.5 rounded-full bg-[#28c840]" />
          <span className="ml-3 font-mono text-[11px] text-white/40">back to blog</span>
        </div>

        {/* Tags */}
        {article.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {article.tags.map(tag => (
              <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 flex items-center gap-1">
                <Tag size={10} />{tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
          {article.title}
        </h1>

        {/* Meta */}
        {date && (
          <p className="flex items-center gap-2 text-sm text-white/40 mb-8">
            <Calendar size={13} />{date}
          </p>
        )}

        {/* Thumbnail */}
        {article.thumbnail_url && (
          <div className="rounded-2xl overflow-hidden mb-10 border border-white/8">
            <img src={article.thumbnail_url} alt={article.title} className="w-full object-cover" />
          </div>
        )}

        {/* Excerpt */}
        {article.excerpt && (
          <p className="text-lg text-white/60 leading-relaxed mb-8 border-l-2 border-green-500/50 pl-4 italic">
            {article.excerpt}
          </p>
        )}

        {/* Content */}
        {article.content && (
          <div
            className="prose prose-invert prose-green max-w-none
              prose-headings:text-white prose-headings:font-semibold
              prose-p:text-white/70 prose-p:leading-relaxed
              prose-a:text-green-400 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-white
              prose-code:text-green-300 prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
              prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10
              prose-blockquote:border-green-500 prose-blockquote:text-white/60
              prose-img:rounded-xl prose-img:border prose-img:border-white/10
              prose-hr:border-white/10
              prose-ul:text-white/70 prose-ol:text-white/70
              prose-li:text-white/70"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }}
          />
        )}
      </div>
    </div>
  )
}
