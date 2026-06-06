import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Pencil, Trash2, Plus, Briefcase, GraduationCap } from 'lucide-react'
import { getExperiences, createExperience, updateExperience, deleteExperience } from '../../lib/api'
import Button from '../../components/ui/Button'

const INPUT = 'w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500/50'
const LABEL = 'text-xs text-white/50 mb-1 block'

export default function ExperienceEditor() {
  const qc = useQueryClient()
  const [editing, setEditing] = useState(null)
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['experience'],
    queryFn: () => getExperiences().then(r => r.data),
  })

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: { type: 'work', is_current: false, order: 0 }
  })

  const mutCreate = useMutation({ mutationFn: createExperience, onSuccess: done })
  const mutUpdate = useMutation({ mutationFn: ([id, d]) => updateExperience(id, d), onSuccess: done })
  const mutDelete = useMutation({ mutationFn: deleteExperience, onSuccess: done })

  function done() { qc.invalidateQueries(['experience']); toast.success('Saved!'); closeForm() }
  function closeForm() { setEditing(null); reset({ type: 'work', is_current: false, order: 0 }) }

  function openEdit(item) {
    setEditing(item.id)
    Object.entries(item).forEach(([k, v]) => setValue(k, v))
  }

  const onSubmit = (d) => {
    if (editing === 'new') mutCreate.mutate(d)
    else mutUpdate.mutate([editing, d])
  }

  const isCurrent = watch('is_current')

  if (isLoading) return <div className="text-white/40 text-sm">Loading…</div>

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => { reset({ type: 'work', is_current: false, order: 0 }); setEditing('new') }}>
          <Plus size={14} /> Add Entry
        </Button>
      </div>

      {editing && (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>Title *</label>
              <input {...register('title', { required: true })} placeholder="e.g. Senior AI Engineer" className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>Type</label>
              <select {...register('type')} className={INPUT}>
                <option value="work">Work</option>
                <option value="education">Education</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>Company / Institution</label>
              <input {...register('company')} placeholder="e.g. Google" className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>Location</label>
              <input {...register('location')} placeholder="e.g. Remote" className={INPUT} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>Start Date</label>
              <input {...register('start_date')} placeholder="e.g. Jan 2022" className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>End Date</label>
              <input {...register('end_date')} placeholder="e.g. Dec 2023" className={INPUT} disabled={isCurrent} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="is_current" {...register('is_current')} className="accent-green-500" />
            <label htmlFor="is_current" className="text-sm text-white/70">Currently working here</label>
          </div>
          <div>
            <label className={LABEL}>Description</label>
            <textarea {...register('description')} rows={3} placeholder="Role summary, achievements…" className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Order (lower = first)</label>
            <input type="number" {...register('order', { valueAsNumber: true })} className={INPUT} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" size="sm">Save</Button>
            <Button type="button" size="sm" variant="ghost" onClick={closeForm}>Cancel</Button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {items.map(item => {
          const Icon = item.type === 'work' ? Briefcase : GraduationCap
          return (
            <div key={item.id} className="flex items-center gap-4 bg-white/[0.02] border border-white/8 rounded-xl px-4 py-3">
              <Icon size={16} className={item.type === 'work' ? 'text-green-400' : 'text-purple-400'} />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{item.title}</p>
                <p className="text-white/40 text-xs">{[item.company, item.start_date].filter(Boolean).join(' · ')}</p>
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
          )
        })}
        {!items.length && <p className="text-white/30 text-sm text-center py-8">No experience entries yet.</p>}
      </div>
    </div>
  )
}
