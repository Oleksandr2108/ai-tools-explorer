import { useQuery } from '@tanstack/react-query'
import { getStats } from '../api/freeserp'

export function useStats() {
  return useQuery({
    queryKey: ['freeserp-stats'], queryFn: ({ signal }) => getStats(signal),
    staleTime: 30 * 60_000, retry: 1,
  })
}
