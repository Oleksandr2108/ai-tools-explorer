export function normalizeDomain(value?: string | null): string | null {
  if (!value) return null
  try {
    const decoded = decodeURIComponent(value).trim().replace(/\.$/, '')
    if (!decoded || /[\s/:?#@\\%]/.test(decoded)) return null
    const domain = new URL(`https://${decoded}`).hostname.toLowerCase()
    const labels = domain.split('.')
    if (domain.length > 253 || labels.length < 2 || !/[a-z]/.test(labels.at(-1) ?? '')) return null
    return labels.every((label) => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label)) ? domain : null
  } catch { return null }
}
