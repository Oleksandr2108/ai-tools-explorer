import type { FreeSerpSite } from '../types/freeserp'
import type { Tool } from '../types/tool'
import { formatDate } from '../utils/formatDate'

const platforms: Record<string, string> = {
  nextjs: 'Next.js', wordpress: 'WordPress', shopify: 'Shopify', react: 'React',
  webflow: 'Webflow', wix: 'Wix', lovable: 'Lovable', v0: 'v0', bolt: 'Bolt', base44: 'Base44',
}

export function ToolMetaGrid({ site, tool }: { site: FreeSerpSite; tool: Tool }) {
  const date = formatDate(tool.discoveredAt)
  const platform = site.ai_source ? platforms[site.ai_source] : undefined
  const rows = [
    { label: 'Domain', value: tool.domain },
    { label: 'Domain Rating', value: tool.domainRating !== null ? String(tool.domainRating) : null },
    { label: site.went_live && formatDate(site.went_live) ? 'First seen live' : 'Discovered', value: date },
    { label: 'Detected platform', value: platform },
  ].filter((row): row is { label: string; value: string } => Boolean(row.value))
  if (!rows.length) return null
  return (
    <section aria-labelledby="details-heading" className="rounded-2xl border border-border bg-surface/70 p-6 sm:p-8">
      <h2 id="details-heading" className="text-lg font-medium tracking-tight">Details</h2>
      <dl className="mt-6 grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2">
        {rows.map(({ label, value }) => <div key={label} className="min-w-0"><dt className="text-xs text-subtle">{label}</dt><dd className="mt-2 break-words text-sm font-medium text-primary [overflow-wrap:anywhere]">{value}</dd></div>)}
      </dl>
      {date && <p className="mt-7 border-t border-border pt-5 text-xs leading-6 text-subtle">Discovery dates reflect FreeSerp’s observations and may differ from a product’s official launch.</p>}
    </section>
  )
}
