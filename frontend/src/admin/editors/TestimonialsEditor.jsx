import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Pencil, Trash2, Plus, Star } from 'lucide-react'
import { getAllTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '../../lib/api'
import Button from '../../components/ui/Button'

const INPUT = 'w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500/50'
const LABEL = 'text-xs text-white/50 mb-1 block'

export default function TestimonialsEditor() {
  const qc = useQueryClient()
  const [editing, setEditing] = useState(null)
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['testimonials-admin'],
    queryFn: () => getAllTestimonials().then(r => r.data),
  })

  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: { rating: 5, is_active: true, order: 0 }
  })

  const mutCreate = useMutation({ mutationFn: createTestimonial, onSuccess: done })
  const mutUpdate = useMutation({ mutationFn: ([id, d]) => updateTestimonial(id, d), onSuccess: done })
  const mutDelete = useMutation({ mutationFn: deleteTestimonial, onSuccess: done })

  function done() {
    qc.invalidateQueries(['testimonials-admin'])
    qc.invalidateQueries(['testimonials'])
    toast.success('Saved!')
    closeForm()
  }
  function closeForm() { setEditing(null); reset({ rating: 5, is_active: true, order: 0 }) }

  function openEdit(item) {
    setEditing(item.id)
    Object.entries(item).forEach(([k, v]) => setValue(k, v))
  }

  const onSubmit = (d) => {
    const payload = { ...d, rating: Number(d.rating), order: Number(d.order) }
    if (editing === 'new') mutCreate.mutate(payload)
    else mutUpdate.mutate([editing, payload])
  }

  if (isLoading) return <div className="text-white/40 text-sm">Loading…</div>

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => { reset({ rating: 5, is_active: true, order: 0 }); setEditing('new') }}>
          <Plus size={14} /> Add Testimonial
        </Button>
      </div>

      {editing && (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>Name *</label>
              <input {...register('name', { required: true })} placeholder="Client name" className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>Rating (1-5)</label>
              <input type="number" min={1} max={5} {...register('rating')} className={INPUT} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>Role / Title</label>
              <input {...register('role')} placeholder="e.g. CTO" className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>Company</label>
              <input {...register('company')} placeholder="e.g. Acme Inc." className={INPUT} />
            </div>
          </div>
          <div>
            <label className={LABEL}>Avatar URL</label>
            <input {...register('avatar_url')} placeholder="https://..." className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Testimonial *</label>
            <textarea {...register('content', { required: true })} rows={4} placeholder="What did they say…" className={INPUT} />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className={LABEL}>Order (lower = first)</label>
              <input type="number" {...register('order')} className={INPUT} />
            </div>
            <div className="flex items-center gap-2 mt-4">
              <input type="checkbox" id="is_active" {...register('is_active')} className="accent-green-500" />
              <label htmlFor="is_active" className="text-sm text-white/70">Active</label>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" size="sm">Save</Button>
            <Button type="button" size="sm" variant="ghost" onClick={closeForm}>Cancel</Button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="flex items-center gap-4 bg-white/[0.02] border border-white/8 rounded-xl px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-green-400 text-xs font-bold flex-shrink-0">
              {item.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{item.name}</p>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {Array.from({ length: item.rating || 5 }).map((_, i) => (
                    <Star key={i} size={10} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                {!item.is_active && <span className="text-xs text-white/30">Hidden</span>}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(item)} className="p-1.5 text-white/40 hover:text-green-400 transition-colors">
                <Pencil size={14} />
              </button>
              <button onClick={() => mutDelete.mutate(item.id)} className="p-1.5 text-white/40 hover:text-red-400 transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        {!items.length && <p className="text-white/30 text-sm text-center py-8">No testimonials yet.</p>}
      </div>
    </div>
  )
}
