const ACTIVE_PICKS = []
const WEEKLY_RESULTS = []

function hasSettlement(row = {}) {
  const marker = [row.Result, row.result, row.Outcome, row.outcome, row.Status, row.status].join(' ')
  return /win|loss|push|void|settled/i.test(marker)
}

function keyOf(row = {}) {
  return [row.Date || row.date, row.League || row.league || row.Sport || row.sport, row.Game || row.game, row.Pick || row.pick, row.Odds || row.odds]
    .map(value => String(value || '').toLowerCase())
    .join('|')
}

function mergeRows(first = [], second = []) {
  const map = new Map()
  for (const row of [...first, ...second]) {
    if (!row || !(row.Pick || row.pick) || hasSettlement(row)) continue
    map.set(keyOf(row), row)
  }
  return [...map.values()]
}

const emptyStats = { wins: 0, losses: 0, pushes: 0, record: '0-0', units: '+0.00u', netUnits: 0, winRate: '0%' }

export default async function handler(req, res) {
  let upstream = {}
  try {
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(req.query || {})) {
      if (value !== undefined && value !== null) params.set(key, String(value))
    }
    const target = `https://www.mickspicks.us/api/todays-picks${params.toString() ? `?${params.toString()}` : ''}`
    const response = await fetch(target, { cache: 'no-store' })
    upstream = await response.json().catch(async () => ({ raw: await response.text() }))
  } catch (error) {
    upstream = { ok: false, success: false, error: error.message || String(error) }
  }

  const upstreamRecords = (upstream.records || upstream.rows || []).filter(row => !hasSettlement(row))
  const activeRecords = mergeRows(ACTIVE_PICKS, upstreamRecords)

  res.status(200)
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
  res.end(JSON.stringify({
    ...upstream,
    ok: true,
    success: true,
    source: 'vip-active-picks-no-results',
    activePicks: ACTIVE_PICKS,
    vip: mergeRows(ACTIVE_PICKS, upstream.vip || []),
    rows: activeRecords,
    records: activeRecords,
    picks: activeRecords,
    weeklyResults: WEEKLY_RESULTS,
    results: WEEKLY_RESULTS,
    resultRows: WEEKLY_RESULTS,
    archive: WEEKLY_RESULTS,
    resultsArchive: WEEKLY_RESULTS,
    sectionRecords: emptyStats,
    metrics: { ...(upstream.metrics || {}), ...emptyStats },
    stats: emptyStats
  }))
}
