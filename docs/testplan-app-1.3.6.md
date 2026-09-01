# Testplan App 1.3.6: Einladen und Verbinden

Stand 24.08.2026. Kürzer als der 1.3.5-Plan, und zwar mit Absicht: der Teil, der bei 1.3.5 am
Gerät geprüft werden musste (steht der richtige Text im Teilen-Fenster), liegt jetzt in
`__tests__/inviteShare.test.js` und läuft bei jedem `npx jest`. Am Gerät bleibt nur, was ein
Test nicht sehen kann.

Was in dieses Release gehört, steht in `react_Breezer/docs/release-1.3.6.md`. Der
Paywall-Split (Quit gegen Track) ist **verschoben** und nicht Teil dieses Tests.

## Vorbedingungen

- [ ] **Prod- oder TestFlight-Build.** Aus einem Dev-Build kommt nichts in PostHog an, der
      Client ist in `__DEV__` komplett aus.
- [ ] **Buildnummer notieren.** EAS vergibt sie remote.
- [ ] **Ein Konto ohne Pro** für den Paywall-Schritt, und **ein frisches Konto** für das
      Onboarding.
- [ ] **Die eigene distinct id** (Appwrite-Dokument-Id) zur Hand haben.

---

## Teil A: am Gerät

### A1. Die vier Teilen-Stellen

Bis 1.3.5 verschickten drei davon den Store-Link, konnten also keine Empfehlung auslösen. In
**jedem** Fenster muss jetzt `breezer.now/invite?ref=DEINNAME` stehen.

- [ ] **A1.1** Home, das Teilen-Symbol oben rechts.
- [ ] **A1.2** Erfolge, einen Erfolg öffnen und teilen. Erwartet: das Bild **und** der Satz in
      Gerätesprache, **samt Erfolgsname** ("1 Woche snusfrei", nicht "1 Week"). Beides war
      vorher fest englisch, das ist der Punkt bei diesem Schritt.
- [ ] **A1.2b** Dazu ein Blick auf die Erfolgskarten selbst: "1 Woche", "5 Dosen",
      "500 Snus". Geldbeträge und Stundenwerte bleiben wie sie sind, die sind sprachneutral.
- [ ] **A1.3** Profil, auf ein Abzeichen tippen und teilen. Der Abzeichen-Text im Fenster
      darüber muss ebenfalls in Gerätesprache stehen, nicht mehr "50 snus logged".
- [ ] **A1.4** Der Einladen-Knopf (Freunde oder Referral-Screen), zur Kontrolle: der hat schon
      vorher funktioniert und darf sich nicht verändert haben.
- [ ] **A1.5** Im Aufhör-Modus auf der Startseite die Box "Mit einem Freund teilen" unter
      dem Zähler. Erwartet: Bild **und** Satz **und** Link. Vorher ging dort nur das nackte
      Bild raus, ohne einen einzigen Zeichen Text.
- [ ] **A1.6** Statistik-Screen, der Teilen-Knopf. Dasselbe: Bild, Satz, Link.

Einmal davon **abbrechen** statt zu teilen. Erwartet: kein Toast, kein Ereignis, keine
Fehlermeldung.

### A2. Die Suche, die niemanden findet

- [ ] **A2.1** Freunde, Suche, einen Namen eingeben, den es nicht gibt (mindestens drei
      Zeichen). Erwartet: unter "Keine Nutzer gefunden" steht jetzt eine Zeile und der
      Einladen-Knopf. Knopf antippen, Teilen-Fenster geht auf, Link stimmt.
- [ ] **A2.2** Suchfeld leeren. Erwartet: der Knopf **verschwindet wieder**. Der dauerhafte
      Einladen-Knopf, der vorher immer unter der Suchmaske stand, ist bewusst weg: das
      Angebot gehört zum Moment der erfolglosen Suche und sonst nirgendwohin. Wer ohne Suche
      einladen will, tut das über den Referral-Screen von der Startseite aus.

### A3. Onboarding, ein Schritt weniger

Frisches Konto, komplett durchlaufen.

- [ ] **A3.1** Der Fortschritt zählt im Track-Pfad **elf** Schritte, nicht zwölf. Im
      Quit-Pfad sind es **zehn**, und elf nur dann, wenn "ich höre schon auf" mit einem
      Datum in der Vergangenheit den `quitDate`-Schritt dazuholt. Alle drei Zahlen sind
      richtig, `stepOrder` hängt am Pfad.
- [ ] **A3.2** Der Einladungsschritt hat zwei Ausgänge: den Einladen-Knopf und darunter die
      Zeile "Ich wurde eingeladen".
- [ ] **A3.3** Auf "Weiter" tippen, ohne die Zeile zu benutzen. Erwartet: **kein**
      Paste-Prompt ("Breezer möchte aus Safari einfügen"). Genau der ist der Grund für den
      Umbau, er erschien vorher bei jedem.
- [ ] **A3.4** Zweiter Durchlauf, diesmal über einen echten Einladungslink installiert: die
      Zeile "Ich wurde eingeladen" antippen. Erwartet: Prompt erscheint (hier ist er
      erklärbar), Freund wird gefunden, Toast, weiter zu den Ergebnissen.
- [ ] **A3.5** Doppeltipp auf die Zeile während sie lädt: sie muss ausgegraut sein und nichts
      doppelt auslösen.

### A3b. Der globale Chat bleibt einsprachig

Ein Blick, kein Aufwand, aber der Punkt mit dem größten Schaden, falls er je kippt.

