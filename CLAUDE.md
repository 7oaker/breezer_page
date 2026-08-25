# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Marketing site for **Breezer**, the snus tracking / quitting app (`react_Breezer` is the
app itself). Astro 6, static output, deployed to Vercel at **breezer.now**. Bilingual
EN/DE. The site's job is SEO acquisition — most of the structure exists to serve that.

## Commands

```bash
npm run dev       # astro dev
npm run build     # astro build + prune orphaned assets (see below)
npm run preview   # preview the built site
npm run check     # astro check — type + content-schema validation
```

There is no test suite and no linter. `npm run check` is the gate.

## The four things that will bite you

### 1. Routes are paired in one map, not derived from filenames

`src/i18n/routes.ts` is the single source of truth for EN↔DE pairing. Every hreflang tag,
language-switcher link, nav entry, and sitemap alternate derives from `routePairs`.
**Adding a page means adding it there** — otherwise it has no translation link and never
reaches the sitemap. EN lives at the root, DE under `/de/`; `prefixDefaultLocale: false`
in `astro.config.mjs` is what keeps `/` un-prefixed, matching already-indexed URLs.

### 2. Content frontmatter is schema-enforced, and the caps are deliberate

`src/content.config.ts` types both collections with Zod. `title` is hard-capped at 60
chars, `description` at 175, `summary` at 200. **These are enforcement points, not
suggestions** — the comment in that file explains the reasoning (a build that fails is
the only review step that never gets skipped). Don't relax a cap to make content fit;
rewrite the content.

`faq` renders as both the visible FAQ section and the FAQPage structured data from the
same array, because Google requires FAQ schema content to be visible. Keep it one source.

Collection IDs are generated from `lang/slug`, not the filename — `en/zyn-tracker.md` and
`de/zyn-tracker.md` would otherwise collide.

### 3. The build prunes assets, and that step is load-bearing

`npm run build` runs `scripts/prune-orphan-assets.mjs` after `astro build`. Declaring an
image via `image()` in a schema makes Astro emit the full-resolution original alongside
the optimised variants — ~9.6 MB of files nothing links to. The script deletes only
hashed files whose basename appears in no built output, so it cannot remove something in
use. Don't bypass it by calling `astro build` directly.

### 4. Analytics is cookieless on purpose

`src/scripts/analytics.js` runs PostHog in `cookieless_mode: 'always'` and therefore sits
**outside** the cookie banner — nothing is written to the visitor's device, so ePrivacy
Art. 5(3) / § 165 TKG 2021 isn't engaged and no consent is required. The banner in
`main.js` gates Google Analytics only. Same PostHog project and EU host as the app
(`react_Breezer/lib/posthogClient.js`).

The dynamic import is deliberate: `PUBLIC_POSTHOG_KEY` being unset makes the whole block
statically dead so PostHog is never shipped. Keep it dynamic.

## Layout

| Path | Purpose |
|---|---|
| `src/pages/` | Routes. `[guide].astro` + `de/[guide].astro` render the guides collection |
| `src/content/guides/{en,de}/` | Evergreen SEO landing pages |
| `src/content/blog/{en,de}/` | Blog posts. `_template.md` is excluded from the collection |
| `src/i18n/routes.ts` | **Route pairing — start here for any new page** |
| `src/i18n/{ui,faq,blog,schema}.ts` | UI strings, shared FAQ copy, structured data |
| `src/layouts/{Base,Article}.astro` | Page shells |
| `src/components/Seo.astro` | Meta, OG, hreflang, JSON-LD |
| `scripts/prune-orphan-assets.mjs` | Post-build asset cleanup |
| `docs/seo-findings.md` | SEO audit log — decisions get recorded here |

## Conventions

- Tailwind 3 + `src/styles/style.css`.
- `Base.astro` injects two `is:inline` pre-paint scripts, `langInit` and `themeInit`.
  They must stay inline and in `<head>` — they exist to set language and theme before
  first paint, and moving or bundling them reintroduces a flash of the wrong theme.
  `themeInit` deliberately *removes* the `theme` localStorage key when it matches the
  system preference, so "follow the browser" stays the state you fall back to.
- Markdown tables are auto-wrapped in a scrollable, keyboard-focusable container by the
  `rehypeTableScroll` plugin in `astro.config.mjs`.
- Shiki emits CSS variables for both themes rather than one baked-in palette
  (`defaultColor: false`) — code blocks would otherwise be near-white on the light page.
- `trailingSlash: 'never'`, `build.format: 'file'`. Keep links consistent with that.
- Commit messages here are prose sentences describing intent, not Conventional Commits.
