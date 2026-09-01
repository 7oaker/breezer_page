# Wachstumsplan: von 60 Euro auf 5.000

Stand 26.08.2026, zweite Fassung. Zahlen aus PostHog Projekt 249017, Testkonten der Kohorte
210940 ausgeschlossen. Preis bleibt bei **2,99 / 19,99**, entschieden.

Die Produktseite der Frage "wofür zahlt jemand" steht in `engagement-und-spiele.md`. Die
Sprachenfrage für die Website ist in `seo-findings.md`, Abschnitt D, bereits am 18.08.
geprüft worden; dieses Dokument baut darauf auf und wiederholt sie nicht.

---

## Korrektur: der Heimmarkt ist nicht tot

Die erste Fassung behauptete, Breezer sei "eine österreichische App für ein Produkt, das es
in Österreich nicht zu kaufen gibt". **Das war falsch.** Nikotinbeutel wie VELO sind in
Österreich regulär erhältlich, Siberia kommt über Tschechien, und die Kategorie verbreitet
sich sichtbar genug, dass der Kurier über ihre Schädlichkeit berichtet hat.

Der Fehler war, Snus (mit Tabak, EU-weit außer Schweden vom Verkauf ausgeschlossen) und
tabakfreie Pouches als eine Rechtskategorie zu behandeln. Sie sind zwei.

**Das dreht die Strategie um, und zwar zum Besseren.** Der deutschsprachige Raum ist eine
Kategorie in der frühen Verbreitungsphase mit steigender öffentlicher Aufmerksamkeit. Das ist
exakt die Nachfragekurve, die ein Aufhör-Werkzeug will: die Zahl der Nutzer steigt, die Sorge
steigt mit, und es gibt keine etablierte App.

Was die Suchdaten stattdessen zeigen, sind **zwei Märkte mit entgegengesetzten Problemen.**

---

## Teil 1: Die zwei Probleme

### Deutschsprachig: richtige Absicht, falscher Rang

| Anfrage | DEU | CHE | AUT | Klicks | Position |
| --- | --- | --- | --- | --- | --- |
| `snus aufhören` | 71 | 36 | | **0** | ~22,5 |
| `mit snus aufhören` | 70 | 32 | | **0** | ~23 |
| `snusen aufhören` | 49 | | | **0** | 24,2 |
| `snus aufhören app` | 24 | | 10 | 1 | ~6,4 |

**258 Impressionen mit echter Aufhör-Absicht, null Klicks, Position 23.** Die Nachfrage ist
da, in deiner Muttersprache, in deinem Heimmarkt. Du stehst auf Seite 3.

Das Muster dahinter steht schon in `seo-findings.md` C1: Google liest `/de/snus-aufhoeren` als
**Produktseite**, nicht als Ratgeber. Deshalb rankt die App-Anfrage (`snus aufhören app`) auf
Position 6 und die informationale Anfrage (`snus aufhören`) auf Position 23. Das ist ein
Inhalts- und Autoritätsproblem, kein Sprachproblem, und Übersetzungen lösen es nicht.

### USA: richtiger Rang, falsches Versprechen

| Anfrage | Impressionen | Klicks | Position |
| --- | --- | --- | --- |
| `zyn tracker` | **79** | **0** | **5,0** |
| `zyn order tracking` | 20 | 0 | 14,9 |
| `does zyn have an app` | 18 | 0 | 10,7 |
| `zyn rewards tracking` | 17 | 0 | 21,3 |
| `zyn app` | 10 | 0 | 10,3 |
| `is there a zyn app` | 4 | 0 | 14,0 |

**79 Impressionen auf Position 5 und null Klicks.** Position 5 sollte 5 bis 8 Prozent holen.
Null bedeutet: der Titel und die Beschreibung im Suchergebnis versprechen nicht das, wonach
gesucht wurde. Das ist **kein Ranking-Problem**, und es ist deshalb billig zu beheben.

