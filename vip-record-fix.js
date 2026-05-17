/* Micks Picks VIP Vault Engine
   Dedicated VIP-only script. Does not use public app.js.
   Counts only official released VIP picks, not combined/public/imported Live rows.
*/
const VIP_RECORD_SHEET_ID='15txBM8qsck7f0ZA_za7xYEykBxKpuq0no3x7yHcKNeE';
const VIP_RECORD_GIDS={vipArchive:'210503117',websiteFeed:'1231201305'};
function vrCsv(gid){return `https://docs.google.com/spreadsheets/d/${VIP_RECORD_SHEET_ID}/export?format=csv&gid=${gid}&cache=${Date.now()}`}
function vrEsc(s){return String(s||'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]))}
function vrClean(s){return String(s||'').trim().toLowerCase().replace(/\s+/g,' ')}
function vrCompact(s){return vrClean(s).replace(/[^a-z0-9]/g,'')}
function vrNum(v){const n=parseFloat(String(v||'').replace(/[^0-9.+-]/g,''));return Number.isFinite(n)?n:0}
function vrHas(v){return String(v||'').trim().length>0}
function vrSet(id,v){const el=document.getElementById(id); if(el)el.textContent=v}
function vrParseCSV(text){const rows=[];let row=[],cur='',q=false;for(let i=0;i<text.length;i++){const c=text[i],n=text[i+1];if(c==='"'&&q&&n==='"'){cur+='"';i++}else if(c==='"'){q=!q}else if(c===','&&!q){row.push(cur);cur=''}else if((c==='\n'||c==='\r')&&!q){if(cur!==''||row.length){row.push(cur);rows.push(row);row=[];cur=''}if(c==='\r'&&n==='\n')i++}else cur+=c}if(cur!==''||row.length){row.push(cur);rows.push(row)}return rows}
function vrNorm(h){return String(h||'').trim().toLowerCase().replace(/\s+/g,' ').replace(/[^\w#/% ]/g,'')}
const VR_ALIASES={date:['Date'],sport:['Sport'],league:['League'],game:['Game','Matchup'],pick:['Pick','Play'],betType:['Bet Type','Market'],odds:['Odds'],sportsbook:['Sportsbook','Book'],grade:['Grade'],units:['Units'],bestNumber:['Best Number','Best #'],noBetCutoff:['No Bet Cutoff'],status:['Status'],result:['Result','Outcome'],profitLoss:['Profit/Loss','P/L','PL'],access:['Access','Tier'],featured:['Featured','Featured?'],closingNumber:['Closing Number','Closing #'],sourceVerification:['Source Verification'],releaseStatus:['Release Status'],releaseNotes:['Release Notes'],postedTime:['Posted Time'],fullAnalysis:['Full Analysis'],writeup:['Writeup','Write Up'],marketNotes:['Market Notes'],injuryNotes:['Injury Notes'],confidence:['Confidence']};
function vrAlias(headers,aliases){return headers.find(h=>aliases.some(a=>vrNorm(a)===vrNorm(h)))}
function vrObjects(rows,source){if(!rows.length)return[];const headers=rows[0].map(h=>String(h||'').trim());return rows.slice(1).map(r=>{const raw={};headers.forEach((h,i)=>raw[h]=String(r[i]||'').trim());const obj={_sourceTab:source,_raw:raw};Object.entries(VR_ALIASES).forEach(([k,aliases])=>{const real=vrAlias(headers,aliases);obj[k]=real?String(raw[real]||'').trim():''});return obj}).filter(r=>Object.values(r._raw).some(v=>String(v||'').trim()!==''))}
async function vrRows(gid,source){const res=await fetch(vrCsv(gid),{cache:'no-store'});const txt=await res.text();if(txt.toLowerCase().includes('<html'))throw new Error(source+' unavailable');return vrObjects(vrParseCSV(txt),source)}
function vrDateVal(v){const s=String(v||'').trim();if(!s)return 0;let m=s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);if(m)return new Date(+m[1],+m[2]-1,+m[3]).getTime();m=s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})/);if(m){let y=+m[3];if(y<100)y+=2000;return new Date(y,+m[1]-1,+m[2]).getTime()}const d=new Date(s);return Number.isNaN(d.getTime())?0:d.getTime()}
function vrFmtDate(v){const t=vrDateVal(v);if(!t)return vrEsc(v||'');const d=new Date(t);return `${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')}/${d.getFullYear()}`}
function vrWin(r){const pl=vrNum(r.profitLoss);if(pl>0)return true;const x=vrClean(`${r.result} ${r.status}`);return x==='win'||x==='won'||x==='w'||x.includes('graded - win')}
function vrLoss(r){const pl=vrNum(r.profitLoss);if(pl<0)return true;const x=vrClean(`${r.result} ${r.status}`);return x==='loss'||x==='lost'||x==='l'||x.includes('graded - loss')}
function vrClosed(r){return vrWin(r)||vrLoss(r)||vrClean(r.status).includes('graded')||vrClean(r.status).includes('closed')}
function vrNoBet(r){const t=vrClean(`${r.grade} ${r.status} ${r.result} ${r.releaseStatus} ${r.betType}`);return t.includes('pass')||t.includes('no bet')||t.includes('price moved')||vrNum(r.units)<=0||t.includes('lotto prop')}
function vrOfficialVip(r){
  const release=vrClean(r.releaseStatus);
  const access=vrClean(r.access);
  const notes=vrClean(`${r.releaseNotes} ${r.sourceVerification}`);
  if(notes.includes('auto unlocked'))return false;
  if(release!=='released')return false;
  if(access!=='vip' && access!=='premium')return false;
  return true;
}
function vrTrackable(r){return vrOfficialVip(r)&&vrHas(r.pick)&&!vrNoBet(r)}
function vrActive(r){return vrTrackable(r)&&!vrClosed(r)}
function vrKey(r){return [r.date,r.league||r.sport,r.game,r.pick,r.betType].map(vrCompact).join('|')}
function vrDedupe(rows){const map=new Map();rows.forEach(r=>{const k=vrKey(r);if(!k)return;const old=map.get(k);if(!old||vrDateVal(r.date)>=vrDateVal(old.date))map.set(k,r)});return Array.from(map.values())}
function vrResult(r){if(vrWin(r))return'Win';if(vrLoss(r))return'Loss';return r.result||r.status||'Pending'}
function vrClass(r){if(vrWin(r))return'status-win';if(vrLoss(r))return'status-loss';return'status-pending'}
function vrStats(archiveRows,activeRows){const graded=archiveRows.filter(r=>vrTrackable(r)&&(vrWin(r)||vrLoss(r)));const wins=graded.filter(vrWin).length;const losses=graded.filter(vrLoss).length;const total=wins+losses;const units=graded.reduce((s,r)=>s+vrNum(r.profitLoss),0);const active=activeRows.filter(vrActive).length;return{record:total?`${wins}-${losses}`:'--',winRate:total?`${Math.round(wins/total*100)}%`:'--',units:total||units?`${units>0?'+':''}${units.toFixed(2)}u`:'--',count:(total+active)||'--'}}
function vrAnalysis(r){return [r.fullAnalysis,r.marketNotes?`Market Notes: ${r.marketNotes}`:'',r.injuryNotes?`Injury Notes: ${r.injuryNotes}`:'',r.noBetCutoff?`No-Bet Cutoff: ${r.noBetCutoff}`:''].filter(Boolean).join(' ')||r.writeup||'VIP analysis loading.'}
function vrPickCard(r){return `<div class="pick-card"><div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start"><div><div style="color:var(--muted);font-size:11px;text-transform:uppercase;font-weight:1000;letter-spacing:.9px">${vrEsc(r.league||r.sport||'Sports')} | ${vrEsc(r.betType||'VIP Pick')}</div><div class="pick-title">${vrEsc(r.pick||'Pick Pending')}</div><p style="color:var(--muted);line-height:1.5">${vrEsc(r.game||'')}</p></div><div style="background:linear-gradient(135deg,#9b6d15,#ffe28a 54%,#b98821);color:#090909;padding:9px 11px;border-radius:10px;font-weight:1000">${vrEsc(r.grade||'VIP')}</div></div><div class="metric-grid"><div class="metric"><strong>${vrEsc(r.odds||'--')}</strong><span>Odds</span></div><div class="metric"><strong>${vrEsc(r.units||'--')}</strong><span>Units</span></div><div class="metric"><strong>${vrEsc(r.bestNumber||'--')}</strong><span>Best Number</span></div><div class="metric"><strong>${vrEsc(r.confidence||'--')}</strong><span>Confidence</span></div></div><p style="color:#e7dcc4;line-height:1.55;margin-top:14px">${vrEsc(vrAnalysis(r))}</p></div>`}
function vrRenderActive(rows){const grid=document.getElementById('vipPicksGrid');if(!grid)return;const active=vrDedupe(rows).filter(vrActive).sort((a,b)=>vrDateVal(b.date)-vrDateVal(a.date));grid.innerHTML=active.length?active.map(vrPickCard).join(''):'<div class="empty">No active official VIP picks loaded right now.</div>'}
function vrRenderArchive(rows){const body=document.getElementById('vipArchiveBody');if(!body)return;const official=vrDedupe(rows).filter(vrTrackable).filter(vrClosed).sort((a,b)=>vrDateVal(b.date)-vrDateVal(a.date));if(!official.length){body.innerHTML='<tr><td colspan="7">No official released VIP results yet.</td></tr>';return}body.innerHTML=official.slice(0,100).map(r=>`<tr><td>${vrFmtDate(r.date)}</td><td>${vrEsc(r.league||r.sport||'')}</td><td><strong>${vrEsc(r.pick||'')}</strong><br><span style="color:var(--muted)">${vrEsc(r.game||'')}</span></td><td>${vrEsc(r.grade||'')}</td><td class="${vrClass(r)}">${vrEsc(vrResult(r))}</td><td>${vrEsc(r.profitLoss||'')}</td><td>${vrEsc(r.closingNumber||r.bestNumber||'')}</td></tr>`).join('')}
async function bootVipVault(){try{const [archive,feed]=await Promise.all([vrRows(VIP_RECORD_GIDS.vipArchive,'VIP Archive'),vrRows(VIP_RECORD_GIDS.websiteFeed,'Website Feed').catch(()=>[])]);const archiveOfficial=vrDedupe(archive).filter(vrTrackable);const activeOfficial=vrDedupe(feed.concat(archive)).filter(vrActive);const stats=vrStats(archiveOfficial,activeOfficial);vrSet('vipRecord',stats.record);vrSet('vipWinRate',stats.winRate);vrSet('vipTotalUnits',stats.units);vrSet('vipCount',stats.count);vrRenderActive(activeOfficial);vrRenderArchive(archiveOfficial);document.querySelectorAll('.sync-time').forEach(el=>{el.textContent=new Date().toLocaleTimeString([],{hour:'numeric',minute:'2-digit'})})}catch(e){console.error('VIP vault engine failed:',e);vrSet('vipRecord','VIP Error');const grid=document.getElementById('vipPicksGrid');if(grid)grid.innerHTML='<div class="empty">VIP sheet data could not load.</div>'}}
bootVipVault();
setInterval(bootVipVault,30000);
