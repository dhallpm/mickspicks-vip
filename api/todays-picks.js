const DEFAULT_SPREADSHEET_ID = '15txBM8qsck7f0ZA_za7xYEykBxKpuq0no3x7yHcKNeE'
const GOOGLE_SHEETS = ['Active Picks', 'Website Feed', 'Props Lab', 'Lotto Parlays', 'Micks LongShots']
const RANGE = 'A:CC'

function json(res, status, payload) {
  res.status(status).setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
  res.end(JSON.stringify(payload))
}

function text(value) {
  return String(value ?? '').trim()
}

function compactKey(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '')
}

function first(fields, names) {
  const wanted = new Set(names.map(compactKey))
  for (const [key, value] of Object.entries(fields || {})) {
    if (key.startsWith('__')) continue
    if (wanted.has(compactKey(key)) && text(value)) return value
  }
  return ''
}

function firstCol(fields, indexes = []) {
  for (const index of indexes) {
    const value = fields?.[`__col_${index}`]
    if (text(value)) return value
  }
  return ''
}

function base64url(input) {
  return Buffer.from(input).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

async function getGoogleAccessToken() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || process.env.GOOGLE_CLIENT_EMAIL
  let key = process.env.GOOGLE_PRIVATE_KEY || process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
  if (!email || !key) {
    throw new Error('Missing Google service account env vars. Share the Micks Picks Data sheet with the service account email.')
  }
  key = key.replace(/\\n/g, '\n')
  const now = Math.floor(Date.now() / 1000)
  const unsigned = `${base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))}.${base64url(JSON.stringify({
    iss: email,
    scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  }))}`
  const { createSign } = await import('crypto')
  const signer = createSign('RSA-SHA256')
  signer.update(unsigned)
  signer.end()
  const signature = signer.sign(key, 'base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${unsigned}.${signature}` })
  })
  const tokenJson = await tokenRes.json().catch(() => ({}))
  if (!tokenRes.ok) throw new Error(tokenJson.error_description || tokenJson.error || 'Google token request failed')
  return tokenJson.access_token || ''
}

