# Engagement, Spiele und die Frage, wofür jemand zahlt

Stand 26.08.2026. Angelegt als Entscheidungsgrundlage, nicht als Umsetzungsplan: am Ende
steht eine Reihenfolge und eine Abbruchbedingung, keine Ticketliste. Die Zahlen stammen aus
PostHog Projekt 249017, Testkonten der Kohorte 210940 sind überall ausgeschlossen.

Der Anlass ist die Frage "brauchen wir ein viertes Spiel und ein Punktesystem, damit die App
nicht langweilig wird". Die kurze Antwort steht in Teil 3. Die lange beginnt damit, dass
**Engagement und Zahlungsbereitschaft zwei verschiedene Probleme sind** und die Spiele nur
das erste betreffen.

---

## Teil 1: Was die drei Spiele heute wirklich tun

`game_finished` sendet erst ab 1.3.5, die Zahlen decken also rund zwei Wochen und nur die
Hälfte der Nutzerbasis ab. Das Verhältnis Läufe je Spieler ist davon unberührt, weil Zähler
und Nenner aus derselben Gruppe kommen.

| Spiel | Läufe | Spieler | Läufe je Spieler | neue Bestwerte |
| --- | --- | --- | --- | --- |
| `pouch-catch` | 26 | 15 | **1,73** | 5 |
| `dosen-stack` | 14 | 9 | **1,56** | 4 |
| `pouch-toss` | 5 | 4 | **1,25** | 1 |

Und die Verteilung über alle Spiele zusammen, je Person:

| Läufe insgesamt | 1 | 2 | 3 | 4 | 6 |
| --- | --- | --- | --- | --- | --- |
| Spieler | 4 | 5 | 7 | 1 | 1 |

**18 Spieler, 45 Läufe, niemand über sechs.** Die Kachel `qu1Pfih5` beschreibt genau diesen
Fall vorab richtig: "bleibt sie bei 1, ist das Spiel eine Neugier und kein Grund, die App
nochmal zu öffnen." Sie ist bei 1,5.

Die Entdeckung funktioniert dagegen gut: 54 von rund 175 Personen auf 1.3.5 haben ein Spiel
geöffnet, das sind 31 Prozent. Die Leute finden die Spiele. Sie kommen nur nicht wieder.

### Die Teilen-Karte ist bei exakt null

| Ereignis | 30 Tage |
| --- | --- |
| `game_finished` | 45 |
| `share_card_opened` | **0** |
| `share_card_shared` | **0** |

Das ist kein schwacher Trichter, das ist ein toter. `sharePose` steht im Manifest-Vertrag in
`games/registry.js`, jedes Spiel liefert also bereits eine Pose für die Karte. Die Funktion
existiert und wird von niemandem erreicht. Bevor irgendetwas Neues an die Spiele gebaut wird,
gehört **eine Person mit einem Gerät zwanzig Minuten an den Ergebnisscreen**, um zu sehen, ob
der Knopf fehlt, unsichtbar ist oder nichts tut. Das ist die billigste offene Frage im
ganzen Dokument.

### Die Paywall aus dem Spiel heraus

`game_play_quota` hat in 30 Tagen **10 Einblendungen bei 7 Personen und null Käufe**
erzeugt. Das ist die einzige bereits laufende Messung der These "Leute zahlen für mehr
Spiel". Sie ist klein, aber sie zeigt in eine Richtung.

---

## Teil 2: Was die Architektur billig macht und was nicht

Aus `react_Breezer/games/README.md` und `registry.js`, beides gelesen:

- **Ein neues Spiel ist ein Ordner plus ein Eintrag.** Runtime, Navigation, Home-Karte und
  Backend bleiben unberührt. Die Naht ist bewusst so gebaut und sie hält.
- **`enabled` ist ein Notausschalter über OTA.** Die App liefert JS über expo-updates. Ein
  Spiel auf `false` zu setzen und ein Update zu veröffentlichen zieht es **ohne
  Store-Release** aus dem Feld. Das ist für Teil 5 wichtiger, als es hier klingt.
