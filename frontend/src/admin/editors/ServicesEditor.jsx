import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Pencil, Trash2, Plus, X } from 'lucide-react'
import { getServices, createService, updateService, deleteService } from '../../lib/api'
import Button from '../../components/ui/Button'

export default function ServicesEditor() {
  const qc = useQueryClient()
  const [editing, setEditing] = useState(null) // null | 'new' | id
  const { data: services = [], isLoading } = useQuery({ queryKey: ['services'], queryFn: () => getServices().then(r => r.data) })

  const { register, handleSubmit, reset, setValue } = useForm()

  const mutCreate = useMutation({ mutationFn: createService, onSuccess: done })
  const mutUpdate = useMutation({ mutationFn: ([id, d]) => updateService(id, d), onSuccess: done })
  const mutDelete = useMutation({ mutationFn: deleteService, onSuccess: done })

  function done() { qc.invalidateQueries(['services']); toast.success('Saved!'); closeForm() }
  function closeForm() { setEditing(null); reset() }

  function openEdit(s) {
    setEditing(s.id)
    Object.entries(s).forEach(([k, v]) => setValue(k, v))
  }

  const onSubmit = (d) => {
    if (editing === 'new') mutCreate.mutate(d)
    else mutUpdate.mutate([editing, d])
  }

  if (isLoading) return <div className="text-[var(--text-muted)] font-mono text-sm">Loading…</div>

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => { reset(); setEditing('new') }}>
          <Plus size={14} /> Add Service
        </Button>
      </div>

      {editing && (
        <ServiceForm
          onSubmit={handleSubmit(onSubmit)}
          register={register}
          onCancel={closeForm}
          isNew={editing === 'new'}
        />
      )}

      <div className="divide-y divide-[var(--border-subtle)]">
        {services.map((s) => (
          <div key={s.id} className="flex items-center justify-between py-3">
            <div>
              <p className="text-[var(--text-primary)] font-body text-sm font-medium">{s.title}</p>
              <p className="text-[var(--text-muted)] text-xs font-mono">{s.accent_color} · order {s.order}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(s)} className="text-[var(--text-muted)] hover:text-[var(--amber-bright)] transition-colors">
                <Pencil size={14} />
              </button>
              <button onClick={() => mutDelete.mutate(s.id)} className="text-[var(--text-muted)] hover:text-[var(--rose-bright)] transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ServiceForm({ onSubmit, register, onCancel, isNew }) {
  return (
    <form onSubmit={onSubmit} className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] p-5 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-[var(--text-primary)] font-body font-medium text-sm">{isNew ? 'New Service' : 'Edit Service'}</h3>
        <button type="button" onClick={onCancel} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"><X size={14} /></button>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <AdminField label="Title"        reg={register('title')} />
        <AdminField label="Icon"         reg={register('icon')} placeholder="bot, code, database…" />
        <AdminField label="Accent Color" reg={register('accent_color')} placeholder="amber | teal | rose" />
        <AdminField label="Order"        reg={register('order')} type="number" />
      </div>
      <div>
        <label className="block text-[var(--text-muted)] text-xs font-mono mb-1">Description</label>
        <textarea rows={3} className="w-full bg-[var(--bg-raised)] border border-[var(--border-subtle)] rounded px-3 py-2 text-sm text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--amber-bright)] resize-none" {...register('description')} />
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm">Save</Button>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  )
}

function AdminField({ label, reg, type = 'text', placeholder }) {
  return (
    <div>
      <label className="block text-[var(--text-muted)] text-xs font-mono mb-1">{label}</label>
      <input type={type} placeholder={placeholder}
        className="w-full bg-[var(--bg-raised)] border border-[var(--border-subtle)] rounded px-3 py-2 text-sm text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--amber-bright)] transition-colors"
        {...reg} />
    </div>
  )
}
