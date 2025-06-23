import type { Metadata } from 'next';
import type { Locale } from '@/config/i18n-config';

interface PageMetadata {
  title: string;
  description: string;
}

async function getMetadata(locale: Locale, page: string): Promise<PageMetadata> {
  try {
    const metadata = await import(`@/config/metadata/${locale}.json`);
    return metadata[page] as PageMetadata;
  } catch (error) {
    throw new Error(`Failed to load metadata for locale ${locale} and page ${page}`);
  }
}

export async function generateMetadata(
  locale: Locale,
  page: string,
  path?: string
): Promise<Metadata> {
  const metadata = await getMetadata(locale, page);
  const currentPath = path || '';
  
  return {
    title: {
      default: metadata.title,
      template: `%s | Codewave`,
    },
    description: metadata.description,
    alternates: {
      canonical: `/${locale}${currentPath}`,
      languages: {
        en: `/en${currentPath}`,
        ru: `/ru${currentPath}`,
      },
    },
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      url: `/${locale}${currentPath}`,
      locale,
      alternateLocale: locale === 'en' ? 'ru' : 'en',
    },
  };
}