- **`skins.js` ist eine reine Präsentationstabelle ohne Asset-Importe.** Mehrere Skins je
  Spiel sind damit die billigste denkbare Freischaltware. Die Struktur dafür steht schon.
- **`maxPlausibleScorePerMinute` steht je Spiel im Registry** und ist dort explizit als "die
  Zahl, die eine Prüfung benutzen würde" dokumentiert. Für eine gemeinsame Währung ist das
  der fertige Normalisierer, damit ein Punkt in `dosen-stack` (90/Minute) nicht neunzigmal so
  viel wert ist wie einer in `pouch-catch` (3,2/Minute).

Was das heißt: **die Behauptung "ein viertes Spiel ist teuer" stimmt hier nicht.** Der
Einwand gegen Pouch Dash ist nicht der Aufwand, sondern die Reihenfolge.

---

## Teil 3: Die Antwort auf die Ausgangsfrage

> Brauchen wir ein viertes Spiel?

**Noch nicht. Die Meta-Ebene ist das Experiment, das Spiel ist der Inhalt.**

Drei Spiele werden je 1,5 Mal gespielt. Ein viertes Spiel dazuzustellen erzeugt vier Spiele,
die je 1,5 Mal gespielt werden. Der Engpass ist nicht die Vielfalt der Mechaniken, sondern
dass es keinen Grund gibt, zurückzukommen. Die Analyse in der Vorlage sagt das selbst
("hybrid casual... pure hypercasual tends to have weak long-term retention"), zieht daraus
aber die umgekehrte Reihenfolge: erst das Spiel, dann "then add" die Progression.

Für Breezer ist das falsch herum, aus einem einzigen Grund: **wenn Münzen, Freischaltungen
und eine Bestenliste die Läufe je Spieler auf drei bereits vorhandenen Spielen mit 31 Prozent
Entdeckung nicht heben, dann hebt sie ein viertes Spiel auch nicht.** Und die Meta-Ebene ist
ein Zähler, ein Shop-Screen und ein paar Farbtabellen. Pouch Dash ist ein Endless Runner mit
Spurwechsel, prozeduralen Hindernissen und einer Schwierigkeitskurve.

### Die Abbruchbedingung

> **Läufe je Spieler über 4, vier Wochen nach dem Start der Meta-Ebene.**

Direkt ablesbar aus `game_finished.runs`, das bereits einen laufenden Zähler je Spieler
trägt. Es braucht dafür **keine neue Instrumentierung**, nur die Kachel `qu1Pfih5`.

- **Trigger feuert** → Pouch Dash bauen, die Meta-Ebene trägt.
- **Trigger feuert nicht** → die Spiele sind eine Nebensache und bleiben eine. Dann geht die
  Zeit in Teil 4, und das wäre ein sauberes, billig gekauftes Nein.

Das ist die ehrliche Version von "ich bin nicht sicher": nicht raten, sondern die Frage für
etwa zwei Wochen Arbeit statt für zwei Monate beantworten.

---

## Teil 4: Spiele lösen das Umsatzproblem nicht

Das ist der Teil, der über allem anderen steht, und er widerspricht dem Vorschlag "mit Pro
kannst du mehr freischalten".

**Niemand abonniert einen Nikotin-Tracker wegen Minispielen.** Der Wettbewerb für ein
Minispiel sind kostenlose Spiele, davon gibt es unendlich viele und sie sind besser
finanziert. Kosmetik monetarisiert über Einmalkäufe in Spielen mit Millionen Spielern, nicht
über ein Abo in einer App mit dreihundert Nutzern. Und die These ist hier bereits gemessen:
`game_play_quota`, zehn Einblendungen, null Käufe.

