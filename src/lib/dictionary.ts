import type { Locale } from '@/config/i18n-config';

export type Dictionary = Record<string, any>;

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  return (await import(`@/config/dictionaries/${locale}.json`)).default;
};