async function readSheetRows(spreadsheetId, sheetName, token) {
  const range = encodeURIComponent(`'${sheetName}'!${RANGE}`)
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?majorDimension=ROWS&valueRenderOption=FORMATTED_VALUE`
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data?.error?.message || `Unable to read ${sheetName}`)
  const values = Array.isArray(data.values) ? data.values : []
  if (values.length < 2) return []
  const headers = values[0].map(text)
  return values.slice(1).map((row, index) => {
    const fields = {}
    headers.forEach((header, columnIndex) => {
      const value = row[columnIndex]
      if (header && value !== undefined && text(value)) fields[header] = value
      if (value !== undefined && text(value)) fields[`__col_${columnIndex}`] = value
    })
    fields.__sheetName = sheetName
    fields.__rowNumber = index + 2
    return fields
  })
}

function todayKey() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())
}

function dateKey(value) {
  const raw = text(value)
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(0, 10)
  if (!raw) return ''
  const parsed = new Date(raw)
  if (Number.isNaN(parsed.getTime())) return raw.slice(0, 10)
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).format(parsed)
}

function parseUnits(value) {
  const n = Number(String(value ?? '').replace(/,/g, '').match(/[+-]?\d+(?:\.\d+)?/)?.[0])
  return Number.isFinite(n) ? n : 0
}

function clean(value) {
  return text(value).toLowerCase().replace(/[-_]+/g, ' ').replace(/\s+/g, ' ')
}

function normalizedStatus(fields) {
  return clean(`${first(fields, ['Status', 'Display Status', 'Pick Status'])} ${first(fields, ['Release Status'])}`)
}

function isCompleted(fields) {
  const result = clean(first(fields, ['Result', 'Outcome', 'Final Result', 'Pick Result', 'Graded Result']))
  return /^(win|won|w|loss|lost|l|push|void|cancelled|canceled|no action)$/.test(result)
}

function isActive(fields) {
  const status = normalizedStatus(fields)
  if (isCompleted(fields)) return false
  if (/archive|no release|watchlist|pass|cancelled|canceled|void|settled|result posted/.test(status)) return false
  const units = parseUnits(first(fields, ['Units', 'Units to Commit', 'Stake']) || firstCol(fields, [9, 11, 71]))
  const pick = first(fields, ['Pick', 'Selection', 'Play', 'Prop']) || firstCol(fields, [4, 5, 62])
  return units > 0 && Boolean(text(pick))
}

function classifySection(fields) {
  const source = clean(fields.__sheetName)
  const category = clean(first(fields, ['Category']))
  const betType = clean(first(fields, ['Bet Type', 'Type', 'Market', 'Prop Type']))
  const pick = clean(first(fields, ['Pick', 'Selection', 'Play', 'Prop']))
  if (source.includes('longshot') || source.includes('lotto parlay') || category.includes('lotto') || category.includes('longshot')) return 'longshots'
  if (source.includes('props') || category.includes('props') || betType.includes('prop') || pick.includes(' prop')) return 'props'
  return 'picks'
}

function normalizeGoogleRow(fields) {
  const section = classifySection(fields)
  const date = first(fields, ['Date', 'Game Date', 'Posted Time', 'Timestamp']) || firstCol(fields, [0, 1, 58])
  const sport = first(fields, ['Sport']) || firstCol(fields, [1, 2, 59])
  const league = first(fields, ['League']) || firstCol(fields, [2, 3, 60])
  const game = first(fields, ['Game', 'Matchup', 'Event']) || firstCol(fields, [3, 4, 75])
  const pick = first(fields, ['Pick', 'Selection', 'Play', 'Prop']) || firstCol(fields, [4, 5, 62])
  const betType = first(fields, ['Bet Type', 'Type', 'Market', 'Prop Type']) || firstCol(fields, [5, 6, 63, 76])
  const access = first(fields, ['Access', 'Tier', 'Access Tier']) || firstCol(fields, [8, 11, 25, 67]) || (section === 'longshots' ? 'Lotto' : 'Free')
  const releaseStatus = first(fields, ['Release Status']) || firstCol(fields, [13, 14, 24]) || 'Released'
  const recordKey = first(fields, ['Record Key']) || [date, league || sport, game, pick, betType, fields.__sheetName].map(v => clean(v).replace(/[^a-z0-9]+/g, '')).filter(Boolean).join('|')
  const writeup = first(fields, ['Writeup', 'Write Up', 'Public Writeup', 'Summary', 'Short Take']) || firstCol(fields, [10, 22, 29, 73])
  const fullAnalysis = first(fields, ['Full Analysis', 'Analysis']) || firstCol(fields, [30, 34, 86])
  const originalTable = section === 'longshots' ? 'longshots' : section === 'props' ? 'propsLab' : 'picks'
  return {
    id: `gs-${fields.__sheetName}-${fields.__rowNumber}`,
    __source: 'Micks Picks Data',
    __table: fields.__sheetName,
    __section: section,
    originalTable,
    recordKey,
    Date: date,
    date,
    Sport: sport,
    sport,
    League: league || sport,
    league: league || sport,
    Game: game,
    game,
    Pick: pick,
    pick,
    'Bet Type': betType,
    betType,
    Odds: first(fields, ['Odds', 'Posted Odds', 'American Odds']) || firstCol(fields, [6, 9, 75]),
    odds: first(fields, ['Odds', 'Posted Odds', 'American Odds']) || firstCol(fields, [6, 9, 75]),
    Sportsbook: first(fields, ['Sportsbook', 'Book']) || firstCol(fields, [7, 10]),
    sportsbook: first(fields, ['Sportsbook', 'Book']) || firstCol(fields, [7, 10]),
    Grade: first(fields, ['Grade', 'Card Grade']) || firstCol(fields, [8, 60, 64]),
    grade: first(fields, ['Grade', 'Card Grade']) || firstCol(fields, [8, 60, 64]),
    Category: first(fields, ['Category']) || '',
    category: first(fields, ['Category']) || '',
    Units: first(fields, ['Units', 'Units to Commit', 'Stake']) || firstCol(fields, [9, 11, 71]),
    units: first(fields, ['Units', 'Units to Commit', 'Stake']) || firstCol(fields, [9, 11, 71]),
    'Best Number': first(fields, ['Best Number', 'Line', 'Number']) || firstCol(fields, [10, 44, 68, 84]),
    bestNumber: first(fields, ['Best Number', 'Line', 'Number']) || firstCol(fields, [10, 44, 68, 84]),
    'No Bet Cutoff': first(fields, ['No Bet Cutoff']) || firstCol(fields, [45, 85]),
    noBetCutoff: first(fields, ['No Bet Cutoff']) || firstCol(fields, [45, 85]),
    Confidence: first(fields, ['Confidence']) || firstCol(fields, [22, 61, 63]),
    confidence: first(fields, ['Confidence']) || firstCol(fields, [22, 61, 63]),
    Status: first(fields, ['Status', 'Display Status', 'Pick Status']) || firstCol(fields, [12, 14, 23, 65]) || 'Active',
    status: first(fields, ['Status', 'Display Status', 'Pick Status']) || firstCol(fields, [12, 14, 23, 65]) || 'Active',
    'Release Status': releaseStatus,
    releaseStatus,
    Access: access,
    access,
    Featured: first(fields, ['Featured', 'Featured?']) || firstCol(fields, [12, 26, 66]),
    featured: first(fields, ['Featured', 'Featured?']) || firstCol(fields, [12, 26, 66]),
    Writeup: writeup,
    writeup,
    'Market Notes': first(fields, ['Market Notes']) || firstCol(fields, [18, 20, 30]),
    marketNotes: first(fields, ['Market Notes']) || firstCol(fields, [18, 20, 30]),
    'Injury Notes': first(fields, ['Injury Notes']) || firstCol(fields, [21, 31]),
    injuryNotes: first(fields, ['Injury Notes']) || firstCol(fields, [21, 31]),
    'Source Verification': first(fields, ['Source Verification', 'Source']) || firstCol(fields, [31, 32, 68]),
    sourceVerification: first(fields, ['Source Verification', 'Source']) || firstCol(fields, [31, 32, 68]),
    'Full Analysis': fullAnalysis,
    fullAnalysis,
    Risk: first(fields, ['Risk']) || firstCol(fields, [28, 78]),
    risk: first(fields, ['Risk']) || firstCol(fields, [28, 78]),
    Result: first(fields, ['Result', 'Outcome']) || '',
    Outcome: first(fields, ['Result', 'Outcome']) || '',
    result: first(fields, ['Result', 'Outcome']) || ''
  }
}

async function listGoogleSheetActiveRows({ date }) {
  const spreadsheetId = process.env.MICKS_GOOGLE_SHEET_ID || DEFAULT_SPREADSHEET_ID
  const token = await getGoogleAccessToken()
  const rows = []
  const errors = []
  for (const sheetName of GOOGLE_SHEETS) {
    try {
      rows.push(...await readSheetRows(spreadsheetId, sheetName, token))
    } catch (error) {
      errors.push(`${sheetName}: ${error.message || String(error)}`)
    }
  }
  const wantedDate = date || todayKey()
  const active = rows
    .filter(row => dateKey(first(row, ['Date', 'Game Date', 'Posted Time', 'Timestamp']) || firstCol(row, [0, 1, 58])) === wantedDate)
    .filter(isActive)
    .map(normalizeGoogleRow)
  return { rows: active, errors, spreadsheetId, date: wantedDate }
}

function dedupeRows(rows = []) {
  const map = new Map()
  for (const row of rows) {
    const key = [row.date, row.league, row.game, row.pick, row.betType, row.Access, row.originalTable].map(v => clean(v).replace(/[^a-z0-9]+/g, '')).join('|')
    map.set(key, row)
  }
  return [...map.values()]
}

function isVip(row = {}) {
  const access = clean(row.Access || row.access)
  const releaseStatus = clean(row.releaseStatus || row['Release Status'])
  return access.includes('vip') || releaseStatus.includes('vip')
}

function isFeatured(row = {}) {
  return /^(yes|true|1|y|featured)$/i.test(text(row.Featured || row.featured)) || isVip(row)
}

function applySectionFilter(rows, section) {
  const requested = clean(section)
  if (!requested) return rows
  if (requested === 'vip') return rows.filter(isVip)
  if (requested === 'free') return rows.filter(row => !isVip(row) && row.__section === 'picks')
  if (requested === 'props' || requested === 'propslab') return rows.filter(row => row.__section === 'props')
  if (requested === 'longshots' || requested === 'lotto' || requested === 'parlays') return rows.filter(row => row.__section === 'longshots')
  return rows
}

function buildPayload({ rows, errors, spreadsheetId, date, section }) {
  const allRows = dedupeRows(rows)
  const vip = allRows.filter(isVip)
  const free = allRows.filter(row => !isVip(row) && row.__section === 'picks')
  const props = allRows.filter(row => row.__section === 'props')
  const longshots = allRows.filter(row => row.__section === 'longshots')
  const filteredRows = applySectionFilter(allRows, section)
  return {
    ok: true,
    success: true,
    source: 'Micks Picks Data',
    spreadsheetId,
    date,
    section: section || '',
    rows: filteredRows,
    results: filteredRows,
    allRows,
    free,
    vip,
    props,
    lotto: longshots,
    longshots,
    featured: allRows.filter(isFeatured),
    counts: { rows: filteredRows.length, allRows: allRows.length, free: free.length, vip: vip.length, props: props.length, lotto: longshots.length, longshots: longshots.length },
    errors
  }
}

module.exports = async function handler(req, res) {
  try {
    const { rows, errors, spreadsheetId, date } = await listGoogleSheetActiveRows({ date: text(req.query?.date) })
    return json(res, 200, buildPayload({ rows, errors, spreadsheetId, date, section: text(req.query?.section) }))
  } catch (error) {
    return json(res, 500, { ok: false, success: false, error: error.message || String(error), rows: [], allRows: [], vip: [], free: [], props: [], lotto: [], longshots: [], featured: [] })
  }
}
