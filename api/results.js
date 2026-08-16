const LEGACY_URL = process.env.RESULTS_LEGACY_URL || 'https://mickspicks-vip.vercel.app/api/results-legacy'
const SHEETS_URL = process.env.GOOGLE_SHEETS_RESULTS_URL || 'https://www.mickspicks.us/api/results-source?days=3650'

const text = value => String(value ?? '').trim()
const numberFrom = value => {
  const match = text(value).replace(/,/g, '').match(/[+-]?\d+(?:\.\d+)?/)
  return match ? Number(match[0]) : 0
}

async function fetchJson(url) {
  const response = await fetch(url, { headers: { accept: 'application/json' }, cache: 'no-store' })
  if (!response.ok) throw new Error(`${url} returned ${response.status}`)
  return response.json()
}

function rowsFrom(payload = {}) {
  for (const key of ['results','rows','records','resultRows','resultsArchive','gradedPicks','settledPicks','allRows']) {
    if (Array.isArray(payload[key])) return payload[key]
  }
  return []
}

function strictSection(row = {}) {
  const raw = text(row.section || row.Section || row.resultSection || row.__section || row.category || row.Category)
  if (/^vip$/i.test(raw)) return 'VIP'
  if (/props?/i.test(raw)) return 'Props Lab'
  if (/lotto|parlay/i.test(raw)) return 'Lotto Parlays'
  if (/longshot/i.test(raw)) return 'Longshots'
  return 'Free'
}

function normalize(row = {}) {
  const section = strictSection(row)
  const date = text(row.date || row.Date).slice(0,10)
  const sport = text(row.sport || row.Sport)
  const league = text(row.league || row.League || sport)
  const game = text(row.game || row.Game || row.matchup || row.Matchup)
  const pick = text(row.pick || row.Pick || row.cardTitle)
  const odds = text(row.odds || row.Odds)
  const result = text(row.result || row.Result || row.Outcome)
  const status = text(row.status || row.Status || result || 'Graded')
  const profitLoss = text(row.profitLoss || row['Profit/Loss'] || row['P/L'] || row.PL)
  const units = row.units ?? row.Units ?? row.unitsRisked ?? ''
  const access = section === 'VIP' ? 'VIP' : text(row.access || row.Access || 'Free')
  return {
    ...row,
    date, Date: date,
    section, Section: section,
    access, Access: access,
    sport, Sport: sport,
    league, League: league,
    game, Game: game,
    pick, Pick: pick,
    odds, Odds: odds,
    result, Result: result, Outcome: result,
    status, Status: status,
    units, Units: units,
    profitLoss,
    'Profit/Loss': profitLoss,
    'P/L': profitLoss,
    PL: profitLoss
  }
}

function keyOf(row = {}) {
  return [row.date,row.section,row.league,row.game,row.pick,row.betType || row['Bet Type'] || '']
    .map(value => text(value).toLowerCase()).join('|')
}

function dedupe(rows = []) {
  return Array.from(new Map(rows.map(row => [keyOf(row), row])).values())
}

function statsFor(rows = []) {
  const wins = rows.filter(row => /^win$/i.test(text(row.result))).length
  const losses = rows.filter(row => /^loss$/i.test(text(row.result))).length
  const pushes = rows.filter(row => /^(push|void)$/i.test(text(row.result))).length
  const netUnits = rows.reduce((sum,row) => sum + numberFrom(row.profitLoss), 0)
  const risked = rows.reduce((sum,row) => sum + Math.max(0, numberFrom(row.units)), 0)
  return {
    wins, losses, pushes,
    record: `${wins}-${losses}${pushes ? `-${pushes}` : ''}`,
    units: `${netUnits >= 0 ? '+' : ''}${netUnits.toFixed(2)}u`,
    profitLoss: `${netUnits >= 0 ? '+' : ''}${netUnits.toFixed(2)}u`,
    netUnits: Number(netUnits.toFixed(2)),
    unitsRisked: Number(risked.toFixed(2)),
    winRate: wins + losses ? `${(wins / (wins + losses) * 100).toFixed(1)}%` : '--'
  }
}

export default async function handler(req,res) {
  res.setHeader('Content-Type','application/json')
  res.setHeader('Cache-Control','no-store, no-cache, must-revalidate, max-age=0')

  const warnings = []
  let legacy = {}
  let sheets = {}
  try { legacy = await fetchJson(LEGACY_URL) } catch (error) { warnings.push(`Legacy results unavailable: ${error.message}`) }
  try { sheets = await fetchJson(SHEETS_URL) } catch (error) { warnings.push(`Google Sheets results unavailable: ${error.message}`) }

  const results = dedupe([
    ...rowsFrom(legacy).map(normalize),
    ...rowsFrom(sheets).map(normalize)
  ]).sort((a,b) => String(b.date).localeCompare(String(a.date)) || String(b.settledAt || b.timestamp || '').localeCompare(String(a.settledAt || a.timestamp || '')))

  const exact = name => results.filter(row => row.section === name)
  const vipRows = exact('VIP')
  const freeRows = exact('Free')
  const propsRows = exact('Props Lab')
  const lottoRows = exact('Lotto Parlays')
  const longshotRows = exact('Longshots')
  const stats = statsFor(results)
  const breakdown = {
    overall: stats,
    vip: statsFor(vipRows),
    free: statsFor(freeRows),
    props: statsFor(propsRows),
    parlays: statsFor(lottoRows),
    lotto: statsFor(lottoRows),
    longshots: statsFor(longshotRows)
  }
  const latestDate = results.reduce((latest,row) => row.date > latest ? row.date : latest, '')

  res.status(200).json({
    ok:true, success:true,
    source:'merged-legacy-plus-google-sheets-results',
    sourceOfTruth:'Google Sheets for reconstructed/current results; legacy static archive retained for older history',
    date: latestDate,
    warnings,
    results, rows:results, records:results, resultRows:results, weeklyResults:results,
    archive:results, resultsArchive:results, gradedPicks:results, settledPicks:results,
    recentResults:results, latestResults:results, allRows:results,
    vip:vipRows, free:freeRows, props:propsRows, lotto:lottoRows, longshots:longshotRows,
    record:stats.record, overallRecord:stats.record,
    vipRecord:breakdown.vip.record, freeRecord:breakdown.free.record,
    propsRecord:breakdown.props.record, parlayRecord:breakdown.parlays.record, lottoRecord:breakdown.lotto.record,
    units:stats.units, totalUnits:stats.units, overallUnits:stats.units,
    profitLoss:stats.profitLoss, totalProfitLoss:stats.profitLoss, winRate:stats.winRate,
    stats, metrics:stats, breakdown, sectionRecords:breakdown, recordsBySection:breakdown,
    postCardAdjustments:Array.isArray(legacy.postCardAdjustments) ? legacy.postCardAdjustments : [],
    summary:{
      record:stats.record, units:stats.units, profitLoss:stats.profitLoss, winRate:stats.winRate,
      totalPicks:results.length, gradedPicks:results.length,
      note:'Results combine the preserved historical archive with the Google Sheets results ledger. VIP record uses strict section classification; parlays never count as VIP.'
    }
  })
}
