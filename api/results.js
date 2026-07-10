const results = [
  { date: '2026-07-08', section: 'VIP', sport: 'WNBA', league: 'WNBA', game: 'Indiana Fever vs Los Angeles Sparks', pick: 'Fever -6.5 vs Sparks', odds: '-110', grade: 'B+', units: '0.75u', stake: '0.75u', result: 'Loss', 'Profit/Loss': '-0.75u', 'P/L': '-0.75u', profitLoss: '-0.75u', pl: '-0.75u', netUnits: -0.75, status: 'Graded' },
  { date: '2026-07-08', section: 'VIP', sport: 'MLB', league: 'MLB', game: 'Milwaukee Brewers vs St. Louis Cardinals', pick: 'Brewers ML vs Cardinals', odds: '-126', grade: 'B+', units: '0.75u', stake: '0.75u', result: 'Loss', 'Profit/Loss': '-0.75u', 'P/L': '-0.75u', profitLoss: '-0.75u', pl: '-0.75u', netUnits: -0.75, status: 'Graded' },
  { date: '2026-07-08', section: 'Free', sport: 'MLB', league: 'MLB', game: 'Boston Red Sox vs Chicago White Sox', pick: 'Red Sox ML vs White Sox', odds: '-105', grade: 'B+', units: '0.75u', stake: '0.75u', result: 'Win', 'Profit/Loss': '+0.71u', 'P/L': '+0.71u', profitLoss: '+0.71u', pl: '+0.71u', netUnits: 0.71, status: 'Graded' },
  { date: '2026-07-08', section: 'Free', sport: 'MLB', league: 'MLB', game: 'Houston Astros vs Washington Nationals', pick: 'Astros/Nationals Over 9', odds: '-110', grade: 'B', units: '0.50u', stake: '0.50u', result: 'Win', 'Profit/Loss': '+0.45u', 'P/L': '+0.45u', profitLoss: '+0.45u', pl: '+0.45u', netUnits: 0.45, status: 'Graded' },
  { date: '2026-07-08', section: 'Free', sport: 'MLB', league: 'MLB', game: 'Colorado Rockies vs Los Angeles Dodgers', pick: 'Dodgers -1.5 vs Rockies', odds: '-126', grade: 'B', units: '0.50u', stake: '0.50u', result: 'Loss', 'Profit/Loss': '-0.50u', 'P/L': '-0.50u', profitLoss: '-0.50u', pl: '-0.50u', netUnits: -0.50, status: 'Graded' },
  { date: '2026-07-08', section: 'Props', sport: 'MLB', league: 'MLB', game: 'Houston Astros vs Washington Nationals', pick: 'CJ Abrams O1.5 HRR', odds: '-125', grade: 'B', units: '0.50u', stake: '0.50u', result: 'Win', 'Profit/Loss': '+0.50u', 'P/L': '+0.50u', profitLoss: '+0.50u', pl: '+0.50u', netUnits: 0.50, status: 'Graded' },
  { date: '2026-07-08', section: 'Props', sport: 'MLB', league: 'MLB', game: 'Boston Red Sox vs Chicago White Sox', pick: 'Jake Bennett O4.5 Ks', odds: '+110', grade: 'B', units: '0.50u', stake: '0.50u', result: 'Loss', 'Profit/Loss': '-0.50u', 'P/L': '-0.50u', profitLoss: '-0.50u', pl: '-0.50u', netUnits: -0.50, status: 'Graded', note: 'Bennett finished with 4 strikeouts.' },
  { date: '2026-07-08', section: 'Lotto', sport: 'MLB', league: 'MLB', game: 'Brewers/Cardinals + Red Sox/White Sox', pick: 'Brewers ML + Red Sox ML', odds: 'TBD', grade: 'B-', units: '0.25u', stake: '0.25u', result: 'Loss', 'Profit/Loss': '-0.25u', 'P/L': '-0.25u', profitLoss: '-0.25u', pl: '-0.25u', netUnits: -0.25, status: 'Graded' },
  { date: '2026-07-08', section: 'Lotto', sport: 'WNBA/MLB', league: 'WNBA/MLB', game: 'Fever/Sparks + Brewers/Cardinals + Red Sox/White Sox', pick: 'Fever -6.5 + Brewers ML + Red Sox ML', odds: 'TBD', grade: 'C+', units: '0.15u', stake: '0.15u', result: 'Loss', 'Profit/Loss': '-0.15u', 'P/L': '-0.15u', profitLoss: '-0.15u', pl: '-0.15u', netUnits: -0.15, status: 'Graded' },
  { date: '2026-07-08', section: 'Lotto', sport: 'MLB', league: 'MLB', game: 'Dodgers/Rockies + Astros/Nationals', pick: 'Dodgers -1.5 + Astros/Nationals Over 9', odds: 'TBD', grade: 'C', units: '0.10u', stake: '0.10u', result: 'Loss', 'Profit/Loss': '-0.10u', 'P/L': '-0.10u', profitLoss: '-0.10u', pl: '-0.10u', netUnits: -0.10, status: 'Graded' },
  { date: '2026-07-08', section: 'Lotto', sport: 'MLB Props', league: 'MLB Props', game: 'Props Lotto', pick: 'CJ Abrams O1.5 HRR + Jake Bennett O4.5 Ks', odds: 'TBD', grade: 'C', units: '0.10u', stake: '0.10u', result: 'Loss', 'Profit/Loss': '-0.10u', 'P/L': '-0.10u', profitLoss: '-0.10u', pl: '-0.10u', netUnits: -0.10, status: 'Graded' }
]

