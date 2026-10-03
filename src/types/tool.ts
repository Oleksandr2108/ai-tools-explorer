// UI model for the preview. Keep the eventual FreeSerp wire response separate.
export type Tool = {
  id: string
  title: string
  domain: string
  url: string
  description: string
  categories: string[]
  domainRating: number
  discoveredAt: string
  avatar: string
}

export type ToolStats = {
  total: number
  today: number
  categories: number
}
