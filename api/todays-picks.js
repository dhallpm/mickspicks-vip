import {
  listActivePicks,
  parseRequestBody
} from '../lib/airtableResultsWorkflow.js'

const DEFAULT_SPREADSHEET_ID = '1wber196DbbsSXwcITRXWbIF-IZzOJGwkIKPMIWv0AC4'
const GOOGLE_SHEETS = ['Master Picks', 'Lotto Parlays', 'Longshots']
const RANGE = 'A:CC'

function text(value) {
  return String(value ?? '').trim()
}

function base64url(input) {
  return Buffer.from(input).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

async function getGoogleAccessToken() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || process.env.GOOGLE_CLIENT_EMAIL
  let key = process.env.GOOGLE_PRIVATE_KEY || process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
  if (!email || !key) return ''
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
  if (!tokenRes.ok) return ''
  return tokenJson.access_token || ''
}

async function readSheetRows(spreadsheetId, sheetName, token) {
  const range = encodeURIComponent(`'${sheetName}'!${RANGE}`)
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?majorDimension=ROWS&valueRenderOption=FORMATTED_VALUE`
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) return []
  const values = Array.isArray(data.values) ? data.values : []
  if (values.length < 2) return []
  const headers = values[0].map(text)
  return values.slice(1).map((row, index) => {
    const fields = {}
    headers.forEach((header, columnIndex) => {
      if (!header) return
      const value = row[columnIndex]
      if (value !== undefined && text(value)) fields[header] = value
    })
    fields.__sheetName = sheetName
    fields.__rowNumber = index + 2
    return fields
  })
}

function first(fields, names) {
  const compact = key => String(key || '').toLowerCase().replace(/[^a-z0-9]/g, '')
  const wanted = new Set(names.map(compact))
  for (const [key, value] of Object.entries(fields || {})) {
    if (wanted.has(compact(key)) && text(value)) return value
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

function isActive(fields) {
  const status = text(first(fields, ['Status', 'Display Status', 'Pick Status', 'Release Status'])).toLowerCase()
  if (isCompleted(fields)) return false
  if (/archive|no release|watchlist|pass|cancelled|canceled|void|settled|result posted/.test(status)) return false
  if (parseUnits(first(fields, ['Units', 'Units to Commit', 'Stake'])) <= 0) return false
  return true
}

function classifySection(fields) {
  const sourceSheet = text(fields.__sheetName).toLowerCase()
  const haystack = [
    sourceSheet,
    first(fields, ['Sport']),
    first(fields, ['League']),
    first(fields, ['Game', 'Matchup', 'Event']),
    first(fields, ['Pick', 'Selection', 'Play', 'Prop']),
    first(fields, ['Bet Type', 'Type', 'Market']),
    first(fields, ['Access', 'Tier', 'Access Tier']),
    first(fields, ['Category']),
    first(fields, ['Tags'])
  ].map(text).join(' ').toLowerCase()
  if (sourceSheet.includes('longshot') || /\blongshot\b/.test(haystack)) return 'longshots'
  if (sourceSheet.includes('lotto') || /\b(parlay|lotto|sgp)\b/.test(haystack)) return 'longshots'
  if (sourceSheet.includes('props') || /\bprop\b/.test(haystack)) return 'props'
  return 'picks'
}

function normalizeGoogleRow(fields) {
  const section = classifySection(fields)
  const access = first(fields, ['Access', 'Tier', 'Access Tier']) || (section === 'longshots' ? 'Lotto' : 'Free')
  const date = first(fields, ['Date', 'Game Date', 'Posted Time', 'Timestamp'])
  const game = first(fields, ['Game', 'Matchup', 'Event'])
  const pick = first(fields, ['Pick', 'Selection', 'Play', 'Prop'])
  const betType = first(fields, ['Bet Type', 'Type', 'Market', 'Prop Type'])
  const grade = first(fields, ['Grade', 'Card Grade'])
  const originalTable = section === 'longshots' ? 'longshots' : section === 'props' ? 'propsLab' : 'picks'
  const recordKey = first(fields, ['Record Key']) || [date, first(fields, ['League', 'Sport']), game, pick, betType, originalTable].map(value => text(value).toLowerCase().replace(/[^a-z0-9]+/g, '')).filter(Boolean).join('|')
  return {
    id: `gs-${fields.__sheetName}-${fields.__rowNumber}`,
    airtableRecordId: '',
    __source: 'Google Sheets Active Picks',
    __table: fields.__sheetName,
    __section: section,
    originalTable,
    recordKey,
    Date: date,
    date,
    Sport: first(fields, ['Sport']),
    sport: first(fields, ['Sport']),
    League: first(fields, ['League', 'Sport']),
    league: first(fields, ['League', 'Sport']),
    Game: game,
    game,
    Pick: pick,
    pick,
    'Bet Type': betType,
    betType,
    Odds: first(fields, ['Odds', 'Posted Odds', 'American Odds']),
    odds: first(fields, ['Odds', 'Posted Odds', 'American Odds']),
    Sportsbook: first(fields, ['Sportsbook', 'Book']),
    sportsbook: first(fields, ['Sportsbook', 'Book']),
    Grade: grade,
    grade,
    Category: first(fields, ['Category', 'Bet Type', 'Type', 'Market']) || (section === 'longshots' ? 'Lotto' : ''),
    category: first(fields, ['Category', 'Bet Type', 'Type', 'Market']) || (section === 'longshots' ? 'Lotto' : ''),
    Units: first(fields, ['Units', 'Units to Commit', 'Stake']),
    units: first(fields, ['Units', 'Units to Commit', 'Stake']),
    'Best Number': first(fields, ['Best Number', 'Line', 'Number']),
    bestNumber: first(fields, ['Best Number', 'Line', 'Number']),
    'No Bet Cutoff': first(fields, ['No Bet Cutoff']),
    noBetCutoff: first(fields, ['No Bet Cutoff']),
    Confidence: first(fields, ['Confidence']),
    confidence: first(fields, ['Confidence']),
    Status: first(fields, ['Status', 'Display Status', 'Pick Status']) || 'Pending',
    status: first(fields, ['Status', 'Display Status', 'Pick Status']) || 'Pending',
    releaseStatus: first(fields, ['Release Status']) || (section === 'longshots' ? 'Lotto Released' : 'Released'),
    Access: access,
    access,
    Featured: first(fields, ['Featured', 'Featured?']),
    featured: first(fields, ['Featured', 'Featured?']),
    'Official Bet': first(fields, ['Official Bet']) || 'Yes',
    officialBet: first(fields, ['Official Bet']) || 'Yes',
    'Pick of the Day Eligible': first(fields, ['Pick of the Day Eligible']) || 'No',
    pickOfTheDayEligible: first(fields, ['Pick of the Day Eligible']) || 'No',
    Writeup: first(fields, ['Writeup', 'Write Up', 'Public Writeup', 'Summary', 'Short Take']),
    writeup: first(fields, ['Writeup', 'Write Up', 'Public Writeup', 'Summary', 'Short Take']),
    'Market Notes': first(fields, ['Market Notes']),
    marketNotes: first(fields, ['Market Notes']),
    'Injury Notes': first(fields, ['Injury Notes']),
    injuryNotes: first(fields, ['Injury Notes']),
    'Source Verification': first(fields, ['Source Verification', 'Source']),
    sourceVerification: first(fields, ['Source Verification', 'Source']),
    'Full Analysis': first(fields, ['Full Analysis', 'Analysis']),
    fullAnalysis: first(fields, ['Full Analysis', 'Analysis']),
    Risk: first(fields, ['Risk']),
    risk: first(fields, ['Risk']),
    'Start Time': first(fields, ['Start Time', 'Game Time', 'Start', 'Posted Time', 'Timestamp']),
    startTime: first(fields, ['Start Time', 'Game Time', 'Start', 'Posted Time', 'Timestamp']),
    Result: '',
    Outcome: '',
    result: ''
  }
}

async function listGoogleSheetActiveRows() {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID || DEFAULT_SPREADSHEET_ID
  const token = await getGoogleAccessToken()
  if (!token) return { rows: [], errors: ['Google Sheets active feed skipped: missing service account env vars.'] }
  const rows = []
  const errors = []
  for (const sheetName of GOOGLE_SHEETS) {
    try {
      rows.push(...await readSheetRows(spreadsheetId, sheetName, token))
    } catch (error) {
      errors.push(`${sheetName}: ${error.message || String(error)}`)
    }
  }
  const today = todayKey()
  const active = rows
    .filter(row => dateKey(first(row, ['Date', 'Game Date', 'Posted Time', 'Timestamp'])) === today)
    .filter(isActive)
    .map(normalizeGoogleRow)
  return { rows: active, errors }
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
  return (premium || grade === 'A' || grade === 'A+') && (grade === 'A' || grade === 'A+')
}

function isFeatured(row = {}) {
  return /^(yes|true|1|y|featured)$/i.test(text(row.Featured || row.featured))
}

function reshape(result, googleRows = [], googleErrors = []) {
  const rows = dedupeRows([...(result.rows || result.results || []), ...googleRows])
  const vip = rows.filter(isVip)
  const free = rows.filter(row => !isVip(row))
  const props = rows.filter(row => row.__section === 'props' || row.originalTable === 'propsLab')
  const lotto = rows.filter(row => row.__section === 'lotto' || row.originalTable === 'lottoParlays' || row.__section === 'longshots')
  const longshots = rows.filter(row => row.__section === 'longshots' || row.originalTable === 'longshots')
  return {
    ...result,
    rows,
    results: rows,
    free,
    vip,
    props,
    lotto,
    longshots,
    featured: rows.filter(isFeatured),
    counts: { rows: rows.length, free: free.length, vip: vip.length },
    errors: [...(result.errors || []), ...googleErrors]
  }
}

export default async function handler(req, res) {
  try {
    const body = req.method === 'POST' ? parseRequestBody(req) : {}
    const result = await listActivePicks({
      access: req.query?.access || body.access || '',
      section: req.query?.section || body.section || '',
      watchlist: req.query?.watchlist || body.watchlist || false
    })
    const google = await listGoogleSheetActiveRows()
    res.status(result.errors?.length ? 207 : 200).json(reshape(result, google.rows, google.errors))
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, error: error.message || String(error) })
  }
}
