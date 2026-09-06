# PostHog-Nacharbeit zu 1.3.7: Merch-Verlosungen

Angelegt am 04.09.2026 als offene Liste, abgearbeitet und korrigiert am 06.09.2026. Wie bei
1.3.6 gilt: der Testplan prüft, ob die App das Richtige sendet, diese Liste sorgt dafür, dass
die Kacheln das Richtige daraus machen.

Die App schickt für das gesamte Verlosungs-Feature **ein einziges neues Event**. Das ist
Absicht und der Grund steht in `react_Breezer/docs/analytics-events.md`, Abschnitt
"Merch lotteries: did anyone see it?".

---

## Was neu ankommt

| Was | Wert |
|---|---|
| Neues Event | `lottery_viewed`, Properties `surface`, `pro_only`, `round` |
| Neuer Wert bei `paywall_shown` / `paywall_result` | `source: 'lottery_card'` |
| Neuer Wert bei `$screen` | `lottery/[id]` |

`surface` ist `home` (Kachel auf dem Startbildschirm, bei Trackern in der Drops-Karte, bei
Quittern eine eigene Karte), `drops` (der Drops-Screen) oder `detail` (die Vollbild-Ansicht).
`round` ist die `$id` der Promotion, damit sich Runden vergleichen lassen.

Alle drei am 06.09.2026 in PostHog nachgeprüft und angekommen. Es gab keinen
Instrumentierungsfehler.

## 1. Die Paywall-Kachel war still unvollständig, aber anders als vermutet

**Erledigt am 06.09.2026.**

Die Vermutung war ein festes `IN (...)` in der Kachel "Paywall: Conversion nach
Einstiegspunkt", in dem `lottery_card` fehlt. Das war falsch: die Kachel ist ein offener
Breakdown auf `source` und zählt gar nichts auf. Das Ergebnis war trotzdem genau das
befürchtete, nur über einen anderen Mechanismus.

Die Kachel stand auf `breakdown_limit: 10`, und es kommen inzwischen **17 verschiedene
`source`-Werte** an. `lottery_card` liegt in den letzten 30 Tagen auf Platz 15. Die Kachel
hat es also abgeschnitten, statt es als Null zu zeigen. Limit jetzt auf 25.

Die eigentliche Lehre ist allgemeiner als der Anlass, und deshalb steht sie hier: **ein
Breakdown-Limit ist dieselbe Falle wie eine feste Aufzählung.** Es verschweigt neue Werte
genauso, nur ohne dass irgendwo eine Liste steht, in der man das Fehlen sehen könnte. Jedes
neue Gate rutscht in beiden Fällen unter den Tisch, und ein neues Gate liegt naturgemäß
immer am unteren Ende.

Dieselbe Sache eine Etage subtiler bei "Welche Screens werden benutzt": `breakdown_limit: 25`
bei exakt 25 verschiedenen Screens. `lottery/[id]` passte gerade noch hinein, der neue
Subscription-Screen aus 1.3.8 hätte es hinausgekippt. Limit jetzt auf 40.

## 2. Reichweiten-Kacheln: bewusst zurückgestellt

Der Zweck des Events ist die Reichweite pro Runde, und dafür waren drei Kacheln vorgesehen:
aufgeschlüsselt nach `round`, nach `surface` und nach `pro_only`.

**Nicht gebaut, Stand 06.09.2026.** Es gibt genau eine Runde, und bei dieser Größenordnung
zeigt jede der drei Kacheln dieselbe einzelne Zahl. `round` hat nichts zu vergleichen,
`pro_only` hat nur einen Wert, und `surface` ist die einzige Aufschlüsselung, die überhaupt
etwas aussagt. Der richtige Zeitpunkt ist nach der zweiten Runde, wenn `round` eine Achse
wird statt einer Konstante.

Bis dahin ist die Zahl in zwei Abfragen wiederholbar, einer in PostHog und einer in Appwrite,
siehe den Abschnitt zur ersten Runde unten.

## 3. Zwei Fallen beim Bauen der Kacheln

Beide stehen seit 06.09.2026 auch in der Event-Beschreibung von `lottery_viewed` in PostHog,
also dort, wo jemand steht, der die Kachel baut. Das Doc hier ist die Begründung, die
Beschreibung dort ist die Warnung am Werkzeug.

