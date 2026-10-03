import { Header } from '../components/Header'
import { Hero } from '../components/Hero'
import { StatsBar } from '../components/StatsBar'
import { CatalogSection } from '../components/CatalogSection'
import { Footer } from '../components/Footer'

export function ExplorePage() {
  return (
    <div id="top">
      <a href="#catalog-controls" className="sr-only z-50 rounded-lg bg-accent px-4 py-3 text-background focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to tools</a>
      <Header />
      <main>
        <Hero />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <StatsBar />
          <CatalogSection />
        </div>
      </main>
      <Footer />
    </div>
  )
}
