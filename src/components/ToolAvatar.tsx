import { cn } from '../utils/cn'

export function ToolAvatar({ letters, className }: { letters: string; className?: string }) {
  return <span aria-hidden="true" className={cn('flex size-11 shrink-0 items-center justify-center rounded-xl border border-border-strong bg-gradient-to-br from-surface-hover to-background text-lg font-medium tracking-tight text-primary', className)}>{letters}</span>
}
