import { Check, Database, Sparkles } from 'lucide-react'
import { HeroBackground } from './HeroBackground'
import { SearchBar } from './SearchBar'

type HeroProps = { query: string; onQueryChange: (value: string) => void }

export function Hero({ query, onQueryChange }: HeroProps) {
  return (
    <section aria-labelledby="hero-heading" className="relative isolate px-4 pb-12 pt-16 text-center sm:px-6 sm:pb-16 sm:pt-20 lg:pt-24">
      <HeroBackground />
      <div className="mx-auto max-w-4xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-3 py-1.5 text-[11px] font-medium tracking-wide text-accent-bright">
          <span className="size-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)]" aria-hidden="true" />
          A new way to discover AI
        </span>
        <h1 id="hero-heading" className="mt-6 text-[clamp(2.375rem,5.2vw,4.5rem)] font-medium leading-[1.1] tracking-[-0.045em]">
          Discover the AI tools<br className="hidden min-[400px]:block" />{' '}
          <span className="text-muted">shaping what’s </span><span className="text-accent-bright">next.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-lg text-sm leading-7 text-muted sm:text-base">
          Less noise. More possibility. Find your next favorite AI tool<br className="hidden sm:block" />
          in one thoughtfully curated corner of the web.
        </p>
        <SearchBar value={query} onChange={onQueryChange} />
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-muted">
          <span className="inline-flex items-center gap-1.5"><Sparkles size={12} aria-hidden="true" />Interactive preview</span>
          <span className="inline-flex items-center gap-1.5"><Check size={12} aria-hidden="true" />No API key required</span>
          <span className="inline-flex items-center gap-1.5"><Database size={12} aria-hidden="true" />Live FreeSerp data coming next</span>
        </div>
      </div>
    </section>
  )
}
