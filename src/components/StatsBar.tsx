import { ArrowUpRight, Layers3 } from 'lucide-react'
import { useStats } from '../hooks/useStats'
import { formatDate } from '../utils/formatDate'
import { formatNumber } from '../utils/format'

export function StatsBar() {
  const { data: stats, isPending, isError } = useStats()
  if (isPending) return <div role="status" aria-label="Loading discovery statistics" className="mx-auto h-24 max-w-3xl rounded-2xl border border-border bg-surface/65 motion-safe:animate-pulse" />
  if (isError || !stats) return null
  const metrics = [
    { value: stats.total, label: 'AI tools indexed', icon: Layers3 },
    { value: stats.today, label: 'Discovered today', icon: ArrowUpRight },
  ].filter((metric): metric is typeof metric & { value: number } => metric.value !== null)
  if (!metrics.length) return null

  return (
    <section aria-label="AI discovery statistics" className="mx-auto max-w-3xl">
      <dl className="flex divide-x divide-border rounded-2xl border border-border bg-surface/65 py-4">
        {metrics.map(({ value, label, icon: Icon }) => (
          <div key={label} className="flex-1 px-2 text-center sm:px-6">
            <dt className="flex items-center justify-center gap-2 text-[10px] text-muted sm:text-xs"><Icon size={13} className="hidden sm:block" aria-hidden="true" />{label}</dt>
            <dd className="mt-1.5 text-2xl font-medium tracking-tight tabular-nums">{formatNumber(value)}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-center text-[10px] tracking-wide text-subtle">FreeSerp index snapshot{formatDate(stats.generatedAt) ? ` · ${formatDate(stats.generatedAt)}` : ''}</p>
    </section>
  )
}
