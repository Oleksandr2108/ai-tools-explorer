# AI Tools Explorer

Vite + React + strict TypeScript visual preview for discovering AI websites.

Run npm install, then npm run dev. Validate with npm run build and npm run lint.
Use npm run preview to preview the production build.

## Architecture

- src/main.tsx: StrictMode, one QueryClient, QueryClientProvider, BrowserRouter.
- src/App.tsx: routing; / renders src/pages/ExplorePage.tsx.
- src/api/freeserp.ts: endpoint/index configuration and future API boundary.
- src/utils/cn.ts: typed clsx + tailwind-merge helper.
- src/index.css: Tailwind v4 and shared dark theme tokens.

- src/components: independent hero, navigation, search, statistics, catalog controls, cards, and footer.
- src/mocks/tools.ts: isolated, typed UI fixtures. Statistics, ratings, and discovery dates are illustrative.
- src/types/tool.ts: UI models, separate from future API response types.
- src/constants/filters.ts: shared category, sort, and Domain Rating configuration.

Search, categories, sorting, and Domain Rating filter the sample collection locally.
Shareable preview state lives in URL parameters (q, category, sort, dr).
The catalog groups search, filters, and results in normal document flow.
Sort and Domain Rating share a custom dropdown with keyboard navigation,
outside-click dismissal, Escape handling, and visible selection/focus states.
The hero CTA jumps to catalog controls. The / keyboard shortcut focuses the sole
search field; Enter brings its controls and nearby results into view. Typing
filters the preview immediately without scrolling. The query is saved to the URL
on submit or filter actions (clearing search removes it immediately). A minimum
workspace height keeps shorter result sets from pulling the controls downward.
Smooth scrolling respects reduced-motion preferences.
Load more is disabled until live pagination is available.
Follow [AGENTS.md](./AGENTS.md) for development rules.

## Next phase

Replace fixtures with typed/validated API requests and Query hooks. Move filtering
and sorting server-side and add loading, error, empty, and pagination states.
Consult [FreeSerp documentation](https://freeserp.ai/docs.php) for index=sites.
No API requests run in this phase. Verify category mappings, response nullability, stats availability, and pagination
limits before defining response types. Deployment needs an SPA fallback to index.html.
