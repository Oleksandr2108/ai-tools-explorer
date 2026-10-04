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

export const API_SORTS = {
  newest: 'went_live', rating: 'dr', relevance: 'relevance',
} as const

// Short UI labels map to FreeSerp's exact-match taxonomy.
export const API_CATEGORIES: Record<Category, string | undefined> = {
  All: undefined, 'AI Agents': 'AI Agents & Autonomous',
  'Code & Dev Tools': 'Code & Dev Tools', 'Image Generation': 'Image Generation',
  'Video Generation': 'Video Generation', Automation: 'AI Automation & Workflows',
  'AI Search': 'AI Search & Answers', Design: 'Design & UI', Chatbots: 'AI Chatbot & Assistant',
}