Die Ursache steht direkt daneben: `zyn order tracking` (20) und `zyn rewards tracking` (17)
zeigen, dass ein erheblicher Teil der Leute, die "zyn tracker" tippen, **Paketverfolgung oder
das Bonusprogramm** meint, nicht Konsumzählung. Das Snippet muss die Absicht sofort trennen,
sonst klickt keine der beiden Gruppen.

> Ein Titel wie **"ZYN Tracker App: Count Your Pouches Per Day"** beantwortet für die eine
> Gruppe die Frage und schließt die andere sichtbar aus. Das ist eine Stunde Arbeit an der
> Anfrage mit dem meisten Volumen im ganzen Konto.

### Skandinavien: kaum Google-Nachfrage, das ist kein Fehler

Schweden liefert genau **3 Impressionen** auf `sluta snusa app`, Position 24. Norwegen sucht
nachweislich auf Englisch. Dänemark holt dagegen 85 Impressionen mit 7,06 Prozent CTR auf
Position 3,4, **rein über die englischen Seiten**.

Der wichtige Schluss daraus, und er beantwortet deine Frage direkt: **in Skandinavien läuft
die Entdeckung über die Store-Suche, nicht über Google.** Deshalb sind dort Nutzer, obwohl es
keine einzige schwedische Seite gibt.

---

## Teil 2: Store-Lokalisierung und Website-Lokalisierung sind zwei verschiedene Dinge

Du hast gefragt, ob wir die App in mehr Sprachen anbieten und die Landingpage in alle
möglichen Sprachen übersetzen sollen. Die Antwort ist **ja zum ersten, fast durchgehend nein
zum zweiten**, und der Grund ist, dass die beiden Kanäle gegensätzliche Kostenstrukturen
haben.

| | App Store (ASO) | Website (SEO) |
| --- | --- | --- |
| Was übersetzt wird | 4 Textfelder plus Screenshots | jeder Artikel, dauerhaft |
| Kosten je Sprache | wenige Stunden, einmalig | ~8.500 Wörter plus Refactoring plus laufend |
| Wettbewerb | Apps in dieser Store-Sprache, also wenige | jede Website in dieser Sprache, also sehr viele |
| Wirkt nach | Tagen bis zwei Wochen | drei bis sechs Monaten |
| Braucht Autorität | nein | ja |
| Rückfall bei schlechter Qualität | Listing wirkt unprofessionell | **Domain kann als Spam eingestuft werden** |

Der Store hat **je Sprache einen eigenen Suchindex**. Auf Schwedisch konkurrierst du mit einer
Handvoll Apps, auf Englisch mit allen. Deshalb ist eine Store-Lokalisierung der billigste
Reichweitenhebel, den es überhaupt gibt.

Bei der Website ist es umgekehrt. Google belohnt keine Übersetzung, sondern die beste Antwort.
Sechs dünne Sprachfassungen ergeben sechs Seiten, die nirgends ranken, und **skalierte
Übersetzung ohne Redaktion ist bei Google eine benannte Spam-Kategorie** (`scaled content
abuse`). Das Risiko trifft dann die ganze Domain, nicht nur die neuen Seiten. Die vollständige
Herleitung steht in `seo-findings.md` D4.

Dazu die harte Zahl aus deinen eigenen Daten: **die Website erzeugt 25 Store-Klicks in 12
Tagen gegen 265 Installs.** Sie ist unter zehn Prozent des Kanals. Sie in sechs Sprachen zu
vervielfachen, multipliziert den kleinen Kanal und lässt den großen unberührt.

### Was der Store heute kann und wo die Lücken sind

Die App spricht laut `react_Breezer/locales/` bereits **de, en, it, no, pl, sv**. Gemessen an
der Nutzerverteilung fehlen:

