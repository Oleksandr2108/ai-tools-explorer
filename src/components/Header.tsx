import { ArrowUpRight, Sparkles } from 'lucide-react'

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a href="#top" aria-label="AI Tools Explorer home" className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-accent/25 bg-gradient-to-br from-accent/20 to-indigo-accent/10 text-accent-bright">
            <Sparkles size={18} strokeWidth={1.7} aria-hidden="true" />
          </span>
          <span className="text-sm font-semibold tracking-tight sm:text-base">AI Tools <span className="font-normal text-muted">Explorer</span></span>
        </a>
        <nav aria-label="Main navigation" className="flex shrink-0 items-center gap-5 text-xs sm:gap-7 sm:text-sm">
          <a href="#explore" className="text-primary transition-colors hover:text-accent-bright">Explore</a>
          <a href="#about" className="text-muted transition-colors hover:text-primary">About</a>
          <a href="https://freeserp.ai" target="_blank" rel="noopener noreferrer" className="hidden items-center gap-1.5 border-l border-border pl-7 text-muted transition-colors hover:text-primary md:inline-flex">
            Powered by FreeSerp <ArrowUpRight size={13} aria-hidden="true" />
          </a>
        </nav>
      </div>
    </header>
  )
}
