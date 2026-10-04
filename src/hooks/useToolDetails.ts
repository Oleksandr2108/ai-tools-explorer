import { useQuery } from '@tanstack/react-query'
import { getAiToolByDomain } from '../api/freeserp'

export function useToolDetails(domain: string | null) {
  return useQuery({
    queryKey: ['ai-tool', domain],
    queryFn: ({ signal }) => domain ? getAiToolByDomain(domain, signal) : Promise.resolve(null),
    enabled: domain !== null, staleTime: 60_000, retry: 1,
  })
}
