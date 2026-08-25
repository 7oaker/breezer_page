# Decisions Log

Format: date — decision — why. Append during build; never rewrite history.

A decision belongs here when someone could reasonably have chosen otherwise, and the
reason would not be obvious from reading the code six months later. Record the option
you rejected and why — that is the part that stops the question being reopened.

Status does **not** belong here. What is deployed, what is dirty, how many commits
exist: git, CI and the dashboards know that accurately and this file would not.

---

Entries below were reconstructed on 2026-08-25 from comments already in the source, which
explain their own reasoning unusually well. Each names the file it came from. Dates are
approximate where only the commit history implies them.

- **~2026-07 — EN at the root, DE under `/de/`, `prefixDefaultLocale: false`** — matches the URLs already indexed; prefixing the default locale would have moved every English page. (`astro.config.mjs`)
- **~2026-07 — One `routePairs` map is the single source of truth for EN↔DE** — every hreflang tag, switcher link and sitemap alternate derives from it, so a route can no longer point at a translation that does not exist, which the old string-replacement build allowed. (`src/i18n/routes.ts`)
- **~2026-07 — Frontmatter limits enforced by Zod, not documented as guidance** — a build that fails is the only review step that never gets skipped. `title` caps at 60 because Google rewrites beyond ~600px, and a rewritten title is one you no longer control. (`src/content.config.ts`)
- **~2026-07 — FAQ renders the visible section and the FAQPage schema from one array** — Google requires FAQ schema content to be visible; one source makes drift between them structurally impossible. (`src/content.config.ts`)
- **~2026-07 — Collection IDs generated from `lang/slug`, not the filename** — `en/zyn-tracker.md` and `de/zyn-tracker.md` would otherwise collide and silently overwrite each other. (`src/content.config.ts`)
- **~2026-08 — PostHog runs cookieless and outside the cookie banner** — in `cookieless_mode: 'always'` nothing is written to the visitor's device, so ePrivacy Art. 5(3) (§ 165 TKG 2021 in Austria) is not engaged and no consent is required. Measures 100% of traffic instead of the share who accept the banner. The trade: identity does not survive the daily salt rotation, so a returning visitor counts as new. The banner still gates Google Analytics. (`src/scripts/analytics.js`)
- **~2026-08 — PostHog loaded by dynamic import of the slim build** — an unset `PUBLIC_POSTHOG_KEY` makes the block statically dead, so a static import would have shipped ~250 KB to every visitor even with analytics unconfigured. (`src/scripts/analytics.js`)
- **~2026-08 — `prune-orphan-assets.mjs` runs after every build** — declaring an image via `image()` in a schema makes Astro emit the full-resolution original alongside the optimised variants, ~9.6 MB nothing links to. Only deletes hashed files whose basename appears in no built output. (`scripts/prune-orphan-assets.mjs`)
- **~2026-08 — Shiki emits CSS variables for both themes rather than one baked palette** — the default inline dark-theme colours left formula blocks as near-white text on the light page. (`astro.config.mjs`)
- **~2026-08 — Markdown tables auto-wrapped in a focusable scroll container** — comparison tables are wider than a phone viewport; `tabindex` makes the container keyboard-reachable, which a plain overflow box is not. (`astro.config.mjs`)
- **2026-08-25 — No `llms.txt`** — Google confirmed in June 2026 it affects neither rankings nor AI Overviews. (`.claude/skills/blog-post/references/playbook.md` §9)
- **2026-08-25 — Articles stop at a pull request; merging is publishing** — Vercel deploys from `main`, and the playbook's own rule is that substance, numbers and opinion come from Klaus. Auto-publishing would contradict the document the blog skill is built on. (`.claude/skills/blog-post/SKILL.md` §7)
