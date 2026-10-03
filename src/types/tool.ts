// Presentation model, separate from the FreeSerp wire response.
export type Tool = {
  id: string
  title: string
  domain: string
  url: string | null
  description: string
  categories: string[]
  domainRating: number | null
  discoveredAt: string | null
  avatar: string
}
