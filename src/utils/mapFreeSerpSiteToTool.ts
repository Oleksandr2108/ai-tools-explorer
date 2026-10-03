import type { FreeSerpSite } from '../types/freeserp'
import type { Tool } from '../types/tool'
import { formatDate } from './formatDate'

export function websiteUrl(url?: string | null, domain?: string | null): string | null {
  for (const candidate of [url, domain && `https://${domain}`]) {
    if (!candidate) continue
    try {
      const parsed = new URL(candidate)
      if (['https:', 'http:'].includes(parsed.protocol) && parsed.hostname.includes('.') && !parsed.username && !parsed.password) return parsed.href
    } catch { /* Try the domain fallback. */ }
  }
  return null
}

export function mapFreeSerpSiteToTool(site: FreeSerpSite, index: number): Tool {
  const title = site.title || site.domain || 'Untitled AI tool'
  const discoveredAt = [site.went_live, site.first_seen].find((date) => formatDate(date)) ?? null
  return {
    id: site.domain || site.url || `site-${index}`,
    title, domain: site.domain ?? '', url: websiteUrl(site.url, site.domain),
    description: site.ai_summary || 'No description available.',
    categories: site.ai_categories.length ? site.ai_categories : site.category ? [site.category] : [],
    domainRating: site.dr, discoveredAt,
    avatar: (site.domain || title).slice(0, 2).toUpperCase(),
  }
}
