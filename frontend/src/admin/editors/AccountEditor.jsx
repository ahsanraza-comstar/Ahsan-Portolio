import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { updateCredentials } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/ui/Button'

export default function AccountEditor() {
  const { admin } = useAuth()
  const [showCurrent, setShowCurrent]   = useState(false)
  const [showNew,     setShowNew]       = useState(false)
  const [showConfirm, setShowConfirm]   = useState(false)

  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm()

  const newPassword = watch('new_password')

  const mut = useMutation({
    mutationFn: (d) => updateCredentials(d),
    onSuccess: (res) => {
      toast.success('Credentials updated!')
      reset()
      // Reflect new email in page without full logout
      if (res.data?.email) {
        // The token is still valid; just update the displayed email
        window.location.reload()
      }
    },
    onError: (err) => {
      const msg = err.response?.data?.detail || 'Update failed'
      toast.error(msg)
    },
  })

  const onSubmit = (data) => {
    const payload = { current_password: data.current_password }
    if (data.new_email?.trim())    payload.new_email    = data.new_email.trim()
    if (data.new_password?.trim()) payload.new_password = data.new_password.trim()

    if (!payload.new_email && !payload.new_password) {
      toast.error('Enter a new email or new password to update')
      return
    }
    mut.mutate(payload)
  }

  return (
    <div className="max-w-md space-y-8">

      {/* Current identity */}
      <div className="border border-[var(--border-subtle)] p-5 space-y-3">
        <p className="font-mono text-[10px] tracking-widest text-[var(--amber-bright)] uppercase">Current Account</p>
        <div className="flex items-center gap-3">
          <ShieldCheck size={16} className="text-[var(--amber-bright)] shrink-0" />
          <span className="font-mono text-sm text-[var(--text-body)]">{admin?.email}</span>
          <span className="ml-auto font-mono text-[9px] px-2 py-0.5 border border-[var(--border-subtle)] text-[var(--text-muted)] uppercase">Admin</span>
        </div>
      </div>

      {/* Update form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <p className="font-mono text-xs tracking-widest text-[var(--amber-bright)] uppercase">Update Credentials</p>

        {/* New email */}
        <div className="space-y-1">
          <label className="text-[var(--text-muted)] text-xs font-mono flex items-center gap-1.5">
            <Mail size={11} /> New Email <span className="opacity-40">(leave blank to keep current)</span>
          </label>
          <input
            type="email"
            placeholder={admin?.email}
            className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-sm)] px-3 py-2.5 text-sm text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--amber-bright)] transition-colors placeholder:opacity-30"
            {...register('new_email')}
          />
        </div>

        {/* New password */}
        <div className="space-y-1">
          <label className="text-[var(--text-muted)] text-xs font-mono flex items-center gap-1.5">
            <Lock size={11} /> New Password <span className="opacity-40">(leave blank to keep current)</span>
          </label>
          <div className="relative">
            <input
              type={showNew ? 'text' : 'password'}
              className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-sm)] px-3 py-2.5 pr-10 text-sm text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--amber-bright)] transition-colors"
              {...register('new_password', {
                minLength: { value: 6, message: 'Min 6 characters' },
              })}
            />
            <button type="button" onClick={() => setShowNew(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-white transition-colors">
              {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          {errors.new_password && (
            <p className="font-mono text-[10px] text-[var(--rose-bright)]">{errors.new_password.message}</p>
          )}
        </div>

        {/* Confirm new password */}
        {newPassword && (
          <div className="space-y-1">
            <label className="text-[var(--text-muted)] text-xs font-mono flex items-center gap-1.5">
              <Lock size={11} /> Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-sm)] px-3 py-2.5 pr-10 text-sm text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--amber-bright)] transition-colors"
                {...register('confirm_password', {
                  validate: (v) => v === newPassword || 'Passwords do not match',
                })}
              />
              <button type="button" onClick={() => setShowConfirm(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-white transition-colors">
                {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {errors.confirm_password && (
              <p className="font-mono text-[10px] text-[var(--rose-bright)]">{errors.confirm_password.message}</p>
            )}
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-[var(--border-subtle)] pt-4">
          <label className="text-[var(--text-muted)] text-xs font-mono flex items-center gap-1.5 mb-1">
            <Lock size={11} /> Current Password <span className="text-[var(--rose-bright)]">*</span>
          </label>
          <div className="relative">
            <input
              type={showCurrent ? 'text' : 'password'}
              placeholder="Required to confirm changes"
              className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-sm)] px-3 py-2.5 pr-10 text-sm text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--amber-bright)] transition-colors placeholder:opacity-30"
              {...register('current_password', { required: 'Current password is required' })}
            />
            <button type="button" onClick={() => setShowCurrent(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-white transition-colors">
              {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          {errors.current_password && (
            <p className="font-mono text-[10px] text-[var(--rose-bright)] mt-1">{errors.current_password.message}</p>
          )}
        </div>

        <Button type="submit" loading={isSubmitting || mut.isPending}>
          Update Credentials
        </Button>
      </form>
    </div>
  )
}
