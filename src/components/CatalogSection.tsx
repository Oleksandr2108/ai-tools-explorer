import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { CategoryFilters } from './CategoryFilters'
import { FilterToolbar } from './FilterToolbar'
import { SearchBar } from './SearchBar'
import { ToolGrid } from './ToolGrid'
import { Badge } from './ui/Badge'
import { API_CATEGORIES, CATEGORIES, DR_OPTIONS, SORT_OPTIONS } from '../constants/filters'
import { useTools } from '../hooks/useTools'
import { useDebounce } from '../hooks/useDebounce'
import { mapFreeSerpSiteToTool } from '../utils/mapFreeSerpSiteToTool'
import { ToolCardSkeleton } from './ToolCardSkeleton'
import { ErrorState } from './ErrorState'
import { LoadMore } from './LoadMore'
import { formatNumber } from '../utils/format'

export function CatalogSection() {
  const location = useLocation()
  const navigate = useNavigate()
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
  const debouncedQuery = useDebounce(query)
  const result = useTools({
    query: debouncedQuery,
    category: API_CATEGORIES[category],
    minDr: Number(minRating),
    sort: sort === 'rating' ? 'dr' : sort === 'relevance' ? 'relevance' : 'went_live',
  })
  const tools = (result.data?.pages.flatMap((page) => page.results) ?? []).map(mapFreeSerpSiteToTool)
  const total = result.data?.pages[0]?.total ?? tools.length
  const updating = result.isFetching || query !== debouncedQuery
  const firstPageFailed = result.isError && !result.data
  const navigationState: unknown = location.state
  const restoreScroll = navigationState && typeof navigationState === 'object' && 'catalogScroll' in navigationState
    && typeof navigationState.catalogScroll === 'number' && Number.isFinite(navigationState.catalogScroll)
    ? Math.max(0, navigationState.catalogScroll) : null
  useEffect(() => {
    if (!result.isPending && restoreScroll !== null) window.scrollTo({ top: restoreScroll, behavior: 'instant' })
  }, [location.key, result.isPending, restoreScroll])

  let content
  if (result.isPending) {
    content = <div role="status" aria-label="Loading AI tools" className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">{Array.from({ length: 6 }, (_, index) => <ToolCardSkeleton key={index} />)}</div>
  } else if (firstPageFailed) {
    content = <ErrorState onRetry={() => { void result.refetch() }} retrying={result.isFetching} />
  } else {
    content = <ToolGrid tools={tools} onReset={resetFilters} onOpenDetails={openDetails} />
  }

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

  function openDetails(domain: string) {
    const next = new URLSearchParams(params)
    if (query) next.set('q', query)
    else next.delete('q')
    // Save the draft and scroll on the history entry that Back will restore.
    navigate({ pathname: '/', search: next.toString(), hash: location.hash }, {
      replace: true, state: { catalogScroll: window.scrollY },
    })
    navigate(`/tool/${encodeURIComponent(domain)}`, { state: { fromCatalog: true } })
  }

  return (
    <section id="explore" aria-labelledby="explore-heading" className="pb-16 pt-8 sm:pb-20 sm:pt-10">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="explore-heading" className="text-2xl font-medium tracking-tight sm:text-[28px]">A world of possibility.</h2>
          <p className="mt-2 text-sm text-muted">The right tool can change how you work. Find yours.</p>
        </div>
        <Badge className="gap-1.5 rounded-full px-2.5 py-1.5 text-[10px]">
          <span aria-hidden="true" className="size-1 rounded-full bg-accent" />FreeSerp discovery
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
          {result.isPending ? 'Loading AI tools…' : firstPageFailed ? 'Results unavailable' : <><span className="font-medium text-primary">{formatNumber(total)}</span> {total === 1 ? 'AI tool' : 'AI tools'}<span className="ml-1 text-xs text-subtle">{updating ? 'Updating…' : `Showing ${formatNumber(tools.length)}`}</span></>}
        </p>
        <div aria-busy={updating}>{content}</div>
        {result.hasNextPage && <LoadMore
          loading={result.isFetchingNextPage}
          disabled={updating}
          failed={result.isFetchNextPageError}
          onLoadMore={() => { void result.fetchNextPage() }}
        />}
      </div>
    </section>
  )
}
