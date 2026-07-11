const july8 = [
  { date:'2026-07-08', section:'VIP', access:'VIP', sport:'WNBA', league:'WNBA', game:'Indiana Fever vs Los Angeles Sparks', pick:'Fever -6.5 vs Sparks', odds:'-110', grade:'B+', units:'0.75u', result:'Loss', profitLoss:'-0.75u', 'Profit/Loss':'-0.75u', status:'Graded' },
  { date:'2026-07-08', section:'VIP', access:'VIP', sport:'MLB', league:'MLB', game:'Milwaukee Brewers vs St. Louis Cardinals', pick:'Brewers ML vs Cardinals', odds:'-126', grade:'B+', units:'0.75u', result:'Loss', profitLoss:'-0.75u', 'Profit/Loss':'-0.75u', status:'Graded' },
  { date:'2026-07-08', section:'Free', access:'Free', sport:'MLB', league:'MLB', game:'Boston Red Sox vs Chicago White Sox', pick:'Red Sox ML vs White Sox', odds:'-105', grade:'B+', units:'0.75u', result:'Win', profitLoss:'+0.71u', 'Profit/Loss':'+0.71u', status:'Graded' },
  { date:'2026-07-08', section:'Free', access:'Free', sport:'MLB', league:'MLB', game:'Houston Astros vs Washington Nationals', pick:'Astros/Nationals Over 9', odds:'-110', grade:'B', units:'0.50u', result:'Win', profitLoss:'+0.45u', 'Profit/Loss':'+0.45u', status:'Graded' },
  { date:'2026-07-08', section:'Free', access:'Free', sport:'MLB', league:'MLB', game:'Colorado Rockies vs Los Angeles Dodgers', pick:'Dodgers -1.5 vs Rockies', odds:'-126', grade:'B', units:'0.50u', result:'Loss', profitLoss:'-0.50u', 'Profit/Loss':'-0.50u', status:'Graded' },
  { date:'2026-07-08', section:'Props Lab', access:'Free', sport:'MLB', league:'MLB', game:'Houston Astros vs Washington Nationals', pick:'CJ Abrams O1.5 HRR', odds:'-125', grade:'B', units:'0.50u', result:'Win', profitLoss:'+0.50u', 'Profit/Loss':'+0.50u', status:'Graded' },
  { date:'2026-07-08', section:'Props Lab', access:'Free', sport:'MLB', league:'MLB', game:'Boston Red Sox vs Chicago White Sox', pick:'Jake Bennett O4.5 Ks', odds:'+110', grade:'B', units:'0.50u', result:'Loss', profitLoss:'-0.50u', 'Profit/Loss':'-0.50u', status:'Graded', note:'Bennett finished with 4 strikeouts.' },
  { date:'2026-07-08', section:'Lotto Parlays', access:'Free', sport:'MLB', league:'MLB', game:'Brewers/Cardinals + Red Sox/White Sox', pick:'Brewers ML + Red Sox ML', odds:'TBD', grade:'B-', units:'0.25u', result:'Loss', profitLoss:'-0.25u', 'Profit/Loss':'-0.25u', status:'Graded' },
  { date:'2026-07-08', section:'Lotto Parlays', access:'Free', sport:'WNBA/MLB', league:'WNBA/MLB', game:'Fever/Sparks + Brewers/Cardinals + Red Sox/White Sox', pick:'Fever -6.5 + Brewers ML + Red Sox ML', odds:'TBD', grade:'C+', units:'0.15u', result:'Loss', profitLoss:'-0.15u', 'Profit/Loss':'-0.15u', status:'Graded' },
  { date:'2026-07-08', section:'Lotto Parlays', access:'Free', sport:'MLB', league:'MLB', game:'Dodgers/Rockies + Astros/Nationals', pick:'Dodgers -1.5 + Astros/Nationals Over 9', odds:'TBD', grade:'C', units:'0.10u', result:'Loss', profitLoss:'-0.10u', 'Profit/Loss':'-0.10u', status:'Graded' },
  { date:'2026-07-08', section:'Lotto Parlays', access:'Free', sport:'MLB Props', league:'MLB Props', game:'Props Lotto', pick:'CJ Abrams O1.5 HRR + Jake Bennett O4.5 Ks', odds:'TBD', grade:'C', units:'0.10u', result:'Loss', profitLoss:'-0.10u', 'Profit/Loss':'-0.10u', status:'Graded' }
]

