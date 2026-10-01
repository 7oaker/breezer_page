# PostHog-Nacharbeit zu 1.3.8: Craving-Flow, Blog-Tab und die geteilten Paywalls

Angelegt und abgearbeitet am 01.10.2026, also knapp drei Wochen **nach** dem Release vom
12.09.2026. 1.3.8 ist die Version, die zwischen 1.3.7 und 1.3.9 keine eigene Liste bekommen
hat. Der Vorteil davon: diesmal steht nichts als Vermutung hier, alles ist gegen echte Zeilen
geprueft.

Wie bei den Vorgaengern gilt die Arbeitsteilung: der Testplan prueft, ob die App das Richtige
sendet, diese Liste sorgt dafuer, dass die Kacheln das Richtige daraus machen.

Drei Features, **acht neue Events und eine neue Property**. Die Begruendung steht in
`react_Breezer/docs/analytics-events.md`, Abschnitte "Craving flow", "Blog" und
"Monetization" (`variant`).

---

## Was neu ankommt

| Was | Wert |
|---|---|
| Neue Events, Craving-Flow | `urge_started`, `urge_tool_selected`, `urge_completed`, `slip_logged` |
| Neue Events, eigene Ziele | `custom_achievement_created`, `custom_achievement_limit_hit` |
| Neue Events, Info-Tab | `blog_opened`, `blog_article_viewed` |
| Neue Property bei `paywall_shown` / `paywall_result` | `variant`: `track`, `quit`, `general` |
| Neuer Wert bei `paywall_shown.source` | `game_theme_store` (davor landete der Theme-Store in `unknown`) |
| Neue Werte bei `$screen` | `(tabs)/urge`, `(tabs)/slip`, `(tabs)/custom-achievement` |

Alle acht Events am 01.10.2026 in PostHog nachgeprueft, erste Zeilen am 12. und 13.09.2026.
Es gab keinen Instrumentierungsfehler, aber eine Luecke in der Doku, siehe Abschnitt 3.

## 1. Das Breakdown-Limit, nachgezaehlt

| Achse | Distinkt am 01.10.2026 (30 Tage) | Limit der Kachel |
|---|---|---|
| `paywall_shown.source` | 19 | 25 |
| `$screen` | 30 | 40 |

**Beide halten, es ist nichts zu tun.** 1.3.9 hatte fuer die Paywall-Achse rund 21 erwartet,
gemessen sind 19, weil `squad_create` und `journey` erst langsam ankommen. Die Achse bleibt die
duennste Stelle.

## 2. Vier Fallen beim Bauen der Kacheln

Alle vier stehen seit 01.10.2026 auch in den Event-Beschreibungen in PostHog. Das Doc hier ist
die Begruendung, die Beschreibung dort die Warnung am Werkzeug.

**PostHog ist fuer Urges, Slips und Ziele die einzige Quelle.** Das ist die eine Stelle, an
der die Grundregel "was in Appwrite steht, kommt nicht nach PostHog" nicht greift, weil nichts
davon in Appwrite steht. `lib/quitJournal.js` und `lib/customAchievements.js` halten alles in
AsyncStorage auf dem Geraet, mit Absicht. Eine Kachel, die hier falsch zaehlt, laesst sich also
nirgendwo gegenpruefen.

**Slips sind auf zwei Events verteilt.** `slip_logged` feuert nur aus dem Slip-Screen. Ein
Craving, das mit `outcome: used` endet, legt auf dem Geraet ebenfalls einen Slip an, sendet aber
nur `urge_completed`. Alle Slips sind deshalb `slip_logged` plus `urge_completed` mit
`outcome: used`. `from_urge` auf `slip_logged` ist in der Praxis immer `false`.

**`urge_tool_selected` kann pro Flow mehrfach feuern.** Zurueck aus der Uebung fuehrt auf die
Werkzeugliste, wer umentscheidet, waehlt zweimal. 38 Auswahlen auf 26 Abschluesse sind zum Teil
genau das. Fuer "welches Werkzeug" Personen zaehlen oder das `tool` aus `urge_completed`
nehmen.

