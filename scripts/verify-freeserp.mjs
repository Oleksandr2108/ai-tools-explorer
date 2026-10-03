import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import ts from 'typescript'
import { InfiniteQueryObserver, QueryClient } from '@tanstack/react-query'

// Exercise the real API boundary with controlled external responses, without
// a browser, network dependency, or additional test package.
async function moduleUrl(path, replacements = []) {
  let source = await readFile(new URL(`../src/${path}`, import.meta.url), 'utf8')
  for (const [from, to] of replacements) source = source.replaceAll(from, to)
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2023 } })
  return `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`
}
const domainUrl = await moduleUrl('utils/normalizeDomain.ts')
const { normalizeDomain } = await import(domainUrl)
const apiUrl = await moduleUrl('api/freeserp.ts', [
  ['import.meta.env', '({ DEV: false })'],
  ["'../utils/normalizeDomain'", JSON.stringify(domainUrl)],
])
const api = await import(apiUrl)
const offsetUrl = await moduleUrl('utils/getNextToolsOffset.ts', [["'../api/freeserp'", JSON.stringify(apiUrl)]])
const { getNextToolsOffset } = await import(offsetUrl)
const { toolsQueryOptions } = await import(await moduleUrl('hooks/useTools.ts', [
  ["'react'", JSON.stringify(import.meta.resolve('react'))],
  ["'../api/freeserp'", JSON.stringify(apiUrl)],
  ["'../utils/getNextToolsOffset'", JSON.stringify(offsetUrl)],
  ["'@tanstack/react-query'", JSON.stringify(import.meta.resolve('@tanstack/react-query'))],
]))
const dateUrl = await moduleUrl('utils/formatDate.ts')
const { formatDate } = await import(dateUrl)
const { mapFreeSerpSiteToTool, websiteUrl } = await import(await moduleUrl('utils/mapFreeSerpSiteToTool.ts', [["'./formatDate'", JSON.stringify(dateUrl)]]))
const originalFetch = globalThis.fetch
let requested
function respond(body, status = 200) {
  globalThis.fetch = async (url) => {
    requested = new URL(url)
    return new Response(JSON.stringify(body), { status })
  }
}
const success = (results = []) => ({ ok: true, index: 'sites', results })

test('defaults, optional filters, encoding and equivalent query parameters', async () => {
  respond(success())
  await api.getAiTools()
  assert.equal(requested.searchParams.get('index'), 'sites')
  assert.equal(requested.searchParams.get('ai_startups'), '1')
  assert.equal(requested.searchParams.get('size'), '12')
  assert.equal(requested.searchParams.get('from'), '0')
  assert.equal(requested.searchParams.get('sort'), 'went_live')
  assert.equal(requested.searchParams.get('order'), 'desc')
  assert.equal(requested.searchParams.has('q'), false)
  assert.equal(requested.searchParams.has('ai_categories'), false)
  assert.equal(requested.searchParams.has('dr_min'), false)
  await api.getAiTools({ query: ' code & AI ', category: 'Code & Dev Tools', minDr: 60, sort: 'dr', from: 12 })
  assert.equal(requested.searchParams.get('q'), 'code & AI')
  assert.equal(requested.searchParams.get('ai_categories'), 'Code & Dev Tools')
  assert.equal(requested.searchParams.get('dr_min'), '60')
  assert.equal(requested.searchParams.get('sort'), 'dr')
  assert.equal(requested.searchParams.get('from'), '12')
  assert.deepEqual(api.normalizeToolParams({}), api.normalizeToolParams({ size: undefined, query: '  ', minDr: 0 }))
})

test('successful empty data is distinct from HTTP, API and malformed response errors', async () => {
  respond(success())
  assert.deepEqual((await api.getAiTools()).results, [])
  for (const body of [{ ok: false }, { ok: true, results: {} }, { ok: true, index: 'web', results: [] }, success([null, 1])]) {
    respond(body)
    await assert.rejects(api.getAiTools(), /Unable to load AI tools/)
  }
  respond({}, 502)
  await assert.rejects(api.getAiTools(), /Unable to load AI tools/)
  globalThis.fetch = async () => { throw new Error('private transport detail') }
  await assert.rejects(api.getAiTools(), (error) => error.message === 'Unable to load AI tools.' && error.cause.message === 'private transport detail')
})

test('missing and malformed optional fields render neutral fallbacks', async () => {
  respond(success([{ domain: 'example.ai', title: '', ai_categories: [null, 3, 'Code & Dev Tools', 'Code & Dev Tools'], dr: '72', went_live: 'invalid', first_seen: '2026-09-08' }, {}]))
  const { results, count, total } = await api.getAiTools()
  assert.equal(count, 2)
  assert.equal(total, null)
  const tool = mapFreeSerpSiteToTool(results[0], 0)
  assert.equal(tool.title, 'example.ai')
  assert.equal(tool.description, 'No description available.')
  assert.equal(tool.url, 'https://example.ai/')
  assert.equal(tool.domainRating, null)
  assert.equal(tool.discoveredAt, '2026-09-08')
  assert.deepEqual(tool.categories, ['Code & Dev Tools'])
  const missing = mapFreeSerpSiteToTool(results[1], 1)
  assert.equal(missing.title, 'Untitled AI tool')
  assert.equal(missing.url, null)
  assert.deepEqual(missing.categories, [])
  assert.equal(formatDate(null), null)
  assert.equal(formatDate(undefined), null)
  assert.equal(formatDate('invalid'), null)
  assert.equal(websiteUrl('javascript:alert(1)', 'example.ai'), 'https://example.ai/')
  assert.equal(websiteUrl('https://user:secret@example.ai'), null)
  assert.equal(websiteUrl(null, 'not a domain'), null)
})

