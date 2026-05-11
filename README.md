# Mick's Picks VIP Repo Starter

Use this as a separate GitHub Pages repo for:

https://vip.mickspicks.us

This fixes the 404 after Cloudflare login.

## Why the 404 happened

Cloudflare Access worked because it sent you a login code.

The 404 happened after login because GitHub Pages does not yet have a separate site/repository assigned to the custom hostname:

vip.mickspicks.us

## How to use

1. Create a new GitHub repo named:

mickspicks-vip

2. Upload these files:
- index.html
- CNAME
- .nojekyll

3. Go to the new repo:
Settings → Pages

4. Set:
Source: Deploy from a branch
Branch: main
Folder: /root

5. Under Custom domain, enter:

vip.mickspicks.us

6. Save.

7. Wait for the DNS check.

8. Open:

https://vip.mickspicks.us

Cloudflare should ask for email/code first, then the VIP portal should load.

## Important

Do not change the custom domain on your current public repo if it is already using:

www.mickspicks.us

Keep public and VIP separate:

Public repo:
mickstaste → www.mickspicks.us

VIP repo:
mickspicks-vip → vip.mickspicks.us
