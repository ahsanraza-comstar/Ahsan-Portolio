import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, Send, Bot, RotateCcw } from 'lucide-react'
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
      const res = await chat({ message: q, history })
      setMessages(m => [...m, { role: 'assistant', content: res.data.answer }])
    } catch (e) {
      const msg = e.response?.data?.detail || 'Sorry, the assistant is unavailable right now. Please try again.'
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
            className="fixed bottom-24 right-5 z-40 w-[92vw] max-w-[380px] h-[560px] max-h-[72vh] flex flex-col rounded-2xl border border-white/10 bg-[var(--bg-deep)] shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-white/[0.03]">
              <div className="w-8 h-8 rounded-full bg-[var(--btn-accent)]/15 border border-[var(--btn-accent)]/30 flex items-center justify-center text-[var(--btn-accent)]">
                <Bot size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold leading-tight">Ask about Ahsan</p>
                <p className="text-white/40 text-[11px] font-mono">AI assistant · NVIDIA NIM</p>
              </div>
              {messages.length > 0 && (
                <button onClick={clearChat} aria-label="New chat" title="New chat" className="text-white/40 hover:text-white"><RotateCcw size={15} /></button>
              )}
              <button onClick={() => setOpen(false)} aria-label="Close" className="text-white/40 hover:text-white"><X size={18} /></button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.length === 0 && (
                <div className="space-y-3">
                  <p className="text-white/60 text-sm">Hi! 👋 I'm Ahsan's AI assistant. Ask me anything about his work, skills, or projects.</p>
                  <div className="flex flex-col gap-2">
                    {STARTERS.map(s => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        className="text-left text-xs font-mono text-[var(--btn-accent)] border border-white/10 hover:border-[var(--btn-accent)]/50 rounded-lg px-3 py-2 transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.role === 'user' ? (
                    <div className="max-w-[85%] rounded-2xl rounded-br-sm px-3.5 py-2 text-sm leading-relaxed whitespace-pre-wrap bg-[var(--btn-accent)] text-black">
                      {m.content}
                    </div>
                  ) : (
                    <div className="max-w-[88%] rounded-2xl rounded-bl-sm px-3.5 py-2.5 text-sm leading-relaxed bg-white/[0.05] text-white/85 border border-white/10
                      [&_p]:mb-2 [&_p:last-child]:mb-0
                      [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:mb-2 [&_ul]:space-y-1
                      [&_ol]:list-decimal [&_ol]:pl-4 [&_ol]:mb-2 [&_ol]:space-y-1
                      [&_li]:marker:text-[var(--btn-accent)]/60
                      [&_strong]:text-white [&_strong]:font-semibold
                      [&_a]:text-[var(--btn-accent)] [&_a]:underline [&_a]:break-words
                      [&_code]:bg-black/30 [&_code]:px-1 [&_code]:rounded [&_code]:text-[var(--btn-accent)] [&_code]:text-xs">
                      <ReactMarkdown components={mdComponents}>{m.content}</ReactMarkdown>
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/[0.05] border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
                    <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" />
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <form onSubmit={(e) => { e.preventDefault(); send() }} className="p-3 border-t border-white/10 flex items-end gap-2">
              <textarea
                ref={taRef}
                value={input}
                onChange={(e) => { setInput(e.target.value); autoGrow(e.target) }}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
                placeholder="Ask a question..."
                rows={1}
                maxLength={1000}
                className="flex-1 resize-none bg-[var(--bg-surface)] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--btn-accent)]/50 max-h-[120px]"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Send"
                className="w-9 h-9 shrink-0 rounded-lg bg-[var(--btn-accent)] text-black flex items-center justify-center disabled:opacity-40 hover:opacity-90 transition-opacity"
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
