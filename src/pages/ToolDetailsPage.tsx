import { useEffect } from 'react'
import { ArrowLeft, ArrowUpRight, CircleAlert, SearchX } from 'lucide-react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { ToolAvatar } from '../components/ToolAvatar'
import { ToolDetailsSkeleton } from '../components/ToolDetailsSkeleton'
import { ToolMetaGrid } from '../components/ToolMetaGrid'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { useToolDetails } from '../hooks/useToolDetails'
import { normalizeDomain } from '../utils/normalizeDomain'
import { mapFreeSerpSiteToTool } from '../utils/mapFreeSerpSiteToTool'

export function ToolDetailsPage() {
  const { domain: routeDomain } = useParams()
  const domain = normalizeDomain(routeDomain)
  const result = useToolDetails(domain)
  const location = useLocation()
  const navigate = useNavigate()
  const state: unknown = location.state
  const fromCatalog = state !== null && typeof state === 'object' && 'fromCatalog' in state && state.fromCatalog === true
  const site = result.data
  const tool = site ? mapFreeSerpSiteToTool(site, 0) : null
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [domain])

  const back = fromCatalog
    ? <Button variant="ghost" onClick={() => navigate(-1)} className="-ml-3 px-3"><ArrowLeft size={15} aria-hidden="true" />Back to explore</Button>
    : <Link to="/" className="inline-flex min-h-11 items-center gap-2 text-sm text-muted transition-colors hover:text-accent-bright"><ArrowLeft size={15} aria-hidden="true" />Back to explore</Link>

  let content
  if (!domain || (!result.isPending && !result.isError && !site)) {
    content = <div className="rounded-3xl border border-border bg-surface/70 px-6 py-16 text-center"><SearchX size={28} className="mx-auto text-muted" aria-hidden="true" /><h1 className="mt-5 text-2xl font-medium tracking-tight">AI tool not found</h1><p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted">This tool may no longer be available in the FreeSerp index.</p><div className="mt-6">{back}</div></div>
  } else if (result.isPending) {
    content = <ToolDetailsSkeleton />
  } else if (result.isError) {
    content = <div role="alert" className="rounded-3xl border border-border bg-surface/70 px-6 py-16 text-center"><CircleAlert size={28} className="mx-auto text-muted" aria-hidden="true" /><h1 className="mt-5 text-2xl font-medium tracking-tight">Unable to load this AI tool</h1><p className="mt-3 text-sm text-muted">We couldn’t retrieve the tool details. Please try again.</p><div className="mt-6 flex flex-wrap items-center justify-center gap-3"><Button onClick={() => { void result.refetch() }} loading={result.isFetching}>{result.isFetching ? 'Trying again…' : 'Try again'}</Button>{back}</div></div>
  } else if (site && tool) {
    content = <>
      <section aria-labelledby="tool-heading" className="relative isolate overflow-hidden rounded-3xl border border-border bg-surface/70 p-6 sm:p-10">
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-24 -z-10 size-80 rounded-full bg-accent/5 blur-3xl" />
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:gap-7">
          <ToolAvatar letters={tool.avatar} className="size-20 rounded-2xl text-3xl" />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-accent-bright">AI tool profile</p>
            <h1 id="tool-heading" className="mt-3 break-words text-2xl font-medium leading-tight tracking-tight [overflow-wrap:anywhere] sm:text-4xl">{tool.title}</h1>
            <p className="mt-3 break-all text-sm text-muted">{tool.domain}</p>
            {(tool.categories.length > 0 || tool.domainRating !== null) && <div className="mt-5 flex flex-wrap gap-2">{tool.categories.map((category) => <Badge key={category}>{category}</Badge>)}{tool.domainRating !== null && <Badge className="border-accent/25 text-accent-bright">DR {tool.domainRating}</Badge>}</div>}
          </div>
        </div>
        {tool.url && <a href={tool.url} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-accent/40 bg-accent px-5 py-3 text-sm font-medium text-background transition-colors hover:bg-accent-bright sm:w-auto">Visit official website <ArrowUpRight size={16} aria-hidden="true" /></a>}
      </section>
      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1.6fr_1fr]">
        <section aria-labelledby="about-tool-heading" className="rounded-2xl border border-border bg-surface/70 p-6 sm:p-8">
          <h2 id="about-tool-heading" className="text-lg font-medium tracking-tight">About this tool</h2>
          <p className="mt-5 max-w-prose whitespace-pre-line break-words text-sm leading-8 text-muted [overflow-wrap:anywhere] sm:text-[15px]">{site.ai_summary || 'No detailed description is available for this tool yet.'}</p>
          <p className="mt-7 text-[11px] text-subtle">Summary provided by FreeSerp.</p>
        </section>
        <ToolMetaGrid site={site} tool={tool} />
      </div>
    </>
  }

  return (
    <div id="top" className="flex min-h-svh flex-col">
      <title>{tool ? `${tool.title} — AI Tools Explorer` : 'AI Tool — AI Tools Explorer'}</title>
      <a href="#tool-content" className="sr-only z-50 rounded-lg bg-accent px-4 py-3 text-background focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to tool details</a>
      <Header />
      <main id="tool-content" className="mx-auto w-full max-w-7xl flex-1 px-4 pb-16 pt-6 sm:px-6 sm:pb-20 sm:pt-8 lg:px-8">
        <div className="mb-5">{back}</div>
        {content}
      </main>
      <Footer />
    </div>
  )
}
