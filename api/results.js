const WEEKLY_RESULTS = []

function summary(rows) {
  const wins = rows.filter(row => String(row.Result || '').trim() === 'Win').length
  const losses = rows.filter(row => String(row.Result || '').trim() === 'Loss').length
  const pushes = rows.filter(row => /Push|Void/i.test(String(row.Result || '').trim())).length
  const units = rows.reduce((sum, row) => {
    const match = String(row['Profit/Loss'] || '').replace(/,/g, '').match(/[+-]?\d+(?:\.\d+)?/)
    return sum + (match ? Number(match[0]) : 0)
  }, 0)

  return {
    wins,
    losses,
    pushes,
    record: `${wins}-${losses}${pushes ? `-${pushes}` : ''}`,
    units: `${units >= 0 ? '+' : ''}${units.toFixed(2)}u`,
    totalUnits: `${units >= 0 ? '+' : ''}${units.toFixed(2)}u`,
    winRate: wins + losses ? `${Math.round((wins / (wins + losses)) * 100)}%` : '0%',
    roi: '0%'
  }
}

export default async function handler(req, res) {
  const stats = summary(WEEKLY_RESULTS)

  res.status(200)
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
  res.end(JSON.stringify({
    ok: true,
    success: true,
    source: 'weekly-results-reset',
    sourceOfTruth: 'archived-weekly-results',
    updatedAt: new Date().toISOString(),
    resetReason: 'Wednesday weekly reset: prior results archived and removed from public results board.',
    archivedPath: 'results-archive/weekly-results-2026-06-24-to-2026-07-01.json',
    ...stats,
    rows: WEEKLY_RESULTS,
    records: WEEKLY_RESULTS,
    results: WEEKLY_RESULTS,
    allRows: WEEKLY_RESULTS,
    weeklyResults: WEEKLY_RESULTS,
    resultRows: WEEKLY_RESULTS,
    archive: WEEKLY_RESULTS,
    resultsArchive: WEEKLY_RESULTS,
    vip: [],
    free: [],
    props: [],
    lotto: [],
    longshots: [],
    sectionRecords: stats,
    metrics: stats,
    stats
  }))
}
