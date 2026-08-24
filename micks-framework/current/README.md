# Micks Picks Framework — Current Setup

Effective date: 2026-08-24

This folder stores the active Micks Picks operating framework used for daily all-sports runs, candidate scoring, Pick of the Day selection, Futures Lab evaluation, results archiving, research-agent work and site publishing.

## Core principle

Micks Picks is **Micks-first**. Outside handicappers, VSiN, Doc’s Sports, AI-v3, Action Network, Covers, ESPN, TeamRankings, StatMuse, Sports Reference, Perplexity and any other source are supporting confirmation only. They do not create the handicap or grade by themselves.

The required daily-card decision order is:

1. Independent Micks handicap and fair-price estimate
2. Matchup / role / injury / lineup verification
3. Market Intelligence Layer
4. External-model and handicapper confirmation
5. Failure-case analysis
6. Final 110-point score, grade, units, Best Number and No-Bet Cutoff

## Master source registry — controlling

`source-registry.md` is the canonical checklist for every full Micks Picks research scan and rerun.

A full scan is not complete until every applicable source category in that registry has been checked and classified as CURRENT, STALE, INACCESSIBLE, NOT APPLICABLE, or SUPPORTING ONLY.

The registry is cumulative across all files and modules in `micks-framework/current/` and historical framework requirements. If another framework file names a provider/tool that is missing from `source-registry.md`, the registry must be updated before the next full scan rather than silently omitting the source.

## Micks 2.0 Market Intelligence Layer

`market-intelligence-layer.md` is a permanent active module.

It adds a 20-point market-intelligence component to the existing 110-point daily-card scoring framework:

- Sharp / respected movement: 0–6
- Ticket / handle divergence: 0–5
- Liquidity / market quality: 0–4
- Movement timing / reversal quality: 0–5

The market layer is read only **after** the independent handicap is formed. It may confirm, challenge or downgrade Micks; it may never create a play by itself.

Doc’s Sports AI-v3 (`https://www.docsports.com/cappers.html?cap_id=88`) is a dynamic comparison source for this layer when it has a current relevant selection. Model descriptions or marketing claims do not earn score points.

## Futures Lab

`futures-lab.md` and `futures-lab.json` control all long-horizon markets. `futures-source-registry.md` is the futures-specific model/source checklist.

Futures are evaluated separately from the daily card. They use:

- independent Micks probability estimates
- multi-book implied probabilities and de-vigged market consensus
- independent projection/model inputs
- scenario or Monte Carlo simulation where appropriate
- roster, role, health, schedule and structural path analysis
- the Market Intelligence Layer
- price/EV, correlation and opportunity-cost controls

Futures use a separate 100-point score and separate bankroll ledger. They do **not** consume Recovery Mode+ daily official-play slots.

Default Futures Lab release gates:

- score >= 78/100
- Failure Score >= 7/10
- estimated EV >= 5%
- 8%+ preferred for long-dated markets
- 10%+ preferred for thin, high-variance outrights
- at least two independent support paths beyond the sportsbook price

Default open futures exposure is capped at 2.00u, with 0.50u maximum per future and 0.75u maximum per correlated outcome cluster unless explicitly overridden.

Every full all-sports scan must check for material futures value, but futures are never forced.

## CLV tracking

Closing Line Value is a mandatory post-release diagnostic whenever a reliable closing number is available.

Store release line/price, closing line/price, Beat Close / Neutral / Lost Close, CLV magnitude when calculable and closing-market source.

For futures, also track current-price / mark-to-market movement over the life of the position. CLV is only calculated against a genuinely comparable closing market or threshold.

Review rolling CLV over 20, 50 and 100 official plays by sport, market family, grade and release timing. CLV never changes the result of a settled bet or retroactively changes its grade.

## Every run must include

1. Master Picks
2. Props Lab
3. NRFI/YRFI and derivative-market candidates where applicable
4. Futures Lab scan
5. Lotto Parlays
6. Longshots
7. Watchlist / Live-only angles
8. Passes
9. Pick of the Day
10. Scored candidate chart before final release

## Official limits

Normal daily-card limits remain governed by the current framework and any active Recovery Mode rules. Do not force every sport to produce a bet, and do not exceed the active exposure cap merely because more candidates clear a raw score threshold.

Futures exposure is tracked separately under `futures-lab.md`.

## Recovery Mode+

When active:

- Minimum daily-card release score: 82/110
- Minimum Failure Score: 7/10
- Current daily play cap applies
- No release based mainly on one model, one handicapper or one market signal
- Exact price must remain inside the No-Bet Cutoff
- Futures Lab positions do not consume the daily play cap

## Pick of the Day rules

Pick of the Day must be a real, actionable daily-card official release with a live price, positive units and a qualifying grade. Futures, watchlists, passes, live-only placeholders and generic framework rules are not Pick of the Day unless a separate Futures Feature designation is explicitly created.

## Results archive

After settlement, completed daily-card rows move to Results Archive and are removed from the active card. Results tracking should include Profit/Loss and CLV fields when reliable closing data is available.

Futures remain active until the market is closed/graded and use their own lifecycle fields including posted price, current price, fair probability, estimated EV, correlation group and final result.

## Key files

- `source-registry.md` — canonical full-scan source checklist and sport-specific research stack
- `candidate-scoring-and-writeup-standard.md` — controlling 110-point daily-card score and grade rules
- `market-intelligence-layer.md` — market movement, splits, liquidity, timing and CLV rules
- `futures-lab.md` — Futures Lab probability, EV, scoring, exposure and tracking rules
- `futures-lab.json` — machine-readable Futures Lab configuration
- `futures-source-registry.md` — futures-specific model/source checklist
- `reference-guide-inventory.md` — stored annual-guide inventory and guide-ingestion policy
- `framework.md` — human-readable operating rules
- `framework.json` — machine-readable framework/config
- `perplexity-master-prompt.txt` — research-agent prompt
- `codex-maintenance-prompt.md` — site/framework maintenance prompt
