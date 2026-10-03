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
The / keyboard shortcut focuses search; Enter scrolls to results.
Load more is disabled until live pagination is available.
Follow [AGENTS.md](./AGENTS.md) for development rules.

## Next phase

Replace fixtures with typed/validated API requests and Query hooks. Move filtering
and sorting server-side and add loading, error, empty, and pagination states.
Consult [FreeSerp documentation](https://freeserp.ai/docs.php) for index=sites.
No API requests run in this phase. Verify category mappings, response nullability, stats availability, and pagination
limits before defining response types. Deployment needs an SPA fallback to index.html.