**`blog_article_viewed` zaehlt auch das Laden des Tabs.** Die WebView navigiert beim Oeffnen
auf `/blog` oder `/de/blog`, und das Event feuert dafuer genauso wie fuer einen Artikel, dazu
fuer Nicht-Blog-Seiten wie `/de/vs-snusless`. Bis 01.10.2026 waren das **40 von 49 Events**.
Eine Kachel "Artikel gelesen" ohne Pfadfilter misst fast nur, dass der Tab aufging. Der Filter
in der Kachel ist `match(path, '^(/[a-z]{2})?/blog/.+')`.

Dazu die Falle bei `variant`, die schon in analytics-events.md steht und jetzt auch in den
Beschreibungen von `paywall_shown` und `paywall_result`: `variant` ist das **angefragte**
Offering, nicht das von RevenueCat gelieferte. Fehlt eines im Dashboard, oeffnet still die
allgemeine Paywall unter `track`- oder `quit`-Label.

## 3. Doku-Drift: `game` als Werkzeug

`urge_tool_selected.tool` und `urge_completed.tool` liefern vier Werte: `breathing`, `delay`,
`surfing` und **`game`**, das Spiel im Craving-Flow aus `8441e61`. analytics-events.md nennt
nur die ersten drei. Das ist dieselbe Art Luecke wie die `source`-Liste vor 1.3.7: eine Kachel
wird aus der Liste gebaut, und was dort fehlt, vergleicht niemand.

In PostHog steht `game` seit 01.10.2026 in beiden Beschreibungen. **In analytics-events.md
offen**, siehe Abschnitt 6, das gehoert ins App-Repo und nicht in diesen Commit.

## 4. Bewusst nicht gebaut

- **Eine Kachel nach `variant`.** Seit dem Release kamen nur `track` und `quit`, `general` kein
  einziges Mal, und `variant` weicht genau einmal von `mode` ab (der Umschalter auf dem
  Subscription-Screen, wie vorgesehen). Eine Aufschluesselung nach `variant` zeigt heute
  dasselbe wie die nach `mode`. Sinnvoll erst, wenn der Subscription-Screen nennenswert
  benutzt wird.
- **Eine Kachel zu eigenen Zielen.** Vier `custom_achievement_created` in drei Wochen, ein
  einziges `custom_achievement_limit_hit`, `type: packs` noch nie. Bei der Groesse zeigt jede
  Kachel eine Konstante. Die Nachfrage nach dem zweiten Ziel steht ohnehin als
  `paywall_shown` mit `source: custom_achievement` in der bestehenden Paywall-Kachel.
- **Eine Slip-Kachel.** `slip_logged` ist eine Ereigniszahl ohne Gegenueber: es gibt keinen
  Nenner, gegen den "viele Slips" gut oder schlecht waere. Wertvoll wird es erst gegen
  `quit_started` und die Quit-Dauer, und das ist eine Frage fuer ein Notebook, nicht fuer eine
  Kachel.

## 5. Die ersten drei Wochen, Stand 01.10.2026

Ungefiltert erhoben, das eigene Konto ist also enthalten. Die Kacheln filtern Testkonten heraus
und stehen deshalb niedriger.

| Event | Events | Personen |
|---|---|---|
| `urge_started` | 40 | 22 |
| `urge_tool_selected` | 38 | 18 |
| `urge_completed` | 26 | 14 |
| `slip_logged` | 54 | 21 |
| `custom_achievement_created` | 4 | 4 |
| `custom_achievement_limit_hit` | 1 | 1 |
| `blog_opened` | 41 | 22 |
| `blog_article_viewed` | 49 | 19 |

**Craving-Flow, ohne Testkonten:** 27 Personen oeffnen den Screen, 21 beantworten die
Intensitaet, 17 waehlen ein Werkzeug, 13 schliessen ab. Der groesste Verlust liegt in der Uebung
selbst, zwischen Werkzeug und Abschluss. Wer dort abbricht, hinterlaesst kein `delta`, die
Wirksamkeitszahl steht also nur auf denen, die durchhalten.

