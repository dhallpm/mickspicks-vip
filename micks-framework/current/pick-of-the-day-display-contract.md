# Pick of the Day Display Contract

Backup date: 2026-06-07

## Problem

Pick of the Day has been too ambiguous when the selected record only shows a loose label like a team, total, live rule, or short pick name. A customer must be able to read the Pick of the Day card and know exactly what ticket to place without guessing.

## Hard rule

Pick of the Day must display as a complete betting ticket, not just a pick label.

## Required eligibility

A record is Pick of the Day eligible only if all are true:

- `Official Bet = Yes`
- `Pick of the Day Eligible = Yes`
- `Units > 0`
- `Grade` is `A+`, `A`, or `B`
- `Status` is `Pending`, `Released`, `VIP Released`, or `Free Released`
- `Category` is not `Watchlist` or `Pass`
- `Odds` is real and not `Watchlist`, `Live only`, `Pass`, `N/A`, blank, or null
- `Game` contains a real matchup or event name
- `Pick` contains a real selection and line/market where applicable
- `Bet Type` identifies the market
- `Best Number` and `No Bet Cutoff` are populated

## Required display fields

The Pick of the Day UI must show all of these:

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

## Display format

Use this format:

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

## Examples

Good:

```text
Pick of the Day
Chicago Sky vs Toronto Tempo Under 174
WNBA — Chicago Sky vs Toronto Tempo
Market: Game Total
Odds: -110 at Shop best price
Units: 0.5u
Grade: B
Best Number: Under 174
No Bet Cutoff: Under 172
Why We Like It: T Shoe projects 166.5 and both teams' home/road splits point lower.
Risk: Late fouling and free throws can hurt WNBA unders.
```

Good:

```text
Pick of the Day
San Diego Padres ML -110
MLB — New York Mets vs San Diego Padres
Market: Moneyline
Odds: -110 at Shop best price
Units: 0.5u
Grade: B
Best Number: -110 or better
No Bet Cutoff: -125
Why We Like It: Padres have underpriced-market support, bullpen edge, and Mets road-fade context.
Risk: San Diego offense can stall if the Mets starter is sharp.
```

Bad / reject:

```text
Pick of the Day
Under 174
```

Bad / reject:

```text
Pick of the Day
Padres
```

Bad / reject:

```text
Pick of the Day
Elite Favorite Set-1 Loss Live Watchlist
```

Bad / reject:

```text
Pick of the Day
Cubs ML Watchlist
```

## Ambiguity rejection rules

Reject or skip the record if the card would show only:

- team name without market/line
- total without matchup
- prop without player
- player without prop threshold
- live rule without actual match
- futures label without group/team/market
- odds without sportsbook/market
- any record with Units = 0
- any Watchlist/Pass record

## Selection-label builder

The app should build a normalized display label from fields:

```ts
selectionLabel = buildPickLabel(record)
```

Recommended logic:

- Moneyline: `[Team/Selection] ML [Odds]`
- Spread: `[Team/Selection] [Spread] ([Odds])`
- Total: `[Game] [Over/Under] [Total] ([Odds])`
- Player prop: `[Player] [Over/Under] [Threshold] [Stat] ([Odds])`
- Team total: `[Team] Team Total [Over/Under] [Number] ([Odds])`
- Futures: `[Team] [Market] [Odds]`

If the required pieces cannot be built, the record is not eligible.

## Fallback

If no record passes the strict display contract, show:

```text
No Pick of the Day yet — check back after lines confirm.
```

Do not show an ambiguous card.
