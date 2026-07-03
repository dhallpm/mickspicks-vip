const WEEKLY_RESULTS = [
  {
    Date: '2026-07-02',
    Sport: 'WNBA',
    League: 'WNBA',
    Game: 'Phoenix Mercury vs Seattle Storm',
    Pick: 'Phoenix Mercury -3.5',
    'Bet Type': 'Spread',
    Odds: '-110',
    Grade: 'B+',
    Units: '0.75u',
    Access: 'VIP',
    Result: 'Win',
    Outcome: 'Win',
    'Profit/Loss': '+0.68u',
    ROI: '+90.9%',
    'Settled At': '2026-07-03',
    'Settlement Source': 'User confirmed Phoenix won by 27 and covered the spread.',
    Notes: 'Phoenix covered comfortably.'
  },
  {
    Date: '2026-07-02',
    Sport: 'WNBA',
    League: 'WNBA',
    Game: 'Phoenix Mercury vs Seattle Storm',
    Pick: 'Over 167.5',
    'Bet Type': 'Total',
    Odds: '-110',
    Grade: 'B',
    Units: '0.50u',
    Access: 'Free',
    Result: 'Loss',
    Outcome: 'Loss',
    'Profit/Loss': '-0.50u',
    ROI: '-100%',
    'Settled At': '2026-07-03',
    'Settlement Source': 'User confirmed Mercury/Storm finished with 157 total points.',
    Notes: 'Over 167.5 lost; final total 157.'
  },
  {
    Date: '2026-07-02',
    Sport: 'MLB',
    League: 'MLB',
    Game: 'Los Angeles Angels vs Seattle Mariners',
    Pick: 'Seattle Mariners ML',
    'Bet Type': 'Moneyline',
    Odds: '-130',
    Grade: 'B+',
    Units: '0.75u',
    Access: 'VIP',
    Result: 'Win',
    Outcome: 'Win',
    'Profit/Loss': '+0.58u',
    ROI: '+76.9%',
    'Settled At': '2026-07-03',
    'Settlement Source': 'Mariners beat Angels 1-0.',
    Notes: 'Seattle ML cashed.'
  },
  {
    Date: '2026-07-02',
    Sport: 'Soccer',
    League: 'FIFA World Cup',
    Game: 'Portugal vs Croatia',
    Pick: 'Croatia to Qualify',
    'Bet Type': 'To Qualify',
    Odds: '+200',
    Grade: 'C+',
    Units: '0.25u',
    Access: 'Free',
    Result: 'Loss',
    Outcome: 'Loss',
    'Profit/Loss': '-0.25u',
    ROI: '-100%',
    'Settled At': '2026-07-03',
    'Settlement Source': 'Portugal beat Croatia 2-1 and advanced.',
    Notes: 'Croatia to qualify lost.'
  },
  {
    Date: '2026-07-02',
    Sport: 'WNBA',
    League: 'WNBA',
    Game: 'Washington Mystics vs Atlanta Dream',
    Pick: 'Sonia Citron Over 3 Assists',
    'Bet Type': 'Player Prop',
    Odds: '-105',
    Grade: 'B',
    Units: '0.25u',
    Access: 'Free',
    Result: 'Void',
    Outcome: 'DNP / Void',
    'Profit/Loss': '+0.00u',
    ROI: '0%',
    'Settled At': '2026-07-03',
    'Settlement Source': 'Sonia Citron did not play due to right knee soreness.',
    Notes: 'Void/DNP.'
  },
  {
    Date: '2026-07-02',
    Sport: 'WNBA',
    League: 'WNBA',
    Game: 'Seattle Storm vs Phoenix Mercury',
    Pick: 'Dominique Malonga Over 9 Rebounds',
    'Bet Type': 'Player Prop',
    Odds: '-105',
    Grade: 'B',
    Units: '0.35u',
    Access: 'Free',
    Result: 'Loss',
    Outcome: 'Loss',
    'Profit/Loss': '-0.35u',
    ROI: '-100%',
    'Settled At': '2026-07-03',
    'Settlement Source': 'User confirmed Dominique Malonga finished with 6 rebounds.',
    Notes: 'Over 9 rebounds lost.'
  },
  {
    Date: '2026-07-02',
    Sport: 'MLB',
    League: 'MLB',
    Game: 'Chicago White Sox vs Cleveland Guardians',
    Pick: 'Under 8.5',
    'Bet Type': 'Total',
    Odds: '-110',
    Grade: 'B+',
    Units: '0.50u',
    Access: 'Free',
    Result: 'Loss',
    Outcome: 'Loss',
    'Profit/Loss': '-0.50u',
    ROI: '-100%',
    'Settled At': '2026-07-03',
    'Settlement Source': 'Guardians beat White Sox 6-5; total 11.',
    Notes: 'Under 8.5 lost.'
  },
  {
    Date: '2026-07-02',
    Sport: 'MLB',
    League: 'MLB',
    Game: 'Miami Marlins vs Colorado Rockies',
    Pick: 'Miami Marlins ML',
    'Bet Type': 'Moneyline',
    Odds: '-132',
    Grade: 'B',
    Units: '0.35u',
    Access: 'Free',
    Result: 'Loss',
    Outcome: 'Loss',
    'Profit/Loss': '-0.35u',
    ROI: '-100%',
    'Settled At': '2026-07-03',
    'Settlement Source': 'Rockies beat Marlins 14-4.',
    Notes: 'Miami ML lost.'
  },
  {
    Date: '2026-07-02',
    Sport: 'MLB',
    League: 'MLB',
    Game: 'Seattle Mariners vs Los Angeles Angels',
    Pick: 'Julio Rodriguez Over Hits',
    'Bet Type': 'Player Prop',
    Odds: '-115',
    Grade: 'B',
    Units: '0.35u',
    Access: 'Free',
    Result: 'Loss',
    Outcome: 'Loss',
    'Profit/Loss': '-0.35u',
    ROI: '-100%',
    'Settled At': '2026-07-03',
    'Settlement Source': 'Rodriguez walked in the 1st, exited after helmet contact, and no hit was recorded.',
    Notes: 'Standard grade: loss after a plate appearance; check sportsbook injury/void rules.'
  },
  {
    Date: '2026-07-02',
    Sport: 'Multi-Sport',
    League: 'WNBA/MLB',
    Game: 'Corrected Safe Lotto 5-Leg',
    Pick: 'Phoenix Mercury -3.5 / Over 167.5 / Seattle Mariners ML / Sonia Citron O3 AST / Dominique Malonga O9 REB',
    'Bet Type': 'Lotto Parlay',
    Odds: '+2300 estimated',
    Grade: 'C+',
    Units: '0.15u',
    Access: 'Free',
    Result: 'Loss',
    Outcome: 'Loss',
    'Profit/Loss': '-0.15u',
    ROI: '-100%',
    'Settled At': '2026-07-03',
    'Settlement Source': 'Mercury/Storm Over lost and Malonga rebounds leg lost.',
    Notes: 'Parlay loss. Phoenix spread and Mariners ML won, but multiple legs failed.'
  }
]

