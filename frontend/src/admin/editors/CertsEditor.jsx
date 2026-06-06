import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Pencil, Trash2, Plus, X, Award } from 'lucide-react'
import { getCertifications, createCertification, updateCertification, deleteCertification } from '../../lib/api'
import Button from '../../components/ui/Button'

export default function CertsEditor() {
  const qc = useQueryClient()
  const [editing, setEditing] = useState(null)
  const { data: certs = [] } = useQuery({ queryKey: ['certs-admin'], queryFn: () => getCertifications().then(r => r.data) })
  const { register, handleSubmit, reset, setValue } = useForm()

  const mutCreate = useMutation({ mutationFn: createCertification,         onSuccess: done })
  const mutUpdate = useMutation({ mutationFn: ([id, d]) => updateCertification(id, d), onSuccess: done })
  const mutDelete = useMutation({ mutationFn: deleteCertification,         onSuccess: done })

  function done() { qc.invalidateQueries(['certs-admin']); toast.success('Saved!'); closeForm() }
  function closeForm() { setEditing(null); reset() }
  function openEdit(c) { setEditing(c.id); Object.entries(c).forEach(([k, v]) => setValue(k, v)) }

  const onSubmit = (d) => editing === 'new' ? mutCreate.mutate(d) : mutUpdate.mutate([editing, d])

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => { reset(); setEditing('new') }}><Plus size={14} /> Add Cert</Button>
      </div>

      {editing && (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-[var(--text-primary)] font-body font-medium text-sm">{editing === 'new' ? 'New Certification' : 'Edit Certification'}</h3>
            <button type="button" onClick={closeForm} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"><X size={14} /></button>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {[['Title','title'],['Issuer','issuer'],['Issued Date','issued_date','date'],['Expiry Date','expiry_date','date'],['Credential URL','credential_url'],['Badge URL','badge_url']].map(([l,n,t='text']) => (
              <div key={n}>
                <label className="block text-[var(--text-muted)] text-xs font-mono mb-1">{l}</label>
                <input type={t} className="w-full bg-[var(--bg-raised)] border border-[var(--border-subtle)] rounded px-3 py-2 text-sm text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--amber-bright)]" {...register(n)} />
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Button type="submit" size="sm">Save</Button>
            <Button type="button" variant="ghost" size="sm" onClick={closeForm}>Cancel</Button>
          </div>
        </form>
      )}

      <div className="divide-y divide-[var(--border-subtle)]">
        {certs.map(c => (
          <div key={c.id} className="flex items-center gap-3 py-3">
            <div className="w-8 h-8 rounded-full bg-[var(--amber-halo)] border border-[var(--border-subtle)] flex items-center justify-center flex-shrink-0">
              {c.badge_url ? <img src={c.badge_url} alt="" className="w-5 h-5 object-contain" /> : <Award size={14} className="text-[var(--amber-bright)]" />}
            </div>
            <div className="flex-1">
              <p className="text-[var(--text-primary)] text-sm font-medium">{c.title}</p>
              <p className="text-[var(--text-muted)] text-xs font-mono">{c.issuer} · {c.issued_date}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(c)} className="text-[var(--text-muted)] hover:text-[var(--amber-bright)] transition-colors"><Pencil size={14} /></button>
              <button onClick={() => mutDelete.mutate(c.id)} className="text-[var(--text-muted)] hover:text-[var(--rose-bright)] transition-colors"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