| Land | Nutzer | App-Sprache | Bewertung |
| --- | --- | --- | --- |
| Tschechien | 11 | fehlt | **Lücke.** Siberia kommt von dort, der Markt ist real |
| Slowenien | 9 | fehlt | klein, Englisch vermutlich akzeptiert |
| Dänemark | 5 | fehlt | **beste Nicht-Marken-CTR überhaupt** (7,06 % bei Pos. 3,4) |
| Kroatien / Ungarn | je 3 | fehlt | zu klein, vorerst ignorieren |

**Dänisch ist der klarste Fall.** Der Markt reagiert bereits auf die englischen Seiten, ohne
dass je etwas dafür getan wurde, und `no.json` ist als Ausgangsbasis für Dänisch deutlich
näher als eine Übersetzung von null. Das ist ein billiger Gewinn.

**Tschechisch ist der zweitklarste.** Elf Nutzer ohne ein Wort in ihrer Sprache, in einem
Markt, aus dem das Produkt physisch kommt.

---

## Teil 3: Keywords, und warum es zwei verschiedene Listen braucht

Der häufigste Fehler an dieser Stelle ist, dieselbe Keyword-Liste für Store und Google zu
benutzen. Die beiden Publika tippen völlig verschiedene Dinge.

- **Im Store** tippen Leute kurz und produktförmig: `snus tracker`, `sluta snusa`. Sie sind
  schon im Store und wollen etwas installieren. Wenig Volumen, sehr hohe Absicht.
- **Bei Google** tippen Leute Fragen und Probleme: `wie lange dauert snus entzug`,
  `does zyn have an app`. Viel Volumen, gemischte Absicht.

### Store, je Sprache

Das iOS-Keyword-Feld hat 100 Zeichen, kommagetrennt, ohne Leerzeichen, und Wörter aus Titel
und Untertitel dürfen dort **nicht** wiederholt werden, sie zählen ohnehin.

```
en    Titel      Breezer: Snus & Pouch Tracker
      Untertitel Count pouches, cut down, quit
      Keywords   nicotine,counter,quit,craving,streak,dip,tobacco,log,habit,stop,reduce

de    Titel      Breezer: Snus & Pouch Tracker
      Untertitel Dosen zählen, reduzieren, aufhören
      Keywords   nikotin,beutel,zähler,sucht,entwöhnung,gewohnheit,protokoll,tagebuch

sv    Titel      Breezer: Snuskoll & Sluta Snusa
      Untertitel Räkna prillor, minska, sluta
      Keywords   snus,prilla,dosa,nikotin,vana,koll,minska,fri,räknare

nb    Titel      Breezer: Snusteller & Slutte å Snuse
      Untertitel Tell porsjoner, reduser, slutt
      Keywords   snus,porsjon,nikotin,vane,teller,slutte,snusfri,redusere

da    Titel      Breezer: Snustæller & Stop Snus
      Untertitel Tæl portioner, skær ned, stop
      Keywords   snus,nikotinposer,portion,vane,tæller,stoppe,snusfri
```

**Achtung, Markenrecht:** `zyn` gehört nicht ins Keyword-Feld. Ein fremdes Markenzeichen dort
kann eine Beschwerde des Rechteinhabers und eine Entfernung auslösen. Auf der Website ist
dasselbe Wort beschreibende, redaktionelle Nutzung und weitgehend unbedenklich. Diese
Trennung ist wichtig und wird oft verwechselt.

### Google, zwei Sprachen

**Deutsch, der Rang-Fall.** Die vorhandenen Anfragen brauchen Ratgeber-Inhalte statt
Produktseiten:

- `snus aufhören`, `mit snus aufhören`, `snusen aufhören` (258 Impressionen, Position 23)
- `snus entzug symptome`, `wie lange dauert snus entzug`
- `sind nikotinbeutel schädlich`, `velo schädlich` ← der Kurier-Nachrichtenwinkel

**Englisch, der CTR-Fall.** Hier fehlt kein Inhalt, sondern ein besseres Versprechen:

