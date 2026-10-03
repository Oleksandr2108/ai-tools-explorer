import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
  loading?: boolean
}

const variants = {
  primary: 'border-accent/40 bg-accent text-background hover:bg-accent-bright',
  secondary: 'border-border bg-surface-raised text-primary hover:border-border-strong hover:bg-surface-hover',
  ghost: 'border-transparent bg-transparent text-muted hover:bg-surface-raised hover:text-primary',
}

export function Button({
  className, variant = 'secondary', type = 'button',
  loading = false, disabled, children, ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn('inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-medium transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50', variants[variant], className)}
    >
      {children}
    </button>
  )
}
