const ACTIVE_PICKS = [
  {
    Date: '2026-06-27',
    Sport: 'UFC',
    League: 'UFC Baku',
    Game: 'Rafael Fiziev vs Manuel Torres',
    Pick: 'Manuel Torres ML',
    'Bet Type': 'Moneyline',
    Odds: '+100',
    Grade: 'A-',
    Units: 0.75,
    Status: 'Released',
    Result: '',
    'Profit/Loss': '',
    Access: 'VIP',
    Tier: 'VIP',
    vip: true,
    'Best Number': '+100 or better',
    Cutoff: '-115',
    Writeup: 'Torres is the value side in the UFC main event. The model likes his power, pace, and finishing upside at a near pick’em price.',
    'Full Analysis': 'Manuel Torres ML is the UFC value play at pick’em pricing. The edge comes from Torres’ finishing profile and striking efficiency against Rafael Fiziev, who has been in a rough recent form cycle and has been finished multiple times. Torres brings higher output, more early finishing upside, and a dangerous first-round pressure style that can punish Fiziev if exchanges stay at distance. My projection makes Torres closer to a small favorite, around -125, so +100 gives usable line value. Best number is plus money; playable to -115. The main risk is sample size because Torres’ UFC fights have been short, and Fiziev still owns elite technical striking with the ability to mix in takedowns if needed.',
    Analysis: 'Manuel Torres ML is the UFC value play at pick’em pricing. The edge comes from Torres’ finishing profile and striking efficiency against Rafael Fiziev, who has been in a rough recent form cycle and has been finished multiple times. Torres brings higher output, more early finishing upside, and a dangerous first-round pressure style that can punish Fiziev if exchanges stay at distance. My projection makes Torres closer to a small favorite, around -125, so +100 gives usable line value. Best number is plus money; playable to -115. The main risk is sample size because Torres’ UFC fights have been short, and Fiziev still owns elite technical striking with the ability to mix in takedowns if needed.'
  }
]

