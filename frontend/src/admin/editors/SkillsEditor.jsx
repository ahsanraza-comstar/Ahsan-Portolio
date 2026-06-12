import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Pencil, Trash2, Plus, X } from 'lucide-react'
import { getSkills, createSkill, updateSkill, deleteSkill } from '../../lib/api'
import Button from '../../components/ui/Button'

const CATEGORIES = ['ML/AI', 'Backend', 'Frontend', 'DevOps', 'Tools']

export default function SkillsEditor() {
  const qc = useQueryClient()
  const [editing, setEditing] = useState(null)
  const [filterCat, setFilterCat] = useState('All')
  const { data: skills = [] } = useQuery({ queryKey: ['skills-admin'], queryFn: () => getSkills().then(r => r.data) })
  const { register, handleSubmit, reset, setValue, watch } = useForm({ defaultValues: { proficiency: 80 } })

  const mutCreate = useMutation({ mutationFn: createSkill,         onSuccess: done })
  const mutUpdate = useMutation({ mutationFn: ([id, d]) => updateSkill(id, d), onSuccess: done })
  const mutDelete = useMutation({ mutationFn: deleteSkill,         onSuccess: done })

  function done() { qc.invalidateQueries(['skills-admin']); toast.success('Saved!'); closeForm() }
  function closeForm() { setEditing(null); reset({ proficiency: 80 }) }
  function openEdit(s) { setEditing(s.id); Object.entries(s).forEach(([k, v]) => setValue(k, v)) }

  const onSubmit = (d) => {
    const data = { ...d, proficiency: Number(d.proficiency) }
    editing === 'new' ? mutCreate.mutate(data) : mutUpdate.mutate([editing, data])
  }

  const filtered = filterCat === 'All' ? skills : skills.filter(s => s.category === filterCat)
  const proficiency = watch('proficiency') || 80

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {['All', ...CATEGORIES].map(c => (
            <button key={c} onClick={() => setFilterCat(c)}
              className={`px-3 py-1 rounded-full text-xs font-mono border transition-all ${filterCat === c ? 'border-[var(--btn-accent)] text-[var(--btn-accent)]' : 'border-[var(--border-subtle)] text-[var(--text-muted)]'}`}>
              {c}
            </button>
          ))}
        </div>
        <Button size="sm" onClick={() => { reset({ proficiency: 80 }); setEditing('new') }}>
          <Plus size={14} /> Add Skill
        </Button>
      </div>

      {editing && (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-[var(--text-primary)] font-body font-medium text-sm">{editing === 'new' ? 'New Skill' : 'Edit Skill'}</h3>
            <button type="button" onClick={closeForm} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"><X size={14} /></button>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[var(--text-muted)] text-xs font-mono mb-1">Name</label>
              <input className="w-full bg-[var(--bg-raised)] border border-[var(--border-subtle)] rounded px-3 py-2 text-sm text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--amber-bright)]" {...register('name')} />
            </div>
            <div>
              <label className="block text-[var(--text-muted)] text-xs font-mono mb-1">Category</label>
              <select className="w-full bg-[var(--bg-raised)] border border-[var(--border-subtle)] rounded px-3 py-2 text-sm text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--amber-bright)]" {...register('category')}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[var(--text-muted)] text-xs font-mono mb-1">
              Proficiency — <span className="text-[var(--amber-bright)]">{proficiency}%</span>
            </label>
            <input type="range" min={0} max={100} className="w-full accent-[var(--amber-bright)]" {...register('proficiency')} />
          </div>
          <div className="flex gap-2">
            <Button type="submit" size="sm">Save</Button>
            <Button type="button" variant="ghost" size="sm" onClick={closeForm}>Cancel</Button>
          </div>
        </form>
      )}

      <div className="divide-y divide-[var(--border-subtle)]">
        {filtered.map(s => (
          <div key={s.id} className="flex items-center justify-between py-3">
            <div className="flex-1 mr-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[var(--text-primary)] text-sm font-medium">{s.name}</span>
                <span className="text-[var(--amber-bright)] text-xs font-mono">{s.proficiency}%</span>
              </div>
              <div className="h-1 bg-[var(--bg-raised)] rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${s.proficiency}%`, background: 'linear-gradient(90deg, var(--amber-dim), var(--amber-bright))' }} />
              </div>
              <p className="text-[var(--text-muted)] text-xs font-mono mt-1">{s.category}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => openEdit(s)} className="text-[var(--text-muted)] hover:text-[var(--amber-bright)] transition-colors"><Pencil size={14} /></button>
              <button onClick={() => mutDelete.mutate(s.id)} className="text-[var(--text-muted)] hover:text-[var(--rose-bright)] transition-colors"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
