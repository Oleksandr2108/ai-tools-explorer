import { useSearchParams } from 'react-router-dom'
import { Header } from '../components/Header'
import { Hero } from '../components/Hero'
import { StatsBar } from '../components/StatsBar'
import { CategoryFilters } from '../components/CategoryFilters'
import { FilterToolbar } from '../components/FilterToolbar'
import { ToolGrid } from '../components/ToolGrid'
import { LoadMore } from '../components/LoadMore'
import { Footer } from '../components/Footer'
import { Badge } from '../components/ui/Badge'
import { CATEGORIES, DR_OPTIONS, SORT_OPTIONS } from '../constants/filters'
import { MOCK_STATS, MOCK_TOOLS } from '../mocks/tools'
import { filterTools } from '../utils/filterTools'

export function ExplorePage() {
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const category = CATEGORIES.find((value) => value === params.get('category')) ?? 'All'
  const sort = SORT_OPTIONS.find(({ value }) => value === params.get('sort'))?.value ?? 'newest'
  const minRating = DR_OPTIONS.find(({ value }) => value === params.get('dr'))?.value ?? '0'
  const tools = filterTools(MOCK_TOOLS, { query, category, sort, minRating })

  function updateFilter(key: string, value: string, defaultValue = '') {
    setParams((current) => {
      const next = new URLSearchParams(current)
      if (value === defaultValue) next.delete(key)
      else next.set(key, value)
      return next
    }, { replace: true })
  }

  function resetFilters() {
    setParams((current) => {
      const next = new URLSearchParams(current)
      for (const key of ['q', 'category', 'sort', 'dr']) next.delete(key)
      return next
    }, { replace: true })
  }

  return (
    <div id="top">
      <a href="#explore" className="sr-only z-50 rounded-lg bg-accent px-4 py-3 text-background focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to tools</a>
      <Header />
      <main>
        <Hero query={query} onQueryChange={(value) => updateFilter('q', value)} />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <StatsBar stats={MOCK_STATS} />
          <section id="explore" aria-labelledby="explore-heading" className="scroll-mt-28 pb-16 pt-14 sm:pb-20 sm:pt-16">
            <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 id="explore-heading" className="text-2xl font-medium tracking-tight sm:text-[28px]">A world of possibility.</h2>
                <p className="mt-2 text-sm text-muted">The right tool can change how you work. Find yours.</p>
              </div>
              <Badge className="gap-1.5 rounded-full px-2.5 py-1.5 text-[10px]"><span aria-hidden="true" className="size-1 rounded-full bg-accent" />Sample collection</Badge>
            </div>
            <CategoryFilters value={category} onChange={(value) => updateFilter('category', value, 'All')} />
            <FilterToolbar count={tools.length} sort={sort} minRating={minRating} onSortChange={(value) => updateFilter('sort', value, 'newest')} onRatingChange={(value) => updateFilter('dr', value, '0')} />
            <ToolGrid tools={tools} onReset={resetFilters} />
            {tools.length > 0 && (
              <div className="mt-10 flex flex-col items-center gap-3">
                {/* Pagination becomes available when FreeSerp is connected. */}
                <LoadMore disabled />
                <p className="text-center text-[11px] text-subtle">You’re viewing sample tools. More discoveries with live data.</p>
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

