# Mick's Picks VIP

This repo backs the standalone VIP project:

https://mickspicks-vip.vercel.app/premium.html

The public site at `www.mickspicks.us` should link VIP entry buttons to that
premium vault page, not to the public `#vip` preview tab.

## Routing

- `/premium.html` is the VIP Vault page.
- `/vip/` redirects to `/premium.html?v=fullanalysis4#vip` for old internal links.
- Public teaser pages should not include full VIP analysis in their HTML payload.

## Projects

- Public repo: `mickstaste` -> `www.mickspicks.us`
- VIP repo: `mickspicks-vip` -> `mickspicks-vip.vercel.app/premium.html`
