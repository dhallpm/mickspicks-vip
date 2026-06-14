/* Micks Picks VIP Vault Engine — Google Sheets source of truth */
const SHEET_ID = '1wber196DbbsSXwcITRXWbIF-IZzOJGwkIKPMIWv0AC4';
const SHEETS = [
  { name: 'Master Picks', gid: '1678595374' },
  { name: 'Props Lab', gid: '1786223862' },
  { name: 'Lotto Parlays', gid: '762362650' },
  { name: 'Longshots', gid: '1573645110' }
];

function esc(value) { return String(value ?? '').replace(/[&<>"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m])); }
function clean(value) { return String(value ?? '').trim().toLowerCase().replace(/[-_]+/g, ' ').replace(/\s+/g, ' '); }
function num(value) { const n = parseFloat(String(value ?? '').replace(/[^0-9.+-]/g, '')); return Number.isFinite(n) ? n : 0; }
function first(row, names) { for (const name of names) { if (row[name] !== undefined && String(row[name]).trim() !== '') return String(row[name]).trim(); } return ''; }
function setText(id, v) { const el = document.getElementById(id); if (el) el.textContent = v; }
function publicText(value) {
  return String(value ?? '')
    .split(/\n+/)
    .filter(line => !/^\s*Analysis Note:/i.test(line) && !/^\s*Needs Customer-Friendly Rewrite:/i.test(line))
    .join('\n')
    .replace(/Analysis Note:\s*Needs Customer-Friendly Rewrite:[^\n.]*(?:\.|$)/gi, '')
    .trim();
}
function parseCSV(text) {
  const rows = []; let row = [], cur = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i], n = text[i + 1];
    if (c === '"' && quoted && n === '"') { cur += '"'; i++; }
    else if (c === '"') quoted = !quoted;
    else if (c === ',' && !quoted) { row.push(cur); cur = ''; }
    else if ((c === '\n' || c === '\r') && !quoted) { if (cur || row.length) { row.push(cur); rows.push(row); row = []; cur = ''; } if (c === '\r' && n === '\n') i++; }
    else cur += c;
  }
  if (cur || row.length) { row.push(cur); rows.push(row); }
  return rows;
}
function rowObjects(rows, source) {
  if (!rows.length) return [];
  const headers = rows[0].map(h => String(h ?? '').trim());
  return rows.slice(1).map(values => {
    const raw = {}; headers.forEach((h, i) => raw[h] = String(values[i] ?? '').trim());
    return {
      source, raw,
      date: first(raw, ['Date', 'date']), sport: first(raw, ['Sport', 'sport']), league: first(raw, ['League', 'league']),
      game: first(raw, ['Game', 'game', 'Matchup']), pick: first(raw, ['Pick', 'pick', 'Play']),
      betType: first(raw, ['Bet Type', 'market', 'Market', 'Type']), odds: first(raw, ['Odds', 'odds']), sportsbook: first(raw, ['Sportsbook', 'Book']),
      grade: first(raw, ['Grade', 'grade']), units: first(raw, ['Units', 'units']), bestNumber: first(raw, ['Best Number', 'Best #', 'Line / Number']),
      cutoff: first(raw, ['No Bet Cutoff']), confidence: first(raw, ['Confidence', 'confidence']), status: first(raw, ['Status', 'status', 'Display Status']),
      releaseStatus: first(raw, ['Release Status', 'Display Release Status']), access: first(raw, ['Access', 'access', 'Tier']), officialBet: first(raw, ['Official Bet']),
      pickOfDayEligible: first(raw, ['Pick of the Day Eligible']), writeup: first(raw, ['Writeup', 'Write Up']), fullAnalysis: first(raw, ['Full Analysis']),
      marketNotes: first(raw, ['Market Notes']), injuryNotes: first(raw, ['Injury Notes']), result: first(raw, ['Result', 'Outcome']), profitLoss: first(raw, ['Profit/Loss', 'P/L']),
      closingNumber: first(raw, ['Closing Number', 'Closing #']), settledAt: first(raw, ['Settled At'])
    };
  }).filter(r => Object.values(r.raw).some(v => String(v).trim() !== ''));
}
async function loadSheet({ name, gid }) {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${gid}&cache=${Date.now()}`;
  const res = await fetch(url, { cache: 'no-store' });
  const text = await res.text();
  if (!res.ok || text.toLowerCase().includes('<html')) throw new Error(`${name} CSV not public/readable`);
  return rowObjects(parseCSV(text), name);
}
function dateValue(v) {
  const s = String(v || '').trim();
  const m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) return new Date(+m[1], +m[2] - 1, +m[3]).getTime();
  const d = new Date(s); return Number.isNaN(d.getTime()) ? 0 : d.getTime();
}
function weekStart() { const d = new Date(); const day = d.getDay(); const diff = d.getDate() - day + (day === 0 ? -6 : 1); return new Date(d.getFullYear(), d.getMonth(), diff).getTime(); }
function weekEnd() { return weekStart() + 7 * 24 * 60 * 60 * 1000; }
function isThisWeek(r) { const t = dateValue(r.settledAt || r.date); return t >= weekStart() && t < weekEnd(); }
function isClosed(r) { const t = clean(`${r.status} ${r.releaseStatus} ${r.result}`); return t.includes('settled') || t.includes('result posted') || t.includes('win') || t.includes('loss') || t.includes('push') || t.includes('void') || t.includes('no bet'); }
function isArchived(r) { const t = clean(`${r.status} ${r.releaseStatus} ${r.access} ${r.result}`); return t.includes('duplicate') || t.includes('archive') || t.includes('no release') || t.includes('no bet') || t.includes('void'); }
function isActive(r) {
  const st = clean(r.status), rel = clean(r.releaseStatus), access = clean(r.access);
  if (isClosed(r) || isArchived(r)) return false;
  if (!['pending', 'released', 'active'].includes(st)) return false;
  if (rel && !['vip released', 'released', 'pending', 'active'].includes(rel)) return false;
  if (!r.pick || !r.game || !r.odds || num(r.units) <= 0) return false;
  if (/^(no|false|0|n)$/i.test(r.officialBet)) return false;
  return access === 'vip' || access === 'premium';
}
function isFreeActive(r) {
  const access = clean(r.access), rel = clean(r.releaseStatus);
  if (isClosed(r) || isArchived(r)) return false;
  if (access === 'vip' || access === 'premium' || rel === 'vip released') return false;
  return (access === 'free' || access === 'public') && r.pick && r.game && r.odds && num(r.units) > 0;
}
function rank(r) { const g = String(r.grade).toUpperCase(); if (g === 'A+') return 5; if (g === 'A') return 4; if (g === 'A-') return 3; if (g === 'B+') return 2; if (g === 'B') return 1; return 0; }
function sortRows(a, b) { return dateValue(b.date) - dateValue(a.date) || rank(b) - rank(a) || num(b.units) - num(a.units); }
function analysis(r) {
  return [publicText(r.fullAnalysis), publicText(r.writeup), r.marketNotes ? `Market Notes: ${publicText(r.marketNotes)}` : '', r.injuryNotes ? `Injury Notes: ${publicText(r.injuryNotes)}` : '', r.cutoff ? `No-Bet Cutoff: ${publicText(r.cutoff)}` : ''].filter(Boolean).join('\n\n');
}
function card(r) {
  const units = num(r.units) ? `${num(r.units)}u` : r.units || '--';
  return `<div class="pick-card"><div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start"><div><div style="color:var(--muted);font-size:11px;text-transform:uppercase;font-weight:1000;letter-spacing:.9px">${esc(r.league || r.sport || 'Sports')} | ${esc(r.betType || 'Pick')}</div><div class="pick-title">${esc(r.pick)}</div><p style="color:var(--muted);line-height:1.5">${esc(r.game)}</p></div><div style="background:linear-gradient(135deg,#9b6d15,#ffe28a 54%,#b98821);color:#090909;padding:9px 11px;border-radius:10px;font-weight:1000">${esc(r.grade || 'VIP')}</div></div><div class="metric-grid"><div class="metric"><strong>${esc(r.odds || '--')}</strong><span>Odds</span></div><div class="metric"><strong>${esc(units)}</strong><span>Units</span></div><div class="metric"><strong>${esc(r.bestNumber || '--')}</strong><span>Best Number</span></div><div class="metric"><strong>${esc(r.confidence || '--')}</strong><span>Confidence</span></div></div><p style="color:#e7dcc4;line-height:1.55;margin-top:14px;white-space:pre-line">${esc(analysis(r))}</p></div>`;
}
function renderArchive(rows) {
  const arch = document.getElementById('vipArchiveBody'); if (!arch) return;
  const weekly = rows.filter(r => isClosed(r) && isThisWeek(r)).sort(sortRows);
  if (!weekly.length) { arch.innerHTML = '<tr><td colspan="7">No weekly settled results yet.</td></tr>'; return; }
  arch.innerHTML = weekly.map(r => `<tr><td>${esc(r.settledAt || r.date || '')}</td><td>${esc(r.league || r.sport || '')}</td><td>${esc(r.pick || '')}</td><td>${esc(r.grade || '')}</td><td>${esc(r.result || r.status || '')}</td><td>${esc(r.profitLoss || '')}</td><td>${esc(r.closingNumber || '')}</td></tr>`).join('');
}
function render(rows) {
  const active = rows.filter(isActive).sort(sortRows);
  const free = rows.filter(isFreeActive).sort(sortRows);
  const pickOfDay = active.find(r => !/^(no|false|0|n)$/i.test(r.pickOfDayEligible)) || active[0];
  const pod = document.getElementById('pickOfDayCard'); if (pod) pod.innerHTML = pickOfDay ? card(pickOfDay) : '<div class="empty">No Pick of the Day loaded from Google Sheets.</div>';
  const grid = document.getElementById('vipPicksGrid'); if (grid) grid.innerHTML = active.length ? active.map(card).join('') : '<div class="empty">No active VIP picks loaded from Google Sheets.</div>';
  const wl = document.getElementById('vipWatchlistGrid'); if (wl) wl.innerHTML = free.length ? free.map(card).join('') : '<div class="empty">No free/watchlist picks loaded from Google Sheets.</div>';
  const graded = rows.filter(r => isClosed(r) && isThisWeek(r));
  const wins = graded.filter(r => clean(r.result).includes('win') || num(r.profitLoss) > 0).length;
  const losses = graded.filter(r => clean(r.result).includes('loss') || num(r.profitLoss) < 0).length;
  setText('vipRecord', wins + losses ? `${wins}-${losses}` : '--'); setText('vipWinRate', wins + losses ? `${Math.round(wins / (wins + losses) * 100)}%` : '--'); setText('vipTotalUnits', '--'); setText('vipCount', String(active.length));
  renderArchive(rows);
  document.querySelectorAll('.sync-time').forEach(el => el.textContent = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }));
}
async function bootVipVault() { try { const batches = await Promise.all(SHEETS.map(s => loadSheet(s).catch(() => []))); render(batches.flat()); } catch (e) { console.error(e); const grid = document.getElementById('vipPicksGrid'); if (grid) grid.innerHTML = '<div class="empty">Google Sheets feed could not load. Check share/publish settings.</div>'; } }
bootVipVault();
setInterval(bootVipVault, 30000);
