# Testplan App 1.3.5: Analytics verifizieren

Stand 20.08.2026. Zwei Teile: **A** sind Klaus' Schritte am Gerät, **B** ist die
Gegenprüfung in PostHog, ob die Daten so ankommen wie geplant. Teil A ohne Teil B ist
wertlos, weil man am Gerät nur sieht, dass die App funktioniert, und nicht, ob das Event
richtig geschnitten ist.

Der Code liegt im App-Repo `react_Breezer`, committet auf `feature/posthog-analytics`.
Die Referenz dazu:

- `docs/analytics-changes-1.3.5.md` ist die Differenz für genau dieses Release
- `docs/analytics-events.md` die vollständige Eventliste
- `docs/referral-measurement.md` der Befund und die Entscheidungen dahinter
- `docs/revenuecat-identity-linking.md` der RevenueCat-Teil

PostHog-Projekt: `eu.posthog.com/project/249017`.

## Vorbedingungen

- [ ] **Prod- oder TestFlight-Build.** Aus einem Dev-Build kommt nichts an, der Client ist
      in `__DEV__` komplett deaktiviert. Wer im Simulator testet, testet nichts.
- [ ] **Buildnummer notieren.** EAS vergibt sie remote, die Werte in `Info.plist` und
      `build.gradle` sagen nichts. Jede Abfrage unten filtert darauf.
- [ ] **Die eigene distinct id kennen.** Das ist die Appwrite-Dokument-Id des Nutzers, zu
      finden in der Appwrite-Konsole in der Users-Collection. In PostHog ist das die
      distinct id der Person. Damit lassen sich die eigenen Testevents von allem anderen
      trennen.
- [ ] **Zweites Gerät oder zweiter Account.** Für den Referral-Teil unvermeidbar, weil ein
      Selbst-Invite abgefangen wird und ein eigener Zweig ist.
- [ ] **Analytics-Toggle an.** Einstellungen, "Nutzungsdaten teilen". Steht per Default an,
      aber wenn vorher getestet wurde, kann er aus sein.

---

## Teil A: Schritte am Gerät

### A1. RevenueCat (das Riskanteste zuerst)

Neu ist, dass `Purchases.configure()` beim Start auf Modulebene läuft statt im Effect.
Wenn hier etwas schiefgeht, ist die Kasse betroffen, nicht nur die Messung.

- [ ] **A1.1** App frisch starten (vorher aus dem App-Switcher werfen). Sie darf nicht
      hängen und nicht abstürzen. Wenn der Alert "Error configure RC" kommt, fehlt der
      API-Key im Build, dann stimmt die EAS-Env nicht.
- [ ] **A1.2** Einloggen. Danach im RevenueCat-Dashboard unter Customers nach dem neuesten
      Eintrag sehen. Erwartet: die Id ist die Appwrite-Dokument-Id, **nicht**
      `$RCAnonymousID:...`.
- [ ] **A1.3** Mit einem Account **mit aktivem Abo** ausloggen und wieder einloggen.
      Erwartet: Pro bleibt freigeschaltet, ohne die App neu zu starten. Ein Pro-Feature
      antippen (zum Beispiel Stats-Zeitverschiebung), es darf keine Paywall kommen.
- [ ] **A1.4** Ausloggen und **nicht** wieder einloggen, App neu starten. Erwartet: kein
      Absturz. `logOut()` wirft, wenn der Client schon anonym ist, das ist abgefangen,
      aber genau das will man einmal gesehen haben.
- [ ] **A1.5** Falls jemand mit Referral-Pro greifbar ist (Pro aus der Empfehlung, nicht
      aus einem Abo): einloggen und prüfen, dass Pro **nicht** verlorengeht. Das ist der
      Fall, den die Umstellung hätte kaputtmachen können.

### A2. Referral, geparkter Link (der Akquise-Pfad)

Braucht ein Gerät **ohne** installierte App. Wenn die App drauf ist, vorher löschen.

