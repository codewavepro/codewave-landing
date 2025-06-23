'use client';

import { useEffect } from 'react';
import { useLocaleStore } from '@/store/useLocaleStore';
import { locales, defaultLocale, type Locale } from '@/config/i18n-config';
import { usePathname, useRouter } from 'next/navigation';

export const useInitLocale = () => {
  const { locale, setLocale } = useLocaleStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (locale) return;

    const pathSegments = pathname?.split('/') || [];
    const langFromUrl = pathSegments[1] as Locale | undefined;

    if (langFromUrl && locales.includes(langFromUrl)) {
      setLocale(langFromUrl);
      return;
    }

    const browserLang = navigator.language.split('-')[0] as Locale;
    const detectedLocale = locales.includes(browserLang) ? browserLang : defaultLocale;

    setLocale(detectedLocale);

    if (!langFromUrl && pathname) {
      const newPath = `/${detectedLocale}${pathname === '/' ? '' : pathname}`;
      router.replace(newPath);
    }
  }, [locale, pathname, router, setLocale]);

  return { locale };
};
