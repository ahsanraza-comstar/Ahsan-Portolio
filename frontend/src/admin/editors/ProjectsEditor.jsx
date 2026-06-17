import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Pencil, Trash2, Plus, X, Star, Upload, ImageIcon } from 'lucide-react'
import { getProjects, createProject, updateProject, deleteProject, uploadFile } from '../../lib/api'
import Button from '../../components/ui/Button'
import RichEditor from '../../components/ui/RichEditor'

/* ── small image uploader for gallery ── */
function ImageGallery({ images = [], onChange }) {
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploading(true)
    try {
      const urls = await Promise.all(files.map(async (file) => {
        const fd = new FormData()
        fd.append('file', file)
        const res = await uploadFile(fd)
        return res.data.url
      }))
      onChange([...images, ...urls])
      toast.success(`${urls.length} image(s) uploaded`)
    } catch {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const remove = (idx) => onChange(images.filter((_, i) => i !== idx))

  return (
    <div className="space-y-2">
      <label className="block text-[var(--text-muted)] text-xs font-mono">Project Images (Gallery)</label>
      <div className="flex flex-wrap gap-3">
        {images.map((url, i) => (
          <div key={i} className="relative group w-24 h-24 border border-[var(--border-subtle)] overflow-hidden rounded">
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
            >
              <X size={16} className="text-white" />
            </button>
          </div>
        ))}
        <label className={`w-24 h-24 border-2 border-dashed border-[var(--border-subtle)] hover:border-[var(--amber-bright)] flex flex-col items-center justify-center cursor-pointer transition-colors rounded gap-1 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
          {uploading
            ? <div className="w-4 h-4 border-2 border-[var(--amber-bright)] border-t-transparent rounded-full animate-spin" />
            : <>
                <Upload size={16} className="text-[var(--text-muted)]" />
                <span className="font-mono text-[9px] text-[var(--text-muted)]">Add image</span>
              </>
          }
          <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
        </label>
      </div>
    </div>
  )
}

/* ── thumbnail uploader ── */
function ThumbnailUpload({ value, onChange }) {
  const [uploading, setUploading] = useState(false)

  const handle = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await uploadFile(fd)
      onChange(res.data.url)
      toast.success('Thumbnail uploaded')
    } catch { toast.error('Upload failed') }
    finally { setUploading(false); e.target.value = '' }
  }

  return (
    <div className="space-y-2">
      <label className="block text-[var(--text-muted)] text-xs font-mono">Thumbnail / Cover Image</label>
      <label className="flex items-center gap-3 cursor-pointer group">
        <div className="w-20 h-14 border border-[var(--border-subtle)] overflow-hidden rounded shrink-0 flex items-center justify-center bg-[var(--bg-raised)]">
          {value
            ? <img src={value} alt="" className="w-full h-full object-cover" />
            : <ImageIcon size={18} className="text-[var(--text-muted)]" />
          }
        </div>
        <div className={`flex items-center gap-2 font-mono text-xs px-3 py-1.5 border border-dashed border-[var(--border-subtle)] group-hover:border-[var(--amber-bright)] text-[var(--text-muted)] group-hover:text-[var(--amber-bright)] transition-all rounded ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
          {uploading
            ? <div className="w-3 h-3 border-2 border-[var(--amber-bright)] border-t-transparent rounded-full animate-spin" />
            : <Upload size={12} />
          }
          {value ? 'Change thumbnail' : 'Upload thumbnail'}
        </div>
        <input type="file" accept="image/*" className="hidden" onChange={handle} />
      </label>
    </div>
  )
}

const CATEGORIES = ['AI/ML', 'Web', 'Research', 'Mobile', 'DevOps', 'Other']

export default function ProjectsEditor() {
  const qc = useQueryClient()
  const [editing, setEditing] = useState(null)
  const formRef = useRef(null)
  const { data: projects = [] } = useQuery({ queryKey: ['projects-admin'], queryFn: () => getProjects().then(r => r.data) })
  const { register, handleSubmit, reset, setValue, watch, control } = useForm()

  const mutCreate = useMutation({ mutationFn: (d) => createProject(d),               onSuccess: done })
  const mutUpdate = useMutation({ mutationFn: ([id, d]) => updateProject(id, d),     onSuccess: done })
  const mutDelete = useMutation({ mutationFn: deleteProject,                          onSuccess: done })

  function done() { qc.invalidateQueries(['projects-admin']); toast.success('Saved!'); closeForm() }
  function closeForm() { setEditing(null); reset() }
  function openEdit(p) {
    setEditing(p.id)
    reset({
      ...p,
      tech_stack: Array.isArray(p.tech_stack) ? p.tech_stack.join(', ') : (p.tech_stack || ''),
      images: Array.isArray(p.images) ? p.images : [],
    })
    // The form renders at the top of the page — scroll it into view so the user sees it open.
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60)
  }

  const onSubmit = (d) => {
    const data = {
      ...d,
      tech_stack: d.tech_stack ? d.tech_stack.split(',').map(t => t.trim()).filter(Boolean) : [],
      images: d.images || [],
      is_featured: Boolean(d.is_featured),
      order: Number(d.order) || 0,
    }
    editing === 'new' ? mutCreate.mutate(data) : mutUpdate.mutate([editing, data])
  }

  const thumbnailVal = watch('thumbnail_url')
  const imagesVal    = watch('images') || []

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => { reset({ images: [] }); setEditing('new') }}>
          <Plus size={14} /> Add Project
        </Button>
      </div>

      {editing && (
        <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] p-6 space-y-6">
          <div className="flex justify-between items-center pb-2 border-b border-[var(--border-subtle)]">
            <h3 className="text-[var(--text-primary)] font-body font-semibold">{editing === 'new' ? 'New Project' : 'Edit Project'}</h3>
            <button type="button" onClick={closeForm} className="text-[var(--text-muted)] hover:text-white"><X size={16} /></button>
          </div>

          {/* Basic info */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[var(--text-muted)] text-xs font-mono mb-1">Title *</label>
              <input className="w-full bg-[var(--bg-raised)] border border-[var(--border-subtle)] rounded px-3 py-2 text-sm text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--amber-bright)]" {...register('title', { required: true })} />
            </div>
            <div>
              <label className="block text-[var(--text-muted)] text-xs font-mono mb-1">Category</label>
              <select className="w-full bg-[var(--bg-raised)] border border-[var(--border-subtle)] rounded px-3 py-2 text-sm text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--amber-bright)]" {...register('category')}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[var(--text-muted)] text-xs font-mono mb-1">Tech Stack (comma separated)</label>
              <input className="w-full bg-[var(--bg-raised)] border border-[var(--border-subtle)] rounded px-3 py-2 text-sm text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--amber-bright)]" placeholder="React, FastAPI, Python…" {...register('tech_stack')} />
            </div>
            <div>
              <label className="block text-[var(--text-muted)] text-xs font-mono mb-1">Demo URL</label>
              <input className="w-full bg-[var(--bg-raised)] border border-[var(--border-subtle)] rounded px-3 py-2 text-sm text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--amber-bright)]" {...register('demo_url')} />
            </div>
            <div>
              <label className="block text-[var(--text-muted)] text-xs font-mono mb-1">Repo URL</label>
              <input className="w-full bg-[var(--bg-raised)] border border-[var(--border-subtle)] rounded px-3 py-2 text-sm text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--amber-bright)]" {...register('repo_url')} />
            </div>
            <div>
              <label className="block text-[var(--text-muted)] text-xs font-mono mb-1">Order</label>
              <input type="number" className="w-full bg-[var(--bg-raised)] border border-[var(--border-subtle)] rounded px-3 py-2 text-sm text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--amber-bright)]" {...register('order')} />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input type="checkbox" id="is_featured" className="accent-[var(--amber-bright)] w-4 h-4" {...register('is_featured')} />
              <label htmlFor="is_featured" className="text-[var(--text-muted)] text-xs font-mono cursor-pointer flex items-center gap-1.5">
                <Star size={11} className="text-[var(--amber-bright)]" /> Featured project
              </label>
            </div>
          </div>

          {/* Short description */}
          <div>
            <label className="block text-[var(--text-muted)] text-xs font-mono mb-1">Short Description (shown on cards)</label>
            <textarea rows={2} className="w-full bg-[var(--bg-raised)] border border-[var(--border-subtle)] rounded px-3 py-2 text-sm text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--amber-bright)] resize-none" {...register('description')} />
          </div>

          {/* Thumbnail */}
          <ThumbnailUpload
            value={thumbnailVal}
            onChange={(url) => setValue('thumbnail_url', url)}
          />
          <input type="hidden" {...register('thumbnail_url')} />

          {/* Gallery */}
          <ImageGallery
            images={imagesVal}
            onChange={(imgs) => setValue('images', imgs)}
          />
          <input type="hidden" {...register('images')} />

          {/* Rich text */}
          <div>
            <label className="block text-[var(--text-muted)] text-xs font-mono mb-2">
              Detailed Description (shown on project page)
            </label>
            <Controller
              name="long_description"
              control={control}
              render={({ field }) => (
                <RichEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Describe the project in detail — problem, solution, architecture, results…"
                />
              )}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" size="sm">Save Project</Button>
            <Button type="button" variant="ghost" size="sm" onClick={closeForm}>Cancel</Button>
          </div>
        </form>
      )}

      {/* Project list */}
      <div className="grid sm:grid-cols-2 gap-4">
        {projects.map(p => (
          <div key={p.id} className="bg-[var(--bg-deep)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] overflow-hidden">
            {p.thumbnail_url && (
              <img src={p.thumbnail_url} alt={p.title} className="w-full h-28 object-cover" />
            )}
            <div className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    {p.is_featured && <Star size={11} className="text-[var(--amber-bright)]" fill="currentColor" />}
                    <p className="text-[var(--text-primary)] text-sm font-medium">{p.title}</p>
                  </div>
                  <p className="text-[var(--text-muted)] text-xs font-mono">{p.category}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => openEdit(p)} className="text-[var(--text-muted)] hover:text-[var(--amber-bright)] transition-colors"><Pencil size={14} /></button>
                  <button onClick={() => mutDelete.mutate(p.id)} className="text-[var(--text-muted)] hover:text-[var(--rose-bright)] transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
              <p className="text-[var(--text-body)] text-xs line-clamp-2">{p.description}</p>
              <div className="flex flex-wrap gap-1">
                {p.tech_stack?.map(t => (
                  <span key={t} className="text-[var(--text-muted)] text-[10px] font-mono bg-[var(--bg-raised)] px-2 py-0.5 rounded">{t}</span>
                ))}
              </div>
              {p.long_description && (
                <p className="font-mono text-[10px] text-[var(--amber-bright)]">✓ Detailed description added</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
