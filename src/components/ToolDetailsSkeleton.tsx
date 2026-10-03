export function ToolDetailsSkeleton() {
  return (
    <div role="status" aria-label="Loading AI tool details" className="space-y-6 motion-safe:animate-pulse">
      <div aria-hidden="true" className="rounded-3xl border border-border bg-surface/70 p-6 sm:p-10">
        <div className="size-20 rounded-2xl bg-surface-raised" />
        <div className="mt-6 h-8 w-3/4 rounded bg-surface-raised" />
        <div className="mt-3 h-4 w-1/3 rounded bg-surface-raised" />
        <div className="mt-6 h-6 w-1/2 rounded bg-surface-raised" />
        <div className="mt-6 h-11 w-full rounded-xl bg-surface-raised sm:w-56" />
      </div>
      <div aria-hidden="true" className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {[0, 1].map((panel) => <div key={panel} className="rounded-2xl border border-border bg-surface/70 p-6 sm:p-8"><div className="mb-6 h-5 w-1/3 rounded bg-surface-raised" />{[0, 1, 2, 3].map((line) => <div key={line} className="mt-4 h-3 rounded bg-surface-raised" />)}</div>)}
      </div>
    </div>
  )
}
