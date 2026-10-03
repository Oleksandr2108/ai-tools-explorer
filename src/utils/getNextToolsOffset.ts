import { TOOLS_PAGE_SIZE } from '../api/freeserp'
import type { FreeSerpToolsResponse } from '../types/freeserp'

export function getNextToolsOffset(page: FreeSerpToolsResponse): number | undefined {
  if (page.count === 0) return undefined
  const nextFrom = page.from + page.count
  if (page.total !== null ? nextFrom >= page.total : page.count < TOOLS_PAGE_SIZE) return undefined
  // The sites index permits from + size <= 10,000.
  if (nextFrom + TOOLS_PAGE_SIZE > 10_000) return undefined
  return nextFrom
}
