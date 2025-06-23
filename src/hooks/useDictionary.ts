'use client';

import {useEffect, useState} from 'react';
import {useLocaleStore} from '@/store/useLocaleStore';
import {getDictionary} from '@/lib/dictionary';
import {type Locale, locales} from '@/config/i18n-config';

type DictionaryCache = {
  [key in Locale]?: any;
};

const dictionaryCache: DictionaryCache = {};

export const useDictionary = () => {
  const { locale } = useLocaleStore();
  const [dictionary, setDictionary] = useState<any>(dictionaryCache[locale as Locale] || null);
  const [loading, setLoading] = useState(!dictionaryCache[locale as Locale]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadCurrentDictionary = async () => {
      if (dictionaryCache[locale as Locale]) {
        setDictionary(dictionaryCache[locale as Locale]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const dict = await getDictionary(locale as Locale);
        dictionaryCache[locale as Locale] = dict;
        setDictionary(dict);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load dictionary'));
      } finally {
        setLoading(false);
      }
    };

    void loadCurrentDictionary();
  }, [locale]);

  useEffect(() => {
    const preloadOtherDictionaries = async () => {
      for (const loc of locales) {
        if (loc !== locale && !dictionaryCache[loc]) {
          try {
            dictionaryCache[loc] = await getDictionary(loc);
          } catch (error) {
            console.error(`Failed to preload dictionary for ${loc}:`, error);
          }
        }
      }
    };

    if (dictionary && !loading) {
      void preloadOtherDictionaries();
    }
  }, [dictionary, loading, locale]);

  return { dictionary, loading, error };
};

export default useDictionary;
