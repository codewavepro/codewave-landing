import type { Metadata, Viewport } from 'next';
import type { Locale } from '@/config/i18n-config';

type OpenGraphType = 'website' | 'article' | 'book' | 'profile' | 'music.song' | 'music.album' | 'music.playlist' | 'music.radio_station' | 'video.movie' | 'video.episode' | 'video.tv_show' | 'video.other';
type TwitterCardType = 'summary' | 'summary_large_image' | 'app' | 'player';

interface PageMetadata {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  og?: {
    title?: string;
    description?: string;
    type?: OpenGraphType;
    url?: string;
    site_name?: string;
    locale?: string;
    image?: string;
    'image:width'?: string;
    'image:height'?: string;
    'image:alt'?: string;
  };
  twitter?: {
    card?: TwitterCardType;
    site?: string;
    creator?: string;
    title?: string;
    description?: string;
    image?: string;
    'image:alt'?: string;
  };
  additionalMeta?: Array<{
    name?: string;
    property?: string;
    content?: string;
    rel?: string;
    hreflang?: string;
    href?: string;
  }>;
}

async function getMetadata(locale: Locale, page: string): Promise<PageMetadata> {
  try {
    const metadata = await import(`@/config/metadata/${locale}.json`);
    return metadata[page] as PageMetadata;
  } catch (error) {
    console.error(`Failed to load metadata for locale ${locale} and page ${page}:`, error);
    throw new Error(`Failed to load metadata for locale ${locale} and page ${page}`);
  }
}

export async function generateMetadata(
  locale: Locale,
  page: string,
  path: string = ''
): Promise<Metadata> {
  const metadata = await getMetadata(locale, page);
  const currentPath = path.startsWith('/') ? path : `/${path}`;
  
  const metadataBase = new URL(`https://codewave.pro`);
  const canonicalUrl = metadata.canonical || `${locale}${currentPath}`;
  
  const generatedMetadata: Metadata = {
    metadataBase,
    title: {
      default: metadata.title,
      template: `%s | Codewave`,
    },
    description: metadata.description,
    keywords: metadata.keywords?.split(',').map(k => k.trim()).filter(Boolean).join(', '),
    alternates: {
      canonical: `/${canonicalUrl}`,
      languages: {
        en: '/en',
        ru: '/ru',
        'x-default': '/en',
      },
    },
    openGraph: {
      title: metadata.og?.title || metadata.title,
      description: metadata.og?.description || metadata.description,
      url: `/${locale}${currentPath}`,
      siteName: metadata.og?.site_name || 'Codewave',
      locale: metadata.og?.locale || locale,
      type: (metadata.og?.type as OpenGraphType) || 'website',
      images: metadata.og?.image ? [
        {
          url: metadata.og.image,
          width: metadata.og['image:width'] ? parseInt(metadata.og['image:width']) : 1200,
          height: metadata.og['image:height'] ? parseInt(metadata.og['image:height']) : 630,
          alt: metadata.og['image:alt'] || metadata.og.title || metadata.title,
        }
      ] : [],
    },
    twitter: metadata.twitter ? {
      card: (metadata.twitter.card as TwitterCardType) || 'summary_large_image',
      site: metadata.twitter.site,
      creator: metadata.twitter.creator,
      title: metadata.twitter.title || metadata.title,
      description: metadata.twitter.description || metadata.description,
      images: metadata.twitter.image ? [
        {
          url: metadata.twitter.image,
          alt: metadata.twitter['image:alt'] || metadata.twitter.title || metadata.title,
        }
      ] : [],
    } : undefined,
    other: {},
  };

  if (metadata.additionalMeta && metadata.additionalMeta.length > 0) {
    metadata.additionalMeta.forEach(meta => {
      if (meta.name && meta.content) {
        if (!generatedMetadata.other) generatedMetadata.other = {};
        generatedMetadata.other[meta.name] = meta.content;
      }
      
      if (meta.rel === 'alternate' && meta.hreflang && meta.href) {
        if (!generatedMetadata.alternates?.languages) {
          generatedMetadata.alternates = {
            ...generatedMetadata.alternates,
            languages: {}
          };
        }
        (generatedMetadata.alternates.languages as any)[meta.hreflang] = meta.href;
      }
    });
  }

  return generatedMetadata;
}