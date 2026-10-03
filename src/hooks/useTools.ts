import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getAiTools, normalizeToolParams } from '../api/freeserp'
import type { GetAiToolsParams } from '../types/freeserp'

export function useTools(params: GetAiToolsParams) {
  const normalized = normalizeToolParams(params)
  return useQuery({
    queryKey: ['ai-tools', normalized],
    queryFn: ({ signal }) => getAiTools(normalized, signal),
    staleTime: 60_000, retry: 1, placeholderData: keepPreviousData,
  })
}
