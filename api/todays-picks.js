const ACTIVE_PICKS = [
  {
    date: '2026-07-02',
    league: 'WNBA',
    game: 'Phoenix Mercury vs Seattle Storm',
    pick: 'Phoenix Mercury -3.5',
    odds: '-110',
    grade: 'B+',
    units: '0.75u',
    bestNumber: '-3.5',
    line: '-3.5',
    confidence: '8.5/10',
    access: 'VIP',
    section: 'vip',
    status: 'Active',
    releaseStatus: 'VIP Released',
    sportsbook: 'Shop best number',
    noBetCutoff: '-6.5 or worse',
    fullAnalysis: 'Phoenix becomes the cleanest WNBA side on the board after the TSI update. Seattle’s recent form looks strong on paper, but the projection note flags that the Storm’s last-three-game surge came in a home-heavy context, while Seattle has graded materially worse on the road. Phoenix is also trending above its season baseline and grades better against non-playoff-level opponents. With TSI projecting Phoenix -9 against a market of -3.5, there is enough line cushion to make Mercury the preferred side. Micks Verdict: VIP B+, 0.75u. Play to -6. Pass at -6.5 or worse.',
    writeup: 'Phoenix becomes the cleanest WNBA side on the board after the TSI update. Seattle’s recent form looks strong on paper, but the projection note flags that the Storm’s last-three-game surge came in a home-heavy context, while Seattle has graded materially worse on the road. Phoenix is also trending above its season baseline and grades better against non-playoff-level opponents. With TSI projecting Phoenix -9 against a market of -3.5, there is enough line cushion to make Mercury the preferred side. Micks Verdict: VIP B+, 0.75u. Play to -6. Pass at -6.5 or worse.'
  },
  {
    date: '2026-07-02',
    league: 'MLB',
    game: 'Los Angeles Angels vs Seattle Mariners',
    pick: 'Seattle Mariners ML',
    odds: '-130',
    grade: 'B+',
    units: '0.75u',
    bestNumber: '-130',
    line: 'ML',
    confidence: '8.2/10',
    access: 'VIP',
    section: 'vip',
    status: 'Active',
    releaseStatus: 'VIP Released',
    sportsbook: 'Shop best number',
    noBetCutoff: '-145',
    fullAnalysis: 'Seattle has the better pitching-and-bullpen profile in this matchup, which makes the Mariners moneyline the cleanest MLB side from the original card. Bryce Miller gives Seattle a stronger starter path, and the Angels’ staff profile remains more vulnerable late. The run line adds unnecessary variance, so the preferred expression is Mariners ML. Play at -130; pass if the price moves beyond -145.',
    writeup: 'Seattle has the better pitching-and-bullpen profile in this matchup, which makes the Mariners moneyline the cleanest MLB side from the original card. Bryce Miller gives Seattle a stronger starter path, and the Angels’ staff profile remains more vulnerable late. The run line adds unnecessary variance, so the preferred expression is Mariners ML. Play at -130; pass if the price moves beyond -145.'
  }
]

const WEEKLY_RESULTS = []
const emptyStats = { wins: 0, losses: 0, pushes: 0, record: '0-0', units: '+0.00u', netUnits: 0, winRate: '0%' }

function hasSettlement(row = {}) {
  const marker = [row.Result, row.result, row.Outcome, row.outcome, row.Status, row.status].join(' ')
  return /win|loss|push|void|settled/i.test(marker)
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
    source: 'vip-vault-direct-active-picks',
    sourceOfTruth: 'Micks Picks VIP Vault',
    date: '2026-07-02',
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
