import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CategoryFilters } from './CategoryFilters'
import { FilterToolbar } from './FilterToolbar'
import { LoadMore } from './LoadMore'
import { SearchBar } from './SearchBar'
import { ToolGrid } from './ToolGrid'
import { Badge } from './ui/Badge'
import { CATEGORIES, DR_OPTIONS, SORT_OPTIONS } from '../constants/filters'
import { MOCK_TOOLS } from '../mocks/tools'
import { filterTools } from '../utils/filterTools'
import { formatNumber } from '../utils/format'

export function CatalogSection() {
  const [params, setParams] = useSearchParams()
  const urlQuery = params.get('q') ?? ''
  // Keep fast typing synchronous. Serialize the draft on submit/filter actions;
  // URL navigation (including back/forward) still restores the search field.
  const [search, setSearch] = useState({ source: urlQuery, value: urlQuery })
  if (search.source !== urlQuery) {
    setSearch({ source: urlQuery, value: urlQuery })
  }
  const query = search.source === urlQuery ? search.value : urlQuery
  const category = CATEGORIES.find((value) => value === params.get('category')) ?? 'All'
  const sort = SORT_OPTIONS.find(({ value }) => value === params.get('sort'))?.value ?? 'newest'
  const minRating = DR_OPTIONS.find(({ value }) => value === params.get('dr'))?.value ?? '0'
  const tools = filterTools(MOCK_TOOLS, { query, category, sort, minRating })

  function updateFilter(key: string, value: string, defaultValue = '') {
    setParams((current) => {
      const next = new URLSearchParams(current)
      if (query) next.set('q', query)
      else next.delete('q')
      if (value === defaultValue) next.delete(key)
      else next.set(key, value)
      return next
    }, { replace: true })
  }

  function resetFilters() {
    setSearch({ source: urlQuery, value: '' })
    setParams((current) => {
      const next = new URLSearchParams(current)
      for (const key of ['q', 'category', 'sort', 'dr']) next.delete(key)
      return next
    }, { replace: true })
  }

  function showResults() {
    updateFilter('q', query)
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.getElementById('catalog-controls')?.scrollIntoView({
      behavior: reducedMotion ? 'instant' : 'smooth', block: 'start',
    })
  }

  function changeQuery(value: string) {
    setSearch({ source: urlQuery, value })
    if (!value) updateFilter('q', '')
  }

  return (
    <section id="explore" aria-labelledby="explore-heading" className="pb-16 pt-8 sm:pb-20 sm:pt-10">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="explore-heading" className="text-2xl font-medium tracking-tight sm:text-[28px]">A world of possibility.</h2>
          <p className="mt-2 text-sm text-muted">The right tool can change how you work. Find yours.</p>
        </div>
        <Badge className="gap-1.5 rounded-full px-2.5 py-1.5 text-[10px]">
          <span aria-hidden="true" className="size-1 rounded-full bg-accent" />Sample collection
        </Badge>
      </div>
      {/* A viewport-height minimum keeps the search stable as results shrink. */}
      <div id="catalog-controls" className="min-h-[calc(100svh-5.5rem)]">
        <div
          id="catalog-toolbar"
          role="region"
          aria-label="Catalog search and filters"
          className="relative z-10 rounded-2xl border border-border bg-surface/60 p-3 shadow-[0_8px_24px_-16px_#000b]"
        >
          <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center lg:gap-3">
            <div className="min-w-0 flex-1">
              <SearchBar value={query} onChange={changeQuery} onSubmit={showResults} />
            </div>
            <FilterToolbar
              sort={sort}
              minRating={minRating}
              onSortChange={(value) => updateFilter('sort', value, 'newest')}
              onRatingChange={(value) => updateFilter('dr', value, '0')}
            />
          </div>
        </div>
        <div className="mt-3">
          <CategoryFilters value={category} onChange={(value) => updateFilter('category', value, 'All')} />
        </div>
        <p role="status" aria-live="polite" className="mb-5 mt-2 text-sm text-muted">
          <span className="font-medium text-primary">{formatNumber(tools.length)}</span>{' '}
          {tools.length === 1 ? 'AI tool' : 'AI tools'}
          <span className="ml-1 text-xs text-subtle">in this preview</span>
        </p>
        <ToolGrid tools={tools} onReset={resetFilters} />
        {tools.length > 0 && (
          <div className="mt-10 flex flex-col items-center gap-3">
            {/* Pagination becomes available when FreeSerp is connected. */}
            <LoadMore disabled />
            <p className="text-center text-[11px] text-subtle">You’re viewing sample tools. More discoveries with live data.</p>
          </div>
        )}
      </div>
    </section>
  )
}
