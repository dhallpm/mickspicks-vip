# AI-v3 Reverse-Engineering — Initial Findings

Effective date: 2026-08-24
Status: Experimental benchmark analysis
Sample: Reconstructed AI-v3 selections from 2026-08-03 through 2026-08-12 with recoverable historical market data.

## Important limitation

This is not a claim about Doc's proprietary code. It is an observable-behavior study. Historical market snapshots are incomplete and sometimes disagree across sources. Unknown fields remain unknown.

## Initial reconstructed sample

Eight recent selections have been added to `ai-v3-audit-ledger.csv`.

Observed outcomes in this first block:
- 7 wins
- 1 loss
- market behavior was mixed rather than uniformly supportive

## Finding 1 — AI-v3 is not a simple steam follower

Several selections contradict a pure line-movement strategy.

- 2026-08-12 San Diego +110: an earlier Action snapshot showed roughly +101 before the price drifted to +110. AI-v3 still selected San Diego after the market moved against the team.
- 2026-08-07 Dodgers/Diamondbacks Under 9 -120: an archived Action close around Under 9 -108 indicates a materially worse posted price than the later market price, yet AI-v3 still released the Under and won.
- 2026-08-11 Indiana -2.5: Action showed essentially the same line near -109 and public positioning at 50/50. There was no obvious ticket/handle divergence signal required for the winner.

Working conclusion: market movement is probably a filter/calibration input, not the primary selection engine.

## Finding 2 — Fundamental projection appears to come first

The 2026-08-05 Detroit/Seattle Under 7.5 provides a strong example. The surface ERAs were unimpressive, but Action's contemporaneous pitching table showed:
- Drew Anderson: 4.24 ERA / 3.38 xERA
- Bryan Woo: 4.56 ERA / 3.53 xERA

That is a classic `UNDERLYING_METRICS_VS_SURFACE` profile. AI-v3 appears willing to bet against recent/surface perception when underlying estimators imply a different run environment.

Working conclusion: our replica should require a fair-line/fair-total engine before market information is scored.

## Finding 3 — AI-v3 accepts plus-money dislocations on unpopular or weaker-looking teams

Recent examples include:
- Giants +110 vs Rangers
- Giants +115 vs Tigers
- Padres +110 vs Brewers

The San Francisco +110 winner had independent same-side support on Action despite San Francisco entering with a much worse record than Texas. This supports the `REPUTATION_PRICE_DISLOCATION` concept: the model appears willing to separate team quality from price value.

Working conclusion: team record, ranking and reputation should never directly veto a price edge. Micks should compare fair probability to de-vigged market probability.

## Finding 4 — Strong internal conviction may tolerate a worse number

The Toronto/Atlanta Over on 2026-08-10 is revealing. An Action article showed the total around 185.5-186.5 earlier in the day, while the archived board reached 187.5. AI-v3 still released Over 187.5.

This suggests one of two possibilities:
1. the internal fair total was sufficiently above 187.5 that the move did not eliminate EV, or
2. market movement itself strengthened confidence enough to offset some lost number value.

The replica should test both hypotheses prospectively rather than assume either one.

## Finding 5 — CLV and game result must remain separate

The 2026-08-09 Giants +115 loss may have beaten a consensus close near +102 according to one historical source, while another source displays +115. This source disagreement prevents a final CLV label, but it illustrates the correct process rule: a losing bet can still represent excellent price discovery.

Micks should evaluate:
- result
- CLV
- model calibration
- market-dislocation estimate
separately.

## Current best working architecture

The observable evidence currently supports this ordering:

1. Build independent fair probability / fair line.
2. Detect price dislocation versus the market.
3. Verify matchup/fundamental edge.
4. Compare alternative market expressions.
5. Read market microstructure as confirmation or contradiction.
6. Accept the bet only if expected value survives the current number.
7. Pass when the edge disappears.
8. Measure CLV after release.

This architecture is closer to the observed AI-v3 behavior than a strategy based on sharp-money chasing.

## Signals currently worth shadow-testing

Promote to shadow-test features, not official extra points yet:
- UNDERLYING_METRICS_VS_SURFACE
- REPUTATION_PRICE_DISLOCATION
- PLUS_MONEY_VALUE
- TOTAL_PROJECTION_GAP
- CONTRARIAN_TO_MOVE
- MARKET_CONFIRMATION
- STEAM only when independent fair-line edge already exists

## Signals not yet proven

Do not add official weight yet for:
- reverse line movement
- ticket/handle divergence
- sharp bettor profiling
- high-limit confirmation

The first recent sample contains winners without these observable signals, and historical data coverage is insufficient.

## Next benchmark phase

Expand backward through July, then June, prioritizing rows where archived Action/VSiN/StatMuse/VegasInsider or official historical market information is recoverable. Compare trigger frequency and CLV separately for winners and losses. Do not optimize the replica score against the historical sample until at least 50 reconstructable rows exist.
