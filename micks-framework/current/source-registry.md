# Micks Picks Master Source Registry

Status: Permanent controlling source registry
Effective date: 2026-08-20
Applies to: Every full all-sports Micks Picks scan, rerun, candidate build, props scan, NRFI/YRFI scan, market refresh, and pre-publication validation.

## Governing Rule

This file is the canonical research-source checklist for Micks Picks. A full scan is not complete until every applicable required source below has been checked, marked stale/inaccessible, or documented as not applicable to the active sport/market.

No source creates a bet by itself. Micks Picks remains Micks-first. Sources confirm, challenge, downgrade, or invalidate a handicap.

If another file in `micks-framework/current/` names a source that is not listed here, add it here before the next full scan. This registry is cumulative across the current framework and historical modules; do not silently drop a source because it was omitted from a condensed framework file.

## Scan Status Labels

For every source used in a full run, internally classify it as one of:

- CURRENT — current-date data available and checked
- STALE — source checked but data is not current enough to score
- INACCESSIBLE — source or specific tool could not be accessed
- NOT APPLICABLE — source does not apply to today's active sport/market
- SUPPORTING ONLY — useful context but not eligible to create independent confirmation by itself

Never invent data for a source marked STALE or INACCESSIBLE.

---

# 1. Market Board, Odds, Line Movement and Betting Splits

## VSiN — mandatory every full scan

- Main: https://vsin.com/
- Vegas Betting Sheets / Circa: https://vsin.com/tools/vegas-betting-sheets/
- Daily sport analysis pages for all active sports
- Betting splits
- Matchup ratings
- Power ratings
- MLB YRFI/NRFI tools
- MLB First Five tools
- Player prop tools / projections
- Team analyzers when available
- JOLT/VOLT or equivalent current model/edge tools when available

Required checks:
- current Circa line
- opening/current movement
- full-game and derivative prices
- ticket percentage
- handle percentage
- public-versus-respected-money gaps
- line movement relative to splits

## Circa Sports

Use current Circa numbers obtained through the VSiN Vegas Betting Sheets or other verified Circa market source when available.

Required fields for official candidates:
- opening line
- current line
- relevant derivative
- best number
- no-bet cutoff

## Action Network

- https://www.actionnetwork.com/

Use for:
- current odds/market comparison
- injuries/news when current
- public betting and market movement when explicitly sourced
- consensus context

## Covers

- https://www.covers.com/

Use for:
- current matchup pages
- odds/line movement
- injuries
- trends only as secondary context
- consensus/public-market context when verifiable

## Sportsbook / user screenshots

User-provided current book screenshots are primary execution evidence for the actual bettable number. Compare them against market-reference sources before release.

---

# 2. Cross-Sport Statistical and News Validation

## TeamRankings — mandatory when sport is supported

- https://www.teamrankings.com/
- https://www2.teamrankings.com/

Use for:
- matchup statistics
- efficiency
- recent splits
- home/away splits
- scoring margins
- offensive/defensive rates
- ATS/cover performance when available
- close-game performance
- sport-specific rankings

## StatMuse — mandatory where useful

- https://www.statmuse.com/

Use for:
- last 5/10/15/20 form
- player/team splits
- threshold hit-rate validation
- recent scoring/rebounding/assist/strikeout production
- direct comparison questions

Do not use a raw StatMuse average without distribution/threshold context when grading props.

## Sports Reference network — mandatory when sport is supported

- Main: https://www.sports-reference.com/
- Baseball Reference: https://www.baseball-reference.com/
- Basketball Reference: https://www.basketball-reference.com/
- Pro Football Reference: https://www.pro-football-reference.com/
- Hockey Reference: https://www.hockey-reference.com/
- FBref: https://fbref.com/
- College Football Reference: https://www.sports-reference.com/cfb/
- College Basketball Reference: https://www.sports-reference.com/cbb/
- Stathead: https://www.sports-reference.com/stathead/

Use for:
- current and historical player/team game logs
- season and career statistics
- home/away and situational splits
- schedule/result and box-score verification
- historical matchup and threshold context
- advanced statistics where available
- WNBA/NBA player and team history through Basketball Reference
- NFL player/team history through Pro Football Reference
- NHL player/team history through Hockey Reference
- soccer player/team/competition statistics through FBref
- college football/basketball historical validation

Rules:
- Treat Sports Reference as statistical/historical verification, not a betting-market or line-movement source.
- Prefer current official league/team sources for same-day injury, lineup, starter, rotation, game-status, and transaction confirmation.
- Do not let historical head-to-head records override current personnel, role, market, or matchup evidence.
- Use threshold distributions/game logs rather than raw averages when evaluating player props whenever possible.
- Stathead may be used for deeper historical queries when accessible.

## ESPN

- https://www.espn.com/

