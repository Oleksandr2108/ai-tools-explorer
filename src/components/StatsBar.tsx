import { ArrowUpRight, Layers3, Shapes } from 'lucide-react'
import type { ToolStats } from '../types/tool'
import { formatNumber } from '../utils/format'

type StatsBarProps = { stats: ToolStats }

export function StatsBar({ stats }: StatsBarProps) {
  const metrics = [
    { value: stats.total, label: 'AI tools indexed', icon: Layers3 },
    { value: stats.today, label: 'Discovered today', icon: ArrowUpRight },
    { value: stats.categories, label: 'Categories', icon: Shapes },
  ]

  return (
    <section aria-label="Sample discovery statistics" className="mx-auto max-w-3xl">
      <dl className="grid grid-cols-3 divide-x divide-border rounded-2xl border border-border bg-surface/65 py-5 sm:py-6">
        {metrics.map(({ value, label, icon: Icon }) => (
          <div key={label} className="px-2 text-center sm:px-6">
            <dt className="flex items-center justify-center gap-2 text-[10px] text-muted sm:text-xs"><Icon size={13} className="hidden sm:block" aria-hidden="true" />{label}</dt>
            <dd className="mt-2 text-2xl font-medium tracking-tight tabular-nums sm:text-3xl">{formatNumber(value)}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-center text-[10px] tracking-wide text-subtle">Sample statistics · UI preview only</p>
    </section>
  )
}
