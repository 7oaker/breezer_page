Two posts, EN + DE each. Both target demand the site already has impressions for but no page.

## 1. Taper / step-down plan

`/blog/taper-nicotine-pouches` + `/de/blog/nikotinbeutel-reduzieren`

**Target query.** `how to taper off nicotine pouches` — 6 impressions, position 60.0 over the last 120 days. Related and equally uncaptured: `nicotine pouches mg` (5, pos 45.2), `snus mg` (4, pos 25.8), `nikotinbeutel dosierung` (12, pos 66.3). Low volume, but the intent is the product, and nothing on the site targets it. `/quit-snus` has one section on cold turkey vs cutting down and no schedule.

**Information gain.** Nobody has taken the scheduled-reduction algorithm from the Cinciripini trial and converted it into pouch counts. The article does, as a table for 8, 12 and 20 pouches a day. The second thing that is nowhere in the top ten: the compliance finding — people who drifted off the schedule ended up worse than the control group. Every other page on this topic sells tapering as the gentle option.

## 2. Pouches for quitting smoking

`/blog/nicotine-pouches-quit-smoking` + `/de/blog/nikotinbeutel-statt-rauchen`

**Target query.** Not from Search Console — this one is from the research. Cochrane published the first systematic review of the question on 24 October 2025 and the site had nothing on it. Adjacent captured demand: `quit snus app` (40, pos 9.3), `how to quit snus` (30, pos 32.3).

**Information gain.** The evidence-strength table, which sets 27 and 36 participants next to 29,044 and 64,640. And reading the confidence interval out loud: RR 1.58, CI 0.07 to 35.32, a range spanning a factor of 500 from a trial of 27 people. The German version additionally carries the legal position, which is that selling pouches in Germany is prohibited, so the switch is not a legal option there at all.

## Sources cited, and what each gave

- **Hartmann-Boyce J, Tattan-Birch H, Brown J et al. / Cochrane Database of Systematic Reviews / 24 Oct 2025** (CD016220.pub2). Four trials, 284 participants, three at high risk of bias, one industry-funded. RR 1.58 (0.07–35.32) vs no support; RR 0.25 (0.03–2.02) vs e-cigarettes; no SAEs; COHb −6.7%; NNAL −265.30 ng/g creatinine. Explicit statement that there is no evidence on using pouches to cut down other nicotine products — which is what licenses the honesty in article 1. Read the full PDF, not the abstract.
- **Lindson N, Klemperer E, Hong B, Ordóñez-Mena JM, Aveyard P / Cochrane / 2019** (CD013183.pub2). 51 trials, 22,509 participants. Reduction vs abrupt: RR 1.01 (0.87–1.17). Reduction aided by fast-acting NRT or varenicline: RR 1.68 (1.09–2.58).
- **Cinciripini PM, Minnix JA, Robinson JD et al. / JMIR Formative Research / 2023.** 916 randomised, 820 analysed. The 21-day algorithm: 15% of baseline every 3 days to day 12, then 10% every 3 days. Compliant + pre-quit patch 35% vs 22% usual care at four weeks; non-compliant worse than control.
- **Mallock-Ohnesorg N, Rabenstein A, Stoll Y et al. / Frontiers in Pharmacology / 22 May 2024.** LMU Munich crossover, 15 smokers. Peak blood nicotine 2.8 / 7.1 / 29.4 ng/mL for 6 / 20 / 30 mg pouches against 15.2 ng/mL for a cigarette. Heart rate +25 bpm at 30 mg. Authors: 30 mg "may induce addiction".
- **Lindson N, Livingstone-Banks J, Butler AR et al. / Cochrane / updated 26 Aug 2026** (CD010216). 90 studies, 29,044 participants. E-cigs vs NRT RR 1.59 (1.30–1.93), high certainty.
- **Hartmann-Boyce J, Chepkin SC, Ye W, Bullen C, Lancaster T / Cochrane / 2018** (CD000146). NRT vs control RR 1.55 (1.49–1.61), 64,640 participants.
- **Livingstone-Banks J, Vidyasagaran AL, Croucher R et al. / Cochrane / 15 Apr 2025** (CD015314.pub2). 43 studies, 20,346 participants. Counselling 23–34 per 100 vs 16 per 100.
- **U.S. Food and Drug Administration / 16 Jan 2025.** 20 Zyn products authorised. Quoted verbatim: "it does not mean these tobacco products are safe, nor are they 'FDA approved'".
- **Wissenschaftliche Dienste des Deutschen Bundestages / WD 8 - 3000 - 074/24 / 9 Oct 2024.** German legal position: not under TabakerzG, classified as novel food, courts agreeing, nicotine not authorised as food, so placing on the market is currently prohibited. Read the PDF.
- **BMSGPK (Sozialministerium) / Tabakfreie Nikotinerzeugnisse.** Austria: BGBl. I Nr. 68/2026 brings pouches into the TNRSG for the first time; the ministry does not present them as a cessation aid.