- [ ] **A2.1** Auf Gerät A den Invite-Link teilen, aus dem Onboarding-Schritt oder vom
      Referral-Screen.
- [ ] **A2.2** Auf Gerät B den Link öffnen. Die Seite `breezer.now/invite` schreibt den
      Usernamen in die Zwischenablage und leitet in den Store.
- [ ] **A2.3** Installieren, öffnen, **neu registrieren**.
- [ ] **A2.4** Im Onboarding beim Referral-Schritt auf "prüfen" tippen. Erwartet: Toast
      mit `@username` und Freundschaftsanfrage bei A.
- [ ] **A2.5** Denselben Schritt einmal mit **Überspringen** durchspielen (dritter
      Account oder erneut nach Neuinstallation). Das ist ein eigener Messwert.

### A3. Referral, Live-Deeplink (kein Akquise-Pfad)

Gerät B hat die App jetzt und ist eingeloggt.

- [ ] **A3.1** Den Invite-Link eines **dritten** Nutzers auf Gerät B antippen, während die
      App läuft. Erwartet: Freund wird hinzugefügt, Toast erscheint.
- [ ] **A3.2** Den **eigenen** Link antippen. Erwartet: nichts passiert, keine
      Selbstfreundschaft.
- [ ] **A3.3** Einen Link mit einem Usernamen antippen, den es nicht gibt. Von Hand bauen
      und aus den Notizen antippen: `breezerapp://invite?ref=gibtesnicht` geht direkt in
      die App, `https://breezer.now/invite?ref=gibtesnicht` nimmt den Umweg über die Seite.
      Beide Formen werden gelesen. Erwartet: nichts passiert, kein Absturz.

Wichtig, damit kein Fehlalarm entsteht: **derselbe Link feuert pro App-Start nur einmal.**
Der Handler merkt sich verarbeitete Links, sonst würde der Kaltstart-Link zusammen mit dem
Listener jede Zahl verdoppeln. Zum Wiederholen die App aus dem App-Switcher werfen.

### A4. Spiele

- [ ] **A4.1** Erster Run in dieser Woche in einem Spiel. Der Ergebnisscreen darf "New
      Best" feiern, das ist Absicht.
- [ ] **A4.2** Zweiten Run spielen und den ersten **schlagen**.
- [ ] **A4.3** Dritten Run spielen und **darunter** bleiben.
- [ ] **A4.4** Share-Karte öffnen und wieder **abbrechen**, ohne zu teilen.
- [ ] **A4.5** Share-Karte öffnen und **wirklich teilen** (an sich selbst, egal wohin).

### A5. Freunde

- [ ] **A5.1** Anfrage über die **Suche** stellen.
- [ ] **A5.2** Anfrage über ein **Profil** stellen (aus dem Ranking oder dem Feed heraus).
- [ ] **A5.3** Anfrage über die **Freundesliste eines Freundes** stellen.
- [ ] **A5.4** Auf dem anderen Account eine Anfrage **annehmen** und eine **ablehnen**.

### A5b. Paywall-Einstiege (neu am 20.08.2026)

Beim Gerätetest kam heraus, dass die Banner-Leiste `SubscribeSection` das Paywall direkt
geöffnet hat, an der Instrumentierung vorbei. Fünf Screens, kein einziges Event. Das ist
gefixt, muss aber geprüft werden.

**Braucht einen Account ohne Pro.** Auf einem Pro-Account wird die Leiste gar nicht
gerendert, du kannst sie also mit dem Hauptaccount nicht testen. Nimm den zweiten
Testaccount, den du für den Referral-Teil ohnehin brauchst.

- [ ] **A5b.1** Auf dem Home-Screen unten auf die Banner-Leiste tippen. Paywall öffnet,
      wieder schliessen.
- [ ] **A5b.2** Dasselbe auf einem zweiten Screen, zum Beispiel Stats oder Health.
- [ ] **A5b.3** Auf der Abo-Vergleichsseite (Details, Abo-Status) unten auf
      "kostenlos testen" tippen. Paywall öffnet, wieder schliessen.

