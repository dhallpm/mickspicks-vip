export default async function handler(req, res) {
  try {
    const board = await fetch('https://site.api.espn.com/apis/site/v2/sports/basketball/wnba/scoreboard?dates=20260713', { headers: { 'User-Agent': 'Mozilla/5.0' } }).then(async r => { if (!r.ok) throw new Error(`scoreboard ${r.status}`); return r.json(); });
    const wanted = (board.events || []).filter(event => {
      const names = (event.competitions?.[0]?.competitors || []).map(c => c.team?.displayName || '').join(' | ');
      return /Phoenix Mercury|Minnesota Lynx|Los Angeles Sparks|Atlanta Dream/.test(names);
    });
    const games = [];
    for (const event of wanted) {
      const summary = await fetch(`https://site.api.espn.com/apis/site/v2/sports/basketball/wnba/summary?event=${event.id}`, { headers: { 'User-Agent': 'Mozilla/5.0' } }).then(async r => { if (!r.ok) throw new Error(`summary ${event.id} ${r.status}`); return r.json(); });
      const competitors = event.competitions?.[0]?.competitors || [];
      const home = competitors.find(c => c.homeAway === 'home')?.team?.displayName || '';
      const away = competitors.find(c => c.homeAway === 'away')?.team?.displayName || '';
      const opening = [];
      let reachedTen = null;
      for (const play of (summary.plays || [])) {
        const row = { period: play.period?.number, clock: play.clock?.displayValue, text: play.text, homeScore: Number(play.homeScore || 0), awayScore: Number(play.awayScore || 0), scoringPlay: play.scoringPlay };
        opening.push(row);
        if (row.homeScore >= 10 || row.awayScore >= 10) { reachedTen = row; break; }
      }
      games.push({ id: event.id, name: event.name, home, away, reachedTen, opening });
    }
    res.status(200).json({ ok: true, date: '2026-07-13', games });
  } catch (error) {
    res.status(500).json({ ok: false, error: String(error?.message || error) });
  }
}