const stats = {
  wins: 3,
  losses: 8,
  pushes: 0,
  voids: 0,
  record: '3-8',
  units: '-1.44u',
  profitLoss: '-1.44u',
  'Profit/Loss': '-1.44u',
  'P/L': '-1.44u',
  netUnits: -1.44,
  winRate: '27.3%',
  roi: '-29.7%'
}

const breakdown = {
  overall: stats,
  straight: { wins: 2, losses: 3, pushes: 0, voids: 0, record: '2-3', units: '-0.84u', profitLoss: '-0.84u', netUnits: -0.84, winRate: '40.0%', roi: '-25.8%' },
  vip: { wins: 0, losses: 2, pushes: 0, voids: 0, record: '0-2', units: '-1.50u', profitLoss: '-1.50u', netUnits: -1.50, winRate: '0.0%', roi: '-100.0%' },
  free: { wins: 2, losses: 1, pushes: 0, voids: 0, record: '2-1', units: '+0.66u', profitLoss: '+0.66u', netUnits: 0.66, winRate: '66.7%', roi: '+37.7%' },
  props: { wins: 1, losses: 1, pushes: 0, voids: 0, record: '1-1', units: '+0.00u', profitLoss: '+0.00u', netUnits: 0.00, winRate: '50.0%', roi: '0.0%' },
  parlays: { wins: 0, losses: 4, pushes: 0, voids: 0, record: '0-4', units: '-0.60u', profitLoss: '-0.60u', netUnits: -0.60, winRate: '0.0%', roi: '-100.0%' },
  lotto: { wins: 0, losses: 4, pushes: 0, voids: 0, record: '0-4', units: '-0.60u', profitLoss: '-0.60u', netUnits: -0.60, winRate: '0.0%', roi: '-100.0%' },
  longshots: { wins: 0, losses: 4, pushes: 0, voids: 0, record: '0-4', units: '-0.60u', profitLoss: '-0.60u', netUnits: -0.60, winRate: '0.0%', roi: '-100.0%' }
}

function payload() {
  return {
    ok: true,
    success: true,
    source: 'graded-results-july-8-2026-profit-loss-aliases',
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
    profitLoss: stats.profitLoss,
    totalProfitLoss: stats.profitLoss,
    overallProfitLoss: stats.profitLoss,
    'Profit/Loss': stats.profitLoss,
    'P/L': stats.profitLoss,
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
    summary: { record: stats.record, units: stats.units, profitLoss: stats.profitLoss, winRate: stats.winRate, roi: stats.roi, totalPicks: 11, gradedPicks: 11 }
  }
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Expires', '0')
  res.status(200).json(payload())
}
