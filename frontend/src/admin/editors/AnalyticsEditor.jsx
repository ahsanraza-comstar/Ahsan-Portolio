import { useQuery } from '@tanstack/react-query'
import api from '../../lib/api'
import { TrendingUp, Eye } from 'lucide-react'

export default function AnalyticsEditor() {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics-summary'],
    queryFn: () => api.get('/api/analytics/summary').then(r => r.data),
    refetchInterval: 30_000,
  })

  if (isLoading) return <div className="text-white/40 text-sm">Loading analytics…</div>

  return (
    <div className="max-w-3xl space-y-6">
      {/* Total views card */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 flex items-center gap-5">
        <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
          <Eye size={20} className="text-green-400" />
        </div>
        <div>
          <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Total Page Views</p>
          <p className="text-3xl font-bold text-white">{(data?.total_views ?? 0).toLocaleString()}</p>
        </div>
      </div>

      {/* Top pages */}
      {data?.top_pages?.length > 0 && (
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-white/70 mb-4">
            <TrendingUp size={14} className="text-green-400" /> Top Pages
          </h3>
          <div className="space-y-3">
            {data.top_pages.map(({ path, views }, i) => {
              const pct = Math.round((views / data.total_views) * 100)
              return (
                <div key={path} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70 font-mono truncate max-w-[70%]">
                      <span className="text-white/25 mr-2">{i + 1}.</span>{path}
                    </span>
                    <span className="text-white/50 text-xs">{views.toLocaleString()} views</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {!data?.total_views && (
        <p className="text-white/30 text-sm text-center py-10">No page views recorded yet. Visit the portfolio to start tracking.</p>
      )}
    </div>
  )
}
