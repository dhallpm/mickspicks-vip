const emptyStats = { wins: 0, losses: 0, pushes: 0, record: '0-0', units: '+0.00u', netUnits: 0, winRate: '0%' }

export default async function handler(req, res) {
  res.status(200)
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
  res.end(JSON.stringify({
    ok: true,
    success: true,
    source: 'vip-vault-cleared-after-july-5-grading',
    sourceOfTruth: 'Micks Picks VIP Vault',
    date: '2026-07-06',
    activePicks: [],
    rows: [],
    records: [],
    picks: [],
    mainPicks: [],
    vip: [],
    vipPicks: [],
    vipVault: [],
    free: [],
    freePicks: [],
    props: [],
    propsLab: [],
    propRows: [],
    playerProps: [],
    parlay: [],
    parlays: [],
    lotto: [],
    lottoParlays: [],
    parlayRows: [],
    watchlist: [],
    mondayHolds: [],
    allRows: [],
    weeklyResults: [],
    results: [],
    resultRows: [],
    archive: [],
    resultsArchive: [],
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
