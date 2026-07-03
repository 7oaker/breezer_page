# SEO / AEO Audit — breezer.now

**Date:** 2026-07-03 · **Auditor:** Claude Code (source-level audit, no live crawl)

## Stack recon

- **Framework:** None (static multi-page HTML). Webpack 5 + `html-webpack-plugin` builds `src/**/*.html` → `build/`, deployed on Vercel (`vercel.json`: `outputDirectory: build`).
- **Rendering:** Fully static. All titles, descriptions, canonicals, hreflang, and JSON-LD are hardcoded in the source HTML and present in the build output — **no route serves an empty shell to crawlers.** Verified `build/index.html`, `build/de/index.html`, `build/snus-tracker.html` heads match `src/`. `bundle.js` is injected at end of `<body>` (`webpack.config.js:51`).
- **Localization:** `src/de/index.html` is *generated* from `src/index.html` by `scripts/sync-de-index.mjs` on every build; the 4 German subpages are hand-maintained. Any fix to the DE homepage head must go into the sync script, not the file.
- **Routing quirk:** `/` and `/de/` run a client-side language redirect (`src/partials/language-router-head.html`) — it correctly excludes bots via UA regex (`/bot|crawl|spider|.../`), so no cloaking/redirect risk for crawlers.
- **Excluded from build (correct):** `blog-grid.html`, `blog-details.html`, `signin.html`, `signup.html`, `partials/` (`webpack.config.js:29-37`).
- **Indexable routes (10):** `/`, `/de/`, `/snus-tracker.html`, `/quit-snus.html`, `/zyn-tracker.html`, `/vs-snusless.html`, `/de/snus-tracker.html`, `/de/snus-aufhoeren.html`, `/de/zyn-tracker.html`, `/de/vs-snusless.html`. Noindexed: privacy ×2, EULA, `/invite/`. All 10 indexable routes are in the sitemap; no sitemap entry 404s or is noindexed. ✅

## What's already good

Unique, intent-matching titles + descriptions on all 10 indexable pages; exactly one H1 per page; correct canonicals; reciprocal on-page hreflang (except the x-default issue below); valid JSON-LD everywhere (all blocks parse); og:image 1200×630 with width/height/alt on subpages; all 35 homepage images have alt text; robots.txt explicitly allows GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot; demo template pages excluded from the build.

## Findings (sorted by impact ÷ effort)

