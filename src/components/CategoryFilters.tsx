import { Grid2X2 } from 'lucide-react'
import { CATEGORIES, type Category } from '../constants/filters'
import { cn } from '../utils/cn'

type CategoryFiltersProps = { value: Category; onChange: (value: Category) => void }

export function CategoryFilters({ value, onChange }: CategoryFiltersProps) {
  return (
    <div role="group" aria-label="Filter by category" className="flex gap-2 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {CATEGORIES.map((category) => (
        <button
          key={category}
          type="button"
          aria-pressed={category === value}
          onClick={() => onChange(category)}
          className={cn(
            'inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg border px-3.5 text-xs font-medium transition-colors duration-200',
            category === value
              ? 'border-accent/35 bg-accent/10 text-accent-bright'
              : 'border-border bg-surface/50 text-muted hover:border-border-strong hover:bg-surface-raised hover:text-primary',
          )}
        >
          {category === 'All' && <Grid2X2 size={13} aria-hidden="true" />}
          {category === 'All' ? 'All tools' : category}
        </button>
      ))}
    </div>
  )
}
