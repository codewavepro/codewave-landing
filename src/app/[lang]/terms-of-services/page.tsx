import {Metadata} from "next";
import { type Locale } from '@/config/i18n-config';
import { getDictionary } from '@/lib/dictionary';
import TermsOfServicesClient from '@/app/[lang]/terms-of-services/client/TermsOfServicesClient'
import { generateMetadata as createMetadata } from '@/lib/metadata';


export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = params.lang as Locale;
  return createMetadata(locale, 'termsOfServices');
}

export default async function TermsOfServicesPage({ params }: { params: { lang: string } }) {
  const locale = params.lang as Locale;
  const dictionary = await getDictionary(locale);

  return <TermsOfServicesClient dictionary={dictionary} lang={locale} />;
}