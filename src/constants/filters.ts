export const CATEGORIES = [
  'All', 'AI Agents', 'Code & Dev Tools', 'Image Generation',
  'Video Generation', 'Automation', 'AI Search', 'Design', 'Chatbots',
] as const

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'rating', label: 'Highest DR' },
  { value: 'relevance', label: 'Most relevant' },
] as const

export const DR_OPTIONS = [
  { value: '0', label: 'All' },
  { value: '20', label: '20+' },
  { value: '40', label: '40+' },
  { value: '60', label: '60+' },
] as const

export type Category = typeof CATEGORIES[number]
export type SortOption = typeof SORT_OPTIONS[number]['value']
export type DomainRatingFilter = typeof DR_OPTIONS[number]['value']
