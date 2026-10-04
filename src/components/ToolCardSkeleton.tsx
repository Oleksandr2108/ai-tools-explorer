export function ToolCardSkeleton() {
  return (
    <div aria-hidden="true" className="min-h-[330px] rounded-2xl border border-border bg-surface/80 p-5 motion-safe:animate-pulse sm:p-6">
      <div className="flex items-center gap-3.5"><div className="size-11 rounded-xl bg-surface-raised" /><div className="flex-1 space-y-2"><div className="h-4 w-3/4 rounded bg-surface-raised" /><div className="h-3 w-1/2 rounded bg-surface-raised" /></div></div>
      <div className="mt-6 space-y-3">{[1, 2, 3].map((line) => <div key={line} className="h-3 rounded bg-surface-raised" />)}</div>
      <div className="mt-6 h-5 w-1/2 rounded bg-surface-raised" />
      <div className="mt-6 h-3 w-2/3 rounded bg-surface-raised" />
      <div className="mt-6 border-t border-border pt-4"><div className="h-3 w-1/3 rounded bg-surface-raised" /></div>
    </div>
  )
}
