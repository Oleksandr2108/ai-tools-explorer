import { CATEGORIES, DR_OPTIONS, SORT_OPTIONS, type Category, type DomainRatingFilter, type SortOption } from '../constants/filters'

export type CatalogFilters = { query: string; category: Category; sort: SortOption; minRating: DomainRatingFilter }

export function readCatalogFilters(params: URLSearchParams): CatalogFilters {
  return {
    query: (params.get('q') ?? '').trim(),
    category: CATEGORIES.find((value) => value === params.get('category')) ?? 'All',
    sort: SORT_OPTIONS.find(({ value }) => value === params.get('sort'))?.value ?? 'newest',
    minRating: DR_OPTIONS.find(({ value }) => value === params.get('dr'))?.value ?? '0',
  }
}

export function writeCatalogFilters(filters: CatalogFilters, current = new URLSearchParams()): URLSearchParams {
  const next = new URLSearchParams(current)
  for (const key of ['q', 'category', 'sort', 'dr']) next.delete(key)
  if (filters.query.trim()) next.set('q', filters.query.trim())
  if (filters.category !== 'All') next.set('category', filters.category)
  if (filters.sort !== 'newest') next.set('sort', filters.sort)
  if (filters.minRating !== '0') next.set('dr', filters.minRating)
  return next
}
