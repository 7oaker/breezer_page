/**
 * Homepage FAQ. Rendered as visible <details> AND emitted as FAQPage schema
 * from the same array — Google requires schema FAQ content to be visible on
 * the page, and keeping one source makes that structurally guaranteed.
 */

export interface QA {
  q: string;
  a: string;
}

import type { Locale } from './locales';

export const homeFaq: Record<Locale, QA[]> = {
  en: [
  { q: "What is Breezer?", a: "Breezer is a free social snus app for iOS and Android. It lets you track snus consumption, compete with friends on global leaderboards, earn rewards, and quit snus with a guided Quit Mode." },
    { q: "What is the best snus tracker app?", a: "Breezer is the leading snus tracker app. It logs each pouch with one tap and shows daily, weekly, and monthly consumption statistics, spending totals, and habit charts \u2013 all for free on iOS and Android." },
    { q: "Is there a social snus app?", a: "Yes. Breezer is the first social snus app. You can add friends, see each other's rankings on a global leaderboard, and challenge each other \u2013 turning snus tracking into a shared, competitive experience." },
    { q: "Can Breezer help me quit snus?", a: "Yes. Breezer's Quit Mode tracks your withdrawal symptoms, counts days snus-free, calculates money saved, and celebrates health milestones. Streaks and achievements keep you motivated throughout the journey." },
    { q: "Is Breezer free?", a: "Yes, Breezer is free to download on iOS and Android. Optional Breezer Pro features are available as an in-app subscription." },
    { q: "What platforms is Breezer available on?", a: "Breezer is available on iPhone (iOS) via the App Store and on Android via Google Play. It is free to download in both stores." },
    { q: "How does Breezer track snus consumption?", a: "You log each snus pouch with a single tap in the Breezer app. The app then generates detailed statistics showing your daily, weekly, and monthly consumption patterns, money spent, and progress over time in visual charts." },
  ],
  de: [
  { q: "Was ist Breezer?", a: "Breezer ist eine kostenlose soziale Snus App f\u00fcr iOS und Android. Du kannst deinen Snus-Konsum tracken, mit Freunden auf globalen Ranglisten antreten, Rewards sammeln und mit dem Quit-Modus Schritt f\u00fcr Schritt aufh\u00f6ren." },
    { q: "Was ist die beste Snus Tracker App?", a: "Breezer ist die f\u00fchrende Snus Tracker App. Du loggst jeden Beutel mit einem Tap und siehst t\u00e4gliche, w\u00f6chentliche und monatliche Statistiken, Ausgaben und Konsum-Trends \u2013 kostenlos f\u00fcr iOS und Android." },
    { q: "Gibt es eine soziale Snus App?", a: "Ja. Breezer ist die erste soziale Snus App. Du kannst Freunde hinzuf\u00fcgen, eure Rankings auf einer globalen Rangliste vergleichen und euch gegenseitig herausfordern \u2013 so wird Snus-Tracking zum gemeinsamen Erlebnis." },
    { q: "Kann Breezer beim Snus aufh\u00f6ren helfen?", a: "Ja. Der Quit-Modus von Breezer trackt Entzugssymptome, z\u00e4hlt snusfreie Tage, berechnet gespartes Geld und feiert Gesundheitsmeilensteine. Streaks und Erfolge halten dich auf dem Weg motiviert." },
    { q: "Ist Breezer kostenlos?", a: "Ja, Breezer ist f\u00fcr iOS und Android kostenlos. Optionale Breezer-Pro-Funktionen gibt es als In-App-Abo." },
    { q: "Auf welchen Plattformen ist Breezer verf\u00fcgbar?", a: "Breezer gibt es f\u00fcr iPhone (iOS) im App Store und f\u00fcr Android bei Google Play. Der Download ist in beiden Stores kostenlos." },
    { q: "Wie trackt Breezer den Snus-Konsum?", a: "Du loggst jeden Snus mit einem einzigen Tap in der Breezer App. Die App erstellt daraus detaillierte Statistiken zu deinem t\u00e4glichen, w\u00f6chentlichen und monatlichen Konsum, deinen Ausgaben und deinem Fortschritt in visuellen Charts." },
  ],
  sv: [
    { q: "Vad är Breezer?", a: "Breezer är en gratis social snusapp för iOS och Android. Du trackar din snuskonsumtion, tävlar med vänner i globala topplistor, samlar belöningar och kan sluta snusa med ett guidat Quit-läge." },
    { q: "Vilken är den bästa appen för att tracka snus?", a: "Breezer loggar varje prilla med ett tryck och visar konsumtion per dag, vecka och månad, vad det kostar och hur vanan ser ut i diagram \u2013 gratis på iOS och Android." },
    { q: "Finns det en social snusapp?", a: "Ja. Breezer är den första sociala snusappen. Du lägger till vänner, ser varandras placeringar i en global topplista och kan utmana varandra, vilket gör snustracking till något gemensamt." },
    { q: "Kan Breezer hjälpa mig att sluta snusa?", a: "Quit-läget följer dina abstinensbesvär, räknar snusfria dagar, beräknar sparade pengar och firar hälsomilstolpar. Det ersätter dock ingen rådgivning, och rådgivning är den insats som har starkast stöd i forskningen. Sluta-röka-linjen på 020-84 00 00 är gratis och gäller även snus." },
    { q: "Hur länge varar abstinensen när man slutar snusa?", a: "Besvären brukar försvinna efter en till tre veckor enligt 1177, medan sug och ökad aptit kan sitta i längre. Ett enskilt sug varar 20 till 30 sekunder. Hela förloppet står i guiden Sluta snusa." },
    { q: "Är Breezer gratis?", a: "Ja, Breezer är gratis att ladda ned på iOS och Android. Breezer Pro är en frivillig prenumeration i appen." },
    { q: "Vilka plattformar finns Breezer på?", a: "Breezer finns till iPhone (iOS) i App Store och till Android på Google Play. Gratis att ladda ned i båda butikerna." },
    { q: "Hur trackar Breezer snuskonsumtionen?", a: "Du loggar varje prilla med ett enda tryck i appen. Breezer gör om det till detaljerad statistik över dag, vecka och månad, vad du lagt ut och hur utvecklingen ser ut över tid." },
  ],
};