Dazu die harte Zahl aus dem August: **drei Trials gestartet, alle drei in der Gratiswoche
gekündigt, dazu drei laufende Abos verloren.** Ein Spiel rettet keinen Trial. Eine persönliche
Zahl rettet einen Trial.

### Wofür in dieser App tatsächlich jemand zahlen würde

Sortiert danach, wie gut es zu den vorhandenen Daten passt.

**1. Die Geldzahl. Das ist mit Abstand die stärkste, und sie ist halb gebaut.**

Wer 15 Dosen am Tag nimmt, gibt bei rund 0,35 Euro je Dose etwa **160 Euro im Monat** aus.
Eine App, die sagt "du bist von 15 auf 11 am Tag runter, das sind 42 Euro im Monat zurück",
rechtfertigt 2,99 um den Faktor fünfzig. Das ist kein Marketingtrick, das ist die tatsächliche
Größenordnung.

Und jetzt die Zahl, die weh tut: **`stats_time_shift`, das Gate auf den Zeitraum in der
Statistik, hat in 30 Tagen neun Einblendungen erzeugt.** Neun. Der Bildschirm, auf dem die
eigene Geschichte liegt, wird praktisch nicht erreicht. Das ist das größte ungenutzte
Pro-Argument im gesamten Datensatz.

**2. Tiefe der Historie.** Kostenlos die letzten 7 Tage, mit Pro alles. Das Standardmodell
jeder Tracker-App, und zwar aus einem guten Grund: es ist das einzige Gate, dessen Wert mit
der Zeit in der App **wächst** statt zu schrumpfen. Es macht Kündigen außerdem teuer, weil man
den Blick auf die eigene Geschichte verliert.

**3. Aufhör-Fortschritt und Gesundheit.** 19 von 88 Onboarding-Abschlüssen wählen den
Quit-Modus, das sind 22 Prozent. Der Health-Screen hatte in 14 Tagen **13 Personen**. Ein
ganzer Produktpfad, den niemand sieht.

**4. Freunde.** 11 Anfragen, 10 beantwortet in 30 Tagen. Klein, aber die Annahmequote liegt
über 90 Prozent. Die einzige Funktion, deren Wert von der Anwesenheit anderer Leute kommt.

### Was Pro in den Spielen bekommt

Genau eine Sache, und sie ist keine Mauer:

> **Pro verdoppelt die Münzen.**

Ein Multiplikator, kein Gate. Er blockiert niemanden, er fühlt sich für Leute gut an, die
schon zahlen, und er stellt Breezer nicht in den Wettbewerb mit kostenlosen Spielen. Alles
andere in der Meta-Ebene bleibt frei.

**Die Aufteilung in einem Satz: die Spiele machen die App öffnenswert, die Daten machen sie
zahlenswert.**

---

## Teil 5: Store-Risiko

Die Einschätzung aus der Vorlage stimmt in der Richtung. Drei Punkte sind zu korrigieren und
vier fehlen, und die fehlenden wiegen schwerer als das Spieldesign.

### Korrektur: `pouch-toss` ist bereits richtig gerahmt

Die Vorlage bewertet "Beutel in den Mund werfen" als hohes Risiko. Das trifft auf das
vorhandene Spiel nicht zu. Aus `pouch-toss/skins.js`, wörtlich:

> "every pouch you put back in the tin is one you did not take"

Man wirft die Beutel **in die Dose zurück**, nicht in einen Mund. Die Rahmung ist ausdrücklich
Schadensminderung und damit das Gegenteil des Problemfalls. Das ist das Vorbild für alles
Weitere, kein Sanierungsfall.

### Was in der Vorlage fehlt

**1. Das eigentliche Risiko ist die Blockade des Releases, nicht die Ablehnung des Spiels.**
Eine Ablehnung nach Richtlinie 1.4.3 hält nicht das Spiel auf, sondern das gesamte Binary.
Bei einem Ein-Personen-Projekt mit ungefähr einem Build im Monat können daraus vier bis sechs
Wochen werden, in denen **nichts** ausgeliefert wird, auch nicht die Paywall-Arbeit aus Teil 4.
Daraus folgt eine harte Regel:

