import { useQuery } from '@tanstack/react-query'
import { Github, Star, Users, BookMarked, ExternalLink } from 'lucide-react'

const LANG_COLORS = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5', Dart: '#00B4AB',
  HTML: '#e34c26', CSS: '#563d7c', PHP: '#4F5D95', 'C++': '#f34b7d', C: '#555555',
  'C#': '#178600', Shell: '#89e051', Java: '#b07219', Go: '#00ADD8', Ruby: '#701516',
  Kotlin: '#A97BFF', Swift: '#F05138', Vue: '#41b883', 'Jupyter Notebook': '#DA5B0B',
  Blade: '#f7523f', PowerShell: '#012456', Batchfile: '#C1F12E', CMake: '#DA3434',
  'Objective-C': '#438eff', PLpgSQL: '#336790', Dockerfile: '#384d54', SCSS: '#c6538c',
}

function StatCard({ icon: Icon, value, label }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 flex flex-col items-center text-center">
      <Icon size={18} className="text-green-400 mb-2" />
      <span className="text-white text-2xl font-bold">{value ?? '—'}</span>
      <span className="text-white/40 text-xs font-mono mt-1">{label}</span>
    </div>
  )
}

export default function GitHubStats({ username = 'AhsanRaza-dev' }) {
  const { data, isLoading } = useQuery({
    queryKey: ['github', username],
    queryFn: async () => {
      const [pu, pr] = await Promise.all([
        fetch(`https://api.github.com/users/${username}`),
        fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`),
      ])
      const profile = await pu.json()
      const reposRaw = await pr.json()
      const repos = Array.isArray(reposRaw) ? reposRaw : []
      const totalStars = repos.reduce((s, r) => s + (r.stargazers_count || 0), 0)
      const top = repos
        .filter(r => !r.fork)
        .sort((a, b) => (b.stargazers_count - a.stargazers_count) || (new Date(b.pushed_at) - new Date(a.pushed_at)))
        .slice(0, 6)
      const langCount = {}
      repos.forEach(r => { if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1 })
      const langs = Object.entries(langCount).sort((a, b) => b[1] - a[1]).slice(0, 8)
      return { profile, totalStars, top, langs }
    },
    staleTime: 1000 * 60 * 30,
    retry: 1,
  })

  if (isLoading || !data || !data.profile || !data.profile.login) return null
  const { profile, totalStars, top, langs } = data

  return (
    <section id="github" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-green-400 text-sm font-mono mb-3 tracking-widest uppercase">Open Source</p>
          <h2 className="text-4xl font-bold text-white mb-4">
            GitHub <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">Activity</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto">Live stats and recent work, straight from my GitHub.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={BookMarked} value={profile.public_repos} label="Repositories" />
          <StatCard icon={Star} value={totalStars} label="Total Stars" />
          <StatCard icon={Users} value={profile.followers} label="Followers" />
          <StatCard icon={Github} value={profile.following} label="Following" />
        </div>

        {/* Contribution graph */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 mb-8 overflow-x-auto">
          <p className="font-mono text-[10px] tracking-[0.3em] text-green-400 uppercase mb-4">Contributions</p>
          <img
            src={`https://ghchart.rshah.org/4ade80/${username}`}
            alt={`${username} GitHub contribution graph`}
            loading="lazy"
            className="w-full min-w-[640px]"
            onError={(e) => { const p = e.currentTarget.parentElement; if (p) p.style.display = 'none' }}
          />
        </div>

        {/* Top repositories */}
        {top.length > 0 && (
          <>
            <p className="font-mono text-[10px] tracking-[0.3em] text-green-400 uppercase mb-4">Top Repositories</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {top.map(r => (
                <a
                  key={r.id}
                  href={r.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="group rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:border-green-500/30 hover:bg-white/[0.04] transition-colors p-5 flex flex-col"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="flex items-center gap-2 text-white font-semibold text-sm min-w-0">
                      <Github size={14} className="text-green-400 shrink-0" />
                      <span className="truncate">{r.name}</span>
                    </span>
                    <ExternalLink size={13} className="text-white/30 group-hover:text-green-400 shrink-0" />
                  </div>
                  <p className="text-white/50 text-xs leading-relaxed flex-1 line-clamp-2 mb-3">{r.description || 'No description'}</p>
                  <div className="flex items-center gap-4 text-white/40 text-[11px] font-mono">
                    {r.language && (
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: LANG_COLORS[r.language] || '#888' }} />
                        {r.language}
                      </span>
                    )}
                    <span className="flex items-center gap-1"><Star size={11} /> {r.stargazers_count}</span>
                  </div>
                </a>
              ))}
            </div>
          </>
        )}

        {/* Languages */}
        {langs.length > 0 && (
          <>
            <p className="font-mono text-[10px] tracking-[0.3em] text-green-400 uppercase mb-4">Most Used Languages</p>
            <div className="flex flex-wrap gap-2">
              {langs.map(([lang]) => (
                <span key={lang} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.02] text-white/70 text-xs font-mono">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: LANG_COLORS[lang] || '#888' }} />
                  {lang}
                </span>
              ))}
            </div>
          </>
        )}

        {/* CTA */}
        <div className="text-center mt-10">
          <a
            href={profile.html_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 font-mono text-xs tracking-widest rounded-lg border border-white/15 text-white/80 hover:border-white hover:text-white transition-all"
          >
            <Github size={14} /> View full profile
          </a>
        </div>
      </div>
    </section>
  )
}
