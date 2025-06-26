import {Metadata} from "next";
import { type Locale } from '@/config/i18n-config';
import { getDictionary } from '@/lib/dictionary';
import PrivacyPolicyClient from "@/app/[lang]/privacy-policy/client/PrivacyPolicyClient";
import { generateMetadata as createMetadata } from '@/lib/metadata';


export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = params.lang as Locale;
  return createMetadata(locale, 'privacyPolicy');
}

export default async function PrivacyPolicyPage({ params }: { params: { lang: string } }) {
  const locale = params.lang as Locale;
  const dictionary = await getDictionary(locale);

  return <PrivacyPolicyClient dictionary={dictionary} lang={locale} />;
}