const july10 = [
  { date:'2026-07-10', section:'VIP', access:'VIP', sport:'Soccer', league:'FIFA World Cup', game:'Spain vs Belgium', pick:'Spain to Advance', odds:'-320', grade:'A-', units:'1.00u', result:'Win', profitLoss:'+0.31u', 'Profit/Loss':'+0.31u', status:'Graded', settlementNotes:'Spain won 2-1 and advanced.' },
  { date:'2026-07-10', section:'VIP', access:'VIP', sport:'WNBA', league:'WNBA', game:'Chicago Sky vs Los Angeles Sparks', pick:'Los Angeles Sparks ML', odds:'-115', grade:'A-', units:'1.00u', result:'Win', profitLoss:'+0.87u', 'Profit/Loss':'+0.87u', status:'Graded', settlementNotes:'Los Angeles won 102-87.' },
  { date:'2026-07-10', section:'Free', access:'Free', sport:'WNBA', league:'WNBA', game:'Connecticut Sun vs Golden State Valkyries', pick:'Over 153.5', odds:'', grade:'B+', units:'0.75u', result:'Loss', profitLoss:'-0.75u', 'Profit/Loss':'-0.75u', status:'Graded', settlementNotes:'Golden State won 79-64; total 143.' },
  { date:'2026-07-10', section:'Free', access:'Free', sport:'Basketball', league:'NBA Summer League', game:'Chicago Bulls vs Memphis Grizzlies', pick:'Memphis Grizzlies ML', odds:'-260', grade:'B+', units:'0.75u', result:'Win', profitLoss:'+0.29u', 'Profit/Loss':'+0.29u', status:'Graded', settlementNotes:'Memphis won; graded at -260.' },
  { date:'2026-07-10', section:'Free', access:'Free', sport:'Basketball', league:'NBA Summer League', game:'Miami Heat vs Milwaukee Bucks', pick:'Milwaukee Bucks ML', odds:'-120', grade:'B', units:'0.50u', result:'Loss', profitLoss:'-0.50u', 'Profit/Loss':'-0.50u', status:'Graded', settlementNotes:'Miami won 119-86.' },
  { date:'2026-07-10', section:'Free', access:'Free', sport:'Basketball', league:'NBA Summer League', game:'Toronto Raptors vs Boston Celtics', pick:'Toronto Raptors -2.5', odds:'', grade:'B', units:'0.50u', result:'Loss', profitLoss:'-0.50u', 'Profit/Loss':'-0.50u', status:'Graded', settlementNotes:'Boston won 83-80.' },
  { date:'2026-07-10', section:'Free', access:'Free', sport:'Basketball', league:'NBA Summer League', game:'Indiana Pacers vs Cleveland Cavaliers', pick:'Cleveland Cavaliers -5', odds:'', grade:'B-', units:'0.50u', result:'Loss', profitLoss:'-0.50u', 'Profit/Loss':'-0.50u', status:'Graded', settlementNotes:'Indiana won 99-93.' },
  { date:'2026-07-10', section:'Props Lab', access:'Free', sport:'Soccer', league:'FIFA World Cup', game:'Spain vs Belgium', pick:'Over 2.5 Goals', odds:'-125', grade:'B+', units:'0.50u', result:'Win', profitLoss:'+0.40u', 'Profit/Loss':'+0.40u', status:'Graded', settlementNotes:'Spain won 2-1; total 3.' },
  { date:'2026-07-10', section:'Props Lab', access:'Free', sport:'Soccer', league:'FIFA World Cup', game:'Spain vs Belgium', pick:'Both Teams to Score - Yes', odds:'-125', grade:'B', units:'0.50u', result:'Win', profitLoss:'+0.40u', 'Profit/Loss':'+0.40u', status:'Graded', settlementNotes:'Both teams scored.' },
  { date:'2026-07-10', section:'Props Lab', access:'Free', sport:'Soccer', league:'FIFA World Cup', game:'Spain vs Belgium', pick:'Lamine Yamal Anytime Scorer', odds:'+170', grade:'B', units:'0.50u', result:'Loss', profitLoss:'-0.50u', 'Profit/Loss':'-0.50u', status:'Graded' },
  { date:'2026-07-10', section:'Props Lab', access:'Free', sport:'WNBA', league:'WNBA', game:'Dallas Wings vs Toronto Tempo', pick:'Paige Bueckers Over 5 Assists', odds:'-120', grade:'B', units:'0.50u', result:'Win', profitLoss:'+0.42u', 'Profit/Loss':'+0.42u', status:'Graded', settlementNotes:'Bueckers finished with 6 assists.' },
  { date:'2026-07-10', section:'Lotto Parlays', access:'Free', sport:'Multi-Sport', league:'World Cup / WNBA / NBA Summer League', game:'Spain vs Belgium; Sky vs Sparks; Bulls vs Grizzlies', pick:'Spain to Advance + Sparks ML + Grizzlies ML', odds:'+226', grade:'B+', units:'0.50u', result:'Win', profitLoss:'+1.13u', 'Profit/Loss':'+1.13u', status:'Graded', settlementNotes:'All three legs won at posted odds of +226.' },
  { date:'2026-07-10', section:'Lotto Parlays', access:'Free', sport:'Multi-Sport', league:'World Cup / WNBA', game:'Spain vs Belgium; Sky vs Sparks', pick:'Spain to Advance + Sparks ML', odds:'+135', grade:'A-', units:'0.75u', result:'Win', profitLoss:'+1.01u', 'Profit/Loss':'+1.01u', status:'Graded', settlementNotes:'Both legs won at posted odds of +135.' },
  { date:'2026-07-10', section:'Longshots', access:'Free', sport:'Soccer', league:'FIFA World Cup', game:'Spain vs Belgium', pick:'Kevin De Bruyne Anytime Scorer', odds:'+475', grade:'C+', units:'0.20u', result:'Loss', profitLoss:'-0.20u', 'Profit/Loss':'-0.20u', status:'Graded' },
  { date:'2026-07-10', section:'Longshots', access:'Free', sport:'Soccer', league:'FIFA World Cup', game:'Spain vs Belgium', pick:'Charles De Ketelaere Anytime Scorer', odds:'+495', grade:'C+', units:'0.20u', result:'Win', profitLoss:'+0.99u', 'Profit/Loss':'+0.99u', status:'Graded', settlementNotes:'De Ketelaere scored Belgium’s goal.' }
]