function summary(rows) {
  const gradedRows = rows.filter(row => !/Watchlist/i.test(String(row.Outcome || row.Result || '')))
  const wins = gradedRows.filter(row => String(row.Result || '').trim() === 'Win').length
  const losses = gradedRows.filter(row => String(row.Result || '').trim() === 'Loss').length
  const pushes = gradedRows.filter(row => /Push|Void/i.test(String(row.Result || '').trim())).length
  const units = gradedRows.reduce((sum, row) => {
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

function byAccess(rows, access) {
  return rows.filter(row => String(row.Access || '').toLowerCase() === access)
}

function byBetType(rows, pattern) {
  const re = new RegExp(pattern, 'i')
  return rows.filter(row => re.test(String(row['Bet Type'] || '')))
}

export default async function handler(req, res) {
  const stats = summary(WEEKLY_RESULTS)
  const straightRows = WEEKLY_RESULTS.filter(row => !/Lotto Parlay/i.test(String(row['Bet Type'] || '')))
  const straightStats = summary(straightRows)

  res.status(200)
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
  res.end(JSON.stringify({
    ok: true,
    success: true,
    source: 'weekly-results-july-2-graded',
    sourceOfTruth: 'Micks Picks graded tracker',
    updatedAt: new Date().toISOString(),
    date: '2026-07-03',
    week: '2026-07-02',
    resetReason: '',
    archivedPath: '',
    ...stats,
    straightRecord: straightStats.record,
    straightUnits: straightStats.units,
    rows: WEEKLY_RESULTS,
    records: WEEKLY_RESULTS,
    results: WEEKLY_RESULTS,
    allRows: WEEKLY_RESULTS,
    weeklyResults: WEEKLY_RESULTS,
    resultRows: WEEKLY_RESULTS,
    archive: WEEKLY_RESULTS,
    resultsArchive: WEEKLY_RESULTS,
    vip: byAccess(WEEKLY_RESULTS, 'vip'),
    free: byAccess(WEEKLY_RESULTS, 'free').filter(row => !/Lotto Parlay/i.test(String(row['Bet Type'] || ''))),
    props: byBetType(WEEKLY_RESULTS, 'Player Prop'),
    lotto: byBetType(WEEKLY_RESULTS, 'Lotto Parlay'),
    lottoParlays: byBetType(WEEKLY_RESULTS, 'Lotto Parlay'),
    longshots: [],
    sectionRecords: stats,
    metrics: stats,
    stats
  }))
}
