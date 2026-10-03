import { ArrowUpRight, CalendarDays, ChartNoAxesColumnIncreasing } from 'lucide-react'
import type { Tool } from '../types/tool'
import { formatDiscoveredDate } from '../utils/format'
import { Badge } from './ui/Badge'

type ToolCardProps = { tool: Tool }

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <article className="group flex h-full min-w-0 flex-col rounded-2xl border border-border bg-surface/80 p-5 transition-[transform,border-color,background-color,box-shadow] duration-200 motion-safe:hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface-hover hover:shadow-[0_10px_35px_-15px_#0009] focus-within:border-accent/40 sm:p-6">
      <div className="flex min-w-0 items-center gap-3.5">
        <span aria-hidden="true" className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border-strong bg-gradient-to-br from-surface-hover to-background text-lg font-medium tracking-tight text-primary">{tool.avatar}</span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[15px] font-semibold tracking-tight" title={tool.title}>{tool.title}</h3>
          <p className="mt-1 truncate text-xs text-subtle" title={tool.domain}>{tool.domain}</p>
        </div>
        <span className="size-1.5 shrink-0 rounded-full bg-accent/60" aria-hidden="true" />
      </div>
      <p className="mt-5 line-clamp-3 min-h-[66px] text-[13px] leading-[22px] text-muted">{tool.description}</p>
      <div className="mt-5 flex flex-wrap items-center gap-1.5">
        {tool.categories.slice(0, 2).map((category) => <Badge key={category}>{category}</Badge>)}
        {tool.categories.length > 2 && <Badge title={tool.categories.slice(2).join(', ')}>+{tool.categories.length - 2}</Badge>}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] text-subtle">
        <span className="inline-flex items-center gap-1.5"><ChartNoAxesColumnIncreasing size={12} aria-hidden="true" />DR <strong className="text-xs font-medium text-muted">{tool.domainRating}</strong></span>
        <span className="inline-flex items-center gap-1.5"><CalendarDays size={11} aria-hidden="true" />Discovered <time dateTime={tool.discoveredAt}>{formatDiscoveredDate(tool.discoveredAt)}</time></span>
      </div>
      <div className="mt-auto pt-5">
        <a href={tool.url} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${tool.title} website (opens in a new tab)`} className="flex min-h-10 items-center justify-between gap-2 border-t border-border pt-4 text-xs font-medium text-muted transition-colors hover:text-accent-bright">
          Visit website <ArrowUpRight size={15} className="transition-transform duration-200 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5" aria-hidden="true" />
        </a>
      </div>
    </article>
  )
}
