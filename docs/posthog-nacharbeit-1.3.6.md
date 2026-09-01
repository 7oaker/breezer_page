# PostHog-Nacharbeit zu 1.3.6

Offene Liste, angelegt am 24.08.2026. Getrennt vom Testplan, weil das hier **nicht** mit dem
Gerätetest erledigt ist: der Testplan prüft, ob die App das Richtige sendet, diese Liste sorgt
dafür, dass die Kacheln das Richtige daraus machen.

**Warum das nicht warten kann:** zwei der drei Punkte lassen bestehende Kacheln nicht
abstürzen, sondern still ihre Bedeutung ändern. Eine Kurve, die am Releasetag steigt, sieht
aus wie ein Erfolg und ist in Wahrheit eine neue Definition. Wer das erst in vier Wochen
bemerkt, hat vier Wochen lang falsch entschieden.

Die Begründungen im Detail stehen in `react_Breezer/docs/analytics-mapping.md`, Abschnitt
"Was 1.3.6 an den Kacheln ändert".

---

## 1. Einladungs-Kacheln gegen die neue Definition absichern

**Das Wichtigste auf dieser Liste.** `referral_shared` zählte bis 1.3.5 zwei Flächen, ab 1.3.6
sind es sieben: Home oben rechts, die leere Freundessuche, die Erfolgskarte, das
Profil-Abzeichen, die Box unter dem Aufhör-Zähler und der Statistik-Screen tragen jetzt
ebenfalls den Einladungslink. Die ersten drei verschickten vorher einen Store-Link, die
beiden letzten nur ein Bild ohne jeden Text.

Jede Kachel, die **bewusstes Einladen** über die Zeit misst, braucht deshalb:

```sql
AND properties.source IN ('onboarding', 'friends_screen', 'referral_screen')
```

- [x] Kacheln finden, die `referral_shared` benutzen:

```sql
SELECT short_id, name FROM system.insights
WHERE deleted = 0 AND saved = 1
  AND position(toString(query), 'referral_shared') > 0
```

- [x] In jeder davon entscheiden: misst sie **bewusstes Einladen** (dann Filter setzen) oder
      **alles was rausgeht** (dann `kind` als Aufschlüsselung nutzen und die Beschreibung
      anpassen). Beides ist legitim, nur nicht dieselbe Frage.
- [x] Beschreibung der Kachel ergänzen: ab wann welche Definition gilt.

**Erledigt am 01.09.2026.** Drei der sieben Kacheln fassen `referral_shared` an:

| Kachel | Entscheidung |
| --- | --- |
| `5Tchr0Cy` Referral: wer teilt, und von wo | Stufe 3 und 4 auf die Absicht eingeschränkt |
| `6E5g8xom` Der Einladungs-Trichter: wo er reisst | Stufe 2 auf die Absicht eingeschränkt |
| `xVjWRz1t` Wer teilt, und von welcher Flaeche | misst bewusst alles, `kind` als eigene Spalte |

Der Filter ist **nicht** der oben vorgeschlagene `source`-Filter geworden, sondern:

```sql
AND coalesce(nullIf(toString(properties.kind), ''), 'invite') = 'invite'
```

Grund: `kind` sagt die Absicht direkt, statt sie aus einer Liste von Flächennamen
abzuleiten, die bei der nächsten neuen Fläche wieder nachgezogen werden müsste. Das
`coalesce` ist dabei kein Beiwerk. Vor 1.3.6 gibt es die Property nicht, dort ist die
Spalte NULL, und ein blankes `kind = 'invite'` würde jede Zeile vor dem Release aus dem
30- bzw. 90-Tage-Fenster werfen. Der Sprung, den die Liste hier verhindern will, sähe
dann nicht wie ein Anstieg aus, sondern wie ein Absturz. Vor 1.3.6 war jeder Share ein
Invite, deshalb ist `invite` der richtige Ersatzwert.

Der Filter ist die Arbeit, die Annotation aus Punkt 3 ist nur die Notiz daneben. Eines ersetzt
das andere nicht.

**`friends_screen` hört mit 1.3.6 auf zu kommen.** Der dauerhafte Einladen-Knopf auf dem
Freunde-Screen ist ersatzlos weg, an seine Stelle tritt `search_empty`, das nur nach einer
Suche ohne Treffer erscheint. Der Filter oben bleibt trotzdem richtig, er hält die alte
Zeitreihe zusammen. Eine Kachel, die **nur** auf `friends_screen` schaut, läuft ab dem
Release aus und sollte auf `search_empty` erweitert oder abgelöst werden.

**Neue Werte zur Einordnung:**

| `kind` | `source` | Bedeutung |
| --- | --- | --- |
| `invite` | `onboarding`, `referral_screen`, `home_topbar`, `search_empty` | jemand lädt bewusst ein |
| | `friends_screen` | endet mit 1.3.6, siehe unten |
| `achievement` | `achievement_card`, `profile_badge`, `quit_stats_card`, `stats_screen` | jemand zeigt etwas her, mit Link dran |

---

## 2. Onboarding-Kacheln: elf Schritte statt zwölf

