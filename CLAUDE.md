# DomCom Insure (domcominsure.shmor.ai)

A Shmor marketplace (shared rules in `../../CLAUDE.md`): its own brand, design and SEO. **Domestic and commercial insurance** explained and compared for the UK, US and Europe: home, buildings, contents, renters, landlord, car, travel, life, flood on the domestic side; public/general liability, employers’ liability, workers’ comp, professional indemnity, commercial property, trades, cyber, D&O, BOP, van, fleet and home business on the commercial side. Repo: `Shmorai/shmor-domcominsure` (private until launch). Status: **building**, no referral links yet. Built 2026-10-15.

## Where things are
| What | Where |
|---|---|
| Card on shmor.ai, search keywords, **referral links**, offers, SEO defaults | `shmor-site.json` |
| Pages (1 JSON file = 1 Google landing page) | `content/` (`home.json` = homepage, `content/blog/*.json` = posts) |
| Site-specific blocks: `split`, `schedule`, `covers`, `matrix`, `checker` | `tools/blocks.js` (documented at the top) |
| Cover checker logic (questions → covers) | `content/cover-checker.json` (data) + bottom of `assets/site.js` (filtering, URL state) |
| Design: header, logo, footer | `templates/layout.html` |
| Design: styles | `assets/site.css` (kit defaults at the top; **DomCom Insure theme** block at the bottom) |
| Logo mark | `assets/favicon.svg` (also inlined in the layout and in `shmor-site.json` → `card.logo`) |
| Generated output (don't edit by hand) | `index.html`, `*/index.html`, `sitemap.xml`, `robots.txt`, `404.html`, `search/`, `blog/feed.xml` |

## Pages (52)
- **Domestic (9):** home-insurance, buildings-insurance, contents-insurance, renters-insurance, landlord-insurance, car-insurance, travel-insurance, life-insurance, flood-insurance
- **Commercial (13):** business-insurance, public-liability-insurance, employers-liability-insurance, workers-compensation, professional-indemnity-insurance, commercial-property-insurance, tradesperson-insurance, cyber-insurance, directors-and-officers-insurance, business-owners-policy, van-insurance, fleet-insurance, home-business-insurance
- **Tools & hubs (8 + home):** cover-checker, how-to-compare-insurance, insurers (directory with UK/US/EU/comparison-site tabs), claims, insurance-glossary, usa, europe, blog
- **Blog (21 posts, 2026-09-15 → 2026-10-15):** FCA renewal pricing rules, employers’ liability penalties, NFIP reauthorization (deadline 11 Dec 2026 as of 15 Oct), Flood Re, under-insurance/average, winter checklist, IPT, monthly vs annual (FCA premium finance report Feb 2026), new business checklist, PL vs PI, working from home, unoccupied property, excess/deductibles, non-disclosure (CIDRA 2012 / Insurance Act 2015), cyber basics, Christmas gifts & contents, storm claims (2026/27 storm names), how to claim, business interruption, driving in Europe, hurricane deductibles.
- Top menu = pages with `navOrder`: Home insurance, Business insurance, Car, Liability, Insurers, Blog, Cover checker (styled as a button).
- **Footer** is hand-curated in `templates/layout.html` (Domestic / Commercial / Tools & guides / Shmor.ai columns). **Add new guide pages to the right column.**
- **Side colour:** the theme CSS lists domestic page classes (coral) and commercial page classes (teal) near the top of the theme block. **Add new page slugs there** so their hero stripe, section markers and clause numbers get the right colour.

## Design: "policy paper" (built 2026-10-15)
Warm paper background #F7F4EE, ink navy #14203A (top line, hero, footer, CTA band), violet accent #5B4BDB (buttons, links; card accent on shmor.ai #8B7CFF), **Domestic = coral #E2572A**, **Commercial = teal #0F7C7C**. Fonts: Sora (headings), Figtree (body), IBM Plex Mono (labels, clause numbers). Logo: a shield split diagonally, coral half with a house, teal half with an office block; wordmark “**Dom**Com Insure” in coral/teal/ink. Navy top line with “Part of the Shmor.ai network” and a Domestic | Commercial switch. Home: navy hero with coral/teal/violet glows and two white Domestic/Commercial panels overlapping its bottom edge. Inner pages: photo hero with ink overlay and a side-coloured bottom stripe; an “At a glance” policy-schedule card (dashed rule, “Ref. DOM-HOME” style reference); prose headings numbered “§ 1, § 2…” like a policy wording; FAQs on a sand band; navy footer with a perforated tear-off edge. Mobile checked at 375px (no horizontal scroll on sampled pages).

## Content rules (insurance-specific)
- General information, never personal advice. No invented prices, premiums, savings, ratings or reviews. The insurers directory has **no rankings**.
- Date anything that changes (“as of …”): NFIP deadline, IPT rates, FCA reviews, storm names. Re-check these when refreshing.
- Legal facts checked 2026-10-15 against GOV.UK (employers’ liability £5m minimum, £2,500/day and £1,000 fines), FCA (PS21/5 renewal pricing; premium finance final report Feb 2026), Flood Re (pre-2009 homes, ends 2039), CRS (NFIP authorized to 11 Dec 2026), FSCS (100% compulsory / 90% other GI), III (hurricane deductibles 1–5%, 19 states + DC), GOV.UK (no green card for EU since Aug 2021), Aviva completed Direct Line acquisition July 2025.
- Photos: free-licence Unsplash only (images.unsplash.com), found via unsplash.com search with `?license=free`.

## Referral links (none yet)
Programmes worth applying to (user must join; never invent IDs): UK comparison sites (Compare the Market, MoneySuperMarket, GoCompare, Confused.com), business insurance brokers (Simply Business, Superscript, Hiscox, AXA Business), landlord insurers, US (Policygenius, The Zebra, Insurify, Next/Hiscox US/The Hartford small business), EU (Check24, LesFurets, Rastreator, Facile.it). Note: insurance affiliate promotions in the UK must stay within FCA financial promotion rules (introducer arrangements); check each programme’s terms. When links arrive: add to `shmor-site.json` → `"links"`, then list slugs in a page’s `"partners"` or use `"link"` on `specs` items in `content/insurers.json`. Rebuild, sync the master, commit both repos.

## Commands (run here)
```bash
node tools/build.js           # rebuild after ANY change to content/, templates/ or shmor-site.json
node tools/build.js --check   # validate only
node tools/serve.js 4014      # preview http://localhost:4014  (preview config "domcominsure")
```
After changing `shmor-site.json`, also run `node tools/sync-network.js` in `../../shmor-ai`.

## Ideas / next
Referral links (above) · more country pages (Germany, France, Spain) · business-type pages (shop, café/restaurant, salon, consultant, landlord portfolio) · seasonal blog refresh (hurricane season June, storm season autumn, renewal season) · after launch: Search Console + sitemap.
