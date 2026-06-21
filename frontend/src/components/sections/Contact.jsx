import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Mail, MapPin, Github, Linkedin, Twitter, Send, ArrowRight, CalendarClock } from 'lucide-react'
import Section from '../layout/Section'
import SectionLabel from '../ui/SectionLabel'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { sendMessage } from '../../lib/api'
import { whatsappLink, WhatsAppIcon } from '../../lib/whatsapp'

const TERMINAL_LINES = [
  { type: 'prompt',   text: '$ whoami' },
  { type: 'response', text: '> AI Engineer & Builder' },
  { type: 'prompt',   text: '$ cat stack.txt' },
  { type: 'response', text: '> Python · FastAPI · React · LLMs' },
  { type: 'prompt',   text: '$ ping collaboration' },
  { type: 'response', text: '> 200 OK — Response time: 1ms ✓' },
  { type: 'prompt',   text: '$ _' },
]

function Terminal() {
  const [visible, setVisible] = useState(0)

  useEffect(() => {
    if (visible >= TERMINAL_LINES.length - 1) return
    const t = setTimeout(() => setVisible(v => v + 1), 550)
    return () => clearTimeout(t)
  }, [visible])

  return (
    <div className="glass-strong rounded-[var(--radius-md)] overflow-hidden">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border-subtle)]">
        <span className="w-3 h-3 rounded-full bg-[var(--rose-mid)] opacity-80" />
        <span className="w-3 h-3 rounded-full bg-[var(--amber-mid)] opacity-80" />
        <span className="w-3 h-3 rounded-full bg-[var(--teal-mid)] opacity-80" />
        <span className="ml-4 font-mono text-xs text-[var(--text-muted)]">ahsan@portfolio ~ %</span>
      </div>
      <div className="p-5 space-y-1 min-h-[160px]">
        {TERMINAL_LINES.slice(0, visible + 1).map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className={`font-mono text-sm ${
              line.type === 'prompt' ? 'text-[var(--amber-bright)]' : 'text-[var(--text-body)]'
            } ${line.text === '$ _' ? 'type-cursor' : ''}`}
          >
            {line.text !== '$ _' ? line.text : '$ '}
          </motion.p>
        ))}
      </div>
    </div>
  )
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } }

export default function Contact({ about }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm()

  const onSubmit = async (data) => {
    try {
      await sendMessage(data)
      toast.success("Message sent! I'll get back to you soon.", { duration: 4000 })
      reset()
    } catch {
      toast.error('Failed to send. Please try again.')
    }
  }

  return (
    <Section id="contact" bg="void" reveal={false}>
      <div className="grid lg:grid-cols-2 gap-16">

        {/* LEFT */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="space-y-8"
        >
          <motion.div variants={item}>
            <SectionLabel color="teal">contact</SectionLabel>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[var(--text-primary)] leading-tight mt-2">
              Let&apos;s Build{' '}
              <span className="italic glow-text-teal" style={{ color: 'var(--teal-bright)' }}>
                Something
              </span>
            </h2>
            <p className="text-[var(--text-body)] mt-4 text-lg leading-relaxed">
              Got a project, a question, or just want to say hi? My inbox is open — I reply within 24 hours.
            </p>
          </motion.div>

          {/* CTAs: Book a call + WhatsApp */}
          <motion.div variants={item} className="flex flex-wrap gap-3">
            {about?.booking_url && (
              <button
                onClick={() => window.dispatchEvent(new Event('open-booking'))}
                className="inline-flex items-center gap-2.5 rounded-full px-6 py-3 font-mono text-sm font-semibold transition-all hover:-translate-y-0.5 hover:brightness-110"
                style={{ background: 'var(--btn-accent)', color: '#0a0a0a', boxShadow: '0 8px 26px -6px rgba(245,197,24,0.6)' }}
              >
                <CalendarClock size={16} /> Book a Call
              </button>
            )}
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 rounded-full px-6 py-3 font-mono text-sm font-semibold transition-all hover:-translate-y-0.5 hover:brightness-110"
              style={{ background: '#25D366', color: '#05240f', boxShadow: '0 8px 26px -6px rgba(37,211,102,0.55)' }}
            >
              <WhatsAppIcon className="w-4 h-4" /> WhatsApp
            </a>
            {about?.linkedin_url && (
              <a
                href={about.linkedin_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full px-6 py-3 font-mono text-sm font-semibold transition-all hover:-translate-y-0.5 hover:brightness-110"
                style={{ background: '#0A66C2', color: '#fff', boxShadow: '0 8px 26px -6px rgba(10,102,194,0.55)' }}
              >
                <Linkedin size={16} /> LinkedIn
              </a>
            )}
          </motion.div>

          {/* Info cards */}
          <motion.div variants={item} className="space-y-3">
            {[
              { icon: Mail,   label: about?.email || 'ahsan@portfolio.dev', color: 'teal' },
              { icon: MapPin, label: about?.location || 'Pakistan',         color: 'amber' },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex items-center gap-3 glass rounded-[var(--radius-md)] px-4 py-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  color === 'teal' ? 'bg-[var(--teal-glow)] border border-[var(--teal-dim)]' : 'bg-[var(--amber-halo)] border border-[var(--amber-dim)]'
                }`}>
                  <Icon size={14} className={color === 'teal' ? 'text-[var(--teal-bright)]' : 'text-[var(--amber-bright)]'} />
                </div>
                <span className="font-mono text-sm text-[var(--text-body)]">{label}</span>
              </div>
            ))}
          </motion.div>

          {/* Social */}
          <motion.div variants={item} className="flex items-center gap-3">
            {[
              { href: about?.github_url,   Icon: Github,   label: 'GitHub' },
              { href: about?.linkedin_url, Icon: Linkedin, label: 'LinkedIn' },
              { href: about?.twitter_url,  Icon: Twitter,  label: 'Twitter' },
            ].filter(s => s.href).map(({ href, Icon, label }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer"
                 className="flex items-center gap-2 glass border border-[var(--border-subtle)] rounded-[var(--radius-sm)] px-3 py-2 text-[var(--text-muted)] hover:text-[var(--amber-bright)] hover:border-[var(--border-mid)] transition-all text-sm font-mono">
                <Icon size={15} /> {label}
              </a>
            ))}
          </motion.div>

          {/* Terminal */}
          <motion.div variants={item}>
            <Terminal />
          </motion.div>
        </motion.div>

        {/* RIGHT — form */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="glass-strong rounded-[var(--radius-xl)] p-8 relative overflow-hidden"
          style={{ border: '1px solid var(--border-mid)' }}
        >
          {/* Corner accent */}
          <div className="absolute top-0 left-0 right-0 h-px"
               style={{ background: 'linear-gradient(90deg, var(--teal-bright), var(--amber-bright), var(--teal-bright))' }} />

          <h3 className="font-body font-semibold text-[var(--text-primary)] text-xl mb-6">
            Send a Message
          </h3>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-5">
              <Input id="name"  label="Your Name"      error={errors.name?.message}
                     {...register('name', { required: 'Required' })} />
              <Input id="email" label="Email Address"  type="email" error={errors.email?.message}
                     {...register('email', { required: 'Required' })} />
            </div>
            <Input id="subject" label="Subject" {...register('subject')} />
            <Input id="message" label="Your Message" textarea rows={5}
                   error={errors.message?.message}
                   {...register('message', { required: 'Required' })} />

            <Button variant="primary" type="submit" loading={isSubmitting} className="w-full justify-center group">
              <Send size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              Send Message
              <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -ml-2 group-hover:ml-0 transition-all" />
            </Button>
          </form>
        </motion.div>
      </div>
    </Section>
  )
}