**`lottery_viewed` ist Reichweite, keine Impressions.** Das Event feuert höchstens einmal
pro Runde, Fläche und App-Start. Die Sperre ist ein Set im JS-Kontext, das mit ihm
verschwindet, praktisch also **ungefähr einmal pro Nutzer und Tag**. Eine Kachel, die das als
"wie oft wurde die Kachel angezeigt" beschriftet, sagt etwas Falsches. Ohne die Sperre wäre
die Zahl allerdings unbrauchbar: der Startbildschirm wird bei jeder Rücknavigation neu
gemountet.

**Gezählt werden nur Runden, bei denen man etwas tun kann.** Laufend, schon teilgenommen,
oder hinter Pro. Eine Runde, die noch nicht gestartet ist, gerade gezogen wird oder schon
einen Gewinner hat, zählt nicht mit. Sonst landen Leute, die nur das Ergebnis nachlesen, in
derselben Conversion-Basis.

## 4. Was bewusst nicht kommt

Damit niemand danach sucht: **die Teilnahme selbst ist kein Event.** Sie ist eine Zeile in
der Appwrite-Collection `lotteryEntries` und wird dort gezählt. Eine reine
PostHog-Funnel-Kachel "gesehen zu teilgenommen" ist deshalb nicht baubar, der zweite Schritt
muss aus Appwrite kommen.

Falls sich das als zu unbequem herausstellt, ist der nächste Schritt ein `lottery_entered`
mit `surface` und `pro_only`. Bewusst zurückgestellt, weil es Daten dupliziert, die schon in
der Datenbank stehen. Der einzige echte Zugewinn wäre, Teilnehmer als PostHog-Kohorte gegen
Retention und Pro-Käufe zu halten.

Ebenfalls nicht getrackt: Aufrufe des Regeln-Screens, Taps auf den
Teilnahmebedingungen-Link, fehlgeschlagene Produktbilder.

---

## Die erste Runde, Stand 06.09.2026

Runde `6a9ab62b003733be4990`, "Win a Breezer Shirt", Pro-only, 04.09. bis 15.10.2026. Beide
Hälften zusammengesetzt, weil die eine ohne die andere nichts aussagt:

| | |
|---|---|
| `lottery_viewed`, `surface: home` | 20 Personen, 40 Events |
| `lottery_viewed`, `surface: drops` | 2 Personen |
| `lottery_viewed`, `surface: detail` | 2 Personen |
| `$screen` = `lottery/[id]` | 3 Personen, 8 Aufrufe |
| `paywall_shown`, `source: lottery_card` | 1 Person, 0 Käufe |
| Zeilen in `lotteryEntries` | 2, davon eine `7oaker` |

Zahlen ungefiltert erhoben, das eigene Konto ist also enthalten. Die Kacheln im Board
filtern Testkonten heraus und stehen deshalb niedriger.

Was das sagt: die Startbildschirm-Kachel trägt, der Weg dahinter nicht. 20 Personen sehen
sie, 2 kommen im Drops-Screen an, eine trifft die Paywall, eine echte Teilnahme. Das ist
keine Reichweitenfrage, sondern eine Konversionsfrage, und die erste Runde als Pro-only
anzusetzen macht die Basis so klein, dass sie nichts beweisen kann. Für die zweite Runde ist
das das Argument für offen statt Pro-only: nicht weil offen mehr verkauft, sondern weil
sonst nie genug Leute durchlaufen, um überhaupt zu sehen, ob sie es täte.

Eine Ungereimtheit zum Nachhalten: `surface: detail` zählt 2 Personen, der Screen
`lottery/[id]` aber 3. Erwartbar, weil das Event nur bei bespielbaren Runden feuert und der
Screen immer, aber bei einer einzigen laufenden Runde ist die Lücke einen zweiten Blick
wert, sobald mehr Daten da sind.

## Was in PostHog geändert wurde

Am 06.09.2026, alles im Board "App: Produkt & Funnel":

- "Paywall: Conversion nach Einstiegspunkt": `breakdown_limit` 10 auf 25.
- "Welche Screens werden benutzt": `breakdown_limit` 25 auf 40.
- `lottery_viewed`: Beschreibung geschrieben, auf verified gesetzt, Tag `monetization`.
- `paywall_shown`: Beschreibung aktualisiert. Die `source`-Aufzählung dort war auf dem Stand
  vor 1.3.7 und kannte weder `lottery_card` noch `subscription_page` noch `game_theme_store`.
  **Vollersetzung**, weil die API die bestehende Beschreibung nur überschreiben und nicht
  lesen kann. Neu aufgebaut aus `react_Breezer/docs/analytics-events.md`.