Der Schritt `referralCheck` existiert nicht mehr, seine zwei Ausgänge sitzen auf
`friendInvite`. Betroffen sind Kacheln, die auf einen der beiden alten Werte filtern.

- [x] Kacheln finden:

```sql
SELECT short_id, name FROM system.insights
WHERE deleted = 0 AND saved = 1
  AND (position(toString(query), 'referralCheck') > 0
       OR position(toString(query), 'step_total') > 0)
```

- [x] `step = 'referralCheck'`: läuft ab 1.3.6 leer. Entweder Schritt aus dem Trichter nehmen
      oder den Trichter an der 1.3.6-Annotation abschneiden.
- [x] `step_total = 12` als Bedingung: verliert alle neuen Nutzer. Auf 11 ändern oder die
      Bedingung streichen.
- [ ] Ein Trichter, der über beide Versionen läuft, mischt zwei verschiedene Abläufe. Sauberer
      ist ein Schnitt am Releasedatum.

**Geprüft am 01.09.2026, nichts zu tun.** Keine einzige Kachel filtert auf `referralCheck`
oder auf `step_total`. `WwU6n33t` (Onboarding: Abbrueche und Reibung je Schritt) liest die
Schrittnamen aus den Daten statt sie aufzuzählen und trägt den Umbau deshalb von allein:
`referralCheck` verschwindet als Zeile, sobald 1.3.5 ausläuft. Offen bleibt nur der dritte
Punkt, der Schnitt am Releasedatum, solange beide Versionen im selben Fenster liegen.

**Korrektur an der Annahme oben:** `step_total` ist nicht flach elf. Das Feld ist
`stepOrder.length` (`OnboardingModal.jsx`), und die Liste hängt am Pfad. Aus dem
1.3.6-Build gemessen: **11** im Track-Pfad, **10** im Quit-Pfad ohne Datum in der
Vergangenheit, 11 mit. Eine Bedingung auf `step_total = 11` verliert also still die
Quit-ab-heute-Nutzer. Der Trichter gehört auf die `step`-Namen gefiltert, so wie es der
Kommentar an der Trackingstelle selbst sagt.

Was **nicht** kaputtgeht: `referral_checked` mit `outcome: 'skipped'` feuert weiterhin für
jeden, der weitertippt, ohne "Ich wurde eingeladen" zu benutzen. Diese Zeile bleibt über den
Umbau hinweg vergleichbar.

---

## 3. Annotation für 1.3.6

- [ ] Annotation auf das Releasedatum legen, mit drei Sätzen: `referral_shared` zählt ab jetzt
      sieben Flächen statt zwei, der Onboarding-Trichter hat elf Schritte statt zwölf, die
      Paywall-Ereignisse tragen neu `mode`.

Die Annotation erklärt einen Sprung, sie verhindert ihn nicht. Deshalb steht sie hier an
dritter und nicht an erster Stelle.

---

## 4. Ereignisbeschreibungen nachziehen

Damit jemand ohne dieses Repo weiterkommt, so wie es bei 1.3.5 gemacht wurde.

- [ ] `referral_shared`: neue Property `kind` (`invite`, `achievement`), die vier neuen
      `source`-Werte, und der Hinweis auf den Filter aus Punkt 1.
- [ ] `paywall_shown` und `paywall_result`: neue Property `mode` (`track`, `quit`). Leer heißt
      "vor 1.3.6", nicht `track`.
- [ ] `onboarding_step_viewed`: `referralCheck` kommt nicht mehr vor. `step_total` ist ab
      1.3.6 **10 oder 11**, je nach Pfad, und nicht flach elf: siehe die Korrektur in
      Abschnitt 2.

---

## 5. Nicht vergessen: Testkonten

- [x] Falls für den 1.3.6-Gerätetest ein **neues** Konto angelegt wurde: dessen `distinct_id`
      in die Abfrage der Kohorte 210940 eintragen. Sonst stecken die eigenen Testläufe wieder
      in genau den Zahlen, die diesmal beobachtet werden sollen, und bei dieser
      Größenordnung verschiebt ein einziges Testkonto das Ergebnis sichtbar.

SQL-Kacheln filtern das **nicht** von allein, dort muss `AND person_id NOT IN COHORT 210940`
von Hand stehen. Nur Trends, Funnel und Retention nehmen den Projektfilter selbst.

---

## Erledigt, wenn

- Keine Kachel mehr `referral_shared` ohne bewusste Entscheidung über den `source`-Filter
  benutzt.
- Keine Kachel mehr auf `referralCheck` oder `step_total = 12` filtert.
- Die Annotation steht und die drei Ereignisbeschreibungen sind aktuell.

Die beiden Finder-Abfragen oben sind der `system.insights`-Abfrage aus
`react_Breezer/docs/analytics-mapping.md` nachgebaut, die dort am 24.08.2026 tatsächlich
gelaufen ist. Sollte eine davon nicht durchgehen, ist es die Abfrage und nicht der Befund:
dann die betroffenen Kacheln über die vier Boards durchklicken.