Drei Dinge, die dabei kein Fehler sind:

- **Die Leiste im Feed erscheint erst, wenn genug Beiträge geladen sind.** Wer sie dort
  sofort sucht, findet sie nicht. Weiter scrollen.
- **Zwischen Tap und Paywall liegt jetzt eine Entitlement-Prüfung.** Auf einer langsamen
  Verbindung kann das einen Moment dauern, es gibt keinen Spinner. Kommt statt des Paywalls
  ein Fehler-Toast, ist die Prüfung gescheitert, praktisch nur offline und ohne Cache.
- **Auf einem Account mit Pro aus einer Empfehlung passiert beim Tap nichts**, und die
  Leiste verschwindet danach. Das ist richtig so: die Prüfung erkennt das bestehende Pro
  und öffnet kein Paywall für etwas, das schon bezahlt ist. In PostHog kommt dann bewusst
  kein Event an.

### A6. Opt-out

- [ ] **A6.1** Einstellungen, "Nutzungsdaten teilen" **ausschalten**.
- [ ] **A6.2** Ein paar Screens öffnen, einen Pouch loggen, ein Spiel spielen.
- [ ] **A6.3** Wieder einschalten.

---

## Teil B: Gegenprüfung in PostHog

Zwischen Aktion und Sichtbarkeit liegen ein paar Minuten, das SDK sendet gebatcht.
Ereignisse aus dem Hintergrund kommen teils erst beim nächsten App-Start.

Alle Abfragen unten auf die Testperson einschränken, sonst mischt sich der Rest der
Nutzer darunter:

```sql
WHERE distinct_id = '<appwrite-dokument-id>'
```

### B1. Kommt überhaupt etwas an, und aus dem richtigen Build?

```sql
SELECT event,
       properties.$app_version AS version,
       properties.$app_build   AS build,
       count() AS n,
       max(timestamp) AS zuletzt
FROM events
WHERE timestamp > now() - INTERVAL 2 DAY
  AND event IN ('referral_checked', 'referral_shared', 'friend_request_sent',
                'friend_request_answered', 'game_finished', 'share_card_opened',
                'share_card_shared')
GROUP BY event, version, build
ORDER BY n DESC
```

**So sieht richtig aus:** alle Events, die in Teil A ausgelöst wurden, tauchen auf, und
`version` ist 1.3.5. Steht dort 1.3.4, wurde der falsche Build getestet.

### B2. Referral: stimmen die Zweige?

```sql
SELECT properties.source  AS quelle,
       properties.outcome AS ergebnis,
       properties.parked  AS geparkt,
       count() AS n
FROM events
WHERE event = 'referral_checked'
  AND timestamp > now() - INTERVAL 2 DAY
GROUP BY quelle, ergebnis, geparkt
ORDER BY n DESC
```

**So sieht richtig aus:**

| aus Schritt | quelle | ergebnis | geparkt |
| --- | --- | --- | --- |
| A2.4 | `onboarding` | `redeemed` | nicht gesetzt |
| A2.5 | `onboarding` | `skipped` | nicht gesetzt |
| A3.1 | `deeplink` | `redeemed` | `false` |
| A3.2 | `deeplink` | `self_invite` | `false` |
| A3.3 | `deeplink` | `inviter_not_found` | `false` |

`geparkt` ist bei `onboarding` **nicht gesetzt** und nicht `false`. Wer danach filtert,
muss "is not set" nehmen. `stored_for_login` erscheint nur, wenn der Link ankommt, während
niemand eingeloggt ist, also im Regelfall gar nicht in diesem Durchlauf.

**Ein `error` in dieser Liste ist ein Befund**, kein Rauschen. Dann ist im Handler eine
Ausnahme geflogen, und es lohnt sich, in Sentry nachzusehen.

### B3. Akquise: steht sie an der richtigen Person, und nur dort?

