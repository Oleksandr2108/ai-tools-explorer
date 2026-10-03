# AI Tools Explorer

Vite + React + strict TypeScript frontend for discovering AI websites through FreeSerp.

Run npm install, then npm run dev. Validate with npm run build, npm run lint,
and npm run test:data (request encoding, response validation, errors, fallbacks, and pagination).
Use npm run preview to preview the production build.

## Architecture

- src/main.tsx: StrictMode, one QueryClient, QueryClientProvider, BrowserRouter.
- src/App.tsx: routing; / renders src/pages/ExplorePage.tsx.
- src/api/freeserp.ts: typed requests, defaults, URL parameters, response validation, and errors.
- src/hooks/useTools.ts / useStats.ts: TanStack Query server state, cancellation, caching, and one retry.
- src/hooks/useDebounce.ts: 400 ms search debounce.
- src/utils/cn.ts: typed clsx + tailwind-merge helper.
- src/index.css: Tailwind v4 and shared dark theme tokens.

- src/components: independent hero, navigation, search, statistics, catalog controls, cards, and footer.
- src/types/freeserp.ts: nullable API models and typed request parameters.
- src/types/tool.ts: presentation model; src/utils/mapFreeSerpSiteToTool.ts supplies safe fallbacks and URLs.
- src/constants/filters.ts: shared category, sort, and Domain Rating configuration.

All catalog requests use index=sites and ai_startups=1. The default request retrieves
12 results from offset 0, sorted by went_live descending. Search, exact category
taxonomy, DR minimum, and sort run on the API. Relevance without search text uses
newest discovery order. Existing URL parameters (q, category, sort, dr) are retained.
The catalog groups search, filters, and results in normal document flow.
Sort and Domain Rating share a custom dropdown with keyboard navigation,
outside-click dismissal, Escape handling, and visible selection/focus states.
The hero CTA jumps to catalog controls. The / keyboard shortcut focuses the sole
search field; Enter brings its controls and nearby results into view. Typing
updates the API after a 400 ms debounce without scrolling. The query is saved to the URL
on submit or filter actions (clearing search removes it immediately). A minimum
workspace height keeps shorter result sets from pulling the controls downward.
Smooth scrolling respects reduced-motion preferences.
Initial loading shows six skeleton cards. useInfiniteQuery owns catalog pages with
one 12-result page-size constant. Load More requests the next offset from response
from/count/total metadata and appends cards. Loaded cards stay visible during next-page
loading and errors; failures show a compact retry message beside the button.
The button hides at the end of results or the API's paging window. Search, category,
DR, and sort changes start at offset zero, with previous filter pages discarded.
Loaded pages are cached for five minutes when navigating to tool details.
Initial failures show the full retry state; successful empty responses show
an empty state. Stats use ai_startups.total and ai_startups.today; unavailable
metrics and failed statistics are omitted. No category total is inferred from the
top_ai_categories aggregation. Dates mean discovery, not official product launch.
Mock cards and fake statistics have been removed.
Follow [AGENTS.md](./AGENTS.md) for development rules.

## CORS and deployment

On October 3, 2026, direct browser requests failed because FreeSerp returned duplicate
Access-Control-Allow-Origin headers (combined value: `*, *`). The JSON endpoint works
outside the browser. Vite therefore uses a scoped `/freeserp-api` development proxy,
with no backend or additional dependency. The development server needs outgoing
network permission; sandboxed servers can return 502 when their connection is blocked.

Production builds default to `https://freeserp.ai/api.php`. Static deployment requires
FreeSerp to fix its CORS headers, or a same-origin proxy configured through the optional
`VITE_FREESERP_BASE_URL` build variable. No key or .env file is required. Vite's development
proxy is not bundled into production. Deployment also needs an SPA fallback to index.html.

## Tool details

`/tool/:domain` is a directly shareable route. Cards provide separate View details
and external website actions. `useToolDetails` requests its own data through
`getAiToolByDomain`: index=sites, ai_startups=1, q=domain, size=1, sort=relevance.
The returned domain must match the normalized route domain; unrelated hits mean
not found. Invalid route domains do not trigger a request. FreeSerp is a discovery
index, so some established or no-longer-indexed domains will be unavailable.

The page shows a full summary, real categories, available DR/discovery metadata,
and detected platform information when recognized. Missing values are omitted;
loading, network errors with retry, and not-found responses have distinct states.
The shared generated avatar has no external image dependency. Back uses history
after catalog navigation, restoring serialized search/filter context, cached pages,
and saved scroll position where possible; direct visits fall back to `/`.
Production hosting must serve index.html for `/tool/*` as well as `/`.

## Next phase

Add expanded URL synchronization. FreeSerp sites pagination is limited
to from + size <= 10,000. Unknown filters are ignored and invalid sorts fall back
silently, so inspect echoed filters when extending the UI. Newest sites often omit DR,
and AI niche discovery can also return agencies or research sites.
See [FreeSerp documentation](https://freeserp.ai/docs.php).
