import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center text-center px-4">
        <div className="mb-6 text-5xl select-none">⚠️</div>
        <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
        <p className="text-white/50 max-w-sm mb-8 text-sm">
          The app encountered an unexpected error. This is usually caused by the backend being offline.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-5 py-2.5 bg-white/5 border border-white/10 text-white/70 rounded-xl hover:bg-white/10 transition-all text-sm"
          >
            Try again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-green-500/15 border border-green-500/30 text-green-400 rounded-xl hover:bg-green-500/25 transition-all text-sm font-medium"
          >
            Reload page
          </button>
        </div>
        {import.meta.env.DEV && this.state.error && (
          <pre className="mt-8 text-left text-xs text-red-400/70 bg-white/5 border border-white/5 rounded-xl p-4 max-w-xl overflow-auto">
            {this.state.error.toString()}
          </pre>
        )}
      </div>
    )
  }
}
