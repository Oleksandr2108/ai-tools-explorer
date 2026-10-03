import { ArrowDown, LoaderCircle } from 'lucide-react'
import { Button } from './ui/Button'

type LoadMoreProps = { loading?: boolean; disabled?: boolean; onClick?: () => void }

export function LoadMore({ loading = false, disabled = false, onClick }: LoadMoreProps) {
  return (
    <Button loading={loading} disabled={disabled} onClick={onClick} className="min-w-44">
      {loading ? <LoaderCircle size={14} className="animate-spin" aria-hidden="true" /> : <ArrowDown size={14} aria-hidden="true" />}
      {loading ? 'Loading tools…' : 'Load more tools'}
    </Button>
  )
}