Use for:
- schedules
- box scores
- injuries
- depth charts / lineups when current
- standings and official-stat cross-checks

## Opta / The Analyst

- https://theanalyst.com/

Use for:
- advanced soccer/football analytics
- possession, expected-goals and efficiency context
- tournament and team-strength context where applicable

## NY Post Sports

- https://nypost.com/sports/

Use as a current article/beat-information source when the article is directly relevant. It is not a model or primary statistical authority.

## Credible current articles and credentialed beat reporters

Required when injuries, rotations, minutes, pitcher workload, quarterback usage, goalie status, rest/shutdown risk, or coaching comments materially affect the handicap.

Official team/league reporting outranks rumor aggregation.

---

# 3. Doc's Sports — mandatory exact URLs supplied by user

- Main / Free Picks: https://www.docsports.com/#freepicks
- Match statistics: https://www.docsports.com/statistics/matches.html
- Free-pick videos: https://www.docsports.com/video/free-picks/

Rules:
- Check all three on every full scan.
- If an individual page is stale, mark it STALE and award zero confirmation points.
- A Doc's opinion is supporting confirmation only.
- Do not infer a pick from a video title when the actual selection is not visible.

---

# 4. MLB Primary Research Stack — mandatory for MLB candidates

## Baseball Savant / Statcast

- https://baseballsavant.mlb.com/

Use for:
- pitch velocity
- pitch mix
- whiff rate
- chase rate
- called-strike + whiff indicators
- barrel rate
- hard-hit rate
- expected statistics
- batted-ball quality
- pitcher movement / arsenal changes
- batter platoon and pitch-type vulnerabilities

## FanGraphs

- https://www.fangraphs.com/

Use for:
- wRC+
- K% / BB%
- FIP / xFIP
- WAR context
- bullpen performance
- splits
- plate-discipline metrics
- pitching workload/context

## Baseball Reference

- https://www.baseball-reference.com/

Use for:
- game logs
- historical splits
- starter usage
- batting/pitching summaries
- park and team context
- schedule/result verification

Baseball Reference is also part of the mandatory cross-sport Sports Reference network above; this MLB section defines its baseball-specific use.

## Umpire Scorecards — mandatory for umpire-sensitive MLB markets

- https://umpscorecards.com/

Check when an umpire assignment is available, especially for:
- NRFI/YRFI
- game totals
- First Five totals
- pitcher strikeout props
- pitcher walk props
- borderline command/contact handicaps

Track where available:
- called-strike accuracy
- expected/actual run impact
- consistency
- zone tendency
- historical hitter/pitcher lean

Umpire data is a supporting adjustment, not a standalone bet signal. If the assignment is not confirmed, do not assume an umpire.

## MLB official / lineup and probable-pitcher sources

- https://www.mlb.com/

Use for:
- probable pitchers
- confirmed lineups when posted
- injuries/transactions
- game status

Reliable lineup/beat sources may supplement MLB.com when they are faster, but official confirmation takes priority.

## MLB weather and park context

- https://www.weather.gov/

Mandatory checks for outdoor MLB games:
- temperature
- wind speed/direction
- precipitation/delay risk
- humidity when material
- roof/open-air status where relevant

Park factor must be considered for totals, team totals, HR props, and YRFI/NRFI.

## Bullpen availability — mandatory

For every MLB side/total/team-total/F5-to-full-game comparison, check:
- bullpen innings over the prior 2 days
- closer/high-leverage usage
- back-to-back availability
- recent bullpen performance
- likely bridge relievers

FanGraphs, Baseball Reference, MLB game logs, and current team reporting may be used together.

## MLB market-family requirements

### NRFI/YRFI
Mandatory source categories:
- VSiN YRFI/NRFI tool when available
- Umpire Scorecards when assignment confirmed
- Baseball Savant starter command/whiff data
- top-of-order recent form and platoon splits
- park/weather
- current price

### Pitcher strikeout props
Mandatory source categories:
- Baseball Savant pitch/whiff data
- FanGraphs K%/BB% and opponent K profile
- StatMuse recent strikeout distribution
- confirmed lineup
- pitch count/leash reporting
- umpire when confirmed and material
- current prop price

### Team totals
Mandatory source categories:
- recent offense last 5/10/15
- threshold hit rate last 10/20
- Baseball Savant contact quality
- FanGraphs offense/platoon metrics
- opposing starter pitch traits
- bullpen availability
- park/weather
- current number/price

---

# 5. NFL / Football Sources

## VSiN NFL Betting Guide

Use as a preseason/season baseline only. Current injuries, depth charts, usage and efficiency override guide assumptions.

## Fantasy Life

- https://www.fantasylife.com/

Use for:
- player projections
- depth-chart and usage baseline
- routes/targets/carries role context
- fantasy-football role information

## NFL official

- https://www.nfl.com/

Use for:
- schedules
- inactives
- injury information
- depth-chart context
- official game status

