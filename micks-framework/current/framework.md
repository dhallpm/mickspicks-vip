# Micks Picks Framework — Current Operating Setup

Backup date: 2026-06-07

## Principle

Micks Picks is **Micks-first**. Outside handicappers and models are supporting confirmation only, not the engine.

## Required sections every run

- Master Picks
- Props Lab
- Lotto Parlays
- Longshots
- Watchlist / Live-only angles
- Passes
- Pick of the Day
- Separate import JSON files
- Complete all-sections import JSON

## Grading

| Grade | Meaning |
|---|---|
| A+ | Rare premium straight bet. VIP eligible. |
| A | Strong straight bet. VIP eligible. |
| B | Playable straight bet. |
| B- | Small straight bet. |
| C | Lean, watchlist, longshot, live-only, or optional sprinkle. |
| Pass | No edge. |

Below A/A+ must normalize to Free.

## Card limits

- Max official straight bets: 4
- Max official props: 3
- Max main parlay: 1
- Max longshots: 3
- Longshot exposure max: 0.15u unless user asks for lotto card
- Target official exposure: 1.25u to 2.25u
- Do not force plays from every sport

## Pick of the Day eligibility

Must have all of the following:

- Real team/player/matchup
- Real odds
- Units > 0
- Grade A+, A, or B
- Status Pending, Released, VIP Released, or Free Released
- Not Watchlist
- Not Pass
- Not live-only
- Not a generic framework rule

Never eligible:

- Elite Favorite Set-1 Loss Live Watchlist
- No Game Today
- Pass Today
- Game 3 Watchlist
- Live Watchlist
- Any Units = 0 row
- Odds = Watchlist, Live only, Pass, or N/A

Pick of the Day display fields:

- Pick
- Game
- Sport/League
- Grade
- Units
- Odds
- Best Number
- No Bet Cutoff
- Short writeup

## Correlation rules

One strong game angle = one official play.

Avoid official same-game stacks such as:

- side + pitcher strikeouts + pitcher outs + team total
- spread + same-game total + same-game prop unless independent
- favorite ML + run line + alt line unless ladder is Longshot

Secondary same-script plays go to Watchlist, Longshots, or Pass.

## Source rules

Priority order:

1. Current odds and line movement
2. Injury/lineup/pitcher/goalie confirmations
3. Team matchup and game-script analysis
4. Market splits/sharp money
5. Models/projections
6. Outside handicappers
7. Historical trends

If sources conflict, downgrade to B-, C, Watchlist, or Pass unless Micks has a clear independent reason.

## Full Analysis format

Every official pick should include:

1. Why We Like It
2. Game Script
3. Metric Edge
4. How It Cashes
5. What Can Go Wrong
6. Best Number / Cutoff
7. Micks Picks Verdict

Avoid generic filler like:

- Opening thesis
- The matchup gives enough paths
- This creates a specific handicap, not just a lean

## Airtable import format

```json
{
  "batches": [
    { "table": "picks", "records": [] },
    { "table": "propsLab", "records": [] },
    { "table": "lottoParlays", "records": [] },
    { "table": "longshots", "records": [] }
  ]
}
```

Valid table aliases:

- picks
- propsLab
- lottoParlays
- longshots

Do not include these fields in new import JSON:

- Result
- Outcome
- Profit/Loss
- Profit-Loss

## Results archive

Final results:

- Win
- Loss
- Push
- Void
- Cancelled

After settlement:

1. Calculate Profit/Loss, ROI, CLV, and CLV Result.
2. Copy completed record to Results Archive.
3. Include Original Table, Original Record ID, Record Key, and Archived At.
4. Delete from active source table only after archive creation succeeds.
5. Avoid duplicates by Record Key or Original Record ID.

Results page reads Results Archive. Active pages exclude completed rows.

## MLB framework

Before MLB can grade B or higher:

- Starting pitcher confirmed
- Lineup confirmed or projected lineup supports handicap
- Weather/wind/park checked
- Bullpen usage last 2 days checked
- Current odds inside cutoff
- Not dependent on one source/capper
- At least two independent paths to cash

Team totals: do not assume pitcher early exit equals team total over. Need lineup, weather/park, and bullpen path.

Pitcher props: confirm starter, pitch count stability, opponent profile, and soft threshold.

## NBA framework

- Prefer spread protection over ML when close-game script is likely.
- Favor role-stable props such as rebounds, assists, usage, and minutes.
- Check injuries, minutes, foul trouble, pace, and late-game path.
- Full analysis needs actual game script.

Saved NBA lessons:

- Game 2 regression after extreme Game 1 outliers.
- Fade teams after 30+ point wins or 20+ ATS overperformance.
- Home bounce-back is stronger with structural edges.
- Unders when free throws/outlier/transition systems align.
- Fatigue normalization for Game 7 or short-rest dogs.

## WNBA framework

- Model gap plus injury/role confirmation required.
- Expansion-team volatility matters.
- Avoid forcing large favorites.
- Use live triggers when pregame number is uncertain.
- Avoid overreacting to small-sample blowouts.
- Fade inflated favorites after dominant or televised wins.
- Prefer coaching continuity and defensive structure for dogs in low-possession games.
- High-tempo guard-heavy matchups with weak transition defense can support Overs.
- Prefer live Overs after slow starts when pace and shot quality are healthy.

## NHL framework

- Confirm goalies.
- Account for injuries and special teams.
- Playoff ML coin flips stay B- or lower unless price is strong.
- Use live entry when pace/goalie/penalty flow determines edge.
- Watch goalie-change and adjustment spots in playoff series.

NHL sources: MoneyPuck, Natural Stat Trick, Evolving-Hockey, TeamRankings NHL.

## UFC / Boxing framework

- Confirm fight active.
- Confirm weigh-ins.
- Check line movement.
- Prefer one clear ML/value side over multiple underdog darts.
- Max one UFC longshot unless full fight card requested.

## Tennis framework

Pilot framework only. No A-grade until tracked.

Max grade: B+.
Max units: 0.50u.

Filters:

- Rating gap
- Surface Elo
- Hold/break percentage
- Fatigue
- Motivation
- Market type

Generic live rules are watchlist only unless actual player/match/odds/units are specified.

## Soccer / World Cup futures

- Futures use lower units because bankroll is tied up.
- Compare implied probability to realistic path.
- Consider group format, bracket path, travel, injuries, manager, and group strength.
- Exact finishing order is parlay-like and gets smaller units.

## NASCAR framework

Requires:

- Race status
- Current odds
- Starting position
- Practice/qualifying speed
- Simulation support
- Market type: outright, top-5, top-10, matchup

No official NASCAR after race starts unless using live-market edge. Without price, Watchlist only.

## Yahgis Picks

Yahgis Picks is a separate spot model, not a copy of Micks Picks.

Track:

- Exact line
- Yahgi grade/unit
- Micks cross-grade
- Justification
- Shared evidence
- Safest version
- Value version

Known tracked items:

- Spurs ATS win clarified as Spurs -3.5 with 2.5% bankroll exposure.
- KAT 30+ P+R +100 was a Yahgis A full-unit spot.

## Perplexity role

Perplexity should search and cite current data, but Micks framework does the handicapping.

## Codex role

Codex fixes site logic: Pick of the Day filter, Results Archive, watchlist separation, correlation protection, parlay/longshot limits, and VIP/free gating.
