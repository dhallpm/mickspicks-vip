const AIRTABLE_API_ROOT = 'https://api.airtable.com/v0'
const DEFAULT_BASE_ID = 'appsVhMax3qWQ1odj'

export const ARCHIVE_FIELD_NAMES = [
  'Date',
  'Sport',
  'League',
  'Game',
  'Pick',
  'Bet Type',
  'Odds',
  'Sportsbook',
  'Grade',
  'Units',
  'Best Number',
  'No Bet Cutoff',
  'Closing Number',
  'Closing Odds',
  'CLV%',
  'CLV Result',
  'Closing Line Value',
  'Result',
  'Profit/Loss',
  'ROI',
  'Access',
  'Featured',
  'Writeup',
  'Market Notes',
  'Injury Notes',
  'Source Verification',
  'Full Analysis',
  'Official Bet',
  'Correlation Group',
  'Primary Edge Type',
  'Secondary Edge Type',
  'Source Influence Level',
  'Micks Independent Confirmation',
  'Failure Reason',
  'Was Correlated Stack',
  'Closing Price Check',
  'Lineup Weather Confirmed',
  'Pick of the Day Eligible',
  'ROI Bucket',
  'Original Table',
  'Original Record ID',
  'Record Key',
  'Archived At'
]

const TABLE_ALIASES = {
  picks: 'picks',
  pick: 'picks',
  master: 'picks',
  masterPicks: 'picks',
  master_picks: 'picks',
  props: 'propsLab',
  propsLab: 'propsLab',
  props_lab: 'propsLab',
  lotto: 'lottoParlays',
  parlays: 'lottoParlays',
  lottoParlays: 'lottoParlays',
  lotto_parlays: 'lottoParlays',
  longshot: 'longshots',
  longshots: 'longshots',
  results: 'resultsArchive',
  resultsArchive: 'resultsArchive',
  results_archive: 'resultsArchive',
  archive: 'resultsArchive'
}

export const ACTIVE_TABLES = {
  picks: {
    alias: 'picks',
    label: 'Picks',
    section: 'picks',
    env: ['AIRTABLE_PICKS_TABLE_ID', 'AIRTABLE_MASTER_PICKS_TABLE_ID', 'AIRTABLE_MASTER_PICKS_TABLE'],
    fallback: 'Master Picks',
    fallbacks: ['Master Picks', 'Picks', 'picks']
  },
  propsLab: {
    alias: 'propsLab',
    label: 'Props Lab',
    section: 'props',
    env: ['AIRTABLE_PROPS_LAB_TABLE_ID', 'AIRTABLE_PROPS_TABLE_ID', 'AIRTABLE_PROPS_TABLE'],
    fallback: 'Props Lab',
    fallbacks: ['Props Lab', 'propsLab']
  },
  lottoParlays: {
    alias: 'lottoParlays',
    label: 'Lotto Parlays',
    section: 'lotto',
    env: ['AIRTABLE_LOTTO_PARLAYS_TABLE_ID', 'AIRTABLE_LOTTO_TABLE_ID', 'AIRTABLE_LOTTO_TABLE'],
    fallback: 'Lotto Parlays',
    fallbacks: ['Lotto Parlays', 'lottoParlays']
  },
  longshots: {
    alias: 'longshots',
    label: 'Longshots',
    section: 'longshots',
    env: ['AIRTABLE_LONGSHOTS_TABLE_ID', 'AIRTABLE_LONGSHOTS_TABLE'],
    fallback: 'Longshots',
    fallbacks: ['Longshots', 'longshots']
  }
}

export const RESULTS_ARCHIVE_TABLE = {
  alias: 'resultsArchive',
  label: 'Results Archive',
  section: 'results',
  env: ['AIRTABLE_RESULTS_ARCHIVE_TABLE_ID', 'AIRTABLE_RESULTS_ARCHIVE_TABLE', 'AIRTABLE_RESULTS_TABLE_ID', 'AIRTABLE_RESULTS_TABLE'],
  fallback: 'Results Archive'
}

const IMPORT_BLOCKED_FIELDS = new Set([
  'Result',
  'Outcome',
  'Final Result',
  'Pick Result',
  'Graded Result',
  'Profit/Loss',
  'P/L',
  'PL',
  'Profit Loss',
  'Profit-Loss',
  'Profit/Loss Units',
  'ROI',
  'Settled At',
  'Archived At',
  'Original Table',
  'Original Record ID',
  'Record ID',
  'Airtable Record ID',
  'id',
  'airtableRecordId',
  '__table'
])

const IMPORT_ALLOWED_FIELDS = new Set([
  'Date',
  'Sport',
  'League',
  'Game',
  'Matchup',
  'Event',
  'Team',
  'Opponent',
  'Player',
  'Athlete',
  'Player Name',
  'Pick',
  'Selection',
  'Play',
  'Prop',
  'Prop Type',
  'Bet Type',
  'Type',
  'Market',
  'Odds',
  'Sportsbook',
  'Book',
  'Grade',
  'Card Grade',
  'Units',
  'Units to Commit',
  'Stake',
  'Best Number',
  'No Bet Cutoff',
  'Closing Number',
  'Closing Odds',
  'Confidence',
  'Category',
  'Implied Probability',
  'EV Edge',
  'True Probability',
  'Model Probability',
  'Projection Gap',
  'Line Movement',
  'Starting Pitcher',
  'Pitcher Confirmed',
  'Lineup Confirmed',
  'Weather',
  'Wind',
  'Park',
  'Bullpen Usage',
  'Variance Check',
  'Status',
  'Display Status',
  'Pick Status',
  'Access',
  'Tier',
  'Access Tier',
  'Featured',
  'Featured?',
  'Pick of the Day Eligible',
  'Official Bet',
  'Correlation Group',
  'Primary Edge Type',
  'Secondary Edge Type',
  'Source Influence Level',
  'Micks Independent Confirmation',
  'Failure Reason',
  'Was Correlated Stack',
  'Closing Price Check',
  'Lineup Weather Confirmed',
  'ROI Bucket',
  'Parlay Group',
  'Longshot',
  'Release Status',
  'Release Notes',
  'Writeup',
  'Write Up',
  'Market Notes',
  'Injury Notes',
  'Source Verification',
  'Posted Time',
  'Start Time',
  'Game Time',
  'Start',
  'Full Analysis',
  'Record Key'
])

const OFFICIAL_SECTION_LIMITS = {
  picks: 4,
  props: 3,
  lotto: 1,
  longshots: 3
}

const LONGSHOT_UNIT_LIMIT = 0.15

function text(value) {
  return String(value ?? '').trim()
}

function keyToken(value = '') {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '')
}

function first(fields = {}, names = []) {
  const wanted = new Set(names.map(keyToken))
  for (const [key, value] of Object.entries(fields || {})) {
    if (wanted.has(keyToken(key)) && text(value)) return value
  }
  return ''
}

function hasOwnValue(fields = {}, names = []) {
  const wanted = new Set(names.map(keyToken))
  return Object.entries(fields || {}).some(([key, value]) => wanted.has(keyToken(key)) && text(value))
}

function compact(value = '') {
  return text(value).toLowerCase().replace(/[^a-z0-9]+/g, '')
}

function cleanValue(value) {
  if (typeof value === 'string') {
    return value
      .replace(/\ufeff/g, '')
      .replace(/[\u200B-\u200D\uFEFF]/g, '')
      .replace(/\u00a0/g, ' ')
      .trim()
  }
  return value
}

export function canonicalTable(alias = '') {
  const raw = text(alias)
  const normalized = raw.replace(/[\s-]+/g, '_')
  const compacted = keyToken(raw)
  if (compacted === 'picks' || compacted === 'master' || compacted === 'masterpicks') return 'picks'
  if (compacted === 'props' || compacted === 'propslab') return 'propsLab'
  if (compacted === 'lotto' || compacted === 'parlays' || compacted === 'lottoparlays') return 'lottoParlays'
  if (compacted === 'longshot' || compacted === 'longshots') return 'longshots'
  if (compacted === 'results' || compacted === 'resultsarchive' || compacted === 'archive') return 'resultsArchive'
  return TABLE_ALIASES[raw] || TABLE_ALIASES[normalized] || raw
}

export function tableConfig(alias = '') {
  const canonical = canonicalTable(alias)
  if (canonical === 'resultsArchive') return RESULTS_ARCHIVE_TABLE
  return ACTIVE_TABLES[canonical] || null
}

export function activeTableConfigs() {
  return Object.values(ACTIVE_TABLES)
}

export function baseId() {
  return text(process.env.AIRTABLE_VERIFIED_BASE_ID || process.env.AIRTABLE_BASE_ID || DEFAULT_BASE_ID)
}

