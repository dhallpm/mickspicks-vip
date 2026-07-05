const ACTIVE_PICKS = []

const WEEKLY_RESULTS = []
const emptyStats = { wins: 0, losses: 0, pushes: 0, record: '0-0', units: '+0.00u', netUnits: 0, winRate: '0%' }

function hasSettlement(row = {}) {
  const marker = [row.Result, row.result, row.Outcome, row.outcome, row.Status, row.status].join(' ')
  return /win|loss|push|void|settled|graded/i.test(marker)
}

function activeRows(rows = []) {
  return rows.filter(row => row && (row.pick || row.Pick) && !hasSettlement(row))
}

export default async function handler(req, res) {
  const active = activeRows(ACTIVE_PICKS)
  res.status(200)
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
  res.end(JSON.stringify({
    ok: true,
    success: true,
    source: 'vip-vault-july-4-settled-archived',
    sourceOfTruth: 'Micks Picks VIP Vault',
    date: '2026-07-05',
    activePicks: active,
    vip: active,
    vipVault: active,
    rows: active,
    records: active,
    picks: active,
    weeklyResults: WEEKLY_RESULTS,
    results: WEEKLY_RESULTS,
    resultRows: WEEKLY_RESULTS,
    archive: WEEKLY_RESULTS,
    resultsArchive: WEEKLY_RESULTS,
    record: emptyStats.record,
    overallRecord: emptyStats.record,
    units: emptyStats.units,
    totalUnits: emptyStats.units,
    winRate: emptyStats.winRate,
    sectionRecords: emptyStats,
    metrics: emptyStats,
    stats: emptyStats
  }))
}
