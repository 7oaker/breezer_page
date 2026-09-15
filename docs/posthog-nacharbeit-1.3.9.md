# PostHog-Nacharbeit zu 1.3.9: Squads und die Quit-Journey

Angelegt am 15.09.2026, **vor** dem Release, anders als bei 1.3.6 und 1.3.7. Der Grund ist,
dass diesmal zwei ganze Features auf einmal in den Store gehen und ihre erste Woche sonst
blind laufen wuerde. Was hier als offen steht, ist nach dem Release nachzuhalten.

Wie bei den Vorgaengern gilt die Arbeitsteilung: der Testplan prueft, ob die App das Richtige
sendet, diese Liste sorgt dafuer, dass die Kacheln das Richtige daraus machen.

Zwei grosse Features, **zwei neue Events**. Das ist Absicht, die Begruendung steht in
`react_Breezer/docs/analytics-events.md`, Abschnitte "Squads" und "The quitting journey".

---

## Was neu ankommt

| Was | Wert |
|---|---|
| Neues Event | `journey_viewed`, Properties `has_pro`, `locked_count`, `open_ahead`, `days_bucket` |
| Neues Event | `milestone_notification_opened`, Property `day` |
| Erstmals ueberhaupt | `squad_join_attempt` und `squad_left` (seit 1.3.8 im Code, nie released, deshalb null Zeilen) |
| Neue Property bei `squad_left` | `source`: `squad_tab` oder `settings` |
| Neue Person-Property | `push_permission`: `granted`, `denied`, `undetermined` |
| Neue Werte bei `paywall_shown` / `paywall_result` | `source: 'journey'`, `source: 'squad_create'` |
| Neue Werte bei `$screen` | `(tabs)/journey`, `squad/[id]` |
| Neuer `kind` bei `referral_shared` | `squad_invite` |

## 1. Das Breakdown-Limit, diesmal vorher gezaehlt

Die Lehre aus 1.3.7 war, dass ein Breakdown-Limit neue Werte genauso still verschweigt wie
eine feste Aufzaehlung, nur ohne dass irgendwo eine Liste steht, in der man das Fehlen sehen
koennte. Also vor dem Release gezaehlt statt hinterher:

| Achse | Distinkt am 15.09.2026 | Limit der Kachel | Erwartung nach 1.3.9 |
|---|---|---|---|
| `paywall_shown.source` | 18 | 25 | rund 21 |
| `$screen` | 28 | 40 | rund 30 |

**Beide halten, es ist nichts zu tun.** Die Paywall-Achse hat danach noch rund vier Plaetze
Luft, das ist die duennste Stelle und gehoert beim naechsten Feature erneut gezaehlt, nicht
geschaetzt.

## 2. Zwei Fallen beim Bauen der Kacheln

Beide stehen auch in den Event-Beschreibungen in PostHog, also dort, wo jemand steht, der die
Kachel baut. Das Doc hier ist die Begruendung, die Beschreibung dort die Warnung am Werkzeug.

**`journey_viewed` ist ein Nenner, keine Reichweite.** Der Zweck des Events ist nicht "wie
viele oeffnen die Journey", das steht schon als `$screen`. Der Zweck ist `locked_count`:
`paywall_shown` mit `source: journey` zaehlt die Tipps auf ein Schloss, und diese Zahl allein
ist nicht lesbar. Niedrig heisst entweder, dass das Gate nicht verkauft, oder dass kaum
jemand je ein Schloss sieht, und das verlangt entgegengesetzte Arbeit. Eine Kachel, die
`journey_viewed` als Nutzungszahl beschriftet, wirft den einzigen Grund weg, aus dem es
existiert.

**`milestone_notification_opened` ohne `push_permission` ist unlesbar.** Das Planen der
Erinnerungen prueft die Berechtigung und steigt still aus, wenn sie fehlt, mit Absicht, damit
das Speichern eines Quit-Datums nie in eine Systemabfrage laeuft. Eine Null bei den Taps
heisst deshalb meistens nicht "niemand tippt", sondern "niemand darf benachrichtigt werden".
Jede Kachel dazu braucht die Person-Property als Filter oder als zweite Reihe.

## 3. Was bewusst nicht kommt

Damit niemand danach sucht:

- **Squad angelegt, umbenannt, Avatar, Mitglied entfernt, uebergeben, aufgeloest.** Alles Zeilen oder Spalten in der Collection `squads`. Ein Funnel "Paywall gesehen zu Squad angelegt" ist deshalb nicht rein in PostHog baubar, der zweite Schritt muss aus Appwrite kommen, genau wie bei der Verlosung.
- **Knoten-Taps, Scrolltiefe und Pull-to-refresh auf dem Pfad.** Bewegung, keine Entscheidung. Das Ziel eines Taps steht ohnehin als `$screen`.
- **Erreichte eigene Ziele.** Der einzige echte Verzicht statt einer Dopplung: das Ziel liegt nur auf dem Geraet, es gibt also wirklich keine zweite Quelle. Es braeuchte eine persistierte Hochwassermarke in AsyncStorage, weil der Pfad bei jedem Render neu gerechnet wird und das Event sonst wiederholt feuert. Zurueckgestellt, nicht vergessen.
- **Ein Event beim Planen der Erinnerungen.** Wuerde bei jedem Kaltstart feuern. Reines Rauschen, und die Frage dahinter beantwortet `push_permission` billiger.

## 4. Offen nach dem Release

Der Teil, der erst mit Daten geht:

- [ ] Ankunft aller sechs neuen Werte pruefen (die zwei Events, die zwei `paywall_shown.source`, die zwei `$screen`), wie am 06.09.2026 bei `lottery_viewed`.
- [ ] Danach `journey_viewed`, `milestone_notification_opened`, `squad_left` und `squad_join_attempt` auf **verified** setzen. Die Beschreibungen stehen schon, die Definitionen wurden am 15.09.2026 vor dem ersten Event angelegt.
- [ ] `paywall_shown.source` erneut zaehlen und gegen das Limit 25 halten.
- [ ] Erste Kachel, sobald genug Zeilen da sind: `locked_count` gegen die Konversion von `source: journey`. Das ist die Frage, wegen der die Sperre in 1.3.9 ueberhaupt auf Listenindex umgestellt wurde.
- [ ] Anteil `push_permission: denied` unter den Quittern ansehen. Ist er hoch, ist die ganze Meilenstein-Mechanik fuer diese Gruppe wirkungslos, und das waere ein Produktthema und kein Messthema.

## Was in PostHog geaendert wurde

Am 15.09.2026, vor dem Release:

- `journey_viewed`: Definition vor dem ersten Event angelegt, Beschreibung geschrieben, Tags `monetization`, `quitting`. Noch nicht verified.
- `milestone_notification_opened`: dito, Tags `retention`, `quitting`.
- `squad_left` und `squad_join_attempt`: dito, Tags `social` plus `retention` beziehungsweise `acquisition`. Beide tragen ihre Zaehlfalle in der Beschreibung.
- `paywall_shown`: Beschreibung aktualisiert, **Vollersetzung**, weil die API die bestehende Beschreibung nur ueberschreiben und nicht lesen kann. Die `source`-Aufzaehlung dort kannte weder `journey` und `squad_create` noch die schon laenger live laufenden `custom_achievement` und `friends_ranking_period`. Neu aufgebaut aus `react_Breezer/docs/analytics-events.md`, dazu die Zaehlung des Breakdown-Limits.

Keine Kachel angefasst, siehe Abschnitt 1.
