import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Mail, Trash2, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { getMessages, markRead, deleteMessage } from '../../lib/api'

export default function MessagesEditor() {
  const qc = useQueryClient()
  const [expanded, setExpanded] = useState(null)
  const { data: messages = [], isLoading } = useQuery({ queryKey: ['messages'], queryFn: () => getMessages().then(r => r.data) })

  const mutRead   = useMutation({ mutationFn: markRead,       onSuccess: () => qc.invalidateQueries(['messages']) })
  const mutDelete = useMutation({
    mutationFn: deleteMessage,
    onSuccess: () => { qc.invalidateQueries(['messages']); toast.success('Deleted') }
  })

  if (isLoading) return <div className="text-[var(--text-muted)] font-mono text-sm">Loading…</div>

  const unread = messages.filter(m => !m.is_read).length

  return (
    <div className="max-w-3xl space-y-4">
      <div className="flex items-center gap-3">
        <Mail size={16} className="text-[var(--amber-bright)]" />
        <span className="text-[var(--text-primary)] font-body font-medium">
          {messages.length} messages
        </span>
        {unread > 0 && (
          <span className="bg-[var(--amber-bright)] text-void text-xs font-mono px-2 py-0.5 rounded-full font-bold">
            {unread} unread
          </span>
        )}
      </div>

      <div className="divide-y divide-[var(--border-subtle)]">
        {messages.map(m => (
          <div key={m.id} className={`py-4 ${!m.is_read ? 'border-l-2 border-[var(--amber-bright)] pl-4 -ml-4' : ''}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-body font-medium text-[var(--text-primary)] text-sm">{m.name}</span>
                  <span className="text-[var(--text-muted)] text-xs font-mono">&lt;{m.email}&gt;</span>
                  {!m.is_read && (
                    <span className="bg-[var(--amber-halo)] border border-[var(--amber-dim)] text-[var(--amber-bright)] text-xs font-mono px-1.5 py-0.5 rounded">
                      NEW
                    </span>
                  )}
                </div>
                <p className="text-[var(--text-body)] text-sm mt-0.5">{m.subject || '(no subject)'}</p>
                <p className="text-[var(--text-muted)] text-xs font-mono mt-0.5">
                  {new Date(m.created_at).toLocaleString()}
                </p>
              </div>

              <div className="flex gap-2 flex-shrink-0">
                {!m.is_read && (
                  <button
                    onClick={() => mutRead.mutate(m.id)}
                    title="Mark as read"
                    className="text-[var(--text-muted)] hover:text-[var(--teal-bright)] transition-colors"
                  >
                    <CheckCircle size={15} />
                  </button>
                )}
                <button
                  onClick={() => setExpanded(expanded === m.id ? null : m.id)}
                  className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                  {expanded === m.id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </button>
                <button
                  onClick={() => mutDelete.mutate(m.id)}
                  className="text-[var(--text-muted)] hover:text-[var(--rose-bright)] transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            {expanded === m.id && (
              <div className="mt-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded p-4 text-[var(--text-body)] text-sm leading-relaxed font-body whitespace-pre-wrap">
                {m.message}
              </div>
            )}
          </div>
        ))}

        {messages.length === 0 && (
          <p className="py-8 text-center text-[var(--text-muted)] font-mono text-sm">No messages yet.</p>
        )}
      </div>
    </div>
  )
}
