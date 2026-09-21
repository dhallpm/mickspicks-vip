import reconstructedResults from '../data/reconstructed-results-2026-08-13-15.js'
import results20260823 from '../data/results-2026-08-23.js'
import results20260921, { pendingCards, cardReview } from '../data/results-2026-09-21.js'

const LEGACY_URL = process.env.RESULTS_LEGACY_URL || 'https://mickspicks-vip.vercel.app/api/results-legacy'
const text = value => String(value ?? '').trim()
const numberFrom = value => { if (/^unknown$/i.test(text(value))) return 0; const match=text(value).replace(/,/g,'').match(/[+-]?\d+(?:\.\d+)?/); return match?Number(match[0]):0 }
async function fetchJson(url){ const response=await fetch(url,{headers:{accept:'application/json'},cache:'no-store'}); if(!response.ok)throw new Error(`${url} returned ${response.status}`); return response.json() }
function rowsFrom(payload={}){ for(const key of ['results','rows','records','resultRows','resultsArchive','gradedPicks','settledPicks','allRows']) if(Array.isArray(payload[key]))return payload[key]; return [] }
function strictSection(row={}){ const raw=text(row.section||row.Section||row.resultSection||row.__section||row.category||row.Category); if(/^vip$/i.test(raw))return 'VIP'; if(/props?/i.test(raw))return 'Props Lab'; if(/lotto|parlay/i.test(raw))return 'Lotto Parlays'; if(/longshot/i.test(raw))return 'Longshots'; return 'Free' }
function normalize(row={}){
 const section=strictSection(row),date=text(row.date||row.Date).slice(0,10),sport=text(row.sport||row.Sport),league=text(row.league||row.League||sport),game=text(row.game||row.Game||row.matchup||row.Matchup),pick=text(row.pick||row.Pick||row.cardTitle),odds=text(row.odds||row.Odds),result=text(row.result||row.Result||row.Outcome),status=text(row.status||row.Status||result||'Graded'),profitLoss=text(row.profitLoss||row['Profit/Loss']||row['P/L']||row.PL),grade=text(row.grade||row.Grade||row.rating||row.Rating).toUpperCase(),units=row.units??row.Units??row.unitsRisked??'',access=section==='VIP'?'VIP':text(row.access||row.Access||'Free')
 return {...row,date,Date:date,section,Section:section,access,Access:access,sport,Sport:sport,league,League:league,game,Game:game,pick,Pick:pick,odds,Odds:odds,grade,Grade:grade,result,Result:result,Outcome:result,status,Status:status,units,Units:units,profitLoss,'Profit/Loss':profitLoss,'P/L':profitLoss,PL:profitLoss}
}
function keyOf(row={}){return [row.date,row.section,row.league,row.game,row.pick,row.betType||row['Bet Type']||''].map(v=>text(v).toLowerCase()).join('|')}
function dedupe(rows=[]){return Array.from(new Map(rows.map(row=>[keyOf(row),row])).values())}
function statsFor(rows=[]){
 rows=rows.filter(row=>row.excludeFromRecord!==true)
 const wins=rows.filter(r=>/^win$/i.test(text(r.result))).length
 const losses=rows.filter(r=>/^loss$/i.test(text(r.result))).length
 const pushes=rows.filter(r=>/^(push|void)$/i.test(text(r.result))).length
 const known=rows.filter(r=>r.unitProfitLossKnown!==false&&!/^unknown$/i.test(text(r.profitLoss)))
 const netUnits=known.reduce((s,r)=>s+numberFrom(r.profitLoss),0)
 const risked=rows.reduce((s,r)=>s+Math.max(0,numberFrom(r.units)),0)
 return{wins,losses,pushes,record:`${wins}-${losses}${pushes?`-${pushes}`:''}`,units:`${netUnits>=0?'+':''}${netUnits.toFixed(2)}u`,profitLoss:`${netUnits>=0?'+':''}${netUnits.toFixed(2)}u`,netUnits:Number(netUnits.toFixed(2)),unitsRisked:Number(risked.toFixed(2)),winRate:wins+losses?`${(wins/(wins+losses)*100).toFixed(1)}%`:'--',incompleteUnitRows:rows.length-known.length}
}
export default async function handler(req,res){
 res.setHeader('Content-Type','application/json');res.setHeader('Cache-Control','no-store, no-cache, must-revalidate, max-age=0')
 const warnings=[];let legacy={};try{legacy=await fetchJson(LEGACY_URL)}catch(error){warnings.push(`Legacy results unavailable: ${error.message}`)}
 const results=dedupe([...rowsFrom(legacy).map(normalize),...reconstructedResults.map(normalize),...results20260823.map(normalize),...results20260921.map(normalize)]).sort((a,b)=>String(b.date).localeCompare(String(a.date))||String(b.settledAt||b.timestamp||'').localeCompare(String(a.settledAt||a.timestamp||'')))
 const exact=name=>results.filter(r=>r.section===name),vipRows=exact('VIP'),freeRows=exact('Free'),propsRows=exact('Props Lab'),lottoRows=exact('Lotto Parlays'),longshotRows=exact('Longshots'),stats=statsFor(results)
 const straightRows=[...freeRows,...vipRows]
 const breakdown={overall:stats,vip:statsFor(vipRows),free:statsFor(freeRows),props:statsFor(propsRows),parlays:statsFor(lottoRows),lotto:statsFor(lottoRows),longshots:statsFor(longshotRows)}
 const summary={overall:breakdown.overall,officialStraight:statsFor(straightRows),masterPicks:statsFor(straightRows),vip:breakdown.vip,free:breakdown.free,propsLab:breakdown.props,lottoParlays:breakdown.lotto,longshots:breakdown.longshots,record:stats.record,units:stats.units,profitLoss:stats.profitLoss,winRate:stats.winRate,totalPicks:results.length,gradedPicks:results.length,incompleteUnitRows:stats.incompleteUnitRows,note:'Confirmed Lotto tickets count toward the Lotto win/loss record. Payout-ratio-only tickets do not invent unit P/L.'}
 const latestDate=results.reduce((latest,row)=>row.date>latest?row.date:latest,'')
 res.status(200).json({ok:true,success:true,cardReview,pendingCards,source:'legacy-results-plus-verified-card-grading',sourceOfTruth:'Archived Micks Picks results plus verified reconstructed and current graded results',date:latestDate,warnings,results,rows:results,records:results,resultRows:results,weeklyResults:results,archive:results,resultsArchive:results,gradedPicks:results,settledPicks:results,recentResults:results,latestResults:results,allRows:results,vip:vipRows,free:freeRows,props:propsRows,lotto:lottoRows,longshots:longshotRows,record:stats.record,overallRecord:stats.record,vipRecord:breakdown.vip.record,freeRecord:breakdown.free.record,propsRecord:breakdown.props.record,parlayRecord:breakdown.parlays.record,lottoRecord:breakdown.lotto.record,units:stats.units,totalUnits:stats.units,overallUnits:stats.units,profitLoss:stats.profitLoss,totalProfitLoss:stats.profitLoss,winRate:stats.winRate,stats,metrics:stats,breakdown,sectionRecords:breakdown,recordsBySection:breakdown,postCardAdjustments:Array.isArray(legacy.postCardAdjustments)?legacy.postCardAdjustments:[],reconstruction:{dates:['2026-08-13','2026-08-14','2026-08-15','2026-08-16','2026-08-17','2026-08-19'],rows:reconstructedResults.length,record:statsFor(reconstructedResults).record,knownUnits:statsFor(reconstructedResults).units,incompleteUnitRows:statsFor(reconstructedResults).incompleteUnitRows,note:'Reconstructed rows preserve grades when recoverable; unrecoverable historical grades remain blank rather than invented.'},summary})
}