| # | File/Route | Issue | Impact | Effort | Specific fix |
|---|-----------|-------|:------:|:------:|-------------|
| 1 | All 10 indexable pages | **FAQPage JSON-LD with zero visible FAQ content.** All 12 subpage questions + all 7 homepage questions exist *only* in schema (verified: each question string occurs exactly once, inside the `<script>`). Violates Google's structured-data policy (content must be visible); risks the markup being ignored or flagged as spammy, and the answers are invisible to users/AI readers. | **H** | M | Add a visible FAQ section (e.g. `<details>`/accordion with H2 "FAQ" + H3 questions) matching the schema text on each page: `src/index.html:113`, `src/snus-tracker.html:56`, `src/quit-snus.html:56`, `src/zyn-tracker.html:56`, `src/vs-snusless.html:56`, the 4 `src/de/*.html`, and the DE homepage schema in `scripts/sync-de-index.mjs:100-127`. Alternatively delete the FAQPage blocks. |
| 2 | `/` and `/de/` | **Homepage links to none of the 4 SEO subpages** (grep for `snus-tracker\|quit-snus\|zyn-tracker\|vs-snusless` hrefs in `src/index.html` → 0 hits). Subpages are near-orphans: only interlinked among themselves via `partials/seo-footer-en.html` and reachable via sitemap. Homepage PageRank doesn't flow to the money pages. | **H** | **L** | Add the footer nav links from `src/partials/seo-footer-en.html:9-15` to the homepage footer (`src/index.html:3274`) — either `<include src="partials/seo-footer-en.html" />` or copy the `<nav aria-label="Snus App Guides">` block. Add DE equivalents via `scripts/sync-de-index.mjs`. |
| 3 | `/de/` | **Conflicting x-default:** EN home + sitemap declare `x-default = https://breezer.now/`, but the generated DE home declares `x-default = https://breezer.now/de/` (`scripts/sync-de-index.mjs:17`). Inconsistent annotations across a cluster can cause Google to ignore hreflang for the pair. | **H** | **L** | In `scripts/sync-de-index.mjs:17` change `hreflang="x-default"` href to `https://breezer.now/`. |
| 4 | Org schema, all pages | **Organization logo URL 404s:** JSON-LD points to `https://breezer.now/images/logo/logo.svg`, but webpack flattens assets (`assetModuleFilename: 'images/[name][ext]'`, `webpack.config.js:138`) so the file ships as `/images/logo.svg`. Breaks logo eligibility in knowledge panel / rich results. | M | **L** | Change to `https://breezer.now/images/logo.svg` in `src/index.html:54`, `src/partials/schema-organization.html:7` (used by all 8 subpages), and `scripts/sync-de-index.mjs:53`. |
| 5 | `src/sitemap.xml:70-108` | **DE sitemap entries have broken hreflang sets:** the 4 `/de/*` blocks omit the `hreflang="en"` alternate and point `x-default` at the homepage `/` instead of the EN equivalent page (contradicting the on-page tags, e.g. `de/snus-aufhoeren` on-page x-default = `/quit-snus.html`, sitemap says `/`). Incomplete/inconsistent sets get ignored. | M | **L** | For each DE block add `<xhtml:link rel="alternate" hreflang="en" href="…EN equivalent…"/>` and set x-default to the EN equivalent page (lines 74, 84, 94, 104). |
| 6 | `src/images/logo/logo.svg` + `logo-white.svg` | **484 KB each** — SVGs with embedded base64 rasters, loaded in header + footer of every page (~1 MB of logo per view). Slows LCP on all routes. | M | **L** | Re-export as clean vector SVG or optimized PNG/WebP (should be < 10 KB). Referenced at `src/index.html:197,3287` and in every subpage header partial. |
| 7 | `src/css/style.css:1` | **Google Fonts via CSS `@import`** — serial render-blocking chain (HTML → style.css → fonts CSS → woff2), no preconnect anywhere. Delays first paint sitewide. | M | **L** | Self-host Inter (best), or move to `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>` + `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:…&display=swap">` in each page head and delete the `@import`. |
| 8 | `scripts/sync-de-index.mjs:34` | **Weak DE homepage title:** `BREEZER: ULTIMATE SNUS APP` — all-caps, English, no keyword intent; EN equivalent is `Breezer: Social Snus App – Track, Rank & Quit`. Same for og:title (line 19) / twitter:title (line 29). | M | **L** | Change `headDe` title to e.g. `Breezer: Soziale Snus App – Tracken, Ranken & Aufhören` and align og/twitter titles. |
| 9 | Site root | **No `llms.txt`** despite robots.txt actively courting AI crawlers (GPTBot, ClaudeBot, PerplexityBot). | M | **L** | Create `src/llms.txt` (site summary + links to the 10 indexable pages with one-line descriptions) and add `import llmsTxt from '../llms.txt';` next to `src/js/index.js:7` so the existing `.txt` asset rule (`webpack.config.js:106-111`) emits it. |
| 10 | All pages, e.g. `src/index.html:561` | **No `width`/`height` on any `<img>`** (0 of 35 on the homepage) → layout shift (CLS); **no `loading="lazy"`** on below-fold images (screenshots, testimonials, widgets) → wasted bandwidth. Also no `fetchpriority="high"` on the hero LCP image. | M | M | Add intrinsic `width`/`height` (or CSS `aspect-ratio`) to all images; `loading="lazy" decoding="async"` on everything below the fold; `fetchpriority="high"` on `images/hero/hero-light.png` (`src/index.html:561`). Consider WebP for the 88–128 KB widget JPGs. |
| 11 | `src/robots.txt:7-9` | **`Disallow` + `noindex` conflict:** privacy-policy ×2 and eula are both Disallowed and noindexed. Blocked crawling means Google never sees the noindex, so the URLs can still be indexed from internal footer links (as URL-only results). | L | **L** | Remove lines 7–9 (`/privacy-policy.html`, `/privacy-policy-website.html`, `/eula.html`) and rely on the existing `noindex`. Lines 3–6 reference pages that no longer build (harmless; optional cleanup). |
| 12 | `src/404.html:7` | **Template leftover title:** `404 Error | Breezer Tailwind App Landing Template`. Also no meta description/robots (minor — served with 404 status by Vercel so not indexed). | L | **L** | Retitle to `Page Not Found | Breezer` and remove template branding. |
| 13 | `src/index.html:102-106` | **AggregateRating (4.8, 27 ratings)** in MobileApplication schema — ensure the rating/review count is visibly shown in the testimonials section; self-serving reviews markup with invisible values risks being ignored. DE homepage schema omits it entirely (inconsistent pair — harmless, but add it there too for parity via `sync-de-index.mjs`). | L | **L** | Display "4.8 ★ (27 reviews)" near the testimonials heading; add the same aggregateRating to `headDe` in `scripts/sync-de-index.mjs`. |
| 14 | `src/index.html` headings | Heading levels skip from H2 → H5 in the how-it-works section (sequence: h1, h2, h3×9, h2, h5×…). Minor semantic/AEO nit. | L | **L** | Change the step `<h5>` tags to `<h3>`. |
| 15 | `src/js/index.js:8` | Not SEO, spotted in passing: the comment on line 8 swallows `import GLightbox from 'glightbox';` (dead — its only use at line 463 is commented out). The glightbox CSS import on line 1 ships unused bytes. | L | **L** | Delete the dangling text and the unused CSS import, or restore the lightbox. |

