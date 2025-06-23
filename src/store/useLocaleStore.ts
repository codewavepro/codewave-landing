'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Locale } from '@/config/i18n-config';
import { defaultLocale } from '@/config/i18n-config';

interface UseLocaleStore {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLocaleStore = create<UseLocaleStore>()(
  persist(
    (set) => ({
      locale: defaultLocale,
      setLocale: (locale: Locale) => set({ locale }),
    }),
    {
      name: 'locale-storage',
    }
  )
);
