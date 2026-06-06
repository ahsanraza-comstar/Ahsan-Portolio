import { useEffect, useState, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import Cropper from 'react-easy-crop'
import { getAbout, updateAbout, uploadFile } from '../../lib/api'
import Button from '../../components/ui/Button'
import { Upload, X, FileText, Image, Crop, Check } from 'lucide-react'

/* ── helpers ── */
function getCroppedCanvas(imageSrc, croppedAreaPixels) {
  return new Promise((resolve) => {
    const img = document.createElement('img')
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width  = croppedAreaPixels.width
      canvas.height = croppedAreaPixels.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(
        img,
        croppedAreaPixels.x, croppedAreaPixels.y,
        croppedAreaPixels.width, croppedAreaPixels.height,
        0, 0,
        croppedAreaPixels.width, croppedAreaPixels.height,
      )
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.92)
    }
    img.src = imageSrc
  })
}

/* ── crop modal ── */
function CropModal({ src, onConfirm, onCancel }) {
  const [crop, setCrop]   = useState({ x: 0, y: 0 })
  const [zoom, setZoom]   = useState(1)
  const [area, setArea]   = useState(null)

  const onCropComplete = useCallback((_, px) => setArea(px), [])

  const confirm = async () => {
    if (!area) return
    const blob = await getCroppedCanvas(src, area)
    onConfirm(blob)
  }

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" style={{ zIndex: 9999 }}>
      <div className="bg-[var(--bg-deep)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border-subtle)]">
          <span className="font-mono text-xs tracking-widest text-[var(--amber-bright)] uppercase flex items-center gap-2">
            <Crop size={13} /> Adjust Photo
          </span>
          <button type="button" onClick={onCancel} className="text-[var(--text-muted)] hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Crop area */}
        <div className="relative bg-black" style={{ height: 340 }}>
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        {/* Zoom slider */}
        <div className="px-5 py-4 space-y-3">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] text-[var(--text-muted)] w-10">Zoom</span>
            <input
              type="range" min={1} max={3} step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1 accent-[#4ade80] h-1"
            />
            <span className="font-mono text-[10px] text-[var(--text-muted)] w-10 text-right">{zoom.toFixed(1)}×</span>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button" onClick={onCancel}
              className="px-4 py-2 font-mono text-xs border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="button" onClick={confirm}
              className="px-4 py-2 font-mono text-xs border border-[var(--amber-bright)] text-[var(--amber-bright)] hover:bg-[var(--amber-bright)] hover:text-black transition-all flex items-center gap-2"
            >
              <Check size={12} /> Apply Crop
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

/* ── file upload ── */
function FileUpload({ label, accept, currentUrl, onUploaded, type = 'file' }) {
  const [uploading, setUploading] = useState(false)
  const [preview,   setPreview]   = useState(currentUrl || null)
  const [dragging,  setDragging]  = useState(false)
  const [cropSrc,   setCropSrc]   = useState(null)   // raw object URL for cropper
  const inputRef = useRef(null)

  useEffect(() => { setPreview(currentUrl || null) }, [currentUrl])

  const uploadBlob = async (blob, filename = 'photo.jpg') => {
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', blob, filename)
      const res = await uploadFile(fd)
      const url = res.data.url
      setPreview(URL.createObjectURL(blob))
      onUploaded(url)
      toast.success('Uploaded!')
    } catch {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleFile = (file) => {
    if (!file) return
    if (type === 'image') {
      // Open cropper first
      setCropSrc(URL.createObjectURL(file))
    } else {
      const fd = new FormData()
      fd.append('file', file)
      setUploading(true)
      uploadFile(fd)
        .then((res) => { onUploaded(res.data.url); setPreview(file.name); toast.success('Uploaded!') })
        .catch(() => toast.error('Upload failed'))
        .finally(() => setUploading(false))
    }
  }

  const onCropConfirm = (blob) => {
    URL.revokeObjectURL(cropSrc)
    setCropSrc(null)
    uploadBlob(blob)
  }

  const onCropCancel = () => {
    URL.revokeObjectURL(cropSrc)
    setCropSrc(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const onDrop = (e) => {
    e.preventDefault(); setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const clear = () => {
    setPreview(null); onUploaded('')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <>
      {cropSrc && (
        <CropModal src={cropSrc} onConfirm={onCropConfirm} onCancel={onCropCancel} />
      )}

      <div className="space-y-2">
        <label className="block text-[var(--text-muted)] text-xs font-mono">{label}</label>

        <div
          className={`relative border-2 border-dashed rounded-[var(--radius-sm)] transition-all duration-200 cursor-pointer
            ${dragging ? 'border-[var(--amber-bright)] bg-[rgba(74,222,128,0.04)]' : 'border-[var(--border-subtle)] hover:border-[var(--border-mid)]'}`}
          onClick={() => !preview && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
        >
          {preview && type === 'image' ? (
            <div className="relative p-2">
              <img src={preview} alt="Preview" className="h-36 w-full object-cover rounded" />
              {/* Action buttons */}
              <div className="absolute top-3 right-3 flex gap-1.5">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); inputRef.current?.click() }}
                  className="w-7 h-7 rounded-full bg-black/70 flex items-center justify-center text-white hover:bg-[var(--amber-bright)] hover:text-black transition-all"
                  title="Change & re-crop"
                >
                  <Crop size={12} />
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); clear() }}
                  className="w-7 h-7 rounded-full bg-black/70 flex items-center justify-center text-white hover:bg-red-500 transition-all"
                  title="Remove"
                >
                  <X size={12} />
                </button>
              </div>
            </div>
          ) : preview && type !== 'image' ? (
            <div className="flex items-center gap-3 p-4">
              <FileText size={20} className="text-[var(--amber-bright)] shrink-0" />
              <span className="font-mono text-xs text-[var(--text-body)] truncate flex-1">{preview}</span>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); clear() }}
                className="text-[var(--text-muted)] hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 py-8 text-[var(--text-muted)]">
              {uploading ? (
                <div className="w-5 h-5 border-2 border-[var(--amber-bright)] border-t-transparent rounded-full animate-spin" />
              ) : type === 'image' ? (
                <Image size={24} className="opacity-40" />
              ) : (
                <Upload size={24} className="opacity-40" />
              )}
              <span className="font-mono text-[11px] text-center">
                {uploading ? 'Uploading…' : 'Drop file here or click to browse'}
              </span>
              <span className="font-mono text-[10px] opacity-40">{accept}</span>
            </div>
          )}

          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />
        </div>

        {currentUrl && (
          <p className="font-mono text-[10px] text-[var(--text-muted)] truncate">
            Current: {currentUrl}
          </p>
        )}
      </div>
    </>
  )
}

