# Development rules

- Keep this a simple Vite + React + TypeScript frontend. No backend, authentication, Redux, Zustand, or unnecessary dependencies.
- Keep App.tsx focused on routing/layout and pages on composition. Split by meaningful responsibility, prefer reusable UI, and avoid giant files or trivial wrapper abstractions.
- Use strict TypeScript and explicit/destructured props. Avoid any; narrow external unknown data at the API boundary. Keep shared API/filter types in src/types when introduced.
- Centralize FreeSerp requests, URLSearchParams construction, response validation, and errors in src/api/freeserp.ts with index=sites. Never fetch or construct API URLs in UI components.
- Use TanStack Query for server state without copying it to React state. Use component state for local UI and URLSearchParams for shareable search/filter/sort state.
- Introduce src/components/ui, src/hooks, src/types, and src/constants only when useful. Helpers belong in src/utils. No empty placeholder files.
- Use Tailwind and cn() for merged classes. Keep index.css for theme tokens, globals, and shared animations. Use consistent dark theme colors; no component CSS files or UI frameworks.
- Build mobile-first for 375, 768, 1024, and 1440+ px; avoid overflow and fixed-width layouts.
- Use semantic HTML, accessible labels, keyboard navigation, visible focus, sufficient contrast, and aria-hidden on decorative icons.
- Keep animations subtle and lightweight, prefer CSS, and respect prefers-reduced-motion. No WebGL, Canvas, or Framer Motion unless requested.
- Add loading/error/empty states with data features. Do not swallow errors, use alert(), or leave debug logs.
- Use clear English naming and readable imports. Avoid duplicated logic, speculative abstractions, unnecessary aliases, and over-engineering.
- Run npm run build and npm run lint after substantial changes; fix all failures.
- FreeSerp is now connected through typed API functions and Query hooks. Preserve the existing router, QueryClient, and visual design. Never invent missing API values or describe discovery dates as official launches. Pagination and expanded URL synchronization belong to the next phase.

