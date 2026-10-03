import type { Category, DomainRatingFilter, SortOption } from '../constants/filters'
import type { Tool } from '../types/tool'

type PreviewFilters = {
  query: string
  category: Category
  sort: SortOption
  minRating: DomainRatingFilter
}

// Local preview behavior only; the API phase will move filtering/sorting server-side.
export function filterTools(tools: Tool[], { query, category, sort, minRating }: PreviewFilters): Tool[] {
  const term = query.trim().toLowerCase()
  const results = tools.filter((tool) =>
    (category === 'All' || tool.categories.includes(category)) &&
    tool.domainRating >= Number(minRating) &&
    `${tool.title} ${tool.domain} ${tool.description} ${tool.categories.join(' ')}`.toLowerCase().includes(term),
  )

  if (sort === 'rating') return results.sort((a, b) => b.domainRating - a.domainRating)
  if (sort === 'newest') return results.sort((a, b) => b.discoveredAt.localeCompare(a.discoveredAt))
  // Prefer title matches in the preview; no synthetic API relevance score.
  return results.sort((a, b) => Number(b.title.toLowerCase().includes(term)) - Number(a.title.toLowerCase().includes(term)))
}
