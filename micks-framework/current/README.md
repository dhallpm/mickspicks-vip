# Micks Picks Framework — Current Setup

Backup date: 2026-06-07

This folder stores the active Micks Picks operating framework used for daily all-sports runs, Airtable import files, Pick of the Day routing, results archiving, Perplexity research, and Codex repair prompts.

## Core principle

Micks Picks is **Micks-first**. Outside handicappers, VSiN, Greg Peterson, T Shoe, Action Network, Covers, ESPN, NY Post, Opta, Perplexity, and any other source are supporting confirmation only. They do not create the grade by themselves.

## Every run must include

1. Master Picks
2. Props Lab
3. Lotto Parlays
4. Longshots
5. Watchlist / Live-only angles
6. Passes
7. Pick of the Day
8. Separate import JSON files
9. One complete all-sections Airtable import JSON

## Official limits

- Max official straight bets: 4
- Max official props: 3
- Max main parlay: 1
- Max longshots: 3
- Longshot total exposure: 0.15u max unless user requests lotto card
- Target official card exposure: 1.25u to 2.25u
- Do not force every sport to produce a bet

## Pick of the Day rules

Pick of the Day must be real, actionable, odds available, Grade A+/A/B, and Units > 0.

Never eligible:

- Watchlist
- Pass
- Live only
- Generic framework rules
- Units = 0
- Odds = Watchlist, Live only, Pass, or N/A

## Airtable import shape

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

Valid aliases: `picks`, `propsLab`, `lottoParlays`, `longshots`.

Do not include `Result`, `Outcome`, or `Profit/Loss` fields in new imports.

## Results archive

After settlement, completed rows move from active tables to Results Archive. Active pages exclude completed picks. Results page reads Results Archive as source of truth.

## Files in this folder

- `framework.md` — human-readable rules
- `framework.json` — machine-readable rules/config
- `perplexity-master-prompt.txt` — prompt for Perplexity research runs
- `codex-maintenance-prompt.md` — prompt for Codex/site repair

A dated copy is also stored under `micks-framework/backups/2026-06-07/`.
