# AI-v3 Reverse-Engineering — Initial Findings

Effective date: 2026-08-24
Status: Experimental benchmark analysis
Sample: 13 reconstructed AI-v3 selections from July-August 2026 with recoverable historical market data.

## Important limitation

This is not a claim about Doc's proprietary code. It is an observable-behavior study. Historical market snapshots are incomplete and sometimes disagree across sources. Unknown fields remain unknown.

## Initial reconstructed sample

Thirteen selections have now been added to `ai-v3-audit-ledger.csv`.

Observed outcomes in the current reconstruction sample:
- 9 wins
- 4 losses
- market behavior is mixed rather than uniformly supportive
- the sample deliberately includes both recent winners and July losses to reduce winner-only hindsight bias

This sample is still too small to set permanent weights. It is large enough to reject several simplistic explanations of AI-v3 behavior.

## Finding 1 — AI-v3 is not a simple steam follower

Several selections contradict a pure line-movement strategy.

- 2026-08-12 San Diego +110: an earlier Action snapshot showed roughly +101 before the price drifted to +110. AI-v3 still selected San Diego after the market moved against the team.
- 2026-08-07 Dodgers/Diamondbacks Under 9 -120: an archived Action close around Under 9 -108 indicates a materially worse posted price than the later market price, yet AI-v3 still released the Under and won.
- 2026-08-11 Indiana -2.5: Action showed essentially the same line near -109 and public positioning at 50/50. There was no obvious ticket/handle divergence signal required for the winner.
- 2026-07-03 San Diego +1.5: mainstream contemporaneous analysis preferred Dodgers -1.5, yet AI-v3 chose the protected Padres derivative and won outright.

Working conclusion: market movement is probably a filter/calibration input, not the primary selection engine.

## Finding 2 — Fundamental projection appears to come first

The 2026-08-05 Detroit/Seattle Under 7.5 provides a strong example. The surface ERAs were unimpressive, but Action's contemporaneous pitching table showed:
- Drew Anderson: 4.24 ERA / 3.38 xERA
- Bryan Woo: 4.56 ERA / 3.53 xERA

That is a classic `UNDERLYING_METRICS_VS_SURFACE` profile. AI-v3 appears willing to bet against recent/surface perception when underlying estimators imply a different run environment.

Working conclusion: our replica should require a fair-line/fair-total engine before market information is scored.

## Finding 3 — AI-v3 accepts plus-money dislocations on weaker-looking teams

Examples in the reconstructed set include:
- Giants +110 vs Rangers — win
- Giants +115 vs Tigers — loss
- Padres +110 vs Brewers — win
- Mariners +105 vs Marlins — loss
- Cubs +115 vs Orioles — win
- Phillies +105 vs Dodgers — loss
- Giants +100 vs Angels — loss

This is important because `PLUS_MONEY_VALUE` by itself clearly does not separate winners from losers. The successful plus-money bets need another feature: stronger fair-line dislocation, matchup confirmation, useful market expression, or external calculated agreement.

Working conclusion: never award meaningful score merely because a dog looks mispriced. Quantify the probability gap.

## Finding 4 — Single-model agreement is not enough

Two July losses are especially useful.

### Phillies +105 vs Dodgers — loss
A historical model page displayed Philadelphia around 53% win probability while the market offered +105, which would appear to imply a substantial edge. But the same page's score projection still slightly favored Los Angeles. The bet lost.

### Giants +100 vs Angels — loss
A separate simulation model made San Francisco 50.6%. At Doc's even-money price, that represents only about a 0.6 percentage-point edge — far below a threshold we should trust.

Working conclusion:
- require multiple genuinely independent calculated paths for premium model agreement;
- enforce a minimum probability-dislocation threshold;
- inspect internal contradictions within external model pages rather than counting a headline percentage blindly.

## Finding 5 — Market-expression selection is likely a real feature

The July 3 Padres play is instructive. San Diego was roughly +200 on the moneyline against the Dodgers, but AI-v3 selected +1.5 near -105 instead. Mainstream analysis preferred Los Angeles, yet the chosen derivative greatly reduced the required upset probability and the Padres won outright.

