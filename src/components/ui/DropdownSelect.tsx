import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '../../utils/cn'

type SelectOption<Value extends string> = { value: Value; label: string }
type DropdownSelectProps<Value extends string> = {
  label: string
  compactLabel?: string
  value: Value
  options: readonly SelectOption<Value>[]
  onChange: (value: Value) => void
  disabled?: boolean
}

export function DropdownSelect<Value extends string>({
  label, compactLabel, value, options, onChange, disabled = false,
}: DropdownSelectProps<Value>) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [menuPlacement, setMenuPlacement] = useState({ above: false, maxHeight: 288 })
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([])
  const menuId = useId()
  const selectedIndex = options.findIndex((option) => option.value === value)
  const selected = options[selectedIndex]

  useEffect(() => {
    if (open) {
      optionRefs.current[activeIndex]?.focus({ preventScroll: true })
      optionRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest', behavior: 'instant' })
    }
  }, [open, activeIndex])

  useEffect(() => {
    if (!open) return
    function closeOutside(event: PointerEvent) {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', closeOutside)
    return () => document.removeEventListener('pointerdown', closeOutside)
  }, [open])

  function openMenu(index = Math.max(0, selectedIndex)) {
    if (disabled || !options.length) return
    const bounds = triggerRef.current?.getBoundingClientRect()
    if (bounds) {
      const below = window.innerHeight - bounds.bottom - 12
      const above = bounds.top - 88 // Leave room for the header and its focus offset.
      const openAbove = below < options.length * 40 + 10 && above > below
      setMenuPlacement({ above: openAbove, maxHeight: Math.max(40, Math.min(288, openAbove ? above : below)) })
    }
    setActiveIndex(index)
    setOpen(true)
  }

  function closeAndFocus() {
    setOpen(false)
    triggerRef.current?.focus({ preventScroll: true })
  }

  function selectOption(index: number) {
    const option = options[index]
    if (option) onChange(option.value)
    closeAndFocus()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape' && open) {
      event.preventDefault()
      event.stopPropagation()
      closeAndFocus()
      return
    }
    if (!open) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault()
        openMenu(selectedIndex >= 0 ? selectedIndex : event.key === 'ArrowUp' ? options.length - 1 : 0)
      }
      return
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const direction = event.key === 'ArrowDown' ? 1 : -1
      setActiveIndex((index) => (index + direction + options.length) % options.length)
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      setActiveIndex(event.key === 'Home' ? 0 : options.length - 1)
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      selectOption(activeIndex)
    }
  }

  return (
    <div
      ref={rootRef}
      onKeyDown={handleKeyDown}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false)
      }}
      className={cn('relative min-w-0 lg:min-w-40', open && 'z-40')}
    >
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled || !options.length}
        aria-label={`${label}: ${selected?.label ?? 'Select'}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => open ? setOpen(false) : openMenu()}
        className={cn(
          'flex min-h-11 w-full cursor-pointer items-center gap-2 rounded-xl border border-border bg-surface/70 px-3 text-xs transition-colors duration-200 enabled:hover:border-border-strong enabled:hover:bg-surface-raised focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50',
          open && 'border-accent/40 bg-surface-raised',
        )}
      >
        <span aria-hidden="true" className="hidden shrink-0 text-muted sm:inline">{label}:</span>
        {compactLabel && <span aria-hidden="true" className="shrink-0 text-muted sm:hidden">{compactLabel}:</span>}
        <span className="min-w-0 flex-1 truncate text-left font-medium text-primary">{selected?.label ?? 'Select'}</span>
        <ChevronDown size={13} aria-hidden="true" className={cn('shrink-0 text-muted transition-transform duration-200', open && 'rotate-180')} />
      </button>
      {open && (
        <div
          id={menuId}
          role="listbox"
          aria-label={label}
          style={{ maxHeight: menuPlacement.maxHeight }}
          className={cn(
            'absolute inset-x-0 z-40 overflow-y-auto rounded-xl border border-border-strong bg-surface-raised/95 p-1 shadow-[0_12px_32px_-8px_#000b] backdrop-blur-xl',
            menuPlacement.above ? 'bottom-full mb-2' : 'top-full mt-2',
          )}
        >
          {options.map((option, index) => (
            <button
              key={option.value}
              ref={(element) => { optionRefs.current[index] = element }}
              type="button"
              role="option"
              aria-selected={option.value === value}
              tabIndex={index === activeIndex ? 0 : -1}
              onClick={() => selectOption(index)}
              className={cn(
                'flex min-h-10 w-full cursor-pointer items-center justify-between gap-1 rounded-lg px-2.5 text-left text-xs text-muted transition-colors duration-150 hover:bg-surface-hover hover:text-primary focus-visible:outline-offset-[-2px]',
                index === activeIndex && 'bg-surface-hover text-primary',
                option.value === value && 'bg-accent/10 text-accent-bright',
              )}
            >
              <span>{option.label}</span>
              <span className="w-3.5 shrink-0">{option.value === value && <Check size={14} aria-hidden="true" />}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