## Recommended fix order

1. **#2 Homepage → subpage links** (biggest ranking lever, 10-minute fix)
2. **#3 x-default conflict** (one-line fix in the sync script)
3. **#4 Broken Organization logo URL** (three one-line edits)
4. **#5 Sitemap DE hreflang sets** (small XML edit)
5. **#1 Visible FAQ sections** (highest impact overall, but needs content/markup work — schedule it right after the quick wins)
6. **#8 DE homepage title** + **#9 llms.txt** (quick, meaningful)
7. **#6 484 KB logos** + **#7 font loading** (sitewide performance, low effort)
8. **#10 image dimensions + lazy-loading** (CLS/LCP, more mechanical work)
9. **#11–#15** cleanup batch (robots.txt, 404 title, rating visibility, heading levels, dead import)

*Note: after fixing anything touched by `scripts/sync-de-index.mjs`, run `npm run build` and re-verify `build/de/index.html` — the DE homepage is regenerated on every build and manual edits to `src/de/index.html` are overwritten.*

---

## Fix log (2026-07-03)

All 15 findings fixed and validated against the production build output. Per-page validation: JSON-LD parses on all 10 indexable pages; every FAQ question **and** answer now appears both in schema and visible HTML; x-default consistent (`/`) across pages and sitemap; sitemap DE entries carry full hreflang sets; schema logo URL resolves; all 24 rendered homepage images have width/height, 21 lazy-loaded, hero has `fetchpriority="high"`; font `@import` chain replaced with preconnect+link on all 12 built pages; `llms.txt` ships in build.

Notes beyond the original list:
- #13 was already half-done: the EN homepage displayed "4.8 · 27 reviews" — only the DE side needed schema + translation.
- The homepage FAQ section existed in the template but was commented out with Lorem-ipsum content; it was rebuilt from the schema questions (also un-breaking the header partial's `/#faq` anchor).
- robots.txt now has no `Disallow` rules at all: blog-grid/blog-details/signin/signup are excluded from the build (404), and privacy/EULA/invite rely on their `noindex` meta, which crawlers can now actually see.
- Bonus fixes surfaced during work: 404 page's dead template nav (links to removed signin/signup/blog pages) removed; 416 KB favicon.ico reduced to 3 KB; logo SVGs reduced 481 KB → 121 KB each by downscaling embedded rasters (rendered at ≤180 px, visually identical); dead GLightbox import cleaned up.