export function tableName(config) {
  for (const name of config.env || []) {
    if (text(process.env[name])) return text(process.env[name])
  }
  return config.fallback
}

function tableCandidates(config) {
  const candidates = []
  for (const name of config.env || []) {
    if (text(process.env[name])) candidates.push(text(process.env[name]))
  }
  candidates.push(...(config.fallbacks || []), config.fallback)
  return [...new Set(candidates.map(text).filter(Boolean))]
}

function apiKey() {
  const key = process.env.AIRTABLE_API_KEY
  if (!key) throw new Error('AIRTABLE_API_KEY is required')
  return key
}

async function airtableRequest(table, options = {}) {
  const url = new URL(`${AIRTABLE_API_ROOT}/${baseId()}/${encodeURIComponent(table)}`)
  if (options.offset) url.searchParams.set('offset', options.offset)
  if (options.pageSize) url.searchParams.set('pageSize', String(options.pageSize))
  const response = await fetch(url, {
    method: options.method || 'GET',
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      'Content-Type': 'application/json'
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    const message = payload?.error?.message || payload?.error?.type || response.statusText
    const error = new Error(`Airtable ${table} ${response.status}: ${message}`)
    error.status = response.status
    error.payload = payload
    error.airtableMessage = message
    throw error
  }
  return payload
}

function rejectedField(payload = {}) {
  const message = String(payload?.error?.message || payload?.error?.type || payload?.error || '')
  return message.match(/field\s+name:\s*"([^"]+)"/i)?.[1] ||
    message.match(/field\s+"([^"]+)"/i)?.[1] ||
    message.match(/Unknown field name:\s*"([^"]+)"/i)?.[1] ||
    ''
}

function removeFieldFromRecordPayload(records = [], fieldName = '') {
  let removed = false
  const next = records
    .map(record => {
      if (!Object.hasOwn(record.fields || {}, fieldName)) return record
      const fields = { ...record.fields }
      delete fields[fieldName]
      removed = true
      return { ...record, fields }
    })
    .filter(record => Object.keys(record.fields || {}).length)
  return { records: next, removed }
}