## Required NFL data categories

For sides/totals/props, obtain current data for:
- EPA
- success rate
- yards per play
- pressure/sack rate
- explosive-play rate
- points per drive
- third-down efficiency
- red-zone efficiency
- neutral-script pass rate / pace
- offensive-line health
- snap share
- route share
- carries/targets
- red-zone role
- current weather
- ticket/handle splits and line movement

DraftKings-style ticket data may be used as a public-position indicator when verifiable. Circa handle/ticket gaps are preferred high-limit context when available.

---

# 6. NBA / WNBA / Basketball Sources

Mandatory source categories:
- VSiN current matchup/model pages
- TeamRankings
- StatMuse
- Basketball Reference / Sports Reference network
- official league/team injury reports
- current beat reporting
- confirmed starters / projected rotations
- current sportsbook line

Required metrics where applicable:
- pace / possessions
- offensive/defensive efficiency
- points per game / opponent points
- scoring margin
- rebounding
- assists/turnovers
- recent 5/10 form
- home/away splits
- minutes/usage
- potential assists / rebound chances where available
- foul trouble / matchup role risk

WNBA expansion-team and roster-volatility context must be explicitly checked.

---

# 7. NHL Sources

## MoneyPuck

- https://moneypuck.com/

## Natural Stat Trick

- https://www.naturalstattrick.com/

## Evolving-Hockey

- https://evolving-hockey.com/

## TeamRankings NHL

- https://www.teamrankings.com/nhl/

## Hockey Reference / Sports Reference

- https://www.hockey-reference.com/

Use for historical game logs, player/team splits, schedules/results, and statistical verification.

Mandatory NHL checks:
- confirmed goalie
- injuries
- expected goals / shot quality
- five-on-five play
- special teams
- rest/travel
- current price

---

# 8. Soccer Sources

Use where applicable:
- Opta / The Analyst: https://theanalyst.com/
- FBref / Sports Reference: https://fbref.com/
- ESPN: https://www.espn.com/
- current league/team injury and lineup sources
- current odds / VSiN when available

Required checks:
- xG / chance quality
- lineup and goalkeeper
- rest/travel
- tournament format / To Advance structure
- home/away context
- current price

---

# 9. UFC / Boxing Sources

Mandatory checks:
- fight still active
- official weigh-ins
- current odds and movement
- opponent/style matchup
- credible current reporting

No weigh-in or bout-status uncertainty can be ignored for an official release.

---

# 10. Tennis Sources

Pilot market. Use:
- current odds
- surface results / surface Elo when available
- hold/break percentages
- fatigue / schedule
- injury reporting
- current draw/motivation context

Maximum grade/stake rules remain governed by the Tennis framework.

---

# 11. NASCAR / Motorsports Sources

Required checks:
- race status
- current odds
- starting position
- practice speed
- qualifying speed
- simulation/model support
- weather
- market type

No pre-race pick after the event starts.

---

# 12. Named Outside Handicappers / Supporting Sources Found in Framework

These may be checked when current and applicable, but never replace independent Micks analysis:

- Greg Peterson
- T Shoe
- VSiN editorial handicappers
- Doc's Sports handicappers
- Action Network analysts
- Covers analysts

Two articles repeating the same underlying argument count as one evidence path.

---

# 13. Perplexity / Research-Agent Role

Perplexity may be used to search and cite current data but does not handicap the card. The Micks framework determines the score, grade, units and release decision.

Research-agent output must be reconciled against primary sources before it earns independent-confirmation credit.

---

# 14. Full Daily Scan Enforcement

Before a full Micks Picks run can be labeled COMPLETE:

1. Inventory every active sport on the current board.
2. Check VSiN main page and Vegas Betting Sheets/Circa.
3. Check all three user-supplied Doc's URLs.
4. Check TeamRankings for every supported active sport.
5. Check StatMuse where recent-form/player-distribution questions apply.
6. Check the applicable Sports Reference site for every supported active sport.
7. Check sport-specific primary sources from this registry.
8. Check injuries, lineups, pitchers, goalies, rotations and role changes.
9. Check weather/park/field conditions where relevant.
10. Check bullpen availability for MLB.
11. Check Umpire Scorecards for umpire-sensitive MLB markets when assignments are confirmed.
12. Check market splits, opening/current movement and exact executable price.
13. Include props and NRFI/YRFI in the candidate pool before final ranking.
14. Apply the current Micks scoring framework, Recovery Mode, market-family penalties and failure-case score.
15. Record conflicts; do not average conflicting sources away.
16. Show the scored candidate chart/table on every full run/rerun.
17. If a required source is stale/inaccessible, state that explicitly and reduce confidence when material.

## Completion Standard

A scan is NOT complete merely because several websites were searched. Completion means every applicable source category in this registry was addressed for the active slate and market types under consideration.
