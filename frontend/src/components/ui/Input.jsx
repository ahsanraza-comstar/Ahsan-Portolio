import { forwardRef } from 'react'

const Input = forwardRef(({ label, id, className = '', textarea, rows = 4, error, ...props }, ref) => {
  const Tag = textarea ? 'textarea' : 'input'

  return (
    <div className={`float-label ${className}`}>
      <Tag
        ref={ref}
        id={id}
        placeholder=" "
        rows={textarea ? rows : undefined}
        className={`resize-none ${textarea ? 'min-h-[100px]' : ''}`}
        {...props}
      />
      <label htmlFor={id}>{label}</label>
      {error && <p className="text-[var(--rose-bright)] text-xs mt-1 font-mono">{error}</p>}
    </div>
  )
})

Input.displayName = 'Input'
export default Input
