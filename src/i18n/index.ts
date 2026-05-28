import { en } from './en';
import { ru } from './ru';

export type Locale = 'en' | 'ru';

/** Shape derived from English; ru.ts must satisfy it. */
export type Strings = typeof en;

const tables: Record<Locale, Strings> = { en, ru };

export function getStrings(locale: Locale): Strings {
  return tables[locale];
}

/** Landing URL for a locale (used by the language switcher). */
export function localeHref(locale: Locale): string {
  return locale === 'en' ? '/' : '/ru/';
}
