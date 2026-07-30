# Breezer landing page

Marketing site for the Breezer snus app, live at [breezer.now](https://breezer.now).
English at `/`, German at `/de`.

**Stack:** [Astro 6](https://astro.build) (static output, zero JS by default),
Tailwind CSS 3 via PostCSS, Swiper for the screenshot carousel.

Output is fully static HTML. That is a deliberate SEO decision, not just a
performance one: **no major AI crawler executes JavaScript** — GPTBot,
ClaudeBot, PerplexityBot and friends read whatever HTML the server returns on
the first request and move on. Anything that matters for search or AI citation
must be in that first response, so don't introduce client-rendered content.

## Commands

```bash
npm install
npm run dev        # http://localhost:4321 with HMR
npm run build      # -> dist/
npm run preview    # serve dist/ locally
npm run check      # astro check (types + content schema)
```

## Writing content

Everything readable is Markdown with typed frontmatter under `src/content/`.
The schema in `src/content.config.ts` is enforced **at build time** — a missing
description or an over-long title fails the build instead of quietly shipping
bad SEO. (It caught three live over-length meta descriptions during the port.)

### A blog post

```bash
cp src/content/blog/_template.md src/content/blog/en/my-slug.md   # -> /blog/my-slug
cp src/content/blog/_template.md src/content/blog/de/mein-slug.md # -> /de/blog/mein-slug
```

That's the whole workflow. The post is picked up automatically by the blog hub,
the `Blog`/`BlogPosting` schema, and `sitemap.xml`. Files starting with `_` are
never built.

### A guide / landing page

`src/content/guides/<lang>/<slug>.md`. Same frontmatter plus `slug` and
`translationOf` (the counterpart's slug in the other language). Routed by
`src/pages/[guide].astro` and `src/pages/de/[guide].astro`.

### Frontmatter that drives SEO

| Field | Used for |
|---|---|
| `title` | `<title>`, og/twitter title (10–75 chars) |
| `heading` | The `<h1>`; may differ from the title tag |
| `description` | `<meta name="description">` (50–175, aim ≤160) |
| `summary` | `og:description` + the card text on listing pages |
| `faq` | Rendered as a **visible** FAQ section *and* as `FAQPage` schema, from the same array — Google requires FAQ schema content to be visible, and one source makes that impossible to get wrong |
| `translationOf` | hreflang pairing. Omit it and no hreflang is emitted, which is correct for an untranslated post |
| `heroImage` / `heroImageAlt` | App screenshot shown beside the intro, inside the device frame |
| `gallery` | Extra screenshots (`image` / `alt` / optional `caption`) rendered as a strip below the body |

### Adding screenshots to a page

```yaml
heroImage: ../../../assets/images/screens/new/snus-stats.png
heroImageAlt: Breezer snus tracker showing weekly consumption statistics
gallery:
  - image: ../../../assets/images/screens/new/take-snus.png
    alt: Logging a snus pouch with one tap in Breezer
    caption: One tap to log a pouch
```

Paths are relative to the Markdown file. Point at the **full-resolution original**
in `src/assets/` — `astro:assets` derives the WebP variants. Write real alt text:
it is the only description a crawler or screen reader gets.

## How i18n works

`src/i18n/routes.ts` is the single source of truth for EN↔DE route pairing.
Every hreflang tag, language switcher link and sitemap alternate derives from
it, so a route can't point at a translation that doesn't exist.

Homepage copy lives keyed in `src/i18n/ui.ts` (`en` and `de` objects, type-checked
against each other) and is rendered by one shared `src/components/home/Home.astro`.

> This replaced a 350-line script that regenerated the German homepage by
> find-and-replacing English sentences. It shipped with an active
> "possible untranslated strings" warning. Don't go back to that.

## Images

Use `astro:assets`, never a raw `<img>` for content images:

```astro
import { Image } from 'astro:assets';
import shot from '../assets/images/screens/new/take-snus.png';
<Image src={shot} width={263} height={569} alt="…" loading="lazy" />
```

Astro derives responsive `srcset`, converts to WebP, sets intrinsic dimensions,
and content-hashes the filename (which is why `/_astro/*` gets a 1-year
immutable cache header in `vercel.json`). Commit the **full-resolution**
original — the pipeline handles the rest. Source screenshots at 1179×2556 ship
as ~12–35 KB.

`public/images/` is only for assets that must have a stable URL: the logo,
favicons, and `og-image.png`.

## Structure

```
src/
  pages/            Routes. [guide].astro and blog/[slug].astro are dynamic.
    sitemap.xml.ts  Generated sitemap (see note below)
  content/
    blog/{en,de}/   Blog posts (Markdown)
    guides/{en,de}/ Evergreen landing pages (Markdown)
    _template.md    Copy this to start a post
  layouts/
    Base.astro      <html>/<head>, SEO, global CSS + JS
    Article.astro   Guides + posts: breadcrumb, H1, prose, FAQ, CTA
  components/
    Seo.astro       Every head tag that matters, in one place
    home/Home.astro Shared homepage body, keyed by {t.*}
  i18n/
    routes.ts       EN<->DE route pairing (source of truth)
    ui.ts           Homepage copy, both languages
    schema.ts       Shared schema.org nodes (Organization, MobileApplication…)
    faq.ts          Homepage FAQ (visible + schema)
  scripts/main.js   Cookie consent, GA-after-consent, Swiper, theme, reveal
  assets/images/    Originals, optimised at build by astro:assets
public/             Served verbatim: robots.txt, llms.txt, manifest, .well-known
```

### Why the sitemap is hand-rolled

`@astrojs/sitemap` assumes a locale shares its path across languages. Ours don't
(`/quit-snus` ↔ `/de/snus-aufhoeren`), and it emitted those two pages with **no
alternates at all**. `src/pages/sitemap.xml.ts` builds it from `routes.ts` plus
the collections, so every URL gets a full 4-way hreflang set and a real
`lastmod`.

## The prune step

`npm run build` runs `astro build` then `scripts/prune-orphan-assets.mjs`.

Declaring an image in a collection schema via `image()` makes Astro emit the
untouched original next to the optimised variants, even when the page only
renders it through `<Image>` — that was 9.6 MB of files nothing linked to. The
prune deletes only files in `dist/_astro/` whose hashed name appears in no built
HTML/CSS/JS, so it cannot remove anything in use, and it prints what it removed.

## Deploy

Push to `main`; Vercel builds with `vercel.json` (`npm run build` → `dist/`).
`cleanUrls` + `trailingSlash: false` keep the existing URL shape. The old
`.html` URLs 301 to their clean equivalents.

Domain: `breezer.now` in Vercel project settings → Domains.
