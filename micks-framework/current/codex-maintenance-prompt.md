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

## Pick of the Day acceptance tests

- Generic tennis live rule never appears as Pick of the Day.
- Units must be greater than 0.
- Odds must be real.
- Game/player/pick must be specific and actionable.
- Watchlist/Pass/Live-only cannot be selected.

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
