import type { HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

export function Badge({ className, children, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span {...props} className={cn('inline-flex items-center rounded-md border border-border bg-surface-raised/60 px-2 py-1 text-[11px] font-medium leading-none text-muted', className)}>
      {children}
    </span>
  )
}
