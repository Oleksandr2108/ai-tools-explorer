import { ChevronDown } from "lucide-react";
import type { ChangeEvent } from "react";
import {
  DR_OPTIONS,
  SORT_OPTIONS,
  type DomainRatingFilter,
  type SortOption,
} from "../constants/filters";

type FilterToolbarProps = {
  sort: SortOption;
  minRating: DomainRatingFilter;
  onSortChange: (value: SortOption) => void;
  onRatingChange: (value: DomainRatingFilter) => void;
};

export function FilterToolbar({
  sort,
  minRating,
  onSortChange,
  onRatingChange,
}: FilterToolbarProps) {
  function handleSortChange(event: ChangeEvent<HTMLSelectElement>) {
    const option = SORT_OPTIONS.find(
      (item) => item.value === event.target.value,
    );
    if (option) onSortChange(option.value);
  }

  function handleRatingChange(event: ChangeEvent<HTMLSelectElement>) {
    const option = DR_OPTIONS.find((item) => item.value === event.target.value);
    if (option) onRatingChange(option.value);
  }

  return (
    <div role="group" aria-label="Sort and Domain Rating filters" className="grid min-w-0 grid-cols-2 gap-2 text-xs text-muted lg:flex">
      <label className="relative flex min-h-10 min-w-0 items-center gap-2 rounded-lg border border-border bg-surface/60 pl-3">
        <span className="sr-only shrink-0 sm:not-sr-only">Sort:</span>
        <select
          value={sort}
          onChange={handleSortChange}
          className="min-h-10 min-w-0 flex-1 appearance-none rounded-lg bg-transparent pr-8 text-xs font-medium text-primary lg:flex-none"
        >
          {SORT_OPTIONS.map(({ value, label }) => (
            <option
              key={value}
              value={value}
            >
              {label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={12}
          className="pointer-events-none absolute right-3"
          aria-hidden="true"
        />
      </label>
      <label className="relative flex min-h-10 min-w-0 items-center gap-2 rounded-lg border border-border bg-surface/60 pl-3">
        <span className="sr-only shrink-0 sm:not-sr-only">Domain Rating:</span>
        <span className="shrink-0 sm:hidden" aria-hidden="true">DR:</span>
        <select
          value={minRating}
          onChange={handleRatingChange}
          className="min-h-10 min-w-0 flex-1 appearance-none rounded-lg bg-transparent pr-8 text-xs font-medium text-primary lg:flex-none"
        >
          {DR_OPTIONS.map(({ value, label }) => (
            <option
              key={value}
              value={value}
            >
              {label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={12}
          className="pointer-events-none absolute right-3"
          aria-hidden="true"
        />
      </label>
    </div>
  );
}
