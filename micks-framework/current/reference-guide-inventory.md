# Micks Picks Reference Guide Inventory

Status: Controlling inventory
Effective date: 2026-08-24

## Repository inventory audit

The full trees of `dhallpm/mickspicks-vip` and `dhallpm/mickstaste` were audited on 2026-08-24.

### Physical guide files stored in repositories

No PDF betting-guide files are currently stored in either repository.

### Extracted/stored guide knowledge currently present

1. **2026 VSiN NFL Betting Guide**
   - Sport: NFL
   - Storage form: extracted baseline knowledge in `micks-framework/current/nfl-2026-reference-module.md` and `.json`
   - Uses: preseason power-rating baseline, roster/QB context, coaching/scheme changes, schedule analysis, regression screens, market strategy, sides/totals/props/futures baseline.
   - Freshness: preseason/season baseline only. Must be reconciled against current odds, injuries, inactives, depth charts, usage and current-season efficiency.

2. **Fantasy Life Fantasy Football 2026**
   - Sport: NFL / player roles and props
   - Storage form: extracted baseline knowledge in `micks-framework/current/nfl-2026-reference-module.md` and `.json`
   - Uses: player projections, depth-chart assumptions, expected roles, routes/targets/carries, fantasy-derived usage baselines.
   - Freshness: preseason baseline only. Current role and health always override.

## Mandatory guide usage policy

Reference guides are not generic daily scan websites. They are persistent baseline inputs that must be consulted whenever their sport/market is active and their contents are applicable.

For each applicable candidate, record internally:
- Guide consulted
- Applicable baseline finding
- Current-data confirmation or contradiction
- Whether the guide assumption is still CURRENT, PARTIALLY CURRENT, STALE, or OVERRIDDEN
- Influence on the independent handicap

A guide cannot earn outside-handicapper confirmation merely because it agrees with a pick. Its role is to establish priors/baselines that are then tested against current information.

## NFL phase weighting

- Preseason / Week 1: guide baselines can carry substantial prior weight after roster/injury verification.
- Weeks 2-4: blend guide priors with current snap/route/carry/target and efficiency data.
- Week 5 onward: current-season evidence normally dominates; guide information remains useful mainly for structural context such as scheme, coaching, schedule and original market expectations.

## Current-data override hierarchy

Current verified information always outranks stored guide assumptions, especially:
1. QB/injury/inactive news
2. Current depth chart and role
3. Current odds and market movement
4. Current snap/route/carry/target data
5. Current-season efficiency
6. Weather and game-day conditions

## Future guide ingestion

Whenever a betting guide, preview book, projection package, PDF or season magazine is supplied:
1. Inventory it here by publisher, sport, season, filename/source and date received.
2. Extract actionable concepts into the applicable sport reference module.
3. Preserve the original guide when repository storage/licensing permits; otherwise preserve only user-authorized notes/extracted framework rules.
4. Tag every extracted projection or assumption with its season/date context.
5. Add it to the applicable daily candidate workflow.
6. Never let stale guide information silently override current evidence.

## Audit conclusion — 2026-08-24

At audit time, the only identifiable stored guide-derived knowledge in the repositories is the NFL 2026 reference module based on the VSiN 2026 NFL Betting Guide and Fantasy Life Fantasy Football 2026. No separate MLB, WNBA/NBA, NHL, soccer, UFC/boxing, tennis, NASCAR, college football or college basketball guide files/modules were found in the repository trees.
