/* Micks Picks VIP Vault Engine — Google Sheets live feed fix */
const VIP_RECORD_SHEET_ID = '1wber196DbbsSXwcITRXWbIF-IZzOJGwkIKPMIWv0AC4';
const VIP_RECORD_GIDS = {
  master: '1678595374',
  props: '1786223862',
  lotto: '762362650',
  longshots: '1573645110'
};

function vrCsv(gid){ return `https://docs.google.com/spreadsheets/d/${VIP_RECORD_SHEET_ID}/export?format=csv&gid=${gid}&cache=${Date.now()}`; }
function vrEsc(s){ return String(s ?? '').replace(/[&<>"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m])); }
function vrClean(s){ return String(s ?? '').trim().toLowerCase().replace(/[-_]+/g,' ').replace(/\s+/g,' '); }
function vrCompact(s){ return vrClean(s).replace(/[^a-z0-9]/g,''); }
function vrNum(v){ const n = parseFloat(String(v ?? '').replace(/[^0-9.+-]/g,'')); return Number.isFinite(n) ? n : 0; }
function vrHas(v){ return String(v ?? '').trim().length > 0; }
function vrSet(id,v){ const el = document.getElementById(id); if(el) el.textContent = v; }

function vrParseCSV(text){
  const rows=[]; let row=[], cur='', q=false;
  for(let i=0;i<text.length;i++){
    const c=text[i], n=text[i+1];
    if(c==='"' && q && n==='"'){ cur+='"'; i++; }
    else if(c==='"'){ q=!q; }
    else if(c===',' && !q){ row.push(cur); cur=''; }
    else if((c==='\n'||c==='\r') && !q){
      if(cur!=='' || row.length){ row.push(cur); rows.push(row); row=[]; cur=''; }
      if(c==='\r' && n==='\n') i++;
    } else cur += c;
  }
  if(cur!=='' || row.length){ row.push(cur); rows.push(row); }
  return rows;
}

const ALIASES = {
  date:['Date','date'], sport:['Sport','sport'], league:['League','league'], game:['Game','game','Matchup'],
  pick:['Pick','pick','Play'], betType:['Bet Type','market','Market','Type'], odds:['Odds','odds'], sportsbook:['Sportsbook','Book'],
  grade:['Grade','grade'], units:['Units','units'], bestNumber:['Best Number','Line / Number'], noBetCutoff:['No Bet Cutoff'],
  confidence:['Confidence','confidence'], status:['Status','status','Display Status'], releaseStatus:['Release Status','Display Release Status'],
  access:['Access','access','Tier'], featured:['Featured'], officialBet:['Official Bet'], pickOfDayEligible:['Pick of the Day Eligible'],
  writeup:['Writeup','Write Up'], marketNotes:['Market Notes'], injuryNotes:['Injury Notes'], sourceVerification:['Source Verification'],
  fullAnalysis:['Full Analysis'], result:['Result','Outcome'], profitLoss:['Profit/Loss','P/L'], closingNumber:['Closing Number','Closing #'],
  player:['Player','player'], prop:['Prop','prop'], category:['Category'], parlayGroup:['Parlay Group','Correlation Group']
};
function vrNorm(h){ return String(h ?? '').trim().toLowerCase().replace(/\s+/g,' ').replace(/[^\w#/% ]/g,''); }
function vrAlias(headers, aliases){ return headers.find(h => aliases.some(a => vrNorm(a) === vrNorm(h) || vrCompact(a) === vrCompact(h))); }
function vrObjects(rows, source){
  if(!rows.length) return [];
  const headers = rows[0].map(h => String(h ?? '').trim());
  return rows.slice(1).map(r => {
    const raw = {}; headers.forEach((h,i) => raw[h] = String(r[i] ?? '').trim());
    const obj = {_sourceTab:source, _raw:raw};
    Object.entries(ALIASES).forEach(([k, aliases]) => { const real = vrAlias(headers, aliases); obj[k] = real ? String(raw[real] ?? '').trim() : ''; });
    return obj;
  }).filter(r => Object.values(r._raw).some(v => String(v ?? '').trim() !== ''));
}
async function vrRows(gid, source){
  const res = await fetch(vrCsv(gid), {cache:'no-store'});
  const txt = await res.text();
  if(txt.toLowerCase().includes('<html')) throw new Error(source + ' sheet unavailable');
  return vrObjects(vrParseCSV(txt), source);
}

function vrDateVal(v){
  const s=String(v ?? '').trim(); if(!s) return 0;
  let m=s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/); if(m) return new Date(+m[1],+m[2]-1,+m[3]).getTime();
  m=s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})/); if(m){ let y=+m[3]; if(y<100)y+=2000; return new Date(y,+m[1]-1,+m[2]).getTime(); }
  const d=new Date(s); return Number.isNaN(d.getTime()) ? 0 : d.getTime();
}
function vrFmtDate(v){ const t=vrDateVal(v); if(!t) return vrEsc(v); const d=new Date(t); return `${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')}/${d.getFullYear()}`; }
function vrTodayKey(){ const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime(); }
function vrWin(r){ const pl=vrNum(r.profitLoss); if(pl>0) return true; return ['win','won','w'].includes(vrClean(r.result)); }
function vrLoss(r){ const pl=vrNum(r.profitLoss); if(pl<0) return true; return ['loss','lost','l'].includes(vrClean(r.result)); }
function vrClosed(r){ const x=vrClean(`${r.status} ${r.result}`); return vrWin(r)||vrLoss(r)||x.includes('settled')||x.includes('closed')||x.includes('push')||x.includes('void')||x.includes('no bet'); }
function vrNoBet(r){ const x=vrClean(`${r.status} ${r.result} ${r.releaseStatus} ${r.grade} ${r.betType}`); return x.includes('no bet') || x.includes('pass') || x.includes('no release'); }
function vrYes(v){ return /^(yes|true|1|y|featured)$/i.test(String(v ?? '').trim()); }
function vrNo(v){ return /^(no|false|0|n)$/i.test(String(v ?? '').trim()); }
function vrGradeRank(r){ const g=String(r.grade ?? '').trim().toUpperCase(); if(g==='A+')return 5; if(g==='A')return 4; if(g==='A-')return 3; if(g==='B+')return 2; if(g==='B')return 1; return 0; }
function vrActionable(r){
  const st = vrClean(r.status), rel = vrClean(r.releaseStatus), access = vrClean(r.access);
  if(vrClosed(r) || vrNoBet(r)) return false;
  if(!(st === 'pending' || st === 'released' || st === 'active')) return false;
  if(!['vip released','free released','released','pending','active'].includes(rel)) return false;
  if(!vrHas(r.pick) || !vrHas(r.game)) return false;
  if(vrNum(r.units) <= 0) return false;
  if(!vrHas(r.odds) || /^(watchlist|live only|pass|na|n\/a)$/i.test(r.odds)) return false;
  return access === 'vip' || access === 'premium';
}
function vrPickOfDayEligible(r){ return !vrNo(r.pickOfDayEligible) && vrActionable(r) && vrGradeRank(r) >= 1; }
function vrKey(r){ return [r.date,r.league||r.sport,r.game,r.pick,r.betType].map(vrCompact).join('|'); }
function vrDedupe(rows){ const map=new Map(); rows.forEach(r => { const k=vrKey(r); if(!k) return; const old=map.get(k); if(!old || vrHas(r.fullAnalysis) || vrDateVal(r.date) >= vrDateVal(old.date)) map.set(k,r); }); return [...map.values()]; }
function vrSection(r){ const t=vrClean(`${r._sourceTab} ${r.category} ${r.betType} ${r.pick}`); if(t.includes('lotto')||t.includes('parlay')) return 'lotto'; if(t.includes('prop') || vrHas(r.player)) return 'props'; if(t.includes('longshot')) return 'longshots'; return 'picks'; }
function vrSort(a,b){ return vrDateVal(b.date)-vrDateVal(a.date) || vrGradeRank(b)-vrGradeRank(a) || vrNum(b.units)-vrNum(a.units); }
function vrAnalysis(r){ return [r.fullAnalysis, r.writeup, r.marketNotes ? `Market Notes: ${r.marketNotes}` : '', r.injuryNotes ? `Injury Notes: ${r.injuryNotes}` : '', r.noBetCutoff ? `No-Bet Cutoff: ${r.noBetCutoff}` : ''].filter(Boolean).join('\n\n'); }
function vrUnitText(v){ const n=vrNum(v); return n ? `${n}u` : ''; }
function vrResult(r){ if(vrWin(r)) return 'Win'; if(vrLoss(r)) return 'Loss'; const x=vrClean(`${r.result} ${r.status}`); if(x.includes('no bet')) return 'No Bet'; if(x.includes('push')) return 'Push'; if(x.includes('void')) return 'Void'; return r.result || r.status || 'Pending'; }
function vrClass(r){ if(vrWin(r)) return 'status-win'; if(vrLoss(r)) return 'status-loss'; if(vrClean(vrResult(r)).match(/push|void|no bet/)) return 'status-push'; return 'status-pending'; }

function vrPickCard(r){
  return `<div class="pick-card"><div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start"><div><div style="color:var(--muted);font-size:11px;text-transform:uppercase;font-weight:1000;letter-spacing:.9px">${vrEsc(r.league||r.sport||'Sports')} | ${vrEsc(r.betType||'VIP Pick')}</div><div class="pick-title">${vrEsc(r.pick||'Pick Pending')}</div><p style="color:var(--muted);line-height:1.5">${vrEsc(r.game||'')}</p></div><div style="background:linear-gradient(135deg,#9b6d15,#ffe28a 54%,#b98821);color:#090909;padding:9px 11px;border-radius:10px;font-weight:1000">${vrEsc(r.grade||'VIP')}</div></div><div class="metric-grid"><div class="metric"><strong>${vrEsc(r.odds||'--')}</strong><span>Odds</span></div><div class="metric"><strong>${vrEsc(vrUnitText(r.units)||r.units||'--')}</strong><span>Units</span></div><div class="metric"><strong>${vrEsc(r.bestNumber||'--')}</strong><span>Best Number</span></div><div class="metric"><strong>${vrEsc(r.confidence||'--')}</strong><span>Confidence</span></div></div><p style="color:#e7dcc4;line-height:1.55;margin-top:14px;white-space:pre-line">${vrEsc(vrAnalysis(r))}</p></div>`;
}
function vrPickOfDayCard(r){ return `<div class="pick-card"><div style="color:var(--muted);font-size:11px;text-transform:uppercase;font-weight:1000;letter-spacing:.9px">Pick of the Day</div><div class="pick-title">${vrEsc(r.pick||'')}</div><p style="color:var(--muted);line-height:1.5">${vrEsc([r.league||r.sport,r.game].filter(Boolean).join(' — '))}</p><div class="metric-grid"><div class="metric"><strong>${vrEsc(r.grade||'--')}</strong><span>Grade</span></div><div class="metric"><strong>${vrEsc(vrUnitText(r.units)||r.units||'--')}</strong><span>Units</span></div><div class="metric"><strong>${vrEsc(r.odds||'--')}</strong><span>Odds</span></div><div class="metric"><strong>${vrEsc(r.sportsbook||'--')}</strong><span>Sportsbook</span></div><div class="metric"><strong>${vrEsc(r.bestNumber||'--')}</strong><span>Best Number</span></div></div><p style="color:#e7dcc4;line-height:1.55;margin-top:10px;white-space:pre-line">${vrEsc(vrAnalysis(r))}</p></div>`; }
function vrRenderPickOfDay(rows){ const el=document.getElementById('pickOfDayCard'); if(!el)return; const pick=rows.filter(vrPickOfDayEligible).sort(vrSort)[0]; el.innerHTML=pick?vrPickOfDayCard(pick):'<div class="empty">No Pick of the Day yet — check back after lines confirm.</div>'; }
function vrRenderActive(rows){ const grid=document.getElementById('vipPicksGrid'); if(!grid)return; const active=vrDedupe(rows).filter(vrActionable).sort(vrSort); grid.innerHTML=active.length?active.map(vrPickCard).join(''):'<div class="empty">No active official VIP picks loaded right now.</div>'; }
function vrRenderWatchlist(rows){ const grid=document.getElementById('vipWatchlistGrid'); if(!grid)return; const wl=vrDedupe(rows).filter(r => vrClean(`${r.status} ${r.releaseStatus} ${r.category}`).includes('watchlist')).sort(vrSort); grid.innerHTML=wl.length?wl.map(vrPickCard).join(''):'<div class="empty">No watchlist angles loaded right now.</div>'; }
function vrRenderArchive(rows){ const body=document.getElementById('vipArchiveBody'); if(!body)return; const official=vrDedupe(rows).filter(r => (vrClean(r.access)==='vip'||vrClean(r.access)==='premium') && vrClosed(r)).sort(vrSort); if(!official.length){ body.innerHTML='<tr><td colspan="7">No official released VIP results yet.</td></tr>'; return; } body.innerHTML=official.slice(0,100).map(r=>`<tr><td>${vrFmtDate(r.date)}</td><td>${vrEsc(r.league||r.sport||'')}</td><td><strong>${vrEsc(r.pick||'')}</strong><br><span style="color:var(--muted)">${vrEsc(r.game||'')}</span></td><td>${vrEsc(r.grade||'')}</td><td class="${vrClass(r)}">${vrEsc(vrResult(r))}</td><td>${vrEsc(r.profitLoss||'')}</td><td>${vrEsc(r.closingNumber||r.bestNumber||'')}</td></tr>`).join(''); }
function vrStats(rows){ const graded=rows.filter(r => (vrClean(r.access)==='vip'||vrClean(r.access)==='premium') && (vrWin(r)||vrLoss(r))); const wins=graded.filter(vrWin).length; const losses=graded.filter(vrLoss).length; const total=wins+losses; const units=graded.reduce((s,r)=>s+vrNum(r.profitLoss),0); const active=rows.filter(vrActionable).length; return {record: total?`${wins}-${losses}`:'--', winRate: total?`${Math.round(wins/total*100)}%`:'--', units: total||units?`${units>0?'+':''}${units.toFixed(2)}u`:'--', count: (total+active)||'--'}; }

async function bootVipVault(){
  try{
    const [master, props, lotto, longshots] = await Promise.all([
      vrRows(VIP_RECORD_GIDS.master,'Master Picks'),
      vrRows(VIP_RECORD_GIDS.props,'Props Lab').catch(()=>[]),
      vrRows(VIP_RECORD_GIDS.lotto,'Lotto Parlays').catch(()=>[]),
      vrRows(VIP_RECORD_GIDS.longshots,'Longshots').catch(()=>[])
    ]);
    const rows = vrDedupe([...master, ...props, ...lotto, ...longshots]);
    const stats = vrStats(rows);
    vrSet('vipRecord', stats.record); vrSet('vipWinRate', stats.winRate); vrSet('vipTotalUnits', stats.units); vrSet('vipCount', stats.count);
    vrRenderPickOfDay(rows); vrRenderActive(rows); vrRenderWatchlist(rows); vrRenderArchive(rows);
    document.querySelectorAll('.sync-time').forEach(el => { el.textContent = new Date().toLocaleTimeString([], {hour:'numeric', minute:'2-digit'}); });
  } catch(e){
    console.error('VIP vault engine failed:', e);
    vrSet('vipRecord','Sheet Error');
    const grid=document.getElementById('vipPicksGrid'); if(grid) grid.innerHTML='<div class="empty">VIP sheet data could not load. Check Google Sheet publish/share settings.</div>';
    vrRenderPickOfDay([]); vrRenderWatchlist([]); vrRenderArchive([]);
  }
}
bootVipVault();
setInterval(bootVipVault,30000);
