import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, Send, RotateCcw } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { chat } from '../../lib/api'

const STARTERS = [
  "What's Ahsan's experience with LLMs?",
  'Tell me about his best projects',
  "What's his tech stack?",
  'Is he open to work?',
]
const STORE_KEY = 'ahsan_chat_v1'

const mdComponents = {
  a: ({ node, ...props }) => <a {...props} target="_blank" rel="noreferrer" />,
}

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || [] } catch { return [] }
  })
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)
  const taRef = useRef(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading, open])
  useEffect(() => {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(messages.slice(-30))) } catch {}
  }, [messages])
  // Allow other components (e.g. the command palette) to open the chat
  useEffect(() => {
    const openIt = () => setOpen(true)
    window.addEventListener('open-chat', openIt)
    return () => window.removeEventListener('open-chat', openIt)
  }, [])

  function autoGrow(el) {
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 120) + 'px'
  }

  async function send(text) {
    const q = (text ?? input).trim()
    if (!q || loading) return
    const history = messages.slice(-8)
    setMessages(m => [...m, { role: 'user', content: q }])
    setInput('')
    if (taRef.current) taRef.current.style.height = 'auto'
    setLoading(true)
    try {
      let res
      for (let attempt = 0; attempt < 3; attempt++) {
        try { res = await chat({ message: q, history }); break }
        catch (err) {
          const status = err.response?.status
          const retriable = !err.response || status >= 500           // network/timeout or server error
          if (attempt < 2 && retriable) { await new Promise(r => setTimeout(r, 700 * (attempt + 1))); continue }
          throw err
        }
      }
      setMessages(m => [...m, { role: 'assistant', content: res.data.answer }])
    } catch (e) {
      const msg = e.response?.status === 429
        ? "I'm getting a lot of questions right now — please wait a few seconds and try again."
        : (e.response?.data?.detail || "Hmm, I couldn't reach the assistant. Please try again in a moment.")
      setMessages(m => [...m, { role: 'assistant', content: msg }])
    } finally {
      setLoading(false)
    }
  }

  function clearChat() {
    setMessages([])
    try { localStorage.removeItem(STORE_KEY) } catch {}
  }

  return (
    <>
      {/* Launcher */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Ask about Ahsan"
        className="fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full bg-[var(--btn-accent)] text-black flex items-center justify-center shadow-[0_10px_30px_-8px_rgba(245,197,24,0.6)] hover:scale-105 active:scale-95 transition-transform"
      >
        {open ? <X size={22} /> : <Sparkles size={22} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-5 z-40 w-[92vw] max-w-[390px] h-[580px] max-h-[74vh] flex flex-col rounded-xl border border-white/10 bg-[#0c0c0e] shadow-2xl overflow-hidden font-mono"
          >
            {/* macOS title bar — red dot closes */}
            <div className="relative flex items-center gap-2 px-4 py-2.5 bg-[#1b1b1e] border-b border-white/10 shrink-0">
              <button onClick={() => setOpen(false)} aria-label="Close" title="Close"
                className="group w-3 h-3 rounded-full bg-[#ff5f57] flex items-center justify-center hover:brightness-110 transition">
                <X size={8} strokeWidth={3} className="text-black/70 opacity-0 group-hover:opacity-100" />
              </button>
              <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <span className="w-3 h-3 rounded-full bg-[#28c840]" />
              <span className="absolute left-1/2 -translate-x-1/2 text-[11px] text-white/40">ask-ahsan — zsh</span>
              {messages.length > 0 && (
                <button onClick={clearChat} aria-label="New chat" title="New chat" className="ml-auto text-white/40 hover:text-white transition-colors"><RotateCcw size={14} /></button>
              )}
            </div>

            {/* Status strip */}
            <div className="px-4 py-1.5 border-b border-white/5 flex items-center gap-2 text-[10px] tracking-wide text-white/35 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#28c840]" style={{ boxShadow: '0 0 6px #28c840' }} />
              ai assistant · nvidia nim · online
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.length === 0 && (
                <div className="space-y-3">
                  <p className="text-white/70 text-sm leading-relaxed font-body">Hi! 👋 I'm Ahsan's AI assistant. Ask me anything about his work, skills, or projects.</p>
                  <div className="flex flex-col gap-2 pt-1">
                    {STARTERS.map(s => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        className="group flex items-center gap-2 text-left text-xs text-white/70 hover:text-white border border-white/10 hover:border-[var(--btn-accent)]/50 hover:bg-white/[0.03] rounded-lg px-3 py-2 transition-colors"
                      >
                        <span className="text-[var(--btn-accent)] shrink-0">❯</span>
                        <span>{s}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.role === 'user' ? (
                    <div className="max-w-[85%] rounded-2xl rounded-br-sm px-3.5 py-2 text-sm leading-relaxed whitespace-pre-wrap bg-[var(--btn-accent)] text-black font-body">
                      {m.content}
                    </div>
                  ) : (
                    <div className="max-w-[88%] rounded-2xl rounded-bl-sm px-3.5 py-2.5 text-sm leading-relaxed bg-white/[0.04] text-white/85 border border-white/10 font-body
                      [&_p]:mb-2 [&_p:last-child]:mb-0
                      [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:mb-2 [&_ul]:space-y-1
                      [&_ol]:list-decimal [&_ol]:pl-4 [&_ol]:mb-2 [&_ol]:space-y-1
                      [&_li]:marker:text-[var(--btn-accent)]/60
                      [&_strong]:text-white [&_strong]:font-semibold
                      [&_a]:text-[var(--btn-accent)] [&_a]:underline [&_a]:break-words
                      [&_code]:bg-black/30 [&_code]:px-1 [&_code]:rounded [&_code]:text-[var(--btn-accent)] [&_code]:text-xs [&_code]:font-mono">
                      <ReactMarkdown components={mdComponents}>{m.content}</ReactMarkdown>
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/[0.04] border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
                    <span className="w-1.5 h-1.5 bg-[var(--btn-accent)]/70 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-[var(--btn-accent)]/70 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-[var(--btn-accent)]/70 rounded-full animate-bounce" />
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input — terminal prompt */}
            <form onSubmit={(e) => { e.preventDefault(); send() }} className="p-3 border-t border-white/10 bg-[#141416] flex items-end gap-2">
              <span className="text-[var(--btn-accent)] text-sm pb-2 select-none">❯</span>
              <textarea
                ref={taRef}
                value={input}
                onChange={(e) => { setInput(e.target.value); autoGrow(e.target) }}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
                placeholder="ask a question…"
                rows={1}
                maxLength={1000}
                className="flex-1 resize-none bg-transparent px-1 py-2 text-sm text-white/90 placeholder:text-white/25 focus:outline-none max-h-[120px] caret-[var(--btn-accent)]"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Send"
                className="w-9 h-9 shrink-0 rounded-lg bg-[var(--btn-accent)] text-black flex items-center justify-center disabled:opacity-40 hover:brightness-110 transition-all"
              >
                <Send size={15} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
