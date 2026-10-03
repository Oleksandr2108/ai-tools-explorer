import { DR_OPTIONS, SORT_OPTIONS, type DomainRatingFilter, type SortOption } from '../constants/filters'
import { DropdownSelect } from './ui/DropdownSelect'

type FilterToolbarProps = {
  sort: SortOption
  minRating: DomainRatingFilter
  onSortChange: (value: SortOption) => void
  onRatingChange: (value: DomainRatingFilter) => void
}

export function FilterToolbar({ sort, minRating, onSortChange, onRatingChange }: FilterToolbarProps) {
  return (
    <div role="group" aria-label="Sort and Domain Rating filters" className="grid min-w-0 grid-cols-2 gap-2 lg:flex">
      <DropdownSelect label="Sort" value={sort} options={SORT_OPTIONS} onChange={onSortChange} />
      <DropdownSelect label="Domain Rating" compactLabel="DR" value={minRating} options={DR_OPTIONS} onChange={onRatingChange} />
    </div>
  )
}
