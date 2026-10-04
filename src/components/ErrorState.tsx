import { CircleAlert } from 'lucide-react'
import { Button } from './ui/Button'

export function ErrorState({ onRetry, retrying }: { onRetry: () => void; retrying: boolean }) {
  return (
    <div role="alert" className="rounded-2xl border border-dashed border-border py-16 text-center">
      <CircleAlert size={24} className="mx-auto text-muted" aria-hidden="true" />
      <h3 className="mt-4 text-lg font-medium">Unable to load AI tools</h3>
      <p className="mt-2 px-4 text-sm text-muted">Please check your connection and try again.</p>
      <Button variant="ghost" onClick={onRetry} disabled={retrying} className="mt-4">{retrying ? 'Trying again…' : 'Try again'}</Button>
    </div>
  )
}
