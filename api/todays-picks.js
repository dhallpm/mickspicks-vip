const SETTLED_VALUES = new Set([
  'graded', 'settled', 'final', 'completed', 'complete',
  'win', 'won', 'loss', 'lost', 'push', 'void', 'voided',
  'cancelled', 'canceled'
])

function normalized(value) {
  return String(value || '').trim().toLowerCase()
}

function isActivePick(row = {}) {
  const status = normalized(row.Status || row.status || row['Release Status'])
  const result = normalized(row.Result || row.result || row.Outcome || row.outcome)
  const official = normalized(row['Official Bet'] || row.officialBet)
  if (SETTLED_VALUES.has(status) || SETTLED_VALUES.has(result)) return false
  if (official === 'no') return false
  return true
}

function importPick(row = {}, section, access) {
  const fullAnalysis = row['Full Analysis'] || row.fullAnalysis || row.full || ''
  const bestNumber = row['Best Number'] || row.bestNumber || row.best || ''
  const cutoff = row['No-Bet Cutoff'] || row.noBetCutoff || row.cutoff || ''
  const matchup = row.Matchup || row.matchup || row.Game || row.game || ''
  const pick = row.Pick || row.pick || row.Selection || row.selection || ''
  const sport = row.Sport || row.sport || row.League || row.league || ''
  const line = row.Line || row.line || row.Odds || row.odds || ''
  const grade = row.Grade || row.grade || ''
  const units = Number(row.Units ?? row.units ?? 0)
  const status = row.Status || row.status || 'Pending'
  return {
    ...row, Section: section, section, Access: access, access: access.toLowerCase(),
    Sport: sport, sport, League: sport, league: sport,
    Matchup: matchup, matchup, Game: matchup, game: matchup,
    Pick: pick, pick, Line: line, line, Odds: line, odds: line,
    Grade: grade, grade, Units: units, units, Status: status, status,
    Writeup: row.Writeup || row.writeup || '', writeup: row.Writeup || row.writeup || '',
    'Full Analysis': fullAnalysis, fullAnalysis, full: fullAnalysis,
    'Best Number': bestNumber, bestNumber, best: bestNumber,
    'No-Bet Cutoff': cutoff, noBetCutoff: cutoff, cutoff,
    officialBet: row['Official Bet'] || row.officialBet || 'Yes'
  }
}

