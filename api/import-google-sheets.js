const DEFAULT_SPREADSHEET_ID = '1wber196DbbsSXwcITRXWbIF-IZzOJGwkIKPMIWv0AC4'

const TABLES = {
  picks: { sheet: 'Master Picks' },
  masterPicks: { sheet: 'Master Picks' },
  master: { sheet: 'Master Picks' },
  propsLab: { sheet: 'Props Lab' },
  props: { sheet: 'Props Lab' },
  lottoParlays: { sheet: 'Lotto Parlays' },
  lotto: { sheet: 'Lotto Parlays' },
  longshots: { sheet: 'Longshots' }
}

const HEADERS = [
  'Date','Sport','League','Game','Pick','Bet Type','Odds','Sportsbook','Grade','Units','Best Number','No Bet Cutoff','Implied Probability','EV Edge','True Probability','Model Probability','Closing Number','Closing Odds','CLV%','CLV Result','Closing Line Value','Closing Line','Confidence','Status','Release Status','Access','Featured','Official Bet','Pick of the Day Eligible','Writeup','Market Notes','Injury Notes','Source Verification','Posted Time','Full Analysis','A Grade Gate Result','A Grade Evidence Count','Market Misprice Reason','Unresolved Conflict','A-Hunt Source Notes','Park/Weather Risk','Blow-Up Risk','Volatility Capped','Tags','Record Key','Player','Prop','Category','Correlation Group','Primary Edge Type','Secondary Edge Type','Source Influence Level','Micks Independent Confirmation','Result','Outcome','Profit/Loss','ROI','Settled At','Settlement Source','date','sport','league','pick','market','confidence','grade','status','access','source','notes','stars','units','Settlement Status','Settlement Notes','Short Take','Why This Play','Matchup Edge','Projection Edge','Key Metrics','Risk','Final Take'
]

function json(res, status, payload) {
  res.status(status).setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(payload))
}

function parseBody(req) {
  if (!req.body) return {}
  if (typeof req.body === 'string') return JSON.parse(req.body || '{}')
  return req.body
}

function normalizeRecords(payload) {
  if (Array.isArray(payload?.batches)) {
    return payload.batches.flatMap(batch => normalizeRecords({ ...batch, dryRun: payload.dryRun }))
  }
  const table = payload.table || 'picks'
  const records = Array.isArray(payload.records) ? payload.records : []
  return records.map(record => ({ table, record }))
}

function valueFor(record, header) {
  if (record[header] !== undefined) return record[header]
  const lower = header.toLowerCase()
  if (record[lower] !== undefined) return record[lower]
  const compact = header.toLowerCase().replace(/[^a-z0-9]/g, '')
  for (const [key, value] of Object.entries(record)) {
    if (key.toLowerCase().replace(/[^a-z0-9]/g, '') === compact) return value
  }
  return ''
}

function rowFromRecord(record) {
  return HEADERS.map(header => {
    const value = valueFor(record, header)
    if (value === null || value === undefined) return ''
    return typeof value === 'object' ? JSON.stringify(value) : String(value)
  })
}

function base64url(input) {
  return Buffer.from(input).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

async function getAccessToken() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || process.env.GOOGLE_CLIENT_EMAIL
  let key = process.env.GOOGLE_PRIVATE_KEY || process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
  if (!email || !key) {
    throw new Error('Missing Google service account env vars. Set GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY in Vercel, then share the Google Sheet with that service account email as Editor.')
  }
  key = key.replace(/\\n/g, '\n')
  const now = Math.floor(Date.now() / 1000)
  const header = { alg: 'RS256', typ: 'JWT' }
  const claim = {
    iss: email,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  }
  const unsigned = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(claim))}`
  const { createSign } = await import('crypto')
  const signer = createSign('RSA-SHA256')
  signer.update(unsigned)
  signer.end()
  const signature = signer.sign(key, 'base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
  const assertion = `${unsigned}.${signature}`

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion })
  })
  const tokenJson = await tokenRes.json()
  if (!tokenRes.ok) throw new Error(tokenJson.error_description || tokenJson.error || 'Google token request failed')
  return tokenJson.access_token
}

async function appendRows({ spreadsheetId, sheetName, rows, token }) {
  const range = encodeURIComponent(`'${sheetName}'!A:CC`)
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ values: rows })
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error?.message || 'Google Sheets append failed')
  return data
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      json(res, 200, {
        ok: true,
        message: 'POST { table:"picks", records:[...] } or { batches:[{table,records}] } to import into Google Sheets.',
        tables: Object.keys(TABLES),
        spreadsheetId: process.env.GOOGLE_SHEET_ID || DEFAULT_SPREADSHEET_ID
      })
      return
    }

    const body = parseBody(req)
    const dryRun = body.dryRun === true || /^(1|true|yes|y|dryrun|preview)$/i.test(String(body.dryRun || body.preview || ''))
    const items = normalizeRecords(body)
    if (!items.length) {
      json(res, 400, { ok: false, created: 0, error: 'JSON parsed, but no records were found. Expected records array.' })
      return
    }

    const grouped = new Map()
    for (const item of items) {
      const config = TABLES[item.table]
      if (!config) throw new Error(`Unknown table: ${item.table}`)
      const row = rowFromRecord(item.record)
      if (!grouped.has(config.sheet)) grouped.set(config.sheet, [])
      grouped.get(config.sheet).push(row)
    }

    if (dryRun) {
      json(res, 200, { ok: true, dryRun: true, created: 0, groups: Object.fromEntries([...grouped].map(([k, v]) => [k, v.length])) })
      return
    }

    const spreadsheetId = process.env.GOOGLE_SHEET_ID || DEFAULT_SPREADSHEET_ID
    const token = await getAccessToken()
    const results = []
    for (const [sheetName, rows] of grouped) {
      results.push({ sheetName, count: rows.length, result: await appendRows({ spreadsheetId, sheetName, rows, token }) })
    }
    json(res, 200, { ok: true, created: items.length, results })
  } catch (error) {
    json(res, 500, { ok: false, created: 0, error: error.message || String(error) })
  }
}
