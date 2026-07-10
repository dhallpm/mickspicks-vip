const results = [
  { date: '2026-07-08', section: 'VIP', sport: 'WNBA', pick: 'Fever -6.5 vs Sparks', result: 'Loss', units: '-0.75u', netUnits: -0.75, status: 'Graded' },
  { date: '2026-07-08', section: 'VIP', sport: 'MLB', pick: 'Brewers ML vs Cardinals', result: 'Loss', units: '-0.75u', netUnits: -0.75, status: 'Graded' },
  { date: '2026-07-08', section: 'Free', sport: 'MLB', pick: 'Red Sox ML vs White Sox', result: 'Win', units: '+0.71u', netUnits: 0.71, status: 'Graded' },
  { date: '2026-07-08', section: 'Free', sport: 'MLB', pick: 'Astros/Nationals Over 9', result: 'Win', units: '+0.45u', netUnits: 0.45, status: 'Graded' },
  { date: '2026-07-08', section: 'Free', sport: 'MLB', pick: 'Dodgers -1.5 vs Rockies', result: 'Loss', units: '-0.50u', netUnits: -0.50, status: 'Graded' },
  { date: '2026-07-08', section: 'Props', sport: 'MLB', pick: 'CJ Abrams O1.5 HRR', result: 'Win', units: '+0.40u', netUnits: 0.40, status: 'Graded' },
  { date: '2026-07-08', section: 'Props', sport: 'MLB', pick: 'Jake Bennett O4.5 Ks', result: 'Loss', units: '-0.50u', netUnits: -0.50, status: 'Graded', note: 'Bennett finished with 4 strikeouts.' },
  { date: '2026-07-08', section: 'Lotto', sport: 'MLB', pick: 'Brewers ML + Red Sox ML', result: 'Loss', units: '-0.25u', netUnits: -0.25, status: 'Graded' },
  { date: '2026-07-08', section: 'Lotto', sport: 'WNBA/MLB', pick: 'Fever -6.5 + Brewers ML + Red Sox ML', result: 'Loss', units: '-0.15u', netUnits: -0.15, status: 'Graded' },
  { date: '2026-07-08', section: 'Lotto', sport: 'MLB', pick: 'Dodgers -1.5 + Astros/Nationals Over 9', result: 'Loss', units: '-0.10u', netUnits: -0.10, status: 'Graded' },
  { date: '2026-07-08', section: 'Lotto', sport: 'MLB Props', pick: 'CJ Abrams O1.5 HRR + Jake Bennett O4.5 Ks', result: 'Loss', units: '-0.10u', netUnits: -0.10, status: 'Graded' }
]

const stats = {
  wins: 3,
  losses: 8,
  pushes: 0,
  voids: 0,
  record: '3-8',
  units: '-1.54u',
  netUnits: -1.54,
  winRate: '27.3%',
  roi: '-31.8%'
}

const breakdown = {
  overall: stats,
  straight: { wins: 2, losses: 3, pushes: 0, voids: 0, record: '2-3', units: '-0.83u', netUnits: -0.83, winRate: '40.0%', roi: '-25.5%' },
  vip: { wins: 0, losses: 2, pushes: 0, voids: 0, record: '0-2', units: '-1.50u', netUnits: -1.50, winRate: '0.0%', roi: '-100.0%' },
  free: { wins: 2, losses: 1, pushes: 0, voids: 0, record: '2-1', units: '+0.66u', netUnits: 0.66, winRate: '66.7%', roi: '+37.7%' },
  props: { wins: 1, losses: 1, pushes: 0, voids: 0, record: '1-1', units: '-0.10u', netUnits: -0.10, winRate: '50.0%', roi: '-10.0%' },
  parlays: { wins: 0, losses: 4, pushes: 0, voids: 0, record: '0-4', units: '-0.60u', netUnits: -0.60, winRate: '0.0%', roi: '-100.0%' },
  lotto: { wins: 0, losses: 4, pushes: 0, voids: 0, record: '0-4', units: '-0.60u', netUnits: -0.60, winRate: '0.0%', roi: '-100.0%' },
  longshots: { wins: 0, losses: 4, pushes: 0, voids: 0, record: '0-4', units: '-0.60u', netUnits: -0.60, winRate: '0.0%', roi: '-100.0%' }
}

function payload() {
  return {
    ok: true,
    success: true,
    source: 'graded-results-july-8-2026',
    sourceOfTruth: 'Micks Picks Final Grading',
    date: '2026-07-08',
    results,
    resultRows: results,
    weeklyResults: results,
    rows: results,
    records: results,
    archive: results,
    resultsArchive: results,
    gradedPicks: results,
    settledPicks: results,
    recentResults: results,
    latestResults: results,
    allRows: results,
    record: stats.record,
    overallRecord: stats.record,
    straightRecord: breakdown.straight.record,
    vipRecord: breakdown.vip.record,
    freeRecord: breakdown.free.record,
    propsRecord: breakdown.props.record,
    parlayRecord: breakdown.parlays.record,
    lottoRecord: breakdown.lotto.record,
    units: stats.units,
    totalUnits: stats.units,
    overallUnits: stats.units,
    straightUnits: breakdown.straight.units,
    vipUnits: breakdown.vip.units,
    freeUnits: breakdown.free.units,
    propsUnits: breakdown.props.units,
    parlayUnits: breakdown.parlays.units,
    lottoUnits: breakdown.lotto.units,
    winRate: stats.winRate,
    roi: stats.roi,
    stats,
    metrics: stats,
    sectionRecords: breakdown,
    breakdown,
    recordsBySection: breakdown,
    summary: { record: stats.record, units: stats.units, winRate: stats.winRate, roi: stats.roi, totalPicks: 11, gradedPicks: 11 }
  }
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Expires', '0')
  res.status(200).json(payload())
}
