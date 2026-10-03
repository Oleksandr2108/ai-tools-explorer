import type { Tool, ToolStats } from '../types/tool'

// UI-development fixtures only. Ratings, dates, and statistics are invented.
// These are not FreeSerp results or product launch dates.
export const MOCK_STATS: ToolStats = { total: 34218, today: 76, categories: 15 }

export const MOCK_TOOLS: Tool[] = [
  {
    id: 'cursor', title: 'Cursor', domain: 'cursor.com', url: 'https://cursor.com', avatar: 'C',
    description: 'Your ideas, written in code. An AI-powered editor that helps you build, refactor, and understand your codebase.',
    categories: ['Code & Dev Tools', 'AI Agents'], domainRating: 72, discoveredAt: '2026-09-28',
  },
  {
    id: 'claude', title: 'Claude', domain: 'claude.ai', url: 'https://claude.ai', avatar: 'Cl',
    description: 'A thoughtful partner for ambitious work. Explore ideas, work through complex problems, and create something new.',
    categories: ['Chatbots', 'AI Agents'], domainRating: 89, discoveredAt: '2026-09-26',
  },
  {
    id: 'perplexity', title: 'Perplexity', domain: 'perplexity.ai', url: 'https://perplexity.ai', avatar: 'P',
    description: 'Go from a question to a clearer picture. Discover answers, explore sources, and follow your curiosity further.',
    categories: ['AI Search', 'Chatbots'], domainRating: 85, discoveredAt: '2026-09-24',
  },
  {
    id: 'midjourney', title: 'Midjourney', domain: 'midjourney.com', url: 'https://www.midjourney.com', avatar: 'M',
    description: 'Turn a spark of imagination into striking visuals. Explore new styles and bring your creative direction to life.',
    categories: ['Image Generation', 'Design'], domainRating: 81, discoveredAt: '2026-09-22',
  },
  {
    id: 'runway', title: 'Runway', domain: 'runwayml.com', url: 'https://runwayml.com', avatar: 'R',
    description: 'A new canvas for moving images. Make cinematic scenes and experiment with the next generation of creative tools.',
    categories: ['Video Generation', 'Design'], domainRating: 78, discoveredAt: '2026-09-20',
  },
  {
    id: 'n8n', title: 'n8n', domain: 'n8n.io', url: 'https://n8n.io', avatar: 'n8',
    description: 'Connect your tools and put repetitive work on autopilot. Build flexible workflows and AI agents on your terms.',
    categories: ['Automation', 'AI Agents'], domainRating: 74, discoveredAt: '2026-09-18',
  },
  {
    id: 'figma', title: 'Figma', domain: 'figma.com', url: 'https://www.figma.com', avatar: 'F',
    description: 'Make room for your next great idea. A collaborative workspace to explore, design, and shape digital experiences.',
    categories: ['Design', 'Image Generation'], domainRating: 93, discoveredAt: '2026-09-16',
  },
  {
    id: 'elevenlabs', title: 'ElevenLabs', domain: 'elevenlabs.io', url: 'https://elevenlabs.io', avatar: 'II',
    description: 'Give your ideas a voice. Create expressive audio and bring natural conversations to your products and stories.',
    categories: ['AI Agents', 'Automation'], domainRating: 79, discoveredAt: '2026-09-14',
  },
  {
    id: 'v0', title: 'v0', domain: 'v0.app', url: 'https://v0.app', avatar: 'v0',
    description: 'Move from a first thought to a working interface. Explore UI ideas and build your next project through conversation.',
    categories: ['Code & Dev Tools', 'Design'], domainRating: 58, discoveredAt: '2026-09-12',
  },
]