```sql
SELECT properties.acquired_via AS herkunft, count() AS personen
FROM persons
GROUP BY herkunft
```

**So sieht richtig aus:** der in A2.3 neu registrierte Account hat `referral`. Der
Bestandsaccount aus A3.1, der nur einen Link angetippt hat, hat **weiterhin** seinen alten
Wert, meistens gar keinen. Genau das war der Fehler, der im Review gefunden wurde: vorher
hätte A3.1 die Herkunft überschrieben.

Ein normal registrierter Testaccount ohne Referral hat `organic`.

**Wichtig für alles Spätere:** `herkunft is not set` heisst **nicht** `organic`, sondern
"hat sich vor 1.3.5 registriert". Die allermeisten Personen im Projekt fallen darunter, es
gibt kein nachträgliches Setzen. Für Kohorten immer auf `acquired_via is set` filtern.

Zusatzprüfung von Hand, weil sie genau den Review-Fix betrifft: die Person mit
`acquired_via` in PostHog öffnen und schauen, dass ihre distinct id die
Appwrite-Dokument-Id ist und keine anonyme UUID. Die Property wird bewusst erst nach
`identify()` geschrieben. Hängt sie an einem anonymen Profil, ist die Warteschlange in
`lib/analytics.js` nicht gelaufen.

### B4. Spiele: ist `week_result` richtig geschnitten?

```sql
SELECT properties.game        AS spiel,
       properties.week_result AS ergebnis,
       properties.runs        AS runs,
       properties.score       AS score,
       timestamp
FROM events
WHERE event = 'game_finished'
  AND timestamp > now() - INTERVAL 2 DAY
ORDER BY timestamp
```

**So sieht richtig aus:** A4.1 ergibt `first_of_week`, A4.2 `new_best`, A4.3
`below_best`. `runs` zählt bei jedem Run um eins hoch.

**Zwei Dinge, die nicht vorkommen dürfen:**

- Die Property `is_week_best` darf **nirgends** auftauchen. Sie wurde ersetzt. Falls dafür
  schon eine Insight oder Property-Definition angelegt wurde: löschen.
- `week_result` darf nicht bei jedem Run `first_of_week` sein. Dann greift der
  Wochenschlüssel nicht.

Fehlen `week_result` und `runs` bei einem Event komplett, ist der lokale Schreibvorgang
gescheitert. Das Event feuert absichtlich trotzdem. Einmal ist ein Ausreisser, regelmässig
wäre ein Bug.

### B5. Share-Karte: sind es zwei getrennte Schritte?

```sql
SELECT event, properties.game, count() AS n
FROM events
WHERE event IN ('share_card_opened', 'share_card_shared')
  AND timestamp > now() - INTERVAL 2 DAY
GROUP BY event, properties.game
```

**So sieht richtig aus:** zwei `share_card_opened` (A4.4 und A4.5), aber nur **ein**
`share_card_shared`. Das Abbrechen in A4.4 darf nicht als geteilt zählen. Wenn beide Zahlen
gleich sind, zählt der Abbruch mit, und der Funnel der Karte ist wertlos.

### B6. Freunde: trennt `source` die Flächen?

```sql
SELECT event,
       coalesce(properties.source, properties.action) AS wert,
       count() AS n
FROM events
WHERE event IN ('friend_request_sent', 'friend_request_answered')
  AND timestamp > now() - INTERVAL 2 DAY
GROUP BY event, wert
```

**So sieht richtig aus:** `search`, `profile` und `friends_of_friend` je einmal aus A5,
dazu `confirmed` und `declined` aus A5.4.

Zur Einordnung, damit später niemand darüber stolpert: die zwei Anfragen, die aus dem
Invite-Flow entstehen, laufen **nicht** als `friend_request_sent`, sondern als
`referral_checked` mit `outcome: redeemed`. Die Summe hier ist also nicht die Summe aller
Anfragen.

