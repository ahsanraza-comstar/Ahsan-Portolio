import { useNavigate } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
      </div>

      {/* Glitch 404 */}
      <div className="relative mb-6 select-none">
        <span className="text-[120px] md:text-[180px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-white/10 to-white/5">
          404
        </span>
        <span className="absolute inset-0 flex items-center justify-center text-[120px] md:text-[180px] font-black leading-none text-green-500/20 blur-sm">
          404
        </span>
      </div>

      <div className="relative z-10">
        <p className="text-green-400 font-mono text-sm tracking-widest uppercase mb-3">
          Page Not Found
        </p>
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Looks like you&apos;re lost
        </h1>
        <p className="text-white/50 max-w-sm mx-auto mb-10 text-sm leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white/70 rounded-xl hover:bg-white/10 hover:text-white transition-all text-sm"
          >
            <ArrowLeft size={16} /> Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-green-500/15 border border-green-500/30 text-green-400 rounded-xl hover:bg-green-500/25 transition-all text-sm font-medium"
          >
            <Home size={16} /> Back to Home
          </button>
        </div>
      </div>

      {/* Decorative terminal line */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-xs text-white/15">
        <span className="text-green-500/40">$ </span>
        curl -X GET /this-page → 404 Not Found
      </div>
    </div>
  )
}
