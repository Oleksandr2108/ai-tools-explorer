import type { Tool } from '../types/tool'
import { ToolCard } from './ToolCard'
import { EmptyState } from './EmptyState'

type ToolGridProps = { tools: Tool[]; onReset: () => void }

export function ToolGrid({ tools, onReset }: ToolGridProps) {
  if (!tools.length) {
    return (
      <EmptyState onReset={onReset} />
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
      {tools.map((tool) => <ToolCard key={tool.id} tool={tool} />)}
    </div>
  )
}