### B6b. Paywall: meldet sich jetzt jede Fläche?

```sql
SELECT properties.source AS quelle, event, count() AS n
FROM events
WHERE event IN ('paywall_shown', 'paywall_result')
  AND timestamp > now() - INTERVAL 2 DAY
GROUP BY quelle, event
ORDER BY quelle, event
```

**So sieht richtig aus:** `subscribe_banner_home` aus A5b.1, ein zweiter
`subscribe_banner_*` aus A5b.2, `subscription_page` aus A5b.3. Pro Quelle zwei Zeilen mit
derselben Zahl, `paywall_shown` und `paywall_result`. Deshalb steht `event` mit in der
Gruppierung, sonst zählt jede Öffnung doppelt. Ein `shown` ohne passendes `result` heisst,
das Paywall ging auf und die Antwort kam nie zurück.

Die vollständige Liste der Werte, die diese beiden Events ab 1.3.5 tragen können, damit
beim Abhaken klar ist, was zu welcher Fläche gehört:

| Wert | Wo |
| --- | --- |
| `subscribe_banner_home` | Startseite. Der Screen dazu heisst in `$screen` `(tabs)/press`, nicht home |
| `subscribe_banner_stats` | Statistik |
| `subscribe_banner_feed` | Feed, erst ab genug geladenen Beiträgen |
| `subscribe_banner_achievements` | Erfolge |
| `subscribe_banner_health` | Gesundheit |
| `subscription_page` | Knopf auf der Abo-Vergleichsseite |

Dazu die bestehenden Gates, die schon vorher gemeldet haben: `onboarding`,
`home_navigation`, `stats_time_shift`, `health_improvement`, `health_symptom`,
`achievement_locked`, `promotion_card`, `chat_image`, `game_play_quota`, `pro_blur`,
`unknown`. Die tauchen im Test nur auf, wenn du sie unterwegs ausgelöst hast.

**Zwei Dinge, die ein Befund wären:**

- Ein blankes **`subscribe_banner`** ohne Screen-Suffix. Dann gibt es eine sechste
  Render-Stelle, die keine `source` mitgibt.
- Ein Paywall, das sich am Gerät geöffnet hat, aber hier gar nicht auftaucht. Genau so ist
  die Lücke ursprünglich aufgefallen: der Restore lief über ein Paywall, das kein Event
  erzeugt hat.

Zur Einordnung für später: alle Conversion-Zahlen von **vor dem 20.08.2026** haben einen zu
kleinen Nenner, weil die sichtbarste Upsell-Fläche der App nicht gemessen wurde. Die echte
Conversion war schlechter als sie aussah. Alte und neue Quote nicht direkt vergleichen.

Und eine Grenze, die bleibt: **Einblendungen werden nicht gezählt**, es gibt kein
Impression-Event. Die Frage "welche Fläche verkauft" lässt sich damit als Anteil an den
Taps beantworten, nicht als Conversion je Einblendung. Die fünf Banner-Werte stehen
ausserdem nicht auf derselben Basis, siehe die Feed-Einschränkung in A5b.

### B7. Teilen: melden sich die drei Knöpfe getrennt?

```sql
SELECT properties.source AS quelle, count() AS n
FROM events
WHERE event = 'referral_shared'
  AND timestamp > now() - INTERVAL 2 DAY
GROUP BY quelle
```

**So sieht richtig aus:** `onboarding`, `friends_screen` oder `referral_screen`, je
nachdem wo geteilt wurde. Der Wert **`invite_button` darf nicht mehr vorkommen**. Wenn
doch, gibt es einen vierten Einbauort, der die Property nicht setzt.

Das ist die Frage, an der der ganze Referral-Befund hängt: teilt jemand ausserhalb des
Onboardings. Bisher liess sich das nur aus Zeitstempeln erraten.

### B8. RevenueCat: sind Kunde und Person derselbe Schlüssel?

