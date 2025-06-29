import { type Locale } from '@/config/i18n-config';
import { Metadata } from 'next';
import { getDictionary } from '@/lib/dictionary';
import HomeClient from '@/app/[lang]/client/HomeClient';
import { generateMetadata as createMetadata } from '@/lib/metadata';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang as Locale;
  return createMetadata(locale, 'home');
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dictionary = await getDictionary(locale);

  return <HomeClient dictionary={dictionary} lang={locale} />;
}