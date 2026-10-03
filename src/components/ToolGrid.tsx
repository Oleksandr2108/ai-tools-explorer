import { SearchX } from 'lucide-react'
import type { Tool } from '../types/tool'
import { ToolCard } from './ToolCard'
import { Button } from './ui/Button'

type ToolGridProps = { tools: Tool[]; onReset: () => void }

export function ToolGrid({ tools, onReset }: ToolGridProps) {
  if (!tools.length) {
    return (
      <div className="rounded-2xl border border-dashed border-border py-16 text-center">
        <SearchX size={24} className="mx-auto text-muted" aria-hidden="true" />
        <h3 className="mt-4 text-lg font-medium">No tools found in this preview</h3>
        <p className="mx-auto mt-2 max-w-xs px-4 text-sm leading-6 text-muted">Try another keyword or category to explore the sample collection.</p>
        <Button variant="ghost" onClick={onReset} className="mt-4">Clear filters</Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
      {tools.map((tool) => <ToolCard key={tool.id} tool={tool} />)}
    </div>
  )
}
