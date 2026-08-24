# Micks Picks Framework — Current Setup

Effective date: 2026-08-23

This folder stores the active Micks Picks operating framework used for daily all-sports runs, candidate scoring, Pick of the Day selection, results archiving, research-agent work and site publishing.

## Core principle

Micks Picks is **Micks-first**. Outside handicappers, VSiN, Doc’s Sports, AI-v3, Action Network, Covers, ESPN, TeamRankings, StatMuse, Sports Reference, Perplexity and any other source are supporting confirmation only. They do not create the handicap or grade by themselves.

The required decision order is:

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

`market-intelligence-layer.md` is now a permanent active module.

It adds a 20-point market-intelligence component to the existing 110-point scoring framework:

- Sharp / respected movement: 0–6
- Ticket / handle divergence: 0–5
- Liquidity / market quality: 0–4
- Movement timing / reversal quality: 0–5

The market layer is read only **after** the independent handicap is formed. It may confirm, challenge or downgrade Micks; it may never create a play by itself.

Doc’s Sports AI-v3 (`https://www.docsports.com/cappers.html?cap_id=88`) is a dedicated comparison source for this layer when it has a current relevant selection. Model descriptions or marketing claims do not earn score points.

## CLV tracking

Closing Line Value is a mandatory post-release diagnostic whenever a reliable closing number is available.

Store release line/price, closing line/price, Beat Close / Neutral / Lost Close, CLV magnitude when calculable and closing-market source.

Review rolling CLV over 20, 50 and 100 official plays by sport, market family, grade and release timing. CLV never changes the result of a settled bet or retroactively changes its grade.

## Every run must include

1. Master Picks
2. Props Lab
3. NRFI/YRFI and derivative-market candidates where applicable
4. Lotto Parlays
5. Longshots
6. Watchlist / Live-only angles
7. Passes
8. Pick of the Day
9. Scored candidate chart before final release

## Official limits

Normal card limits remain governed by the current framework and any active Recovery Mode rules. Do not force every sport to produce a bet, and do not exceed the active exposure cap merely because more candidates clear a raw score threshold.

## Recovery Mode+

When active:

- Minimum release score: 82/110
- Minimum Failure Score: 7/10
- Current play cap applies
- No release based mainly on one model, one handicapper or one market signal
- Exact price must remain inside the No-Bet Cutoff

## Pick of the Day rules

Pick of the Day must be a real, actionable official release with a live price, positive units and a qualifying grade. Watchlists, passes, live-only placeholders and generic framework rules are never eligible.

## Results archive

After settlement, completed rows move to Results Archive and are removed from the active card. Results tracking should include Profit/Loss and CLV fields when reliable closing data is available.

## Key files

- `source-registry.md` — canonical full-scan source checklist and sport-specific research stack
- `candidate-scoring-and-writeup-standard.md` — controlling 110-point candidate score and grade rules
- `market-intelligence-layer.md` — market movement, splits, liquidity, timing and CLV rules
- `framework.md` — human-readable operating rules
- `framework.json` — machine-readable framework/config
- `perplexity-master-prompt.txt` — research-agent prompt
- `codex-maintenance-prompt.md` — site/framework maintenance prompt
