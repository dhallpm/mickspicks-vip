# Mick's Picks VIP

This repo backs the standalone VIP project:

https://vip.mickspicks.us/

The public site at `www.mickspicks.us` should link VIP entry buttons to that
premium vault page, not to the public `#vip` preview tab.

## Routing

- `/` is the canonical VIP Vault page; `/premium.html` redirects to it.
- `/vip` and `/vip/` redirect to `/` for old internal links.
- Public teaser pages should not include full VIP analysis in their HTML payload.

## Projects

- Public repo: `mickstaste` -> `www.mickspicks.us`
- VIP repo: `mickspicks-vip` -> `vip.mickspicks.us`
