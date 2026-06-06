import { motion } from 'framer-motion'
import { Bot, Code2, Database, Cpu, Globe, BrainCircuit, Layers, Zap, ArrowRight } from 'lucide-react'
import Section from '../layout/Section'

const iconMap = {
  bot: Bot, code: Code2, database: Database, cpu: Cpu,
  globe: Globe, brain: BrainCircuit, layers: Layers, zap: Zap,
}


function ServiceCard({ service, index }) {
  const Icon = iconMap[service.icon?.toLowerCase()] || Bot

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group p-8 border border-[var(--border-subtle)] bg-[var(--bg-deep)] hover:border-[var(--border-mid)] transition-all duration-300 relative overflow-hidden"
    >
      {/* Top green accent line on hover */}
      <div className="absolute top-0 left-0 right-0 h-px bg-[var(--amber-bright)] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

      <div className="mb-5">
        <Icon size={24} className="text-[var(--amber-bright)]" />
      </div>

      <h3 className="font-display font-bold text-white text-xl mb-3 group-hover:text-[var(--amber-bright)] transition-colors duration-300">
        {service.title}
      </h3>

      <p className="text-[var(--text-body)] text-sm leading-relaxed mb-6">
        {service.description}
      </p>

      <div className="flex items-center gap-2 font-mono text-xs text-[var(--amber-bright)] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        READ MORE <ArrowRight size={11} />
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 h-px w-12 bg-[var(--amber-bright)]" />
    </motion.div>
  )
}

export default function Services({ services, about, projects, certifications }) {
  const items = services || []

  return (
    <Section id="services" bg="void" reveal={false}>
      {/* Header */}
      <div className="grid lg:grid-cols-2 gap-8 items-end mb-14">
        <div>
          <p className="font-mono text-xs tracking-[0.3em] text-[var(--amber-bright)] uppercase mb-4">&lt; services /&gt;</p>
          <h2 className="font-display font-bold text-white" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: 1.15 }}>
            Get customized{' '}
            <span className="font-mono text-[var(--amber-bright)]">&#123;AI-based&#125;</span>{' '}
            recommendations.
          </h2>
        </div>
        <div>
          <p className="text-[var(--text-body)] leading-relaxed lg:max-w-sm lg:ml-auto text-sm">
            From LLM architectures to full-stack products — production-grade AI solutions tailored to your business needs.
          </p>
          <button
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="mt-4 inline-flex items-center gap-2 font-mono text-xs tracking-widest text-[var(--amber-bright)] hover:underline"
          >
            EXPLORE MORE SERVICES <ArrowRight size={11} />
          </button>
        </div>
      </div>

      {/* 2-col card grid */}
      {items.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-[var(--border-subtle)]">
          <p className="font-mono text-xs text-[var(--text-muted)] tracking-widest">NO SERVICES ADDED YET</p>
          <p className="font-mono text-[10px] text-[var(--text-muted)] opacity-50 mt-1">Add services from the admin panel</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--border-subtle)]">
          {items.map((s, i) => (
            <div key={s.id} className="bg-[var(--bg-void)]">
              <ServiceCard service={s} index={i} />
            </div>
          ))}
        </div>
      )}

      {/* Stats bar */}
      <motion.div
        className="mt-16 grid grid-cols-2 md:grid-cols-4 border border-[var(--border-subtle)]"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {[
          { value: `${projects?.length ?? 0}+`,              label: 'Projects Delivered' },
          { value: `${about?.years_experience ?? 0}+`,        label: 'Years Experience'   },
          { value: `${certifications?.length ?? 0}+`,         label: 'Certifications'     },
          { value: `${about?.client_satisfaction ?? 99}%`,    label: 'Client Satisfaction' },
        ].map(({ value, label }, i) => (
          <div key={label} className={`px-6 py-7 text-center ${i < 3 ? 'border-r border-[var(--border-subtle)]' : ''}`}>
            <p className="font-display text-3xl font-bold text-[var(--amber-bright)]">{value}</p>
            <p className="font-mono text-xs text-[var(--text-muted)] mt-1 tracking-wider">{label}</p>
          </div>
        ))}
      </motion.div>
    </Section>
  )
}
