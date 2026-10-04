import { useEffect, useRef, type FormEvent } from 'react'
import { ArrowRight, Search, X } from 'lucide-react'

type SearchBarProps = {
  value: string
  onChange: (value: string) => void
  onSubmit?: () => void
}

export function SearchBar({ value, onChange, onSubmit }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function focusSearch(event: KeyboardEvent) {
      const target = event.target
      if (target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return
      if (event.key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', focusSearch)
    return () => window.removeEventListener('keydown', focusSearch)
  }, [])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit?.()
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className="flex min-h-12 w-full items-center gap-3 rounded-xl border border-border-strong bg-surface/85 px-3 text-left shadow-[inset_0_1px_0_#ffffff06] transition-[border-color,box-shadow] focus-within:border-accent/60 focus-within:shadow-[0_0_0_3px_var(--color-accent-soft)] sm:px-4"
    >
      <Search size={18} strokeWidth={1.7} className="shrink-0 text-muted" aria-hidden="true" />
      <label htmlFor="tool-search" className="sr-only">Search AI tools, products or keywords</label>
      <input
        ref={inputRef}
        id="tool-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search AI tools, products or keywords..."
        autoComplete="off"
        className="min-w-0 flex-1 bg-transparent py-3.5 text-sm text-primary outline-none placeholder:text-subtle focus-visible:outline-none [&::-webkit-search-cancel-button]:appearance-none"
      />
      {value ? (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => { onChange(''); inputRef.current?.focus() }}
          className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-surface-raised hover:text-primary"
        >
          <X size={16} aria-hidden="true" />
        </button>
      ) : (
        <kbd aria-hidden="true" className="hidden h-6 w-6 items-center justify-center rounded border border-border-strong bg-surface-raised text-xs text-muted sm:flex">/</kbd>
      )}
      <button
        type="submit"
        aria-label="View search results"
        className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-accent/20 bg-accent/10 text-accent-bright transition-colors hover:bg-accent/20"
      >
        <ArrowRight size={18} aria-hidden="true" />
      </button>
    </form>
  )
}
