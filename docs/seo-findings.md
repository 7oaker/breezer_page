# SEO-Befunde breezer.now

Stand 16.08.2026. Datenbasis ist die Google Search Console, seit 15.08.2026 an PostHog
angebunden, mit Historie ab 24.04.2025. Jede Zahl hier ist im Dashboard
[SEO: breezer.now](https://eu.posthog.com/project/249017/dashboard/898454) nachlesbar.

**Update 16.08.2026:** Der Bericht war ursprünglich reine Entscheidungsgrundlage. Ein Teil der
Befunde ist inzwischen umgesetzt, siehe [Umsetzungsstand](#umsetzungsstand) am Ende.

**Update 18.08.2026:** Abschnitt D beantwortet die Frage, ob die Website die restlichen
Store-Sprachen (Italienisch, Norwegisch, Polnisch, Schwedisch) abdecken soll. Grundlage ist
die Ländertabelle der Search Console, die bis dahin ungenutzt war. Das Dashboard heißt
inzwischen *Website: Suche bis Store-Klick*, die Links hier zeigen weiterhin richtig.

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

## D. Weitere Sprachen (geprüft 18.08.2026)

Ausgangsfrage: Der Store unterstützt Englisch (UK), Deutsch, Italienisch, Norwegisch,
Polnisch und Schwedisch. Soll die Website denselben Satz abdecken, mit 1:1 übersetzten
Artikeln?

Kurzantwort: nein, mit einer Ausnahme als Test. Die Begründung ist nicht der Aufwand,
sondern dass die Daten in drei der vier Märkte keine Nachfrage zeigen und im vierten
etwas anderes zeigen, als eine Übersetzung lösen würde.

### D1. Die Nachfrage in den vier Kandidatenmärkten

Quelle ist `googlesearchconsole.search_analytics_by_country`, 180 Tage. Die Tabelle war
angebunden und bis heute nie ausgewertet.

| Land | Impressionen | Klicks | Position |
| --- | --- | --- | --- |
| SWE | 54 | 0 | 6,9 |
| NOR | 41 | 1 | 5,0 |
| POL | 37 | 1 | 6,1 |
| ITA | 33 | 0 | 5,4 |
| **Summe** | **165** | **2** | |

Etwa eine Impression pro Tag für alle vier zusammen. Die deutschsprachigen Märkte (DEU,
AUT, CHE) liefern im selben Zeitraum 556.

Der zweite Punkt wiegt schwerer als der erste: diese Länder stehen bereits auf **Position
5 bis 7**, mit den englischen Seiten. Sie finden die Website, sie klicken nicht. Eine
Übersetzung löst ein Sichtbarkeitsproblem, das dort gar nicht besteht.

### D2. Der Einwand dagegen, und warum er nur für Schweden trägt

Die Search Console zeigt nur Anfragen, bei denen die Seite bereits auftaucht. Ohne
italienische Seite gibt es keine italienischen Impressionen, die Zahl in D1 ist also
teilweise zirkulär. Schweden ist der größte Snus-Markt der Welt, 54 Impressionen können
unmöglich die echte Nachfrage sein.

Der Gegentest lautet deshalb: sickert lokalsprachige Nachfrage durch, auch ohne
lokalisierte Seite?

| Land | Anfrage | Impressionen | Position |
| --- | --- | --- | --- |
| SWE | `sluta snusa app` | 3 | **24,0** |
| NOR | `stop snus app` | 2 | 10,5 |
| NOR | `quit snus app` | 2 | 10,5 |
| ITA | `breezer app` | 8 | 5,8 |
| POL | `breezer app` | 3 | 8,7 |

**Schweden: ja.** `sluta snusa app` ist die schwedische Entsprechung von `snus aufhören
app` und steht auf Position 24, also Seite 3. Exakt dasselbe Muster wie C1, siehe auch
C3.

**Norwegen: nein**, der Markt sucht nachweislich auf Englisch. **Italien und Polen: nein**,
ausschließlich Markenanfragen, keine einzige lokalsprachige Anfrage in 180 Tagen. Kein
Signal, weder direkt noch durchgesickert.

### D3. Korrektur eines Zwischenbefunds

Der erste Blick auf die Ländertabelle legte nahe: Österreich holt aus 111 Impressionen 23
Klicks (20,7 %), Deutschland aus 340 nur 8 (2,35 %) bei Position 15,2. Gleiche Sprache,
gleiche Seiten, also ein reines Deutschland-Problem.

Die Aufschlüsselung nach Anfragetyp widerlegt das:

| Land | Art | Impressionen | Klicks | Position |
| --- | --- | --- | --- | --- |
| AUT | generisch | 20 | **0** | 8,1 |
| AUT | Marke | 9 | 3 | 5,4 |
| DEU | generisch | 219 | **0** | 21,2 |
| DEU | Marke | 28 | 1 | 5,1 |
| CHE | generisch | 73 | **0** | 21,7 |

312 generische Impressionen im deutschsprachigen Raum, **null Klicks**, auch in
Österreich. Der österreichische Wert war Markenverkehr, kein besseres Ranking.

Einschränkung: Google lässt seltene Anfragen aus den Query-Berichten weg. Diese
Aufschlüsselung deckt nur 29 der 111 österreichischen Impressionen ab, die übrigen 20
Klicks lassen sich keiner Anfrage zuordnen. Die deutsche Zeile mit 219 Impressionen ist
groß genug, um zu tragen.

### D4. Kann eine Übersetzung schaden?

Die Übersetzung an sich nicht. Drei Mechanismen können es sehr wohl.

**1. Skalierte Übersetzung ohne Redaktion ist eine benannte Spam-Kategorie.** Googles
Richtlinie zu *scaled content abuse* zielt genau auf massenhaft erzeugte Seiten mit
geringem Eigenwert, maschinelle Übersetzung ausdrücklich eingeschlossen. Sechs
Sprachfassungen desselben Artikels ohne redaktionelle Arbeit je Sprache fallen in diese
Beschreibung. Das Risiko trifft dann nicht nur die neuen Seiten, sondern die Domain.

**2. Vervielfacht wird ein Seitentyp, der noch nicht funktioniert.** Das generische
Deutsch steht auf Position 21 und holt null Klicks (D3). Vier weitere Sprachen davon
ergeben vier weitere Sprachen auf Position 21. Skaliert wird zuerst, was trägt.

**3. hreflang über sechs Sprachen ist fehleranfällig**, und die Auszeichnung ist aktuell an
zwei Stellen fest verdrahtet (D5). Ein einseitig gesetztes Alternate oder eine fehlende
Rückreferenz führt dazu, dass Google die Fassungen als Duplikate behandelt und eine davon
auswählt, meist nicht die gewünschte.

Was **nicht** dagegen spricht: Crawl-Budget. Bei 26 Seiten ist das kein Thema, das wäre
ein vorgeschobenes Argument.

Und ehrlich zur Gegenseite: **langfristig bringt gut gemachte Lokalisierung Traffic**, das
ist unstrittig. Die Frage ist nicht ob, sondern ob sie der beste Einsatz des nächsten
Arbeitsblocks ist. Nach D1 bis D3 ist sie es nicht.

### D5. Was eine weitere Sprache im Repo kostet

Die Zweisprachigkeit steckt im Typsystem, nicht in einer Konfiguration:

- `src/i18n/routes.ts`: `type Lang = 'en' | 'de'`, `routePairs` ist paarförmig, und
  `altRoute` kippt zwischen genau zwei Werten.
- hreflang fest verdrahtet in `src/components/Seo.astro:71-74` und
  `src/pages/sitemap.xml.ts:93-96`.
- Die Browsersprachweiche in `src/layouts/Base.astro` ist bewusst einseitig EN nach DE,
  weil eine zweiseitige Regel Googlebot aus dem Index werfen würde. Mit sechs Sprachen
  braucht diese Logik ein anderes Konzept.
- 24 Dateien hängen an der Zwei-Sprachen-Annahme, dazu je Sprache ein eigenes
  Seitenverzeichnis unter `src/pages/`.

Inhaltlich rund 8500 Wörter je Sprache (5 Guides, 3 Artikel) plus `src/i18n/ui.ts`. Vier
weitere Sprachen sind etwa 34.000 Wörter, und jeder künftige Artikel wird sechsfach.

### D6. Der Grund, der schwerer wiegt als der Aufwand

Die zentrale Regel in `.claude/skills/blog-post` lautet: keine Behauptung ohne Quelle, die
man selbst geöffnet hat. Die drei Artikel hängen an Heshmati et al. 2025,
Rungraungrayabkul et al. 2024 und der PFA/Loughborough-Studie 2025.

In einer Sprache, die niemand im Projekt liest, ist nicht prüfbar, ob eine Aussage die
Übersetzung überlebt hat. Sechs Sprachfassungen mit einem Qualitätsversprechen, das nur
für zwei davon eingelöst werden kann, sind schlechter als zwei geprüfte.

Dazu ein Prüfpunkt, der vor jeder Lokalisierung geklärt gehört: **die rechtliche Lage von
Nikotinbeuteln unterscheidet sich je Land erheblich.** Ein 1:1 übersetzter Artikel
unterstellt, der Inhalt gelte überall gleich. Vor einer Übersetzung ist je Zielland zu
prüfen, ob das Produkt dort überhaupt verkehrsfähig ist und ob die Aussagen tragen. Das
ist eine Recherche-, keine Übersetzungsaufgabe, und sie ist bislang für kein Zielland
gemacht.

### D7. Empfehlung

1. **Italienisch und Polnisch: nein.** Kein Signal in den Daten, weder direkt noch
   durchgesickert. Store-Lokalisierung und Website-Lokalisierung sind getrennte Dinge: der
   Store-Eintrag wird über die Store-Suche gefunden, die Website über Google.
2. **Norwegisch: nein.** Der Markt sucht nachweislich auf Englisch.
3. **Vorher: das generische Deutsch reparieren.** 219 deutsche Impressionen auf Position
   21,2 mit null Klicks sind mehr Volumen als alle vier Kandidatensprachen zusammen. Das
   Publikum ist da, die Seiten existieren, und jede Behauptung darin ist selbst prüfbar.
   Deckungsgleich mit C1, dessen Wirkung ab Mitte September messbar wird.
4. **Schwedisch danach, als Einzeltest.** Eine einzige Seite auf `sluta snusa`, ohne den
   Rest der Site zu übersetzen und ohne Umbau von `routes.ts`. Kostet einen Artikel statt
   einer Refaktorierung. Nach acht Wochen zeigt die Kachel *Suchanfragen mit
   Rang-Potenzial*, ob sich Position 24 bewegt. Trägt der Test, gibt es ein Argument für
   den vollen Umbau; trägt er nicht, sind 34.000 Wörter gespart.

### D8. Nebenbefunde aus der Ländertabelle

- **Dänemark steht nicht auf der Store-Liste und ist der beste Markt außerhalb der Marke:**
  85 Impressionen, 6 Klicks, CTR 7,06 % bei Position 3,4. Reagiert bereits auf die
  englischen Seiten, ohne dass je etwas dafür getan wurde.
- **Die Niederlande liefern 91 Impressionen und null Klicks.** Vor einer etwaigen
  Lokalisierung dorthin zuerst die Rechtslage prüfen, siehe D6.
- **IND und PAK zusammen 494 Impressionen und 3 Klicks.** Streuverkehr, der jede globale
  CTR nach unten zieht. Beim Lesen von Gesamtzahlen im Kopf behalten.

Alle Zahlen dieses Abschnitts stehen in der Kachel *Länder: wer findet dich, wer klickt*.

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

### Umgesetzt am 18.08.2026

**C1 vertieft: `/de/snus-aufhoeren` und `/quit-snus` von Grund auf überarbeitet.**

Am 16.08. waren nur die Etiketten geändert worden (Titel, H1, H2-Struktur). Die Substanz
blieb: 787 Wörter deutsch, 838 englisch, **null Quellenangaben**, während die drei
Blogartikel je drei hatten. Für `snus aufhören` konkurriert die Seite mit
Gesundheitsportalen, und dagegen war das kein Angebot.

| | vorher | nachher |
| --- | --- | --- |
| `/de/snus-aufhoeren` | 787 Wörter, 0 Quellen, 5 FAQ | **2702 Wörter, 7 Quellen, 8 FAQ** |
| `/quit-snus` | 838 Wörter, 0 Quellen, 5 FAQ | **2309 Wörter, 5 Quellen, 7 FAQ** |

Neue belegte Abschnitte in beiden Sprachen:

- **Entzugsverlauf** nach McLaughlin, Dani & De Biasi (2015): Beginn 4 bis 24 Stunden,
  Höhepunkt um Tag 3, Abklingen über 3 bis 4 Wochen. Stand vorher ungefähr richtig da,
  aber ohne Beleg.
- **Die sieben DSM-5-Entzugssymptome** als eigener Abschnitt.
- **Was nachweislich hilft**, aus dem Cochrane-Review Livingstone-Banks et al. (2025),
  43 Studien, 20.346 Teilnehmende, mit Effektstärken je Maßnahme. Das ist der Abschnitt,
  den Gesundheitsportale haben und wir nicht hatten.
- **Warum die Umgebung zählt**, aus Stead, Carroll & Lancaster (2017), 66 Studien.
  Gruppe gegen Selbsthilfe RR 1,88. Wichtig ist die Zeile, die sonst unterschlagen wird:
  gegen gleich intensive Einzelberatung gewinnt die Gruppe **nicht** (RR 0,99). Es ist
  also nicht die Gruppe, sondern verbindliche Unterstützung. Trägt das Social-Argument
  für Breezer, ohne es zu überdehnen.
- **Sechs-Schritte-Ablauf**, zielt auf `wie kann ich mit snus aufhören`.
- **Erfahrungsmuster aus r/QuittingZyn**, ausdrücklich als Erfahrung gekennzeichnet.
  Der Befund "körperlich weg an Tag 4, Verlangen nicht" deckt sich mit der Studienlage
  und erklärt die Rückfälle in Woche 2 bis 3.

**Anfragevarianten geschlossen.** `snusen` kam auf der deutschen Seite null mal vor und
holte trotzdem 17 Impressionen bei Position 25,1. Steht jetzt im Text, in einer H2 und
in einer FAQ-Frage.

**Österreich-Alleinstellung: die Tabakmonopol-Novelle.** Seit Anfang April 2026 fallen
Nikotinbeutel unter das Tabakmonopolgesetz, Verkauf nur noch in Trafiken, Onlinehandel
verboten. Trafik im Schnitt 6,50 €, online zuvor 3,50 € (ORF Kärnten, 17.08.2026).
Daraus die Jahresrechnung: rund 1.190 € statt 640 € bei einer Dose alle zwei Tage. Eigene,
marktspezifische Zahlen, die keine konkurrierende Seite hat. Bewusst nur auf der
deutschen Seite, für den englischen Markt ist es irrelevant.

**Brotkrumenpfad der Guides korrigiert.** Guides hatten `Snus App › Guide`, Blogartikel
`Snus App › Blog › Artikel`. Google las die Guides damit als direkt an der Startseite
hängend. Jetzt steht `Blog` als Zwischenstufe drin, in beiden Sprachen
(`src/pages/de/[guide].astro`, `src/pages/[guide].astro`). **Die URLs bleiben unverändert**,
ein Umzug nach `/de/blog/<slug>` würde die aufgebaute Position wegwerfen. Brotkrumen dürfen
die Seitenhierarchie abbilden statt des Verzeichnispfads, und `/de/blog` listet die Guides
ohnehin unter "Guides & Vergleiche".

**Zwei kaputte Links repariert.** In `snus-aufhoeren.md` standen `](snus-tracker)` und
`](zyn-tracker)` ohne führenden Schrägstrich. Sie lösten nur auf, weil die URL keinen
Schlusschrägstrich hat.

**Nicht übernommen**, bewusst: eine Verschwörungsthese über Zusatzstoffe aus einem
Forenbeitrag, ein Supplement-Stack mit 3000 mg Vitamin C täglich (auf einer
Gesundheitsseite fahrlässig), eine ungeprüfte Buchempfehlung, und der ältere
Partner-Support-Review von 2008, dessen aktuelle Fassung nicht zugänglich war.

### Nachgezogen am 18.08.2026: die restlichen acht Guide-Seiten

Nach der Tiefenarbeit an den Quit-Seiten standen zwei 2700-Wort-Seiten neben Seiten mit
195 Wörtern. Das Qualitätssignal wirkt seitenweit, deshalb wurden alle Guides auf denselben
**Standard** gehoben (Antwort zuerst, belegte Aussagen, echte FAQ, Quellenblock), bewusst
nicht auf dieselbe **Länge**: eine Vergleichsseite auf 2700 Wörter aufzublasen wäre
Füllmaterial.

| Seite | vorher | nachher |
| --- | --- | --- |
| `zyn-tracker` de/en | 313 / 483 | 877 / 908 |
| `snus-tracker` de/en | 273 / 313 | 805 / 842 |
| `vs-snusless` de/en | 195 / 216 | 815 / 856 |
| `vs-smoke-free` de/en | 1214 / 1323 | 904 / 911 |

`vs-smoke-free` ist **kürzer** geworden. Das ist Absicht, siehe unten.

**Behobene Defekte, die schwerer wogen als die Wortzahl:**

- **Leere Überschrift.** `vs-snusless.md` hatte ein `## Funktionsvergleich` ganz ohne Inhalt,
  direkt gefolgt von der nächsten H2. Jetzt steht dort die eigentliche Vergleichstabelle.
- **Evidenzbehauptung ohne Evidenz.** Im FAQ von `snus-tracker` stand, Nutzer reduzierten
  "dadurch nachweislich ihren Verbrauch". Das ging als FAQPage-Schema an Google. Ersatzlos
  gestrichen, siehe nächster Punkt.
- **Selbstsuperlative im Schema.** "Breezer ist der beste Zyn Tracker", "der führende Snus
  Tracker", "die einzige Snus App mit ..." standen in FAQ-Antworten. Entfernt.
- **Unbelegte Fremdbehauptungen.** `vs-smoke-free` berief sich auf "unabhängige Tests von
  Snus-Quit-Apps aus 2026" ohne jede Quelle und behauptete konkrete Bewertungszahlen,
  Entwicklername und Produktnamen der Bezahlstufen. Nichts davon war verifizierbar; der
  Store-Eintrag lieferte 429 beziehungsweise abgeschnittenen Inhalt. Alles entfernt, daher
  die geringere Wortzahl.
- **Falsche Fremdbehauptung.** Dieselbe Seite nannte Smoke Free ein "Solo-Erlebnis" und
  behauptete, es gebe dort keine Community. Öffentliche Beschreibungen nennen sehr wohl
  Community- und Beraterzugang in den Bezahlstufen. Korrigiert; der Vergleich stützt sich
  jetzt auf den einzigen wirklich belastbaren Unterschied, nämlich das Zielprodukt
  (Zigaretten gegen Nikotinbeutel).
- **Vier relative Links** (`](snus-tracker)` statt `](/de/snus-tracker)`), die nur auflösten,
  weil die URLs keinen Schlusschrägstrich haben.

**Korrektur am 18.08. abends: RR 1,00 heißt "unentschieden", nicht "wirkt nicht".**

Die erste Fassung dieses Abschnitts formulierte "für Apps ist kein Effekt nachweisbar" und auf
einer Seite sogar "Eine App bringt dich nicht zum Aufhören". Das war derselbe Fehler, der auf
diesen Seiten gerade korrigiert wurde, nur in die Gegenrichtung: eine Überinterpretation der
Quelle. RR 1,00 mit einem Intervall von 0,66 bis 1,52 bei **sehr niedriger** Aussagekraft
bedeutet, dass fünf Studien die Frage nicht entscheiden konnten, und die Autoren fordern
ausdrücklich weitere. Fehlende Evidenz ist kein Gegenbeweis.

Alle acht Stellen sind umformuliert. Wichtiger noch, der eigentliche Erkenntnisgewinn steckt
im **Unterschied zwischen den zwei Zeilen** und ist ein Argument für den Produktaufbau: Eine
SMS kommt an, ob der Nutzer etwas öffnet oder nicht; eine App wartet aufs Öffnen, und das
lässt über die Wochen nach. Wirksam ist also nicht das Format, sondern die verlässliche
Erinnerung von außen. Genau das decken Benachrichtigungen, Meilensteine und Limitwarnungen
ab, und genau so steht es jetzt auf den Seiten.

**Der neue Beleg:**

Der Cochrane-Review Whittaker et al. (2019) hat geprüft, ob Handy-Programme die
Ausstiegsquote heben.

| Ansatz | Effekt | Basis | Aussagekraft |
| --- | --- | --- | --- |
| Automatisierte SMS | RR 1,54 (1,19–2,00) | 13 Studien, 14.133 | moderat |
| **Smartphone-Apps** | **RR 1,00** (0,66–1,52) | 5 Studien, 3.079 | **sehr niedrig** |

Für Apps ist **kein Effekt** nachweisbar. Das steht jetzt auf beiden Tracker-Seiten und auf
beiden Vergleichsseiten, mit der Einordnung: ein Tracker ist ein Messinstrument, keine
Behandlung, und was belegt wirkt, ist Beratung (RR 1,76). Das ist unbequem und genau der
Grund, warum es dasteht: in einer Nische, in der jede konkurrierende Seite entweder Beutel
oder Angst verkauft, ist Ehrlichkeit die Unterscheidung.

**Verifizierte Fremdangaben.** Alles zu Snusless stammt aus dem öffentlichen
App-Store-Eintrag (Anbieter Sober Bar), abgerufen 18.08.2026, mit Datumsstempel auf der
Seite. Belastbarster Unterschied: dort liegen die Tracking-Funktionen hinter einem
Premium-Abo, bei Breezer nicht.

**Abgrenzung gegen Kannibalisierung.** `snus-tracker` und `zyn-tracker` zielten vorher auf
dasselbe. Jetzt ist `zyn-tracker` die markenbezogene Seite (Einheiten auf der Dose, mg pro
Beutel gegen mg/g, Abgrenzung gegen Bestellverfolgung und Zyn Rewards), `snus-tracker` die
Seite für alle, die tracken wollen **ohne** aufhören zu müssen.

**Die Absichtsdiagnose zu `/zyn-tracker` (C2) hat jetzt Zahlen.** Von 428 Impressionen in
180 Tagen wollen rund 44 etwas völlig anderes: `zyn order tracking` (21, Position 14,9) und
`zyn rewards tracking` (17, Position 19,4) suchen Versandstatus und Treuepunkte. Die Seite
grenzt sich in einer Tabelle gleich zu Beginn davon ab, was den Leuten hilft und Google
sagt, was die Seite ist und nicht ist.

### Offen

- **Wirkungskontrolle der Tiefenüberarbeitung vom 18.08.** Getrennt von der C1-Kontrolle
  unten nicht mehr messbar: Etiketten (16.08.) und Substanz (18.08.) liegen zwei Tage
  auseinander, Google bewertet beides in einem Durchgang. Bei aktuell null Klicks ist
  saubere Zuordnung der falsche Luxus, aber es gehört festgehalten.
- **Konkurrenzprüfung nicht gemacht.** Dass für `snus aufhören` Gesundheitsportale mit
  1500 bis 3000 Wörtern auf Seite 1 stehen, ist die Annahme hinter der Tiefenarbeit, keine
  Erhebung. Einmal selbst danach suchen.
- **Limit-Verteilung aus Appwrite.** Auf beiden Seiten steht "das voreingestellte Limit
  liegt bei zehn, viele setzen es auf fünf". Das ist eine Produktbeobachtung, keine
  gemessene Zahl: `dailyLimit` liegt in Appwrite (`context/AppStateProvider.jsx:116`),
  nicht in PostHog. Wer die Verteilung zieht, macht daraus eine belegte Zahl, und das wäre
  inhaltlich das Wertvollste auf beiden Seiten.
- **Gruppe B** (Titel und Descriptions mit guter Position und null Klicks) ist bewusst nicht
  angefasst. Erst prüfen, was bei `breezer app` auf den Plätzen 1 bis 7 steht.
- **Smoke Free ist nicht verifiziert.** Der App-Store-Eintrag lieferte 429, die Play-Seite
  abgeschnittenen Inhalt. Die Vergleichsseite kommt deshalb ohne konkrete Fremdangaben aus.
  Wer die Seite später ausbaut, muss den Eintrag zuerst tatsächlich öffnen.
- **Eigene Bewertungszahlen.** Die alte Fassung nannte "4,8 Sterne aus 27 Bewertungen" für
  Breezer. Entfernt, weil undatiert und schnell veraltet. Wenn das zurück soll, gehört ein
  Abrufdatum dazu.
- **`/snus-tracker` zielt auf einen Begriff ohne Nachfrage.** `snus tracker` erzeugt in 180
  Tagen **null** Impressionen, `zyn tracker` dagegen 75. Die Seite ist jetzt sauber, aber der
  Hebel liegt woanders. Nicht weiter ausbauen, ohne dass sich die Nachfrage ändert.
- **A2**, die Store-Datenschutz-URL.
- **Weitere Sprachen**, siehe Abschnitt D. Italienisch, Norwegisch und Polnisch sind nach
  Datenlage abgelehnt. Schwedisch bleibt als Einzelseiten-Test offen, bewusst erst nach der
  Wirkungskontrolle zu C1.
- **Wirkungskontrolle.** Google braucht für eine Neubewertung dieser Größenordnung
  erfahrungsgemäß vier bis acht Wochen. Die Kachel "Suchanfragen mit Rang-Potenzial" im
  Dashboard ist die Stelle, an der sich das zuerst zeigen müsste: `snus aufhören` und
  `mit snus aufhören` sollten sich von Position 22 bis 24 nach vorne bewegen. Passiert bis
  Mitte Oktober nichts, war die Diagnose falsch und nicht die Umsetzung.