const results = [...july10, ...july8]

function numberFrom(value) {
  if (/profit pending/i.test(String(value || ''))) return 0
  const match = String(value || '').match(/[+-]?\d+(?:\.\d+)?/)
  return match ? Number(match[0]) : 0
}

function statsFor(rows) {
  const wins = rows.filter(r => r.result === 'Win').length
  const losses = rows.filter(r => r.result === 'Loss').length
  const pushes = rows.filter(r => r.result === 'Push' || r.result === 'Void').length
  const units = rows.reduce((sum, r) => sum + numberFrom(r.profitLoss), 0)
  return { wins, losses, pushes, voids:0, record:`${wins}-${losses}${pushes?`-${pushes}`:''}`, units:`${units>=0?'+':''}${units.toFixed(2)}u`, profitLoss:`${units>=0?'+':''}${units.toFixed(2)}u`, netUnits:units, winRate:(wins+losses)?`${(wins/(wins+losses)*100).toFixed(1)}%`:'--' }
}

const section = name => statsFor(results.filter(r => r.section === name))
const stats = statsFor(results)
const breakdown = { overall:stats, vip:section('VIP'), free:section('Free'), props:section('Props Lab'), parlays:section('Lotto Parlays'), lotto:section('Lotto Parlays'), longshots:section('Longshots') }

export default async function handler(req, res) {
  res.setHeader('Content-Type','application/json')
  res.setHeader('Cache-Control','no-store, no-cache, must-revalidate, max-age=0')
  res.status(200).json({
    ok:true, success:true, source:'graded-results-through-july-10-2026', sourceOfTruth:'Micks Picks Final Grading', date:'2026-07-10',
    results, rows:results, records:results, resultRows:results, weeklyResults:results, archive:results, resultsArchive:results, gradedPicks:results, settledPicks:results, recentResults:results, latestResults:results, allRows:results,
    vip:results.filter(r=>r.section==='VIP'), free:results.filter(r=>r.section==='Free'), props:results.filter(r=>r.section==='Props Lab'), lotto:results.filter(r=>r.section==='Lotto Parlays'), longshots:results.filter(r=>r.section==='Longshots'),
    record:stats.record, overallRecord:stats.record, vipRecord:breakdown.vip.record, freeRecord:breakdown.free.record, propsRecord:breakdown.props.record, parlayRecord:breakdown.parlays.record, lottoRecord:breakdown.lotto.record,
    units:stats.units, totalUnits:stats.units, overallUnits:stats.units, profitLoss:stats.profitLoss, totalProfitLoss:stats.profitLoss, winRate:stats.winRate,
    stats, metrics:stats, breakdown, sectionRecords:breakdown, recordsBySection:breakdown,
    summary:{record:stats.record,units:stats.units,profitLoss:stats.profitLoss,winRate:stats.winRate,totalPicks:results.length,gradedPicks:results.length,note:'All known July 10 parlay odds are included.'}
  })
}
