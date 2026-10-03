import { ChevronDown, SlidersHorizontal } from 'lucide-react'
import type { ChangeEvent } from 'react'
import { DR_OPTIONS, SORT_OPTIONS, type DomainRatingFilter, type SortOption } from '../constants/filters'
import { formatNumber } from '../utils/format'

type FilterToolbarProps = {
  count: number
  sort: SortOption
  minRating: DomainRatingFilter
  onSortChange: (value: SortOption) => void
  onRatingChange: (value: DomainRatingFilter) => void
}

export function FilterToolbar({ count, sort, minRating, onSortChange, onRatingChange }: FilterToolbarProps) {
  function handleSortChange(event: ChangeEvent<HTMLSelectElement>) {
    const option = SORT_OPTIONS.find((item) => item.value === event.target.value)
    if (option) onSortChange(option.value)
  }

  function handleRatingChange(event: ChangeEvent<HTMLSelectElement>) {
    const option = DR_OPTIONS.find((item) => item.value === event.target.value)
    if (option) onRatingChange(option.value)
  }

  return (
    <div className="flex flex-col gap-4 border-t border-border/70 pb-6 pt-5 sm:flex-row sm:items-center sm:justify-between">
      <p role="status" aria-live="polite" className="text-sm text-muted"><span className="font-medium text-primary">{formatNumber(count)}</span> {count === 1 ? 'AI tool' : 'AI tools'} <span className="ml-1 text-xs text-subtle">in this preview</span></p>
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted sm:gap-3">
        <SlidersHorizontal size={14} className="mr-1 hidden sm:block" aria-hidden="true" />
        <label className="relative flex min-h-10 items-center gap-2 rounded-lg border border-border bg-surface/60 pl-3">
          <span>Sort:</span>
          <select
            value={sort}
            onChange={handleSortChange}
            className="min-h-10 appearance-none rounded-lg bg-transparent pr-8 text-xs font-medium text-primary"
          >
            {SORT_OPTIONS.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
          </select>
          <ChevronDown size={12} className="pointer-events-none absolute right-3" aria-hidden="true" />
        </label>
        <label className="relative flex min-h-10 items-center gap-2 rounded-lg border border-border bg-surface/60 pl-3">
          <span>Domain Rating:</span>
          <select
            value={minRating}
            onChange={handleRatingChange}
            className="min-h-10 appearance-none rounded-lg bg-transparent pr-8 text-xs font-medium text-primary"
          >
            {DR_OPTIONS.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
          </select>
          <ChevronDown size={12} className="pointer-events-none absolute right-3" aria-hidden="true" />
        </label>
      </div>
    </div>
  )
}