This supports a formal expression step:
- underlying team edge
- ML price
- spread/run-line price
- F5/1H alternative
- total/team-total derivative
- variance and late-game dependency

Working conclusion: score the *expression* separately from the underlying handicap.

## Finding 6 — Strong internal conviction may tolerate a worse number

The Toronto/Atlanta Over on 2026-08-10 is revealing. An Action article showed the total around 185.5-186.5 earlier in the day, while the archived board reached 187.5. AI-v3 still released Over 187.5.

This suggests one of two possibilities:
1. the internal fair total was sufficiently above 187.5 that the move did not eliminate EV, or
2. market movement itself strengthened confidence enough to offset some lost number value.

The replica should test both hypotheses prospectively rather than assume either one.

## Finding 7 — CLV and result must remain separate

The 2026-08-09 Giants +115 loss may have beaten a consensus close near +102 according to one historical source, while another source displays +115. This source disagreement prevents a final CLV label, but it illustrates the correct process rule: a losing bet can still represent good price discovery.

Conversely, the 2026-08-07 Under 9 winner appears to have received a worse price than a later -108 market. A winning outcome does not prove good price execution.

Micks should evaluate separately:
- result
- CLV
- model calibration
- market-dislocation estimate
- timing quality

## Finding 8 — Benchmark-table quality must be audited

The 2026-07-07 Seattle row is another data-quality example. Doc's displayed a score of 8-5 while the archived game result was Miami 6, Seattle 5. The selection was still correctly graded a loss.

Therefore:
- final-result verification
- display-score verification
- sport/market tag verification
- unit arithmetic
- dollar P/L arithmetic
must remain separate audit fields.

## Current best working architecture

The observable evidence currently supports this ordering:

1. Build independent fair probability / fair line.
2. Detect price dislocation versus the market.
3. Verify matchup/fundamental edge.
4. Compare alternative market expressions.
5. Require multiple calculated confirmations when relying on external models.
6. Read market microstructure as confirmation or contradiction.
7. Accept the bet only if expected value survives the current number.
8. Pass when the edge disappears.
9. Freeze the release number.
10. Measure CLV and result separately afterward.

This architecture is closer to observed AI-v3 behavior than a strategy based on sharp-money chasing.

## Signals currently worth shadow-testing

Promote to shadow-test features, not official extra points yet:
- UNDERLYING_METRICS_VS_SURFACE
- REPUTATION_PRICE_DISLOCATION
- PLUS_MONEY_VALUE only when quantified by fair probability
- TOTAL_PROJECTION_GAP
- DERIVATIVE_EXPRESSION
- CONTRARIAN_TO_MOVE
- MARKET_CONFIRMATION
- STEAM only when independent fair-line edge already exists
- MULTI_MODEL_CALCULATED_AGREEMENT
- MINIMUM_DISLOCATION_GATE

## Signals not yet proven

Do not add official weight yet for:
- reverse line movement
- ticket/handle divergence
- sharp bettor profiling
- high-limit confirmation

The reconstructed sample contains winners without these observable signals, and historical data coverage is insufficient.

## Immediate replica rule changes from this audit

For prospective shadow testing:

1. Do not award a meaningful edge for plus-money status alone.
2. Require at least ~1.5 percentage points of reconstructed fair-probability edge before a standard liquid-market dislocation gets any positive score; 3+ points is preferred.
3. One outside calculated model cannot create premium agreement. Two independent calculated paths are preferred; three for futures/high-variance markets.
4. Add an explicit `Expression Advantage` check before final release.
5. Market movement against the pick is not an automatic pass if the current price improves expected value and independent fundamentals remain intact.
6. Market steam in the pick's direction cannot rescue a weak independent fair line.

## Next benchmark phase

Expand backward through the rest of July, then June, prioritizing rows where archived Action/VSiN/StatMuse/VegasInsider/FanDuel or other historical information is recoverable. Compare trigger frequency and CLV separately for winners and losses. Do not optimize replica weights against the historical Doc's sample until at least 50 reconstructable rows exist.
