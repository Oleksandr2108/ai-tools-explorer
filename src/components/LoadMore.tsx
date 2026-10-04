import { Button } from './ui/Button'

type LoadMoreProps = { loading: boolean; disabled: boolean; failed: boolean; onLoadMore: () => void }

export function LoadMore({ loading, disabled, failed, onLoadMore }: LoadMoreProps) {
  return (
    <div className="mt-10 flex flex-col items-center gap-3">
      {failed && <p role="alert" className="text-center text-sm text-muted">Unable to load more tools. Please try again.</p>}
      <Button onClick={onLoadMore} loading={loading} disabled={disabled}>
        {loading ? 'Loading more...' : 'Load more tools'}
      </Button>
    </div>
  )
}
