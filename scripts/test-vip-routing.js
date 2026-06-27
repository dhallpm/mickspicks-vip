import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'

const root = fileURLToPath(new URL('..', import.meta.url))
const index = await readFile(join(root, 'index.html'), 'utf8')
const cname = (await readFile(join(root, 'CNAME'), 'utf8')).trim()
const vercel = JSON.parse(await readFile(join(root, 'vercel.json'), 'utf8'))
const proxy = await readFile(join(root, 'api', 'todays-picks.js'), 'utf8')

assert.equal(cname, 'vip.mickspicks.us')
assert.match(index, /MICKS_VIP_VISIBLE_PAGE/)
assert.match(index, /VIP Vault/i)
assert.match(index, /VIP Results/)
assert.match(index, /id="vip-picks"/)
assert.match(index, /id="vip-results"/)
assert.match(index, /https:\/\/www\.mickspicks\.us\//)
assert.doesNotMatch(index, /vip\.mickspicks\.us\/#(?:home|free|odds|sports|props|longshots|results)/i)
assert.doesNotMatch(index, /mickspicks-vip\.vercel\.app|href=["'](?:\.\/|\/)?premium\.html|#undefined/i)
assert.match(proxy, /cf-access-jwt-assertion/)

for (const path of ['/vip', '/vip/', '/premium.html']) {
  const redirect = vercel.redirects.find(rule => rule.source === path)
  assert.equal(redirect?.destination, '/')
}

console.log('Standalone VIP routing tests passed')