- `zyn tracker` (79, Position 5) ← Titel und Meta reparieren, nicht neu schreiben
- `does zyn have an app`, `is there a zyn app`, `zyn app` (32 zusammen)
- `quit snus app`, `snus withdrawal symptoms` (GB, Position 32,5)
- **Negativ abgrenzen:** `zyn order tracking`, `zyn rewards tracking` (41 Impressionen falscher
  Absicht). Das Snippet muss diese Gruppe sichtbar ausschließen.

---

## Teil 4: "Lokale, interessante Blogs" — was davon wirklich funktioniert

Du hast gefragt, ob wir lokale Blogs brauchen, um das anzukurbeln. Ehrliche Antwort eines
Marketers: **Gastbeiträge auf kleinen Blogs sind weitgehend totes Werkzeug.** Das ist die
Sorte Maßnahme, die einem Anfänger verkauft wird und die bei deiner Größenordnung nichts tut.
Was stattdessen funktioniert, in dieser Reihenfolge:

**1. Der Nachrichtenwinkel, den du gerade selbst geliefert hast.** Der Kurier hat über die
Verbreitung und Schädlichkeit von Pouches geschrieben. Redaktionen, die diese Geschichte
verfolgen, brauchen drei Dinge: Zahlen, einen Menschen, und eine Antwort auf "was kann man
dagegen tun". Du hast alle drei. Das ist ein warmer Kontakt in deiner Sprache in deinem
Heimmarkt, kein Kaltakquise-Versuch.

Wichtige Unterscheidung beim Timing:

- **Jetzt: die Gründerstory.** "Österreicher baut App gegen die Pouch-Sucht" braucht null
  Daten, ist sofort platzierbar und kostet einen Nachmittag. Kandidaten: Kurier (schreibt
  schon darüber), Der Standard, Die Presse, ORF-Regionalredaktionen, dazu Gründer- und
  Tech-Formate.
- **Später, ab etwa 2.000 Nutzern: die Datenstory.** Anonymisierte Verbrauchsmuster sind
  Selbstläufer für Redaktionen. Mit 234 Nutzern, davon 76 in AT und DE, ist das heute noch
  nicht belastbar, und eine dünne Datenstory verbrennt den Kontakt für die spätere gute.

**2. Communities statt Blogs.** Reddit (r/Snus, r/ZYN, r/nicotinepouches), dazu die
schwedischen und norwegischen Ecken und die deutschsprachigen Aufhör-Foren. Dort sitzt das
Publikum wirklich. Regeln: nie ein Link im Beitrag, Link im Profil, und ein frisches Konto
fliegt binnen Minuten raus.

**3. Fachseiten der Kategorie.** Snus- und Pouch-Reviewseiten haben echtes, thematisch exakt
passendes Publikum. Wenige, aber die richtigen.

**Nicht machen:** Verzeichniseinträge, gekaufte Gastbeiträge, generische App-Review-Seiten,
Linktausch. Kostet Zeit und Geld und bewegt nichts.

---

## Teil 5: Kanal-Bewertung

Das ist die Tabelle, mit der man Dinge **absagt**. Dein Engpass ist nicht Wissen, sondern
Zeit.

| Maßnahme | Aufwand | Wirkt nach | Effekt | Rang |
| --- | --- | --- | --- | --- |
| `/zyn-tracker` Titel und Meta reparieren | 1 Std einmalig | 2–4 Wochen | **hoch** (79 Imp., Pos. 5) | 1 |
| Store-Titel, Untertitel, Keywords in 6 Sprachen | 3 Std einmalig | 1–2 Wochen | **hoch** | 1 |
| Monatsabo als Vorauswahl | 20 Min | sofort | hoch (+80 % je Abo) | 1 |
| Deutsche Guides zu echten Ratgebern vertiefen | 2 Std/Woche | 3–6 Monate | hoch (258 Imp.) | 2 |
| Dänisch als Store-Sprache, Basis `no.json` | 2 Std einmalig | 2–4 Wochen | mittel | 3 |
| Reddit, Konto aufbauen und posten | 20 Min/Tag | 4–8 Wochen | mittel bis hoch | 3 |
| Tschechisch als Store-Sprache | 3 Std einmalig | 2–4 Wochen | mittel | 4 |
| Lokale Presse, Gründerstory | 3 Std einmalig | 2–6 Wochen | mittel, Lotterie | 4 |
| Schwedische Einzelseite als Test | 4 Std einmalig | 8 Wochen | Test, kein Effekt erwartet | 5 |
| TikTok, ohne Gesicht | 3 Std/Woche | unklar | Lotterie | 6 |
| **Website in sechs Sprachen** | **34.000 Wörter** | **6+ Monate** | **negativ, Spam-Risiko** | **nein** |
| Gekaufte Gastbeiträge, Verzeichnisse | Geld | nie | null | **nein** |

