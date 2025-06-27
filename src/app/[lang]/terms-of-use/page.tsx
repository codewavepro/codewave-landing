import { type Metadata } from 'next';
import { type Locale } from '@/config/i18n-config';
import { getDictionary } from '@/lib/dictionary';
import TermsOfUseClient from './client/TermsOfUseClient';
import { generateMetadata as createMetadata } from '@/lib/metadata';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang as Locale;
  return createMetadata(locale, 'termsOfUse');
}

export default async function TermsOfUsePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dictionary = await getDictionary(locale);

  return <TermsOfUseClient dictionary={dictionary} lang={locale} />;
}
