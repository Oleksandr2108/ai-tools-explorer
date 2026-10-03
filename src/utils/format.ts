const numberFormatter = new Intl.NumberFormat('en-US')
const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short', year: 'numeric', timeZone: 'UTC',
})

export function formatNumber(value: number): string {
  return numberFormatter.format(value)
}

export function formatDiscoveredDate(value: string): string {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Unknown date' : dateFormatter.format(date)
}
