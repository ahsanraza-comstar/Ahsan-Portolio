import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Lock, Mail } from 'lucide-react'
import toast from 'react-hot-toast'
import { adminLogin, getMe } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'
import logoUrl from '../assets/logo.png'

export default function AdminLogin() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
  const [shake, setShake] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    try {
      const res = await adminLogin({ username: data.email.trim(), password: data.password })
      const token = res.data.access_token
      localStorage.setItem('admin_token', token)
      const me = await getMe()
      login(token, me.data)
      toast.success('Welcome back, Admin!')
      navigate('/admin/dashboard')
    } catch (err) {
      console.error('Login error details:', err)
      setShake(true)
      const msg = err.response?.data?.detail || err.message || 'Invalid credentials'
      toast.error('Login Failed: ' + msg)
      setTimeout(() => setShake(false), 600)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-void)] flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      <div
        className={`
          relative w-full max-w-sm bg-[var(--bg-deep)] border border-[var(--border-subtle)]
          rounded-[var(--radius-xl)] p-8 shadow-[var(--shadow-amber)]
          ${shake ? 'animate-[shake_0.5s_ease]' : ''}
        `}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <img src={logoUrl} alt="Logo" className="h-14 w-auto mx-auto mb-3 object-contain" />
          <p className="text-[var(--text-muted)] text-sm mt-1 font-mono">Portfolio CMS</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div className="space-y-1">
            <label className="text-[var(--text-muted)] text-xs font-mono flex items-center gap-1.5">
              <Mail size={11} /> Email
            </label>
            <input
              type="email"
              className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-sm)] px-3 py-2.5 text-[var(--text-primary)] text-sm font-mono focus:outline-none focus:border-[var(--amber-bright)] transition-colors"
              {...register('email', { required: true })}
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-[var(--text-muted)] text-xs font-mono flex items-center gap-1.5">
              <Lock size={11} /> Password
            </label>
            <input
              type="password"
              className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-sm)] px-3 py-2.5 text-[var(--text-primary)] text-sm font-mono focus:outline-none focus:border-[var(--amber-bright)] transition-colors"
              {...register('password', { required: true })}
            />
          </div>

          <Button type="submit" loading={isSubmitting} className="w-full justify-center mt-2">
            Sign In
          </Button>
        </form>

        <p className="text-center text-[var(--text-muted)] text-xs font-mono mt-6">
          <a href="/" className="hover:text-[var(--amber-bright)] transition-colors">
            ← Back to Portfolio
          </a>
        </p>
      </div>

      <style>{`
        @keyframes shake {
          0%,100%{transform:translateX(0)}
          20%{transform:translateX(-8px)}
          40%{transform:translateX(8px)}
          60%{transform:translateX(-5px)}
          80%{transform:translateX(5px)}
        }
      `}</style>
    </div>
  )
}