| Werkzeug | Abgeschlossen | Median `delta` | Widerstanden |
|---|---|---|---|
| `game` | 7 | 1 | 86 % |
| `delay` | 7 | 1 | 100 % |
| `breathing` | 6 | 1 | 100 % |
| `surfing` | 3 | 0 | 100 % |

Was das sagt: noch wenig. Jedes Werkzeug senkt die Intensitaet im Median um einen Punkt, ausser
Urge Surfing, das bei drei Abschluessen bei null steht. Drei sind keine Aussage, aber es ist das
Werkzeug, auf das zu achten ist: bleibt es bei null, ist es nach der eigenen Regel aus
analytics-events.md Dekoration. Fast alle Abschluesse sind `resisted`, ein einziges `used`.
Das ist bei Selbstauskunft erwartbar und macht `delta` wichtiger als den Widerstands-Anteil.

**Info-Tab, ohne Testkonten:** 21 Personen oeffnen den Tab (17 ueber Health, 4 ueber den Feed),
**2 lesen einen Artikel**. Der Tab wird gefunden, aber kaum benutzt. Gelesen wurden nur die
Erektions- und die Nebenwirkungs-Artikel. Das ist ein Inhalts- oder Darstellungsthema, kein
Messthema: die Uebersicht im Tab bringt niemanden in einen Artikel.

**Paywall:** 480 `variant: track`, 91 `variant: quit` seit dem Release, eine Abweichung von
`mode`, kein `general`.

## 6. Offen

- [ ] `game` in `react_Breezer/docs/analytics-events.md` nachtragen (Tabelle "Craving flow",
  `urge_tool_selected` und `urge_completed`). Im App-Repo.
- [ ] `surfing` nach weiteren zehn Abschluessen erneut ansehen. Bleibt der Median bei null,
  ist das Werkzeug ein Kandidat zum Streichen.
- [ ] Info-Tab: eine Kachel "Artikel gelesen" sagt erst etwas, wenn die Uebersicht im Tab
  ueberhaupt in Artikel fuehrt. Erst das Produktthema, dann neu messen.
- [ ] `variant: general` beobachten. Kommt es nie, ist entweder der Subscription-Screen
  unbenutzt oder das allgemeine Offering wird nie angefragt, beides gut zu wissen.

## Was in PostHog geaendert wurde

Am 01.10.2026:

- `urge_started`, `urge_tool_selected`, `urge_completed`, `slip_logged`,
  `custom_achievement_created`, `custom_achievement_limit_hit`, `blog_opened`,
  `blog_article_viewed`: Beschreibung geschrieben, auf **verified** gesetzt. Tags `quitting` plus
  `retention` fuer Craving und Ziele (`monetization` statt `retention` bei
  `custom_achievement_limit_hit`), `content` plus `retention` fuer den Blog. Jede Zaehlfalle aus
  Abschnitt 2 steht in der Beschreibung des betroffenen Events.
- `paywall_shown` und `paywall_result`: Beschreibung um `variant` und seine Falle ergaenzt.
  **Vollersetzung**, weil die API die bestehende Beschreibung nur ueberschreiben und nicht lesen
  kann. Neu aufgebaut aus `react_Breezer/docs/analytics-events.md`, inklusive der vollstaendigen
  `source`-Liste und der Zaehlung aus Abschnitt 1.
- Drei neue Kacheln im Board "App: Produkt & Funnel", alle ohne Testkonten (Kohorte 210940):
  - "Craving: hilft das Werkzeug" (`axa4Uk90`): SQL-Tabelle, Median `delta` und
    Widerstands-Anteil je Werkzeug.
  - "Craving: wo der Flow abbricht" (`3MugF36d`): Funnel `$screen (tabs)/urge` bis
    `urge_completed`, Fenster eine Stunde.
  - "Info-Tab: geoeffnet gegen Artikel gelesen" (`ZSOAvNZB`): SQL-Tabelle je Flaeche, mit
    Pfadfilter gegen die Uebersichtsseiten.
- Annotation "App 1.3.8 live" am 12.09.2026, projektweit. Die Annotationen fuer 1.3.6, 1.3.7 und
  1.3.9 fehlen ebenfalls, sind aber nicht Teil dieser Liste.
