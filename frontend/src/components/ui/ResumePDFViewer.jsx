import { createPortal } from 'react-dom'
import { X, Download, ExternalLink } from 'lucide-react'

export default function ResumePDFViewer({ url, onClose }) {
  if (!url) return null

  return createPortal(
    <div
      className="fixed inset-0 flex flex-col z-[9999]"
      style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 py-3 bg-black/60 border-b border-white/8 flex-shrink-0">
        <span className="text-white/70 text-sm font-mono">Resume / CV</span>
        <div className="flex items-center gap-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white/60 hover:text-white border border-white/10 rounded-lg hover:border-white/20 transition-all"
          >
            <ExternalLink size={12} /> Open in new tab
          </a>
          <a
            href={url}
            download
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-green-400 hover:text-green-300 border border-green-500/30 rounded-lg hover:border-green-500/50 hover:bg-green-500/10 transition-all"
          >
            <Download size={12} /> Download
          </a>
          <button
            onClick={onClose}
            className="p-1.5 text-white/50 hover:text-white transition-colors rounded-lg hover:bg-white/5"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* PDF iframe */}
      <div className="flex-1 p-4">
        <iframe
          src={`${url}#toolbar=0&navpanes=0&scrollbar=1`}
          title="Resume"
          className="w-full h-full rounded-xl border border-white/10"
          style={{ background: '#1a1a1a' }}
        />
      </div>
    </div>,
    document.body
  )
}
