export type FreeSerpSort = 'went_live' | 'dr' | 'relevance'
export interface GetAiToolsParams {
  query?: string
  category?: string
  minDr?: number
  sort?: FreeSerpSort
  order?: 'asc' | 'desc'
  size?: number
  from?: number
}
export interface FreeSerpSite {
  domain: string | null
  url: string | null
  title: string | null
  ai_summary: string | null
  category: string | null
  ai_categories: string[]
  dr: number | null
  went_live: string | null
  first_seen: string | null
}
export interface FreeSerpToolsResponse {
  ok: true
  index: 'sites'
  total: number | null
  from: number
  count: number
  results: FreeSerpSite[]
}
export interface FreeSerpStats {
  total: number | null
  today: number | null
  generatedAt: string | null
}
