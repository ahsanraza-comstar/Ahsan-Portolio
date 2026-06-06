import { forwardRef } from 'react'

const variants = {
  primary: `
    bg-transparent border-2 border-amber-bright text-amber-bright
    hover:bg-amber-bright hover:text-void
    transition-all duration-200
  `,
  ghost: `
    bg-transparent border border-[var(--border-subtle)] text-[var(--text-body)]
    hover:border-[var(--border-mid)] hover:text-[var(--text-primary)]
    transition-all duration-200
  `,
  teal: `
    bg-transparent border-2 border-[var(--teal-bright)] text-[var(--teal-bright)]
    hover:bg-[var(--teal-bright)] hover:text-void
    transition-all duration-200
  `,
  solid: `
    bg-amber-bright text-void border-2 border-amber-bright
    hover:bg-amber-mid hover:border-amber-mid
    transition-all duration-200
  `,
}

const sizes = {
  sm: 'px-4 py-1.5 text-sm rounded-[var(--radius-sm)]',
  md: 'px-6 py-2.5 text-base rounded-[var(--radius-md)]',
  lg: 'px-8 py-3.5 text-lg rounded-[var(--radius-lg)]',
}

const Button = forwardRef(
  ({ variant = 'primary', size = 'md', className = '', children, loading, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`
          inline-flex items-center gap-2 font-body font-medium
          disabled:opacity-50 disabled:cursor-not-allowed
          cursor-pointer relative overflow-hidden
          ${variants[variant] || variants.primary}
          ${sizes[size] || sizes.md}
          ${className}
        `}
        disabled={loading}
        {...props}
      >
        {loading && (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
export default Button