> **Ein neues Spiel geht nie im selben Build wie eine kritische Korrektur raus.**

**2. Der Notausschalter existiert bereits und ist besser als bei den meisten Apps.**
`enabled` im Registry plus expo-updates heißt: schlimmster Fall ist nicht "App wochenlang
blockiert", sondern "Spiel in einer Stunde weg, ohne Store-Release". Das gehört in die
Review-Notes geschrieben, wenn ein Spiel eingereicht wird. Es verschiebt das Risiko spürbar.

**3. Die Altersfreigabe ist ein Sichtbarkeitspreis, nicht nur ein Compliance-Thema.** Mehr
Nikotin-Bildsprache, um ein Spiel zu füttern, kann die Einstufung bei Tabakbezügen nach oben
schieben, und das verengt die Platzierung im Store. Das arbeitet direkt gegen die ASO-Arbeit
und ist ein echter Preis, der in der Vorlage nicht vorkommt.

**4. Listing, Screenshots und Spiel müssen dieselbe Geschichte erzählen.** Breezer ist beides,
Konsum-Tracker und Aufhör-Werkzeug. In einem Review ist die Aufhör-Rahmung die Verteidigung.
Alles, was die App so aussehen lässt, als feiere sie Konsum, schwächt diese Verteidigung für
die **ganze App**, nicht nur für das Spiel.

### Die Regeln, kurz

- [ ] **Kein Konsum-Verb in einem Spiel.** Kein "use", "take", "consume". Beutel sind Objekte,
      keine Dosen im Sinne von Dosierung.
- [ ] **Bestenlisten tragen Punkte, nie Beutel.** Ist bereits so, `score` steht im Manifest.
- [ ] **Keine echten Marken in Spielinhalten.** Kein ZYN, VELO, Siberia in Assets oder Namen.
- [ ] **Neutraler Sammelname.** "Breezer Arcade", nicht "Snus Games".
- [ ] **Die Dosen-Rahmung von `pouch-toss` als Vorbild behalten.**

### Ein Randfall, der auch die Wachstumsarbeit betrifft

Markenbegriffe im **Keyword-Feld des Stores** sind etwas anderes als Markenbegriffe in einem
Artikel auf der eigenen Website. Beschreibende, redaktionelle Nutzung auf breezer.now ist
weitgehend unbedenklich, ein fremdes Markenzeichen im iOS-Keyword-Feld kann dagegen eine
Beschwerde des Rechteinhabers auslösen. Das ist eine Korrektur an meinem eigenen früheren
Vorschlag, `zyn` in das Keyword-Feld zu schreiben: auf der Website ja, im Keyword-Feld
vorsichtig und im Zweifel nicht.

### Risikoeinschätzung, korrigiert

| Vorhaben | Risiko |
| --- | --- |
| Meta-Ebene: Münzen, Skins, Bestenliste mit Punkten | 🟢 sehr gering |
| `dosen-stack` | 🟢 gering |
| `pouch-toss` in der heutigen Dosen-Rahmung | 🟢 gering |
| `pouch-catch` | 🟡 mittel, hängt am Wortlaut des Ziels |
| Pouch Dash ohne Konsum-Mechanik | 🟢 gering |
| Ein Spiel im selben Build wie die Paywall-Arbeit | 🔴 hoch, aus Terminsicht |
| Bestenliste über konsumierte Beutel | 🔴 sehr hoch |
| Echte Nikotinmarken in Spielinhalten | 🔴 sehr hoch |

---

## Teil 6: Die Meta-Ebene, konkret

Nur bauen, was die Abbruchbedingung aus Teil 3 prüfbar macht. Alles andere wartet auf das
Ergebnis.