---

## Teil 6: Der 1.9.-Schnitt

Die Store-Sprachen gehen mit 1.3.6 ab dem 01.09.2026 mit. Das ist ein **harter Stichtag für
einen Teil der Liste und für den anderen gar keiner**, und der Unterschied ist der zwischen
iOS und Android.

| | iOS | Android |
| --- | --- | --- |
| Name, Untertitel, Keywords | **an die Version gebunden**, braucht die Einreichung | Listing ist vom Build **getrennt** |
| Beschreibung, Screenshots | mit der Version | jederzeit änderbar |
| Werbetext / Promo | jederzeit | — |
| Neue Sprache im Listing | mit der Version | jederzeit |

**Daraus folgt: das Google-Play-Listing muss nicht auf den 1.9. warten.** Es kann diese Woche
live gehen und ist damit ein Vorlauf-Test für die Texte, bevor sie bei iOS für Wochen
festgeschrieben sind. Android sind zwar nur 25 Prozent der Nutzer, aber es kostet nichts und
liefert zwei Wochen früher Signal.

*Vor der Umsetzung in App Store Connect gegenprüfen, die Regeln dort ändern sich.*

### Was vor dem Build fertig sein muss

- [ ] iOS-Titel, Untertitel und Keywords in **de, en, it, no, pl, sv** — den sechs Sprachen,
      die die App laut `locales/` schon spricht. Diese sechs kosten app-seitig **null**
      Aufwand, weil die Übersetzungen bereits existieren.
- [ ] Screenshots je Sprache, mindestens die ersten zwei mit Text
- [ ] B4 Google-Anmeldung, B5 Einlösung geprüft

### Was ausdrücklich **nicht** in 1.3.6 muss

**Dänisch und Tschechisch verschieben sich auf 1.3.7.** Beide brauchen eine neue Datei in
`locales/`, also Übersetzung plus Test, und das ist in vier Tagen neben allem anderen nicht
seriös. Der Verlust ist gering: Dänemark reagiert bereits auf die englischen Seiten.

**Die Reihenfolge im Auge behalten.** Wenn die ASO-Arbeit mit 1.3.6 rausgeht und B1 (die
Geldzahl) nicht, kommt mehr Volumen in einen Trichter, der weiter bei null Prozent
konvertiert. Das ist nicht schädlich, die Installs bauen die Basis auf, aber die
Trial-Konversion bleibt null bis 1.3.7. **Deshalb sollte B1 die Schlagzeile von 1.3.7 sein und
1.3.7 nicht zwei Monate später kommen.**

---

## Teil 7: Zwölf Wochen, etwa vier Stunden pro Woche

### Diese Woche, vor dem 1.9.

- [ ] iOS-Store-Texte in sechs Sprachen fertigstellen und einfügen (**Stichtag Einreichung**)
- [ ] Google-Play-Listing sofort live, ohne auf den Build zu warten
- [ ] `/zyn-tracker`: Titel auf `ZYN Tracker App: Count Your Pouches Per Day`, Meta-Description
      neu, Absicht gegen Paketverfolgung abgrenzen. **Höchste Wirkung je Stunde im Plan**, und
      völlig unabhängig vom Release.
