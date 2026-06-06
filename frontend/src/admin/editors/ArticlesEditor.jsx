import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Pencil, Trash2, Plus, FileText, Globe, EyeOff } from 'lucide-react'
import { getAllArticles, createArticle, updateArticle, deleteArticle, uploadFile } from '../../lib/api'
import Button from '../../components/ui/Button'
import RichEditor from '../../components/ui/RichEditor'

const INPUT = 'w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500/50'
const LABEL = 'text-xs text-white/50 mb-1 block'

export default function ArticlesEditor() {
  const qc = useQueryClient()
  const [editing, setEditing] = useState(null)
  const [uploading, setUploading] = useState(false)

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['articles-admin'],
    queryFn: () => getAllArticles().then(r => r.data),
  })

  const { register, handleSubmit, reset, setValue, watch, control } = useForm({
    defaultValues: { is_published: false, tags: '' }
  })

  const mutCreate = useMutation({ mutationFn: createArticle, onSuccess: done })
  const mutUpdate = useMutation({ mutationFn: ([id, d]) => updateArticle(id, d), onSuccess: done })
  const mutDelete = useMutation({ mutationFn: deleteArticle, onSuccess: done })

  function done() {
    qc.invalidateQueries(['articles-admin'])
    qc.invalidateQueries(['articles'])
    toast.success('Saved!')
    closeForm()
  }
  function closeForm() { setEditing(null); reset({ is_published: false, tags: '' }) }

  function openEdit(item) {
    setEditing(item.id)
    Object.entries(item).forEach(([k, v]) => {
      if (k === 'tags') setValue(k, Array.isArray(v) ? v.join(', ') : v)
      else setValue(k, v)
    })
  }

  const onSubmit = (d) => {
    const tags = d.tags ? d.tags.split(',').map(t => t.trim()).filter(Boolean) : []
    const payload = { ...d, tags }
    if (editing === 'new') mutCreate.mutate(payload)
    else mutUpdate.mutate([editing, payload])
  }

  async function handleThumbUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData(); fd.append('file', file)
      const res = await uploadFile(fd)
      setValue('thumbnail_url', res.data.url)
      toast.success('Thumbnail uploaded')
    } catch { toast.error('Upload failed') }
    finally { setUploading(false) }
  }

  const thumbUrl = watch('thumbnail_url')

  if (isLoading) return <div className="text-white/40 text-sm">Loading…</div>

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => { reset({ is_published: false, tags: '' }); setEditing('new') }}>
          <Plus size={14} /> New Article
        </Button>
      </div>

      {editing && (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-4">
          <div>
            <label className={LABEL}>Title *</label>
            <input {...register('title', { required: true })} placeholder="Article title" className={INPUT} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>Slug (auto-generated if empty)</label>
              <input {...register('slug')} placeholder="my-article-slug" className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>Tags (comma-separated)</label>
              <input {...register('tags')} placeholder="AI, Python, LLMs" className={INPUT} />
            </div>
          </div>

          <div>
            <label className={LABEL}>Excerpt / Summary</label>
            <textarea {...register('excerpt')} rows={2} placeholder="Short summary shown in listing…" className={INPUT} />
          </div>

          {/* Thumbnail */}
          <div>
            <label className={LABEL}>Thumbnail</label>
            <div className="flex gap-3 items-start">
              <input {...register('thumbnail_url')} placeholder="https://..." className={INPUT} />
              <label className="flex-shrink-0 cursor-pointer px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white/60 hover:text-white hover:border-white/20 transition-colors whitespace-nowrap">
                {uploading ? 'Uploading…' : 'Upload'}
                <input type="file" accept="image/*" className="hidden" onChange={handleThumbUpload} />
              </label>
            </div>
            {thumbUrl && (
              <img src={thumbUrl} alt="thumb" className="mt-2 h-28 rounded-xl object-cover border border-white/10" />
            )}
          </div>

          {/* Rich Editor */}
          <div>
            <label className={LABEL}>Content</label>
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <RichEditor value={field.value} onChange={field.onChange} />
              )}
            />
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="is_published" {...register('is_published')} className="accent-green-500" />
            <label htmlFor="is_published" className="text-sm text-white/70">Published (visible on site)</label>
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
            <FileText size={16} className="text-white/30 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{item.title}</p>
              <p className="text-white/40 text-xs">{item.slug}</p>
            </div>
            {item.is_published
              ? <Globe size={14} className="text-green-400" title="Published" />
              : <EyeOff size={14} className="text-white/25" title="Draft" />
            }
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
        {!items.length && <p className="text-white/30 text-sm text-center py-8">No articles yet.</p>}
      </div>
    </div>
  )
}