test('stats preserve zero, omit missing metrics and reject malformed snapshots', async () => {
  respond({ ok: true, ai_startups: { total: 33_570, today: 0 } })
  assert.deepEqual(await api.getStats(), { total: 33_570, today: 0, generatedAt: null })
  respond({ ok: true, ai_startups: {} })
  assert.equal((await api.getStats()).today, null)
  respond({ ok: true })
  await assert.rejects(api.getStats(), /Unable to load statistics/)
})

test('pagination stops at totals, empty pages, short unknown-total pages and the API window', () => {
  const page = { ...success(), from: 0, count: 12, total: 25 }
  assert.equal(getNextToolsOffset(page), 12)
  assert.equal(getNextToolsOffset({ ...page, from: 12 }), 24)
  assert.equal(getNextToolsOffset({ ...page, from: 24, count: 1 }), undefined)
  assert.equal(getNextToolsOffset({ ...page, count: 0 }), undefined)
  assert.equal(getNextToolsOffset({ ...page, count: 3, total: null }), undefined)
  assert.equal(getNextToolsOffset({ ...page, total: null }), 12)
  assert.equal(getNextToolsOffset({ ...page, from: 9984, total: 20_000 }), undefined)
})

test('infinite query appends pages, retains them on next-page failure, retries and resets filters', async () => {
  const calls = []
  let failNextPage = true
  globalThis.fetch = async (url) => {
    const params = new URL(url).searchParams
    const from = Number(params.get('from'))
    calls.push({ from, query: params.get('q'), category: params.get('ai_categories'), dr: params.get('dr_min'), sort: params.get('sort') })
    assert.equal(params.get('size'), String(api.TOOLS_PAGE_SIZE))
    if (from === 12 && failNextPage) {
      failNextPage = false
      return new Response('{}', { status: 502 })
    }
    const count = Math.min(api.TOOLS_PAGE_SIZE, 25 - from)
    return new Response(JSON.stringify({ ...success(Array.from({ length: count }, (_, i) => ({ domain: `tool-${from + i}.ai` }))), from, count, total: 25 }))
  }
  const client = new QueryClient()
  const options = (params) => ({ ...toolsQueryOptions(params), retry: false })
  const observer = new InfiniteQueryObserver(client, options({}))
  const unsubscribe = observer.subscribe(() => {})
  try {
    await observer.refetch()
    assert.equal(observer.getCurrentResult().data.pages[0].results.length, 12)
    const pending = observer.fetchNextPage({ throwOnError: true })
    assert.equal(observer.getCurrentResult().isFetchingNextPage, true)
    assert.equal(observer.getCurrentResult().data.pages[0].results.length, 12)
    await assert.rejects(pending, /Unable to load AI tools/)
    assert.equal(observer.getCurrentResult().isFetchNextPageError, true)
    assert.equal(observer.getCurrentResult().data.pages.length, 1)
    await observer.fetchNextPage()
    assert.equal(observer.getCurrentResult().data.pages.flatMap(page => page.results).length, 24)
    await observer.fetchNextPage()
    assert.equal(observer.getCurrentResult().data.pages.flatMap(page => page.results).length, 25)
    assert.equal(observer.getCurrentResult().hasNextPage, false)
    assert.deepEqual(calls.map(call => call.from), [0, 12, 12, 24])
    for (const filters of [{ query: 'code' }, { category: 'Image Generation' }, { minDr: 60 }, { sort: 'dr' }, { sort: 'relevance' }]) {
      observer.setOptions(options(filters))
      await observer.refetch()
      assert.equal(calls.at(-1).from, 0)
      assert.equal(observer.getCurrentResult().data.pages.length, 1)
    }
  } finally {
    unsubscribe()
    client.clear()
  }
})

test('domain lookup normalizes encoded domains and rejects unrelated results and invalid inputs', async () => {
  assert.equal(normalizeDomain('%77ILEY.com'), 'wiley.com')
  assert.equal(normalizeDomain('EXAMPLE.AI.'), 'example.ai')
  assert.equal(normalizeDomain('bücher.de'), 'xn--bcher-kva.de')
  for (const domain of ['', 'localhost', 'https://example.ai', 'example.ai/path', 'user@example.ai', 'example.ai:443', '%ZZ', '-bad.ai', '127.0.0.1']) assert.equal(normalizeDomain(domain), null)
  respond(success([{ domain: 'wiley.com', title: 'Wiley', ai_source: 'nextjs' }]))
  const site = await api.getAiToolByDomain('%77ILEY.com')
  assert.equal(site.domain, 'wiley.com')
  assert.equal(site.ai_source, 'nextjs')
  assert.equal(requested.searchParams.get('q'), 'wiley.com')
  assert.equal(requested.searchParams.get('size'), '1')
  assert.equal(requested.searchParams.get('index'), 'sites')
  assert.equal(requested.searchParams.get('ai_startups'), '1')
  respond(success([{ domain: 'other.ai' }]))
  assert.equal(await api.getAiToolByDomain('missing.ai'), null)
  respond(success())
  assert.equal(await api.getAiToolByDomain('missing.ai'), null)
  globalThis.fetch = async () => { throw new Error('invalid domain must not request') }
  assert.equal(await api.getAiToolByDomain('https://bad.ai'), null)
  respond({}, 502)
  await assert.rejects(api.getAiToolByDomain('wiley.com'), /Unable to load AI tools/)
})

test.after(() => { globalThis.fetch = originalFetch })