- [ ] RevenueCat: Monatsabo als Vorauswahl
- [ ] Reddit-Konto anlegen und ab sofort täglich 20 Minuten kommentieren, nichts posten
- [ ] Gerätetests: Einladungs-Einlösung und Teilen-Karte im Spiel

### Wochen 3–4: den Heimmarkt reparieren

- [ ] `/de/snus-aufhoeren` von der Produktseite zum Ratgeber umbauen, siehe `seo-findings.md` C1
- [ ] Zwei neue deutsche Ratgeber: Entzugssymptome, Dauer des Entzugs
- [ ] Dänisch als App- und Store-Sprache vorbereiten, `no.json` als Basis, Ziel 1.3.7
- [ ] Erste Reddit-Beiträge, weiterhin ohne Links

### Wochen 5–8: ausbauen und messen

- [ ] Zwei deutsche Artikel pro Woche, jeder gegen eine belegte Anfrage
- [ ] Englische Antwortseite auf `does zyn have an app`
- [ ] Tschechisch vorbereiten, Ziel 1.3.7
- [ ] Pressekontakt: Gründerstory an fünf österreichische Redaktionen
- [ ] **Woche 8: Zwischenauswertung.** Bewegt sich die deutsche Position von 23 nach oben?
      Steigt die CTR auf `zyn tracker` über null?

### Wochen 9–12: nachlegen, wo es zieht

- [ ] Schwedische Einzelseite auf `sluta snusa` als Test, ohne Umbau von `routes.ts`
- [ ] Weiter deutsche Artikel, Frequenz nach Ergebnis aus Woche 8
- [ ] TikTok nur, wenn Wochen 1–8 unter Plan liegen und Zeit frei ist

---

## Teil 8: Die Rechnung, unverändert

Bei festem Preis und 50/50-Mischung: 1,65 Euro netto je Abo und Monat, also **rund 3.030
zahlende Abos** für 5.000 Euro. Bei 7 Prozent Kündigung sind das 212 neue Zahler im Monat und
rund **16.000 Installs im Monat**, gegen heute etwa 660.

Mit dem Monatsabo als Vorauswahl sinkt das auf rund 2.500 Abos und 13.000 Installs.

| Wegmarke | Installs / Monat | Umsatz / Monat |
| --- | --- | --- |
| Ende September 2026 | ~800 | unverändert |
| Ende Dezember 2026 | 2.000–3.000 | 200–400 € |
| Ende 2027 | 13.000–16.000 | ~5.000 € |

Das Volumen ist und bleibt der Engpass. Alles in Teil 6 dient ihm, außer den Punkten, die
verhindern, dass ankommendes Volumen wieder verloren geht.

---

## Was ich von dir brauche

| Was | Aufwand |
| --- | --- |
| Store-Texte einfügen und Screenshots hochladen, 4–6 Sprachen | ~3 Std einmalig |
| RevenueCat: Monatsabo vorauswählen | 20 Min |
| Reddit-Konto ab sofort warmlaufen lassen | 20 Min am Tag |
| Zwei Gerätetests: Einladungs-Einlösung, Teilen-Karte | je 20 Min |
| Drei Produktfragen: was liegt hinter Pro, steht Push, was macht `pro_blur` | 30 Min |
| Freigabe für die Gründerstory und ein Foto | 1 Std |

Texte, Keywords, Artikel, Pressemail und Reddit-Beiträge schreibe ich.

---

## Offene Prüfpunkte

- [ ] Rechtslage für Nikotinbeutel je Zielland, vor jeder lokalisierten Aussage über
      Verfügbarkeit oder Schädlichkeit. Unterscheidet sich erheblich und bewegt sich.
- [ ] Ob Dänisch und Tschechisch im **App-Store-Konto** überhaupt als Locale angelegt sind.
      Steht nicht in diesem Repo.
- [ ] Ob die drei Trials aus dem August vor der Kündigung je eine Pro-Fläche gesehen haben.
      Beantwortbar über die `$screen`-Ereignisse dieser drei Konten.