- [ ] **Gemeinsame Währung über alle Spiele.** Münzen je Lauf, normalisiert über
      `maxPlausibleScorePerMinute` aus dem Registry, damit ein Punkt in `dosen-stack` nicht
      neunzigmal so viel wert ist wie einer in `pouch-catch`.
- [ ] **Tagesbonus auf den ersten Lauf.** Der erste Lauf des Tages zahlt dreifach. Das ist der
      stärkste und billigste Rückkehr-Mechanismus in dieser Art Spiel, und er ist allein
      genommen schon ein gültiger Test der These.
- [ ] **Serie.** Aufeinanderfolgende Tage mit mindestens einem Lauf. Knüpft an das
      Streak-Konzept an, das auf der Tracking-Seite ohnehin existiert.
- [ ] **Skins als Freischaltware.** `skins.js` ist bereits eine reine Präsentationstabelle,
      mehrere Einträge je Spiel sind der billigste denkbare Inhalt.
- [ ] **Wochen-Bestenliste, Punkte.** Der Wochenreset existiert bereits über `week_result`
      mit `first_of_week`.
- [ ] **Pro verdoppelt die Münzen.** Der einzige Pro-Bezug in der ganzen Ebene.
- [ ] **Vorher: die Teilen-Karte am Gerät prüfen.** 45 Läufe, null Öffnungen. Zwanzig Minuten.

Was **nicht** in die erste Runde gehört, obwohl es in der Vorlage steht: Missionen,
Kombosysteme, Umgebungen, Charaktere, Freundes-Bestenlisten, tägliche Herausforderungen. Das
ist die Ausbaustufe für den Fall, dass der Trigger feuert. Vorher ist es Arbeit an einer
unbeantworteten Frage.

---

## Teil 7: Reihenfolge

Der Preis bleibt bei 2,99 und 19,99. Damit hängt der ganze Weg zu 5.000 Euro an Volumen und
Konversion, und das schärft die Reihenfolge eher, als dass es sie lockert.

| # | Was | Warum hier | Aufwand |
| --- | --- | --- | --- |
| 1 | Geldzahl und Historien-Gate sichtbar machen | das ist "etwas, wofür sie zahlen", und es ist halb gebaut | mittel |
| 2 | Trial-Rettung mit persönlicher Zahl an Tag 5 | drei von drei Trials starben genau dort | klein |
| 3 | Google-Anmeldung reparieren | 56 % Abschluss gegen 85 % bei Apple, siehe unten | klein |
| 4 | Meta-Ebene auf den drei vorhandenen Spielen | billiges Experiment mit klarer Abbruchbedingung | mittel |
| 5 | Pouch Dash | **nur wenn der Trigger aus Teil 3 feuert** | groß |

### Zu Punkt 3, weil die Zahl neu ist

| Methode | `auth_started` | abgeschlossen | Quote |
| --- | --- | --- | --- |
| Apple | 62 | 53 | **85 %** |
| Google | 66 | 37 | **56 %** |
| E-Mail | 23 | 28 | (Login feuert auf anonymer Id, nicht vergleichbar) |

Google verliert 29 Anmeldungen in 14 Tagen gegen die Apple-Quote. Das ist keine Strategie,
das ist ein Fehler, und es ist die billigste Zahl in dieser ganzen Liste.

---

## Was hier bewusst nicht steht

Eine Empfehlung, ob Pouch Dash am Ende gebaut wird. Die Frage ist mit den heutigen Daten nicht
zu beantworten und mit zwei Wochen Meta-Ebene schon. Alles, was dieses Dokument dazu tut, ist
die Frage billig zu machen.

Und eine zweite Sache: **die Meta-Ebene ist ein Retentionsexperiment, kein Umsatzplan.** Wenn
sie funktioniert, öffnen die Leute die App öfter, sehen die Paywall öfter und die Historie
wird ihnen mehr wert. Der Umsatz kommt trotzdem aus Teil 4, nicht aus den Münzen.
