const ACTIVE_PICKS = [
  {
    date: '2026-07-03',
    sport: 'Soccer',
    league: 'FIFA World Cup',
    category: 'VIP',
    access: 'VIP',
    section: 'vip',
    game: 'France vs Paraguay',
    pick: 'France Team Total Over 1.5 + Both Teams To Score No',
    betType: 'Same Game Parlay',
    bet_type: 'Same Game Parlay',
    pick_type: 'Same Game Parlay',
    odds: '-105',
    units: '0.75u',
    grade: 'B+',
    confidence: '8.3/10',
    bestNumber: '-105',
    best_number: '-105',
    line: '-105',
    playableTo: '-120',
    noBetCutoff: '-125 or worse',
    no_bet_cutoff: '-125 or worse',
    risk: 'Medium',
    status: 'Future',
    releaseStatus: 'VIP Released',
    sportsbook: 'Shop best SGP price',
    projectedEdge: 'Better-priced France win-to-nil style angle',
    shortAnalysis: 'France attack profile plus Paraguay low chance creation creates a cleaner SGP than laying the heavy moneyline.',
    analysis: 'France is the clear class side, but the best expression is not simply laying a heavy moneyline. Paraguay has ridden defensive organization and goalkeeping variance, but the underlying shot and xG numbers suggest their defense has been living dangerously. France has created the best attacking profile in the tournament, while Paraguay has produced very little high-quality attack since the opening match. France team total Over 1.5 paired with Both Teams To Score No is essentially a better-priced France win-to-nil angle.',
    fullAnalysis: `France is the clear class side, but the best expression is not simply laying a heavy moneyline. Paraguay has ridden defensive organization and goalkeeping variance to reach this stage, but the underlying shot and xG numbers suggest their defense has been living dangerously. They have conceded pressure and chances at a rate that is difficult to sustain against the best attacking team left in the tournament.

France has created the strongest attacking profile in the field. The combination of Mbappe, Dembele, Olise, Doue/Barcola and the midfield supply gives France multiple ways to break down a deep block. Paraguay can compete emotionally and physically, but they have not consistently created high-quality chances going forward, which is why the clean-sheet side of this angle matters.

The market makes France very expensive on the moneyline, so the better Micks expression is France Team Total Over 1.5 paired with Both Teams To Score No. It is effectively a better-priced France win-to-nil concept while still requiring France to score at least twice. That matches the tournament profile: France generating volume and Paraguay needing a near-perfect defensive game to stay alive.

Micks Verdict: VIP B+, 0.75u. Best number is -105. Playable to -120. Pass at -125 or worse.`,
    writeup: `France is the clear class side, but the best expression is not simply laying a heavy moneyline. Paraguay has ridden defensive organization and goalkeeping variance, but the underlying shot and xG numbers suggest their defense has been living dangerously. France has created the best attacking profile in the tournament, while Paraguay has produced very little high-quality attack since the opening match. France team total Over 1.5 paired with Both Teams To Score No is essentially a better-priced France win-to-nil angle.`
  }
]

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
    source: 'vip-vault-july-3-aces-archived',
    sourceOfTruth: 'Micks Picks VIP Vault',
    date: '2026-07-04',
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
