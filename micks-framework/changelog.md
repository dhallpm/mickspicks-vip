# Micks Picks Framework Changelog

## 2026-09-17 — NFL returned to standard operating mode

- Removed Recovery Mode+ from NFL candidates only; Recovery Mode+ remains active for non-NFL daily-card candidates unless separately disabled.
- Re-enabled the full NFL grade ladder, including A-range releases, and restored the normal card limits of four official straight bets, three official props and one main parlay.
- Set the normal NFL official-release floor at B (74/110), with a fully verified B- limited to 0.25u or less.
- Retained mandatory Failure Score and strongest-failure-path analysis without the Recovery Mode+ 7/10 hard gate.
- Retained all post-Week 1 guide/system reconciliation, source-family deduplication, price discipline, player/game-script requirements and no-forced-play rules.
- Made unresolved material guide/current-data contradictions `WATCH/PASS` until resolved.

## 2026-09-17 — NFL post-Week 1 reconciliation

- Added mandatory `current/nfl-post-week1-reconciliation.md` and `.json` modules for every NFL side, total, prop, derivative and parlay leg from Week 2 forward.
- Made the VSiN 2026 guide and Fantasy Life 2026 magazine explicit preseason priors that must be reconciled against Week 1/current usage, current weekly forecasts, injuries and current prices.
- Added data-class blending for player opportunity, team tendencies, efficiency and trench/coverage performance instead of one blanket early-season weight.
- Added current Fantasy Life projections, rankings, Utilization Report, snap counts, air yards and game analysis as a mandatory live prediction layer.
- Added current VSiN game/prop projections, power ratings, injury tools, WR/CB matchups, systems and splits as a mandatory live layer.
- Added publisher-family deduplication: all Fantasy Life outputs count as one source family and all VSiN outputs count as one source family.
- Added Week 1 power-rating limits, trench emphasis, opportunity-first prop projections and one-game-role exposure caps.
- Added the Guide/System Reconciliation Table and Fantasy Projection Delta Board to every full NFL scan.
- Preserved Recovery Mode+: 82/110 minimum, Failure Score at least 7/10, 1–2 official plays and no forced releases.
- Added an 81/110 cap when a material guide/current-data contradiction remains unresolved.

## Future update rule

Every framework change must update the relevant human-readable and machine-readable files, add a dated note here and avoid undocumented framework drift.
