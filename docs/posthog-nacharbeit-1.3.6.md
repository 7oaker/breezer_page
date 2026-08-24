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
sind es fünf: Home oben rechts, die leere Freundessuche, die Erfolgskarte und das
Profil-Abzeichen tragen jetzt ebenfalls den Einladungslink. Vorher verschickten die drei einen
Store-Link und konnten gar keine Empfehlung auslösen.

Jede Kachel, die **bewusstes Einladen** über die Zeit misst, braucht deshalb:

```sql
AND properties.source IN ('onboarding', 'friends_screen', 'referral_screen')
```

- [ ] Kacheln finden, die `referral_shared` benutzen:

```sql
SELECT short_id, name FROM system.insights
WHERE deleted = 0 AND saved = 1
  AND position(toString(query), 'referral_shared') > 0
```

- [ ] In jeder davon entscheiden: misst sie **bewusstes Einladen** (dann Filter setzen) oder
      **alles was rausgeht** (dann `kind` als Aufschlüsselung nutzen und die Beschreibung
      anpassen). Beides ist legitim, nur nicht dieselbe Frage.
- [ ] Beschreibung der Kachel ergänzen: ab wann welche Definition gilt.

Der Filter ist die Arbeit, die Annotation aus Punkt 3 ist nur die Notiz daneben. Eines ersetzt
das andere nicht.

**Neue Werte zur Einordnung:**

| `kind` | `source` | Bedeutung |
| --- | --- | --- |
| `invite` | `onboarding`, `friends_screen`, `referral_screen`, `home_topbar`, `search_empty` | jemand lädt bewusst ein |
| `achievement` | `achievement_card`, `profile_badge` | jemand zeigt etwas her, mit Link dran |

---

## 2. Onboarding-Kacheln: elf Schritte statt zwölf

Der Schritt `referralCheck` existiert nicht mehr, seine zwei Ausgänge sitzen auf
`friendInvite`. Betroffen sind Kacheln, die auf einen der beiden alten Werte filtern.

- [ ] Kacheln finden:

```sql
SELECT short_id, name FROM system.insights
WHERE deleted = 0 AND saved = 1
  AND (position(toString(query), 'referralCheck') > 0
       OR position(toString(query), 'step_total') > 0)
```

- [ ] `step = 'referralCheck'`: läuft ab 1.3.6 leer. Entweder Schritt aus dem Trichter nehmen
      oder den Trichter an der 1.3.6-Annotation abschneiden.
- [ ] `step_total = 12` als Bedingung: verliert alle neuen Nutzer. Auf 11 ändern oder die
      Bedingung streichen.
- [ ] Ein Trichter, der über beide Versionen läuft, mischt zwei verschiedene Abläufe. Sauberer
      ist ein Schnitt am Releasedatum.

Was **nicht** kaputtgeht: `referral_checked` mit `outcome: 'skipped'` feuert weiterhin für
jeden, der weitertippt, ohne "Ich wurde eingeladen" zu benutzen. Diese Zeile bleibt über den
Umbau hinweg vergleichbar.

---

## 3. Annotation für 1.3.6

- [ ] Annotation auf das Releasedatum legen, mit drei Sätzen: `referral_shared` zählt ab jetzt
      fünf Flächen statt zwei, der Onboarding-Trichter hat elf Schritte statt zwölf, die
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
- [ ] `onboarding_step_viewed`: `step_total` ist ab 1.3.6 elf, `referralCheck` kommt nicht mehr
      vor.

---

## 5. Nicht vergessen: Testkonten

- [ ] Falls für den 1.3.6-Gerätetest ein **neues** Konto angelegt wurde: dessen `distinct_id`
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
