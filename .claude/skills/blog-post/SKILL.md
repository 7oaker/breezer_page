---
name: blog-post
description: Write, refresh or audit a blog article or guide page on breezer.now. Use when asked to write a post, pick a topic, update an existing article, or check a draft before publishing. Enforces the 2026 playbook (answer-first structure, extractable passages, sourced claims) and this repo's Astro content schema.
---

# Blog post

Produces articles for breezer.now that earn impressions from classic search **and**
from AI answer engines. The strategy behind it lives in
`references/playbook.md`; read it before the first article of a session.

The niche is nicotine pouches: tracking, reducing, quitting. Markets are
German (Austria first) and English.

## The one rule that decides everything

**No claim without a source you actually opened.**

Not "I know this", not a search-result snippet, not a shop's blog. If a number
goes in the article, you fetched the page it came from and can name author,
publication and year. If it cannot be verified, it does not go in.

This is the whole difference between an article that earns citations and one
that gets filtered as generic AI text. It is also not something a scoring
rubric can check for you.

Two things that happened while writing the first three articles, as calibration:

- A precise-sounding gum-recession statistic traced back only to a shop blog.
  It was dropped, not softened.
- A "1 in 5 footballers" figure from a commercial page was checked and led to
  the actual PFA/Loughborough study, which carried a far better finding: the
  majority of those users show dependence. Verifying improved the article.

## Workflow

### 1. Pick the topic from data, not from a hunch

Use the PostHog MCP. Search Console is connected as a warehouse source, with
history from 24.04.2025.

```sql
-- Demand that exists but is not being captured: page 2 and 3
SELECT query, sum(impressions) AS impr, sum(clicks) AS klicks,
       round(sum(position * impressions) / nullIf(sum(impressions), 0), 1) AS pos
FROM googlesearchconsole.search_analytics_by_query
WHERE date >= today() - 180
GROUP BY query HAVING pos BETWEEN 11 AND 30
ORDER BY impr DESC
```

The dashboard **SEO: breezer.now** (id 898454) has this as a tile, plus the
CTR-problem list and the query-to-page mapping.

Then apply the playbook's topic filter (§1): pure fact questions get eaten by
AI Overviews. Favour comparisons, own numbers, checklists, and topics where the
reader still needs detail after the overview.

**Check for cannibalisation before writing.** List existing pages
(`src/content/guides/**`, `src/content/blog/**`). If an existing page already
targets the head term, improve that page instead of adding a competitor to it.
This is why the withdrawal timeline lives on `/de/snus-aufhoeren` and not in a
separate post.

**Ask Klaus** when the topic touches product direction, pricing, a personal
opinion, or a claim about how Breezer's own users behave. Those need his input;
everything else you can decide.

### 2. Research before drafting

Use WebSearch to find sources, then WebFetch to actually read the ones you will
cite. Prefer, in order: peer-reviewed papers and systematic reviews, official
bodies (WADA, Google Search Central, national authorities), university and
hospital publications. Treat shop blogs and vendor "science" pages as leads to
follow, never as citations.

For health claims specifically: state the strength of the evidence. If a
systematic review found three small studies with high risk of bias, say that.
The honest framing is the differentiator in this niche, because every competing
page either sells pouches or sells fear.

Capture for each source: authors, title, publication, year, and the finding you
will use.

### 3. Structure

Follow `references/playbook.md` §2. The parts that get skipped most:

- **Answer in the first paragraph, 40 to 75 words.** No warm-up.
- **Every H2 section stands alone.** No "as described above". A chunk that
  needs the rest of the page is a chunk no engine can quote.
- **Sections 150 to 300 words**, paragraphs 2 to 4 lines, one thought each.
- **Entities spelled out.** "Zyn", not "the brand".
- **Numbers isolated or bold**, not buried mid-sentence.
- **A comparison table** wherever three or more things are compared.
- **Link the source at the claim**, inline, not in a blockquote at the end of
  the section. A reader checking a number should not have to hunt.

### 4. Write into this repo's schema

Content is Markdown with Zod-validated frontmatter in `src/content.config.ts`.
The build fails on violations, so the schema is the format check and this file
does not repeat the limits. What it does not enforce, and you must:

| Field | Rule |
| --- | --- |
| `title` | Keyword first, readable. Schema caps it at 60. |
| `heading` | May differ from title. Title sells the click, H1 serves the reader. |
| `description` | A concrete promise. Aim under 160 even though 175 passes. |
| `faq` | 4 to 8 real questions, phrased the way someone types them. Each answer standalone. Feeds visible FAQ and FAQPage schema from one array. |
| `author` | `Klaus Siebeneicher` on blog posts. Must match a key in `src/data/authors.ts` or it silently falls back to the organisation and loses the Person schema and the author box. |
| `translationOf` | The other language's slug. Both sides must point at each other or hreflang is not emitted. |
| `heroImage` | A real app screenshot from `src/assets/images/screens/`. Never stock. |

Locations: `src/content/blog/{de,en}/<slug>.md`, guides in
`src/content/guides/{de,en}/`. URLs are `/blog/<slug>` and `/de/blog/<slug>`.

Slugs differ per language and never change after publishing. A rename needs a
301 in `vercel.json`.

**German and English are not translations of each other.** Same research, same
structure, written for the search intent of that language. German is the
stronger market here: it ranks worse (position 15.2 vs 7.0) and still converts
at double the CTR.

### 5. Internal links

Three to five contextual links per article, descriptive anchor text, in the
body. At least two into a money page: `/snus-tracker`, `/quit-snus`,
`/zyn-tracker` (and `/de/snus-tracker`, `/de/snus-aufhoeren`,
`/de/zyn-tracker`). Link the German article to German targets only.

Add at least one link **into** the new article from an existing page, otherwise
it is an orphan.

### 6. Verify before saying it is done

```bash
ASTRO_TELEMETRY_DISABLED=1 npm run build
```

Telemetry must be disabled or the build fails on a sandboxed config write.

Then check the built output, not the source:

- `<title>`, canonical, and both hreflang directions
- FAQPage `"@type":"Question"` count matches the frontmatter
- The Person node is present, not the organisation fallback
- The new URLs are in `dist/sitemap.xml`
- No broken internal links

### 7. After publishing

The playbook's §6 distribution steps are Klaus's job, not this skill's: an
independent LinkedIn post, one genuine community contribution, the newsletter.
Remind him, do not draft them unasked.

Set a refresh date. Impressions are the metric for the first six months, not
clicks. Expect four to eight weeks before any movement is visible.

## Refreshing an existing article

Ranked by payoff (playbook §7): falling clicks at stable impressions (the
snippet stopped working), then position 11 to 25, then stale numbers, then a
shifted search intent.

A refresh is new substance or it is nothing. Changing the date alone is
measurably useless. Rewrite the answer paragraph, add findings with sources,
extend the FAQ with questions that now appear in "people also ask", and link to
newer articles.

## Do not

- Publish an unverified number, however good it sounds.
- Write a second page for a term an existing page already targets.
- Produce volume. The helpful-content signal is site-wide: weak pages drag the
  strong ones down. Twenty good articles beat a hundred average ones.
- Add `llms.txt`. Google confirmed in June 2026 it does nothing for rankings or
  AI Overviews.
- Chase keyword density. Once near the top, then write naturally.
- Let the product lead an informational page. `/de/snus-aufhoeren` sat at
  position 23 for `snus aufhören` and 6.5 for `snus aufhören app` precisely
  because its title started with the product.