const birthdayNote = 'July 12 sports birthdays (Vinícius Júnior, James Rodríguez, Nico Williams, Shai Gilgeous-Alexander, Christian Vieri, etc.) are narrative only and should not be treated as edge.'
const rawVip = [{Section:'VIP',Sport:'WNBA',Matchup:'Toronto Tempo at New York Liberty',Pick:'New York Liberty -6.5',Line:'-6.5',Grade:'A-',Units:1.00,Confidence:'9.0/10',Status:'Pending','Official Bet':'Yes','Best Number':'-6.5 or better','No-Bet Cutoff':'-8',Writeup:'New York owns the strongest two-way matchup profile on the WNBA board. The Liberty have the better interior scoring, defensive ceiling and late-game execution, while Toronto still carries expansion-level volatility over four quarters.','Full Analysis':'Short Take: New York is the premium side because the Liberty combine the best roster, matchup and number balance on today’s board.\n\nWhy This Play: The Liberty have more reliable half-court creation, stronger interior options and the defensive personnel to force Toronto into difficult possessions. The full-game spread offers more value than laying roughly -270 on the moneyline.\n\nMatchup Edge: New York can attack Toronto inside, control the glass and create separation through defensive stops.\n\nMarket and Number Context: -6.5 remains modest relative to the moneyline and projected mismatch.\n\nRisk and Variance: Toronto’s pace and expansion unpredictability create volatility.\n\nFinal Take: Liberty -6.5, Grade A-, 1.00u.'}]
const rawFree = [
{Section:'Free Picks',Sport:'WNBA',Matchup:'Chicago Sky at Dallas Wings',Pick:'Dallas Wings -9.5',Line:'-9.5',Grade:'B+',Units:.75,Status:'Pending','Official Bet':'Yes','Best Number':'-9.5','No-Bet Cutoff':'-11',Writeup:'Dallas has the offensive and depth advantage, but the large spread keeps this below VIP status.','Full Analysis':'Short Take: Dallas is the preferred side, but this remains a controlled position because the market is asking for a near double-digit margin.\n\nWhy This Play: The Wings have more offensive creation and lineup depth.\n\nMarket and Number Context: -9.5 is playable; the value deteriorates quickly above -10.5.\n\nRisk and Variance: Backdoor exposure is significant.\n\nFinal Take: Dallas -9.5, B+, 0.75u.'},
{Section:'Free Picks',Sport:'WNBA',Matchup:'Seattle Storm at Washington Mystics',Pick:'Washington Mystics -5.5',Line:'-5.5',Grade:'B+',Units:.75,Status:'Pending','Official Bet':'Yes','Best Number':'-5.5','No-Bet Cutoff':'-6.5',Writeup:'Washington has the home-court and half-court execution edge in a lower-total matchup.','Full Analysis':'Short Take: Washington is the preferred home favorite, but line movement prevents a higher grade.\n\nMatchup Edge: The Mystics project as the more consistent half-court team.\n\nMarket and Number Context: At -5.5 the play remains viable; above -6.5 the edge is too thin.\n\nRisk and Variance: Seattle’s volatility can create late spread pressure.\n\nFinal Take: Mystics -5.5, B+, 0.75u.'},
{Section:'Free Picks',Sport:'WNBA',Matchup:'Indiana Fever at Las Vegas Aces',Pick:'Las Vegas Aces -4.5',Line:'-4.5',Grade:'B',Units:.5,Status:'Pending','Official Bet':'Yes','Best Number':'-4.5','No-Bet Cutoff':'-6',Writeup:'Las Vegas has the higher late-game execution ceiling and the more dependable offensive structure.','Full Analysis':'Short Take: The Aces are the preferred side at a manageable number.\n\nMatchup Edge: Las Vegas has more reliable shot creation.\n\nMarket and Number Context: -4.5 is fair; the play loses appeal at -6 or higher.\n\nRisk and Variance: Indiana’s scoring ceiling creates backdoor risk.\n\nFinal Take: Aces -4.5, B, 0.50u.'},
{Section:'Free Picks',Sport:'MLB',Matchup:'Arizona Diamondbacks at Los Angeles Dodgers',Pick:'Los Angeles Dodgers -1.5',Line:'-1.5 (-110)',Grade:'B+',Units:.75,Status:'Pending','Official Bet':'Yes','Best Number':'-1.5 at -110','No-Bet Cutoff':'-130',Writeup:'The run line is the better expression than laying roughly -210 on the moneyline.','Full Analysis':'Short Take: Back the Dodgers’ talent edge without paying the heavy moneyline tax.\n\nMatchup Edge: Los Angeles has the deeper offense.\n\nMarket and Number Context: -1.5 at -110 offers better value; do not chase beyond -130.\n\nRisk and Variance: One-run outcomes remain the primary threat.\n\nFinal Take: Dodgers -1.5, B+, 0.75u.'},
{Section:'Free Picks',Sport:'MLB',Matchup:'Kansas City Royals at Baltimore Orioles',Pick:'Baltimore Orioles -1.5',Line:'-1.5 (+130)',Grade:'B',Units:.5,Status:'Pending','Official Bet':'Yes','Best Number':'+130','No-Bet Cutoff':'+110',Writeup:'Baltimore owns the preferred offensive ceiling, and the plus-money run line gives a better payoff than laying the moneyline.','Full Analysis':'Short Take: Use the plus-money run line to express Baltimore’s offensive advantage.\n\nMatchup Edge: The Orioles have more lineup upside.\n\nMarket and Number Context: +130 is attractive enough for a small position.\n\nRisk and Variance: Baltimore can win without covering.\n\nFinal Take: Orioles -1.5, B, 0.50u.'},
{Section:'Free Picks',Sport:'MLB',Matchup:'Houston Astros at Texas Rangers',Pick:'Texas Rangers ML',Line:'-135',Grade:'B',Units:.5,Status:'Pending','Official Bet':'Yes','Best Number':'-135 or better','No-Bet Cutoff':'-150',Writeup:'Texas is the preferred side, but the moneyline is cleaner than requiring a multi-run win.','Full Analysis':'Short Take: Texas is the side, but the moneyline is the proper market.\n\nMatchup Edge: The Rangers have the preferred overall pitching and home-field profile.\n\nMarket and Number Context: -135 is acceptable; avoid beyond -150.\n\nRisk and Variance: Houston has enough quality to keep this tight.\n\nFinal Take: Rangers ML, B, 0.50u.'},
{Section:'Free Picks',Sport:'NBA Summer League',Matchup:'Oklahoma City Thunder vs Golden State Warriors',Pick:'Golden State Warriors -6.5',Line:'-6.5',Grade:'B',Units:.5,Status:'Pending','Official Bet':'Yes','Best Number':'-6.5','No-Bet Cutoff':'-7.5',Writeup:'Golden State projects with the better Summer League depth and shot creation.','Full Analysis':'Short Take: Golden State has the stronger roster profile, but Summer League variance limits confidence.\n\nMatchup Edge: The Warriors have more reliable creation and depth.\n\nMarket and Number Context: -6.5 is playable; above -7.5 the backdoor risk is too costly.\n\nRisk and Variance: Rotations can change rapidly.\n\nFinal Take: Warriors -6.5, B, 0.50u.'},
{Section:'Free Picks',Sport:'NBA Summer League',Matchup:'New Orleans Pelicans vs Phoenix Suns',Pick:'Phoenix Suns -5.5',Line:'-5.5',Grade:'B',Units:.5,Status:'Pending','Official Bet':'Yes','Best Number':'-5.5','No-Bet Cutoff':'-6.5',Writeup:'Phoenix has the preferred roster balance and interior profile.','Full Analysis':'Short Take: Phoenix is the preferred side based on roster balance and size.\n\nMatchup Edge: The Suns should have advantages on the glass.\n\nMarket and Number Context: -5.5 is acceptable; do not chase beyond -6.5.\n\nRisk and Variance: Late substitutions can erase the edge.\n\nFinal Take: Suns -5.5, B, 0.50u.'},
{Section:'Free Picks',Sport:'NBA Summer League',Matchup:'Portland Trail Blazers vs Orlando Magic',Pick:'Orlando Magic -4.5',Line:'-4.5',Grade:'B',Units:.5,Status:'Pending','Official Bet':'Yes','Best Number':'-4.5','No-Bet Cutoff':'-5.5',Writeup:'Orlando has the slight roster and defensive edge.','Full Analysis':'Short Take: Orlando has the cleaner two-way profile at a manageable number.\n\nMatchup Edge: The Magic project to defend more consistently.\n\nMarket and Number Context: -4.5 is playable; pass above -5.5.\n\nRisk and Variance: Summer League lineup changes can swing the result.\n\nFinal Take: Magic -4.5, B, 0.50u.'}
]
const rawPropsLab = [
{Section:'Props Lab',Sport:'WNBA',Matchup:'Toronto Tempo at New York Liberty',Pick:'Liberty First to 10 Points',Line:'-150',Grade:'B',Units:.5,Status:'Pending','Official Bet':'Yes','Best Number':'-150 or better','No-Bet Cutoff':'-165',Writeup:'This isolates New York’s opening matchup and shot-quality advantage without requiring a full-game cover.','Full Analysis':'Short Take: Use New York’s early offensive edge in a short race market.\n\nCashing Path: The Liberty need only establish their interior advantage early.\n\nMarket Context: -150 is acceptable; too expensive beyond -165.\n\nRisk: A slow shooting start can lose the market.\n\nFinal Take: Liberty first to 10, B, 0.50u.'},
{Section:'Props Lab',Sport:'MLB',Matchup:'Arizona Diamondbacks at Los Angeles Dodgers',Pick:'Yes Run First Inning',Line:'-125',Grade:'B',Units:.5,Status:'Pending','Official Bet':'Yes','Best Number':'-125 or better','No-Bet Cutoff':'-135',Writeup:'The 9.5-run total and Dodgers offensive ceiling support early scoring exposure.','Full Analysis':'Short Take: This is the strongest remaining early-offense derivative on the board.\n\nCashing Path: Either lineup can generate a first-inning run.\n\nMarket Context: -125 is playable; do not chase beyond -135.\n\nRisk: Strong opening pitching can beat the setup.\n\nFinal Take: Dodgers/Diamondbacks YRFI, B, 0.50u.'}
]
const rawLottoParlays = [
{Section:'Lotto Parlays',Sport:'Cross-Sport',Matchup:'Liberty / Dodgers',Pick:'Liberty ML + Dodgers ML',Line:'Parlay',Grade:'B+',Units:.5,Status:'Pending','Official Bet':'Yes','Minimum Return':'-105 or better',Writeup:'This combines two expensive favorites without requiring either to cover a spread.','Full Analysis':'Structure: New York Liberty ML plus Los Angeles Dodgers ML.\n\nWhy These Legs: Both teams own substantial talent and matchup advantages.\n\nPrice Requirement: Play only at approximately -105 or better.\n\nRisk: Either upset loses the parlay.\n\nFinal Take: B+, 0.50u.'},
{Section:'Lotto Parlays',Sport:'NBA Summer League',Matchup:'Warriors / Suns',Pick:'Warriors ML + Suns ML',Line:'Parlay',Grade:'B',Units:.25,Status:'Pending','Official Bet':'Yes',Writeup:'The moneylines reduce the late-game spread exposure that regularly appears in Summer League.','Full Analysis':'Structure: Golden State Warriors ML plus Phoenix Suns ML.\n\nWhy These Legs: Both teams are favored based on roster depth and matchup profile.\n\nRisk: Summer League personnel decisions can override normal incentives.\n\nFinal Take: B, 0.25u.'}
]
const rawLongshots=[]
const vip=rawVip.map(r=>importPick(r,'VIP','VIP')).filter(isActivePick)
const free=rawFree.map(r=>importPick(r,'Free Picks','Free')).filter(isActivePick)
const propsLab=rawPropsLab.map(r=>importPick(r,'Props Lab','Free')).filter(isActivePick)
const lottoParlays=rawLottoParlays.map(r=>importPick(r,'Lotto Parlays','Free')).filter(isActivePick)
const longshots=rawLongshots.map(r=>importPick(r,'Longshots','Free')).filter(isActivePick)
const publicRows=[...free,...propsLab,...lottoParlays,...longshots]
const allRows=[...vip,...publicRows]
const straightAndPropsUnits=[...vip,...free,...propsLab].reduce((s,r)=>s+Number(r.Units||0),0)
const parlayUnits=lottoParlays.reduce((s,r)=>s+Number(r.Units||0),0)
const totalUnits=straightAndPropsUnits+parlayUnits
export default function handler(req,res){res.setHeader('Content-Type','application/json');res.setHeader('Cache-Control','no-store, no-cache, must-revalidate, max-age=0');res.setHeader('Pragma','no-cache');res.setHeader('Expires','0');res.status(200).json({ok:true,success:true,source:'micks-picks-july-12-import-normalized',date:'2026-07-12',vip,vipPicks:vip,vipVault:vip,free,freePicks:free,props:propsLab,propsLab,lottoParlays,lotto:lottoParlays,parlays:lottoParlays,longshots,mainPicks:[...vip,...free],activePicks:allRows,rows:allRows,records:allRows,picks:allRows,allRows,publicRows,straightAndPropsUnits:Number(straightAndPropsUnits.toFixed(2)),parlayUnits:Number(parlayUnits.toFixed(2)),totalUnits:Number(totalUnits.toFixed(2)),birthdayNote,importContractVersion:'2026-07-12-v1',message:`${allRows.length} active picks posted for July 12, 2026.`})}