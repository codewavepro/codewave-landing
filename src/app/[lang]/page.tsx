import { type Locale } from '@/config/i18n-config';
import type { Metadata } from 'next';
import { getDictionary } from '@/lib/dictionary';
import HomeClient from '@/app/[lang]/client/HomeClient';
import { generateMetadata as createMetadata } from '@/lib/metadata';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return createMetadata(lang as Locale, 'home');
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);
  
  return (
    <>
      <HomeClient dictionary={dictionary} lang={lang as Locale} />
    </>
  );
}
