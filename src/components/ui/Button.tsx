import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
  loading?: boolean
}

const variants = {
  primary: 'border-accent/40 bg-accent text-background enabled:hover:bg-accent-bright',
  secondary: 'border-border bg-surface-raised text-primary enabled:hover:border-border-strong enabled:hover:bg-surface-hover',
  ghost: 'border-transparent bg-transparent text-muted enabled:hover:bg-surface-raised enabled:hover:text-primary',
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
      className={cn('inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-medium transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50', variants[variant], className)}
    >
      {children}
    </button>
  )
}
