Two posts, EN + DE each. Branched on top of `blog/taper-and-quit-smoking`, so **merge that one first** — these link to it.

## 1. Nicotine pouches and sleep

`/blog/nicotine-pouches-sleep` + `/de/blog/nikotinbeutel-schlaf`

**Target query.** Not from Search Console — the site has zero visibility in this cluster today (I checked: no query containing sleep, schlaf, insomnia, heart, herz, nebenwirkung or side effect has drawn a single impression in twelve months). That is the point. It is one of the highest-volume symptom questions in the niche and we have no page for it.

**Information gain.** The Jackson Heart Sleep Study measured 5,164 nights of actigraphy against same-day intake, and **caffeine within four hours of bed had no significant effect on anything while nicotine did.** Everyone with a sleep problem audits their coffee first. Second thing nowhere in the top ten: the Benowitz accumulation point, which is that nicotine builds over 6 to 8 hours of regular use, so the afternoon count decides what you go to bed on, not just the last pouch.

The article also runs the two findings that cut against its own thesis: the randomised ESTxENDS analysis found no sleep-quality difference at all, and the observational meta-analysis has a publication-bias signal at p = 0.03. That is deliberate.

## 2. Nicotine pouch side effects

`/blog/nicotine-pouch-side-effects` + `/de/blog/nikotinbeutel-nebenwirkungen`

**Target query.** The biggest head term in the niche. Also the one most likely to get eaten by an AI Overview, which is why the article is built around a table rather than a list — the value is the sorting, and a summary that drops the sorting is useless.

**Information gain.** Every reported effect sorted into four tiers by what actually establishes it: randomised trial, weak observational, self-report only, not established. Nobody does this; every competing page either sells pouches or sells fear. Second: the poison centre data. Pouch ingestions by children under six rose **763 percent between 2020 and 2023**, and pouches were more likely than gum, lozenges, e-liquids, powders or tablets to be linked to a serious outcome. That is the best-quantified harm in the entire category and it appears on none of the pages ranking for this term.

This one also works as the cluster hub — it links out to gums, strength, sleep, sport, taper and quit mode.

## Sources cited, and what each gave

- **Spadola CE, Guo N, Johnson DA, Sofer T, Bertisch SM, Jackson CL, Rueschman M, Mittleman MA, Wilson JG, Redline S / Sleep / 2019;42(11):zsz136.** Jackson Heart Sleep Study, 785 participants, 5,164 nights of wrist actigraphy with same-day diaries. Nicotine within 4h of bed: sleep efficiency −1.74% (−2.79 to −0.68), WASO +6.09 min (0.82 to 11.35), duration −12.97 min (n.s.). Insomnia subgroup: −42.47 min (−73.37 to −11.56). Caffeine: nothing significant on any of the three. Alcohol: efficiency −0.98%.
- **Benowitz NL, Hukkanen J, Jacob P / Handbook of Experimental Pharmacology / 2009.** Plasma half-life ~2 h; accumulation predicted over 6–8 h of regular use; terminal half-life by urinary excretion ~11 h.
- **Singh N, Wanjari A, Sinha AH / Cureus / 2023.** Names "nocturnal sleep-disturbing nicotine craving"; in the cohort it cites, nicotine predicted PSQI while caffeine and alcohol did not.
- **Scharf T, Rihs A, Schoeni A et al. / Sleep / 2026;49(7), published 5 Feb 2026.** ESTxENDS secondary analysis, 831 participants randomised. No significant PSQI difference (adjusted slope −0.20, p = .256). The counter-evidence.
- **Sulthana H, Jan A, Verma A et al. / Frontiers in Public Health / 29 Aug 2025.** 14 cross-sectional studies. Short sleep OR 1.38 (1.24–1.55), I² = 0%, but all cross-sectional and Egger's test p = 0.03.
- **Heshmati J, Shahen S, Bates EL, Visintini S, Quirouette E, Mullen KA, Mir H / Addiction / 2025.** Seven randomised trials, 269 participants. Adverse events mostly mild (cough, throat irritation, headache), more frequent at higher doses, no serious adverse events.
- **Hartmann-Boyce J, Tattan-Birch H, Brown J et al. / Cochrane / 24 Oct 2025** (CD016220.pub2). Four trials, 284 participants, no SAEs in the three reporting them.
- **Rungraungrayabkul D, Gaewkhiew P, Vichayanrat T, Shrestha B, Buajeeb W / BMC Oral Health / 2024;24:889.** Three studies, 190 participants, all high risk of bias. Already cited on the gums post; re-read for the tier table.
- **Mallock-Ohnesorg N, Rabenstein A, Stoll Y et al. / Frontiers in Pharmacology / 22 May 2024.** 30 mg pouch: +25 bpm heart rate, raised arterial stiffness, strong mouth irritation, 29.4 ng/mL peak against 15.2 for a cigarette. 6 mg: 2.8 ng/mL and none of it.
- **Elsokkary EM, Alsabhan FA, Alyahya AA et al. / Tobacco Induced Diseases / 2025.** 385 users, Riyadh province, online and in-store recruitment. Mouth/gum irritation 42%, nausea 42%, reflux 35.4%, raised heart rate 25.3%, no symptoms 34.2%. Used only in the self-report tier, with the authors' own limitations quoted.
- **Smith GA, Hays H et al. / Pediatrics / 14 July 2025** (10.1542/peds.2024-070522). US National Poison Data System 2010–2023, ~135,000 ingestions under age six. Pouch ingestion rate +763% 2020–2023; 39 major outcomes and 2 deaths across all nicotine products; pouches more likely than other formulations to be linked to serious outcomes or admission.

## Things I was unsure about, and what I did