/* ── main editor ── */
export default function AboutEditor() {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({ queryKey: ['about'], queryFn: () => getAbout().then(r => r.data) })
  const { register, handleSubmit, reset, setValue, watch, formState: { isSubmitting } } = useForm()

  useEffect(() => { if (data) reset(data) }, [data, reset])

  const avatarUrl = watch('avatar_url')
  const resumeUrl = watch('resume_url')

  const mut = useMutation({
    mutationFn: (d) => updateAbout(d),
    onSuccess: () => { toast.success('About updated!'); qc.invalidateQueries(['about']) },
    onError:   () => toast.error('Update failed'),
  })

  // Auto-save just the URL field immediately after upload
  const handleFileUploaded = (field, url) => {
    setValue(field, url)
    mut.mutate({ [field]: url })
  }

  if (isLoading) return <div className="text-[var(--text-muted)] font-mono text-sm">Loading…</div>

  return (
    <form onSubmit={handleSubmit((d) => mut.mutate(d))} className="max-w-2xl space-y-8">

      {/* Uploads */}
      <div>
        <h3 className="font-mono text-xs tracking-widest text-[var(--amber-bright)] uppercase mb-4">Uploads</h3>
        <div className="grid sm:grid-cols-2 gap-6">
          <FileUpload
            label="Profile Photo"
            accept="image/*"
            type="image"
            currentUrl={avatarUrl}
            onUploaded={(url) => handleFileUploaded('avatar_url', url)}
          />
          <FileUpload
            label="Resume / CV"
            accept=".pdf,.doc,.docx"
            type="file"
            currentUrl={resumeUrl}
            onUploaded={(url) => handleFileUploaded('resume_url', url)}
          />
        </div>
        <input type="hidden" {...register('avatar_url')} />
        <input type="hidden" {...register('resume_url')} />
      </div>

      {/* Basic Info */}
      <div>
        <h3 className="font-mono text-xs tracking-widest text-[var(--amber-bright)] uppercase mb-4">Basic Info</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Name"                 id="name"                   reg={register('name')} />
          <Field label="Tagline"              id="tagline"                reg={register('tagline')} />
          <Field label="Location"             id="location"               reg={register('location')} />
          <Field label="Years Experience"     id="years_experience"       type="number" reg={register('years_experience', { valueAsNumber: true })} />
          <Field label="Projects Count"       id="projects_count"         type="number" reg={register('projects_count', { valueAsNumber: true })} />
          <Field label="AI Models Count"      id="ai_models_count"        type="number" reg={register('ai_models_count', { valueAsNumber: true })} />
          <Field label="Certifications Count" id="certifications_count"   type="number" reg={register('certifications_count', { valueAsNumber: true })} />
          <Field label="Client Satisfaction (%)" id="client_satisfaction" type="number" reg={register('client_satisfaction',  { valueAsNumber: true })} />
        </div>
      </div>

      {/* Social Links */}
      <div>
        <h3 className="font-mono text-xs tracking-widest text-[var(--amber-bright)] uppercase mb-4">Social Links</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Email"        id="email"        reg={register('email')} />
          <Field label="GitHub URL"   id="github_url"   reg={register('github_url')} />
          <Field label="LinkedIn URL" id="linkedin_url" reg={register('linkedin_url')} />
          <Field label="Twitter URL"  id="twitter_url"  reg={register('twitter_url')} />
        </div>
      </div>

      {/* Bio */}
      <div>
        <h3 className="font-mono text-xs tracking-widest text-[var(--amber-bright)] uppercase mb-4">Bio</h3>
        <label className="block text-[var(--text-muted)] text-xs font-mono mb-1">Bio (Markdown)</label>
        <textarea
          rows={6}
          className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-sm)] px-3 py-2 text-sm text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--amber-bright)] transition-colors resize-y"
          {...register('bio')}
        />
      </div>

      <Button type="submit" loading={isSubmitting || mut.isPending}>Save Changes</Button>
    </form>
  )
}

function Field({ label, id, reg, type = 'text' }) {
  return (
    <div>
      <label htmlFor={id} className="block text-[var(--text-muted)] text-xs font-mono mb-1">{label}</label>
      <input
        id={id}
        type={type}
        className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-sm)] px-3 py-2 text-sm text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--amber-bright)] transition-colors"
        {...reg}
      />
    </div>
  )
}
