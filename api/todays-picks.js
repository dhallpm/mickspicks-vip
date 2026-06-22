const DEFAULT_SPREADSHEET_ID = '1wber196DbbsSXwcITRXWbIF-IZzOJGwkIKPMIWv0AC4'
const GOOGLE_SHEETS = ['Master Picks', 'Props Lab', 'Lotto Parlays', 'Longshots']
const RANGE = 'A:CC'

function json(res, status, payload) {
  res.status(status).setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(payload))
}

function text(value) {
  return String(value ?? '').trim()
}

function base64url(input) {
  return Buffer.from(input).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

async function getGoogleAccessToken() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || process.env.GOOGLE_CLIENT_EMAIL
  let key = process.env.GOOGLE_PRIVATE_KEY || process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
  if (!email || !key) {
    throw new Error('Missing Google service account env vars. Set GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY in Vercel, then share the Google Sheet with that service account email.')
  }
  key = key.replace(/\\n/g, '\n')
  const now = Math.floor(Date.now() / 1000)
  const header = { alg: 'RS256', typ: 'JWT' }
  const claim = {
    iss: email,
    scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
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
  const tokenJson = await tokenRes.json().catch(() => ({}))
  if (!tokenRes.ok) throw new Error(tokenJson.error_description || tokenJson.error || 'Google token request failed')
  return tokenJson.access_token || ''
}

async function readSheetRows(spreadsheetId, sheetName, token) {
  const range = encodeURIComponent(`'${sheetName}'!${RANGE}`)
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?majorDimension=ROWS&valueRenderOption=FORMATTED_VALUE`
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data?.error?.message || `Unable to read ${sheetName}`)
  const values = Array.isArray(data.values) ? data.values : []
  if (values.length < 2) return []
  const headers = values[0].map(text)
  return values.slice(1).map((row, index) => {
    const fields = {}
    headers.forEach((header, columnIndex) => {
      if (!header) return
      const value = row[columnIndex]
      if (value === undefined || !text(value)) return
      if (fields[header] === undefined) fields[header] = value
      fields[`__col_${columnIndex}`] = value
    })
    fields.__sheetName = sheetName
    fields.__rowNumber = index + 2
    return fields
  })
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

function dateKey(value) {
  const raw = text(value)
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(0, 10)
  if (!raw) return ''
  const parsed = new Date(raw)
  if (Number.isNaN(parsed.getTime())) return raw.slice(0, 10)
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(parsed)
}

function todayKey() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date())
}

function parseUnits(value) {
  const n = Number(String(value ?? '').replace(/,/g, '').match(/[+-]?\d+(?:\.\d+)?/)?.[0])
  return Number.isFinite(n) ? n : 0
}

function isCompleted(fields) {
  const result = text(first(fields, ['Result', 'Outcome', 'Final Result', 'Pick Result', 'Graded Result'])).toLowerCase()
  return /^(win|won|w|loss|lost|l|push|void|cancelled|canceled|no action)$/.test(result)
}

function normalizedStatus(fields) {
  return text(first(fields, ['Status', 'Display Status', 'Pick Status', 'Release Status'])).toLowerCase()
}

function isActive(fields) {
  const status = normalizedStatus(fields)
  if (isCompleted(fields)) return false
  if (/archive|no release|watchlist|pass|cancelled|canceled|void|settled|result posted/.test(status)) return false
  const units = parseUnits(first(fields, ['Units', 'Units to Commit', 'Stake']) || firstCol(fields, [9, 71]))
  if (units <= 0) return false
  const pick = first(fields, ['Pick', 'Selection', 'Play', 'Prop']) || firstCol(fields, [4, 62])
  return Boolean(text(pick))
}

function classifySection(fields) {
  const sourceSheet = text(fields.__sheetName).toLowerCase()
  const haystack = [
    sourceSheet,
    first(fields, ['Sport']) || firstCol(fields, [1, 60]),
    first(fields, ['League']) || firstCol(fields, [2, 61]),
    first(fields, ['Game', 'Matchup', 'Event']) || firstCol(fields, [3]),
    first(fields, ['Pick', 'Selection', 'Play', 'Prop']) || firstCol(fields, [4, 62]),
    first(fields, ['Bet Type', 'Type', 'Market']) || firstCol(fields, [5, 63]),
    first(fields, ['Access', 'Tier', 'Access Tier']) || firstCol(fields, [25, 67]),
    first(fields, ['Category']) || firstCol(fields, [47, 67]),
    first(fields, ['Tags']) || firstCol(fields, [43])
  ].map(text).join(' ').toLowerCase()
  if (sourceSheet.includes('longshot') || sourceSheet.includes('lotto')) return 'longshots'
  if (/\b(parlay|lotto|sgp|longshot)\b/.test(haystack)) return 'longshots'
  if (sourceSheet.includes('props') || /\bprop\b/.test(haystack)) return 'props'
  return 'picks'
}

function normalizeGoogleRow(fields) {
  const section = classifySection(fields)
  const date = first(fields, ['Date', 'Game Date', 'Posted Time', 'Timestamp']) || firstCol(fields, [0, 58])
  const sport = first(fields, ['Sport']) || firstCol(fields, [1, 59])
  const league = first(fields, ['League']) || firstCol(fields, [2, 60])
  const game = first(fields, ['Game', 'Matchup', 'Event']) || firstCol(fields, [3, 75])
  const pick = first(fields, ['Pick', 'Selection', 'Play', 'Prop']) || firstCol(fields, [4, 62])
  const betType = first(fields, ['Bet Type', 'Type', 'Market', 'Prop Type']) || firstCol(fields, [5, 63, 76])
  const odds = first(fields, ['Odds', 'Posted Odds', 'American Odds']) || firstCol(fields, [6, 75])
  const sportsbook = first(fields, ['Sportsbook', 'Book']) || firstCol(fields, [7])
  const grade = first(fields, ['Grade', 'Card Grade']) || firstCol(fields, [8, 64])
  const units = first(fields, ['Units', 'Units to Commit', 'Stake']) || firstCol(fields, [9, 71])
  const access = first(fields, ['Access', 'Tier', 'Access Tier']) || firstCol(fields, [25, 67]) || (section === 'longshots' ? 'Lotto' : 'Free')
  const releaseStatus = first(fields, ['Release Status']) || firstCol(fields, [24]) || (section === 'longshots' ? 'Lotto Released' : 'Released')
  const originalTable = section === 'longshots' ? 'longshots' : section === 'props' ? 'propsLab' : 'picks'
  const recordKey = first(fields, ['Record Key']) || [date, league || sport, game, pick, betType, originalTable].map(value => text(value).toLowerCase().replace(/[^a-z0-9]+/g, '')).filter(Boolean).join('|')
  const writeup = first(fields, ['Writeup', 'Write Up', 'Public Writeup', 'Summary', 'Short Take']) || firstCol(fields, [29, 73])
  const fullAnalysis = first(fields, ['Full Analysis', 'Analysis']) || firstCol(fields, [34, 86])
  const risk = first(fields, ['Risk']) || firstCol(fields, [78])

  return {
    id: `gs-${fields.__sheetName}-${fields.__rowNumber}`,
    __source: 'Google Sheets Active Picks',
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
    Odds: odds,
    odds,
    Sportsbook: sportsbook,
    sportsbook,
    Grade: grade,
    grade,
    Category: first(fields, ['Category']) || firstCol(fields, [47, 67]) || (section === 'longshots' ? 'Lotto' : ''),
    category: first(fields, ['Category']) || firstCol(fields, [47, 67]) || (section === 'longshots' ? 'Lotto' : ''),
    Units: units,
    units,
    'Best Number': first(fields, ['Best Number', 'Line', 'Number']) || firstCol(fields, [10, 84]),
    bestNumber: first(fields, ['Best Number', 'Line', 'Number']) || firstCol(fields, [10, 84]),
    'No Bet Cutoff': first(fields, ['No Bet Cutoff']) || firstCol(fields, [11, 85]),
    noBetCutoff: first(fields, ['No Bet Cutoff']) || firstCol(fields, [11, 85]),
    Confidence: first(fields, ['Confidence']) || firstCol(fields, [22, 63]),
    confidence: first(fields, ['Confidence']) || firstCol(fields, [22, 63]),
    Status: first(fields, ['Status', 'Display Status', 'Pick Status']) || firstCol(fields, [23, 65]) || 'Pending',
    status: first(fields, ['Status', 'Display Status', 'Pick Status']) || firstCol(fields, [23, 65]) || 'Pending',
    releaseStatus,
    Access: access,
    access,
    Featured: first(fields, ['Featured', 'Featured?']) || firstCol(fields, [26]),
    featured: first(fields, ['Featured', 'Featured?']) || firstCol(fields, [26]),
    'Official Bet': first(fields, ['Official Bet']) || firstCol(fields, [27]) || 'Yes',
    officialBet: first(fields, ['Official Bet']) || firstCol(fields, [27]) || 'Yes',
    'Pick of the Day Eligible': first(fields, ['Pick of the Day Eligible']) || firstCol(fields, [28]) || 'No',
    pickOfTheDayEligible: first(fields, ['Pick of the Day Eligible']) || firstCol(fields, [28]) || 'No',
    Writeup: writeup,
    writeup,
    'Market Notes': first(fields, ['Market Notes']) || firstCol(fields, [30]),
    marketNotes: first(fields, ['Market Notes']) || firstCol(fields, [30]),
    'Injury Notes': first(fields, ['Injury Notes']) || firstCol(fields, [31]),
    injuryNotes: first(fields, ['Injury Notes']) || firstCol(fields, [31]),
    'Source Verification': first(fields, ['Source Verification', 'Source']) || firstCol(fields, [32, 68]),
    sourceVerification: first(fields, ['Source Verification', 'Source']) || firstCol(fields, [32, 68]),
    'Full Analysis': fullAnalysis,
    fullAnalysis,
    Risk: risk,
    risk,
    'Start Time': first(fields, ['Start Time', 'Game Time', 'Start', 'Posted Time', 'Timestamp']) || firstCol(fields, [33, 58]),
    startTime: first(fields, ['Start Time', 'Game Time', 'Start', 'Posted Time', 'Timestamp']) || firstCol(fields, [33, 58]),
    Result: '',
    Outcome: '',
    result: ''
  }
}

async function listGoogleSheetActiveRows({ date }) {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID || DEFAULT_SPREADSHEET_ID
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
    .filter(row => dateKey(first(row, ['Date', 'Game Date', 'Posted Time', 'Timestamp']) || firstCol(row, [0, 58])) === wantedDate)
    .filter(isActive)
    .map(normalizeGoogleRow)
  return { rows: active, errors, spreadsheetId, date: wantedDate }
}

function dedupeRows(rows = []) {
  const map = new Map()
  for (const row of rows) {
    const key = [row.recordKey, row.date, row.league, row.game, row.pick, row.betType, row.originalTable].map(value => text(value).toLowerCase().replace(/[^a-z0-9]+/g, '')).join('|')
    map.set(key, row)
  }
  return [...map.values()]
}

function isVip(row = {}) {
  const access = text(row.Access || row.access).toLowerCase()
  const releaseStatus = text(row.releaseStatus || row['Release Status']).toLowerCase()
  const grade = text(row.Grade || row.grade).toUpperCase()
  if (access === 'free' || releaseStatus === 'free released') return false
  const premium = access.includes('vip') || access.includes('premium') || releaseStatus === 'vip released'
  return premium && (grade === 'A' || grade === 'A+')
}

function isFeatured(row = {}) {
  return /^(yes|true|1|y|featured)$/i.test(text(row.Featured || row.featured))
}

function applySectionFilter(rows, section) {
  const requested = text(section).toLowerCase()
  if (!requested) return rows
  if (requested === 'longshots' || requested === 'lotto' || requested === 'parlays') {
    return rows.filter(row => row.__section === 'longshots' || row.originalTable === 'longshots' || /parlay|lotto|sgp/i.test(`${row.Sport} ${row.Game} ${row.Pick} ${row.betType} ${row.category}`))
  }
  if (requested === 'props' || requested === 'propslab') {
    return rows.filter(row => row.__section === 'props' || row.originalTable === 'propsLab')
  }
  if (requested === 'vip') return rows.filter(isVip)
  if (requested === 'free') return rows.filter(row => !isVip(row))
  return rows
}

function buildPayload({ rows, errors, spreadsheetId, date, section }) {
  const allRows = dedupeRows(rows)
  const filteredRows = applySectionFilter(allRows, section)
  const vip = allRows.filter(isVip)
  const free = allRows.filter(row => !isVip(row) && row.__section !== 'longshots')
  const props = allRows.filter(row => row.__section === 'props' || row.originalTable === 'propsLab')
  const lotto = allRows.filter(row => row.__section === 'longshots' || row.originalTable === 'longshots')
  const longshots = lotto
  return {
    ok: true,
    success: true,
    source: 'Google Sheets',
    spreadsheetId,
    date,
    section: section || '',
    rows: filteredRows,
    results: filteredRows,
    allRows,
    free,
    vip,
    props,
    lotto,
    longshots,
    featured: allRows.filter(isFeatured),
    counts: {
      rows: filteredRows.length,
      allRows: allRows.length,
      free: free.length,
      vip: vip.length,
      props: props.length,
      lotto: lotto.length,
      longshots: longshots.length
    },
    errors
  }
}

export default async function handler(req, res) {
  try {
    const section = req.query?.section || ''
    const date = req.query?.date || ''
    const google = await listGoogleSheetActiveRows({ date })
    json(res, google.errors.length ? 207 : 200, buildPayload({ ...google, section }))
  } catch (error) {
    json(res, 500, { ok: false, success: false, source: 'Google Sheets', error: error.message || String(error) })
  }
}
