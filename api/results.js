function r(Date, Sport, League, Game, Pick, BetType, Odds, Grade, Units, Access, Result, ProfitLoss, SettledAt, SettlementSource, Notes, Outcome = Result) {
  const stake = Number(String(Units || '0').replace(/[^0-9.]/g, '')) || 0
  const pl = Number(String(ProfitLoss || '0').replace(/[^0-9+-.]/g, '')) || 0
  const roi = stake ? `${((pl / stake) * 100).toFixed(1)}%` : '0%'
  return {
    Date,
    Sport,
    League,
    Game,
    Pick,
    'Bet Type': BetType,
    Odds,
    Grade,
    Units,
    Access,
    Result,
    Outcome,
    'Profit/Loss': ProfitLoss,
    ROI: pl > 0 ? `+${roi}` : roi,
    'Settled At': SettledAt,
    'Settlement Source': SettlementSource,
    Notes
  }
}

const WEEKLY_RESULTS = [
  r('2026-07-02', 'WNBA', 'WNBA', 'Phoenix Mercury vs Seattle Storm', 'Phoenix Mercury -3.5', 'Spread', '-110', 'B+', '0.75u', 'VIP', 'Win', '+0.68u', '2026-07-03', 'User confirmed Phoenix won by 27 and covered the spread.', 'Phoenix covered comfortably.'),
  r('2026-07-02', 'WNBA', 'WNBA', 'Phoenix Mercury vs Seattle Storm', 'Over 167.5', 'Total', '-110', 'B', '0.50u', 'Free', 'Loss', '-0.50u', '2026-07-03', 'User confirmed Mercury/Storm finished with 157 total points.', 'Over 167.5 lost; final total 157.'),
  r('2026-07-02', 'MLB', 'MLB', 'Los Angeles Angels vs Seattle Mariners', 'Seattle Mariners ML', 'Moneyline', '-130', 'B+', '0.75u', 'VIP', 'Win', '+0.58u', '2026-07-03', 'Mariners beat Angels 1-0.', 'Seattle ML cashed.'),
  r('2026-07-02', 'Soccer', 'FIFA World Cup', 'Portugal vs Croatia', 'Croatia to Qualify', 'To Qualify', '+200', 'C+', '0.25u', 'Free', 'Loss', '-0.25u', '2026-07-03', 'Portugal beat Croatia 2-1 and advanced.', 'Croatia to qualify lost.'),
  r('2026-07-02', 'WNBA', 'WNBA', 'Washington Mystics vs Atlanta Dream', 'Sonia Citron Over 3 Assists', 'Player Prop', '-105', 'B', '0.25u', 'Free', 'Void', '+0.00u', '2026-07-03', 'Sonia Citron did not play due to right knee soreness.', 'Void/DNP.', 'DNP / Void'),
  r('2026-07-02', 'WNBA', 'WNBA', 'Seattle Storm vs Phoenix Mercury', 'Dominique Malonga Over 9 Rebounds', 'Player Prop', '-105', 'B', '0.35u', 'Free', 'Loss', '-0.35u', '2026-07-03', 'User confirmed Dominique Malonga finished with 6 rebounds.', 'Over 9 rebounds lost.'),
  r('2026-07-02', 'MLB', 'MLB', 'Chicago White Sox vs Cleveland Guardians', 'Under 8.5', 'Total', '-110', 'B+', '0.50u', 'Free', 'Loss', '-0.50u', '2026-07-03', 'Guardians beat White Sox 6-5; total 11.', 'Under 8.5 lost.'),
  r('2026-07-02', 'MLB', 'MLB', 'Miami Marlins vs Colorado Rockies', 'Miami Marlins ML', 'Moneyline', '-132', 'B', '0.35u', 'Free', 'Loss', '-0.35u', '2026-07-03', 'Rockies beat Marlins 14-4.', 'Miami ML lost.'),
  r('2026-07-02', 'MLB', 'MLB', 'Seattle Mariners vs Los Angeles Angels', 'Julio Rodriguez Over Hits', 'Player Prop', '-115', 'B', '0.35u', 'Free', 'Loss', '-0.35u', '2026-07-03', 'Rodriguez walked in the 1st, exited after helmet contact, and no hit was recorded.', 'Standard grade: loss after a plate appearance; check sportsbook injury/void rules.'),
  r('2026-07-02', 'Multi-Sport', 'WNBA/MLB', 'Corrected Safe Lotto 5-Leg', 'Phoenix Mercury -3.5 / Over 167.5 / Seattle Mariners ML / Sonia Citron O3 AST / Dominique Malonga O9 REB', 'Lotto Parlay', '+2300 estimated', 'C+', '0.15u', 'Free', 'Loss', '-0.15u', '2026-07-03', 'Mercury/Storm Over lost and Malonga rebounds leg lost.', 'Parlay loss. Phoenix spread and Mariners ML won, but multiple legs failed.'),

  r('2026-07-03', 'WNBA', 'WNBA', 'Las Vegas Aces vs Chicago Sky', 'Las Vegas Aces -8.5', 'Spread', '-110', 'B+', '0.75u', 'VIP', 'Loss', '-0.75u', '2026-07-04', 'User screenshot: Aces beat Sky 98-90 in OT, margin 8.', 'Aces won by 8 but failed to cover -8.5.'),
  r('2026-07-03', 'MLB', 'MLB', 'St. Louis Cardinals vs Chicago Cubs', 'Under 10.5', 'Total', '-102', 'B+', '0.75u', 'Free', 'Loss', '-0.75u', '2026-07-04', 'Cardinals beat Cubs 17-1; total 18.', 'Under 10.5 lost.'),
  r('2026-07-03', 'MLB', 'MLB', 'Baltimore Orioles vs Cincinnati Reds', 'Baltimore Orioles ML', 'Moneyline', '-123', 'B+', '0.75u', 'Free', 'Win', '+0.61u', '2026-07-04', 'Orioles beat Reds 3-0.', 'Baltimore ML cashed.'),
  r('2026-07-03', 'MLB', 'MLB', 'Tampa Bay Rays vs Houston Astros', 'Tampa Bay Rays ML', 'Moneyline', '-115', 'B+', '0.75u', 'Free', 'Win', '+0.65u', '2026-07-04', 'Rays beat Astros 3-1.', 'Tampa Bay ML cashed.'),
  r('2026-07-03', 'MLB', 'MLB', 'Miami Marlins vs Athletics', 'Athletics ML', 'Moneyline', '-135', 'B', '0.50u', 'Free', 'Loss', '-0.50u', '2026-07-04', 'Marlins beat Athletics 12-5.', 'Athletics ML lost.'),
  r('2026-07-03', 'MLB', 'MLB', 'Milwaukee Brewers vs Arizona Diamondbacks', 'Milwaukee Brewers ML', 'Moneyline', '-160', 'B', '0.50u', 'Free', 'Win', '+0.31u', '2026-07-04', 'User screenshot: Brewers beat Diamondbacks 7-4 in 11 innings.', 'Brewers ML cashed.'),
  r('2026-07-03', 'Soccer', 'FIFA World Cup', 'Argentina vs Cape Verde', 'Under 2.5 Goals', 'Total', '+125', 'B+', '0.50u', 'Free', 'Win', '+0.63u', '2026-07-04', 'Argentina-Cape Verde finished 1-1 after regulation; standard soccer totals grade on 90 minutes.', 'Under 2.5 won in regulation.'),
  r('2026-07-03', 'MLB', 'MLB', 'San Francisco Giants vs Colorado Rockies', 'Rafael Devers Over 1.5 Total Bases', 'Player Prop', '-117', 'B+', '0.50u', 'Free', 'Win', '+0.43u', '2026-07-04', 'Rafael Devers homered and had two hits vs Rockies.', 'Over 1.5 total bases cashed.'),
  r('2026-07-03', 'MLB', 'MLB', 'New York Mets vs Atlanta Braves', 'Grant Holmes Over 4.5 Strikeouts', 'Player Prop', '-120', 'B', '0.35u', 'Free', 'Loss', '-0.35u', '2026-07-04', 'Grant Holmes finished with 2 strikeouts.', 'Over 4.5 Ks lost.'),
  r('2026-07-03', 'MLB', 'MLB', 'Miami Marlins vs Athletics', 'Nick Kurtz Over 2.5 Hits + Runs + RBIs', 'Player Prop', '+105', 'B', '0.25u', 'Free', 'Win', '+0.26u', '2026-07-04', 'Nick Kurtz singled and homered.', 'Over 2.5 H+R+RBI cashed.'),

  r('2026-07-04', 'Soccer', 'FIFA World Cup', 'Canada vs Morocco / Paraguay vs France', 'Morocco to Advance + France Team Total Over 1.5 Parlay', 'Parlay', '-139', 'B', '0.50u', 'VIP', 'Loss', '-0.50u', '2026-07-05', 'Morocco beat Canada 3-0 and advanced, but France beat Paraguay 1-0; France team total Over 1.5 failed.', 'Parlay lost because France only scored once.'),
  r('2026-07-04', 'Soccer', 'FIFA World Cup', 'Paraguay vs France', 'France Team Total Over 1.5 + Both Teams To Score No', 'Same Game Parlay', '-105', 'B+', '0.75u', 'VIP', 'Loss', '-0.75u', '2026-07-05', 'France beat Paraguay 1-0. BTTS No hit, but France team total Over 1.5 failed.', 'France SGP lost because the team total leg failed.'),
  r('2026-07-04', 'WNBA', 'WNBA', 'Portland Fire vs Seattle Storm', 'Seattle Storm -3.5', 'Spread', '-122', 'B+', '0.50u', 'VIP', 'Loss', '-0.50u', '2026-07-05', 'Portland beat Seattle 77-72.', 'Storm lost outright, so -3.5 failed.'),
  r('2026-07-04', 'MLB', 'MLB', 'Philadelphia Phillies vs Kansas City Royals', 'Under 9', 'Total', '-110', 'B+', '0.50u', 'Free', 'Win', '+0.45u', '2026-07-05', 'Phillies beat Royals 6-1; total landed at 7.', 'Under 9 cashed.'),
  r('2026-07-04', 'WNBA', 'WNBA', 'Golden State Valkyries vs Atlanta Dream', 'Golden State Valkyries +4.5', 'Spread', '-110', 'B+', '0.50u', 'Free', 'Win', '+0.45u', '2026-07-05', 'Golden State beat Atlanta 88-83 outright.', 'Valkyries +4.5 cashed with outright win.'),
  r('2026-07-04', 'WNBA', 'WNBA', 'Atlanta Dream vs Golden State Valkyries', 'Angel Reese Over 11.5 Rebounds', 'Player Prop', '-145', 'B-', '0.25u', 'Free', 'Win', '+0.17u', '2026-07-05', 'User box score showed Angel Reese finished with 13 rebounds.', 'Over 11.5 rebounds cashed.'),
  r('2026-07-04', 'MLB', 'MLB', 'Miami Marlins vs Athletics', 'Miami Marlins ML', 'Moneyline', '-130', 'B-', '0.25u', 'Free', 'Win', '+0.19u', '2026-07-05', 'User screenshot showed Marlins beat Athletics 7-2.', 'Miami ML cashed.'),
  r('2026-07-04', 'Multi-Sport', 'FIFA World Cup/MLB/WNBA', 'July 4 Safe Lotto', 'Morocco to Advance / France Team Total Over 1.5 / Phillies-Royals Under 9', 'Lotto Parlay', 'TBD', 'C+', '0.15u', 'Free', 'Loss', '-0.15u', '2026-07-05', 'Morocco and Phillies/Royals Under hit, but France team total Over 1.5 failed.', 'Safe Lotto lost on the France team total leg.'),
  r('2026-07-04', 'Multi-Sport', 'WNBA/MLB', 'July 4 Dog/Defense Lotto', 'Golden State Valkyries +4.5 / Seattle Storm -3.5 / Phillies-Royals Under 9', 'Lotto Parlay', 'TBD', 'C', '0.10u', 'Free', 'Loss', '-0.10u', '2026-07-05', 'Valkyries +4.5 and Phillies/Royals Under hit, but Seattle Storm -3.5 failed.', 'Dog/Defense Lotto lost on the Storm leg.'),

  r('2026-07-05', 'WNBA', 'WNBA', 'Dallas Wings vs Toronto Tempo', 'Dallas Wings -5.5', 'Spread', '-110', 'A-', '1.00u', 'VIP', 'Win', '+0.91u', '2026-07-06', 'Dallas beat Toronto 89-76.', 'Dallas covered -5.5 by 13.'),
  r('2026-07-05', 'WNBA', 'WNBA', 'Indiana Fever vs Las Vegas Aces', 'Las Vegas Aces -3', 'Spread', '-110', 'B+', '0.75u', 'VIP', 'Loss', '-0.75u', '2026-07-06', 'Indiana beat Las Vegas 84-68.', 'Aces lost outright.'),
  r('2026-07-05', 'MLB', 'MLB', 'Detroit Tigers vs Texas Rangers', 'Detroit Tigers ML', 'Moneyline', '-114', 'B+', '0.75u', 'VIP', 'Win', '+0.66u', '2026-07-06', 'Detroit beat Texas 6-3.', 'Tigers ML cashed.'),
  r('2026-07-05', 'Soccer', 'FIFA World Cup', 'England vs Mexico', 'First Half Draw', 'First Half Result', '+100', 'B', '0.35u', 'Free', 'Loss', '-0.35u', '2026-07-06', 'England led 2-1 at halftime.', 'First-half draw lost.'),
  r('2026-07-05', 'MLB', 'MLB', 'Minnesota Twins vs New York Yankees', 'New York Yankees ML', 'Moneyline', '-131', 'B', '0.50u', 'Free', 'Loss', '-0.50u', '2026-07-06', 'Minnesota beat New York 6-1.', 'Yankees ML lost.'),
  r('2026-07-05', 'MLB', 'MLB', 'San Diego Padres vs Los Angeles Dodgers', 'Los Angeles Dodgers -1.5', 'Run Line', 'EVEN', 'B', '0.50u', 'Free', 'Loss', '-0.50u', '2026-07-06', 'San Diego beat Los Angeles 5-2.', 'Dodgers run line lost.'),
  r('2026-07-05', 'MLB', 'MLB', 'San Diego Padres vs Los Angeles Dodgers', 'Fernando Tatis Jr. Home Run Yes', 'Player Prop', '+340', 'C+', '0.10u', 'Free', 'Loss', '-0.10u', '2026-07-06', 'Tatis did not homer.', 'HR prop lost.'),
  r('2026-07-05', 'MLB', 'MLB', 'San Diego Padres vs Los Angeles Dodgers', 'Shohei Ohtani Home Run Yes', 'Player Prop', '+425', 'C+', '0.10u', 'Free', 'Loss', '-0.10u', '2026-07-06', 'Ohtani did not homer.', 'HR prop lost.'),
  r('2026-07-05', 'MLB', 'MLB', 'Philadelphia Phillies vs Kansas City Royals', 'Aaron Nola Over 4.5 Strikeouts', 'Player Prop', '-155', 'B-', '0.25u', 'Free', 'Win', '+0.16u', '2026-07-06', 'Aaron Nola struck out 7.', 'Over 4.5 strikeouts cashed.'),
  r('2026-07-05', 'Multi-Sport', 'WNBA/MLB', 'Wings / Aces / Tigers', 'Dallas Wings ML + Las Vegas Aces ML + Detroit Tigers ML', 'Lotto Parlay', '+230 estimated', 'B-', '0.25u', 'Free', 'Loss', '-0.25u', '2026-07-06', 'Aces ML leg failed.', 'Lotto parlay lost.'),
  r('2026-07-05', 'MLB', 'MLB', 'Yankees / Dodgers / Tigers', 'Yankees ML + Dodgers -1.5 + Tigers ML', 'Lotto Parlay', 'TBD', 'C+', '0.15u', 'Free', 'Loss', '-0.15u', '2026-07-06', 'Yankees ML and Dodgers -1.5 failed.', 'Lotto parlay lost.')
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
  const vipRows = byAccess(WEEKLY_RESULTS, 'vip')
  const vipStats = summary(vipRows)

  res.status(200)
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
  res.end(JSON.stringify({
    ok: true,
    success: true,
    source: 'weekly-results-july-5-graded',
    sourceOfTruth: 'Micks Picks graded tracker',
    updatedAt: new Date().toISOString(),
    date: '2026-07-06',
    week: '2026-07-02-to-2026-07-06',
    resetReason: '',
    archivedPath: '',
    ...stats,
    straightRecord: straightStats.record,
    straightUnits: straightStats.units,
    vipRecord: vipStats.record,
    vipUnits: vipStats.units,
    rows: WEEKLY_RESULTS,
    records: WEEKLY_RESULTS,
    results: WEEKLY_RESULTS,
    allRows: WEEKLY_RESULTS,
    weeklyResults: WEEKLY_RESULTS,
    resultRows: WEEKLY_RESULTS,
    archive: WEEKLY_RESULTS,
    resultsArchive: WEEKLY_RESULTS,
    vip: vipRows,
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
