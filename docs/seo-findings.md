# SEO-Befunde breezer.now

Stand 16.08.2026. Datenbasis ist die Google Search Console, seit 15.08.2026 an PostHog
angebunden, mit Historie ab 24.04.2025. Jede Zahl hier ist im Dashboard
[SEO: breezer.now](https://eu.posthog.com/project/249017/dashboard/898454) nachlesbar.

**Update 16.08.2026:** Der Bericht war ursprünglich reine Entscheidungsgrundlage. Ein Teil der
Befunde ist inzwischen umgesetzt, siehe [Umsetzungsstand](#umsetzungsstand) am Ende.

## Die Lage in drei Sätzen

Die Sichtbarkeit wächst real: 16 Impressionen im April 2025, 993 im Juli 2026. Die Klicks
wachsen nicht mit, sie liegen seit über einem Jahr bei 5 bis 20 im Monat. Fast alle davon
holt die Startseite über den Markennamen, während die vier Guide-Seiten zusammen unter 15
Klicks in 180 Tagen kommen.

Anders gesagt: Google zeigt die Seite immer öfter, und fast niemand klickt.

---

## A. Technisch

### A1. Die alten `.html`-Adressen sind in Ordnung (geprüft)

Erster Verdacht war, dass `/privacy-policy.html` (241 Impressionen) und `/eula.html` (233)
ins Leere laufen, weil der `redirects`-Block in `vercel.json` nur die Guide-Adressen
auflistet. **Das stimmt nicht.** Nachgemessen:

```
/de/snus-aufhoeren.html   308 -> /de/snus-aufhoeren
/privacy-policy.html      308 -> /privacy-policy
/eula.html                308 -> /eula
```

Grund ist `"cleanUrls": true` in `vercel.json:5`, das jede `.html`-Adresse automatisch auf
die saubere Variante weiterleitet, unabhängig vom `redirects`-Block. Die dort aufgeführten
acht Guide-Regeln sind damit sogar redundant, aber harmlos.

Die Impressionen auf `.html`-Adressen sind historisch, aus der Zeit vor dem Umzug von
GitHub Pages. Sie klingen mit der Zeit von selbst ab. **Keine Maßnahme nötig.**

### A2. Der Datenschutz-Link in den Stores (bleibt offen)

Der eine Punkt in dieser Gruppe, der wirklich offen ist, liegt außerhalb des Repos: In App
Store Connect steht als Datenschutz-URL weiterhin
`7oaker.github.io/breezer/privacy-policy.html`. Diese Kopie ist vom 24.11.2024 und behauptet,
die App nutze keine Cookies oder Tracking-Technologien, was seit dem PostHog-Einbau nicht
mehr stimmt. Die URL gehört in beiden Stores auf `https://breezer.now/privacy-policy`
geändert, und die GitHub-Pages-Kopie abgeschaltet oder weitergeleitet.

Das ist kein SEO-Thema, es fiel nur bei derselben Untersuchung auf.

---

## B. Snippet und Metadaten

Diese Anfragen stehen **bereits auf Seite 1** und werden trotzdem nicht geklickt. Hier hilft
kein besseres Ranking, sondern ein besserer Titel und eine bessere Description.

| Anfrage | Impressionen | Klicks | Position |
| --- | --- | --- | --- |
| `beezer snus` | 25 | **0** | 3,2 |
| `breezer app download` | 87 | 2 | 4,1 |
| `zyn tracker` | 71 | 1 | 4,9 |
| `breezer site` | 42 | **0** | 5,8 |
| `snus aufhören app` | 29 | **0** | 6,9 |
| `breezer website` | 31 | **0** | 7,0 |
| `zyn app` | 20 | **0** | 9,0 |
| `quit snus app` | 28 | **0** | 9,4 |

Position 3,2 und null Klicks aus 25 Impressionen ist der auffälligste Wert der ganzen
Auswertung. Auf Platz 3 klickt normalerweise jeder zehnte.

Zwei Einschränkungen, damit hier nicht das Falsche repariert wird:

- **Tippfehler-Anfragen wie `beezer snus` und `bezzer snus`** landen oft bei einer
  Google-Korrektur ("Meintest du ...?"), die die Impression zählt, ohne dass die Ergebnisse
  je wirklich gelesen werden. Ein Teil dieser Nullen ist deshalb nicht behebbar.
- **Bei `breezer app` (Position 8,6, 2,0 % CTR)** ist unklar, ob die Website überhaupt das
  richtige Ziel ist. Wenn App Store und Play Store für den Markennamen über breezer.now
  stehen, ist das kein Problem, sondern der kürzere Weg zur Installation. Vor jeder
  Maßnahme einmal selbst danach suchen und nachsehen, was auf den Plätzen 1 bis 7 steht.

---

## C. Inhaltlich

### C1. `/de/snus-aufhoeren` wird als Produktseite eingeordnet, nicht als Ratgeber

Der klarste Befund der Auswertung. Dieselbe Seite, drei Anfragen:

| Anfrage | Impressionen | Position |
| --- | --- | --- |
| `snus aufhören app` | 19 | **6,5** |
| `snus aufhören` | 89 | **23,1** |
| `mit snus aufhören` | 89 | **22,3** |
| `snusen aufhören` | 37 | **24,5** |

Google versteht die Seite als App-Seite und rankt sie dafür gut. Für die Hauptterme, die
fünfmal so viel Nachfrage haben, steht sie auf Seite 3.

Die Ursache steht in der Frontmatter von `src/content/guides/de/snus-aufhoeren.md`:

```
title:       "Snus aufhören App: Quit-Modus mit Breezer | Österreich"
heading:     "Snus aufhören App: Schritt für Schritt mit Breezer"
description: "Mit Breezer Snus aufhören oder reduzieren: ..."
```

Titel, Überschrift und Description führen mit dem Produkt. Auch alle drei FAQ-Antworten
beginnen mit Breezer. Wer `snus aufhören` sucht, will aber wissen **wie**, nicht **womit**.
Google bedient diese Absicht mit Ratgeberinhalten, und die Seite liefert eine Produktseite.

Das ist kein Textproblem an einer Stelle, sondern die Ausrichtung der Seite. Zur
Größenordnung: 215 Impressionen in 180 Tagen auf den drei Hauptbegriffen, aktuell null
Klicks. Auf Position 5 wären das grob 20 bis 30 Klicks im gleichen Zeitraum, also mehr als
alle Guide-Seiten zusammen heute liefern.

Der englische Zwilling `/quit-snus` hat dasselbe Muster (`quit snus app` Position 9,4, null
Klicks) bei kleinerer Nachfrage.

### C2. `/zyn-tracker` zieht die falsche Absicht an

| Anfrage | Impressionen | Position | Absicht |
| --- | --- | --- | --- |
| `zyn tracker` | 71 | 4,9 | passt |
| `zyn app` | 20 | 9,0 | passt |
| `does zyn have an app` | 18 | 10,7 | passt |
| `zyn order tracking` | 19 | 15,1 | Paketverfolgung |
| `zyn rewards tracking` | 15 | 19,3 | Prämienprogramm |
| `how to track zyn rewards order` | 4 | 23,0 | Prämienprogramm |

Rund 38 Impressionen entfallen auf Leute, die ihre Zyn-Bestellung oder ihre Prämienpunkte
verfolgen wollen. Das ist Fehlverkehr, der sich nicht konvertieren lässt und den man nicht
bekämpfen muss, aber man sollte ihn kennen, bevor man die CTR dieser Seite bewertet.

Interessanter sind die Fragen-Anfragen: `does zyn have an app` und `is there a zyn app`
stehen knapp vor Seite 1 und haben eine sehr eindeutige Absicht. Ein FAQ-Eintrag in genau
dieser Formulierung ist eine kleine Änderung mit klarer Zielrichtung.

### C3. Inhaltliche Lücken mit nachgewiesener Nachfrage

Anfragen, für die es heute keine passende Seite gibt und die trotzdem Impressionen erzeugen:

- `snus withdrawal symptoms`, Position 32,5. Der Entzugsverlauf ist genau das, was die App
  im Quit-Modus abbildet, und es gibt keine Seite dazu.
- `quitting snus timeline`, Position 16,0. Gleiche Richtung.
- `sluta snusa app`, Position 24,0. Schwedisch. Ein einzelnes Signal, aber der schwedische
  Markt ist für Snus der größte überhaupt. Beobachten, nicht sofort handeln.

---

## Was auffällt, aber keine Maßnahme ist

**Deutsch ist der stärkere Markt und wird schlechter bedient.** Letzte 180 Tage:

| Markt | Impressionen | Klicks | CTR | Position |
| --- | --- | --- | --- | --- |
| Englisch | 2268 | 47 | 2,07 % | 7,0 |
| Deutsch | 469 | 19 | **4,05 %** | 15,2 |

Deutsche Seiten stehen acht Plätze weiter hinten und werden trotzdem doppelt so oft
geklickt. Das ist der beste vorliegende Beleg dafür, dass Content-Arbeit auf Deutsch mehr
bringt als auf Englisch, und es passt zur Ausrichtung auf Österreich.

**Generische Suche liefert derzeit nichts.** Markenanfragen 534 Impressionen und 9 Klicks,
generische Anfragen 527 Impressionen und **1 Klick**. Wer nach `breezer` sucht, kennt die
App bereits. Neue Nutzer können nur aus der generischen Hälfte kommen, und die konvertiert
aktuell mit 0,19 Prozent.

---

## Grenzen dieser Daten

1. **Die API liefert je Tag nur die oberen Zeilen.** Die Summen hier (1581 Impressionen in
   der Query-Tabelle) liegen deshalb unter dem, was die Search Console im Webinterface zeigt
   (zuletzt rund 4700 über 16 Monate). Verhältnisse und Rangfolgen bleiben aussagekräftig,
   absolute Summen nicht.
2. **Position ist ein gewichteter Durchschnitt**, kein fester Rang. Eine Seite kann für
   dieselbe Anfrage an verschiedenen Tagen und in verschiedenen Ländern unterschiedlich weit
   oben stehen.
3. **Kein Weg von der Suche zur Installation.** Die Website läuft cookieless ohne
   Personenprofile, ein Suchklick lässt sich keinem `store_clicked` zuordnen. Die Kachel
   "Suche bis Store-Klick" stellt die drei Stufen nebeneinander, sie verbindet sie nicht.
4. **Zeitversatz.** Die Search Console hinkt zwei bis drei Tage hinterher und rechnet in
   einer anderen Zeitzone als das PostHog-Projekt (Europe/Vienna). Tagesgenaue Vergleiche
   zwischen den beiden Quellen sind grob, nicht exakt.

## Reihenfolge, wenn umgesetzt wird

An der Website gibt es keinen technischen Schnellschuss. Das war die Überraschung dieser
Auswertung: alles Eindeutige ist bereits richtig konfiguriert, übrig bleibt Inhaltsarbeit.

1. **C1**, die Ausrichtung von `/de/snus-aufhoeren`. Der mit Abstand größte Hebel, 215
   Impressionen mit null Klicks, und der einzige Punkt, der echte Textarbeit bedeutet.
2. **B**, Titel und Descriptions der Seiten mit guter Position und null Klicks. Vorher
   einmal selbst nach `breezer app` suchen und prüfen, ob die Stores davorstehen. Wenn ja,
   ist ein Teil dieser Liste erledigt, ohne dass etwas zu tun wäre.
3. **C2 und C3**, FAQ-Einträge und neue Abschnitte. Klein, additiv, jederzeit nachschiebbar.
4. **A2**, der Datenschutz-Link in App Store Connect und Play Console. Gehört nicht ins
   Repo, blockiert aber die nächste Store-Einreichung.

---

## Umsetzungsstand

Stand 16.08.2026. Alles hier ist gebaut und getestet, aber noch nicht deployed.

### Umgesetzt

**C1, beide Sprachen.** `/de/snus-aufhoeren` und `/quit-snus` sind von Produkt- auf
Ratgeberseiten umgestellt. Titel, H1, Description und FAQ führen jetzt mit der Frage statt
mit der App. Bei den H2s hat sich das Verhältnis von 2 aus 4 produktbezogen auf 1 aus 7
gedreht. Neu dazugekommen: Entzugsverlauf nach Tagen, Tabelle der körperlichen
Veränderungen, die sechs typischen Entzugserscheinungen, Schlussstrich gegen Reduzieren.

Die Fakten dafür stammen aus der App selbst (`locales/de.json`, Schlüssel `health.imp0` bis
`imp8` und `health.sym0` bis `sym5`, plus die Meilenstein-Schwellen in `QuittingView.jsx`).
Die Seite behauptet damit exakt das, was die App den Nutzern zeigt. Bewusst abgeschwächt:
die Krebs- und Schlaganfall-Aussage aus `imp8` steht nicht auf der Website, und es gibt einen
Hinweis, dass es Richtwerte sind und bei anhaltenden Beschwerden der Arzt zuständig ist.

**C2, Zyn-Seiten.** Die Fragen-Anfragen `does zyn have an app` (Position 10,7) und
`is there a zyn app` (9,5) haben eigene FAQ-Einträge bekommen. Dazu ein Abschnitt, der
Bestellverfolgung und Zyn Rewards ausdrücklich vom Konsum-Tracking trennt, weil rund 38
Impressionen dieser Seite aus dieser Verwechslung stammen.

**C3, der Blog.** Der Blog war leer, nur `_template.md`. Jetzt stehen drei Artikel in je zwei
Sprachen, alle mit begutachteten Quellen:

| Artikel | Zielintent | Belegt durch |
| --- | --- | --- |
| Nikotinbeutel-Stärke, mg/g gegen mg pro Beutel | Die meistverwechselte Angabe der Kategorie | Heshmati et al., *Drug and Alcohol Dependence Reports* 2025, Metaanalyse aus 7 Studien |
| Snus und Sport | `is snus banned`, Fokus, Regeneration | WADA Monitoring-Programm; PFA und Loughborough, *Journal of Science and Medicine in Sport* 2025 |
| Nikotinbeutel und Zahnfleisch | Die häufigste Gesundheitsfrage der Kategorie | Rungraungrayabkul et al., *BMC Oral Health* 2024;24:889, systematisches Review |

Redaktionelle Linie bei allen dreien: die Evidenz so darstellen, wie sie ist, inklusive ihrer
Schwäche. Beim Zahnfleisch-Artikel ist das der eigentliche Differenzierer, weil das Review
nur drei Studien mit 190 Teilnehmenden und hohem Verzerrungsrisiko fand. Wer in diesem Feld
selbstsicherer klingt als die Quellen, verkauft entweder Beutel oder Angst.

Interne Verlinkung: jeder Artikel zeigt mindestens zweimal auf eine Geldseite, und die
Guides zeigen zurück auf die Artikel.

### Geprüft

- Build läuft durch, 26 Seiten statt vorher 20.
- Canonical, hreflang (`en`, `de`, `de-AT`, `x-default`) und FAQPage-Schema auf allen neuen
  Seiten korrekt und wechselseitig gepaart.
- Alle sechs neuen Seiten in `sitemap.xml`.
- Vollständige Prüfung aller internen Links im gebauten HTML: keine toten Verweise.

### Offen

- **`/quit-snus` hat keinen eigenen deutschen Zwilling für den Blog-Teil.** Die drei Artikel
  sind gepaart, die Guides auch. Nichts fehlt, nur zur Klarstellung.
- **Gruppe B** (Titel und Descriptions mit guter Position und null Klicks) ist bewusst nicht
  angefasst. Erst prüfen, was bei `breezer app` auf den Plätzen 1 bis 7 steht.
- **A2**, die Store-Datenschutz-URL.
- **Wirkungskontrolle.** Google braucht für eine Neubewertung dieser Größenordnung
  erfahrungsgemäß vier bis acht Wochen. Die Kachel "Suchanfragen mit Rang-Potenzial" im
  Dashboard ist die Stelle, an der sich das zuerst zeigen müsste: `snus aufhören` und
  `mit snus aufhören` sollten sich von Position 22 bis 24 nach vorne bewegen. Passiert bis
  Mitte Oktober nichts, war die Diagnose falsch und nicht die Umsetzung.