## Things I was unsure about, and what I did

- **The Bundestag paper quotes the BfR as giving an average pouch nicotine content of "9,5 Gramm".** That is a typo for milligrams in the source. Dropped it and used only the clean 2–47 mg range, which is not in the articles either since the LMU numbers are better.
- **The withdrawal timeline (McLaughlin 2015)** is cited on `/quit-snus`, but I did not open it myself in this session, so neither new article restates the number — they link to the guide instead.
- **No new claims about Breezer's own users.** `/quit-snus` already carries a product observation about daily limits; I did not extend it or invent a second one. If you want an own-data section in the taper article ("what actually happens to counts after someone sets a limit"), that needs your numbers.
- **`author` is `Breezer Redakteur`, not `Klaus Siebeneicher`.** The skill asks for your name, but `src/data/authors.ts` has no entry for it, so the frontmatter would silently fall back and lose the author box entirely. Consistent with the three existing posts. Registering yourself as a `Person` there would add a Person schema node and a real byline, which is the strongest E-E-A-T lever left on this site — but the bio and whether a photo goes in is your call, not mine.
- **Two articles, one PR.** They cross-link, so splitting them means one ships with a dead link. Say the word and I'll split.

## Checklist (playbook §10)

Content
- [x] Search intent checked, format matches (schedule + tables for 1, evidence comparison for 2)
- [x] At least one thing that is nowhere in the top 10
- [x] First paragraph answers the title question: 70 / 62 / 63 / 65 words
- [x] Every H2 section standalone, no back-references
- [x] Paragraphs 2–4 lines
- [x] Comparison table in all four
- [x] FAQ with 6 real questions each
- [x] Limits and failure cases named (no pouch trial exists; abandoned schedules; very low certainty)

Meta
- [x] Titles 48 / 42 / 56 / 54 chars, keyword first
- [x] Descriptions 151–161, concrete
- [x] URLs short, no date
- [x] Author box and dates visible
- [ ] `Person` schema — falls back to the organisation, see above

Technik
- [x] BlogPosting + FAQPage emitted, 6 `Question` nodes matching frontmatter
- [x] Hero images are real app screenshots, both directions of hreflang verified in `dist`
- [x] `max-image-preview:large` present
- [x] Open Graph tags present (site default OG image, same as existing posts)
- [x] 5–7 internal links out, at least 2 to money pages; inbound links added from `/quit-snus`, `/de/snus-aufhoeren` and both strength posts
- [x] All four URLs in `dist/sitemap.xml`, no broken internal links
- [ ] Not read on mobile yet

`npm run build` passes. `npm run check` cannot run on this machine — `@astrojs/check` is not installed and the command drops into an interactive install prompt.

## After merge, your part

An independent LinkedIn post per article (the confidence-interval one writes itself), one genuine community contribution, the newsletter. Refresh date: March 2027, or sooner if Cochrane updates CD016220.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_01CJjSPQJfMntShb2crBKJR8
