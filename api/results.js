const WEEKLY_RESULTS = [
  {
    Date: '2026-06-25', Sport: 'MLB', League: 'MLB', Game: 'Yankees at Red Sox', Pick: 'Yankees -1.5', 'Bet Type': 'Run Line', Odds: '+111', Grade: 'A', Units: 1, Result: 'Loss', 'Profit/Loss': '-1.00u', Access: 'VIP', Writeup: 'Red Sox 6, Yankees 3. Yankees run line lost.'
  },
  {
    Date: '2026-06-25', Sport: 'World Cup', League: 'FIFA World Cup', Game: 'Japan vs Sweden', Pick: 'Japan ML', 'Bet Type': 'Moneyline', Odds: '-110', Grade: 'A-', Units: 0.75, Result: 'Loss', 'Profit/Loss': '-0.75u', Access: 'VIP', Writeup: 'Japan 1, Sweden 1. Japan moneyline lost.'
  },
  {
    Date: '2026-06-25', Sport: 'World Cup', League: 'FIFA World Cup', Game: 'Netherlands vs Tunisia', Pick: 'Netherlands -2.5', 'Bet Type': 'Spread', Odds: '-129', Grade: 'A-', Units: 0.75, Result: 'Loss', 'Profit/Loss': '-0.75u', Access: 'VIP', Writeup: 'Netherlands won 3-1 but did not cover -2.5.'
  },
  {
    Date: '2026-06-25', Sport: 'MLB', League: 'MLB', Game: 'Mariners at Pirates', Pick: 'Mariners ML', 'Bet Type': 'Moneyline', Odds: '-150', Grade: 'B+', Units: 0.5, Result: 'Loss', 'Profit/Loss': '-0.50u', Access: 'Free', Writeup: 'Pirates 5, Mariners 1. Mariners moneyline lost.'
  },
  {
    Date: '2026-06-25', Sport: 'MLB', League: 'MLB', Game: 'Mets vs Cubs', Pick: 'Mets ML', 'Bet Type': 'Moneyline', Odds: '-115', Grade: 'B', Units: 0.5, Result: 'Loss', 'Profit/Loss': '-0.50u', Access: 'Free', Writeup: 'Cubs 4, Mets 3 in 10 innings. Mets moneyline lost.'
  },
  {
    Date: '2026-06-25', Sport: 'MLB', League: 'MLB', Game: 'Cardinals vs Diamondbacks', Pick: 'Cardinals ML', 'Bet Type': 'Moneyline', Odds: '-135', Grade: 'B', Units: 0.5, Result: 'Void', 'Profit/Loss': '0.00u', Access: 'Free', Writeup: 'Postponed/rainout. Cardinals moneyline voided.'
  },
  {
    Date: '2026-06-25', Sport: 'World Cup', League: 'FIFA World Cup', Game: 'Curacao vs Ivory Coast', Pick: 'Ivory Coast Win Both Halves', 'Bet Type': 'Prop', Odds: '+100', Grade: 'B+', Units: 0.5, Result: 'Win', 'Profit/Loss': '+0.50u', Access: 'Free', Writeup: 'Ivory Coast won both halves in a 2-0 win.'
  },
  {
    Date: '2026-06-25', Sport: 'World Cup', League: 'FIFA World Cup', Game: 'Japan vs Sweden', Pick: 'Japan Team Total Over 1.5', 'Bet Type': 'Team Total', Odds: '-110', Grade: 'B+', Units: 0.5, Result: 'Loss', 'Profit/Loss': '-0.50u', Access: 'Free', Writeup: 'Japan scored 1 goal. Team total over 1.5 lost.'
  },
  {
    Date: '2026-06-25', Sport: 'World Cup', League: 'FIFA World Cup', Game: 'Netherlands vs Tunisia', Pick: 'Netherlands Team Total Over 2.5', 'Bet Type': 'Team Total', Odds: '-186', Grade: 'B+', Units: 0.5, Result: 'Win', 'Profit/Loss': '+0.27u', Access: 'Free', Writeup: 'Netherlands scored 3 goals. Team total over 2.5 cashed.'
  },
  {
    Date: '2026-06-25', Sport: 'WNBA', League: 'WNBA', Game: 'Sparks at Tempo', Pick: 'Under 179.5', 'Bet Type': 'Total', Odds: '-110', Grade: 'B', Units: 0.5, Result: 'Loss', 'Profit/Loss': '-0.50u', Access: 'Free', Writeup: 'Tempo 125, Sparks 97. Total 222, under lost.'
  },
  {
    Date: '2026-06-25', Sport: 'WNBA', League: 'WNBA', Game: 'Wings at Aces', Pick: 'Over 178.5', 'Bet Type': 'Total', Odds: '-110', Grade: 'B-', Units: 0.35, Result: 'Win', 'Profit/Loss': '+0.32u', Access: 'Free', Writeup: 'Aces 99, Wings 84. Total 183, over cashed.'
  },
  {
    Date: '2026-06-25', Sport: 'WNBA', League: 'WNBA', Game: 'Liberty at Storm', Pick: 'Storm +11.5', 'Bet Type': 'Spread', Odds: '-110', Grade: 'C+', Units: 0.25, Result: 'Win', 'Profit/Loss': '+0.23u', Access: 'Free', Writeup: 'Storm won outright 99-88. Storm +11.5 cashed.'
  },
  {
    Date: '2026-06-25', Sport: 'MLB Props', League: 'MLB Props', Game: 'Yankees at Red Sox', Pick: 'Cam Schlittler Over 6.5 Strikeouts', 'Bet Type': 'Player Prop', Odds: '+102', Grade: 'A-', Units: 0.5, Result: 'Win', 'Profit/Loss': '+0.51u', Access: 'Props', Writeup: 'Schlittler struck out 9. Over 6.5 Ks cashed.'
  },
  {
    Date: '2026-06-25', Sport: 'MLB Props', League: 'MLB Props', Game: 'Mariners at Pirates', Pick: 'Bryce Miller Over 5.5 Strikeouts', 'Bet Type': 'Player Prop', Odds: '+102', Grade: 'B+', Units: 0.35, Result: 'Win', 'Profit/Loss': '+0.36u', Access: 'Props', Writeup: 'Bryce Miller struck out 11. Over 5.5 Ks cashed.'
  },
  {
    Date: '2026-06-25', Sport: 'MLB Props', League: 'MLB Props', Game: 'Cubs at Mets', Pick: 'Matthew Boyd Over 4.5 Strikeouts', 'Bet Type': 'Player Prop', Odds: '+113', Grade: 'B+', Units: 0.35, Result: 'Loss', 'Profit/Loss': '-0.35u', Access: 'Props', Writeup: 'Boyd struck out 4. Over 4.5 Ks lost.'
  },
  {
    Date: '2026-06-25', Sport: 'MLB Props', League: 'MLB Props', Game: 'Astros at Tigers', Pick: 'Yordan Alvarez Over 1.5 Total Bases', 'Bet Type': 'Player Prop', Odds: '-115', Grade: 'B+', Units: 0.35, Result: 'Loss', 'Profit/Loss': '-0.35u', Access: 'Props', Writeup: 'Alvarez did not clear 1.5 total bases.'
  },
  {
    Date: '2026-06-25', Sport: 'MLB Props', League: 'MLB Props', Game: 'Phillies at Nationals', Pick: 'Bryce Harper Over 1.5 Total Bases', 'Bet Type': 'Player Prop', Odds: '+102', Grade: 'B+', Units: 0.35, Result: 'Win', 'Profit/Loss': '+0.36u', Access: 'Props', Writeup: 'Harper homered. Over 1.5 total bases cashed.'
  },
  {
    Date: '2026-06-25', Sport: 'MLB Props', League: 'MLB Props', Game: 'Athletics at Giants', Pick: 'Nick Kurtz Over 1.5 Hits + Runs + RBIs', 'Bet Type': 'Player Prop', Odds: '-103', Grade: 'B', Units: 0.25, Result: 'Win', 'Profit/Loss': '+0.24u', Access: 'Props', Writeup: 'Nick Kurtz HRR prop was confirmed as a win.'
  },
  {
    Date: '2026-06-25', Sport: 'Parlay', League: 'Micks Picks Parlays', Game: 'Safe 3-Leg', Pick: 'Yankees ML / Japan ML / Mariners ML', 'Bet Type': 'Parlay', Odds: 'TBD', Grade: 'B+', Units: 0.25, Result: 'Loss', 'Profit/Loss': '-0.25u', Access: 'Parlay', Writeup: 'Parlay busted.'
  },
  {
    Date: '2026-06-25', Sport: 'Parlay', League: 'Micks Picks Parlays', Game: 'VIP Value Parlay', Pick: 'Yankees -1.5 / Japan ML / Netherlands -2.5', 'Bet Type': 'Parlay', Odds: 'TBD', Grade: 'B', Units: 0.15, Result: 'Loss', 'Profit/Loss': '-0.15u', Access: 'Parlay', Writeup: 'Parlay busted.'
  },
  {
    Date: '2026-06-25', Sport: 'Parlay', League: 'Micks Picks Parlays', Game: 'World Cup 3-Leg', Pick: 'Japan ML / Netherlands -2.5 / Ivory Coast Win Both Halves', 'Bet Type': 'Parlay', Odds: 'TBD', Grade: 'B', Units: 0.15, Result: 'Loss', 'Profit/Loss': '-0.15u', Access: 'Parlay', Writeup: 'Parlay busted.'
  },
  {
    Date: '2026-06-25', Sport: 'Parlay', League: 'Micks Picks Parlays', Game: 'Props Parlay', Pick: 'Cam Schlittler Over 6.5 Ks / Bryce Miller Over 5.5 Ks / Bryce Harper Over 1.5 TB', 'Bet Type': 'Parlay', Odds: '+2376', Grade: 'B-', Units: 0.1, Result: 'Win', 'Profit/Loss': '+2.38u', Access: 'Parlay', Writeup: 'All three prop legs cashed. Parlay odds +2376.'
  }
]

function resultOf(row) {
  return String(row.Result || '').trim()
}

export default async function handler(req, res) {
  const rows = WEEKLY_RESULTS
  const vip = rows.filter(row => /vip|premium|member/i.test(String(row.Access || '')))
  const wins = rows.filter(row => resultOf(row) === 'Win').length
  const losses = rows.filter(row => resultOf(row) === 'Loss').length
  const pushes = rows.filter(row => /Push|Void/i.test(resultOf(row))).length
  const units = rows.reduce((sum, row) => {
    const match = String(row['Profit/Loss'] || '').replace(/,/g, '').match(/[+-]?\d+(?:\.\d+)?/)
    return sum + (match ? Number(match[0]) : 0)
  }, 0)

  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
  res.status(200).json({
    success: true,
    source: 'weekly-results-static',
    updatedAt: '2026-06-27',
    record: `${wins}-${losses}${pushes ? '-' + pushes : ''}`,
    units: `${units >= 0 ? '+' : ''}${units.toFixed(2)}u`,
    rows,
    records: rows,
    results: rows,
    allRows: rows,
    vip
  })
}