- [ ] **A3b.1** Mit einer nicht-englischen Gerätesprache in den globalen Chat gehen und die
      grauen Systemnachrichten ansehen ("... just hit 1000. 💀"). Erwartet: **englisch**, egal
      welche Sprache das Gerät hat.

Diese Texte stehen fest verdrahtet in `lib/milestoneMessages.js` und werden beim Posten als
fertiger Text in Appwrite gespeichert. Wer sie übersetzt, füllt einen gemeinsamen Raum mit
Nachrichten, die die meisten nicht lesen können, und zwar dauerhaft, weil beim Lesen nichts
mehr übersetzt wird. Die Erfolgs- und Abzeichennamen sind ein anderes System und werden
absichtlich sehr wohl übersetzt.

### A4. Paywall

- [ ] **A4.1** Eine Paywall öffnen und abbrechen, einmal als **Track**-Nutzer.
- [ ] **A4.2** Dasselbe als **Quit**-Nutzer (Modus umstellen oder zweites Konto).

---

## Teil B: Gegenprüfung in PostHog

Zwei Abfragen. Alles andere an diesem Release ist Verhalten, nicht Messung.

### B1. Melden sich die neuen Teilen-Flächen, und getrennt nach Absicht?

```sql
SELECT properties.source AS quelle, properties.kind AS absicht, count() AS n
FROM events
WHERE event = 'referral_shared'
  AND timestamp > now() - INTERVAL 2 DAY
GROUP BY quelle, absicht
ORDER BY quelle
```

**So sieht richtig aus:** `home_topbar` und `search_empty` mit `absicht = invite`,
`achievement_card`, `profile_badge`, `quit_stats_card` und `stats_screen` mit
`absicht = achievement`, der Einladen-Knopf weiterhin mit `referral_screen` oder `onboarding`.
`friends_screen` darf aus einem 1.3.6-Build **nicht** mehr kommen, den Knopf gibt es dort
nicht mehr.

**Zwei Dinge, die ein Befund wären:**

- Eine Zeile **ohne** `absicht`. Dann teilt eine Stelle an `shareInvite` vorbei.
- Ein Abbruch aus A1, der hier trotzdem auftaucht. Dann würde jedes weggewischte
  Teilen-Fenster als verschickte Einladung gezählt.

**Wichtig für die Auswertung danach:** dieses Ereignis zählt ab 1.3.6 sieben Flächen statt
zwei. Kacheln, die bewusstes Einladen über die Zeit messen, brauchen einen Filter, sonst
steigt die Kurve allein durch die neue Definition. Am 01.09.2026 gesetzt, und zwar auf die
Absicht statt auf eine Liste von Flächennamen:

```sql
AND coalesce(nullIf(toString(properties.kind), ''), 'invite') = 'invite'
```

Das `coalesce` hält die Zeit vor 1.3.6 in der Reihe, wo es die Property noch nicht gibt.
Welche Kachel was bekommen hat, steht in
[`posthog-nacharbeit-1.3.6.md`](posthog-nacharbeit-1.3.6.md) Abschnitt 1.

### B2. Trägt die Paywall jetzt den Modus?

```sql
SELECT properties.mode AS modus, count() AS n
FROM events
WHERE event IN ('paywall_shown', 'paywall_result')
  AND timestamp > now() - INTERVAL 2 DAY
GROUP BY modus
```

**So sieht richtig aus:** `track` und `quit` beide belegt, aus A4.1 und A4.2. Ein einzelner
Wert ist ununterscheidbar davon, dass die Logik immer dasselbe liefert, deshalb sind zwei
Durchläufe nötig und nicht einer.

Leere `modus`-Zeilen von Geräten auf 1.3.5 sind normal, die Property gibt es dort nicht.

### B3. Der Onboarding-Trichter

Keine Abfrage, ein Blick: `onboarding_step_viewed` darf ab dieser Version kein
`step = 'referralCheck'` mehr enthalten.

`step_total` ist dabei **nicht** flach elf, wie hier ursprünglich stand. Das Feld ist
`stepOrder.length`, und die Liste hängt am Pfad: **11** im Track-Pfad, **10** im Quit-Pfad,
und 11 im Quit-Pfad, wenn jemand "ich höre schon auf" mit einem Datum in der Vergangenheit
wählt und dadurch den `quitDate`-Schritt bekommt. Am 01.09.2026 aus dem 1.3.6-Build so
gemessen. Wer auf `step_total = 11` filtert, verliert also still die Quit-ab-heute-Nutzer;
der Trichter gehört auf die `step`-Namen gefiltert.

Kacheln, die auf einen der alten Werte filtern, laufen ab jetzt leer und gehören
nachgezogen. Am 01.09.2026 geprüft: keine tut das, siehe
[`posthog-nacharbeit-1.3.6.md`](posthog-nacharbeit-1.3.6.md) Abschnitt 2.

---

## Nach dem Release, in PostHog selbst

Steht als eigene Liste in [`posthog-nacharbeit-1.3.6.md`](posthog-nacharbeit-1.3.6.md), damit
sie nicht mit diesem Testplan abgehakt wird. Kurz: der `source`-Filter in den
Einladungs-Kacheln, die Onboarding-Kacheln auf elf Schritte, die Annotation und die
Ereignisbeschreibungen.

Der erste Punkt ist der dringende. Ohne ihn steigt die Einladungs-Kurve am Releasetag allein
durch die neue Definition und sieht aus wie ein Erfolg.
