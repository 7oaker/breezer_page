import { appText, type AppText } from './appScreens';

/**
 * The words in the homepage's phones: the app's own (appScreens.ts, generated
 * from react_Breezer's locales), except where the website has always said it
 * differently. Those few are kept here so the homepage does not change when the
 * app's wording does; the store images use appText() and follow the app.
 */
const KEEP: Partial<Record<string, Partial<AppText>>> = {
  en: { app_quit_journey_nicotine_free: 'Nicotine free' },
};

export function siteText(lang: string): AppText {
  return { ...appText(lang), ...KEEP[lang] } as AppText;
}
