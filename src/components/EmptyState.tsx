import { SearchX } from 'lucide-react'
import { Button } from './ui/Button'

export function EmptyState({ onReset }: { onReset?: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-border py-16 text-center">
      <SearchX size={24} className="mx-auto text-muted" aria-hidden="true" />
      <h3 className="mt-4 text-lg font-medium">No AI tools found</h3>
      <p className="mt-2 px-4 text-sm text-muted">Try changing your search or filters.</p>
      {onReset && <Button variant="ghost" onClick={onReset} className="mt-4">Clear filters</Button>}
    </div>
  )
}
