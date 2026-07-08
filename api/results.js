const emptyStats = {
  wins: 0,
  losses: 0,
  pushes: 0,
  voids: 0,
  record: '0-0',
  units: '+0.00u',
  netUnits: 0,
  winRate: '0%',
  roi: '0%'
}

const emptyBreakdown = {
  overall: emptyStats,
  straight: emptyStats,
  vip: emptyStats,
  free: emptyStats,
  props: emptyStats,
  parlays: emptyStats,
  lotto: emptyStats,
  longshots: emptyStats
}

function emptyResultsPayload() {
  return {
    ok: true,
    success: true,
    source: 'weekly-results-purge-2026-07-06',
    sourceOfTruth: 'Micks Picks Results Reset',
    date: '2026-07-06',
    resetType: 'weekly-webpage-results-purge',
    warnings: [],

    results: [],
    resultRows: [],
    weeklyResults: [],
    rows: [],
    records: [],
    archive: [],
    resultsArchive: [],
    gradedPicks: [],
    settledPicks: [],
    recentResults: [],
    latestResults: [],
    allRows: [],

    record: emptyStats.record,
    overallRecord: emptyStats.record,
    straightRecord: emptyStats.record,
    vipRecord: emptyStats.record,
    freeRecord: emptyStats.record,
    propsRecord: emptyStats.record,
    parlayRecord: emptyStats.record,
    lottoRecord: emptyStats.record,

    units: emptyStats.units,
    totalUnits: emptyStats.units,
    overallUnits: emptyStats.units,
    straightUnits: emptyStats.units,
    vipUnits: emptyStats.units,
    freeUnits: emptyStats.units,
    propsUnits: emptyStats.units,
    parlayUnits: emptyStats.units,
    lottoUnits: emptyStats.units,

    winRate: emptyStats.winRate,
    roi: emptyStats.roi,
    stats: emptyStats,
    metrics: emptyStats,
    sectionRecords: emptyStats,
    breakdown: emptyBreakdown,
    recordsBySection: emptyBreakdown,
    summary: {
      record: emptyStats.record,
      units: emptyStats.units,
      winRate: emptyStats.winRate,
      roi: emptyStats.roi,
      totalPicks: 0,
      gradedPicks: 0
    }
  }
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Expires', '0')
  res.status(200).json(emptyResultsPayload())
}
