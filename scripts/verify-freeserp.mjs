import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import ts from 'typescript'

// Exercise the real API boundary with controlled external responses, without
// a browser, network dependency, or additional test package.
async function moduleUrl(path, replacements = []) {
  let source = await readFile(new URL(`../src/${path}`, import.meta.url), 'utf8')
  for (const [from, to] of replacements) source = source.replaceAll(from, to)
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2023 } })
  return `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`
}
const api = await import(await moduleUrl('api/freeserp.ts', [['import.meta.env', '({ DEV: false })']]))
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

test.after(() => { globalThis.fetch = originalFetch })
