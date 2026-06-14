/* Micks Picks VIP Vault Engine — forced live card fallback */
function esc(s){return String(s??'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]))}
function setText(id,v){const el=document.getElementById(id);if(el)el.textContent=v}
const todayPicks=[
  {date:'2026-06-13',league:'WNBA',game:'Seattle Storm vs Golden State Valkyries',pick:'Seattle Storm +9.5',betType:'Spread',odds:'-110',sportsbook:'Circa',grade:'A',units:'1.25u',bestNumber:'Seattle Storm +9.5 or better',confidence:'High',fullAnalysis:'Seattle Storm +9.5 is the official VIP side in Seattle Storm vs Golden State Valkyries. The edge comes from Seattle getting a multi-possession cushion. Best number is Seattle +9.5 or better. Pass below +9.5. Main risk: Seattle offensive inconsistency or a late Golden State run.'},
  {date:'2026-06-13',league:'WNBA',game:'Washington Mystics vs Toronto Tempo',pick:'Mystics/Tempo Over 168.5',betType:'Total',odds:'-110',sportsbook:'Circa',grade:'A',units:'1.25u',bestNumber:'Over 168.5',confidence:'High',fullAnalysis:'Mystics/Tempo Over 168.5 is the official VIP total in Washington Mystics vs Toronto Tempo. The edge comes from the projection sitting above the listed total. Best number is Over 168.5. Playable to 170.5. Pass above 170.5. Main risk: slower pace or poor shooting keeps the game under.'}
];
const freePicks=[
  {date:'2026-06-13',league:'FIFA World Cup',game:'Switzerland vs Qatar',pick:'Switzerland Win to Nil',betType:'Win to Nil',odds:'-133',sportsbook:'Circa',grade:'A-',units:'1u',bestNumber:'-133 or better',confidence:'High',fullAnalysis:'Free A- play. Switzerland Win to Nil is the soccer angle against Qatar. Best number is -133 or better. Pass worse than -150. Main risk: one Qatar goal kills the bet.'},
  {date:'2026-06-13',league:'MLB',game:'Los Angeles Dodgers vs Chicago White Sox',pick:'Roki Sasaki Over 5.5 Strikeouts',betType:'Player Prop',odds:'+126',sportsbook:'Circa',grade:'A-',units:'1u',bestNumber:'+126 or better',confidence:'High',fullAnalysis:'Props Lab A- play. Sasaki Over 5.5 Ks has plus-money value. Pass below +110. Main risk: pitch count or contact outs.'}
];
function card(r){return `<div class="pick-card"><div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start"><div><div style="color:var(--muted);font-size:11px;text-transform:uppercase;font-weight:1000;letter-spacing:.9px">${esc(r.league)} | ${esc(r.betType)}</div><div class="pick-title">${esc(r.pick)}</div><p style="color:var(--muted);line-height:1.5">${esc(r.game)}</p></div><div style="background:linear-gradient(135deg,#9b6d15,#ffe28a 54%,#b98821);color:#090909;padding:9px 11px;border-radius:10px;font-weight:1000">${esc(r.grade)}</div></div><div class="metric-grid"><div class="metric"><strong>${esc(r.odds)}</strong><span>Odds</span></div><div class="metric"><strong>${esc(r.units)}</strong><span>Units</span></div><div class="metric"><strong>${esc(r.bestNumber)}</strong><span>Best Number</span></div><div class="metric"><strong>${esc(r.confidence)}</strong><span>Confidence</span></div></div><p style="color:#e7dcc4;line-height:1.55;margin-top:14px">${esc(r.fullAnalysis)}</p></div>`}
function bootVipVault(){
  setText('vipRecord','--');setText('vipWinRate','--');setText('vipTotalUnits','--');setText('vipCount',String(todayPicks.length));
  const pod=document.getElementById('pickOfDayCard');if(pod)pod.innerHTML=card(todayPicks[0]);
  const grid=document.getElementById('vipPicksGrid');if(grid)grid.innerHTML=todayPicks.map(card).join('');
  const wl=document.getElementById('vipWatchlistGrid');if(wl)wl.innerHTML=freePicks.map(card).join('');
  const arch=document.getElementById('vipArchiveBody');if(arch)arch.innerHTML='<tr><td colspan="7">Results archive will update after games settle.</td></tr>';
  document.querySelectorAll('.sync-time').forEach(el=>{el.textContent=new Date().toLocaleTimeString([],{hour:'numeric',minute:'2-digit'})});
}
bootVipVault();