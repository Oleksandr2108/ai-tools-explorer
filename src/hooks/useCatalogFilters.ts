import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { readCatalogFilters, writeCatalogFilters, type CatalogFilters } from '../utils/catalogFilters'
import { useDebounce } from './useDebounce'

export function useCatalogFilters() {
  const location = useLocation()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const filters = readCatalogFilters(params)
  // Only the uncommitted input is local. Every request derives from the URL.
  // A navigation key also invalidates pending typing on Back/Forward.
  const [draft, setDraft] = useState({ key: location.key, value: filters.query })
  if (draft.key !== location.key) setDraft({ key: location.key, value: filters.query })
  const query = draft.key === location.key ? draft.value : filters.query
  const debounced = useDebounce(draft)

  useEffect(() => {
    if (debounced.key !== location.key || debounced.value.trim() === filters.query) return
    setParams(writeCatalogFilters({ ...readCatalogFilters(params), query: debounced.value }, params), { replace: true })
  }, [debounced, location.key, filters.query, params, setParams])

  function changeQuery(value: string) {
    setDraft({ key: location.key, value })
  }

  function updateFilter<K extends keyof CatalogFilters>(key: K, value: CatalogFilters[K]) {
    const next = writeCatalogFilters({ ...filters, query, [key]: value }, params)
    if (next.toString() !== params.toString()) setParams(next)
  }

  function resetFilters() {
    setDraft({ key: location.key, value: '' })
    navigate({ pathname: location.pathname, search: '' })
  }

  return {
    ...filters, query, params, changeQuery, updateFilter, resetFilters,
    searchPending: query.trim() !== filters.query,
    hasActiveFilters: Boolean(query.trim() || filters.category !== 'All' || filters.sort !== 'newest' || filters.minRating !== '0'),
  }
}
