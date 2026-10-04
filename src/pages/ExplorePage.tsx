import { useEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'
import { Header } from '../components/Header'
import { Hero } from '../components/Hero'
import { StatsBar } from '../components/StatsBar'
import { CatalogSection } from '../components/CatalogSection'
import { Footer } from '../components/Footer'

export function ExplorePage() {
  const location = useLocation()
  const navigationType = useNavigationType()
  useEffect(() => {
    const state: unknown = location.state
    if (navigationType !== 'PUSH' || !state || typeof state !== 'object' || !('scrollToSection' in state)) return
    if (state.scrollToSection === 'top' || state.scrollToSection === 'explore') {
      document.getElementById(state.scrollToSection)?.scrollIntoView({ behavior: 'instant' })
    }
  }, [location.key, location.state, navigationType])
  return (
    <div id="top">
      <title>AI Tools Explorer — Discover AI Products</title>
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