```sql
SELECT countIf(id LIKE '$RCAnonymousID:%')       AS anonym,
       countIf(NOT (id LIKE '$RCAnonymousID:%')) AS identifiziert
FROM revenuecat.customers
```

Am 16.08.2026 stand das auf 3977 zu 0. **So sieht richtig aus:** `identifiziert` ist
grösser als null und wächst mit dem Rollout. Die Testaccounts müssen darunter sein.

Danach die eigentliche Probe, ob der Join funktioniert:

```sql
SELECT c.id, p.properties.acquired_via, p.properties.country
FROM revenuecat.customers AS c
JOIN persons AS p ON p.distinct_id = c.id
LIMIT 20
```

Wenn das Zeilen liefert, ist erreicht, was vorher unmöglich war: Umsatz an Verhalten
gebunden. Falls der Join in dieser Form nicht durchgeht, ist die Warehouse-Tabelle anders
verknüpft, dann reicht auch ein manueller Abgleich einer einzelnen Id.

**Kein Backfill.** Die 3977 alten anonymen Zeilen werden nicht umgeschrieben. Wer alte und
neue Zahlen vergleicht, muss das mitdenken.

### B9. Opt-out: hört es wirklich auf?

```sql
SELECT event, count() AS n, max(timestamp) AS zuletzt
FROM events
WHERE distinct_id = '<appwrite-dokument-id>'
  AND timestamp > '<zeitpunkt-des-ausschaltens>'
GROUP BY event
```

**So sieht richtig aus:** zwischen A6.1 und A6.3 kommt **gar nichts** an, auch kein
`$screen` und kein `Application Opened`. Kommt dort etwas an, ist die Einwilligung eine
Behauptung, und das ist der einzige Punkt in dieser Liste, der ein rechtliches Problem
wäre und nicht nur ein Messfehler.

---

## Teil C: Wenn etwas fehlt

| Symptom | Wahrscheinliche Ursache |
| --- | --- |
| Gar keine Events | Dev-Build getestet, oder Opt-out ist an, oder `EXPO_PUBLIC_POSTHOG_KEY` fehlt im Build |
| Events da, aber `$app_version` ist 1.3.4 | Alter Build auf dem Gerät |
| `acquired_via` fehlt beim neuen Account | Die Warteschlange wartet auf `identify()`. Ist die Person in PostHog überhaupt identifiziert? |
| `acquired_via` beim Bestandsaccount auf `referral` gesprungen | Der `parked`-Guard greift nicht, das wäre eine Regression aus dem Review |
| `share_card_shared` genauso oft wie `opened` | Der Abbruch zählt mit |
| `week_result` immer `first_of_week` | Wochenschlüssel greift nicht |
| RevenueCat-Kunde weiterhin anonym | `logIn` ist nicht gelaufen. In den Gerätelogs nach "RevenueCat identity error" suchen |

---

## Teil D: Vor dem Store-Release, ausserhalb der App

Das hängt an diesem Repo und an den Konsolen, nicht am App-Code, und ist der eigentliche
Blocker.

- [ ] **Datenschutzerklärung auf breezer.now.** Abschnitt 7 sagt aktuell, die App nutze
      "keine Cookies oder andere Tracking-Technologien". Das wird falsch, sobald 1.3.5 bei
      echten Nutzern ist. Der fertige Ersatztext und vier weitere Abschnitte stehen im
      App-Repo in `docs/privacy-policy-changes.md`.
- [ ] **Sentry in die Prozessorliste.** Ist seit langem in der App und war nie genannt.
      Gleicher Durchgang, gleiche Datei.
- [ ] **App Store Connect, App Privacy.** Usage Data, Product Interaction und Other Usage
      Data, linked to the user, Zweck Analytics. Tracking-Frage mit Nein beantworten.
- [ ] **Play Console, Data safety.** App activity, App interactions, collected, linked to
      the user, Zweck Analytics, als optional markieren, weil es den Toggle gibt.
- [ ] **Datum der Datenschutzerklärung** hochziehen.