const WEEKLY_RESULTS = [
  { Date:'2026-06-24', Sport:'MLB', League:'MLB', Game:'Braves at Padres', Pick:'Braves ML', Odds:'-115', Grade:'A-', Units:0.75, Result:'Loss', 'Profit/Loss':'-0.75u', Access:'VIP' },
  { Date:'2026-06-24', Sport:'MLB', League:'MLB', Game:'Dodgers at Twins', Pick:'Dodgers ML', Odds:'-172', Grade:'B+', Units:0.75, Result:'Win', 'Profit/Loss':'+0.44u', Access:'VIP' },
  { Date:'2026-06-24', Sport:'MLB', League:'MLB', Game:'Brewers at Reds', Pick:'Brewers ML', Odds:'-128', Grade:'B+', Units:0.5, Result:'Win', 'Profit/Loss':'+0.39u', Access:'Free' },
  { Date:'2026-06-24', Sport:'MLB', League:'MLB', Game:'Diamondbacks at Cardinals', Pick:'Diamondbacks ML', Odds:'+100', Grade:'B', Units:0.5, Result:'Win', 'Profit/Loss':'+0.50u', Access:'Free' },
  { Date:'2026-06-24', Sport:'MLB', League:'MLB', Game:'Royals at Rays', Pick:'Under 8', Odds:'-136', Grade:'B', Units:0.5, Result:'Push', 'Profit/Loss':'0.00u', Access:'Free' },
  { Date:'2026-06-24', Sport:'WNBA', League:'WNBA', Game:'Lynx at Mystics', Pick:'Lynx -9.5', Odds:'-110', Grade:'B', Units:0.5, Result:'Loss', 'Profit/Loss':'-0.50u', Access:'Free' },
  { Date:'2026-06-24', Sport:'WNBA', League:'WNBA', Game:'Dream at Valkyries', Pick:'Valkyries +2.5', Odds:'-110', Grade:'B', Units:0.5, Result:'Win', 'Profit/Loss':'+0.45u', Access:'Free' },
  { Date:'2026-06-25', Sport:'MLB', League:'MLB', Game:'Yankees at Red Sox', Pick:'Yankees -1.5', Odds:'+111', Grade:'A', Units:1, Result:'Loss', 'Profit/Loss':'-1.00u', Access:'VIP' },
  { Date:'2026-06-25', Sport:'World Cup', League:'FIFA World Cup', Game:'Japan vs Sweden', Pick:'Japan ML', Odds:'-110', Grade:'A-', Units:0.75, Result:'Loss', 'Profit/Loss':'-0.75u', Access:'VIP' },
  { Date:'2026-06-25', Sport:'World Cup', League:'FIFA World Cup', Game:'Netherlands vs Tunisia', Pick:'Netherlands -2.5', Odds:'-129', Grade:'A-', Units:0.75, Result:'Loss', 'Profit/Loss':'-0.75u', Access:'VIP' },
  { Date:'2026-06-25', Sport:'MLB', League:'MLB', Game:'Mariners at Pirates', Pick:'Mariners ML', Odds:'-150', Grade:'B+', Units:0.5, Result:'Loss', 'Profit/Loss':'-0.50u', Access:'Free' },
  { Date:'2026-06-25', Sport:'MLB', League:'MLB', Game:'Mets vs Cubs', Pick:'Mets ML', Odds:'-115', Grade:'B', Units:0.5, Result:'Loss', 'Profit/Loss':'-0.50u', Access:'Free' },
  { Date:'2026-06-25', Sport:'MLB', League:'MLB', Game:'Cardinals vs Diamondbacks', Pick:'Cardinals ML', Odds:'-135', Grade:'B', Units:0.5, Result:'Void', 'Profit/Loss':'0.00u', Access:'Free' },
  { Date:'2026-06-25', Sport:'World Cup', League:'FIFA World Cup', Game:'Curacao vs Ivory Coast', Pick:'Ivory Coast Win Both Halves', Odds:'+100', Grade:'B+', Units:0.5, Result:'Win', 'Profit/Loss':'+0.50u', Access:'Free' },
  { Date:'2026-06-25', Sport:'World Cup', League:'FIFA World Cup', Game:'Japan vs Sweden', Pick:'Japan Team Total Over 1.5', Odds:'-110', Grade:'B+', Units:0.5, Result:'Loss', 'Profit/Loss':'-0.50u', Access:'Free' },
  { Date:'2026-06-25', Sport:'World Cup', League:'FIFA World Cup', Game:'Netherlands vs Tunisia', Pick:'Netherlands Team Total Over 2.5', Odds:'-186', Grade:'B+', Units:0.5, Result:'Win', 'Profit/Loss':'+0.27u', Access:'Free' },
  { Date:'2026-06-25', Sport:'WNBA', League:'WNBA', Game:'Sparks at Tempo', Pick:'Under 179.5', Odds:'-110', Grade:'B', Units:0.5, Result:'Loss', 'Profit/Loss':'-0.50u', Access:'Free' },
  { Date:'2026-06-25', Sport:'WNBA', League:'WNBA', Game:'Wings at Aces', Pick:'Over 178.5', Odds:'-110', Grade:'B-', Units:0.35, Result:'Win', 'Profit/Loss':'+0.32u', Access:'Free' },
  { Date:'2026-06-25', Sport:'WNBA', League:'WNBA', Game:'Liberty at Storm', Pick:'Storm +11.5', Odds:'-110', Grade:'C+', Units:0.25, Result:'Win', 'Profit/Loss':'+0.23u', Access:'Free' },
  { Date:'2026-06-25', Sport:'MLB Props', League:'MLB Props', Game:'Yankees at Red Sox', Pick:'Cam Schlittler Over 6.5 Strikeouts', Odds:'+102', Grade:'A-', Units:0.5, Result:'Win', 'Profit/Loss':'+0.51u', Access:'Props' },
  { Date:'2026-06-25', Sport:'MLB Props', League:'MLB Props', Game:'Mariners at Pirates', Pick:'Bryce Miller Over 5.5 Strikeouts', Odds:'+102', Grade:'B+', Units:0.35, Result:'Win', 'Profit/Loss':'+0.36u', Access:'Props' },
  { Date:'2026-06-25', Sport:'MLB Props', League:'MLB Props', Game:'Cubs at Mets', Pick:'Matthew Boyd Over 4.5 Strikeouts', Odds:'+113', Grade:'B+', Units:0.35, Result:'Loss', 'Profit/Loss':'-0.35u', Access:'Props' },
  { Date:'2026-06-25', Sport:'MLB Props', League:'MLB Props', Game:'Astros at Tigers', Pick:'Yordan Alvarez Over 1.5 Total Bases', Odds:'-115', Grade:'B+', Units:0.35, Result:'Loss', 'Profit/Loss':'-0.35u', Access:'Props' },
  { Date:'2026-06-25', Sport:'MLB Props', League:'MLB Props', Game:'Phillies at Nationals', Pick:'Bryce Harper Over 1.5 Total Bases', Odds:'+102', Grade:'B+', Units:0.35, Result:'Win', 'Profit/Loss':'+0.36u', Access:'Props' },
  { Date:'2026-06-25', Sport:'MLB Props', League:'MLB Props', Game:'Athletics at Giants', Pick:'Nick Kurtz Over 1.5 Hits + Runs + RBIs', Odds:'-103', Grade:'B', Units:0.25, Result:'Win', 'Profit/Loss':'+0.24u', Access:'Props' },
  { Date:'2026-06-25', Sport:'Parlay', League:'Micks Picks Parlays', Game:'Props Parlay', Pick:'Schlittler Ks / Bryce Miller Ks / Harper TB', Odds:'+2376', Grade:'B-', Units:0.1, Result:'Win', 'Profit/Loss':'+2.38u', Access:'Parlay' }
]

