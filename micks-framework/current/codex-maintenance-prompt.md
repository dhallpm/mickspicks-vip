# Micks Picks Codex Backup Prompt

Repo: `dhallpm/mickspicks-vip` unless active project context says otherwise.

## Maintain / fix

1. Pick of the Day must require Units > 0, real odds, actionable pick, Grade A+/A/B, and Status Pending/Released.
2. Watchlist, Pass, Live-only, and generic framework rules cannot route to Pick of the Day.
3. Completed records move to Results Archive after settlement and are removed from active tables only after archive success.
4. Results page reads Results Archive as source of truth.
5. Active pages exclude completed records.
6. Official card display respects max 4 straight bets, max 3 props, max 1 parlay, max 3 longshots.
7. Correlation protection prevents same-game overstacking.
8. VIP/free gating must not leak VIP `fullAnalysis` through public API.
9. Existing import schemas must remain valid:
   - `{ "table": "propsLab", "records": [...] }`
   - `{ "batches": [...] }`
10. Valid aliases: `picks`, `propsLab`, `lottoParlays`, `longshots`.

## Pick of the Day hard display contract

Fix the Pick of the Day card so it cannot be ambiguous.

A Pick of the Day record must show a complete betting ticket, not just a short pick label.

Required eligibility:

- `Official Bet = Yes`
- `Pick of the Day Eligible = Yes`
- `Units > 0`
- `Grade` is `A+`, `A`, or `B`
- `Status` is `Pending`, `Released`, `VIP Released`, or `Free Released`
- `Category` is not `Watchlist` or `Pass`
- `Odds` is real and not `Watchlist`, `Live only`, `Pass`, `N/A`, blank, or null
- `Game` contains a real matchup/event
- `Pick` contains a real selection and line/market where applicable
- `Bet Type` identifies the market
- `Best Number` and `No Bet Cutoff` are populated

Required UI fields:

1. Sport / League
2. Game / Event
3. Start time if available
4. Bet Type / Market
5. Selection
6. Line / Spread / Total / Prop threshold
7. Odds
8. Sportsbook or `Shop best price`
9. Grade
10. Units
11. Best Number
12. No Bet Cutoff
13. Why We Like It / short writeup
14. Risk note or What Can Go Wrong

Reject ambiguous cards such as:

- `Under 174` without matchup
- `Padres` without market/odds/line
- `Elite Favorite Set-1 Loss Live Watchlist`
- `Cubs ML Watchlist`
- prop without player and threshold
- total without matchup
- futures label without market and team

If no record passes this strict contract, show:

`No Pick of the Day yet — check back after lines confirm.`

Recommended display format:

```text
Pick of the Day
[Selection + Line]
[Sport/League] — [Game/Event]
Market: [Bet Type]
Odds: [Odds] at [Sportsbook]
Units: [Units]u
Grade: [Grade]
Best Number: [Best Number]
No Bet Cutoff: [No Bet Cutoff]
Why We Like It: [short writeup]
Risk: [risk note]
```

## Pick of the Day acceptance tests

- Generic tennis live rule never appears as Pick of the Day.
- Units must be greater than 0.
- Odds must be real.
- Game/player/pick must be specific and actionable.
- Watchlist/Pass/Live-only cannot be selected.
- A total must include the matchup and total number.
- A prop must include player, threshold, stat, and odds.
- A side must include team/selection, market, odds, units, best number, and cutoff.
- If any required display field is missing, fallback text is shown instead of an ambiguous card.

## Results archive acceptance tests

- Set Result = Win/Loss/Push/Void/Cancelled on a test record.
- Run settlement.
- Confirm Profit/Loss and ROI calculate.
- Confirm record copies to Results Archive.
- Confirm active record is removed only after archive creation succeeds.
- Confirm Results page still displays archived result.
- Confirm active pages no longer show completed pick.
- Re-run archive and confirm duplicates are not created.

## Import aliases

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
