import { useEffect, useRef } from 'react'
import { hashKey, infiniteQueryOptions, useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
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
    // Preserve loaded pages while visiting a tool detail page.
    gcTime: 5 * 60_000,
    retry: 1,
  })
}

export function useTools(params: Omit<GetAiToolsParams, 'from' | 'size'>) {
  const options = toolsQueryOptions(params)
  const client = useQueryClient()
  const previousKey = useRef(options.queryKey)
  const result = useInfiniteQuery(options)
  useEffect(() => {
    if (hashKey(previousKey.current) !== hashKey(options.queryKey)) {
      // Filter changes discard old pagination; navigation alone retains it.
      client.removeQueries({ queryKey: previousKey.current, exact: true, type: 'inactive' })
      previousKey.current = options.queryKey
    }
  }, [client, options.queryKey])
  return result
}
