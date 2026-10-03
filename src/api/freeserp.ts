import type { FreeSerpSite, FreeSerpStats, FreeSerpToolsResponse, GetAiToolsParams } from '../types/freeserp'

const FREESERP_BASE_URL = 'https://freeserp.ai/api.php'
// FreeSerp currently emits duplicate CORS headers. Vite's scoped proxy is
// development-only; deployments can supply a same-origin endpoint if needed.
const endpoint = import.meta.env.VITE_FREESERP_BASE_URL || (import.meta.env.DEV ? '/freeserp-api' : FREESERP_BASE_URL)
export const DEFAULT_TOOL_PARAMS = { size: 12, from: 0, sort: 'went_live', order: 'desc' } as const

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
function text(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}
function number(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : null
}
function parseSite(value: unknown): FreeSerpSite | null {
  if (!isRecord(value)) return null
  const dr = number(value.dr)
  return {
    domain: text(value.domain), url: text(value.url), title: text(value.title),
    ai_summary: text(value.ai_summary), category: text(value.category),
    ai_categories: Array.isArray(value.ai_categories)
      ? [...new Set(value.ai_categories.map(text).filter((item): item is string => item !== null))] : [],
    dr: dr !== null && dr <= 100 ? dr : null,
    went_live: text(value.went_live), first_seen: text(value.first_seen),
  }
}
export function normalizeToolParams(params: GetAiToolsParams): GetAiToolsParams {
  return {
    size: params.size ?? DEFAULT_TOOL_PARAMS.size,
    from: params.from ?? DEFAULT_TOOL_PARAMS.from,
    sort: params.sort ?? DEFAULT_TOOL_PARAMS.sort,
    order: params.order ?? DEFAULT_TOOL_PARAMS.order,
    query: params.query?.trim() || undefined,
    category: params.category?.trim() || undefined,
    minDr: params.minDr && params.minDr > 0 ? params.minDr : undefined,
  }
}
async function request(params: URLSearchParams, message: string, signal?: AbortSignal) {
  try {
    const response = await fetch(`${endpoint}?${params}`, { signal })
    if (!response.ok) throw new Error(message)
    const body: unknown = await response.json()
    if (!isRecord(body) || body.ok !== true) throw new Error(message)
    return body
  } catch (error) {
    if (signal?.aborted) throw error
    throw new Error(message, { cause: error })
  }
}
export async function getAiTools(params: GetAiToolsParams = {}, signal?: AbortSignal): Promise<FreeSerpToolsResponse> {
  const values = normalizeToolParams(params)
  const search = new URLSearchParams({ index: 'sites', ai_startups: '1' })
  for (const key of ['size', 'from', 'sort', 'order'] as const) {
    search.set(key, String(values[key] ?? DEFAULT_TOOL_PARAMS[key]))
  }
  if (values.query) search.set('q', values.query)
  if (values.category) search.set('ai_categories', values.category)
  if (values.minDr) search.set('dr_min', String(values.minDr))
  const body = await request(search, 'Unable to load AI tools.', signal)
  if (body.index !== 'sites' || !Array.isArray(body.results)) throw new Error('Unable to load AI tools.')
  const results = body.results.map(parseSite).filter((site): site is FreeSerpSite => site !== null)
  if (body.results.length && !results.length) throw new Error('Unable to load AI tools.')
  return { ok: true, index: 'sites', total: number(body.total), count: number(body.count) ?? results.length, results }
}
export async function getStats(signal?: AbortSignal): Promise<FreeSerpStats> {
  const body = await request(new URLSearchParams({ index: 'sites', stats: '1' }), 'Unable to load statistics.', signal)
  if (!isRecord(body.ai_startups)) throw new Error('Unable to load statistics.')
  return { total: number(body.ai_startups.total), today: number(body.ai_startups.today), generatedAt: text(body.generated_at) }
}