export function createAirtableClient() {
  return {
    async listRecords(table) {
      const records = []
      let offset = ''
      do {
        const payload = await airtableRequest(table, { pageSize: 100, offset })
        records.push(...(payload.records || []))
        offset = payload.offset || ''
      } while (offset)
      return records
    },
    async createRecords(table, records = []) {
      const created = []
      for (let i = 0; i < records.length; i += 10) {
        let bodyRecords = records.slice(i, i + 10).map(fields => ({ fields }))
        const removed = new Set()
        while (bodyRecords.length) {
          try {
            const payload = await airtableRequest(table, {
              method: 'POST',
              body: {
                records: bodyRecords,
                typecast: true
              }
            })
            created.push(...(payload.records || []))
            break
          } catch (error) {
            const fieldName = rejectedField(error.payload)
            if (!fieldName || removed.has(fieldName) || removed.size >= 20) throw error
            const next = removeFieldFromRecordPayload(bodyRecords, fieldName)
            if (!next.removed) throw error
            removed.add(fieldName)
            bodyRecords = next.records
          }
        }
      }
      return created
    },
    async updateRecords(table, records = []) {
      const updated = []
      for (let i = 0; i < records.length; i += 10) {
        const payload = await airtableRequest(table, {
          method: 'PATCH',
          body: {
            records: records.slice(i, i + 10),
            typecast: true
          }
        })
        updated.push(...(payload.records || []))
      }
      return updated
    },
    async deleteRecord(table, recordId) {
      const url = `${AIRTABLE_API_ROOT}/${baseId()}/${encodeURIComponent(table)}/${encodeURIComponent(recordId)}`
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${apiKey()}`,
          'Content-Type': 'application/json'
        }
      })
      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        const message = payload?.error?.message || payload?.error?.type || response.statusText
        throw new Error(`Airtable delete ${table}/${recordId} ${response.status}: ${message}`)
      }
      return payload
    }
  }
}

export function parseNumber(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : NaN
  const match = String(value ?? '').replace(/,/g, '').match(/[+-]?\d+(?:\.\d+)?/)
  return match ? Number(match[0]) : NaN
}

function parseAmericanOdds(value) {
  const n = parseNumber(value)
  return Number.isFinite(n) && n !== 0 ? n : NaN
}

export function finalResult(value) {
  const raw = text(value).toLowerCase()
  if (/^(win|won|w|cash|cashed)$/.test(raw)) return 'Win'
  if (/^(loss|lost|l|lose|failed)$/.test(raw)) return 'Loss'
  if (/^(push)$/.test(raw)) return 'Push'
  if (/^(void|no action)$/.test(raw)) return 'Void'
  if (/^(cancelled|canceled)$/.test(raw)) return 'Cancelled'
  return ''
}

export function resultFromFields(fields = {}) {
  return finalResult(first(fields, ['Result', 'Outcome', 'Final Result', 'Pick Result', 'Graded Result']))
}

export function isCompletedRecord(fields = {}) {
  return Boolean(resultFromFields(fields))
}

export function isActiveRecord(fields = {}) {
  return !isCompletedRecord(fields)
}

function cleanState(value = '') {
  return text(value).toLowerCase().replace(/[-_]+/g, ' ').replace(/\s+/g, ' ')
}

function isYes(value = '') {
  return /^(yes|true|1|y|featured)$/i.test(text(value))
}

function isNo(value = '') {
  return /^(no|false|0|n)$/i.test(text(value))
}

function rowUnits(row = {}) {
  return parseNumber(row.Units ?? row.units ?? first(row, ['Units', 'Units to Commit', 'Stake']))
}

function rowGrade(row = {}) {
  return text(row.Grade ?? row.grade ?? first(row, ['Grade', 'Card Grade'])).toUpperCase()
}

function isAOrBetter(row = {}) {
  const grade = rowGrade(row)
  return grade === 'A' || grade === 'A+'
}

function rowStatusValues(row = {}) {
  return [
    row.Status,
    row.status,
    row.releaseStatus,
    row['Release Status'],
    first(row, ['Status', 'Display Status', 'Pick Status', 'Release Status'])
  ].map(cleanState).filter(Boolean)
}

function rowCategoryValue(row = {}) {
  return cleanState(row.Category ?? row.category ?? first(row, ['Category', 'Bet Type', 'Type', 'Market']))
}

function isActionableStatus(row = {}) {
  const statuses = rowStatusValues(row)
  const disallowed = new Set(['watchlist', 'pass', 'live only', 'no release', 'cancelled', 'canceled', 'void', 'win', 'loss', 'push'])
  if (statuses.some(status => disallowed.has(status))) return false
  const allowed = new Set(['pending', 'released', 'vip released', 'free released'])
  return statuses.some(status => allowed.has(status))
}

function isActionableOdds(row = {}) {
  const odds = text(row.Odds ?? row.odds ?? first(row, ['Odds', 'Posted Odds', 'American Odds']))
  if (!odds) return false
  if (/^(live only|watchlist|pass|n\/?a|na|none|-+)$/i.test(odds)) return false
  return Number.isFinite(parseAmericanOdds(odds))
}

function isPassRecord(row = {}) {
  const state = [
    ...rowStatusValues(row),
    rowCategoryValue(row),
    cleanState(row['Bet Type'] ?? row.betType ?? first(row, ['Bet Type', 'Type', 'Market'])),
    cleanState(row.Grade ?? row.grade ?? first(row, ['Grade', 'Card Grade']))
  ].join(' ')
  return /\bpass\b|\bno release\b/.test(state)
}

function gradeRank(row = {}) {
  const grade = rowGrade(row)
  if (grade === 'A+') return 4
  if (grade === 'A') return 3
  if (grade === 'B') return 2
  if (grade === 'B-') return 1
  return -1
}

export function isFeatured(row = {}) {
  return isYes(row.Featured ?? row.featured ?? first(row, ['Featured', 'Featured?']))
}

function hasOfficialGrade(row = {}) {
  if (rowGrade(row) === 'PASS') return false
  return gradeRank(row) >= 0
}

function hasPickOfTheDayGrade(row = {}) {
  return ['A+', 'A', 'B'].includes(rowGrade(row))
}

function pickOfTheDayFlagAllowed(row = {}) {
  return !isNo(row['Pick of the Day Eligible'] ?? row.pickOfTheDayEligible ?? first(row, ['Pick of the Day Eligible']))
}

function officialBetValue(row = {}) {
  return row['Official Bet'] ?? row.officialBet ?? first(row, ['Official Bet'])
}

function effectiveOfficialBet(row = {}) {
  const explicit = text(officialBetValue(row))
  if (explicit) return isYes(explicit)
  return isActionableStatus(row) &&
    rowUnits(row) > 0 &&
    !isWatchlistRecord(row) &&
    !isPassRecord(row)
}

function isGenericPickText(value = '') {
  const pick = cleanState(value)
  if (!pick) return true
  if (/^(elite favorite )?set ?1 loss live watchlist$/.test(pick)) return true
  if (/^(no game today|pass today|live watchlist)$/.test(pick)) return true
  if (/^game \d+ watchlist$/.test(pick)) return true
  if (/^game \d+ live watchlist$/.test(pick)) return true
  if (/\bwatchlist\b/.test(pick) && !/\b(over|under|ml|moneyline|spread|total|[+-]\d+(?:\.\d+)?)\b/.test(pick)) return true
  return false
}

function hasSpecificPick(row = {}) {
  const pick = text(row.Pick ?? row.pick ?? first(row, ['Pick', 'Selection', 'Play', 'Prop']))
  if (isGenericPickText(pick)) return false

  const game = text(row.Game ?? row.game ?? first(row, ['Game', 'Matchup', 'Event']))
  const player = text(row.Player ?? row.player ?? first(row, ['Player', 'Athlete', 'Player Name']))
  const opponent = text(row.Opponent ?? row.opponent ?? first(row, ['Opponent']))
  const team = text(row.Team ?? row.team ?? first(row, ['Team']))
  const hasContext = /\b(vs|versus)\b|@/.test(game.toLowerCase()) || player || opponent || team
  const hasSideOrMarket = /\b(over|under|ml|moneyline|spread|total|team total|points|assists|rebounds|strikeouts)\b|[+-]\d+(?:\.\d+)?/.test(pick.toLowerCase())
  return hasContext && hasSideOrMarket
}

function isCategoryAllowed(row = {}) {
  const category = rowCategoryValue(row)
  const guarded = new Set(['watchlist', 'pass', 'live tennis', 'live total', 'live spread'])
  if (!guarded.has(category)) return true
  return hasSpecificPick(row) && isActionableOdds(row) && rowUnits(row) > 0
}

export function isWatchlistRecord(row = {}) {
  const statusValues = rowStatusValues(row)
  const category = rowCategoryValue(row)
  const betType = cleanState(row['Bet Type'] ?? row.betType ?? first(row, ['Bet Type', 'Type', 'Market']))
  const liveOnlyCategories = new Set(['live tennis', 'live total', 'live spread'])
  return statusValues.some(status => ['watchlist', 'live only'].includes(status)) ||
    category === 'watchlist' ||
    betType === 'watchlist' ||
    (liveOnlyCategories.has(category) && !isCategoryAllowed(row)) ||
    (liveOnlyCategories.has(betType) && !isCategoryAllowed(row))
}

function hasOfficialPickProfile(row = {}) {
  return !isCompletedRecord(row) &&
    !isWatchlistRecord(row) &&
    !isPassRecord(row) &&
    isActionableStatus(row) &&
    rowUnits(row) > 0 &&
    hasSpecificPick(row) &&
    isActionableOdds(row) &&
    hasOfficialGrade(row) &&
    isCategoryAllowed(row)
}

export function isPickOfTheDayEligible(row = {}) {
  return effectiveOfficialBet(row) &&
    pickOfTheDayFlagAllowed(row) &&
    hasPickOfTheDayGrade(row) &&
    hasOfficialPickProfile(row)
}

export function isOfficialActivePickEligible(row = {}) {
  return effectiveOfficialBet(row) &&
    hasOfficialPickProfile(row)
}

function hasAnyValue(row = {}, names = []) {
  return Boolean(first(row, names))
}

export function validateMicksFirstPick(row = {}) {
  const warnings = []
  const grade = rowGrade(row)
  const isA = grade === 'A+' || grade === 'A'
  const isBOrBetter = ['A+', 'A', 'B', 'B-'].includes(grade)
  const sourceText = [
    row.sourceVerification,
    row['Source Verification'],
    row.writeup,
    row.Writeup,
    row.fullAnalysis,
    row['Full Analysis']
  ].map(text).join(' ').toLowerCase()
  const micksSignals = [
    hasAnyValue(row, ['Game', 'Matchup', 'Event']),
    hasAnyValue(row, ['Odds', 'Posted Odds', 'American Odds']),
    hasAnyValue(row, ['Best Number', 'Line', 'Number']),
    hasAnyValue(row, ['No Bet Cutoff']),
    hasAnyValue(row, ['True Probability', 'Model Probability', 'EV Edge', 'Projection Gap']),
    hasAnyValue(row, ['Injury Notes', 'Source Verification']),
    hasAnyValue(row, ['Market Notes', 'Closing Number', 'Closing Odds', 'Line Movement']),
    hasAnyValue(row, ['Variance Check']),
    hasAnyValue(row, ['Full Analysis', 'Writeup', 'Write Up'])
  ]

  if (isA && micksSignals.some(value => !value)) warnings.push('A/VIP grade needs Micks-first matchup, price, cutoff, edge, news, market, variance, and game-script evidence.')
  if (isA && /action|network|pickdawgz|covers|vsin|numberfire|sportsline/.test(sourceText) && !/micks|internal|model|projection|edge/.test(sourceText)) {
    warnings.push('External handicapper confirmation cannot create A/VIP grade by itself.')
  }

  return {
    ok: warnings.length === 0,
    warnings,
    micksSignalCount: micksSignals.filter(Boolean).length,
    isBOrBetter
  }
}

export function validateMlbConfirmationGate(row = {}) {
  const sport = cleanState(row.Sport ?? row.sport ?? row.League ?? row.league)
  const grade = rowGrade(row)
  if (!/\bmlb\b|baseball/.test(sport) || !['A+', 'A', 'B', 'B-'].includes(grade)) {
    return { ok: true, warnings: [] }
  }

  const missing = []
  if (!hasAnyValue(row, ['Starting Pitcher', 'Pitcher Confirmed'])) missing.push('starting pitcher')
  if (!hasAnyValue(row, ['Lineup Confirmed', 'Lineup', 'Projected Lineup'])) missing.push('lineup')
  if (!hasAnyValue(row, ['Weather', 'Wind', 'Park'])) missing.push('weather/wind/park')
  if (!hasAnyValue(row, ['Bullpen Usage', 'Bullpen Notes'])) missing.push('bullpen usage')
  if (!hasAnyValue(row, ['No Bet Cutoff'])) missing.push('current odds inside cutoff')
  if (!hasAnyValue(row, ['True Probability', 'Model Probability', 'EV Edge', 'Projection Gap'])) missing.push('independent edge')
  const betType = cleanState(row['Bet Type'] ?? row.betType ?? first(row, ['Bet Type', 'Type', 'Market']))
  if (/\bteam total\b/.test(betType) && !hasAnyValue(row, ['Game Script', 'Full Analysis', 'Writeup'])) missing.push('team-total cash paths')

  return {
    ok: missing.length === 0,
    warnings: missing.length ? [`MLB ${grade} grade is missing ${missing.join(', ')}; cap at B- or C/Watchlist.`] : [],
    missing
  }
}

export function validateParlayLimits(rows = []) {
  const parlays = rows.filter(row => /\b(parlay|lotto)\b/i.test([
    row.Category,
    row.category,
    row['Bet Type'],
    row.betType,
    row.Pick,
    row.pick
  ].map(text).join(' ')))
  const warnings = []
  if (parlays.length > 1) warnings.push('Max 1 main parlay per card.')
  for (const row of parlays) {
    const grade = rowGrade(row)
    const pick = text(row.Pick ?? row.pick)
    const legCount = Number(text(row.Legs ?? row.legs ?? pick).match(/\b(\d+)[ -]?leg\b/i)?.[1] || 0)
    if (!['A+', 'A', 'B'].includes(grade)) warnings.push(`Parlay ${pick || '(untitled)'} uses a leg/card below B.`)
    if (legCount >= 3 && !['A+', 'A'].includes(grade)) warnings.push(`3+ leg parlay ${pick || '(untitled)'} belongs in Longshots unless every leg is B+ or better.`)
    if (/fragile prop/i.test([row.Writeup, row.writeup, row['Market Notes'], row.marketNotes].map(text).join(' '))) warnings.push(`Parlay ${pick || '(untitled)'} includes fragile props.`)
    if (rowUnits(row) > 0.25 && /longshot/i.test(rowCategoryValue(row))) warnings.push(`Longshot parlay ${pick || '(untitled)'} should be tiny-unit only.`)
  }
  return {
    ok: warnings.length === 0,
    warnings,
    parlayCount: parlays.length
  }
}

export function validateFullAnalysisContent(row = {}) {
  const fullAnalysis = text(row['Full Analysis'] ?? row.fullAnalysis)
  const warnings = []
  const required = [
    'Why We Like It',
    'Game Script',
    'Metric Edge',
    'How It Cashes',
    'What Can Go Wrong',
    'Best Number / Cutoff',
    'Micks Picks Verdict'
  ]
  for (const heading of required) {
    if (!fullAnalysis.toLowerCase().includes(heading.toLowerCase())) warnings.push(`Missing ${heading} section.`)
  }
  const banned = [
    'Opening thesis',
    'The matchup gives enough paths',
    'This creates a specific handicap, not just a lean'
  ]
  for (const phrase of banned) {
    if (fullAnalysis.toLowerCase().includes(phrase.toLowerCase())) warnings.push(`Generic filler phrase needs rewrite: ${phrase}.`)
  }
  return {
    ok: warnings.length === 0,
    warnings
  }
}

function startTimeValue(row = {}) {
  const raw = text(row.startTime ?? row['Start Time'] ?? row.timestamp ?? row.Timestamp ?? row.date ?? row.Date)
  if (!raw) return Number.MAX_SAFE_INTEGER
  const parsed = new Date(raw)
  return Number.isNaN(parsed.getTime()) ? Number.MAX_SAFE_INTEGER : parsed.getTime()
}

export function selectPickOfTheDay(rows = []) {
  const eligible = rows.filter(isPickOfTheDayEligible)
  if (!eligible.length) return null
  return [...eligible].sort((a, b) => {
    const featuredDelta = Number(isFeatured(b)) - Number(isFeatured(a))
    if (featuredDelta) return featuredDelta
    const gradeDelta = gradeRank(b) - gradeRank(a)
    if (gradeDelta) return gradeDelta
    const unitsDelta = rowUnits(b) - rowUnits(a)
    if (unitsDelta) return unitsDelta
    return startTimeValue(a) - startTimeValue(b)
  })[0]
}

export function buildRecordKey(fields = {}, sourceTable = '') {
  return text(first(fields, ['Record Key'])) || [
    first(fields, ['Date', 'Game Date', 'Posted Time', 'Timestamp']),
    first(fields, ['League', 'Sport']),
    first(fields, ['Game', 'Matchup', 'Event']),
    first(fields, ['Pick', 'Selection', 'Play', 'Prop', 'Player']),
    first(fields, ['Bet Type', 'Type', 'Market', 'Prop Type']),
    sourceTable
  ].map(compact).filter(Boolean).join('|')
}

function inferSide(fields = {}) {
  const raw = [
    first(fields, ['Pick', 'Selection', 'Play', 'Prop', 'Bet Type']),
    first(fields, ['Type', 'Market', 'Prop Type'])
  ].join(' ')
  if (/\bover\b/i.test(raw)) return 'over'
  if (/\bunder\b/i.test(raw)) return 'under'
  return ''
}

function calculateProfitLoss(fields = {}, result = resultFromFields(fields)) {
  const units = parseNumber(first(fields, ['Units', 'Units to Commit', 'Stake']))
  const odds = parseAmericanOdds(first(fields, ['Odds', 'Posted Odds', 'American Odds']))
  if (!result || !Number.isFinite(units) || units <= 0) return { profitLoss: NaN, roi: NaN }
  if (result === 'Loss') return { profitLoss: -units, roi: -100 }
  if (['Push', 'Void', 'Cancelled'].includes(result)) return { profitLoss: 0, roi: 0 }
  if (!Number.isFinite(odds)) return { profitLoss: NaN, roi: NaN }
  const profitLoss = odds > 0 ? units * odds / 100 : units * 100 / Math.abs(odds)
  return {
    profitLoss,
    roi: (profitLoss / units) * 100
  }
}

function calculateClv(fields = {}) {
  const existingPercent = first(fields, ['CLV%', 'CLV'])
  const existingResult = first(fields, ['CLV Result'])
  const existingValue = first(fields, ['Closing Line Value'])
  if (existingPercent || existingResult || existingValue) {
    return {
      percent: existingPercent,
      result: existingResult,
      value: existingValue
    }
  }

  const best = parseNumber(first(fields, ['Best Number', 'Line', 'Number']))
  const closing = parseNumber(first(fields, ['Closing Number', 'Closing Line', 'Verified Closing Number']))
  if (!Number.isFinite(best) || !Number.isFinite(closing) || best === 0) {
    return { percent: '', result: '', value: '' }
  }

  const side = inferSide(fields)
  let edge = closing - best
  if (side === 'under') edge = best - closing
  const percent = (edge / Math.abs(best)) * 100
  return {
    percent: Number(percent.toFixed(2)),
    result: edge > 0 ? 'Positive' : edge < 0 ? 'Negative' : 'Neutral',
    value: Number(edge.toFixed(2))
  }
}

function archiveValue(fields = {}, names = []) {
  return first(fields, names)
}

function cleanArchiveFields(fields = {}) {
  const cleaned = {}
  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined || value === null) continue
    if (typeof value === 'string' && !value.trim()) continue
    cleaned[key] = value
  }
  return cleaned
}

export function buildArchiveFields(record = {}, sourceConfig = ACTIVE_TABLES.picks, now = new Date()) {
  const fields = record.fields || record
  const result = resultFromFields(fields)
  const settlement = calculateProfitLoss(fields, result)
  const clv = calculateClv(fields)
  const originalTable = sourceConfig?.alias || sourceConfig?.label || text(fields['Original Table']) || 'picks'
  const recordKey = buildRecordKey(fields, originalTable)
  const profitLoss = Number.isFinite(settlement.profitLoss) ? Number(settlement.profitLoss.toFixed(2)) : archiveValue(fields, ['Profit/Loss', 'P/L', 'PL', 'Profit Loss'])
  const roi = Number.isFinite(settlement.roi) ? Number(settlement.roi.toFixed(2)) : archiveValue(fields, ['ROI'])

  return cleanArchiveFields({
    Date: archiveValue(fields, ['Date', 'Game Date', 'Posted Time', 'Timestamp']),
    Sport: archiveValue(fields, ['Sport']),
    League: archiveValue(fields, ['League', 'Sport']),
    Game: archiveValue(fields, ['Game', 'Matchup', 'Event']),
    Pick: archiveValue(fields, ['Pick', 'Selection', 'Play', 'Prop']),
    'Bet Type': archiveValue(fields, ['Bet Type', 'Type', 'Market', 'Prop Type']),
    Odds: archiveValue(fields, ['Odds', 'Posted Odds', 'American Odds']),
    Sportsbook: archiveValue(fields, ['Sportsbook', 'Book']),
    Grade: archiveValue(fields, ['Grade', 'Card Grade']),
    Units: archiveValue(fields, ['Units', 'Units to Commit', 'Stake']),
    'Best Number': archiveValue(fields, ['Best Number', 'Line', 'Number']),
    'No Bet Cutoff': archiveValue(fields, ['No Bet Cutoff']),
    'Closing Number': archiveValue(fields, ['Closing Number', 'Closing Line', 'Verified Closing Number']),
    'Closing Odds': archiveValue(fields, ['Closing Odds', 'Closing Price']),
    'CLV%': clv.percent,
    'CLV Result': clv.result,
    'Closing Line Value': clv.value,
    Result: result,
    'Profit/Loss': profitLoss,
    ROI: roi,
    Access: archiveValue(fields, ['Access', 'Tier', 'Access Tier']),
    Featured: archiveValue(fields, ['Featured', 'Featured?']),
    Writeup: archiveValue(fields, ['Writeup', 'Write Up', 'Public Writeup', 'Summary']),
    'Market Notes': archiveValue(fields, ['Market Notes']),
    'Injury Notes': archiveValue(fields, ['Injury Notes']),
    'Source Verification': archiveValue(fields, ['Source Verification']),
    'Full Analysis': archiveValue(fields, ['Full Analysis']),
    'Official Bet': archiveValue(fields, ['Official Bet']),
    'Correlation Group': archiveValue(fields, ['Correlation Group']),
    'Primary Edge Type': archiveValue(fields, ['Primary Edge Type']),
    'Secondary Edge Type': archiveValue(fields, ['Secondary Edge Type']),
    'Source Influence Level': archiveValue(fields, ['Source Influence Level']),
    'Micks Independent Confirmation': archiveValue(fields, ['Micks Independent Confirmation']),
    'Failure Reason': archiveValue(fields, ['Failure Reason']),
    'Was Correlated Stack': archiveValue(fields, ['Was Correlated Stack']),
    'Closing Price Check': archiveValue(fields, ['Closing Price Check']),
    'Lineup Weather Confirmed': archiveValue(fields, ['Lineup Weather Confirmed']),
    'Pick of the Day Eligible': archiveValue(fields, ['Pick of the Day Eligible']),
    'ROI Bucket': archiveValue(fields, ['ROI Bucket']) || inferRoiBucket(fields, sourceConfig),
    'Original Table': originalTable,
    'Original Record ID': record.id || fields.id || fields.airtableRecordId || archiveValue(fields, ['Original Record ID']),
    'Record Key': recordKey,
    'Archived At': now.toISOString()
  })
}

function archiveIdentity(fields = {}) {
  return {
    recordKey: text(first(fields, ['Record Key'])),
    originalRecordId: text(first(fields, ['Original Record ID', 'Source Airtable Record ID']))
  }
}

export function normalizeImportPayload(body = {}) {
  const batches = Array.isArray(body.batches)
    ? body.batches
    : [{ table: body.table, records: body.records || [] }]

  const normalized = batches.map(batch => {
    const canonical = canonicalTable(batch.table || '')
    const records = Array.isArray(batch.records) ? batch.records : []
    return {
      tableAlias: batch.table || '',
      canonicalTable: canonical,
      records: records.map(record => sanitizeImportFields(record))
    }
  })

  applyImportCardProtections(normalized)
  return normalized
}

export function sanitizeImportFields(fields = {}) {
  const cleaned = {}
  for (const [rawKey, rawValue] of Object.entries(fields || {})) {
    const key = text(rawKey)
    if (!key || IMPORT_BLOCKED_FIELDS.has(key)) continue
    if (!IMPORT_ALLOWED_FIELDS.has(key)) continue
    const value = cleanValue(rawValue)
    if (value === '' || value === null || value === undefined) continue
    cleaned[key] = value
  }
  applyWatchlistDefaults(cleaned)
  applyImportRoutingRules(cleaned)
  applyOfficialDefaults(cleaned)
  return cleaned
}

function applyWatchlistDefaults(cleaned = {}) {
  if (!isWatchlistRecord(cleaned)) return
  cleaned.Status = 'Watchlist'
  cleaned.Category = 'Watchlist'
  cleaned.Units = 0
  cleaned.Featured = 'No'
  cleaned['Pick of the Day Eligible'] = 'No'
  const odds = text(cleaned.Odds)
  if (!/^(live only|watchlist)$/i.test(odds)) cleaned.Odds = odds ? 'Watchlist' : 'Live only'
}

function applyImportRoutingRules(cleaned = {}) {
  const grade = rowGrade(cleaned)
  if ((grade === 'A+' || grade === 'A') && !validateMicksFirstPick(cleaned).ok) {
    cleaned.Access = 'Free'
    if (/vip released/i.test(text(cleaned['Release Status']))) cleaned['Release Status'] = 'Released'
  }
  if (['A+', 'A', 'B'].includes(grade) && !validateMlbConfirmationGate(cleaned).ok) {
    cleaned.Grade = 'B-'
    cleaned.Access = 'Free'
    if (/vip released/i.test(text(cleaned['Release Status']))) cleaned['Release Status'] = 'Released'
  }
  if (!isAOrBetter(cleaned) && /vip|premium/i.test(text(cleaned.Access))) {
    cleaned.Access = 'Free'
    if (/vip released/i.test(text(cleaned['Release Status']))) cleaned['Release Status'] = 'Released'
  }
}

function applyOfficialDefaults(cleaned = {}) {
  if (!text(cleaned['Source Influence Level'])) cleaned['Source Influence Level'] = 'Supporting'
  if (!text(cleaned['Was Correlated Stack'])) cleaned['Was Correlated Stack'] = 'No'

  const explicitOfficial = text(cleaned['Official Bet'])
  const official = hasOfficialPickProfile(cleaned)
  if (isWatchlistRecord(cleaned) || isPassRecord(cleaned) || !isActionableStatus(cleaned) || rowUnits(cleaned) <= 0) {
    cleaned['Official Bet'] = 'No'
  } else if (!explicitOfficial) {
    cleaned['Official Bet'] = official ? 'Yes' : 'No'
  }

  if (!text(cleaned['Pick of the Day Eligible'])) {
    cleaned['Pick of the Day Eligible'] = isYes(cleaned['Official Bet']) &&
      hasPickOfTheDayGrade(cleaned) &&
      hasOfficialPickProfile(cleaned)
      ? 'Yes'
      : 'No'
  }
  if (isNo(cleaned['Official Bet'])) cleaned['Pick of the Day Eligible'] = 'No'
}

function rowCorrelationGroup(row = {}) {
  const explicit = text(row['Correlation Group'] ?? row.correlationGroup ?? first(row, ['Correlation Group', 'Parlay Group']))
  if (explicit) return explicit.toLowerCase()
  const game = text(row.Game ?? row.game ?? first(row, ['Game', 'Matchup', 'Event']))
  if (!game) return ''
  return [
    first(row, ['Date', 'Game Date', 'Posted Time', 'Timestamp']),
    first(row, ['League', 'Sport']),
    game
  ].map(compact).filter(Boolean).join('|')
}

function cardSort(a = {}, b = {}) {
  const gradeDelta = gradeRank(b) - gradeRank(a)
  if (gradeDelta) return gradeDelta
  const unitsDelta = rowUnits(b) - rowUnits(a)
  if (unitsDelta) return unitsDelta
  return startTimeValue(a) - startTimeValue(b)
}

function markCorrelated(row = {}) {
  row['Was Correlated Stack'] = 'Yes'
  row.wasCorrelatedStack = 'Yes'
}

function demoteOfficialRow(row = {}, reason = 'Over-correlated stack') {
  row['Official Bet'] = 'No'
  row.officialBet = 'No'
  row['Pick of the Day Eligible'] = 'No'
  row.pickOfTheDayEligible = 'No'
  row['Failure Reason'] = row['Failure Reason'] || row.failureReason || reason
  row.failureReason = row['Failure Reason']
  if (!/longshot/i.test(rowCategoryValue(row)) && sectionForTable(row.originalTable || row.__section) !== 'longshots') {
    row.Status = 'Watchlist'
    row.status = 'Watchlist'
    row.Category = 'Watchlist'
    row.category = 'Watchlist'
    row.Units = 0
    row.units = '0'
  }
}

function applyCorrelationProtection(rows = []) {
  const groups = new Map()
  for (const row of rows) {
    const group = rowCorrelationGroup(row)
    if (!group || !isOfficialActivePickEligible(row)) continue
    if (!groups.has(group)) groups.set(group, [])
    groups.get(group).push(row)
  }

  for (const grouped of groups.values()) {
    if (grouped.length <= 1) continue
    const sorted = [...grouped].sort(cardSort)
    sorted.forEach(markCorrelated)
    sorted.slice(1).forEach(row => {
      if (isYes(row['Micks Independent Confirmation'] ?? row.micksIndependentConfirmation ?? first(row, ['Micks Independent Confirmation']))) return
      demoteOfficialRow(row, 'Over-correlated stack')
    })
  }
}

function applySectionDisplayLimits(rows = [], options = {}) {
  const bySection = new Map()
  for (const row of rows) {
    if (!isOfficialActivePickEligible(row)) continue
    const section = sectionForTable(row.originalTable || row.__table || row.__section)
    if (!bySection.has(section)) bySection.set(section, [])
    bySection.get(section).push(row)
  }

  for (const [section, sectionRows] of bySection.entries()) {
    const sorted = [...sectionRows].sort(cardSort)
    const max = OFFICIAL_SECTION_LIMITS[section]
    if (max && sorted.length > max) {
      sorted.slice(max).forEach(row => demoteOfficialRow(row, section === 'longshots' ? 'Forced longshot' : 'Card limit overflow'))
    }
    if (section === 'longshots' && !options.includeLongshotOverflow) {
      let exposure = 0
      let count = 0
      for (const row of sorted) {
        if (!isOfficialActivePickEligible(row)) continue
        const units = rowUnits(row)
        count += 1
        exposure += Number.isFinite(units) ? units : 0
        if (count > OFFICIAL_SECTION_LIMITS.longshots || exposure > LONGSHOT_UNIT_LIMIT + 1e-9) {
          demoteOfficialRow(row, 'Forced longshot')
        }
      }
    }
  }
}

function applyCardProtections(rows = [], options = {}) {
  applyCorrelationProtection(rows)
  applySectionDisplayLimits(rows, options)
  return rows
}

function applyImportCardProtections(batches = []) {
  const rows = []
  for (const batch of batches) {
    const config = tableConfig(batch.canonicalTable)
    batch.records.forEach((record, index) => {
      record.originalTable = config?.alias || batch.canonicalTable
      record.__section = sectionForTable(config?.alias || batch.canonicalTable)
      record.__batchIndex = index
      rows.push(record)
    })
  }
  applyCardProtections(rows)
  for (const row of rows) {
    delete row.__section
    delete row.__batchIndex
    delete row.originalTable
    delete row.officialBet
    delete row.pickOfTheDayEligible
    delete row.wasCorrelatedStack
    delete row.failureReason
  }
}

function isTruthy(value) {
  return value === true || /^(1|true|yes|y|preview|dryrun|dry run)$/i.test(text(value))
}

function isDryRunImport(body = {}) {
  return isTruthy(body.dryRun) || isTruthy(body.preview)
}

function isSmokeTestImport(body = {}) {
  return isTruthy(body.smokeTest) || /^smoke[-_\s]?test$/i.test(text(body.action))
}

function smokeTestImportBody() {
  return {
    smokeTest: true,
    dryRun: false,
    preview: false,
    table: 'picks',
    batches: undefined,
    records: [{
      Pick: 'DELETE ME - Smoke Test Pick',
      Game: 'AIRTABLE IMPORT SMOKE TEST',
      Status: 'Pending'
    }]
  }
}

function recordIdsFromCreated(created = []) {
  return (Array.isArray(created) ? created : [])
    .map(record => text(record?.id))
    .filter(id => /^rec[A-Za-z0-9]{8,}$/.test(id))
}

function importDiagnostics(config, table, cleaned = [], requested = 0) {
  return {
    baseId: baseId(),
    table: config.alias,
    resolvedTable: table,
    attempted: requested,
    recordCount: cleaned.length,
    firstRecordKeys: Object.keys(cleaned[0] || {})
  }
}

function shouldTryNextTableCandidate(error = {}) {
  const message = String(error.airtableMessage || error.message || '')
  return error.status === 404 ||
    /table[_\s-]?not[_\s-]?found|could not find table|not found/i.test(message)
}

export async function importActiveRecords(body = {}, client = createAirtableClient()) {
  const importBody = isSmokeTestImport(body) ? smokeTestImportBody(body) : body
  const dryRun = isDryRunImport(importBody)
  const results = []
  for (const batch of normalizeImportPayload(importBody)) {
    const config = tableConfig(batch.canonicalTable)
    if (!config || config.alias === 'resultsArchive') {
      results.push({
        ok: false,
        success: false,
        table: batch.tableAlias || batch.canonicalTable,
        tableAlias: batch.tableAlias,
        attempted: batch.records.length,
        created: 0,
        recordIds: [],
        error: `Unsupported active table alias: ${batch.tableAlias || batch.canonicalTable}`
      })
      continue
    }

    const cleaned = batch.records.filter(record => Object.keys(record).length)
    const candidates = tableCandidates(config)
    const firstTable = candidates[0] || tableName(config)
    const firstDiagnostics = importDiagnostics(config, firstTable, cleaned, batch.records.length)

    if (dryRun) {
      console.info('DRY RUN - NO AIRTABLE WRITE', firstDiagnostics)
      results.push({
        ok: false,
        success: false,
        dryRun: true,
        banner: 'DRY RUN - NO AIRTABLE WRITE',
        table: config.alias,
        tableAlias: batch.tableAlias || config.alias,
        canonicalTable: config.alias,
        tableName: firstTable,
        resolvedTable: firstTable,
        attempted: batch.records.length,
        cleaned: cleaned.length,
        created: 0,
        skipped: batch.records.length - cleaned.length,
        recordIds: [],
        diagnostics: firstDiagnostics,
        preview: cleaned.slice(0, 3)
      })
      continue
    }

    if (!cleaned.length) {
      console.info('Airtable import skipped before write', firstDiagnostics)
      results.push({
        ok: false,
        success: false,
        table: config.alias,
        tableAlias: batch.tableAlias || config.alias,
        canonicalTable: config.alias,
        tableName: firstTable,
        resolvedTable: firstTable,
        attempted: batch.records.length,
        cleaned: 0,
        created: 0,
        skipped: batch.records.length,
        recordIds: [],
        diagnostics: firstDiagnostics,
        error: 'No importable records after cleaning payload.'
      })
      continue
    }

    let created = []
    let createdRecordIds = []
    let usedTable = firstTable
    const airtableErrors = []
    for (const table of candidates) {
      const diagnostics = importDiagnostics(config, table, cleaned, batch.records.length)
      console.info('Airtable import write attempt', diagnostics)
      try {
        created = await client.createRecords(table, cleaned)
        createdRecordIds = recordIdsFromCreated(created)
        usedTable = table
        break
      } catch (error) {
        const message = error.airtableMessage || error.message || String(error)
        airtableErrors.push({ table, error: message, status: error.status })
        console.error('Airtable import write failed', { ...diagnostics, error: message, status: error.status })
        if (!shouldTryNextTableCandidate(error)) break
      }
    }

    const createdCount = createdRecordIds.length
    const ok = createdCount === cleaned.length && createdCount > 0
    const diagnostics = importDiagnostics(config, usedTable, cleaned, batch.records.length)
    const airtableResponse = {
      records: (Array.isArray(created) ? created : []).map(record => ({ id: text(record?.id) })).filter(record => record.id)
    }
    const error = ok
      ? ''
      : airtableErrors.length
        ? airtableErrors[airtableErrors.length - 1].error
        : createdCount === 0
          ? 'Airtable returned zero created records with record IDs.'
          : `Airtable returned ${createdCount} created record IDs for ${cleaned.length} attempted records.`

    results.push({
      ok,
      success: ok,
      table: config.alias,
      tableAlias: batch.tableAlias || config.alias,
      canonicalTable: config.alias,
      tableName: usedTable,
      resolvedTable: usedTable,
      attempted: batch.records.length,
      cleaned: cleaned.length,
      created: createdCount,
      skipped: batch.records.length - cleaned.length,
      recordIds: createdRecordIds,
      diagnostics,
      airtableResponse,
      airtableErrors,
      ...(error ? { error } : {})
    })
  }
  const attempted = results.reduce((sum, result) => sum + Number(result.attempted || 0), 0)
  const created = results.reduce((sum, result) => sum + Number(result.created || 0), 0)
  const recordIds = results.flatMap(result => result.recordIds || [])
  const ok = results.length > 0 && results.every(result => result.ok)
  const firstResult = results[0] || {}
  return {
    ok,
    success: ok,
    dryRun,
    ...(dryRun ? { banner: 'DRY RUN - NO AIRTABLE WRITE' } : {}),
    table: results.length === 1 ? firstResult.table : 'multiple',
    tableName: results.length === 1 ? firstResult.tableName : undefined,
    resolvedTable: results.length === 1 ? firstResult.resolvedTable : undefined,
    attempted,
    created,
    recordIds,
    error: ok ? undefined : (firstResult.error || results.find(result => result.error)?.error || 'Airtable import did not create records.'),
    message: ok
      ? 'Records imported. Result/Outcome/Profit-Loss fields were intentionally not sent.'
      : dryRun
        ? 'DRY RUN - NO AIRTABLE WRITE'
        : 'Airtable import failed before confirmed created record IDs were returned.',
    results
  }
}

export function normalizeResultRow(record = {}, source = RESULTS_ARCHIVE_TABLE) {
  const fields = record.fields || record
  const result = resultFromFields(fields)
  const profitLoss = first(fields, ['Profit/Loss', 'P/L', 'PL', 'Profit Loss'])
  const numericProfitLoss = parseNumber(profitLoss)
  const originalTable = first(fields, ['Original Table']) || source.alias || source.label
  const originalSection = sectionForTable(originalTable)
  const access = first(fields, ['Access', 'Tier', 'Access Tier'])
  return {
    id: record.id || fields.id || '',
    airtableRecordId: record.id || fields.airtableRecordId || '',
    __source: 'Airtable Results Archive',
    __table: source.label || 'Results Archive',
    __section: originalSection,
    originalTable,
    originalRecordId: first(fields, ['Original Record ID', 'Source Airtable Record ID']),
    recordKey: buildRecordKey(fields, originalTable),
    Date: first(fields, ['Date', 'Game Date', 'Posted Time', 'Timestamp']),
    date: first(fields, ['Date', 'Game Date', 'Posted Time', 'Timestamp']),
    Sport: first(fields, ['Sport']),
    sport: first(fields, ['Sport']),
    League: first(fields, ['League', 'Sport']),
    league: first(fields, ['League', 'Sport']),
    Game: first(fields, ['Game', 'Matchup', 'Event']),
    game: first(fields, ['Game', 'Matchup', 'Event']),
    Team: first(fields, ['Team']),
    team: first(fields, ['Team']),
    Opponent: first(fields, ['Opponent']),
    opponent: first(fields, ['Opponent']),
    Player: first(fields, ['Player', 'Athlete', 'Player Name']),
    player: first(fields, ['Player', 'Athlete', 'Player Name']),
    Pick: first(fields, ['Pick', 'Selection', 'Play', 'Prop']),
    pick: first(fields, ['Pick', 'Selection', 'Play', 'Prop']),
    'Bet Type': first(fields, ['Bet Type', 'Type', 'Market', 'Prop Type']),
    betType: first(fields, ['Bet Type', 'Type', 'Market', 'Prop Type']),
    Odds: first(fields, ['Odds', 'Posted Odds', 'American Odds']),
    odds: first(fields, ['Odds', 'Posted Odds', 'American Odds']),
    Sportsbook: first(fields, ['Sportsbook', 'Book']),
    sportsbook: first(fields, ['Sportsbook', 'Book']),
    Grade: first(fields, ['Grade', 'Card Grade']),
    grade: first(fields, ['Grade', 'Card Grade']),
    Category: first(fields, ['Category', 'Bet Type', 'Type', 'Market']),
    category: first(fields, ['Category', 'Bet Type', 'Type', 'Market']),
    Units: first(fields, ['Units', 'Units to Commit', 'Stake']),
    units: first(fields, ['Units', 'Units to Commit', 'Stake']),
    'Best Number': first(fields, ['Best Number', 'Line', 'Number']),
    bestNumber: first(fields, ['Best Number', 'Line', 'Number']),
    'No Bet Cutoff': first(fields, ['No Bet Cutoff']),
    noBetCutoff: first(fields, ['No Bet Cutoff']),
    Result: result,
    Outcome: result,
    result,
    Status: result || first(fields, ['Status', 'Display Status', 'Pick Status']),
    status: result || first(fields, ['Status', 'Display Status', 'Pick Status']),
    'Profit/Loss': formatProfitLoss(profitLoss),
    profitLoss: formatProfitLoss(profitLoss),
    ROI: first(fields, ['ROI']),
    roi: first(fields, ['ROI']),
    'CLV%': first(fields, ['CLV%', 'CLV']),
    clvPercent: first(fields, ['CLV%', 'CLV']),
    'CLV Result': first(fields, ['CLV Result']),
    clvResult: first(fields, ['CLV Result']),
    'Closing Line Value': first(fields, ['Closing Line Value']),
    closingLineValue: first(fields, ['Closing Line Value']),
    'Closing Number': first(fields, ['Closing Number', 'Closing Line', 'Verified Closing Number']),
    closingNumber: first(fields, ['Closing Number', 'Closing Line', 'Verified Closing Number']),
    'Closing Odds': first(fields, ['Closing Odds', 'Closing Price']),
    closingOdds: first(fields, ['Closing Odds', 'Closing Price']),
    Access: access,
    access,
    Featured: first(fields, ['Featured', 'Featured?']),
    featured: first(fields, ['Featured', 'Featured?']),
    'Pick of the Day Eligible': first(fields, ['Pick of the Day Eligible']),
    pickOfTheDayEligible: first(fields, ['Pick of the Day Eligible']),
    Writeup: first(fields, ['Writeup', 'Write Up', 'Public Writeup', 'Summary']),
    writeup: first(fields, ['Writeup', 'Write Up', 'Public Writeup', 'Summary']),
    'Market Notes': first(fields, ['Market Notes']),
    marketNotes: first(fields, ['Market Notes']),
    'Injury Notes': first(fields, ['Injury Notes']),
    injuryNotes: first(fields, ['Injury Notes']),
    'Source Verification': first(fields, ['Source Verification']),
    sourceVerification: first(fields, ['Source Verification']),
    'Full Analysis': first(fields, ['Full Analysis']),
    fullAnalysis: first(fields, ['Full Analysis']),
    'Official Bet': first(fields, ['Official Bet']),
    officialBet: first(fields, ['Official Bet']),
    'Correlation Group': first(fields, ['Correlation Group']),
    correlationGroup: first(fields, ['Correlation Group']),
    'Primary Edge Type': first(fields, ['Primary Edge Type']),
    primaryEdgeType: first(fields, ['Primary Edge Type']),
    'Secondary Edge Type': first(fields, ['Secondary Edge Type']),
    secondaryEdgeType: first(fields, ['Secondary Edge Type']),
    'Source Influence Level': first(fields, ['Source Influence Level']),
    sourceInfluenceLevel: first(fields, ['Source Influence Level']),
    'Micks Independent Confirmation': first(fields, ['Micks Independent Confirmation']),
    micksIndependentConfirmation: first(fields, ['Micks Independent Confirmation']),
    'Failure Reason': first(fields, ['Failure Reason']),
    failureReason: first(fields, ['Failure Reason']),
    'Was Correlated Stack': first(fields, ['Was Correlated Stack']),
    wasCorrelatedStack: first(fields, ['Was Correlated Stack']),
    'Closing Price Check': first(fields, ['Closing Price Check']),
    closingPriceCheck: first(fields, ['Closing Price Check']),
    'Lineup Weather Confirmed': first(fields, ['Lineup Weather Confirmed']),
    lineupWeatherConfirmed: first(fields, ['Lineup Weather Confirmed']),
    releaseStatus: first(fields, ['Release Status']) || (access ? 'Released' : ''),
    'ROI Bucket': first(fields, ['ROI Bucket']) || inferRoiBucket(fields, { alias: originalTable }),
    roiBucket: first(fields, ['ROI Bucket']) || inferRoiBucket(fields, { alias: originalTable }),
    'Start Time': first(fields, ['Start Time', 'Game Time', 'Start', 'Posted Time', 'Timestamp']),
    startTime: first(fields, ['Start Time', 'Game Time', 'Start', 'Posted Time', 'Timestamp']),
    Timestamp: first(fields, ['Posted Time', 'Timestamp', 'Start Time', 'Game Time', 'Start']),
    timestamp: first(fields, ['Posted Time', 'Timestamp', 'Start Time', 'Game Time', 'Start']),
    _profitLossNumber: Number.isFinite(numericProfitLoss) ? numericProfitLoss : 0
  }
}

function sectionForTable(alias = '') {
  const canonical = canonicalTable(alias)
  if (canonical === 'propsLab') return 'props'
  if (canonical === 'lottoParlays') return 'lotto'
  if (canonical === 'longshots') return 'longshots'
  if (canonical === 'resultsArchive') return 'results'
  return 'picks'
}

function inferRoiBucket(fields = {}, sourceConfig = ACTIVE_TABLES.picks) {
  if (isPassRecord(fields)) return 'Pass'
  if (isWatchlistRecord(fields)) return 'Watchlist Triggered'
  const section = sectionForTable(sourceConfig?.alias || first(fields, ['Original Table']) || sourceConfig?.label)
  if (section === 'props') return 'Official Props'
  if (section === 'lotto') return 'Parlays'
  if (section === 'longshots' || isYes(first(fields, ['Longshot']))) return 'Longshots'
  return 'Official Straight'
}

export function normalizeActiveRow(record = {}, source = ACTIVE_TABLES.picks) {
  const fields = record.fields || record
  const access = first(fields, ['Access', 'Tier', 'Access Tier'])
  const activeFields = { ...fields, Result: '', Outcome: '' }
  const explicitOfficial = first(fields, ['Official Bet'])
  const officialBet = explicitOfficial || (hasOfficialPickProfile(activeFields) ? 'Yes' : 'No')
  const explicitPotd = first(fields, ['Pick of the Day Eligible'])
  const potdEligible = explicitPotd || (isYes(officialBet) && hasPickOfTheDayGrade(activeFields) && hasOfficialPickProfile(activeFields) ? 'Yes' : 'No')
  return {
    ...normalizeResultRow({ ...record, fields: activeFields }, source),
    __source: 'Airtable Active Picks',
    __table: source.label,
    __section: source.section,
    originalTable: source.alias,
    Status: first(fields, ['Status', 'Display Status', 'Pick Status']) || 'Pending',
    status: first(fields, ['Status', 'Display Status', 'Pick Status']) || 'Pending',
    Result: '',
    Outcome: '',
    result: '',
    Access: access,
    access,
    'Official Bet': officialBet,
    officialBet,
    'Pick of the Day Eligible': isYes(officialBet) ? potdEligible : 'No',
    pickOfTheDayEligible: isYes(officialBet) ? potdEligible : 'No',
    releaseStatus: first(fields, ['Release Status']) || first(fields, ['Status']) || 'Released'
  }
}

function formatProfitLoss(value) {
  const raw = text(value)
  if (!raw) return ''
  if (/u$/i.test(raw)) return raw
  const n = parseNumber(raw)
  if (!Number.isFinite(n)) return raw
  return `${n >= 0 ? '+' : ''}${n.toFixed(2)}u`
}

function isVip(row = {}) {
  const access = text(row.Access || row.access).toLowerCase()
  const releaseStatus = text(row.releaseStatus || row['Release Status']).toLowerCase()
  const grade = text(row.Grade || row.grade).toUpperCase()
  if (access === 'free' || releaseStatus === 'free released') return false
  const premium = access.includes('vip') || access.includes('premium') || releaseStatus === 'vip released'
  return (premium || grade === 'A' || grade === 'A+') && (grade === 'A' || grade === 'A+')
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

function withinDays(row = {}, days = 180) {
  if (!days) return true
  const key = dateKey(row.date || row.Date)
  if (!key) return true
  const rowTime = new Date(`${key}T12:00:00Z`).getTime()
  const cutoff = Date.now() - Number(days) * 24 * 60 * 60 * 1000
  return Number.isFinite(rowTime) && rowTime >= cutoff
}

function filterAccess(rows = [], access = '') {
  const wanted = text(access).toLowerCase()
  if (!wanted) return rows
  if (wanted === 'vip') return rows.filter(isVip)
  if (wanted === 'free') return rows.filter(row => !isVip(row))
  return rows
}

function dedupeRows(rows = []) {
  return Array.from(new Map(rows.map(row => [
    [row.recordKey, row.date, row.league, row.game, row.pick, row.betType, row.originalTable].map(compact).join('|'),
    row
  ])).values())
}

export async function listArchivedResults(options = {}, client = createAirtableClient()) {
  const archiveTable = tableName(RESULTS_ARCHIVE_TABLE)
  const records = await client.listRecords(archiveTable)
  const days = Number(options.days || 180)
  const rows = filterAccess(
    dedupeRows(records.map(record => normalizeResultRow(record, RESULTS_ARCHIVE_TABLE)))
      .filter(row => isCompletedRecord(row))
      .filter(row => withinDays(row, days))
      .sort((a, b) => String(b.date || '').localeCompare(String(a.date || ''))),
    options.access
  )
  return shapeFeed(rows, { source: 'resultsArchive', table: archiveTable })
}

export async function listActivePicks(options = {}, client = createAirtableClient()) {
  const rows = []
  const errors = []
  for (const config of activeTableConfigs()) {
    const table = tableName(config)
    try {
      const records = await client.listRecords(table)
      rows.push(...records
        .filter(record => isActiveRecord(record.fields || {}))
        .map(record => normalizeActiveRow(record, config)))
    } catch (error) {
      errors.push(`${config.alias}: ${error.message || String(error)}`)
    }
  }
  const deduped = applyCardProtections(dedupeRows(rows), {
    includeLongshotOverflow: options.includeLongshotOverflow === true ||
      String(options.includeLongshotOverflow || options.lottoCard || '').toLowerCase() === 'true'
  })
  const watchlist = filterAccess(deduped.filter(row => isWatchlistRecord(row) && !isPassRecord(row)), options.access)
    .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))
  const activeRows = deduped.filter(isOfficialActivePickEligible)
  const includeWatchlist = String(options.section || '').toLowerCase() === 'watchlist' ||
    options.watchlist === true ||
    String(options.watchlist || '').toLowerCase() === 'true'
  const baseRows = includeWatchlist ? watchlist : activeRows
  const filtered = filterAccess(baseRows, options.access)
    .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))
  return { ...shapeFeed(filtered, { source: 'activeAirtable' }), watchlist, errors }
}

function shapeFeed(rows = [], extra = {}) {
  const vip = rows.filter(isVip)
  const free = rows.filter(row => !isVip(row))
  const pickOfTheDay = selectPickOfTheDay(rows)
  const featured = rows.filter(row => isFeatured(row) && isPickOfTheDayEligible(row))
  return {
    success: true,
    ...extra,
    rows,
    results: rows,
    pickOfTheDay,
    featured,
    noPickOfTheDayMessage: pickOfTheDay ? '' : 'No Pick of the Day yet — check back after lines confirm.',
    free,
    vip,
    props: rows.filter(row => row.__section === 'props' || row.originalTable === 'propsLab'),
    lotto: rows.filter(row => row.__section === 'lotto' || row.originalTable === 'lottoParlays'),
    longshots: rows.filter(row => row.__section === 'longshots' || row.originalTable === 'longshots'),
    counts: {
      rows: rows.length,
      free: free.length,
      vip: vip.length
    }
  }
}

export async function settleAndArchive(options = {}, client = createAirtableClient()) {
  return moveCompletedRecordsToArchive({ ...options, settle: true }, client)
}

export async function archiveCompletedRecords(options = {}, client = createAirtableClient()) {
  return moveCompletedRecordsToArchive({ ...options, settle: false }, client)
}

async function moveCompletedRecordsToArchive(options = {}, client = createAirtableClient()) {
  const now = options.now instanceof Date ? options.now : new Date()
  const archiveTable = tableName(RESULTS_ARCHIVE_TABLE)
  const archiveRecords = await client.listRecords(archiveTable)
  const archiveKeys = new Set()
  const archiveOriginalIds = new Set()
  for (const record of archiveRecords) {
    const identity = archiveIdentity(record.fields || {})
    if (identity.recordKey) archiveKeys.add(identity.recordKey)
    if (identity.originalRecordId) archiveOriginalIds.add(identity.originalRecordId)
  }

  const errors = []
  const sections = []
  let archived = 0
  let deletedFromActive = 0
  let skippedDuplicates = 0
  let scanned = 0

  for (const config of activeTableConfigs()) {
    const sourceTable = tableName(config)
    const section = {
      tableAlias: config.alias,
      tableName: sourceTable,
      scanned: 0,
      matched: 0,
      archived: 0,
      deletedFromActive: 0,
      skippedDuplicates: 0,
      errors: []
    }
    sections.push(section)

    let records = []
    try {
      records = await client.listRecords(sourceTable)
    } catch (error) {
      section.errors.push(error.message || String(error))
      errors.push(`${config.alias}: ${error.message || String(error)}`)
      continue
    }

    for (const record of records) {
      scanned += 1
      section.scanned += 1
      const fields = record.fields || {}
      if (!isCompletedRecord(fields)) continue
      section.matched += 1

      const archiveFields = buildArchiveFields(record, config, now)
      const identity = archiveIdentity(archiveFields)
      const duplicate = (identity.recordKey && archiveKeys.has(identity.recordKey)) ||
        (identity.originalRecordId && archiveOriginalIds.has(identity.originalRecordId))

      if (duplicate) {
        skippedDuplicates += 1
        section.skippedDuplicates += 1
        if (!options.dryRun) {
          try {
            await client.deleteRecord(sourceTable, record.id)
            deletedFromActive += 1
            section.deletedFromActive += 1
          } catch (error) {
            section.errors.push(`Duplicate archived but active delete failed for ${record.id}: ${error.message || String(error)}`)
            errors.push(`${config.alias}/${record.id}: ${error.message || String(error)}`)
          }
        }
        continue
      }

      if (options.dryRun) {
        archived += 1
        section.archived += 1
        continue
      }

      try {
        const created = await client.createRecords(archiveTable, [archiveFields])
        if (!created.length) throw new Error('Airtable returned no created archive record')
        archived += 1
        section.archived += 1
        if (identity.recordKey) archiveKeys.add(identity.recordKey)
        if (identity.originalRecordId) archiveOriginalIds.add(identity.originalRecordId)
      } catch (error) {
        section.errors.push(`Archive create failed for ${record.id}: ${error.message || String(error)}`)
        errors.push(`${config.alias}/${record.id}: archive create failed: ${error.message || String(error)}`)
        continue
      }

      try {
        await client.deleteRecord(sourceTable, record.id)
        deletedFromActive += 1
        section.deletedFromActive += 1
      } catch (error) {
        section.errors.push(`Archive created but active delete failed for ${record.id}: ${error.message || String(error)}`)
        errors.push(`${config.alias}/${record.id}: active delete failed: ${error.message || String(error)}`)
      }
    }
  }

  return {
    success: errors.length === 0,
    dryRun: Boolean(options.dryRun),
    archiveTable,
    scanned,
    archived,
    deletedFromActive,
    skippedDuplicates,
    errors,
    sections
  }
}

export function parseRequestBody(req) {
  if (!req.body) return {}
  if (typeof req.body === 'string') return JSON.parse(req.body || '{}')
  return req.body
}

export function methodAllowsWrite(req, confirmValue) {
  if (req.method === 'POST') return true
  return text(req.query?.confirm || req.query?.Confirm) === confirmValue
}

export function responseStatusFor(result = {}) {
  if (result.dryRun) return 200
  return result.ok === false || result.success === false ? 207 : 200
}

export function publicConfig() {
  return {
    baseId: baseId(),
    tables: {
      picks: tableName(ACTIVE_TABLES.picks),
      propsLab: tableName(ACTIVE_TABLES.propsLab),
      lottoParlays: tableName(ACTIVE_TABLES.lottoParlays),
      longshots: tableName(ACTIVE_TABLES.longshots),
      resultsArchive: tableName(RESULTS_ARCHIVE_TABLE)
    }
  }
}

export function hasSettlementField(fields = {}) {
  return hasOwnValue(fields, ['Profit/Loss', 'P/L', 'PL', 'Profit Loss', 'ROI'])
}