- **The "2025 Sleep study" that several pages cite for the four-hour rule does not exist.** Tracing it back, every one of them is describing Spadola 2019 with the wrong year. I cite the 2019 paper and the numbers I read in it.
- **The Pediatrics comparative claim** (pouches worse than other formulations) comes from the press material and secondary reporting, not from the paper itself — the AAP site is paywalled to this machine. It is stated qualitatively in the article, without a number, for that reason.
- **The Addiction abstract lists the mild adverse events as cough, throat irritation and headache.** A secondary summary added nausea and hiccups. I used only the verified list in the trial tier, and nausea sits in the self-report tier where the survey puts it.
- **The DKFZ fact sheet on nicotine pouches could not be fetched** (TLS failure on dkfz.de from here). Nothing in either article depends on it. Worth a look if you want a German-language authority in a future refresh.
- **Sleep is presented as nicotine research applied to pouches**, because no pouch-specific sleep study exists. Both articles say so in the body and again at the foot.
- **Author is still `Breezer Redakteur`.** Same open question as the previous PR.

## Checklist (playbook §10)

Content
- [x] Search intent checked, format matches (mechanism + ordered actions for sleep, evidence table for side effects)
- [x] At least one thing that is nowhere in the top 10
- [x] First paragraph answers the title question: 61 / 57 / 58 / 53 words
- [x] Every H2 standalone, no back-references
- [x] Comparison table in all four
- [x] FAQ with 6 real questions each
- [x] Limits named, including evidence that contradicts the article's own thesis

Meta
- [x] Titles 51 / 48 / 51 / 53 chars
- [x] Descriptions 146–159
- [x] URLs short, no date
- [ ] `Person` schema — falls back to the organisation, see above

Technik
- [x] BlogPosting + FAQPage, 6 `Question` nodes each, both hreflang directions verified in `dist`
- [x] Hero images are real app screenshots
- [x] 5–7 internal links out, 2+ to money pages; inbound from the sport posts (sleep) and the gums posts (side effects)
- [x] All four URLs in `dist/sitemap.xml`, no broken internal links
- [ ] Not read on mobile yet

`npm run build` passes.

## On the weekly cadence

Merging is publishing, so the buffer is spent one merge at a time: this PR after the previous one, a week apart, and you have two publication events without touching anything.

If you want finer granularity than that, `draft: true` in the frontmatter is the lever — a draft is excluded from the blog index, the sitemap and route generation. The catch: it produces no page at all, so any inbound link to a drafted post 404s. Every one of these four now has inbound links, so drafting one means pulling its inbound link too, and putting it back at flip time. Merging one PR per week is the cheaper version of the same thing.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_01CJjSPQJfMntShb2crBKJR8

---

# Added after review: nicotine pouches and stress

`/blog/nicotine-pouches-stress` + `/de/blog/nikotinbeutel-stress`

**Why this one.** Every article in the stack is about what pouches do to you. Nothing was about why anyone keeps using them, and the answer people give is stress. That objection sits directly between a reader and a quit attempt.

**Information gain.** The contrast in evidence weight. 102 studies and 169,500 participants say quitting improves anxiety and stress; 284 participants is everything we know about pouches. And the BMJ line that the effect sizes are "equal or larger than those of antidepressant treatment for mood and anxiety disorders", which is not something you will find on a page about nicotine pouches.

The article does not argue the relief is imaginary. It uses Parrott's deprivation-reversal account to explain why the relief is real, immediate, convincing, and still never accumulates. It also says outright that the first days go the other way, since that is where this kind of page usually loses the reader.

**Sources**

- **Taylor GMJ, Lindson N, Farley A, Leinberger-Jabari A, Sawyer K, te Water Naudé R, Theodoulou A, King N, Burke C, Aveyard P / Cochrane / 9 Mar 2021** (CD013522.pub2). 102 studies, >169,500 participants. Anxiety SMD −0.28 (15 studies, 3,141); mixed anxiety/depression −0.31 (8, 2,829, moderate certainty); depression −0.30 (34, 7,156, very low); stress −0.19 (4, 1,792); positive affect +0.22 (13, 4,880); psychological QoL +0.11 (19, 18,034). Conclusion: mental health does not worsen as a result of quitting.
- **Taylor G, McNeill A, Girling A, Farley A, Lindson-Hawley N, Aveyard P / BMJ / 13 Feb 2014;348:g1151.** 26 studies. Anxiety −0.37 (−0.70 to −0.03), stress −0.27 (−0.40 to −0.13), mixed −0.31 (−0.47 to −0.14), positive affect +0.40 (0.09 to 0.71). The antidepressant comparison, and the finding that the benefit is as large for people with a psychiatric diagnosis.
- **Parrott AC / American Psychologist / 1999;54(10):817–820.** Deprivation reversal; dependent users need nicotine to feel normal; adult smokers' stress slightly above non-smokers'; adolescents' stress rises as use becomes regular.
- **Mallock-Ohnesorg N, Rabenstein A, Stoll Y et al. / Frontiers in Pharmacology / 22 May 2024.** 30 mg pouch: +25 bpm, matching a cigarette. Used for the point that a pouch is a stimulant, not a sedative.

**Care taken, because this is mental-health content**

- Nothing that could move anyone off psychiatric medication; there is an explicit line telling readers to take that to a prescriber.
- The article points at counselling and the Rauchfrei Telefon before it points at the app.
- The Cochrane certainty ratings are stated as they are (moderate / low / very low), not rounded up.
- The withdrawal caveat is a section of its own, not a footnote.
- All of it is smoking-cessation research, and both versions say so twice.

**Verified in `dist`:** titles 53/53, descriptions 145/159, both hreflang directions, 6 `Question` nodes each, no broken internal links, both URLs in the sitemap. Inbound links from `/quit-snus`, `/de/snus-aufhoeren` and both side-effects posts.
