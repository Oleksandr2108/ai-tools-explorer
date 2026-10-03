import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query'
import { getAiTools, normalizeToolParams, TOOLS_PAGE_SIZE } from '../api/freeserp'
import type { GetAiToolsParams } from '../types/freeserp'
import { getNextToolsOffset } from '../utils/getNextToolsOffset'

export function toolsQueryOptions(params: Omit<GetAiToolsParams, 'from' | 'size'>) {
  const normalized = normalizeToolParams(params)
  return infiniteQueryOptions({
    queryKey: ['ai-tools', normalized],
    initialPageParam: 0,
    queryFn: ({ signal, pageParam }) => getAiTools({
      ...normalized,
      size: TOOLS_PAGE_SIZE,
      from: pageParam,
      // Preserve the selected sort in the key, even when browsing uses newest.
      sort: normalized.sort === 'relevance' && !normalized.query ? 'went_live' : normalized.sort,
    }, signal),
    getNextPageParam: getNextToolsOffset,
    staleTime: 60_000,
    // Returning to an inactive filter combination starts a fresh first page.
    gcTime: 0,
    retry: 1,
  })
}

export function useTools(params: Omit<GetAiToolsParams, 'from' | 'size'>) {
  return useInfiniteQuery(toolsQueryOptions(params))
}