function resultOf(row) { return String(row.Result || row.result || '').trim() }
function units(row) { const m = String(row['Profit/Loss'] || row.profitLoss || row.pl || '').match(/[+-]?\d+(?:\.\d+)?/); return m ? Number(m[0]) : 0 }
function summary(rows) {
  const wins = rows.filter(r => resultOf(r) === 'Win').length
  const losses = rows.filter(r => resultOf(r) === 'Loss').length
  const pushes = rows.filter(r => /Push|Void/i.test(resultOf(r))).length
  const net = rows.reduce((s,r)=>s+units(r),0)
  return { wins, losses, pushes, record: `${wins}-${losses}${pushes ? '-' + pushes : ''}`, units: `${net >= 0 ? '+' : ''}${net.toFixed(2)}u`, netUnits: net, winRate: wins + losses ? `${Math.round((wins/(wins+losses))*100)}%` : '0%' }
}
function keyOf(row) { return [row.Date, row.League || row.Sport, row.Game, row.Pick, row.Odds].map(v => String(v || '').toLowerCase()).join('|') }
function mergeRows(a, b) { const map = new Map(); [...(a || []), ...(b || [])].forEach(row => { if (row && row.Pick) map.set(keyOf(row), row) }); return [...map.values()] }

export default async function handler(req, res) {
  let upstream = {}
  try {
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(req.query || {})) if (value !== undefined && value !== null) params.set(key, String(value))
    const target = `https://www.mickspicks.us/api/todays-picks${params.toString() ? `?${params.toString()}` : ''}`
    const accessToken = String(req.headers?.['cf-access-jwt-assertion'] || '').trim()
    const headers = accessToken ? { 'cf-access-jwt-assertion': accessToken } : {}
    const response = await fetch(target, { cache: 'no-store', headers })
    upstream = await response.json().catch(async () => ({ raw: await response.text() }))
  } catch (error) {
    upstream = { ok: false, success: false, error: error.message || String(error) }
  }
  const stats = summary(WEEKLY_RESULTS)
  const upstreamRecords = upstream.records || upstream.rows || []
  const activeRecords = mergeRows(ACTIVE_PICKS, upstreamRecords)
  const payload = {
    ...upstream,
    ok: true,
    success: true,
    record: stats.record,
    overallRecord: stats.record,
    units: stats.units,
    totalUnits: stats.units,
    winRate: stats.winRate,
    activePicks: ACTIVE_PICKS,
    vip: mergeRows(ACTIVE_PICKS, upstream.vip || []),
    rows: activeRecords,
    records: activeRecords,
    picks: activeRecords,
    weeklyResults: WEEKLY_RESULTS,
    results: WEEKLY_RESULTS,
    resultRows: WEEKLY_RESULTS,
    archive: WEEKLY_RESULTS,
    resultsArchive: WEEKLY_RESULTS,
    sectionRecords: stats,
    metrics: { ...(upstream.metrics || {}), ...stats },
    stats
  }
  res.status(200)
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
  res.end(JSON.stringify(payload))
}